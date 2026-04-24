/**
 * Painel Planos de Assinatura — tela de seleção de planos com menu de páginas.
 *
 * Estrutura (Components V2):
 *   Container
 *     Navigation Tabs (type 15) → Mensal | Trimestral | Anual
 *     TextDisplay → detalhes do plano selecionado
 *     Separator
 *     SelectMenu → opção de seguro (50% devolução caso falência)
 *     ActionRow → Botão de Assinar | Voltar
 *
 * Cada página (tab) mostra um plano diferente com suas informações e preços.
 */

const emojis = require('../utils/emojis');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');

/**
 * Informações dos planos de assinatura
 */
const PLANOS = {
  mensal: {
    nome: 'Plano Mensal',
    preco: 'R$ 49,90',
    duracao: '1 mês',
    economia: '',
    beneficios: [
      '✅ Acesso completo à plataforma',
      '✅ Suporte prioritário',
      '✅ Atualizações automáticas',
      '✅ Cancelamento a qualquer momento',
    ],
  },
  trimestral: {
    nome: 'Plano Trimestral',
    preco: 'R$ 129,90',
    duracao: '3 meses',
    economia: '💰 Economize R$ 19,80 (13%)',
    beneficios: [
      '✅ Acesso completo à plataforma',
      '✅ Suporte prioritário',
      '✅ Atualizações automáticas',
      '✅ 3 meses de acesso garantido',
      '⭐ Desconto especial',
    ],
  },
  anual: {
    nome: 'Plano Anual',
    preco: 'R$ 449,90',
    duracao: '12 meses',
    economia: '💰 Economize R$ 148,90 (25%)',
    beneficios: [
      '✅ Acesso completo à plataforma',
      '✅ Suporte VIP',
      '✅ Atualizações automáticas',
      '✅ 12 meses de acesso garantido',
      '⭐ Melhor custo-benefício',
      '🎁 Bônus exclusivos',
    ],
  },
};

/**
 * Retorna o array de componentes do painel de planos com a aba ativa.
 * @param {string} activePlan - Plano ativo: 'mensal', 'trimestral', 'anual'
 * @returns {object[]}
 */
function getPainelPlanos(activePlan = 'mensal') {
  const plano = PLANOS[activePlan];

  // Monta o conteúdo do plano selecionado
  const planoContent = [
    `## ${emojis.star} ${plano.nome}`,
    '',
    `**💵 Valor:** ${plano.preco}`,
    `**⏰ Duração:** ${plano.duracao}`,
    plano.economia ? `${plano.economia}` : '',
    '',
    '**Benefícios:**',
    ...plano.beneficios,
    '',
    `${emojis.info} **Seguro de Proteção:** Adicione proteção contra falência da empresa`,
    `${emojis.shield} Devolução de 50% do valor do mês em caso de falência`,
  ].filter(line => line !== '').join('\n');

  // Menu de seleção de seguro
  const selectSeguro = new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('select_seguro_plano')
        .setPlaceholder('Deseja ativar o seguro? (Opcional)')
        .addOptions([
          {
            label: 'Sem seguro',
            description: 'Continuar sem proteção adicional',
            value: 'sem_seguro',
            emoji: '❌',
          },
          {
            label: 'Com seguro (+R$ 5/mês)',
            description: 'Proteção de 50% em caso de falência',
            value: 'com_seguro',
            emoji: '🛡️',
          },
        ])
    );

  // Botões de ação
  const actionButtons = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId(`btn_assinar_${activePlan}`)
        .setLabel('Assinar Agora')
        .setEmoji(emojis.payment)
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('btn_back_home')
        .setLabel('Voltar')
        .setEmoji(emojis.home)
        .setStyle(ButtonStyle.Secondary)
    );

  return [
    {
      type: 17, // Container
      components: [
        {
          type: 15, // Navigation Tabs
          components: [
            {
              label: '📅 Mensal',
              custom_id: 'tab_plano_mensal',
              active: activePlan === 'mensal',
            },
            {
              label: '📆 Trimestral',
              custom_id: 'tab_plano_trimestral',
              active: activePlan === 'trimestral',
            },
            {
              label: '📋 Anual',
              custom_id: 'tab_plano_anual',
              active: activePlan === 'anual',
            },
          ],
        },
        {
          type: 14, // TextDisplay
          content: planoContent,
        },
        {
          type: 13, // Separator
          divider: true,
          spacing: 1,
        },
        selectSeguro.toJSON(),
        actionButtons.toJSON(),
      ],
    },
  ];
}

module.exports = { getPainelPlanos };
