/**
 * Painel Cargo Cliente — configuração do cargo atribuído a clientes.
 *
 * Estrutura (Components V2):
 *   Container
 *     ActionRow    → botão Voltar Home | botão Cargo Cliente (desabilitado)
 *     TextDisplay  → título
 *     Separator
 *     TextDisplay  → explicação da funcionalidade
 *     ActionRow    → RoleSelect: escolher o cargo
 *     ActionRow    → botões: Confirmar | Cancelar | Excluir
 */

const emojis = require('../utils/emojis');
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  RoleSelectMenuBuilder,
} = require('discord.js');

/**
 * Retorna o array de componentes do painel de Cargo Cliente.
 * @returns {object[]}
 */
function getPainelCargoCliente() {
  const navigationRow = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('btn_back_home')
        .setLabel('Voltar Home')
        .setEmoji(emojis.home)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('btn_show_cargo_cliente')
        .setLabel('Cargo Cliente')
        .setEmoji(emojis.cargo)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
    );

  const roleRow = new ActionRowBuilder()
    .addComponents(
      new RoleSelectMenuBuilder()
        .setCustomId('select_cargo_cliente')
        .setPlaceholder('Selecione o cargo de cliente')
        .setMinValues(1)
        .setMaxValues(1),
    );

  const actionRow = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('btn_confirm_cargo')
        .setLabel('Confirmar Configuração')
        .setEmoji(emojis.check)
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('btn_cancel_cargo')
        .setLabel('Cancelar')
        .setEmoji(emojis.error)
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('btn_delete_cargo')
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
          content: `${emojis.cargo} **CONFIGURAÇÃO DE CARGO**`,
        },
        {
          type: 13, // Separator
          divider: true,
          spacing: 1,
        },
        {
          type: 14, // TextDisplay
          content: [
            `${emojis.info} Configure o cargo que será atribuído automaticamente aos clientes após a conclusão de uma compra.`,
            '',
            `${emojis.arrowRight} Selecione o cargo desejado no menu abaixo`,
            `${emojis.arrowRight} Clique em **Confirmar** para salvar a configuração`,
            `${emojis.arrowRight} O cargo será concedido automaticamente após cada venda confirmada`,
          ].join('\n'),
        },
        roleRow.toJSON(),
        actionRow.toJSON(),
      ],
    },
  ];
}

module.exports = { getPainelCargoCliente };
