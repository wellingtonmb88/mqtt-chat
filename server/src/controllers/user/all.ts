import {
  FastifyRequestType,
  FastifyReplyType,
} from '../../types'

import { replyWithSuccess } from '../../utils'
import UserSchema from '../../schemas/UserSchema'

export default async (_request: FastifyRequestType, reply: FastifyReplyType) => { 
  const result = await UserSchema.find() 
  return replyWithSuccess(reply, 200, result)
}