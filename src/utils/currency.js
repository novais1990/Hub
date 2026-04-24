/**
 * Utilitários para formatação de valores monetários.
 */

/**
 * Formata um valor numérico como moeda brasileira (R$).
 * @param {number} value  Valor a ser formatado
 * @returns {string}      Valor formatado (ex: "1.234,56")
 */
function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
}

/**
 * Converte uma string de valor monetário para número.
 * Aceita formatos como: "1.234,56" ou "1234.56" ou "1234,56"
 * @param {string} str  String a ser convertida
 * @returns {number}    Valor numérico ou NaN se inválido
 */
function parseCurrency(str) {
  if (typeof str !== 'string') return NaN;
  // Remove espaços e substitui vírgula por ponto
  const normalized = str.trim().replace(',', '.');
  return parseFloat(normalized);
}

module.exports = {
  formatCurrency,
  parseCurrency,
};
