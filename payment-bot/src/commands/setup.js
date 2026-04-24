/**
 * Comando /setup — inicia o processo de contratação do bot de vendas.
 * 
 * Fluxo:
 * 1. Usuário executa /setup
 * 2. Bot cria um canal privado para o usuário
 * 3. Envia mensagem com botão "Pagar Assinatura"
 * 4. Após pagamento confirmado, envia botão "Configurar Bot"
 * 5. Botão abre modal para preencher: ownerId, clientId, token
 * 6. Bot é provisionado e fica online em segundos
 */

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('setup')
  .setDescription('Contrate e configure seu bot de vendas automatizadas')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .setDMPermission(false);

async function execute(interaction) {
  const { user, guild } = interaction;

  // Verifica se já existe um canal de setup para este usuário
  const existingChannel = guild.channels.cache.find(
    ch => ch.name === `setup-${user.username.toLowerCase()}` && ch.topic === user.id
  );

  if (existingChannel) {
    await interaction.reply({
      content: `✅ Você já possui um canal de configuração: ${existingChannel}`,
      ephemeral: true,
    });
    return;
  }

  // Cria um canal privado de texto para o setup
  const setupChannel = await guild.channels.create({
    name: `setup-${user.username}`,
    topic: user.id, // Armazena o ID do usuário no tópico para referência
    permissionOverwrites: [
      {
        id: guild.id, // @everyone
        deny: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: user.id,
        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
      },
      {
        id: interaction.client.user.id,
        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
      },
    ],
  });

  await interaction.reply({
    content: `✅ Canal de configuração criado: ${setupChannel}\n\nSiga as instruções no canal para contratar seu bot!`,
    ephemeral: true,
  });

  // Envia a mensagem inicial no canal de setup com o botão de pagamento
  const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
  const emojis = require('../utils/emojis');

  const payButton = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('btn_pay_subscription')
        .setLabel('Pagar Assinatura')
        .setEmoji(emojis.payment)
        .setStyle(ButtonStyle.Success),
    );

  const subscriptionPrice = process.env.SUBSCRIPTION_PRICE 
    ? (parseInt(process.env.SUBSCRIPTION_PRICE) / 100).toFixed(2)
    : '50.00';

  await setupChannel.send({
    content: [
      `${emojis.bot} **Bem-vindo ao Setup do Bot de Vendas!**`,
      '',
      `${emojis.info} Aqui você pode contratar e configurar seu próprio bot de vendas automatizadas.`,
      '',
      `${emojis.money} **Valor da assinatura:** R$ ${subscriptionPrice}/mês`,
      '',
      `${emojis.rocket} **O que você receberá:**`,
      `• Bot de vendas personalizado`,
      `• Painel de configuração completo`,
      `• Integração com Mercado Pago`,
      `• Sistema de tickets automatizado`,
      `• Suporte técnico`,
      '',
      `${emojis.arrowRight} Clique no botão abaixo para iniciar o pagamento:`,
    ].join('\n'),
    components: [payButton],
  });
}

module.exports = { data, execute };
