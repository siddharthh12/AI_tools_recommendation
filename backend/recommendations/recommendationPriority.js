/**
 * Recommendation Priority Module
 * 
 * Grades the severity of detected weaknesses into HIGH, MEDIUM, or LOW
 * priority levels, establishing the order of execution.
 */

/**
 * Translates severity states to priority levels.
 * @param {string} severity - HIGH or MEDIUM severity tag
 * @returns {string} Priority: HIGH | MEDIUM | LOW
 */
const getPriority = (severity) => {
  if (!severity) return 'LOW';
  
  const uppercaseSeverity = severity.toUpperCase().trim();
  
  if (uppercaseSeverity === 'HIGH') {
    return 'HIGH';
  }
  if (uppercaseSeverity === 'MEDIUM') {
    return 'MEDIUM';
  }
  
  return 'LOW';
};

module.exports = {
  getPriority
};
