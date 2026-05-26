/**
 * Utility functions for frontend calculations and layouts.
 */

/**
 * Combines multiple CSS class strings together safely.
 * @param {...string} classes - Class name strings
 * @returns {string} Concatenated class list
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Maps visibility score integers to specific gradient color schemes.
 * @param {number} score - Discoverability score (0 - 100)
 * @returns {string} Tailwind CSS class styles for text and background gradients
 */
export function getScoreColor(score) {
  if (score >= 80) {
    return {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/30',
      fill: 'bg-emerald-500',
      label: 'High Visibility'
    };
  }
  if (score >= 60) {
    return {
      text: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/30',
      fill: 'bg-amber-500',
      label: 'Moderate Visibility'
    };
  }
  return {
    text: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/30',
    fill: 'bg-rose-500',
    label: 'Critical Visibility'
  };
}

/**
 * Formats timestamps into standard date representations.
 * @param {string|Date} dateVal - Input timestamp
 * @returns {string} Formatted date string
 */
export function formatDate(dateVal) {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
