const authMiddleware = require('./middleware/auth.middleware')
const authNotMiddleware = require('./middleware/auth.not.middleware')
const corsMiddleware = require('./middleware/cors.middleware')
const corsAllMiddleware = require('./middleware/cors.all.middleware')
const tokenService = require('./service/token.service')
const libService = require('./service/lib.service')
const ApiException = require('./exception/api.exception')
const {body, validationResult} = require('express-validator');
const db = require('./database')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const geoip = require('geoip-lite')
const path = require('path')
const fs = require('fs')
module.exports = router => {
  /**
   * @swagger
   * /api:
   *   get:
   *       description: api is working
   *       responses:
   *           '200':
   *               description: all right
   * */
  router.options('/api', corsAllMiddleware)
  router.get(`/api`, [corsAllMiddleware], (req, res, next) => {
    try {
      res.json({data: `${geoip.lookup(req.ip).country}/${geoip.lookup(req.ip).city}`})
    } catch (e) {
      next(e)
    }
  })
  /**
   * @swagger
   * /api/user:
   *   post:
   *       description: Регистрация аккаунта
   *       parameters:
   *         - name: email
   *           required: true
   *           in: body
   *           type: string
   *         - name: password
   *           required: true
   *           in: body
   *           type: string
   *       responses:
   *           '200':
   *               description: возвращает access_token,refresh_token и user
   * */
  router.options('/api/user', corsAllMiddleware)
  router.post(`/api/user`, [corsAllMiddleware, authNotMiddleware, body('email').isEmail(), body('password').isLength({
    min: 6,
    max: 32
  })], async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) throw ApiException.BadRequest('Не корректные данные!', errors.array())
      const candidate = {
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 4),
        activation_link: uuid.v4(),
        location: await bcrypt.hash(`${geoip.lookup(req.ip)?.country}/${geoip.lookup(req.ip)?.city}`, 4)
      }
      if (await db.query(`SELECT * FROM "user" WHERE "email" = '${candidate.email}'`).then(result => result.rowCount) > 0) throw ApiException.BadRequest('Пользователь уже зарегистрирован!', [])
      const user = await db.query(`INSERT INTO "user" ("email","password","activation_link") VALUES ('${candidate.email}','${candidate.password}','${candidate.activation_link}') RETURNING *`).then(result => result.rows[0])
      delete user.password
      delete user.email
      delete user.activation_link
      delete user.created_at
      const deviceID = uuid.v4()
      const tokens = tokenService.generate({id: user.id, location: candidate.location, deviceID: deviceID})
      await tokenService.save(user.id, tokens.accessToken, tokens.refreshToken, deviceID, candidate.location)
      res.cookie('device_id', deviceID, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV ? process.env.NODE_ENV == "production" : false
      })
      res.cookie('refresh_token', tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV ? process.env.NODE_ENV == "production" : false
      })
      res.set('Authorization', `Bearer ${tokens.accessToken}`)
      res.json({access_token: tokens.accessToken, refresh_token: tokens.refreshToken, user})
    } catch (e) {
      next(e)
    }
  })
  /**
   * @swagger
   * /api/user/refresh:
   *   put:
   *       description: Обновление токенов
   *       parameters:
   *         - name: refresh_token
   *           required: true
   *           in: body
   *           type: string
   *         - name: access_token
   *           required: true
   *           in: body
   *           type: string
   *         - name: device_id
   *           in: cookies
   *           required: true
   *           type: string
   *       responses:
   *           '200':
   *               description: возвращает access_token,refresh_token и user
   * */
  router.put(`/api/user/refresh`, [corsAllMiddleware, authMiddleware], async (req, res, next) => {
    try {
      const accessToken = req.query.access_token || req.body.access_token || req.headers.authorization ? req.headers.authorization.split(' ')[1] : undefined
      const refreshToken = req.cookies.refresh_token
      if (!req.cookies.device_id || !refreshToken || !accessToken) {
        throw ApiException.BadRequest('Не корректные данные!')
      }
      let deviceID = req.cookies.device_id
      location = await bcrypt.hash(`${geoip.lookup(req.ip)?.country}/${geoip.lookup(req.ip)?.city}`, 4)
      if (!(await tokenService.validate(accessToken, refreshToken, deviceID, location))) throw ApiException.Unauthorized()
      let user = await db.query(`SELECT "U".* FROM "user" AS "U" INNER JOIN "token" AS "T" ON "U"."id" = "T"."id_user" WHERE "T"."access_token" = '${accessToken}' AND "T"."refresh_token" = '${refreshToken}'`).then(res => res.rows[0])
      delete user.password
      delete user.email
      delete user.activation_link
      delete user.created_at
      const tokens = tokenService.generate({id: user.id, location: location, deviceID: deviceID})
      await tokenService.save(user.id, tokens.accessToken, tokens.refreshToken, deviceID, location)
      res.cookie('device_id', deviceID, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV ? process.env.NODE_ENV == "production" : false
      })
      res.cookie('refresh_token', tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV ? process.env.NODE_ENV == "production" : false
      })
      res.set('Authorization', `Bearer ${tokens.accessToken}`)
      res.json({access_token: tokens.accessToken, refresh_token: tokens.refreshToken, user})
    } catch (e) {
      next(e)
    }
  })
  /**
   * @swagger
   * /api/user:
   *   delete:
   *       description: Выход из аккаунта
   *       parameters:
   *         - name: refresh_token
   *           in: cookies
   *           required: true
   *           type: string
   *       responses:
   *           '200':
   *               description: возвращает logout
   * */
  router.delete(`/api/user`, [corsAllMiddleware, authMiddleware], async (req, res, next) => {
    try {
      const {refreshToken} = req.cookies
      const token = await tokenService.logout(refreshToken)
      res.clearCookie('refresh_token')
      res.json(token)
    } catch (e) {
      next(e)
    }
  })
  /**
   * @swagger
   * /api/user:
   *   put:
   *       description: Вход в аккаунт
   *       parameters:
   *         - name: email
   *           required: true
   *           in: body
   *           type: string
   *         - name: password
   *           required: true
   *           in: body
   *           type: string
   *         - name: device_id
   *           in: cookies
   *           required: true
   *           type: string
   *       responses:
   *           '200':
   *               description: возвращает access_token,refresh_token и user
   * */
  router.put(`/api/user`, [corsAllMiddleware, authNotMiddleware, body('email').isEmail(), body('password').isLength({
    min: 6,
    max: 32
  })], async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) throw ApiException.BadRequest('Не корректные данные!', errors.array())
      const {email, password} = req.body
      const user = await db.query(`SELECT * FROM "user" WHERE "email" = '${email}'`).then(res => res.rows[0])
      if (!user) throw ApiException.BadRequest('Пользователь не найден!')
      const isPasswordEquals = await bcrypt.compare(password, user.password)
      if (!isPasswordEquals) throw ApiException.Unauthorized()
      user.location = await bcrypt.hash(`${geoip.lookup(req.ip)?.country}/${geoip.lookup(req.ip)?.city}`, 4)
      let deviceID = uuid.v4()
      if (req.cookies.device_id) {
        deviceID = req.cookies.device_id
      }
      delete user.password
      delete user.email
      delete user.activation_link
      delete user.created_at
      delete user.location
      const tokens = tokenService.generate({id: user.id, location: user.location, deviceID: deviceID})
      await tokenService.save(user.id, tokens.accessToken, tokens.refreshToken, deviceID, user.location)
      console.log(req.headers.origin)
      res.cookie('device_id', deviceID, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV ? process.env.NODE_ENV == "production" : false
      })
      res.cookie('refresh_token', tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV ? process.env.NODE_ENV == "production" : false
      })
      res.set('Authorization', `Bearer ${tokens.accessToken}`)
      res.json({access_token: tokens.accessToken, refresh_token: tokens.refreshToken, user})
    } catch (e) {
      next(e)
    }
  })
  /**
   * @swagger
   * /api/user:
   *   get:
   *       description: Данные о себе
   *       parameters:
   *         - name: access_token
   *           required: true
   *           in: headers
   *           type: string
   *         - name: refresh_token
   *           required: true
   *           in: cookies
   *           type: string
   *         - name: device_id
   *           in: cookies
   *           required: true
   *           type: string
   *       responses:
   *           '200':
   *               description: возвращает user
   * */
  router.get(`/api/user`, [corsAllMiddleware, authMiddleware], async (req, res, next) => {
    try {
      let access_token = req.query.access_token || req.body.access_token || req.headers.authorization ? req.headers.authorization.split(' ')[1] : undefined
      let refresh_token = req.query.refresh_token || req.body.refresh_token || req.cookies.refresh_token
      if (!access_token && !refresh_token) throw ApiException.Unauthorized()
      let user = await db.query(`SELECT "U".* FROM "user" AS "U" INNER JOIN "token" AS "T" ON "U"."id" = "T"."id_user" WHERE "T"."access_token" = '${access_token}' AND "T"."refresh_token" = '${refresh_token}'`).then(res => res.rows[0])
      delete user.password
      delete user.email
      delete user.activation_link
      delete user.created_at
      delete user.location
      res.json({user})
    } catch (e) {
      next(e)
    }
  })
  /**
   * @swagger
   * /api/user/device:
   *   get:
   *       description: Получение пользовательских девайсов
   *       parameters:
   *         - name: deviceId
   *           required: true
   *           type: string
   *       responses:
   *           '200':
   *               description: если установлен deviceID возвращает ok
   * */
  router.get('/api/user/device', [corsAllMiddleware, authMiddleware], async (req, res, next) => {
    try {
      let access_token = req.query.access_token || req.body.access_token || req.headers.authorization ? req.headers.authorization.split(' ')[1] : undefined
      let refresh_token = req.query.refresh_token || req.body.refresh_token || req.cookies.refresh_token
      if (!access_token && !refresh_token) throw ApiException.Unauthorized()
      let user = await db.query(`SELECT "U".* FROM "user" AS "U" INNER JOIN "token" AS "T" ON "U"."id" = "T"."id_user" WHERE "T"."access_token" = '${access_token}' AND "T"."refresh_token" = '${refresh_token}'`).then(res => res.rows[0])
      let devices = await db.query(`SELECT * FROM "user_device" AS "UD" INNER JOIN "device" AS "D" ON "UD"."device" = "D"."id"`).then(res => res.rows)
      let deviceTypes = await db.query(`SELECT * FROM "device_type"`).then(res => res.rows)
      for (let i = 0; i < devices.length; i++) {
        db.query(`SELECT * FROM "device_group" WHERE "device" = ${devices[i].id}`).then(res => {
          devices[i].group = res.rows.map(group=>group.title)
        })
      }
      devices.map(device => {
        delete (device.device)
        delete (device.user)
        // delete (device.key)
        device.device_type = deviceTypes.find(type => type.id == device.device_type)
      })
      setTimeout(()=>{
        res.json({
          devices: devices,
          device_type: deviceTypes
        })
      },50)
    } catch (e) {
      next(e)
    }
  })
  /**
   * @swagger
   * /api/user/device:
   *   put:
   *       description: Изменение пользовательских девайсов
   *       parameters:
   *         - name: deviceId
   *           required: true
   *           type: string
   *       responses:
   *           '200':
   *               description: если установлен deviceID возвращает ok
   * */
  router.put('/api/user/device', [corsAllMiddleware, authMiddleware], async (req, res, next) => {

  })
  /**
   * @swagger
   * /api/user/device:
   *   post:
   *       description: Добавление пользовательских девайсов
   *       parameters:
   *         - name: deviceId
   *           required: true
   *           type: string
   *       responses:
   *           '200':
   *               description: если установлен deviceID возвращает ok
   * */
  router.post('/api/user/device', [corsAllMiddleware, authMiddleware], async (req, res, next) => {

  })
  /**
   * @swagger
   * /api/device/registration:
   *   get:
   *       description: Регистрация девайса при первом
   *       parameters:
   *         - name: deviceId
   *           required: true
   *           type: string
   *       responses:
   *           '200':
   *               description: если установлен deviceID возвращает ok
   * */
  router.get('/api/device/registration', [corsAllMiddleware, authNotMiddleware], async (req, res, next) => {
    console.log(req.query)
    try {
      if (req.query.deviceId) {
        let device = await db.query(`SELECT * FROM "device" WHERE "key" = '${req.query.deviceId}'`).then(res => res.rows[0])
        if (device){
          res.send("ok")
          db.query(`UPDATE "device" SET "online" = to_timestamp(${Date.now() + 5*60*1000} / 1000.0) WHERE id = ${device.id}`)
        }else throw ApiException.BadRequest('Не корректные данные!')
      } else throw ApiException.BadRequest('Не корректные данные!')
    } catch (e) {
      next(e)
    }
  })
  /**
   * @swagger
   * /api/device/authorization:
   *   get:
   *       description: Авторизация девайса при запуске
   *       parameters:
   *         - name: deviceId
   *           required: true
   *           type: string
   *       responses:
   *           '200':
   *               description: если установлен deviceID возвращает ok
   * */
  router.get('/api/device/authorization', [corsAllMiddleware, authNotMiddleware], async (req, res, next) => {
    console.log(req.query)
    try {
      if (req.query.deviceId) {
        let device = await db.query(`SELECT * FROM "device" WHERE "key" = '${req.query.deviceId}'`).then(res => res.rows[0])
        if (device){
          res.send("ok")
          db.query(`UPDATE "device" SET "online" = to_timestamp(${Date.now() + 2*60*1000} / 1000.0) WHERE id = ${device.id}`)
        }else throw ApiException.BadRequest('Не корректные данные!')
      } else throw ApiException.BadRequest('Не корректные данные!')
    } catch (e) {
      next(e)
    }
  })
  /**
   * @swagger
   * /api/device/values:
   *   get:
   *       description: Работа с данными девайса
   *       parameters:
   *         - name: deviceId
   *           required: true
   *           type: string
   *         - name: value
   *           required: false
   *           type: string
   *         - name: color
   *           required: false
   *           type: string
   *       responses:
   *           '200':
   *               description: если установлен только deviceID возвращает массив значений, установка value нужна для получения конкретных значений, установка color меняет переменную
   * */
  router.get('/api/device/values', [corsAllMiddleware], async (req, res, next) => {
    console.log(req.query)
    try {
      if (req.query.deviceId) {
        let device = await db.query(`SELECT * FROM "device" WHERE "key" = '${req.query.deviceId.toLowerCase()}'`).then(res => res.rows[0])
        if (device) {
          let values = await db.query(`SELECT * FROM "device_value" WHERE "device" = '${device.id}'`).then(res => res.rows)
          values.map(value => {
            switch (value.title){
              case 'color': {
                value.value = {
                  r: Number(value.value.split(',')[0]),
                  g: Number(value.value.split(',')[1]),
                  b: Number(value.value.split(',')[2]),
                  a: Number(value.value.split(',')[3]),
                }
                if(values.filter(value2 => value2.title == 'effect').length > 0 && values.filter(value2 => value2.title == 'effect')[0].value.split(',')[0] != -1){
                  delete(value.value.r)
                  delete(value.value.g)
                  delete(value.value.b)
                  delete(value.value.a)
                  value.value.effect = Number(values.filter(value2 => value2.title == 'effect')[0].value.split(',')[0])
                  value.value.a = Number(values.filter(value2 => value2.title == 'effect')[0].value.split(',')[1])
                }
                break;
              }
              case 'temp': {
                value.value = {
                  temp: Number(value.value.split(',')[0]),
                  hud: Number(value.value.split(',')[1]),
                }
                break;
              }
            }
            return value
          })
          console.log(req.query)
          if (req.query.value) {
            switch (req.query.value) {
              case 'color': {
                values.filter(value => {
                  if (value.title == 'color') {
                    res.json(value.value)
                  } else {
                    return false
                  }
                })
                break;
              }
              case 'temp': {
                values.filter(value => {
                  if (value.title == 'temp') {
                    res.json({
                      temp: Number(value.value.split(',')[0]),
                      hud: Number(value.value.split(',')[1]),
                    })
                  } else {
                    return false
                  }
                })
                break;
              }
              case 'effect': {
                values.filter(value => {
                  if (value.title == 'effect') {
                    res.json({
                      effect: Number(value.value.split(',')[0]),
                      a: Number(value.value.split(',')[1]),
                    })
                  } else {
                    return false
                  }
                })
                break;
              }
            }
          }
          else if (req.query.color) {
            let color = {
              r: Number(req.query.color.split(',')[0]),
              g: Number(req.query.color.split(',')[1]),
              b: Number(req.query.color.split(',')[2]),
              a: Number(req.query.color.split(',')[3]),
            }
            if (values.filter(value => value.title == 'color').length > 0) {
              await db.query(`UPDATE "device_value" SET "value" = '${color.r},${color.g},${color.b},${color.a}' WHERE id = ${values.find(value=>value.title == 'color').id}`)
              res.json(color)
              if (values.filter(value => value.title == 'effect').length > 0) {
                await db.query(`UPDATE "device_value" SET "value" = '-1,0' WHERE id = ${values.find(value=>value.title == 'effect').id}`)
              }
            } else throw ApiException.BadRequest('Не корректные данные!')
          }
          else if (req.query.effect) {
            let color = {
              effect: Number(req.query.effect.split(',')[0]),
              a: Number(req.query.effect.split(',')[1]),
            }
            if (values.filter(value => value.title == 'effect').length > 0) {
              await db.query(`UPDATE "device_value" SET "value" = '${color.effect},${color.a}' WHERE id = ${values.find(value=>value.title == 'effect').id}`)
              res.json(color)
            } else throw ApiException.BadRequest('Не корректные данные!')
          }
          else if (req.query.temp) {
            let temp = {
              temp: Number(req.query.temp.split(',')[0]),
              hud: Number(req.query.temp.split(',')[1]),
            }
            await db.query(`UPDATE "device_value" SET "value" = '${temp.temp},${temp.hud}' WHERE id = ${values.find(value=>value.title == 'temp').id}`)
            res.json(temp)
          }
          else {
            values.map(value => {
              delete (value.id)
              delete (value.type)
              delete (value.device)
              return value
            })
            res.json(values)
          }
          db.query(`UPDATE "device" SET "online" = to_timestamp(${Date.now() + 2*60*1000} / 1000.0) WHERE id = ${device.id}`)
        } else throw ApiException.BadRequest('Не корректные данные!')
      } else throw ApiException.BadRequest('Не корректные данные!')
    } catch (e) {
      next(e)
    }
  })
}
