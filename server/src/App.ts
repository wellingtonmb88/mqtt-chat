import fastify from "fastify"
import cors from "fastify-cors"
import helmet from 'fastify-helmet'
import rateLimit from 'fastify-rate-limit'
import mongoose from 'mongoose'
import { FastifyInstanceType } from './types'
import routes from "./routes"
import config from './config'
import websocket from './websocket'

class App {
  public server: FastifyInstanceType

  public constructor() {
    this.server = fastify({ logger: true })
    this.middlewares()
    this.database()
    this.setupWebsocket()
    this.server.register(routes, { prefix: '/api/v1' })
  }

  private middlewares() {
    this.server.register(cors)
    this.server.register(helmet)
    this.server.register(rateLimit, {
      max: 100,
      timeWindow: '1 minute'
    })
  }

  private database() {
    mongoose
      .connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, {
        user: config.db.username,
        pass: config.db.password,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => this.server.log.info('MongoDB connected...'))
      .catch(err => this.server.log.error(err))
  }

  private setupWebsocket() {
    websocket()
  }
}

export default new App().server
