/**
 * Handler de interações do bot de pagamento.
 * Gerencia o fluxo de pagamento e configuração de novos bots.
 */

const {
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');
const emojis = require('../utils/emojis');
const { startBot, isBotRunning, getBotConfig } = require('../utils/botManager');

// Armazena o status de pagamento por usuário: Map<userId, { paid, paidAt }>
const paymentStatus = new Map();

/**
 * Handler principal de interações.
 * @param {import('discord.js').Interaction} interaction
 */
async function handleInteraction(interaction) {
  if (interaction.isButton()) {
    await handleButton(interaction);
  } else if (interaction.isModalSubmit()) {
    await handleModalSubmit(interaction);
  }
}

/**
 * Handler de botões.
 * @param {import('discord.js').ButtonInteraction} interaction
 */
async function handleButton(interaction) {
  const { customId, user } = interaction;

  switch (customId) {
    case 'btn_pay_subscription': {
      // Simula o processo de pagamento
      // Em produção, isso integraria com a API do Mercado Pago
      
      await interaction.reply({
        content: [
          `${emojis.payment} **Processando pagamento...**`,
          '',
          `${emojis.info} Em produção, aqui seria gerado um link de pagamento do Mercado Pago.`,
          `${emojis.warning} **Modo de demonstração:** Pagamento confirmado automaticamente.`,
        ].join('\n'),
        ephemeral: true,
      });

      // Marca como pago (simulação)
      paymentStatus.set(user.id, {
        paid: true,
        paidAt: new Date(),
      });

      // Aguarda 2 segundos para simular o processamento
      setTimeout(async () => {
        // Envia mensagem de confirmação com botão para configurar o bot
        const configButton = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('btn_configure_bot')
              .setLabel('Configurar Bot')
              .setEmoji(emojis.config)
              .setStyle(ButtonStyle.Primary),
          );

        await interaction.followUp({
          content: [
            `${emojis.check} **Pagamento confirmado!**`,
            '',
            `${emojis.rocket} Sua assinatura está ativa. Agora você pode configurar seu bot.`,
            '',
            `${emojis.arrowRight} Clique no botão abaixo para preencher as informações do bot:`,
          ].join('\n'),
          components: [configButton],
        });
      }, 2000);
      break;
    }

    case 'btn_configure_bot': {
      // Verifica se o usuário pagou
      const payment = paymentStatus.get(user.id);
      if (!payment || !payment.paid) {
        await interaction.reply({
          content: `${emojis.error} Você precisa efetuar o pagamento antes de configurar o bot.`,
          ephemeral: true,
        });
        return;
      }

      // Abre o modal para configuração
      const modal = new ModalBuilder()
        .setCustomId('modal_bot_config')
        .setTitle('Configuração do Bot')
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('bot_owner_id')
              .setLabel('ID do Dono do Servidor')
              .setStyle(TextInputStyle.Short)
              .setPlaceholder('Ex: 123456789012345678')
              .setRequired(true)
              .setMaxLength(20),
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('bot_client_id')
              .setLabel('ID da Aplicação (Client ID)')
              .setStyle(TextInputStyle.Short)
              .setPlaceholder('Ex: 987654321098765432')
              .setRequired(true)
              .setMaxLength(20),
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('bot_token')
              .setLabel('Token da Aplicação')
              .setStyle(TextInputStyle.Paragraph)
              .setPlaceholder('Cole aqui o token do bot do Discord Developer Portal')
              .setRequired(true)
              .setMaxLength(200),
          ),
        );

      await interaction.showModal(modal);
      break;
    }

    default:
      console.warn(`[PaymentHandler] Botão não tratado: ${customId}`);
  }
}

/**
 * Handler de modais.
 * @param {import('discord.js').ModalSubmitInteraction} interaction
 */
async function handleModalSubmit(interaction) {
  const { customId, user, guildId } = interaction;

  switch (customId) {
    case 'modal_bot_config': {
      const ownerId = interaction.fields.getTextInputValue('bot_owner_id').trim();
      const clientId = interaction.fields.getTextInputValue('bot_client_id').trim();
      const token = interaction.fields.getTextInputValue('bot_token').trim();

      // Validação básica dos IDs (Discord Snowflakes são numéricos de 17-19 dígitos)
      const snowflakeRegex = /^\d{17,19}$/;
      if (!snowflakeRegex.test(ownerId)) {
        await interaction.reply({
          content: `${emojis.error} **ID do Dono inválido.** Deve ser um número de 17-19 dígitos.`,
          ephemeral: true,
        });
        return;
      }

      if (!snowflakeRegex.test(clientId)) {
        await interaction.reply({
          content: `${emojis.error} **Client ID inválido.** Deve ser um número de 17-19 dígitos.`,
          ephemeral: true,
        });
        return;
      }

      // Validação básica do token (deve ter formato parecido com um token Discord)
      if (token.length < 50 || !token.includes('.')) {
        await interaction.reply({
          content: `${emojis.error} **Token inválido.** Verifique se copiou o token completo do Discord Developer Portal.`,
          ephemeral: true,
        });
        return;
      }

      await interaction.reply({
        content: `${emojis.rocket} **Provisionando seu bot...**\n\nIsso pode levar alguns segundos.`,
        ephemeral: true,
      });

      // Provisiona o bot
      const config = { ownerId, clientId, token };
      const success = await startBot(guildId, config);

      if (success) {
        await interaction.followUp({
          content: [
            `${emojis.check} **Bot configurado e iniciado com sucesso!**`,
            '',
            `${emojis.bot} Seu bot de vendas está online e pronto para uso.`,
            '',
            `${emojis.info} Use o comando \`/painel\` no seu servidor para configurar o bot.`,
            '',
            `**Informações:**`,
            `• Dono: <@${ownerId}>`,
            `• Client ID: \`${clientId}\``,
            `• Status: ${emojis.check} Online`,
          ].join('\n'),
          ephemeral: true,
        });

        // Limpa o status de pagamento após configuração bem-sucedida
        paymentStatus.delete(user.id);
      } else {
        await interaction.followUp({
          content: [
            `${emojis.error} **Erro ao iniciar o bot.**`,
            '',
            `${emojis.warning} Por favor, verifique se as informações estão corretas:`,
            `• O token deve ser válido`,
            `• O Client ID deve corresponder ao bot`,
            `• O bot ainda não deve estar rodando`,
          ].join('\n'),
          ephemeral: true,
        });
      }
      break;
    }

    default:
      console.warn(`[PaymentHandler] Modal não tratado: ${customId}`);
  }
}

module.exports = { handleInteraction, paymentStatus };
