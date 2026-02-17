const CURRENCY_SYMBOLS: Record<string, string> = {
  MAD: 'DH',
  EUR: '€',
  USD: '$',
  GBP: '£',
};

const CURRENCY_RATES: Record<string, number> = {
  MAD: 1,
  EUR: 0.092,
  USD: 0.1,
  GBP: 0.079,
};

export function getCurrencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency] || 'DH';
}

export function convertFromMAD(amount: number, currency: string): number {
  return Math.round(amount * (CURRENCY_RATES[currency] || 1));
}

export function formatCurrency(amount: number, currency: string): string {
  const converted = convertFromMAD(amount, currency);
  const symbol = getCurrencySymbol(currency);
  return `${converted.toLocaleString()} ${symbol}`;
}
