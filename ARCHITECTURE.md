# Sistema Hub - Visão Geral da Arquitetura

## 🎯 Dois Bots, Um Sistema

### Bot 1: Sales Bot (Bot de Vendas)
**Localização:** `/src`
**Propósito:** Bot personalizado para cada cliente, com painel de configuração completo

#### Funcionalidades
- ✅ Configuração de canais de log (tickets fechados, vendas, transcritos, abertos)
- ✅ Configuração de cargo de cliente
- ✅ Criação de anúncios automatizados
- ✅ **NOVO:** Configuração de token Mercado Pago

#### Comando Principal
```
/painel → Abre painel interativo Components V2
```

---

### Bot 2: Payment Bot (Bot de Pagamento)
**Localização:** `/payment-bot`
**Propósito:** Gerenciar assinaturas e provisionar bots de vendas para clientes

#### Funcionalidades
- ✅ Criar canal privado de setup
- ✅ Processar pagamento de assinatura (simulado em dev)
- ✅ Modal para configuração do bot (Owner ID, Client ID, Token)
- ✅ Provisionamento automático de instância do bot de vendas
- ✅ Bot fica online em segundos

#### Comando Principal
```
/setup → Inicia processo de contratação
```

---

## 🔄 Fluxo Completo do Sistema

```
┌─────────────────────────────────────────────────────────┐
│              CLIENTE QUER CONTRATAR BOT                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   Payment Bot Online   │
         │   Cliente usa /setup   │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────────┐
         │  Canal Privado Criado     │
         │  "setup-{username}"       │
         └───────────┬───────────────┘
                     │
                     ▼
         ┌────────────────────────────┐
         │  Botão: Pagar Assinatura   │
         │  (R$ 50,00/mês)            │
         └───────────┬────────────────┘
                     │
                     ▼ (pagamento confirmado)
         ┌────────────────────────────┐
         │  Botão: Configurar Bot     │
         └───────────┬────────────────┘
                     │
                     ▼
         ┌─────────────────────────────┐
         │  Modal: Preencher Dados     │
         │  • ID do dono               │
         │  • Client ID                │
         │  • Token                    │
         └───────────┬─────────────────┘
                     │
                     ▼
         ┌─────────────────────────────────┐
         │  Bot Manager                    │
         │  spawn() → processo filho       │
         │  Injeta env vars                │
         └───────────┬─────────────────────┘
                     │
                     ▼
         ┌─────────────────────────────────┐
         │  SALES BOT ONLINE               │
         │  No servidor do cliente         │
         └───────────┬─────────────────────┘
                     │
                     ▼
         ┌─────────────────────────────────┐
         │  Cliente usa /painel            │
         │  • Configura canais             │
         │  • Configura cargo              │
         │  • Cria anúncios                │
         │  • Configura Mercado Pago       │
         └─────────────────────────────────┘
```

---

## 🏗️ Arquitetura Técnica

### Isolamento de Processos

Cada bot de vendas roda em seu próprio processo Node.js:

```javascript
// payment-bot/src/utils/botManager.js
const botProcess = spawn('node', ['../../../src/index.js'], {
  env: {
    DISCORD_TOKEN: config.token,
    CLIENT_ID: config.clientId,
    GUILD_ID: guildId,
  },
  detached: true,  // Roda independentemente
  stdio: 'ignore',
});
```

**Vantagens:**
- ✅ Falha de um bot não afeta outros
- ✅ Recursos isolados por cliente
- ✅ Fácil de escalar horizontalmente
- ✅ Simples de monitorar individualmente

---

## 🔐 Armazenamento de Dados

### Desenvolvimento (Atual)
```javascript
// Em memória - Maps
const guildConfigs = new Map();      // Sales bot
const botConfigs = new Map();        // Payment bot
const paymentStatus = new Map();     // Payment bot
```

### Produção (Recomendado)
```javascript
// MongoDB, PostgreSQL, ou similar
{
  guildId: "123...",
  config: {
    canais: {...},
    cargo: "...",
    mercadoPago: "...",
  },
  bot: {
    ownerId: "...",
    clientId: "...",
    token: "...",  // Criptografado
    status: "online",
  },
  subscription: {
    active: true,
    expiresAt: Date,
    plan: "mensal",
  }
}
```

---

## 🚀 Próximos Passos para Produção

### Crítico
1. **Banco de Dados**
   - Migrar Maps para MongoDB/PostgreSQL
   - Criptografar tokens sensíveis
   - Implementar backups automáticos

2. **Mercado Pago Real**
   - Integrar SDK do Mercado Pago
   - Criar webhooks para notificações
   - Validar pagamentos antes de provisionar

3. **Gestão de Assinaturas**
   - Sistema de renovação automática
   - Parar bots quando assinatura vence
   - Notificar clientes sobre vencimento

### Importante
4. **Monitoramento**
   - Health checks dos bots provisionados
   - Logs centralizados (Winston + Loki)
   - Alertas para falhas

5. **Segurança**
   - Validar IDs e tokens antes de usar
   - Rate limiting em comandos
   - Auditoria de ações administrativas

6. **Escalabilidade**
   - Load balancer para múltiplas instâncias do Payment Bot
   - Queue system para provisionamento (Bull/RabbitMQ)
   - Auto-scaling baseado em carga

---

## 📊 Comparação: Antes vs Agora

### Antes (Primeira Implementação)
```
✅ Bot de vendas básico
✅ Painel /painel com 3 seções
   • Canal Logs
   • Cargo Cliente
   • Criar Anúncio
```

### Agora (Segunda Implementação)
```
✅ Bot de vendas expandido
✅ Painel /painel com 4 seções
   • Canal Logs
   • Cargo Cliente
   • Criar Anúncio
   • 🆕 Mercado Pago

✅ 🆕 Payment Bot completo
   • Comando /setup
   • Sistema de pagamento (simulado)
   • Provisionamento automático
   • Gestão de múltiplos bots
```

---

## 🎓 Conceitos-Chave

### Components V2
- Container (type: 17)
- TextDisplay (type: 14)
- Separator (type: 13)
- Enviados via REST com flag `IS_COMPONENTS_V2 = 1 << 15`

### Child Process
- `spawn()` cria processo filho isolado
- `detached: true` permite execução independente
- Variáveis de ambiente injetadas dinamicamente

### Bot Provisioning
- Cliente fornece credenciais via modal
- Payment Bot valida e inicia Sales Bot
- Sales Bot usa credenciais fornecidas
- Processo roda até ser explicitamente parado

---

## 🧪 Como Testar

### 1. Testar Sales Bot Standalone
```bash
cd Hub
cp .env.example .env
# Editar .env com suas credenciais
npm install
npm run deploy
npm start
# Usar /painel no Discord
```

### 2. Testar Payment Bot
```bash
cd payment-bot
cp .env.example .env
# Editar .env com credenciais do payment bot
npm install
npm run deploy
npm start
# Usar /setup no Discord
```

### 3. Testar Fluxo Completo
```bash
# Terminal 1: Payment Bot
cd payment-bot && npm start

# Terminal 2: (aguardar provisionamento)
# O Sales Bot será iniciado automaticamente
# pelo Payment Bot após /setup
```

---

## ❓ FAQ

**P: Posso rodar múltiplos Payment Bots?**
R: Sim, mas compartilharão o mesmo Map em memória. Use banco de dados para clustering.

**P: O que acontece se o Payment Bot cair?**
R: Sales Bots continuam rodando (processos detached), mas não será possível provisionar novos até reiniciar.

**P: Como parar um Sales Bot provisionado?**
R: Atualmente, via `botManager.stopBot(guildId)`. Recomenda-se adicionar comando admin.

**P: Os dados sobrevivem a reinicialização?**
R: Não (memória). Em produção, use banco de dados persistente.

**P: Posso usar o mesmo bot para sales e payment?**
R: Tecnicamente sim, mas não recomendado. Separação de responsabilidades é importante para escala e manutenção.

---

## 📝 Checklist de Deploy em Produção

- [ ] Configurar banco de dados (MongoDB/PostgreSQL)
- [ ] Migrar Maps para BD
- [ ] Criptografar tokens sensíveis
- [ ] Integrar Mercado Pago SDK real
- [ ] Criar webhooks para pagamentos
- [ ] Implementar renovação de assinaturas
- [ ] Adicionar sistema de logs (Winston)
- [ ] Configurar monitoramento (Prometheus/Grafana)
- [ ] Implementar health checks
- [ ] Adicionar comandos administrativos
- [ ] Configurar backups automáticos
- [ ] Testar failover e recovery
- [ ] Documentar runbook operacional
- [ ] Treinar equipe de suporte

---

**Status:** ✅ Sistema funcional em modo de desenvolvimento
**Próximo passo:** Migrar para produção com banco de dados e Mercado Pago real
