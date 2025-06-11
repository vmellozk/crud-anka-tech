# Usa imagem oficial Node.js (versão LTS)
FROM node:18-alpine

# Instala bash
RUN apk add --no-cache bash

# Define diretório de trabalho
WORKDIR /app

# Copia apenas arquivos de dependência
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Instala tsx globalmente para rodar TS diretamente
RUN npm install -g tsx

# Instala o cliente Prisma
RUN npm install @prisma/client

# Copia todo o restante do código (inclusive wait-for-it.sh)
COPY . .

# Gera o Prisma Client
RUN npx prisma generate

# Expõe a porta usada pelo Fastify
EXPOSE 3001

# Comando padrão ao iniciar o container
CMD ["sh", "-c", "./wait-for-it.sh db:3306 -- npx prisma migrate deploy && npx ts-node prisma/seed.ts && tsx src/server.ts"]
