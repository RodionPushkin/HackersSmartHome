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
const md5 = require('md5')

class Longpool {
  constructor() {
    this.connected = []
  }

  connect(id, req, res, callback) {
    this.connected.push({
      id: id,
      rid: req.rid,
      req: req,
      res: res
    })
    console.log('connect connected:',this.connected.length)
    this.notify(id, "connect", callback)
  }

  disconnect(id,rid, callback) {
    this.notify(id, "disconnect", callback)
    this.connected = this.connected.filter(item => item.id != id && item.rid != rid)
    console.log('disconnect connected:',this.connected.length)
  }

  notify(id, type, callback = ()=>{}) {
    switch (type) {
      case "update": {
        console.log('update connected:',this.connected.length)
        callback(this.connected)
        break
      }
      case "connect": {
        callback(this.connected)
        break
      }
      case "disconnect": {
        callback(this.connected)
        break
      }
    }
  }
}

const deviceLongpool = new Longpool()
const userLongpool = new Longpool()

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
      const loadDataForDevice = ()=>{
        return new Promise(resolve => {
          let localDevices = []
          devices.forEach((device,index)=>{
            db.query(`SELECT * FROM "device_value" WHERE "device" = $1`,[device.id]).then(res=>res.rows).then(device_values=>{
              db.query(`SELECT * FROM "script" WHERE "device" = $1`,[device.id]).then(res=>res.rows).then(script=>{
                db.query(`SELECT * FROM "device_group" WHERE "device" = $1`,[device.id]).then(res=>res.rows).then(device_group=>{
                  device.values = {}
                  device_group.forEach(item=>{
                    delete(item.device)
                  })
                  device.group = device_group
                  device_values.forEach(item=>{
                    delete(item.device)
                    delete(item.id)
                    if(item.enable_history){
                      if(!device.values[item.title]) device.values[item.title] = []
                      device.values[item.title].push({
                        value: item.value,
                        created: item.created
                      })
                    }else{
                      device.values[item.title] = {
                        value: item.value,
                        created: item.created
                      }
                    }
                  })
                  device.scripts = []
                  script.forEach(item=>{
                    delete(item.device)
                    delete(item.id)
                    device.scripts.push(item)
                  })
                  delete (device.user)
                  delete (device.key)
                  delete (device.ip)
                  delete (device.device)
                  delete (device.deleted)
                  if(index == devices.length -1){
                    resolve({devices:devices,device_types:deviceTypes})
                  }
                })
              })
            })
          })
        })
      }
      const useLongpool = req.query.longpool ? true : false
      if(useLongpool){
        userLongpool.connect(user.id,req,res)
        req.on('close', () => {
          userLongpool.disconnect(Number(user.id),req.rid)
        })
        req.on('error', () => {
          userLongpool.disconnect(Number(user.id),req.rid)
        })
      }else{
        res.send(await loadDataForDevice())
      }
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
    console.log("registration", req.query)
    try {
      const mac = req.query.deviceId.toLowerCase()
      const ip = req.query.ip.toLowerCase()
      if (mac) {
        if ((await db.query(`SELECT * FROM "device" WHERE "mac" = $1 AND "deleted" = $2`, [mac, false]).then(data => data.rows)).length > 0) {
          throw ApiException.DeviceAuthorized()
        } else if (req.query.device_type && ip) {
          const key = md5(await bcrypt.hash(req.query.deviceId, 4))
          const title = await db.query(`SELECT "title" FROM "device_type" WHERE "id" = $1`, [req.query.device_type]).then(data => data.rows[0].title)
          db.query(`INSERT INTO "device" ("title","mac","key","device_type","ip") VALUES ($1,$2,$3,$4,$5) RETURNING "id"`, [title, mac, key, req.query.device_type,ip], (err, data) => {
            if (err) throw ApiException.BadRequest('Не корректные данные!')
            const id = data.rows[0].id
            const setter = Object.keys(req.query).filter(key => key != "key" && key != "parent" && key != "deviceId" && key != "device_type" && key != "value" && key != "history" && key != "ip")
            if (!req.query.history) req.query.history = []
            setter.forEach((val, index) => {
              db.query(`INSERT INTO "device_value" ("title","value","device","enable_history") VALUES ($1,$2,$3,$4)`, [val, req.query[val], id, req.query.history.includes(val)]).then(() => {
                if (index == setter.length - 1) {
                  res.json({
                    key: key
                  })
                }
              })
            })
          })
        } else throw ApiException.BadRequest('Не корректные данные!')
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
    console.log("authorization", req.query)
    try {
      const mac = req.query.deviceId.toLowerCase()
      const ip = req.query.ip.toLowerCase()
      const key = req.query.key
      if (mac && key && ip) {
        db.query(`SELECT * FROM "device" WHERE "mac" = $1 AND "key" = $2 AND "deleted" = $3`, [mac, key, false], (err, data) => {
          if (err) throw ApiException.DeviceUnauthorized()
          if (data.rows.length == 0) throw ApiException.DeviceUnauthorized()
          db.query(`UPDATE "device" SET "online" = to_timestamp($1 / 1000.0), "ip" = $2 WHERE "mac" = $3 AND "key" = $4 AND "deleted" = $5`, [
            Date.now() + 2 * 60 * 1000,
            ip,
            mac,
            key,
            false
          ])
          res.json({
            mac: mac,
            key: key
          })
        })
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
    console.log("values", req.query)
    try {
      const mac = req.query.deviceId.toLowerCase()
      const key = req.query.key
      const useLongpool = req.query.longpool ? true : false
      const accessToken = req.query.access_token || req.body.access_token || req.headers.authorization ? req.headers.authorization.split(' ')[1] : undefined
      let device = undefined
      let user = undefined
      let isFromUser = false
      if (mac && key) {
        device = await db.query(`SELECT * FROM "device" WHERE "mac" = $1 AND "key" = $2 AND "deleted" = $3`, [mac, key, false]).then(res => res.rows[0])
        if (!device) throw ApiException.DeviceUnauthorized()
        const userid = await db.query(`SELECT "user" FROM "user_device" WHERE "device" = $1`, [device.id]).then(res => res.rows[0].user)
        if (!userid) throw ApiException.BadRequest("Не корректные данные!11")
        user = await db.query(`SELECT * FROM "user" WHERE "id" = $1`, [userid]).then(res => res.rows[0])
        if (!user) throw ApiException.DeviceUnauthorized()
      } else if (accessToken) {
        isFromUser = true
        const refreshToken = req.cookies.refresh_token
        if (!req.cookies.device_id || !refreshToken || !accessToken) {
          throw ApiException.BadRequest('Не корректные данные!')
        }
        let deviceID = req.cookies.device_id
        location = await bcrypt.hash(`${geoip.lookup(req.ip)?.country}/${geoip.lookup(req.ip)?.city}`, 4)
        if (!(await tokenService.validate(accessToken, refreshToken, deviceID, location))) throw ApiException.Unauthorized()
        user = await db.query(`SELECT "U".* FROM "user" AS "U" INNER JOIN "token" AS "T" ON "U"."id" = "T"."id_user" WHERE "T"."access_token" = '${accessToken}' AND "T"."refresh_token" = '${refreshToken}'`).then(res => res.rows[0])
        const deviceid = await db.query(`SELECT "device" FROM "user_device" WHERE "user" = $1`, [user.id]).then(res => res.rows[0].device)
        if (!deviceid) throw ApiException.BadRequest("Не корректные данные!")
        device = await db.query(`SELECT * FROM "device" WHERE "id" = $1 AND "deleted" = $2`, [deviceid, false]).then(res => res.rows[0])
        if (!device) throw ApiException.DeviceUnauthorized()
      } else throw ApiException.BadRequest('Не корректные данные!')

      if (useLongpool) {
        if (isFromUser) {
          userLongpool.connect(Number(user.id), req, res)
          req.on('close', () => {
            userLongpool.disconnect(Number(user.id),req.rid)
          })
          req.on('error', () => {
            userLongpool.disconnect(Number(user.id),req.rid)
          })
        } else {
          deviceLongpool.connect(Number(device.id), req, res)
          db.query(`UPDATE "device" SET "online" = to_timestamp($1 / 1000.0) WHERE "mac" = $2 AND "key" = $3 AND "deleted" = $4`, [
            Date.now() + 2 * 60 * 1000,
            mac,
            key,
            false
          ])
          req.on('close', () => {
            deviceLongpool.disconnect(Number(device.id),req.rid)
          })
          req.on('error', () => {
            deviceLongpool.disconnect(Number(device.id),req.rid)
          })
        }
      }
      else {
        const value = req.query.value
        const values = await db.query(`SELECT * FROM "device_value" WHERE "device" = '${Number(device.id)}' ORDER BY "created"`).then(res => res.rows)
        values.map(item => {
          switch (item.title) {
            case 'color': {
              item.value = {
                r: Number(item.value.split(',')[0]),
                g: Number(item.value.split(',')[1]),
                b: Number(item.value.split(',')[2]),
                a: Number(item.value.split(',')[3])
              }
              if (values.filter(value2 => value2.title == 'effect').length > 0 &&
                values.filter(value2 => value2.title == 'effect')[0].value.split(',')[0] != -1) {
                item.value = {
                  effect: Number(values.filter(value2 => value2.title == 'effect')[0].value.split(',')[0]),
                  a: Number(values.filter(value2 => value2.title == 'effect')[0].value.split(',')[1])
                }
              }
              break;
            }
          }
          return item
        })
        const setter = Object.keys(req.query).filter(key => key != "key" && key != "parent" && key != "deviceId" && key != "device_type" && key != "value" && key != "history" && key != "ip")
        if (value) {
          const result = {}
          if (values.find(item => item.title == value).enable_history) {
            result[value] = []
            const items = values.filter(item => item.title == value)
            items.forEach(item => {
              result[value].push({
                value: item.value,
                created: item.created
              })
            })
          } else {
            result[value] = values.find(item => item.title == value).value
          }
          res.json(result)
        }
        else if (setter.length > 0) {
          if (!req.query.history) req.query.history = []
          const result = {}
          setter.forEach((val, index) => {
            result[val] = req.query[val]
            if (values.find(item => item.title == val).enable_history) {
              db.query(`INSERT INTO "device_value" ("title","value","device","enable_history") VALUES ($1,$2,$3,$4)`, [val, req.query[val], device.id, true]).then(() => {
                if (index == setter.length - 1) {
                  deviceLongpool.notify(device.id, 'update', (data) => {
                    if (data.find(connection => connection.id == device.id)) {
                      data.find(connection => connection.id == device.id).res.json({
                        event: "update"
                      })
                      if(key){
                        db.query(`UPDATE "device" SET "online" = to_timestamp($1 / 1000.0) WHERE "mac" = $2 AND "key" = $3 AND "deleted" = $4`, [
                          Date.now() + 2 * 60 * 1000,
                          mac,
                          key,
                          false
                        ])
                      }
                    }
                  })
                  userLongpool.notify(user.id, 'update', (data) => {
                    if (data.filter(connection => connection.id == user.id).length > 0) {
                      data.filter(connection => connection.id == user.id).forEach(connection => {
                        connection.res.json({
                          event: "update"
                        })
                      })
                    }
                  })
                  res.json(result)
                }
              })
            }
            else {
              console.log(req.query[val])
              db.query(`UPDATE "device_value" SET "value" = $1 WHERE id = $2`, [req.query[val], values.find(item => item.title == val).id]).then(() => {
                if(val == "color"){
                  db.query(`UPDATE "device_value" SET "value" = $1 WHERE id = $2`, ["-1,0", values.find(item => item.title == "effect").id])
                }
                if (index == setter.length - 1) {
                  deviceLongpool.notify(device.id, 'update', (data) => {
                    if (data.find(connection => connection.id == device.id)) {
                      data.find(connection => connection.id == device.id).res.json({
                        event: "update"
                      })
                    }
                  })
                  userLongpool.notify(user.id, 'update', (data) => {
                    if (data.filter(connection => connection.id == user.id).length > 0) {
                      data.filter(connection => connection.id == user.id).forEach(connection => {
                        connection.res.json({
                          event: "update"
                        })
                      })
                    }
                  })
                  res.json(result)
                }
              })
            }
          })
        }
        else {
          const result = {}
          values.forEach(value => {
            if (value.enable_history) {
              result[value.title] = []
              const items = values.filter(item => item.title == value.title)
              items.forEach(item => {
                result[value.title].push({
                  value: item.value,
                  created: item.created
                })
              })
            } else {
              result[value.title] = value.value
            }
          })
          res.send(result)
        }
      }
    } catch (e) {
      next(e)
    }
  })
}
