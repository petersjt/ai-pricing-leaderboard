export function formatUsd(value: number, options: Intl.NumberFormatOptions = {}) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    ...options
  });

  return formatter.format(value);
}
