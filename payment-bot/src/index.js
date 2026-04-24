/**
 * Ponto de entrada do bot de pagamento.
 * Gerencia assinaturas e provisionamento de bots de vendas.
 */

require('dotenv').config();

const { Client, GatewayIntentBits, Events } = require('discord.js');
const { handleInteraction } = require('./handlers/paymentHandler');
const setupCommand = require('./commands/setup');

// ─────────────────────────────────────────────────────────────────────────────
// Cliente Discord
// ─────────────────────────────────────────────────────────────────────────────

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

// Mapa de comandos disponíveis
const commands = new Map();
commands.set(setupCommand.data.name, setupCommand);

// ─────────────────────────────────────────────────────────────────────────────
// Eventos
// ─────────────────────────────────────────────────────────────────────────────

client.once(Events.ClientReady, (c) => {
  console.log(`✅ Bot de Pagamento online como ${c.user.tag}`);
  console.log(`📡 Servidor(es) conectado(s): ${c.guilds.cache.size}`);
  console.log(`🤖 Pronto para provisionar bots de vendas`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  // ── Slash commands ────────────────────────────────────────────────────────
  if (interaction.isChatInputCommand()) {
    const command = commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`[PaymentBot] Erro no comando /${interaction.commandName}:`, error);
      const errorMsg = {
        content: '❌ Ocorreu um erro ao executar este comando.',
        ephemeral: true,
      };
      try {
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(errorMsg);
        } else {
          await interaction.reply(errorMsg);
        }
      } catch (_) { /* ignora erro secundário */ }
    }
    return;
  }

  // ── Componentes (botões, modais) ──────────────────────────────────────────
  try {
    await handleInteraction(interaction);
  } catch (error) {
    console.error('[PaymentBot] Erro ao processar interação:', error);
    const errorMsg = {
      content: '❌ Ocorreu um erro ao processar esta interação.',
      ephemeral: true,
    };
    try {
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply(errorMsg);
      } else {
        await interaction.followUp(errorMsg);
      }
    } catch (_) { /* ignora erro secundário */ }
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Login
// ─────────────────────────────────────────────────────────────────────────────

if (!process.env.DISCORD_TOKEN) {
  console.error('❌ DISCORD_TOKEN não definido. Configure o arquivo .env');
  process.exit(1);
}

client.login(process.env.DISCORD_TOKEN);
