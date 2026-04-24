/**
 * Ponto de entrada do bot.
 * Inicializa o cliente Discord, carrega eventos e realiza o login.
 */

require('dotenv').config();

const { Client, GatewayIntentBits, Events } = require('discord.js');
const { handleInteraction } = require('./handlers/interactionHandler');
const painelCommand = require('./commands/painel');
const faturamentoCommand = require('./commands/faturamento');

// ─────────────────────────────────────────────────────────────────────────────
// Cliente Discord
// ─────────────────────────────────────────────────────────────────────────────

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
  ],
});

// Mapa de comandos disponíveis
const commands = new Map();
commands.set(painelCommand.data.name, painelCommand);
commands.set(faturamentoCommand.data.name, faturamentoCommand);

// ─────────────────────────────────────────────────────────────────────────────
// Eventos
// ─────────────────────────────────────────────────────────────────────────────

client.once(Events.ClientReady, (c) => {
  console.log(`✅ Bot online como ${c.user.tag}`);
  console.log(`📡 Servidor(es) conectado(s): ${c.guilds.cache.size}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  // ── Slash commands ────────────────────────────────────────────────────────
  if (interaction.isChatInputCommand()) {
    const command = commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`[Bot] Erro no comando /${interaction.commandName}:`, error);
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

  // ── Componentes (botões, selects, modais) ─────────────────────────────────
  try {
    await handleInteraction(interaction);
  } catch (error) {
    console.error('[Bot] Erro ao processar interação:', error);
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
