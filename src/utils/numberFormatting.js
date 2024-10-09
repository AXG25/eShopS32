// utils/numberFormatting.js

/**
 * Parsea un valor a float con opciones de configuración.
 * @param {number|string} value - El valor a parsear.
 * @param {Object} options - Opciones de configuración.
 * @param {number|null} options.defaultValue - Valor por defecto si no se puede parsear (default: null).
 * @param {number} options.decimalPlaces - Número de decimales a mantener (default: -1, mantiene todos).
 * @param {boolean} options.trimZeros - Eliminar ceros finales en decimales (default: false).
 * @param {string} options.decimalSeparator - Separador decimal (default: ',').
 * @param {boolean} options.allowNegative - Permitir números negativos (default: true).
 * @returns {number|null} El valor parseado o el valor por defecto.
 */
export const parseFloat = (value, options = {}) => {
  const {
    defaultValue = null,
    decimalPlaces = -1,
    trimZeros = false,
    decimalSeparator = ',',
    allowNegative = true,
  } = options;

  try {
    if (typeof value === 'number') {
      return formatResult(value, decimalPlaces, trimZeros);
    }

    if (value === null || value === undefined || value === "") {
      return defaultValue;
    }

    let stringValue = value.toString();

    // Manejar números negativos
    const isNegative = stringValue.startsWith('-');
    if (isNegative && !allowNegative) {
      return defaultValue;
    }
    stringValue = isNegative ? stringValue.slice(1) : stringValue;

    // Normalizar el valor
    const regex = new RegExp(`[^0-9${decimalSeparator}]`, 'g');
    stringValue = stringValue
      .replace(regex, '')
      .replace(decimalSeparator, '.');

    const number = Number.parseFloat(stringValue);

    if (isNaN(number)) {
      return defaultValue;
    }

    const result = isNegative ? -number : number;
    return formatResult(result, decimalPlaces, trimZeros);
  } catch (e) {
    console.error("Error parsing float:", e);
    return defaultValue;
  }
};

/**
 * Formatea el resultado final según las opciones especificadas.
 * @param {number} value - El valor a formatear.
 * @param {number} decimalPlaces - Número de decimales a mantener.
 * @param {boolean} trimZeros - Eliminar ceros finales en decimales.
 * @returns {number} El valor formateado.
 */
const formatResult = (value, decimalPlaces, trimZeros) => {
  if (decimalPlaces >= 0) {
    value = Number(value.toFixed(decimalPlaces));
  }

  if (trimZeros && decimalPlaces > 0) {
    value = Number(value.toString());
  }

  return value;
};

/**
 * Formatea un número como string con separadores personalizados.
 * @param {number} value - El número a formatear.
 * @param {Object} options - Opciones de configuración.
 * @param {string} options.thousandsSeparator - Separador de miles (default: '.').
 * @param {string} options.decimalSeparator - Separador decimal (default: ',').
 * @param {number} options.decimalPlaces - Número de decimales a mostrar (default: 2).
 * @returns {string} El número formateado como string.
 */
export const formatNumber = (value, options = {}) => {
  const {
    thousandsSeparator = '.',
    decimalSeparator = ',',
    decimalPlaces = 2,
  } = options;

  if (typeof value !== 'number') {
    return '';
  }

  const parts = value.toFixed(decimalPlaces).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);

  return parts.join(decimalSeparator);
};


/**
 * Verifica si un valor puede ser transformado a número.
 * @param {any} value - El valor a verificar.
 * @param {Object} options - Opciones de configuración.
 * @param {string} options.thousandsSeparator - Separador de miles (default: '.').
 * @param {string} options.decimalSeparator - Separador decimal (default: ',').
 * @param {boolean} options.allowNegative - Permitir números negativos (default: true).
 * @returns {boolean} True si el valor puede ser transformado a número, false en caso contrario.
 */
export const isTransformableToNumber = (value, options = {}) => {
  const {
    thousandsSeparator = '.',
    decimalSeparator = ',',
    allowNegative = true,
  } = options;

  // Si ya es un número, retornar true
  if (typeof value === 'number' && !isNaN(value)) {
    return true;
  }

  // Si no es string, no es transformable
  if (typeof value !== 'string') {
    return false;
  }

  // Eliminar espacios en blanco
  let stringValue = value.trim();

  // Verificar si es un número negativo
  const isNegative = stringValue.startsWith('-');
  if (isNegative) {
    if (!allowNegative) return false;
    stringValue = stringValue.slice(1);
  }

  // Crear una expresión regular que permita:
  // - Dígitos
  // - Un único separador decimal
  // - Múltiples separadores de miles en las posiciones correctas
  const regexPattern = new RegExp(
    `^\\d{1,3}(${thousandsSeparator}\\d{3})*` +
    `(${decimalSeparator}\\d+)?$`
  );

  if (!regexPattern.test(stringValue)) {
    return false;
  }

  // Si pasa todas las verificaciones, intentar convertir a número
  const normalizedValue = stringValue
    .replace(new RegExp(`\\${thousandsSeparator}`, 'g'), '')
    .replace(decimalSeparator, '.');

  const number = Number.parseFloat(normalizedValue);
  return !isNaN(number);
};