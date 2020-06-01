import dotenv from "dotenv"
dotenv.config()

const appPort = process.env.APP_PORT

const MQTTServiceHost = process.env.MQTT_SERVICE_HOST || 'localhost'
const MQTTServicePort = process.env.MQTT_SERVICE_PORT

const dbHost = process.env.DB_URL || 'localhost'
const dbPort = process.env.DB_PORT
const dbName = process.env.DB_NAME
const dbUserName = process.env.DB_USERNAME
const dbPassword = process.env.DB_PASSWORD

export = {
  app: {
    host: '0.0.0.0',
    port: appPort ? parseInt(appPort) : 4000,
  },
  MQTTService: {
    host: MQTTServiceHost,
    port: MQTTServicePort ? parseInt(MQTTServicePort) : 1883,
  },
  db: {
    host: dbHost,
    port: dbPort ? parseInt(dbPort) : 27017,
    name: dbName,
    username: dbUserName,
    password: dbPassword,
  },
}