# Usa a imagem oficial do Node.js 18 LTS
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm ci --omit=dev

# Copia o código fonte
COPY src/ ./src/

# Define variáveis de ambiente padrão (podem ser sobrescritas)
ENV NODE_ENV=production

# Cria um usuário não-root para executar a aplicação
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# Define o usuário para executar o container
USER nodejs

# Comando para iniciar o bot
CMD ["npm", "start"]
