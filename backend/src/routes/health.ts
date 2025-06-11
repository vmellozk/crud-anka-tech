import { FastifyPluginAsync } from 'fastify'

export const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async () => {
    return { status: 'ok' }
  })
}
