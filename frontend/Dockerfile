# ./frontend/Dockerfile

# Usa imagem oficial do Node.js
FROM node:18

# Define diretório de trabalho no container
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código para dentro do container
COPY . .

# Expõe a porta do Next.js
EXPOSE 3000

# Comando para rodar o dev server
CMD ["npm", "run", "dev"]
