/**
 * Painel Canal Logs — configuração dos canais de log.
 *
 * Estrutura (Components V2):
 *   Container
 *     ActionRow    → botão Voltar Home | botão Canal Logs (desabilitado — indica seção atual)
 *     TextDisplay  → título
 *     Separator
 *     TextDisplay  → lista dos tipos de canal disponíveis
 *     ActionRow    → StringSelect: qual tipo de canal configurar primeiro
 *     ActionRow    → ChannelSelect: escolher o canal do servidor
 *     ActionRow    → botões: Confirmar | Cancelar | Excluir
 */

const emojis = require('../utils/emojis');
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ChannelSelectMenuBuilder,
  ChannelType,
} = require('discord.js');

/**
 * Retorna o array de componentes do painel de Canal Logs.
 * @returns {object[]}
 */
function getPainelCanalLogs() {
  // Linha de navegação: voltar + indicador da seção atual
  const navigationRow = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('btn_back_home')
        .setLabel('Voltar Home')
        .setEmoji(emojis.home)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('btn_show_canal_logs')
        .setLabel('Canal Logs')
        .setEmoji(emojis.canal)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
    );

  // Select: tipo de log a configurar
  const selectTypeRow = new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('select_canal_logs_type')
        .setPlaceholder('Selecione qual canal configurar primeiro')
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel('Canal Ticket Fechado')
            .setValue('canal_ticket_fechado')
            .setEmoji(emojis.ticketFechado)
            .setDescription('Canal onde ficam os logs de tickets fechados'),
          new StringSelectMenuOptionBuilder()
            .setLabel('Canal Ticket Vendas')
            .setValue('canal_ticket_vendas')
            .setEmoji(emojis.ticketVendas)
            .setDescription('Canal onde ficam os logs de vendas realizadas'),
          new StringSelectMenuOptionBuilder()
            .setLabel('Canal Transcript')
            .setValue('canal_transcript')
            .setEmoji(emojis.transcript)
            .setDescription('Canal onde ficam os transcritos dos tickets fechados'),
          new StringSelectMenuOptionBuilder()
            .setLabel('Canal Ticket Aberto')
            .setValue('canal_ticket_aberto')
            .setEmoji(emojis.ticketAberto)
            .setDescription('Canal onde ficam os logs de tickets abertos'),
        ),
    );

  // Select: canal do servidor a associar
  const selectChannelRow = new ActionRowBuilder()
    .addComponents(
      new ChannelSelectMenuBuilder()
        .setCustomId('select_canal_channel')
        .setPlaceholder('Selecione o canal do servidor')
        .setChannelTypes([ChannelType.GuildText])
        .setMinValues(1)
        .setMaxValues(1),
    );

  // Ações
  const actionRow = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('btn_confirm_config')
        .setLabel('Confirmar Configuração')
        .setEmoji(emojis.check)
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('btn_cancel_config')
        .setLabel('Cancelar')
        .setEmoji(emojis.error)
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('btn_delete_config')
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
          content: `${emojis.config} **CONFIGURAÇÃO DE CANAL**`,
        },
        {
          type: 13, // Separator
          divider: true,
          spacing: 1,
        },
        {
          type: 14, // TextDisplay
          content: [
            `${emojis.ticketFechado} Canal logs ticket fechado`,
            `${emojis.ticketVendas} Canal logs ticket vendas`,
            `${emojis.transcript} Canal logs ticket transcript do ticket fechado`,
            `${emojis.ticketAberto} Canal logs ticket aberto`,
          ].join('\n'),
        },
        selectTypeRow.toJSON(),
        selectChannelRow.toJSON(),
        actionRow.toJSON(),
      ],
    },
  ];
}

module.exports = { getPainelCanalLogs };
