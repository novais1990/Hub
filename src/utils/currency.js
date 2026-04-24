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
 * Converte uma string de valor monetário brasileiro para número.
 * Formato brasileiro: ponto como separador de milhares, vírgula como decimal.
 * Exemplos: "1.234,56" → 1234.56, "97,00" → 97, "1.000.000,50" → 1000000.5
 * @param {string} str  String a ser convertida
 * @returns {number}    Valor numérico ou NaN se inválido
 */
function parseCurrency(str) {
  if (typeof str !== 'string') return NaN;
  // Remove todos os pontos (separadores de milhares) e substitui vírgula (decimal) por ponto
  const normalized = str.trim().replace(/\./g, '').replace(',', '.');
  return parseFloat(normalized);
}

module.exports = {
  formatCurrency,
  parseCurrency,
};
