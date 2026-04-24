/**
 * Painel Home — tela inicial do painel de configuração.
 *
 * Estrutura (Components V2):
 *   Container
 *     TextDisplay  → título
 *     Separator
 *     TextDisplay  → boas-vindas + lista de opções
 *     ActionRow    → botões: Canal Logs | Cargo Cliente | Criar Anúncio
 */

const emojis = require('../utils/emojis');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

/**
 * Retorna o array de componentes do painel inicial.
 * @param {string} userName  Nome do usuário que abriu o painel
 * @returns {object[]}
 */
function getPainelHome(userName) {
  const actionRow1 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('painel_canal_logs')
        .setLabel('Canal Logs')
        .setEmoji(emojis.canal)
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('painel_cargo_cliente')
        .setLabel('Cargo Cliente')
        .setEmoji(emojis.cargo)
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('painel_anuncio')
        .setLabel('Criar Anúncio')
        .setEmoji(emojis.anuncio)
        .setStyle(ButtonStyle.Primary),
    );

  const actionRow2 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('painel_mercado_pago')
        .setLabel('Mercado Pago')
        .setEmoji(emojis.mercadoPago)
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('painel_planos')
        .setLabel('Planos de Assinatura')
        .setEmoji(emojis.planos)
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('painel_faturamento')
        .setLabel('Dashboard Financeiro')
        .setEmoji(emojis.dashboard)
        .setStyle(ButtonStyle.Primary),
    );

  return [
    {
      type: 17, // Container
      components: [
        {
          type: 14, // TextDisplay
          content: `${emojis.painel} **PAINEL CONFIGURAÇÃO**`,
        },
        {
          type: 13, // Separator
          divider: true,
          spacing: 1,
        },
        {
          type: 14, // TextDisplay
          content: [
            `${emojis.welcome} Bem-vindo ao seu painel de configuração, **${userName}**!`,
            '',
            `${emojis.canal} Canal Logs`,
            `${emojis.cargo} Cargo Cliente`,
            `${emojis.anuncio} Criar Anúncio`,
            `${emojis.mercadoPago} Mercado Pago`,
            `${emojis.planos} Planos de Assinatura`,
            `${emojis.dashboard} Dashboard Financeiro`,
            '',
            'Escolha a opção abaixo!',
          ].join('\n'),
        },
        actionRow1.toJSON(),
        actionRow2.toJSON(),
      ],
    },
  ];
}

module.exports = { getPainelHome };
