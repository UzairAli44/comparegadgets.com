import type { CurrencyCode, FxTable } from "./types.ts";

export function convert(amount: number, from: CurrencyCode, to: CurrencyCode, fx: FxTable): number {
  if (from === to) return amount;
  const fromRate = fx.rates[from];
  const toRate = fx.rates[to];
  if (fromRate === undefined) throw new Error(`No FX rate for ${from}`);
  if (toRate === undefined) throw new Error(`No FX rate for ${to}`);
  return (amount / fromRate) * toRate;
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
