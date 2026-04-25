/**
 * Gerenciador de bots provisionados.
 * Armazena as configurações dos bots criados e gerencia seu ciclo de vida.
 * 
 * Em produção, isso deveria ser substituído por um banco de dados persistente.
 */

const { spawn } = require('child_process');
const path = require('path');

// Armazena os bots em execução: Map<guildId, { process, config }>
const runningBots = new Map();

// Armazena as configurações de bots por guild: Map<guildId, { ownerId, clientId, token, createdAt }>
const botConfigs = new Map();

/**
 * Cria e inicia um novo bot de vendas para um cliente.
 * @param {string} guildId - ID do servidor Discord do cliente
 * @param {object} config - { ownerId, clientId, token }
 * @returns {Promise<boolean>} - true se iniciado com sucesso
 */
async function startBot(guildId, config) {
  if (runningBots.has(guildId)) {
    console.log(`[BotManager] Bot já está rodando para guild ${guildId}`);
    return false;
  }

  try {
    // Caminho para o bot de vendas principal
    const botPath = path.join(__dirname, '../../../sales-bot/src/index.js');
    
    // Inicia o bot como um processo filho com logs direcionados
    const logPath = path.join(__dirname, `../../../logs/bot-${guildId}.log`);
    const logStream = require('fs').createWriteStream(logPath, { flags: 'a' });
    
    const botProcess = spawn('node', [botPath], {
      env: {
        ...process.env,
        DISCORD_TOKEN: config.token,
        CLIENT_ID: config.clientId,
        GUILD_ID: guildId,
      },
      detached: true,
      stdio: ['ignore', logStream, logStream], // stdout e stderr para arquivo de log
    });

    // Desanexa o processo para que ele continue rodando independentemente
    botProcess.unref();

    // Salva as informações
    runningBots.set(guildId, {
      process: botProcess,
      config: {
        ...config,
        startedAt: new Date(),
      },
    });

    botConfigs.set(guildId, {
      ...config,
      createdAt: new Date(),
    });

    console.log(`[BotManager] Bot iniciado para guild ${guildId} (PID: ${botProcess.pid})`);
    return true;
  } catch (error) {
    console.error(`[BotManager] Erro ao iniciar bot para guild ${guildId}:`, error);
    return false;
  }
}

/**
 * Para um bot em execução.
 * @param {string} guildId
 * @returns {boolean} - true se parado com sucesso
 */
function stopBot(guildId) {
  const botInfo = runningBots.get(guildId);
  if (!botInfo) {
    console.log(`[BotManager] Nenhum bot rodando para guild ${guildId}`);
    return false;
  }

  try {
    botInfo.process.kill();
    runningBots.delete(guildId);
    console.log(`[BotManager] Bot parado para guild ${guildId}`);
    return true;
  } catch (error) {
    console.error(`[BotManager] Erro ao parar bot para guild ${guildId}:`, error);
    return false;
  }
}

/**
 * Verifica se um bot está rodando para uma guild.
 * @param {string} guildId
 * @returns {boolean}
 */
function isBotRunning(guildId) {
  return runningBots.has(guildId);
}

/**
 * Retorna a configuração de um bot.
 * @param {string} guildId
 * @returns {object|null}
 */
function getBotConfig(guildId) {
  return botConfigs.get(guildId) ?? null;
}

/**
 * Lista todos os bots em execução.
 * @returns {Array<{guildId: string, config: object}>}
 */
function listRunningBots() {
  return Array.from(runningBots.entries()).map(([guildId, info]) => ({
    guildId,
    config: info.config,
  }));
}

module.exports = {
  startBot,
  stopBot,
  isBotRunning,
  getBotConfig,
  listRunningBots,
  botConfigs,
};
