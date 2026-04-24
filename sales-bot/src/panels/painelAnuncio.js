/**
 * Painel Criar Anúncio — configuração e publicação de anúncios de produtos/serviços.
 *
 * Estrutura (Components V2):
 *   Container
 *     ActionRow    → botão Voltar Home | botão Criar Anúncio (desabilitado)
 *     TextDisplay  → título
 *     Separator
 *     TextDisplay  → instruções
 *     ActionRow    → ChannelSelect: canal onde publicar o anúncio
 *     ActionRow    → StringSelect: tipo de produto/serviço
 *     ActionRow    → botões: Criar Anúncio | Cancelar | Descartar Rascunho
 *
 * Ao clicar em "Criar Anúncio", um Modal é exibido para preencher
 * título, descrição e preço do produto.
 */

const emojis = require('../utils/emojis');
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  ChannelType,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require('discord.js');

/**
 * Retorna o array de componentes do painel de Criar Anúncio.
 * @returns {object[]}
 */
function getPainelAnuncio() {
  const navigationRow = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('btn_back_home')
        .setLabel('Voltar Home')
        .setEmoji(emojis.home)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('btn_show_anuncio')
        .setLabel('Criar Anúncio')
        .setEmoji(emojis.anuncio)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
    );

  const channelRow = new ActionRowBuilder()
    .addComponents(
      new ChannelSelectMenuBuilder()
        .setCustomId('select_anuncio_channel')
        .setPlaceholder('Selecione o canal para publicar o anúncio')
        .setChannelTypes([ChannelType.GuildText, ChannelType.GuildAnnouncement])
        .setMinValues(1)
        .setMaxValues(1),
    );

  const typeRow = new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('select_anuncio_type')
        .setPlaceholder('Selecione o tipo de produto/serviço')
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel('Produto Digital')
            .setValue('produto_digital')
            .setEmoji('💻')
            .setDescription('E-books, cursos, softwares e outros produtos digitais'),
          new StringSelectMenuOptionBuilder()
            .setLabel('Produto Físico')
            .setValue('produto_fisico')
            .setEmoji('📦')
            .setDescription('Produtos com entrega física'),
          new StringSelectMenuOptionBuilder()
            .setLabel('Serviço')
            .setValue('servico')
            .setEmoji('🛠️')
            .setDescription('Prestação de serviços'),
        ),
    );

  const actionRow = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('btn_confirm_anuncio')
        .setLabel('Criar Anúncio')
        .setEmoji(emojis.check)
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('btn_cancel_anuncio')
        .setLabel('Cancelar')
        .setEmoji(emojis.error)
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('btn_delete_anuncio')
        .setLabel('Descartar Rascunho')
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
          content: `${emojis.anuncio} **CRIAR ANÚNCIO**`,
        },
        {
          type: 13, // Separator
          divider: true,
          spacing: 1,
        },
        {
          type: 14, // TextDisplay
          content: [
            `${emojis.info} Crie um anúncio automatizado para seus produtos ou serviços.`,
            '',
            `${emojis.arrowRight} Selecione o canal onde o anúncio será publicado`,
            `${emojis.arrowRight} Escolha o tipo de produto ou serviço`,
            `${emojis.arrowRight} Clique em **Criar Anúncio** para preencher os detalhes`,
          ].join('\n'),
        },
        channelRow.toJSON(),
        typeRow.toJSON(),
        actionRow.toJSON(),
      ],
    },
  ];
}

module.exports = { getPainelAnuncio };
