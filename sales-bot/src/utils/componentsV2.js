/**
 * Utilitários para envio de mensagens usando Discord Components V2
 * (containers, text displays, separators) via REST API.
 *
 * A flag IS_COMPONENTS_V2 (1 << 15) informa ao Discord que a mensagem
 * usa o novo sistema de componentes. Quando esta flag está ativa, a
 * mensagem NÃO pode conter os campos tradicionais "content" ou "embeds".
 *
 * Referência: https://discord.com/developers/docs/components/reference
 */

const { Routes, InteractionResponseType } = require('discord-api-types/v10');

/** Habilita o sistema de componentes V2 na mensagem */
const IS_COMPONENTS_V2 = 1 << 15; // 32768

/** Torna a mensagem visível somente para o usuário que interagiu */
const IS_EPHEMERAL = 1 << 6; // 64

/**
 * Responde a uma interação (slash command) com uma mensagem Components V2.
 * @param {import('discord.js').Interaction} interaction
 * @param {object[]} components  Array de componentes (Container, etc.)
 * @param {boolean}  ephemeral   Se a mensagem deve ser efêmera (padrão: true)
 */
async function replyComponentsV2(interaction, components, ephemeral = true) {
  await interaction.client.rest.post(
    Routes.interactionCallback(interaction.id, interaction.token),
    {
      body: {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          flags: IS_COMPONENTS_V2 | (ephemeral ? IS_EPHEMERAL : 0),
          components,
        },
      },
    },
  );
}

/**
 * Atualiza a mensagem original de uma interação de componente com novos
 * componentes V2 (ex.: clicar em um botão e trocar o painel).
 * Só pode ser chamada em interações de componente (botão, select menu).
 * @param {import('discord.js').Interaction} interaction
 * @param {object[]} components  Novos componentes
 */
async function updateComponentsV2(interaction, components) {
  if (!interaction.isMessageComponent()) {
    throw new Error('updateComponentsV2 só pode ser chamada em interações de componente (botão/select menu).');
  }
  await interaction.client.rest.post(
    Routes.interactionCallback(interaction.id, interaction.token),
    {
      body: {
        type: InteractionResponseType.UpdateMessage,
        data: {
          flags: IS_COMPONENTS_V2,
          components,
        },
      },
    },
  );
}

/**
 * Reconhece silenciosamente uma interação de componente sem alterar a mensagem.
 * Equivalente ao interaction.deferUpdate() do discord.js, mas via REST para
 * manter consistência com as demais funções deste módulo.
 * @param {import('discord.js').Interaction} interaction
 */
async function deferUpdate(interaction) {
  await interaction.client.rest.post(
    Routes.interactionCallback(interaction.id, interaction.token),
    {
      body: {
        type: InteractionResponseType.DeferredMessageUpdate,
      },
    },
  );
}

/**
 * Envia uma mensagem de acompanhamento (follow-up) simples após a interação
 * já ter sido respondida (replyComponentsV2 / updateComponentsV2 / deferUpdate).
 * @param {import('discord.js').Interaction} interaction
 * @param {string}  content    Texto da mensagem
 * @param {boolean} ephemeral  Se a mensagem deve ser efêmera (padrão: true)
 */
async function followUp(interaction, content, ephemeral = true) {
  await interaction.client.rest.post(
    Routes.webhook(interaction.applicationId, interaction.token),
    {
      body: {
        content,
        flags: ephemeral ? IS_EPHEMERAL : 0,
      },
    },
  );
}

module.exports = {
  replyComponentsV2,
  updateComponentsV2,
  deferUpdate,
  followUp,
  IS_COMPONENTS_V2,
  IS_EPHEMERAL,
};
