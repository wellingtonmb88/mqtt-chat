import { FastifyReplyType } from '../types'


export const replyWithSuccess = (reply: FastifyReplyType, status: number, response: any) =>
  (reply.header('Content-Type', 'application/json').code(status).send(JSON.stringify(response)))


export const replyWithError = (reply: FastifyReplyType, status: number, message: string) =>
(reply.header('Content-Type', 'application/json').code(status).send(new Error(message)))
