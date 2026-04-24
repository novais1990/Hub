# Hub — Sistema de Bots de Vendas Automatizadas para Discord

Sistema completo com dois bots integrados:
1. **Sales Bot** — Bot configurável com painel administrativo usando Discord Components V2
2. **Payment Bot** — Bot de gerenciamento de assinaturas e provisionamento automático

---

## 📦 Componentes do Sistema

### 🤖 Sales Bot (`/sales-bot`)
Bot de vendas automatizadas com painel de configuração interativo usando **Discord Components V2** (containers, text displays, separadores, menus e botões). Cada cliente que contratar o serviço recebe uma instância isolada deste bot.

### 💳 Payment Bot (`/payment-bot`)
Bot de gerenciamento que processa pagamentos de assinaturas e provisiona automaticamente novos bots de vendas para clientes.

---

## 🎯 Sales Bot — Funcionalidades

### Painel de Configuração (`/painel`)
Abre um painel interativo efêmero (visível apenas para o administrador) com quatro seções:

| Seção | O que configura |
|---|---|
| **Canal Logs** | Canais de log para tickets fechados, vendas, transcritos e tickets abertos |
| **Cargo Cliente** | Cargo atribuído automaticamente ao comprador após a venda |
| **Criar Anúncio** | Publica um anúncio formatado de produto/serviço em um canal |
| **Mercado Pago** | Token de produção do Mercado Pago para processar pagamentos |

### Fluxo de Canal Logs
1. Selecione o tipo de log (ticket fechado, vendas, transcript, ticket aberto)
2. Selecione o canal do servidor
3. Clique em **Confirmar** — configuração salva e mensagem de confirmação enviada
4. Clique em **Excluir** para remover a configuração salva
5. Clique em **Cancelar** ou **Voltar Home** para voltar ao painel inicial

### Fluxo de Cargo Cliente
1. Selecione o cargo no menu
2. Clique em **Confirmar** — cargo salvo

### Fluxo de Criar Anúncio
1. Selecione o canal de publicação
2. Selecione o tipo de produto/serviço
3. Clique em **Criar Anúncio** — preencha título, descrição e preço no modal
4. O bot publica o anúncio no canal selecionado e confirma para o admin

### Fluxo de Mercado Pago
1. Clique em **Configurar Token**
2. Cole o token de produção do Mercado Pago no modal
3. Token é salvo de forma segura (mascarado na confirmação)
4. Use o token para processar pagamentos automaticamente

---

## 💳 Payment Bot — Funcionalidades

### Sistema de Assinatura
- **Comando `/setup`**: Inicia processo de contratação
- **Canal privado**: Criado automaticamente para cada cliente
- **Pagamento**: Integração com Mercado Pago
- **Provisionamento**: Bot online em segundos após configuração

### Fluxo Completo de Contratação

```
1. Cliente executa /setup
   ↓
2. Bot cria canal privado "setup-{username}"
   ↓
3. Cliente clica em "Pagar Assinatura"
   ↓
4. (Após pagamento confirmado) Cliente clica em "Configurar Bot"
   ↓
5. Cliente preenche modal com:
   • ID do dono do servidor
   • ID da aplicação (Client ID)
   • Token da aplicação
   ↓
6. Bot provisiona instância automaticamente
   ↓
7. Bot de vendas fica online no servidor do cliente
```

---

## 🚀 Instalação Rápida

> 📖 Para o guia completo passo a passo, consulte o [SETUP.md](./SETUP.md).

### Sales Bot

```bash
cd sales-bot
npm install
cp .env.example .env
# Edite .env com seu token e IDs
npm run deploy  # Registrar comando /painel
npm start       # Iniciar o bot
```

### Payment Bot

```bash
cd payment-bot
npm install
cp .env.example .env
# Edite .env com as configurações do payment bot
npm run deploy  # Registrar comando /setup
npm start       # Iniciar o bot de pagamento
```

### `.env` (Sales Bot)
```env
DISCORD_TOKEN=seu_token_aqui
CLIENT_ID=seu_client_id_aqui
GUILD_ID=seu_guild_id_aqui   # opcional: para registrar comandos só na sua guild (mais rápido em dev)
```

### `.env` (Payment Bot)
```env
DISCORD_TOKEN=seu_token_do_payment_bot
CLIENT_ID=seu_client_id_do_payment_bot
GUILD_ID=seu_guild_id  # opcional
MERCADO_PAGO_TOKEN=seu_token_mercado_pago
SUBSCRIPTION_PRICE=5000  # em centavos (5000 = R$ 50,00)
SUBSCRIBER_ROLE_ID=id_do_cargo_de_assinante
```

---

## 📁 Estrutura do Projeto

```
Hub/
├── sales-bot/                       # Bot de Vendas (alugável por cliente)
│   ├── src/
│   │   ├── index.js                 # Ponto de entrada
│   │   ├── deploy-commands.js       # Registra /painel
│   │   ├── commands/
│   │   │   └── painel.js            # Comando /painel
│   │   ├── handlers/
│   │   │   └── interactionHandler.js # Handler de interações
│   │   ├── panels/
│   │   │   ├── painelHome.js         # Painel inicial
│   │   │   ├── painelCanalLogs.js    # Painel de canais
│   │   │   ├── painelCargoCliente.js # Painel de cargo
│   │   │   ├── painelAnuncio.js      # Painel de anúncios
│   │   │   ├── painelMercadoPago.js  # Painel Mercado Pago
│   │   │   └── painelPlanos.js       # Painel de planos
│   │   └── utils/
│   │       ├── emojis.js             # Constantes de emoji
│   │       └── componentsV2.js       # Helpers Components V2
│   ├── package.json
│   └── .env.example
│
├── payment-bot/                     # Bot de Pagamento (único)
│   ├── src/
│   │   ├── index.js                 # Ponto de entrada
│   │   ├── deploy-commands.js       # Registra /setup
│   │   ├── commands/
│   │   │   └── setup.js             # Comando /setup
│   │   ├── handlers/
│   │   │   └── paymentHandler.js   # Handler de pagamentos
│   │   └── utils/
│   │       ├── emojis.js            # Constantes
│   │       └── botManager.js        # Gerenciador de bots
│   ├── package.json
│   ├── README.md
│   └── .env.example
│
├── docker-compose.yml               # Para fácil deployment
├── package.json                     # Scripts de workspace
├── SETUP.md                         # Guia passo a passo
└── README.md                        # Este arquivo
```

---

## 🔧 Pré-requisitos

- **Node.js** ≥ 18
- **discord.js** ≥ 14.16.0 (suporte a Components V2)
- Bot(s) criado(s) no [Discord Developer Portal](https://discord.com/developers/applications)
  - Um bot para vendas (para cada cliente)
  - Um bot para gerenciar pagamentos
- Conta no Mercado Pago (para produção)

---

## 🎨 Tecnologias

- [discord.js v14](https://discord.js.org/)
- [Discord Components V2](https://discord.com/developers/docs/components/reference)
- [Node.js Child Processes](https://nodejs.org/api/child_process.html) (provisionamento)
- [dotenv](https://github.com/motdotla/dotenv)

---

## 🔐 Segurança

### Boas Práticas

1. **Nunca comite arquivos `.env`** — Já incluídos no `.gitignore`
2. **Use banco de dados em produção** — Armazenamento em memória é apenas para desenvolvimento
3. **Criptografe tokens sensíveis** — Especialmente tokens do Mercado Pago
4. **Valide entradas de usuário** — IDs e tokens devem ser validados
5. **Implemente rate limiting** — Previna abuso de comandos

### Limitações de Desenvolvimento

⚠️ O sistema atual usa armazenamento em memória. Para produção:
- Migre para MongoDB, PostgreSQL ou outro banco de dados
- Implemente autenticação de pagamento real via webhook Mercado Pago
- Adicione logs persistentes
- Configure monitoramento de saúde dos bots

---

## 🌟 Como Funciona o Provisionamento

1. **Payment Bot** recebe as credenciais via modal
2. **Bot Manager** cria um processo filho do bot de vendas (`sales-bot/src/index.js`)
3. Injeta variáveis de ambiente (TOKEN, CLIENT_ID, GUILD_ID)
4. Bot de vendas inicia automaticamente
5. Cliente pode usar `/painel` imediatamente

Cada bot roda em **processo isolado**, garantindo que:
- Falhas não afetam outros bots
- Recursos são gerenciados independentemente
- Configurações são únicas por cliente

---

## 📚 Documentação Adicional

- [Guia de Setup](./SETUP.md)
- [Sales Bot — Código Fonte](./sales-bot/)
- [Payment Bot — Documentação Completa](./payment-bot/README.md)
- [Discord.js Documentation](https://discord.js.org/)
- [Discord Components V2](https://discord.com/developers/docs/components/reference)

---

## 🐛 Troubleshooting

### Bot não inicia
- Verifique se o token está correto no `.env`
- Confirme que o CLIENT_ID corresponde ao bot
- Veja os logs no console para erros específicos

### Comando /painel não aparece
- Execute `npm run deploy` dentro da pasta `sales-bot/`
- Se usando GUILD_ID, confirme que está no servidor correto
- Aguarde até 1 hora para comandos globais

### Comando /setup não aparece
- Execute `npm run deploy` dentro da pasta `payment-bot/`
- Confirme que o bot de pagamento está no servidor correto

### Bot provisionado não fica online
- Verifique se as credenciais fornecidas estão corretas
- Confirme que o token do bot de vendas é válido
- Veja os logs do Payment Bot para detalhes do erro
- Verifique o arquivo `logs/bot-{guildId}.log`

---

## 🤝 Contribuindo

Este é um sistema modular. Para adicionar funcionalidades:

1. **Novo painel no bot de vendas**: Crie em `sales-bot/src/panels/`
2. **Novo comando no sales-bot**: Adicione em `sales-bot/src/commands/`
3. **Novo comando no payment-bot**: Adicione em `payment-bot/src/commands/`
4. **Nova integração**: Crie em `sales-bot/src/utils/` ou `payment-bot/src/utils/`

---

## 📄 Licença

Hub Bot System — Sistema de Vendas Automatizadas para Discord

