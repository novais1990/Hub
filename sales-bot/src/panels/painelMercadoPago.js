/**
 * Painel Mercado Pago — configuração do token de produção do Mercado Pago.
 *
 * Estrutura (Components V2):
 *   Container
 *     ActionRow    → botão Voltar Home | botão Mercado Pago (desabilitado)
 *     TextDisplay  → título
 *     Separator
 *     TextDisplay  → explicação da funcionalidade
 *     ActionRow    → botão Configurar Token (abre modal)
 *     ActionRow    → botões: Cancelar | Excluir
 */

const emojis = require('../utils/emojis');
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

/**
 * Retorna o array de componentes do painel de Mercado Pago.
 * @returns {object[]}
 */
function getPainelMercadoPago() {
  const navigationRow = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('btn_back_home')
        .setLabel('Voltar Home')
        .setEmoji(emojis.home)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('btn_show_mercado_pago')
        .setLabel('Mercado Pago')
        .setEmoji(emojis.mercadoPago)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
    );

  const configRow = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('btn_config_mercado_pago')
        .setLabel('Configurar Token')
        .setEmoji(emojis.key)
        .setStyle(ButtonStyle.Success),
    );

  const actionRow = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('btn_cancel_mercado_pago')
        .setLabel('Cancelar')
        .setEmoji(emojis.error)
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('btn_delete_mercado_pago')
        .setLabel('Excluir Configuração')
        .setEmoji(emojis.trash)
        .setStyle(ButtonStyle.Danger),
    );

  return [
    {
      type: 17, // Container
      components: [
        navigationRow.toJSON(),
        {
          type: 14, // TextDisplay
          content: `${emojis.mercadoPago} **CONFIGURAÇÃO MERCADO PAGO**`,
        },
        {
          type: 13, // Separator
          divider: true,
          spacing: 1,
        },
        {
          type: 14, // TextDisplay
          content: [
            `${emojis.info} Configure o token de produção do Mercado Pago para processar pagamentos automaticamente.`,
            '',
            `${emojis.arrowRight} Clique em **Configurar Token** para inserir seu token`,
            `${emojis.arrowRight} O token será usado para processar pagamentos de vendas`,
            `${emojis.warning} **Importante:** Nunca compartilhe seu token com terceiros`,
          ].join('\n'),
        },
        configRow.toJSON(),
        actionRow.toJSON(),
      ],
    },
  ];
}

module.exports = { getPainelMercadoPago };
