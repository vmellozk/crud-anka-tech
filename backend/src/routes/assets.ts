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

  // Atualizar ativo (restrição: se tiver alocação, só pode editar valor)
  app.put('/:id', async (request, reply) => {
    const assetId = Number((request.params as any).id)
    try {
      const body = assetSchema.parse(request.body)

      // Verificar se há alocações com este ativo
      const hasAllocations = await prisma.allocation.findFirst({
        where: { assetId },
      })

      if (hasAllocations) {
        // Só permitir alterar o value se já tiver alocação
        const updated = await prisma.asset.update({
          where: { id: assetId },
          data: {
            value: body.value,
          },
        })
        return updated
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
  app.delete('/:id', async (request, reply) => {
    const assetId = Number((request.params as any).id)
    try {
      await prisma.asset.delete({ where: { id: assetId } })
      return reply.code(204).send()
    } catch (err) {
      return reply.code(500).send({ error: 'Internal Server Error' })
    }
  })

  // Atualizar quantidade (amount) da alocação
  app.put('/allocations/:id', async (request, reply) => {
    const allocationId = Number((request.params as any).id)
    const { amount } = request.body as { amount: number }

    if (amount <= 0) {
      return reply.code(400).send({ error: 'Quantidade inválida.' })
    }

    try {
      const updated = await prisma.allocation.update({
        where: { id: allocationId },
        data: { amount },
        include: { asset: true },
      })
      return updated
    } catch (err) {
      return reply.code(500).send({ error: 'Erro ao atualizar alocação.' })
    }
  })
}
