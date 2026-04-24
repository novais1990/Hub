/**
 * Painel Dashboard Financeiro — visualização de faturamento e lucros.
 *
 * Estrutura (Components V2):
 *   Container (cor de fundo do Discord)
 *     ActionRow    → botão Voltar Home
 *     TextDisplay  → título: DASHBOARD FINANCEIRO
 *     Separator
 *     TextDisplay  → saudação personalizada + informações financeiras
 *     Separator
 *     TextDisplay  → valores: Faturamento Bruto, Custos Totais, Lucro Líquido
 *     Separator
 *     TextDisplay  → lista de vendas recentes (últimas 5)
 */

const emojis = require('../utils/emojis');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

/**
 * Retorna o array de componentes do dashboard financeiro.
 * @param {string} userName  Nome do usuário que abriu o painel
 * @param {object} financialData  Dados financeiros: { sales, totalRevenue, totalCost, totalProfit }
 * @returns {object[]}
 */
function getPainelFaturamento(userName, financialData = { sales: [], totalRevenue: 0, totalCost: 0, totalProfit: 0 }) {
  const navigationRow = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('btn_back_home')
        .setLabel('Voltar Home')
        .setEmoji(emojis.home)
        .setStyle(ButtonStyle.Secondary),
    );

  // Formatar valores monetários
  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Informações gerais
  const totalSales = financialData.sales.length;
  const avgTicket = totalSales > 0 ? financialData.totalRevenue / totalSales : 0;
  const profitMargin = financialData.totalRevenue > 0 
    ? ((financialData.totalProfit / financialData.totalRevenue) * 100).toFixed(1) 
    : 0;

  // Saudação e resumo
  const greetingContent = [
    `Olá senhor **${userName}**, seu faturamento abaixo com toda informação até o momento.`,
    '',
    `${emojis.graph} **Total de Vendas:** ${totalSales}`,
    `${emojis.receipt} **Ticket Médio:** R$ ${formatCurrency(avgTicket)}`,
    `${emojis.shield} **Margem de Lucro:** ${profitMargin}%`,
  ].join('\n');

  // Valores principais
  const mainValuesContent = [
    `${emojis.coins} **FATURAMENTO BRUTO (RECEITA TOTAL)**`,
    `R$ ${formatCurrency(financialData.totalRevenue)}`,
    '',
    `${emojis.warning} **CUSTOS TOTAIS**`,
    `R$ ${formatCurrency(financialData.totalCost)}`,
    '',
    `${emojis.money} **LUCRO LÍQUIDO**`,
    `R$ ${formatCurrency(financialData.totalProfit)}`,
  ].join('\n');

  // Últimas vendas
  let recentSalesContent = `${emojis.star} **ÚLTIMAS VENDAS**\n`;
  if (totalSales === 0) {
    recentSalesContent += '\nNenhuma venda registrada ainda.';
  } else {
    const recentSales = financialData.sales.slice(-5).reverse();
    recentSalesContent += '\n';
    recentSales.forEach((sale, index) => {
      const saleDate = new Date(sale.date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      recentSalesContent += `**${index + 1}.** ${sale.titulo}\n`;
      recentSalesContent += `   └ Tipo: ${sale.tipo}\n`;
      recentSalesContent += `   └ Preço: R$ ${formatCurrency(sale.preco)} | Custo: R$ ${formatCurrency(sale.custo)} | Lucro: R$ ${formatCurrency(sale.lucro)}\n`;
      recentSalesContent += `   └ Data: ${saleDate}\n`;
      if (index < recentSales.length - 1) {
        recentSalesContent += '\n';
      }
    });
  }

  return [
    {
      type: 17, // Container
      components: [
        navigationRow.toJSON(),
        {
          type: 14, // TextDisplay
          content: `${emojis.dashboard} **DASHBOARD FINANCEIRO**`,
        },
        {
          type: 13, // Separator
          divider: true,
          spacing: 1,
        },
        {
          type: 14, // TextDisplay
          content: greetingContent,
        },
        {
          type: 13, // Separator
          divider: true,
          spacing: 1,
        },
        {
          type: 14, // TextDisplay
          content: mainValuesContent,
        },
        {
          type: 13, // Separator
          divider: true,
          spacing: 1,
        },
        {
          type: 14, // TextDisplay
          content: recentSalesContent,
        },
      ],
    },
  ];
}

module.exports = { getPainelFaturamento };
