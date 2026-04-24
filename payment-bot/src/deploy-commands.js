/**
 * Script de registro dos slash commands do bot de pagamento.
 */

require('dotenv').config();

const { REST, Routes } = require('discord.js');
const setupCommand = require('./commands/setup');

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID) {
  console.error('❌ Defina DISCORD_TOKEN e CLIENT_ID no arquivo .env');
  process.exit(1);
}

const commands = [setupCommand.data.toJSON()];
const rest = new REST().setToken(DISCORD_TOKEN);

(async () => {
  try {
    console.log('🔄 Registrando slash commands do bot de pagamento...');

    let data;
    if (GUILD_ID) {
      data = await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
        { body: commands },
      );
      console.log(`✅ ${data.length} comando(s) registrado(s) na guild ${GUILD_ID}`);
    } else {
      data = await rest.put(
        Routes.applicationCommands(CLIENT_ID),
        { body: commands },
      );
      console.log(`✅ ${data.length} comando(s) registrado(s) globalmente`);
    }
  } catch (error) {
    console.error('❌ Erro ao registrar comandos:', error);
    process.exit(1);
  }
})();
