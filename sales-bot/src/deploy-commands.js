/**
 * Script de registro dos slash commands no Discord.
 *
 * Uso:
 *   npm run deploy
 *
 * Se GUILD_ID estiver definido no .env, os comandos são registrados
 * somente naquela guild (atualização instantânea — ideal para testes).
 * Caso contrário, são registrados globalmente (pode levar até 1 hora).
 */

const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID) {
  console.error('❌ Defina DISCORD_TOKEN e CLIENT_ID no arquivo .env');
  process.exit(1);
}

// Carrega todos os comandos dinamicamente do diretório /commands
// Nota: Apenas arquivos com "data" e "execute" válidos serão carregados
const commands = [];
const commandsPath = path.join(__dirname, 'commands');

try {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if (command.data && command.execute) {
      commands.push(command.data.toJSON());
      console.log(`✅ Comando preparado para deploy: /${command.data.name}`);
    } else {
      console.warn(`⚠️  Comando em ${file} está faltando "data" ou "execute"`);
    }
  }
  
  if (commands.length === 0) {
    console.error('❌ Nenhum comando encontrado para registrar');
    process.exit(1);
  }
  
  console.log(`📦 Total de ${commands.length} comando(s) para registrar`);
} catch (error) {
  console.error('❌ Erro ao carregar comandos:', error);
  process.exit(1);
}

const rest = new REST().setToken(DISCORD_TOKEN);

(async () => {
  try {
    console.log('🔄 Registrando slash commands...');

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
