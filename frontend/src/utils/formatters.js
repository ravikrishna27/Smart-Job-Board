/**
 * Formats a number to a USD currency string.
 * e.g., 140000 -> "$140,000"
 */
export function formatSalary(amount) {
  if (typeof amount !== 'number') return amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats an ISO date string to a relative time or formatted date.
 * E.g., "Posted 2 days ago" or "Oct 24, 2026"
 */
export function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}
