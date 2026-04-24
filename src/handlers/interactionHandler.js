/**
 * Handler central de interações (botões, selects, modais).
 *
 * Fluxo geral:
 *  1. Usuário usa /painel  → painel home (ephemeral, Components V2)
 *  2. Clica em Canal Logs, Cargo Cliente ou Criar Anúncio → painel específico
 *  3. Faz seleções nos menus  → armazenadas em memória (userSelections)
 *  4. Clica em Confirmar     → salva config em guildConfigs + follow-up de sucesso
 *  5. Clica em Cancelar      → volta ao painel home
 *  6. Clica em Excluir       → remove a config salva + follow-up informativo
 *  7. Clica em Voltar Home   → volta ao painel home
 *
 * Nota: as configurações são armazenadas em memória (Map).
 * Em produção, substitua por um banco de dados persistente.
 */

const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const { updateComponentsV2, deferUpdate, followUp } = require('../utils/componentsV2');
const { getPainelHome } = require('../panels/painelHome');
const { getPainelCanalLogs } = require('../panels/painelCanalLogs');
const { getPainelCargoCliente } = require('../panels/painelCargoCliente');
const { getPainelAnuncio } = require('../panels/painelAnuncio');
const { getPainelMercadoPago } = require('../panels/painelMercadoPago');
const { getPainelPlanos } = require('../panels/painelPlanos');
const { getPainelFaturamento } = require('../panels/painelFaturamento');
const { formatCurrency, parseCurrency } = require('../utils/currency');
const emojis = require('../utils/emojis');

// Seleções temporárias por usuário: { canalType, channelId, cargoId, anuncioChannelId, anuncioType }
const userSelections = new Map();

// Configurações salvas por guild: { canal_ticket_fechado, canal_ticket_vendas, canal_transcript, canal_ticket_aberto, cargoCliente, mercadoPagoToken }
const guildConfigs = new Map();

// Dados financeiros por guild: { sales: [], totalRevenue, totalCost, totalProfit }
// Cada venda: { titulo, preco, custo, lucro, data, tipo }
// AVISO: Armazenamento em memória - todos os dados serão perdidos ao reiniciar o bot.
// Para produção, implemente persistência em banco de dados.
const financialData = new Map();

/** Labels amigáveis para os tipos de canal de log */
const CANAL_LABELS = {
  canal_ticket_fechado: 'Canal Ticket Fechado',
  canal_ticket_vendas: 'Canal Ticket Vendas',
  canal_transcript: 'Canal Transcript',
  canal_ticket_aberto: 'Canal Ticket Aberto',
};

/** Labels amigáveis para tipos de anúncio */
const ANUNCIO_TYPE_LABELS = {
  produto_digital: 'Produto Digital 💻',
  produto_fisico: 'Produto Físico 📦',
  servico: 'Serviço 🛠️',
};

// ─────────────────────────────────────────────────────────────────────────────
// Entry point
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Rota principal: direciona cada tipo de interação ao handler correto.
 * @param {import('discord.js').Interaction} interaction
 */
async function handleInteraction(interaction) {
  if (interaction.isButton()) {
    await handleButton(interaction);
  } else if (interaction.isStringSelectMenu()) {
    await handleStringSelect(interaction);
  } else if (interaction.isChannelSelectMenu()) {
    await handleChannelSelect(interaction);
  } else if (interaction.isRoleSelectMenu()) {
    await handleRoleSelect(interaction);
  } else if (interaction.isModalSubmit()) {
    await handleModalSubmit(interaction);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Botões
// ─────────────────────────────────────────────────────────────────────────────

async function handleButton(interaction) {
  const { customId } = interaction;
  const userName = interaction.user.username;
  const userId = interaction.user.id;
  const guildId = interaction.guildId;

  switch (customId) {
    // ── Navegação principal ──────────────────────────────────────────────────
    case 'painel_canal_logs':
      await updateComponentsV2(interaction, getPainelCanalLogs());
      break;

    case 'painel_cargo_cliente':
      await updateComponentsV2(interaction, getPainelCargoCliente());
      break;

    case 'painel_anuncio':
      await updateComponentsV2(interaction, getPainelAnuncio());
      break;

    case 'painel_mercado_pago':
      await updateComponentsV2(interaction, getPainelMercadoPago());
      break;

    case 'painel_planos':
      await updateComponentsV2(interaction, getPainelPlanos('mensal'));
      break;

    case 'painel_faturamento': {
      const guildFinances = financialData.get(guildId) ?? { sales: [], totalRevenue: 0, totalCost: 0, totalProfit: 0 };
      await updateComponentsV2(interaction, getPainelFaturamento(userName, guildFinances));
      break;
    }

    // ── Navegação de tabs dos planos ─────────────────────────────────────────
    case 'tab_plano_mensal':
      await updateComponentsV2(interaction, getPainelPlanos('mensal'));
      break;

    case 'tab_plano_trimestral':
      await updateComponentsV2(interaction, getPainelPlanos('trimestral'));
      break;

    case 'tab_plano_anual':
      await updateComponentsV2(interaction, getPainelPlanos('anual'));
      break;

    // ── Botões de assinatura dos planos ──────────────────────────────────────
    case 'btn_assinar_mensal':
    case 'btn_assinar_trimestral':
    case 'btn_assinar_anual': {
      const planType = customId.replace('btn_assinar_', '');
      const sel = userSelections.get(userId) ?? {};
      const hasSeguro = sel.seguroPlano === 'com_seguro';
      
      const planNames = {
        mensal: 'Plano Mensal',
        trimestral: 'Plano Trimestral',
        anual: 'Plano Anual',
      };

      await deferUpdate(interaction);
      await followUp(
        interaction,
        `${emojis.check} **${planNames[planType]}** selecionado com sucesso!\n\n` +
        `${hasSeguro ? `${emojis.shield} Seguro ativado: Proteção de 50% em caso de falência\n` : ''}` +
        `${emojis.payment} Em breve você receberá o link de pagamento.\n\n` +
        `${emojis.info} Esta é uma demonstração. Em produção, integre com o sistema de pagamento.`,
      );
      userSelections.delete(userId);
      break;
    }

    case 'btn_back_home':
      userSelections.delete(userId);
      await updateComponentsV2(interaction, getPainelHome(userName));
      break;

    // ── Botões indicadores de seção (desabilitados, apenas visuais) ──────────
    case 'btn_show_canal_logs':
    case 'btn_show_cargo_cliente':
    case 'btn_show_anuncio':
    case 'btn_show_mercado_pago':
      await deferUpdate(interaction);
      break;

    // ── Confirmar — Canal Logs ───────────────────────────────────────────────
    case 'btn_confirm_config': {
      const sel = userSelections.get(userId) ?? {};

      if (!sel.canalType) {
        await deferUpdate(interaction);
        await followUp(
          interaction,
          `${emojis.warning} Selecione o **tipo de canal** no menu antes de confirmar.`,
        );
        break;
      }

      if (!sel.channelId) {
        await deferUpdate(interaction);
        await followUp(
          interaction,
          `${emojis.warning} Selecione o **canal do servidor** antes de confirmar.`,
        );
        break;
      }

      // Salva na config da guild
      if (!guildConfigs.has(guildId)) guildConfigs.set(guildId, {});
      guildConfigs.get(guildId)[sel.canalType] = sel.channelId;

      const label = CANAL_LABELS[sel.canalType] ?? sel.canalType;
      await deferUpdate(interaction);
      await followUp(
        interaction,
        `${emojis.check} **${label}** configurado com sucesso para <#${sel.channelId}>!\n\nVocê pode configurar os demais canais voltando ao painel.`,
      );

      userSelections.delete(userId);
      break;
    }

    // ── Cancelar — Canal Logs ────────────────────────────────────────────────
    case 'btn_cancel_config':
      userSelections.delete(userId);
      await updateComponentsV2(interaction, getPainelHome(userName));
      break;

    // ── Excluir — Canal Logs ─────────────────────────────────────────────────
    case 'btn_delete_config': {
      const sel = userSelections.get(userId) ?? {};
      const cfg = guildConfigs.get(guildId);

      if (!cfg) {
        await deferUpdate(interaction);
        await followUp(interaction, `${emojis.info} Nenhuma configuração encontrada para excluir.`);
        break;
      }

      if (sel.canalType && cfg[sel.canalType]) {
        const label = CANAL_LABELS[sel.canalType] ?? sel.canalType;
        delete cfg[sel.canalType];
        await deferUpdate(interaction);
        await followUp(interaction, `${emojis.trash} Configuração de **${label}** excluída com sucesso!`);
      } else {
        // Exclui todas as configurações de canal
        for (const key of Object.keys(CANAL_LABELS)) delete cfg[key];
        await deferUpdate(interaction);
        await followUp(interaction, `${emojis.trash} Todas as configurações de canal foram excluídas!`);
      }

      userSelections.delete(userId);
      break;
    }

    // ── Confirmar — Cargo Cliente ────────────────────────────────────────────
    case 'btn_confirm_cargo': {
      const sel = userSelections.get(userId) ?? {};

      if (!sel.cargoId) {
        await deferUpdate(interaction);
        await followUp(interaction, `${emojis.warning} Selecione um **cargo** antes de confirmar.`);
        break;
      }

      if (!guildConfigs.has(guildId)) guildConfigs.set(guildId, {});
      guildConfigs.get(guildId).cargoCliente = sel.cargoId;

      await deferUpdate(interaction);
      await followUp(
        interaction,
        `${emojis.check} **Cargo Cliente** configurado com sucesso para <@&${sel.cargoId}>!\n\nOs clientes receberão este cargo automaticamente após a confirmação de compra.`,
      );

      userSelections.delete(userId);
      break;
    }

    // ── Cancelar — Cargo Cliente ─────────────────────────────────────────────
    case 'btn_cancel_cargo':
      userSelections.delete(userId);
      await updateComponentsV2(interaction, getPainelHome(userName));
      break;

    // ── Excluir — Cargo Cliente ──────────────────────────────────────────────
    case 'btn_delete_cargo': {
      const cfg = guildConfigs.get(guildId);
      if (cfg?.cargoCliente) {
        delete cfg.cargoCliente;
        await deferUpdate(interaction);
        await followUp(interaction, `${emojis.trash} Configuração de **Cargo Cliente** excluída com sucesso!`);
      } else {
        await deferUpdate(interaction);
        await followUp(interaction, `${emojis.info} Nenhuma configuração de cargo encontrada para excluir.`);
      }
      userSelections.delete(userId);
      break;
    }

    // ── Confirmar — Anúncio (abre Modal) ─────────────────────────────────────
    case 'btn_confirm_anuncio': {
      const sel = userSelections.get(userId) ?? {};

      if (!sel.anuncioChannelId) {
        // Responde com follow-up via deferUpdate primeiro
        await deferUpdate(interaction);
        await followUp(interaction, `${emojis.warning} Selecione o **canal** onde o anúncio será publicado.`);
        break;
      }

      if (!sel.anuncioType) {
        await deferUpdate(interaction);
        await followUp(interaction, `${emojis.warning} Selecione o **tipo de produto/serviço** antes de continuar.`);
        break;
      }

      // Abre modal para preencher detalhes do anúncio
      const modal = new ModalBuilder()
        .setCustomId('modal_anuncio')
        .setTitle('Criar Anúncio')
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('anuncio_titulo')
              .setLabel('Título do Produto/Serviço')
              .setStyle(TextInputStyle.Short)
              .setPlaceholder('Ex: Curso de JavaScript Completo')
              .setRequired(true)
              .setMaxLength(100),
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('anuncio_descricao')
              .setLabel('Descrição')
              .setStyle(TextInputStyle.Paragraph)
              .setPlaceholder('Descreva seu produto ou serviço...')
              .setRequired(true)
              .setMaxLength(1000),
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('anuncio_preco')
              .setLabel('Preço de Venda (R$)')
              .setStyle(TextInputStyle.Short)
              .setPlaceholder('Ex: 97,00')
              .setRequired(true)
              .setMaxLength(20),
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('anuncio_custo')
              .setLabel('Custo do Produto (R$)')
              .setStyle(TextInputStyle.Short)
              .setPlaceholder('Ex: 45,00')
              .setRequired(true)
              .setMaxLength(20),
          ),
        );

      await interaction.showModal(modal);
      break;
    }

    // ── Cancelar — Anúncio ───────────────────────────────────────────────────
    case 'btn_cancel_anuncio':
      userSelections.delete(userId);
      await updateComponentsV2(interaction, getPainelHome(userName));
      break;

    // ── Descartar Rascunho — Anúncio ─────────────────────────────────────────
    case 'btn_delete_anuncio':
      userSelections.delete(userId);
      await deferUpdate(interaction);
      await followUp(interaction, `${emojis.trash} Rascunho de anúncio descartado!`);
      break;

    // ── Configurar — Mercado Pago (abre Modal) ───────────────────────────────
    case 'btn_config_mercado_pago': {
      const modal = new ModalBuilder()
        .setCustomId('modal_mercado_pago')
        .setTitle('Configurar Mercado Pago')
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('mercado_pago_token')
              .setLabel('Token de Produção')
              .setStyle(TextInputStyle.Paragraph)
              .setPlaceholder('Cole aqui seu token de produção do Mercado Pago')
              .setRequired(true)
              .setMaxLength(500),
          ),
        );

      await interaction.showModal(modal);
      break;
    }

    // ── Cancelar — Mercado Pago ──────────────────────────────────────────────
    case 'btn_cancel_mercado_pago':
      userSelections.delete(userId);
      await updateComponentsV2(interaction, getPainelHome(userName));
      break;

    // ── Excluir — Mercado Pago ───────────────────────────────────────────────
    case 'btn_delete_mercado_pago': {
      const cfg = guildConfigs.get(guildId);
      if (cfg?.mercadoPagoToken) {
        delete cfg.mercadoPagoToken;
        await deferUpdate(interaction);
        await followUp(interaction, `${emojis.trash} Configuração de **Mercado Pago** excluída com sucesso!`);
      } else {
        await deferUpdate(interaction);
        await followUp(interaction, `${emojis.info} Nenhuma configuração do Mercado Pago encontrada para excluir.`);
      }
      userSelections.delete(userId);
      break;
    }

    default:
      console.warn(`[InteractionHandler] Botão não tratado: ${customId}`);
      await deferUpdate(interaction);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Select menus (String)
// ─────────────────────────────────────────────────────────────────────────────

async function handleStringSelect(interaction) {
  const { customId, values } = interaction;
  const userId = interaction.user.id;

  if (!userSelections.has(userId)) userSelections.set(userId, {});
  const sel = userSelections.get(userId);

  switch (customId) {
    case 'select_canal_logs_type':
      sel.canalType = values[0];
      await deferUpdate(interaction);
      break;

    case 'select_anuncio_type':
      sel.anuncioType = values[0];
      await deferUpdate(interaction);
      break;

    case 'select_seguro_plano':
      sel.seguroPlano = values[0];
      await deferUpdate(interaction);
      break;

    default:
      console.warn(`[InteractionHandler] StringSelect não tratado: ${customId}`);
      await deferUpdate(interaction);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Select menus (Channel)
// ─────────────────────────────────────────────────────────────────────────────

async function handleChannelSelect(interaction) {
  const { customId, values } = interaction;
  const userId = interaction.user.id;

  if (!userSelections.has(userId)) userSelections.set(userId, {});
  const sel = userSelections.get(userId);

  switch (customId) {
    case 'select_canal_channel':
      sel.channelId = values[0];
      await deferUpdate(interaction);
      break;

    case 'select_anuncio_channel':
      sel.anuncioChannelId = values[0];
      await deferUpdate(interaction);
      break;

    default:
      console.warn(`[InteractionHandler] ChannelSelect não tratado: ${customId}`);
      await deferUpdate(interaction);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Select menus (Role)
// ─────────────────────────────────────────────────────────────────────────────

async function handleRoleSelect(interaction) {
  const { customId, values } = interaction;
  const userId = interaction.user.id;

  if (!userSelections.has(userId)) userSelections.set(userId, {});
  const sel = userSelections.get(userId);

  switch (customId) {
    case 'select_cargo_cliente':
      sel.cargoId = values[0];
      await deferUpdate(interaction);
      break;

    default:
      console.warn(`[InteractionHandler] RoleSelect não tratado: ${customId}`);
      await deferUpdate(interaction);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Modais
// ─────────────────────────────────────────────────────────────────────────────

async function handleModalSubmit(interaction) {
  const { customId } = interaction;
  const userId = interaction.user.id;

  switch (customId) {
    case 'modal_anuncio': {
      const titulo = interaction.fields.getTextInputValue('anuncio_titulo');
      const descricao = interaction.fields.getTextInputValue('anuncio_descricao');
      const preco = interaction.fields.getTextInputValue('anuncio_preco');
      const custo = interaction.fields.getTextInputValue('anuncio_custo');

      const sel = userSelections.get(userId) ?? {};
      const channelId = sel.anuncioChannelId;
      const typeLabel = ANUNCIO_TYPE_LABELS[sel.anuncioType] ?? sel.anuncioType ?? 'N/A';

      // Converter e validar valores
      const precoNum = parseCurrency(preco);
      const custoNum = parseCurrency(custo);

      // Validar entradas
      if (isNaN(precoNum) || precoNum < 0) {
        await interaction.reply({
          content: `${emojis.error} **Preço inválido!** Por favor, insira um valor numérico válido (ex: 97,00 ou 97.00).`,
          ephemeral: true,
        });
        break;
      }

      if (isNaN(custoNum) || custoNum < 0) {
        await interaction.reply({
          content: `${emojis.error} **Custo inválido!** Por favor, insira um valor numérico válido (ex: 45,00 ou 45.00).`,
          ephemeral: true,
        });
        break;
      }

      const lucro = precoNum - custoNum;

      // Registrar venda nos dados financeiros
      const guildFinances = financialData.get(guildId) ?? { sales: [], totalRevenue: 0, totalCost: 0, totalProfit: 0 };
      guildFinances.sales.push({
        titulo,
        preco: precoNum,
        custo: custoNum,
        lucro,
        data: new Date().toISOString(),
        tipo: typeLabel,
      });
      guildFinances.totalRevenue += precoNum;
      guildFinances.totalCost += custoNum;
      guildFinances.totalProfit += lucro;
      financialData.set(guildId, guildFinances);

      // Aviso se o lucro for negativo (vendendo no prejuízo)
      const warningMsg = lucro < 0 
        ? `\n${emojis.warning} **ATENÇÃO:** Este produto está sendo vendido com prejuízo (custo maior que preço)!` 
        : '';

      // Confirmação efêmera para o admin
      await interaction.reply({
        content: [
          `${emojis.check} **Anúncio criado com sucesso!**`,
          '',
          `**Título:** ${titulo}`,
          `**Tipo:** ${typeLabel}`,
          `**Preço de Venda:** R$ ${preco}`,
          `**Custo:** R$ ${custo}`,
          `**Lucro:** R$ ${formatCurrency(lucro)}`,
          `**Canal:** <#${channelId}>`,
          warningMsg,
          '',
          `${emojis.info} O anúncio foi publicado no canal selecionado.`,
        ].join('\n'),
        ephemeral: true,
      });

      // Publica o anúncio no canal selecionado
      if (channelId) {
        try {
          const channel = await interaction.guild.channels.fetch(channelId);
          if (channel?.isTextBased()) {
            await channel.send({
              content: [
                `# ${titulo}`,
                '',
                descricao,
                '',
                `${emojis.money} **Preço:** R$ ${preco}`,
                `${emojis.star} **Tipo:** ${typeLabel}`,
              ].join('\n'),
            });
          }
        } catch (err) {
          console.error('[InteractionHandler] Erro ao publicar anúncio:', err);
        }
      }

      userSelections.delete(userId);
      break;
    }

    case 'modal_mercado_pago': {
      const token = interaction.fields.getTextInputValue('mercado_pago_token');
      const guildId = interaction.guildId;

      // Salva na config da guild
      if (!guildConfigs.has(guildId)) guildConfigs.set(guildId, {});
      guildConfigs.get(guildId).mercadoPagoToken = token;

      // Mascara o token para exibição (mostra apenas os últimos 4 caracteres)
      const maskedToken = token.length > 4 
        ? `***${token.slice(-4)}`
        : '***';

      await interaction.reply({
        content: [
          `${emojis.check} **Token do Mercado Pago configurado com sucesso!**`,
          '',
          `**Token:** ${maskedToken}`,
          '',
          `${emojis.info} O token foi salvo e será usado para processar pagamentos.`,
          `${emojis.warning} Mantenha seu token seguro e nunca o compartilhe.`,
        ].join('\n'),
        ephemeral: true,
      });

      userSelections.delete(userId);
      break;
    }

    default:
      console.warn(`[InteractionHandler] Modal não tratado: ${customId}`);
  }
}

/**
 * Retorna os dados financeiros de uma guild.
 * @param {string} guildId
 * @returns {object} { sales: [], totalRevenue: 0, totalCost: 0, totalProfit: 0 }
 */
function getFinancialData(guildId) {
  return financialData.get(guildId) ?? { sales: [], totalRevenue: 0, totalCost: 0, totalProfit: 0 };
}

module.exports = { handleInteraction, guildConfigs, userSelections, getFinancialData };
