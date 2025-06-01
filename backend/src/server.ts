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
