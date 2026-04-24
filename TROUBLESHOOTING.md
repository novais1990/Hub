# 🔧 Guia de Solução de Problemas — Comandos Slash Não Aparecem

## ❌ Problema: "O bot não mostra os comandos slash no Discord"

Se você adicionou o bot ao servidor com a opção de "slash commands" habilitada, mas os comandos não aparecem quando você digita `/`, siga este guia passo-a-passo.

---

## ✅ Solução Completa

### **Passo 1: Verificar o arquivo `.env`**

Certifique-se de que você criou o arquivo `.env` na raiz do projeto com as variáveis corretas:

```bash
# Copie o arquivo de exemplo
cp .env.example .env
```

Edite o arquivo `.env` e preencha com seus dados:

```env
DISCORD_TOKEN=seu_token_do_bot_aqui
CLIENT_ID=seu_client_id_aqui
GUILD_ID=seu_guild_id_aqui
```

**Como obter esses valores:**

1. Acesse o [Discord Developer Portal](https://discord.com/developers/applications)
2. Selecione sua aplicação/bot
3. **DISCORD_TOKEN**: Vá em "Bot" → "Token" → Clique em "Reset Token" (copie e guarde com segurança)
4. **CLIENT_ID**: Vá em "General Information" → "Application ID" (copie)
5. **GUILD_ID**: No Discord, ative o "Modo Desenvolvedor" (Configurações → Avançado), clique com botão direito no seu servidor e copie o ID

---

### **Passo 2: Registrar os comandos no Discord**

**Este é o passo mais importante!** Apenas adicionar o bot ao servidor NÃO registra os comandos automaticamente. Você precisa executar:

```bash
npm run deploy
```

**O que você deve ver:**

```
✅ Comando preparado para deploy: /painel
📦 Total de 1 comando(s) para registrar
🔄 Registrando slash commands...
✅ 1 comando(s) registrado(s) na guild 123456789012345678
```

**⚠️ IMPORTANTE:**
- Se você usou `GUILD_ID` no `.env`, os comandos aparecem **instantaneamente** (apenas naquele servidor)
- Se você **não** usou `GUILD_ID`, os comandos são registrados **globalmente** e podem demorar **até 1 hora** para aparecer

---

### **Passo 3: Verificar permissões do bot no Discord Developer Portal**

1. Acesse o [Discord Developer Portal](https://discord.com/developers/applications)
2. Selecione sua aplicação/bot
3. Vá em **"Bot"** no menu lateral
4. **Verifique se estas opções estão ATIVADAS:**
   - ✅ **PUBLIC BOT** (se você quer que outros possam adicionar)
   - ✅ Intents necessárias: **GUILDS** (mínimo necessário)

---

### **Passo 4: Verificar a URL de convite do bot**

Se você adicionou o bot sem os **scopes** corretos, os comandos não funcionarão. Use a URL correta:

1. No [Discord Developer Portal](https://discord.com/developers/applications), vá em **OAuth2 → URL Generator**
2. Selecione os **SCOPES**:
   - ✅ `bot`
   - ✅ `applications.commands`
3. Selecione as **PERMISSÕES** (Bot Permissions):
   - ✅ `Administrator` (ou as permissões específicas que seu bot precisa)
4. Copie a URL gerada no final da página
5. **REMOVA o bot do servidor** (configurações do servidor → integrações → bot → remover)
6. **ADICIONE novamente** usando a URL correta que você acabou de gerar

---

### **Passo 5: Iniciar o bot**

Após registrar os comandos, inicie o bot:

```bash
npm start
```

**O que você deve ver:**

```
✅ Comando carregado: /painel
📦 Total de 1 comando(s) carregado(s)
✅ Bot online como SeuBot#1234
📡 Servidor(es) conectado(s): 1
```

---

### **Passo 6: Testar os comandos**

1. Vá ao seu servidor no Discord
2. Digite `/` em qualquer canal
3. O comando `/painel` deve aparecer na lista
4. Execute `/painel` (você precisa ter permissão de **Administrador**)

---

## 🐛 Problemas Comuns

### ❌ "O comando /painel não aparece mesmo após npm run deploy"

**Possíveis causas:**

1. **Você não reiniciou o Discord após o deploy**
   - Solução: Feche e abra o Discord completamente (ou use Ctrl+R para recarregar)

2. **Você usou deploy global sem GUILD_ID**
   - Solução: Aguarde até 1 hora OU adicione `GUILD_ID` no `.env` e rode `npm run deploy` novamente

3. **O bot não tem permissão `applications.commands`**
   - Solução: Remova e adicione o bot novamente com a URL correta (Passo 4)

4. **Você está em um canal onde o bot não tem permissão**
   - Solução: Teste em um canal onde o bot tenha permissão de visualizar

---

### ❌ "Erro: DiscordAPIError[50001]: Missing Access"

**Causa:** O bot não tem as permissões necessárias no servidor.

**Solução:**
1. Verifique se o bot tem permissões de "Ver Canais" e "Enviar Mensagens"
2. Verifique se o cargo do bot está acima dos cargos que ele precisa gerenciar
3. Teste o comando `/painel` em um canal público onde o bot tem acesso total

---

### ❌ "O bot aparece offline mesmo após npm start"

**Causa:** Token inválido ou expirado.

**Solução:**
1. Vá ao [Discord Developer Portal](https://discord.com/developers/applications)
2. Vá em "Bot" → "Reset Token"
3. Copie o novo token
4. Atualize o `DISCORD_TOKEN` no arquivo `.env`
5. Reinicie o bot com `npm start`

---

### ❌ "Erro: An invalid token was provided"

**Causa:** O token no `.env` está incorreto.

**Solução:**
1. Verifique se não há espaços extras antes/depois do token no `.env`
2. Verifique se você copiou o token completo
3. Gere um novo token no Discord Developer Portal se necessário

---

## 📋 Checklist Completo

Use este checklist para garantir que tudo está configurado corretamente:

- [ ] ✅ Arquivo `.env` criado com `DISCORD_TOKEN`, `CLIENT_ID`, e `GUILD_ID`
- [ ] ✅ Executei `npm install` para instalar as dependências
- [ ] ✅ Executei `npm run deploy` para registrar os comandos
- [ ] ✅ Vi a mensagem de confirmação do deploy com sucesso
- [ ] ✅ Bot foi adicionado ao servidor com os scopes `bot` + `applications.commands`
- [ ] ✅ Bot tem as permissões necessárias no servidor
- [ ] ✅ Executei `npm start` e o bot está online
- [ ] ✅ Reiniciei o Discord ou aguardei tempo suficiente para os comandos aparecerem
- [ ] ✅ Testei digitar `/painel` em um canal onde tenho permissão de Administrador

---

## 🆘 Ainda com problemas?

Se você seguiu todos os passos e ainda não funciona, verifique:

1. **Versão do Node.js:** `node --version` (precisa ser ≥ 18)
2. **Logs do console:** Há algum erro ao executar `npm start`?
3. **Logs do deploy:** O que apareceu ao executar `npm run deploy`?
4. **Permissões no servidor:** Você é administrador do servidor?

---

## 📚 Links Úteis

- [Discord Developer Portal](https://discord.com/developers/applications)
- [Discord.js Guide — Slash Commands](https://discordjs.guide/slash-commands/)
- [Discord Developer Docs — Application Commands](https://discord.com/developers/docs/interactions/application-commands)

---

**💡 Dica:** Para desenvolvimento rápido, sempre use `GUILD_ID` no `.env`. Isso faz com que os comandos apareçam instantaneamente no servidor especificado ao invés de aguardar até 1 hora para deploy global.
