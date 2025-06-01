# Usa imagem oficial Node.js (versão LTS)
FROM node:18-alpine

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia package.json e package-lock.json para instalar dependências
COPY package*.json ./

# Instala as dependências (prod + dev)
RUN npm install

# Instala tsx globalmente para rodar TS direto
RUN npm install -g tsx

# Copia todo o código fonte para o container
COPY . .

# Gera o client Prisma (compila schema.prisma)
RUN npx prisma generate

# Expõe a porta que o Fastify vai usar
EXPOSE 3001

# Comando para rodar a aplicação
CMD ["sh", "-c", "npx prisma migrate deploy && tsx src/server.ts"]
