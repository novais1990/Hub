# Deploy no Discloud

Este guia explica como fazer o deploy do projeto Hub no Discloud.

## ⚙️ Configuração Atual

O arquivo `discloud.config` na raiz do projeto está configurado para hospedar o **Payment Bot**:

```
TYPE=bot
MAIN=payment-bot/src/index.js
NAME=Bothub
RAM=300
AUTORESTART=true
```

## 📦 Instalação Automática de Dependências

O `package.json` raiz inclui um script `postinstall` que instala automaticamente as dependências do payment-bot:

```json
"postinstall": "npm install --prefix payment-bot"
```

### Como Funciona

1. Você faz upload do projeto para o Discloud
2. O Discloud executa `npm install` na raiz
3. O hook `postinstall` é acionado automaticamente
4. O script executa `npm install --prefix payment-bot`
5. As dependências são instaladas em `payment-bot/node_modules/`
6. O bot inicia com todos os módulos necessários

## 🚀 Passos para Deploy

1. **Configure as variáveis de ambiente no Discloud:**
   - `DISCORD_TOKEN` - Token do payment bot
   - `CLIENT_ID` - ID da aplicação do payment bot
   - `GUILD_ID` - ID do servidor principal
   - `MERCADO_PAGO_TOKEN` - Token do Mercado Pago
   - `SUBSCRIPTION_PRICE` - Preço da assinatura em centavos
   - `SUBSCRIBER_ROLE_ID` - ID do cargo de assinante

2. **Faça upload do projeto:**
   - Inclua todos os arquivos do repositório
   - O Discloud detectará o `discloud.config` automaticamente

3. **Aguarde a instalação:**
   - O Discloud executará `npm install`
   - O `postinstall` instalará as dependências do payment-bot
   - O bot iniciará automaticamente

## 🔄 Deploy do Sales Bot

Se você quiser hospedar o **Sales Bot** no Discloud em vez do Payment Bot, você precisará:

1. **Criar um novo `discloud.config` apontando para o sales-bot:**
   ```
   TYPE=bot
   MAIN=sales-bot/src/index.js
   NAME=SalesBot
   RAM=256
   AUTORESTART=true
   ```

2. **Atualizar o script postinstall no `package.json` raiz:**
   ```json
   "postinstall": "npm install --prefix sales-bot"
   ```

3. **Configurar as variáveis de ambiente do sales-bot no Discloud**

## ⚠️ Importante

- O `postinstall` só instala dependências de **um bot por vez** (o definido no `discloud.config`)
- Para desenvolvimento local com ambos os bots, use: `npm run install:all`
- Não é possível rodar sales-bot e payment-bot no mesmo container Discloud

## 🆘 Resolução de Problemas

### "Cannot find module" ao iniciar

- Verifique se o `postinstall` foi executado nos logs do Discloud
- Confirme que o `MAIN` no `discloud.config` aponta para o arquivo correto
- Tente fazer um redeploy forçando a reinstalação

### Bot não inicia

- Verifique as variáveis de ambiente no painel do Discloud
- Consulte os logs do container para ver mensagens de erro
- Confirme que o token do Discord está válido

### Dependências desatualizadas

- Atualize o `package.json` na pasta do bot (sales-bot ou payment-bot)
- Faça commit e push das mudanças
- Faça redeploy no Discloud
