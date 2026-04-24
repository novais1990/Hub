/**
 * Comando /painel — abre o painel de configuração do bot.
 * Requer permissão de Administrador. Funciona apenas em servidores.
 */

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { replyComponentsV2 } = require('../utils/componentsV2');
const { getPainelHome } = require('../panels/painelHome');

const data = new SlashCommandBuilder()
  .setName('painel')
  .setDescription('Abre o painel de configuração do bot de vendas')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .setDMPermission(false);

async function execute(interaction) {
  const userName = interaction.user.username;
  await replyComponentsV2(interaction, getPainelHome(userName), true);
}

module.exports = { data, execute };
