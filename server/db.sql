DROP TABLE IF EXISTS "user","token","connection","user_device","device_value","device_group","script","device","device_type";
CREATE TABLE IF NOT EXISTS "user"(
	"id" BIGSERIAL NOT NULL PRIMARY KEY,
	"email" CHARACTER VARYING(255) NOT NULL,
	"password" CHARACTER VARYING(60) NOT NULL,
	"is_activated" BOOLEAN NOT NULL DEFAULT FALSE,
	"activation_link" CHARACTER VARYING(255) NOT NULL,
	"created_at" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP(3)::TIMESTAMP,
	"online_at" TIMESTAMP(3) WITHOUT TIME ZONE
);
CREATE TABLE IF NOT EXISTS "token"(
	"id" BIGSERIAL NOT NULL PRIMARY KEY,
	"id_user" BIGINT NOT NULL REFERENCES "user"("id"),
	"device_id" TEXT NOT NULL,
	"refresh_token" TEXT NOT NULL,
	"access_token" TEXT NOT NULL,
	"expires" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL,
	"location" CHARACTER VARYING (255)
);
CREATE TABLE IF NOT EXISTS "connection"(
	"id" BIGSERIAL NOT NULL PRIMARY KEY,
	"id_token" BIGINT NOT NULL REFERENCES "token"("id"),
	"peer" CHARACTER VARYING(36) NOT NULL
);
CREATE TABLE IF NOT EXISTS "device_type"(
	"id" SERIAL NOT NULL PRIMARY KEY,
	"title" CHARACTER VARYING(500) NOT NULL
);
CREATE TABLE IF NOT EXISTS "device"(
	"id" BIGSERIAL NOT NULL PRIMARY KEY,
	"title" CHARACTER VARYING(500) NOT NULL, -- название девайса
	"mac" TEXT NOT NULL, -- мак адрес
	"key" TEXT NOT NULL, -- ключ доступа для девайса
	"device_type" INT NOT NULL REFERENCES "device_type"("id"),
	"enabled" BOOLEAN NOT NULL DEFAULT true, -- использовать ли устройство
	"index" INT, -- индекс в порядке элементов
	"ip" TEXT NOT NULL, -- ip девайса для хаба
	"parent" BIGINT REFERENCES "device" ("id"), -- id хаба родителя
	"deleted" BOOLEAN NOT NULL DEFAULT false, -- если устройство удалено, то ему придется заново проходить регистрацию
	"online" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP(3)::TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "device_group"(
	"id" SERIAL NOT NULL PRIMARY KEY,
	"title" CHARACTER VARYING(500) NOT NULL,
	"device" INT NOT NULL REFERENCES "device"("id")
);
CREATE TABLE IF NOT EXISTS "device_value"(
	"id" BIGSERIAL NOT NULL PRIMARY KEY,
	"device" INT NOT NULL REFERENCES "device"("id"),
	"title" CHARACTER VARYING(500) NOT NULL,
	"value" TEXT NOT NULL,
	"created" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP(3)::TIMESTAMP,
	"enable_history" BOOLEAN DEFAULT false -- если указано, то поле не обновляется, а добавляется и при выборке получаем множество
);
CREATE TABLE IF NOT EXISTS "script"(
	"id" BIGSERIAL NOT NULL PRIMARY KEY,
	"device" BIGINT NOT NULL REFERENCES "device" ("id"),
	"device_value" TEXT NOT NULL,
	"value" TEXT NOT NULL,
	"start_time" TIMESTAMP(3) WITHOUT TIME ZONE,
	"end_time" TIMESTAMP(3) WITHOUT TIME ZONE,
	"repeat" BOOLEAN NOT NULL DEFAULT false,
	"enabled" BOOLEAN NOT NULL DEFAULT true
);
CREATE TABLE IF NOT EXISTS "user_device"(
	"id" BIGSERIAL NOT NULL PRIMARY KEY,
	"user" INT NOT NULL REFERENCES "user"("id"),
	"device" INT NOT NULL REFERENCES "device"("id")
);
INSERT INTO "device_type" ("title") VALUES
('умный переключатель'),
('датчик дыма'),
('датчик температуры'),
('датчик газа'),
('датчик протечки'),
('датчик освещения'),
('умная лампа'),
('центр управления'),
('умный мотор');

SELECT * FROM "user_device" AS "UD" INNER JOIN "device" AS "D" ON "UD"."device" = "D"."id";
SELECT * FROM "token";
SELECT * FROM "connection";
SELECT * FROM "user";
SELECT * FROM "device_type";
SELECT * FROM "device";
SELECT * FROM "device_value";
SELECT * FROM "user_device";
-- SELECT * FROM "device" WHERE "mac" = $1 AND "key" = $2 AND "deleted" = $3
