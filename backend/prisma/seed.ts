import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Verifica se já existe algum asset ou client
  const assetCount = await prisma.asset.count()
  const clientCount = await prisma.client.count()

  if (assetCount > 0 || clientCount > 0) {
    console.log('Seed skipped: dados já existem no banco.')
    return
  }

  // Criar ativos
  const asset1 = await prisma.asset.create({
    data: { name: 'Fundo ABC', value: 100.0 },
  })
  const asset2 = await prisma.asset.create({
    data: { name: 'Ação XYZ', value: 50.5 },
  })

  // Criar clientes
  const client1 = await prisma.client.create({
    data: { name: 'João Marcos Silva', email: 'joaomarcos@example.com', status: true },
  })
  const client2 = await prisma.client.create({
    data: { name: 'Maria Eduarda Souza', email: 'mariaeduarda@example.com', status: true },
  })

  // Criar alocações ligando clientes e ativos
  await prisma.allocation.create({
    data: {
      clientId: client1.id,
      assetId: asset1.id,
      amount: 10,
    },
  })
  await prisma.allocation.create({
    data: {
      clientId: client1.id,
      assetId: asset2.id,
      amount: 5,
    },
  })
  await prisma.allocation.create({
    data: {
      clientId: client2.id,
      assetId: asset2.id,
      amount: 20,
    },
  })

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
