import {
  FastifyRequestType,
  FastifyReplyType,
} from '../../types'

import { replyWithSuccess } from '../../utils'
import MessageSchema from '../../schemas/MessageSchema'

export default async (_request: FastifyRequestType, reply: FastifyReplyType) => { 
  const result = await MessageSchema.find() 
  return replyWithSuccess(reply, 200, result)
}