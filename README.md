# Hub — Bot de Vendas Automatizadas para Discord

Bot de vendas automatizadas para Discord com painel de configuração interativo usando **Discord Components V2** (containers, text displays, separadores, menus e botões).

---

## Funcionalidades

### Painel de Configuração (`/painel`)
Abre um painel interativo efêmero (visível apenas para o administrador) com três seções:

| Seção | O que configura |
|---|---|
| **Canal Logs** | Canais de log para tickets fechados, vendas, transcritos e tickets abertos |
| **Cargo Cliente** | Cargo atribuído automaticamente ao comprador após a venda |
| **Criar Anúncio** | Publica um anúncio formatado de produto/serviço em um canal |

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

---

## Pré-requisitos

- **Node.js** ≥ 18
- **discord.js** ≥ 14.16.0 (suporte a Components V2)
- Bot criado no [Discord Developer Portal](https://discord.com/developers/applications) com os seguintes escopos: `bot`, `applications.commands`
- Permissões do bot: `Send Messages`, `Embed Links`, `Use Application Commands`

---

## Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/novais1990/Hub.git
cd Hub

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# edite .env com seu token e IDs
```

### `.env`
```env
DISCORD_TOKEN=seu_token_aqui
CLIENT_ID=seu_client_id_aqui
GUILD_ID=seu_guild_id_aqui   # opcional: para registrar comandos só na sua guild (mais rápido em dev)
```

---

## Uso

```bash
# Registrar os slash commands no Discord
npm run deploy

# Iniciar o bot
npm start
```

Após iniciar, use `/painel` em qualquer canal do servidor (requer permissão de Administrador).

---

## Estrutura do Projeto

```
src/
├── index.js                  # Ponto de entrada — cliente Discord e eventos
├── deploy-commands.js        # Registra os slash commands
├── commands/
│   └── painel.js             # Comando /painel
├── handlers/
│   └── interactionHandler.js # Handler de botões, selects e modais
├── panels/
│   ├── painelHome.js         # Painel inicial
│   ├── painelCanalLogs.js    # Painel de configuração de canais
│   ├── painelCargoCliente.js # Painel de configuração de cargo
│   └── painelAnuncio.js      # Painel de criação de anúncio
└── utils/
    ├── emojis.js             # Constantes de emoji
    └── componentsV2.js       # Helpers REST para Components V2
```

---

## Tecnologias

- [discord.js v14](https://discord.js.org/)
- [Discord Components V2](https://discord.com/developers/docs/components/reference) (Containers, TextDisplay, Separator)
- [dotenv](https://github.com/motdotla/dotenv)
