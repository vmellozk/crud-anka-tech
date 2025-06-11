import { FastifyPluginAsync } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { allocationByNameSchema } from '../server'

export const allocationRoutes: FastifyPluginAsync = async (app) => {
  const prisma = new PrismaClient()

  // Listar alocações do cliente (GET /clients/:clientId/allocations)
  app.get('/', async (request, reply) => {
    const { clientId } = request.params as { clientId: string }
    try {
      // Busca o cliente para pegar o nome
      const client = await prisma.client.findUnique({
        where: { id: Number(clientId) },
        select: { name: true }
      })

      if (!client) {
        return reply.code(404).send({ error: 'Client not found' })
      }

      // Busca alocações com assets relacionados
      const allocations = await prisma.allocation.findMany({
        where: { clientId: Number(clientId) },
        include: { asset: true },
      })

      // Retorna o nome do cliente e as alocações
      return reply.send({ clientName: client.name, allocations })
    } catch (err) {
      return reply.status(500).send({ error: 'Internal Server Error' })
    }
  })

  // Criar alocação (cliente escolhe ativo e quantidade) - rota antiga
  app.post('/', async (request, reply) => {
    const { clientId } = request.params as { clientId: string }
    try {
      const { assetName, amount } = allocationByNameSchema.parse(request.body)

      const clientExists = await prisma.client.findUnique({ where: { id: Number(clientId) } })
      if (!clientExists) return reply.code(404).send({ error: 'Client not found' })

      const asset = await prisma.asset.findFirst({ where: { name: assetName } })
      if (!asset) return reply.code(404).send({ error: 'Asset not found' })

      const allocation = await prisma.allocation.create({
        data: {
          clientId: Number(clientId),
          assetId: asset.id,
          amount,
        },
        include: {
          asset: true,
        }
      })

      return reply.code(201).send(allocation)
    } catch (err) {
      return reply.code(400).send({ error: err })
    }
  })

  // Nova rota: Criar alocação pelo nome do ativo (assetName) + amount
  app.post('/by-name', async (request, reply) => {
    const { clientId } = request.params as { clientId: string }
    try {
      const { assetName, amount } = allocationByNameSchema.parse(request.body)

      const clientExists = await prisma.client.findUnique({ where: { id: Number(clientId) } })
      if (!clientExists) return reply.code(404).send({ error: 'Client not found' })

      const asset = await prisma.asset.findFirst({ where: { name: assetName } })
      if (!asset) return reply.code(404).send({ error: 'Asset not found' })

      const allocation = await prisma.allocation.create({
        data: {
          clientId: Number(clientId),
          assetId: asset.id,
          amount
        },
        include: {
          asset: true
        }
      })

      return reply.code(201).send(allocation)
    } catch (err) {
      return reply.code(400).send({ error: err })
    }
  })
}
