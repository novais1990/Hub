# Payment Bot — Gerenciador de Assinaturas

Bot de gerenciamento de pagamentos e provisionamento automático de bots de vendas. Este bot é responsável por processar pagamentos de assinatura e criar instâncias personalizadas do bot de vendas para cada cliente.

---

## Funcionalidades

### Sistema de Assinatura
- **Comando `/setup`**: Inicia o processo de contratação
- **Canal privado**: Criado automaticamente para cada cliente
- **Processamento de pagamento**: Integração com Mercado Pago (simulado em desenvolvimento)
- **Provisionamento automático**: Bot de vendas online em segundos após configuração

### Fluxo Completo

1. **Contratação**
   ```
   Cliente executa: /setup
   → Bot cria canal privado "setup-{username}"
   → Apresenta informações da assinatura
   → Botão "Pagar Assinatura"
   ```

2. **Pagamento**
   ```
   Cliente clica em "Pagar Assinatura"
   → (Em produção) Gera link de pagamento Mercado Pago
   → (Desenvolvimento) Simula pagamento confirmado
   → Botão "Configurar Bot" liberado
   ```

3. **Configuração**
   ```
   Cliente clica em "Configurar Bot"
   → Abre modal para preencher:
     • ID do dono do servidor
     • ID da aplicação (Client ID)
     • Token da aplicação
   → Bot provisiona a instância
   → Bot fica online automaticamente
   ```

4. **Uso**
   ```
   Cliente usa /painel no seu servidor
   → Acessa todas as funcionalidades do bot de vendas
   ```

---

## Pré-requisitos

- **Node.js** ≥ 18
- **discord.js** ≥ 14.16.0
- Bot criado no [Discord Developer Portal](https://discord.com/developers/applications)
- Conta no Mercado Pago (para produção)

---

## Instalação

```bash
# 1. Navegue até o diretório do payment-bot
cd payment-bot

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
# As variáveis de ambiente devem ser definidas no sistema,
# via Docker, ou através de ferramentas de deployment.
# O bot NÃO usa mais o pacote 'dotenv'.
```

### Variáveis de ambiente necessárias

```env
DISCORD_TOKEN=seu_token_do_payment_bot
CLIENT_ID=seu_client_id_do_payment_bot
GUILD_ID=seu_guild_id  # opcional
MERCADO_PAGO_TOKEN=seu_token_mercado_pago
SUBSCRIPTION_PRICE=5000  # em centavos (5000 = R$ 50,00)
SUBSCRIBER_ROLE_ID=id_do_cargo_de_assinante
```

**Como definir as variáveis:**

- **Docker:** Use o arquivo `docker-compose.yml` ou a flag `-e` no `docker run`
- **Sistema Linux/Mac:** `export DISCORD_TOKEN=seu_token`
- **Sistema Windows:** `set DISCORD_TOKEN=seu_token` (cmd) ou `$env:DISCORD_TOKEN="seu_token"` (PowerShell)
- **Node.js diretamente:** `DISCORD_TOKEN=seu_token npm start`
```

---

## Uso

```bash
# Registrar o comando /setup
npm run deploy

# Iniciar o bot de pagamento
npm start
```

### Comandos Disponíveis

| Comando | Descrição | Permissões |
|---------|-----------|------------|
| `/setup` | Inicia processo de contratação do bot | Administrador |

---

## Estrutura do Projeto

```
payment-bot/
├── src/
│   ├── index.js                     # Ponto de entrada
│   ├── deploy-commands.js           # Registra comandos
│   ├── commands/
│   │   └── setup.js                 # Comando /setup
│   ├── handlers/
│   │   └── paymentHandler.js       # Handler de interações
│   └── utils/
│       ├── emojis.js                # Constantes de emoji
│       └── botManager.js            # Gerenciador de bots provisionados
├── package.json
└── .env.example
```

---

## Arquitetura

### Bot Manager (`utils/botManager.js`)

Responsável por:
- Iniciar novas instâncias de bots de vendas
- Gerenciar processos de bots em execução
- Armazenar configurações de bots (em memória*)

*Em produção, use um banco de dados persistente (MongoDB, PostgreSQL, etc.)

### Payment Handler (`handlers/paymentHandler.js`)

Gerencia:
- Fluxo de pagamento (botões)
- Modal de configuração do bot
- Integração com Bot Manager
- Status de pagamento dos usuários

### Setup Command (`commands/setup.js`)

Cria:
- Canal privado para cada cliente
- Mensagem de boas-vindas com informações
- Botão inicial para pagamento

---

## Integração com Mercado Pago

### Desenvolvimento (Simulação)

O código atual simula o pagamento automaticamente para facilitar testes.

### Produção (Implementação Real)

Para integração real com Mercado Pago:

1. **Instale o SDK:**
   ```bash
   npm install mercadopago
   ```

2. **Substitua a simulação em `paymentHandler.js`:**
   ```javascript
   case 'btn_pay_subscription': {
     const mercadopago = require('mercadopago');
     mercadopago.configure({
       access_token: process.env.MERCADO_PAGO_TOKEN
     });

     const preference = {
       items: [{
         title: 'Assinatura Bot de Vendas',
         unit_price: parseFloat(process.env.SUBSCRIPTION_PRICE) / 100,
         quantity: 1,
       }],
       back_urls: {
         success: 'https://seu-site.com/success',
         failure: 'https://seu-site.com/failure',
       },
       notification_url: 'https://seu-webhook.com/notifications',
     };

     const response = await mercadopago.preferences.create(preference);
     
     // Envia link de pagamento para o usuário
     await interaction.reply({
       content: `💳 Link de pagamento: ${response.body.init_point}`,
       ephemeral: true,
     });
   }
   ```

3. **Configure webhook** para receber notificações de pagamento confirmado

---

## Segurança

### Armazenamento de Tokens

⚠️ **IMPORTANTE:** Tokens de bots são sensíveis e devem ser tratados com cuidado.

Em produção:
- Use um banco de dados com criptografia
- Nunca registre (log) tokens completos
- Implemente rotação de tokens
- Use variáveis de ambiente para configurações sensíveis

### Validações Recomendadas

Adicione validações para:
- IDs do Discord (formato correto)
- Tokens válidos (tentar login antes de salvar)
- Verificação de propriedade do servidor
- Rate limiting para prevenir abuso

---

## Monitoramento

### Logs

O bot registra:
- Início/parada de bots provisionados
- Erros de provisionamento
- PIDs de processos

### Comandos Administrativos (Recomendado)

Considere adicionar comandos para:
- Listar bots em execução
- Parar/reiniciar bots
- Ver logs de um bot específico
- Estatísticas de uso

---

## Limitações Atuais

1. **Armazenamento em memória**: Configurações são perdidas ao reiniciar
2. **Sem autenticação de pagamento**: Pagamento é simulado
3. **Sem gerenciamento de ciclo de vida**: Bots não são automaticamente parados se a assinatura vence
4. **Sem webhooks**: Notificações de pagamento não são processadas

### Melhorias Futuras

- [ ] Banco de dados persistente (MongoDB/PostgreSQL)
- [ ] Integração completa com Mercado Pago
- [ ] Sistema de renovação automática
- [ ] Dashboard web para administração
- [ ] Sistema de tickets de suporte
- [ ] Logs centralizados
- [ ] Monitoramento de saúde dos bots
- [ ] Backup automático de configurações

---

## Relação com Bot de Vendas

Este payment bot é **independente** do bot de vendas (`../src/`). Ele:
- Gerencia múltiplos bots de vendas simultaneamente
- Cria instâncias isoladas para cada cliente
- Compartilha o código-base do bot de vendas
- Injeta configurações via variáveis de ambiente

Cada cliente recebe sua própria instância do bot de vendas, rodando em processo separado.

---

## Suporte

Para problemas ou dúvidas:
- Verifique os logs do bot: `console.log`
- Confirme configurações no `.env`
- Teste com GUILD_ID definido (registro mais rápido)

---

## Licença

Este projeto é parte do Hub Bot System.
