import { Server, IncomingMessage, ServerResponse } from 'http'
import fastify from "fastify"

export type FastifyRequestType = fastify.FastifyRequest<IncomingMessage, fastify.DefaultQuery,
  fastify.DefaultParams, fastify.DefaultHeaders, any>

export type FastifyReplyType = fastify.FastifyReply<ServerResponse>

export type FastifyInstanceType = fastify.FastifyInstance<Server, IncomingMessage, ServerResponse>
