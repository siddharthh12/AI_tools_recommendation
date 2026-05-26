/**
 * Central Score Normalizer
 * 
 * Takes raw numeric score values and clamps them securely between 0 and 100,
 * rounding to the nearest whole integer. Prevents out-of-bound errors.
 */

/**
 * Normalizes and clamps any raw value between 0 and 100.
 * @param {number} value - Input score value
 * @returns {number} Clamped and rounded score
 */
const normalize = (value) => {
  if (value === undefined || value === null || isNaN(value)) {
    return 0;
  }
  return Math.min(100, Math.max(0, Math.round(value)));
};

module.exports = normalize;
