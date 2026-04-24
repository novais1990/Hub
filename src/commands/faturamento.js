/**
 * Comando /faturamento — abre o dashboard financeiro do bot.
 * Requer permissão de Administrador. Funciona apenas em servidores.
 */

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { replyComponentsV2 } = require('../utils/componentsV2');
const { getPainelFaturamento } = require('../panels/painelFaturamento');
const { getFinancialData } = require('../handlers/interactionHandler');

const data = new SlashCommandBuilder()
  .setName('faturamento')
  .setDescription('Visualiza o dashboard financeiro com faturamento e lucros')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .setDMPermission(false);

async function execute(interaction) {
  const userName = interaction.user.username;
  const guildId = interaction.guildId;
  
  // Obter dados financeiros da guild
  const financialData = getFinancialData(guildId);
  
  await replyComponentsV2(interaction, getPainelFaturamento(userName, financialData), true);
}

module.exports = { data, execute };
