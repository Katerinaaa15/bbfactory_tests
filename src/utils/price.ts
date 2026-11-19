export interface PriceRange {
  min: number;
  max: number;
}

/** "€10.00" -> 10, "€1,234.50" -> 1234.5 */
export function parseAmount(text: string): number {
  return parseFloat(text.replace(/[^\d.,]/g, '').replace(/,/g, ''));
}

/** One amount = fixed price; two amounts = price range. */
export function toRange(amounts: string[]): PriceRange {
  const values = amounts.map(parseAmount);
  return { min: Math.min(...values), max: Math.max(...values) };
}
