# Usa a imagem oficial do Node.js 18 LTS
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências com ownership correto para o usuário node
COPY --chown=node:node package*.json ./

# Instala as dependências e limpa o cache
RUN npm ci --omit=dev && \
    npm cache clean --force

# Copia o código fonte com ownership correto
COPY --chown=node:node src/ ./src/

# Define variáveis de ambiente padrão (podem ser sobrescritas)
ENV NODE_ENV=production

# Define o usuário para executar o container
USER node

# Comando para iniciar o bot
CMD ["npm", "start"]
