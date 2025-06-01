import Fastify from 'fastify'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

// Instância do Fastify e Prisma
const app = Fastify()
const prisma = new PrismaClient()

// Schema de validação com Zod
const clientSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  status: z.boolean(),
})

// Schema para validar os dados do ativo
const assetSchema = z.object({
  name: z.string().min(1),
  value: z.number().positive(),
})

// Rota: Health-check
app.get('/', async () => {
  return { status: 'ok' }
})

// Rota: Criar cliente
app.post('/clients', async (request, reply) => {
  try {
    const body = clientSchema.parse(request.body)
    const client = await prisma.client.create({ data: body })
    return reply.code(201).send(client)
  } catch (err) {
    return reply.code(400).send({ error: err })
  }
})

// Rota: Listar clientes
app.get('/clients', async () => {
  const clients = await prisma.client.findMany({
    include: { assets: true },
  })
  return clients
})

// Rota: Atualizar cliente
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

// Criar ativo para um cliente
app.post('/clients/:clientId/assets', async (request, reply) => {
  const clientId = Number((request.params as any).clientId)
  try {
    const body = assetSchema.parse(request.body)

    // Verifica se cliente existe
    const clientExists = await prisma.client.findUnique({ where: { id: clientId } })
    if (!clientExists) {
      return reply.code(404).send({ error: 'Client not found' })
    }

    // Cria ativo para cliente
    const asset = await prisma.asset.create({
      data: {
        ...body,
        clientId,
      },
    })
    return reply.code(201).send(asset)
  } catch (err) {
    return reply.code(400).send({ error: err })
  }
})

// Listar ativos de um cliente
app.get('/clients/:clientId/assets', async (request, reply) => {
  const clientId = Number((request.params as any).clientId)
  try {
    const assets = await prisma.asset.findMany({
      where: { clientId },
    })
    return assets
  } catch (err) {
    return reply.code(500).send({ error: 'Internal Server Error' })
  }
})

// Atualizar ativo
app.put('/clients/:clientId/assets/:assetId', async (request, reply) => {
  const clientId = Number((request.params as any).clientId)
  const assetId = Number((request.params as any).assetId)

  try {
    const body = assetSchema.parse(request.body)

    // Verifica se ativo existe e pertence ao cliente
    const assetExists = await prisma.asset.findUnique({
      where: { id: assetId },
    })

    if (!assetExists || assetExists.clientId !== clientId) {
      return reply.code(404).send({ error: 'Asset not found for this client' })
    }

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
app.delete('/clients/:clientId/assets/:assetId', async (request, reply) => {
  const clientId = Number((request.params as any).clientId)
  const assetId = Number((request.params as any).assetId)

  try {
    const assetExists = await prisma.asset.findUnique({
      where: { id: assetId },
    })

    if (!assetExists || assetExists.clientId !== clientId) {
      return reply.code(404).send({ error: 'Asset not found for this client' })
    }

    await prisma.asset.delete({ where: { id: assetId } })
    return reply.code(204).send()
  } catch (err) {
    return reply.code(500).send({ error: 'Internal Server Error' })
  }
})

// Rota: Ativos fixos (exibição simples)
app.get('/assets', async () => {
  return [
    { name: 'Ação XYZ', value: 150.25 },
    { name: 'Fundo ABC', value: 102.50 },
    { name: 'CDB 2030', value: 1000.0 },
  ]
})

// Start do servidor
app.listen({ port: 3001, host: '0.0.0.0' }, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log('🚀 Server is running at http://localhost:3001')
})
