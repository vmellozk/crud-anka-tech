import Fastify from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

import { clientRoutes } from './routes/clients'
import { assetRoutes } from './routes/assets'
import { allocationRoutes } from './routes/allocations'
import { healthRoutes } from './routes/health'

const app = Fastify()
const prisma = new PrismaClient()

// Schemas (exportados para usar nos módulos de rota)
export const clientSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  status: z.boolean(),
})

export const assetSchema = z.object({
  name: z.string().min(1),
  value: z.number().positive(),
})

export const allocationByNameSchema = z.object({
  assetName: z.string().min(1),
  amount: z.number().positive(),
})

;(async () => {
  await app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })

  // Registrando rotas importadas e passando app e prisma
  app.register(healthRoutes)
  app.register(clientRoutes, { prefix: '/clients' })
  app.register(assetRoutes, { prefix: '/assets' })
  app.register(allocationRoutes, { prefix: '/clients/:clientId/allocations' })

  app.listen({ port: 3001, host: '0.0.0.0' }, (err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log('🚀 Server is running at http://localhost:3001')
  })
})()
