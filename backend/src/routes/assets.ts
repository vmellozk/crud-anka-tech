import { FastifyPluginAsync } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { assetSchema } from '../server'

export const assetRoutes: FastifyPluginAsync = async (app) => {
  const prisma = new PrismaClient()

  // Criar ativo genérico
  app.post('/', async (request, reply) => {
    try {
      const body = assetSchema.parse(request.body)
      const asset = await prisma.asset.create({ data: body })
      return reply.code(201).send(asset)
    } catch (err) {
      return reply.code(400).send({ error: err })
    }
  })

  // Listar todos ativos disponíveis
  app.get('/', async () => {
    const assets = await prisma.asset.findMany()
    return assets
  })

  // Atualizar ativo
  app.put('/:id', async (request, reply) => {
    const assetId = Number((request.params as any).id)
    try {
      const body = assetSchema.parse(request.body)
      const updated = await prisma.asset.update({
        where: { id: assetId },
        data: body,
      })
      return updated
    } catch (err) {
      return reply.code(400).send({ error: err })
    }
  })

  // Deletar ativo
  app.delete('/:id', async (request, reply) => {
    const assetId = Number((request.params as any).id)
    try {
      await prisma.asset.delete({ where: { id: assetId } })
      return reply.code(204).send()
    } catch (err) {
      return reply.code(500).send({ error: 'Internal Server Error' })
    }
  })
}
