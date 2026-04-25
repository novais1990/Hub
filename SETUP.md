# SETUP.md — Guia de Configuração Passo a Passo

Este guia explica como configurar e rodar os dois bots do sistema Hub.

---

## 📋 Pré-requisitos

- **Node.js** ≥ 18 ([download](https://nodejs.org/))
- Conta no [Discord Developer Portal](https://discord.com/developers/applications)
- **Dois bots Discord** criados (um para vendas, um para pagamento)
- (Opcional) Conta no Mercado Pago para produção

---

## 🗂️ Estrutura do Projeto

```
Hub/
├── sales-bot/        # Bot de Vendas — instalado em cada servidor cliente
│   ├── src/
│   ├── package.json
│   └── .env.example
│
├── payment-bot/      # Bot de Pagamento — único, gerencia assinaturas
│   ├── src/
│   ├── package.json
│   └── .env.example
│
├── docker-compose.yml
├── SETUP.md          # Este arquivo
└── README.md
```

---

## 🤖 Etapa 1 — Criar os Bots no Discord Developer Portal

### Bot de Vendas (sales-bot)

1. Acesse [discord.com/developers/applications](https://discord.com/developers/applications)
2. Clique em **New Application** → dê um nome (ex: `MeuBot Vendas`)
3. Vá em **Bot** → clique em **Reset Token** → copie o token
4. Em **Bot**, habilite: **Message Content Intent** (se necessário)
5. Vá em **OAuth2 → URL Generator**:
   - Scopes: `bot`, `applications.commands`
   - Bot Permissions: `Administrator` (ou no mínimo: `Send Messages`, `Manage Channels`, `Use Slash Commands`)
6. Copie a URL gerada e adicione o bot ao seu servidor de testes

### Bot de Pagamento (payment-bot)

Repita os passos acima para um **segundo bot** com um nome diferente (ex: `Hub Payment`).

---

## ⚙️ Etapa 2 — Configurar as Variáveis de Ambiente

### Sales Bot

```bash
cd sales-bot
cp .env.example .env
```

Edite `sales-bot/.env`:

```env
# Token do bot de vendas (do Discord Developer Portal)
DISCORD_TOKEN=seu_token_do_sales_bot

# ID da aplicação do bot de vendas (aba "General Information" → "Application ID")
CLIENT_ID=seu_client_id_do_sales_bot

# ID do seu servidor de testes (para registrar comandos instantaneamente)
# Clique com botão direito no servidor no Discord → "Copiar ID do servidor"
GUILD_ID=id_do_seu_servidor_de_testes
```

### Payment Bot

```bash
cd payment-bot
cp .env.example .env
```

Edite `payment-bot/.env`:

```env
# Token do bot de pagamento
DISCORD_TOKEN=seu_token_do_payment_bot

# ID da aplicação do payment bot
CLIENT_ID=seu_client_id_do_payment_bot

# ID do servidor onde o payment bot opera (seu servidor principal)
GUILD_ID=id_do_seu_servidor_principal

# Token do Mercado Pago (modo produção: APP_USR-..., modo dev: TEST-...)
MERCADO_PAGO_TOKEN=seu_token_mercado_pago

# Preço da assinatura em centavos (ex: 5000 = R$ 50,00)
SUBSCRIPTION_PRICE=5000

# ID do cargo que clientes ativos receberão no seu servidor
SUBSCRIBER_ROLE_ID=id_do_cargo_assinante
```

---

## 📦 Etapa 3 — Instalar Dependências

```bash
# Sales Bot
cd sales-bot
npm install

# Payment Bot
cd ../payment-bot
npm install
```

Ou, a partir da raiz do projeto:

```bash
npm run install:all
```

---

## 🚀 Etapa 4 — Registrar Slash Commands

Os slash commands precisam ser registrados na API do Discord antes de aparecerem.

### Sales Bot (`/painel`)

```bash
cd sales-bot
npm run deploy
```

Saída esperada:
```
✅ Comando preparado para deploy: /painel
📦 Total de 1 comando(s) para registrar
🔄 Registrando slash commands...
✅ 1 comando(s) registrado(s) na guild SEU_GUILD_ID
```

### Payment Bot (`/setup`)

```bash
cd ../payment-bot
npm run deploy
```

Saída esperada:
```
✅ Comando preparado para deploy: /setup
📦 Total de 1 comando(s) para registrar
🔄 Registrando slash commands do bot de pagamento...
✅ 1 comando(s) registrado(s) na guild SEU_GUILD_ID
```

> ⚡ **Com `GUILD_ID`**: comandos aparecem **instantaneamente**
> 
> 🕐 **Sem `GUILD_ID`** (global): pode levar **até 1 hora** para aparecer

---

## ▶️ Etapa 5 — Iniciar os Bots

Abra dois terminais separados:

**Terminal 1 — Sales Bot:**
```bash
cd sales-bot
npm start
```

Saída esperada:
```
✅ Comando carregado: /painel
📦 Total de 1 comando(s) carregado(s)
✅ Bot online como MeuBot Vendas#1234
📡 Servidor(es) conectado(s): 1
```

**Terminal 2 — Payment Bot:**
```bash
cd payment-bot
npm start
```

Saída esperada:
```
✅ Comando carregado: /setup
📦 Total de 1 comando(s) carregado(s)
✅ Bot online como Hub Payment#5678
📡 Servidor(es) conectado(s): 1
🤖 Pronto para provisionar bots de vendas
```

---

## 🧪 Etapa 6 — Testar

### Testando o Sales Bot

1. No servidor onde o bot de vendas foi adicionado, use: `/painel`
2. O painel de configuração deve aparecer (visível apenas para você)
3. Teste as opções: Canal Logs, Cargo Cliente, Criar Anúncio, Mercado Pago

### Testando o Payment Bot

1. No servidor do payment bot, use: `/setup`
2. Um canal privado `setup-{seu-username}` deve ser criado
3. Clique em **Pagar Assinatura** → confirma automaticamente (modo dev)
4. Clique em **Configurar Bot** → preencha os dados do bot de vendas
5. O bot de vendas é provisionado automaticamente

---

## 🐳 Alternativa: Docker

Se você tiver Docker instalado:

```bash
# Criar os arquivos .env antes:
cp sales-bot/.env.example sales-bot/.env
cp payment-bot/.env.example payment-bot/.env
# Edite ambos os .env com suas credenciais

# Subir todos os serviços:
docker-compose up -d

# Ver logs:
docker-compose logs -f

# Parar:
docker-compose down
```

> ✅ Os arquivos `Dockerfile` já estão incluídos em cada pasta do bot.

---

## ❓ Resolução de Problemas

### Comandos não aparecem no Discord

1. Verifique se `npm run deploy` executou sem erros
2. Confirme que `CLIENT_ID` e `DISCORD_TOKEN` estão corretos no `.env`
3. Se usou `GUILD_ID`, confirme que o bot está naquele servidor
4. Se global (sem `GUILD_ID`), aguarde até 1 hora

### Bot não inicia

- Verifique se `DISCORD_TOKEN` está correto
- Confirme que o bot tem as permissões necessárias
- Veja o erro no console — geralmente indica o problema

### Bot provisionado não fica online (payment-bot)

- Verifique se o token do sales-bot é válido
- O `CLIENT_ID` do sales-bot deve corresponder ao token
- O `logs/bot-{guildId}.log` contém os logs do bot provisionado

### Erro "Cannot find module"

- Execute `npm install` dentro da pasta do bot (`sales-bot/` ou `payment-bot/`)

---

## 📚 Variáveis de Ambiente — Referência Completa

### sales-bot/.env

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DISCORD_TOKEN` | ✅ Sim | Token do bot de vendas |
| `CLIENT_ID` | ✅ Sim | Application ID do bot de vendas |
| `GUILD_ID` | ⚡ Recomendado | ID do servidor para testes (comandos instantâneos) |

### payment-bot/.env

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DISCORD_TOKEN` | ✅ Sim | Token do bot de pagamento |
| `CLIENT_ID` | ✅ Sim | Application ID do bot de pagamento |
| `GUILD_ID` | ⚡ Recomendado | ID do servidor onde o payment bot opera |
| `MERCADO_PAGO_TOKEN` | 🏭 Produção | Token da API do Mercado Pago |
| `SUBSCRIPTION_PRICE` | Não | Preço em centavos (padrão: 5000 = R$ 50,00) |
| `SUBSCRIBER_ROLE_ID` | Não | ID do cargo para assinantes ativos |

---

*Para dúvidas, consulte o [README.md](./README.md) ou abra uma issue.*
