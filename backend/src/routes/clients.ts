import { FastifyPluginAsync } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { clientSchema } from '../server'

export const clientRoutes: FastifyPluginAsync = async (app) => {
  const prisma = new PrismaClient()

  // Criar cliente
  app.post('/', async (request, reply) => {
    try {
      const body = clientSchema.parse(request.body)
      const client = await prisma.client.create({ data: body })
      return reply.code(201).send(client)
    } catch (err) {
      return reply.code(400).send({ error: err })
    }
  })

  // Listar clientes com resumo
  app.get('/', async () => {
    const clients = await prisma.client.findMany({
      include: {
        allocations: {
          include: { asset: true }
        },
        _count: {
          select: { allocations: true }
        }
      }
    })

    const formatted = clients.map(c => ({
      id: c.id,
      name: c.name,
      email: c.email,
      status: c.status,
      allocationsCount: c._count.allocations,
      assets: c.allocations.map(a => ({
        id: a.asset.id,
        name: a.asset.name,
        value: a.asset.value,
        amount: a.amount
      })),
    }))

    return formatted
  })

  // Atualizar cliente
  app.put('/:id', async (request, reply) => {
    const id = Number((request.params as any).id)
    try {
      const body = clientSchema.parse(request.body)
      const updated = await prisma.client.update({
        where: { id },
        data: body,
      })
      return updated
    } catch (err) {
      return reply.code(400).send({ error: err })
    }
  })

  // Buscar cliente por ID
  app.get('/:id', async (request, reply) => {
    const id = Number((request.params as any).id)
    try {
      const client = await prisma.client.findUnique({
        where: { id },
      })
      if (!client) {
        return reply.code(404).send({ error: 'Client not found' })
      }
      return reply.send(client)
    } catch (err) {
      return reply.code(500).send({ error: 'Internal Server Error' })
    }
  })

  // Deletar cliente
  app.delete('/:id', async (request, reply) => {
    const clientId = Number((request.params as any).id)
    try {
      await prisma.client.delete({ where: { id: clientId } })
      return reply.code(204).send()
    } catch (err) {
      return reply.code(500).send({ error: 'Internal Server Error' })
    }
  })
}
