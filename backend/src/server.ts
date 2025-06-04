import Fastify from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const app = Fastify()
const prisma = new PrismaClient()

const clientSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  status: z.boolean(),
})

const assetSchema = z.object({
  name: z.string().min(1),
  value: z.number().positive(),
})

const allocationByNameSchema = z.object({
  assetName: z.string().min(1),
  amount: z.number().positive(),
})


;(async () => {
  // Registro do CORS para liberar frontend rodando em localhost:3000
  await app.register(cors, {
    origin: '*',
  })

  // Health-check
  app.get('/', async () => {
    return { status: 'ok' }
  })

  // Criar cliente
  app.post('/clients', async (request, reply) => {
    try {
      const body = clientSchema.parse(request.body)
      const client = await prisma.client.create({ data: body })
      return reply.code(201).send(client)
    } catch (err) {
      return reply.code(400).send({ error: err })
    }
  })

  // Listar clientes com resumo
  app.get('/clients', async () => {
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
  app.put('/clients/:id', async (request, reply) => {
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

  // Criar ativo genérico
  app.post('/assets', async (request, reply) => {
    try {
      const body = assetSchema.parse(request.body)
      const asset = await prisma.asset.create({ data: body })
      return reply.code(201).send(asset)
    } catch (err) {
      return reply.code(400).send({ error: err })
    }
  })

  // Listar todos ativos disponíveis
  app.get('/assets', async () => {
    const assets = await prisma.asset.findMany()
    return assets
  })

  // Atualizar ativo
  app.put('/assets/:id', async (request, reply) => {
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
  app.delete('/assets/:id', async (request, reply) => {
    const assetId = Number((request.params as any).id)
    try {
      await prisma.asset.delete({ where: { id: assetId } })
      return reply.code(204).send()
    } catch (err) {
      return reply.code(500).send({ error: 'Internal Server Error' })
    }
  })

  // Criar alocação (cliente escolhe ativo e quantidade) - por assetId (rota antiga)
  app.post('/clients/:clientId/allocations', async (request, reply) => {
    const clientId = Number((request.params as any).clientId)
    try {
      const { assetName, amount } = allocationByNameSchema.parse(request.body)

      const clientExists = await prisma.client.findUnique({ where: { id: clientId } })
      if (!clientExists) return reply.code(404).send({ error: 'Client not found' })

      const asset = await prisma.asset.findFirst({ where: { name: assetName } })
      if (!asset) return reply.code(404).send({ error: 'Asset not found' })

      const allocation = await prisma.allocation.create({
        data: {
          clientId,
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
  app.post('/clients/:clientId/allocations-by-name', async (request, reply) => {
    const clientId = Number((request.params as any).clientId)
    try {
      const { assetName, amount } = allocationByNameSchema.parse(request.body)

      const clientExists = await prisma.client.findUnique({ where: { id: clientId } })
      if (!clientExists) return reply.code(404).send({ error: 'Client not found' })

      const asset = await prisma.asset.findFirst({ where: { name: assetName } })
      if (!asset) return reply.code(404).send({ error: 'Asset not found' })

      const allocation = await prisma.allocation.create({
        data: {
          clientId,
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

  // Listar alocações do cliente
  app.get('/clients/:clientId/allocations', async (request, reply) => {
    const clientId = Number((request.params as any).clientId)
    try {
      const allocations = await prisma.allocation.findMany({
        where: { clientId },
        include: { asset: true },
      })

      return reply.send(allocations)
    } catch (err) {
      return reply.status(500).send({ error: 'Internal Server Error' })
    }
  })

  // Start do servidor
  app.listen({ port: 3001, host: '0.0.0.0' }, (err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log('🚀 Server is running at http://localhost:3001')
  })
})()
