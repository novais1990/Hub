# Usa a imagem oficial do Node.js 18 LTS
FROM node:18-alpine

# Cria um usuário não-root para executar a aplicação
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências com ownership correto
COPY --chown=nodejs:nodejs package*.json ./

# Muda para o usuário nodejs para instalar dependências
USER nodejs

# Instala as dependências e limpa o cache do npm
RUN npm ci --omit=dev && \
    npm cache clean --force

# Copia o código fonte com ownership correto
COPY --chown=nodejs:nodejs src/ ./src/

# Define variáveis de ambiente padrão (podem ser sobrescritas)
ENV NODE_ENV=production

# Comando para iniciar o bot
CMD ["npm", "start"]
