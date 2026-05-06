/**
 * Format a USD price as ARS using the store exchange rate.
 * Uses es-AR locale: $ 18.000
 */
export function formatARS(priceUSD: number, exchangeRate: number): string {
  const ars = Math.round(priceUSD * exchangeRate);
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(ars);
}

/**
 * Format a price as USD.
 * Example: $15
 */
export function formatUSD(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}
