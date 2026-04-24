# Usa a imagem oficial do Node.js 18 LTS
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm ci --only=production

# Copia o código fonte
COPY src/ ./src/

# Define variáveis de ambiente padrão (podem ser sobrescritas)
ENV NODE_ENV=production

# Comando para iniciar o bot
CMD ["npm", "start"]
