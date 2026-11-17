const wholeDollars = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const withCents = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

/** Formats US dollars: 1250 -> "$1,250", 1249.99 -> "$1,249.99". */
export function formatCurrency(amount: number): string {
  return (Number.isInteger(amount) ? wholeDollars : withCents).format(amount);
}
