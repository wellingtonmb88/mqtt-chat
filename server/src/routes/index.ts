import { FastifyInstanceType } from '../types'
import UserAll from '../controllers/user/all'
import MessageAll from '../controllers/message/all'

class Router {

  constructor() {
  }

  routes = async (server: FastifyInstanceType) => {
    server.get('/users', {}, UserAll)
    server.get('/messages', {}, MessageAll)
  }
}

export default new Router().routes