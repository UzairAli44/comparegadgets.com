/** ISO 4217 currency code, e.g. "USD", "JPY", "PKR". */
export type CurrencyCode = string;

/** ISO 3166-1 alpha-2 country code, e.g. "US", "JP", "PK". */
export type CountryCode = string;

/** Money is always stored in minor-unit-free decimal form in its ORIGINAL currency. */
export interface Money {
  amount: number;
  currency: CurrencyCode;
}

/**
 * One observed price for one exact product variant (e.g. "iPhone 17 Pro, 256 GB")
 * at one retailer in one country. Never converted at ingest time.
 */
export interface Offer {
  offerId: string;
  variantId: string;
  retailer: string;
  country: CountryCode;
  price: Money;
  /** True for EU/UK/JP/AU style shelf prices; false for US/CA style pre-tax prices. */
  priceIncludesTax: boolean;
  inStock: boolean;
  /** Retailer ships directly to the buyer's country. */
  shipsTo: CountryCode[];
  /** Shipping cost to the buyer's country, when known, in the offer's currency. */
  shippingTo?: Record<CountryCode, number>;
  /** Regional hardware/software differences the buyer must know about. */
  regionalNotes?: string[];
  /** Whether the manufacturer honours the warranty outside the purchase country. */
  internationalWarranty: boolean;
  observedAt: string; // ISO timestamp
  url: string;
}

export interface CountryTaxRules {
  country: CountryCode;
  currency: CurrencyCode;
  /** Consumer tax (VAT/GST/sales tax) on electronics, as a fraction: 0.2 = 20 %. */
  consumerTaxRate: number;
  /** Net share of VAT a tourist gets back after refund-operator fees (0 when no scheme). */
  touristRefundShareOfTax: number;
  /** Customs duty on this category when IMPORTED into this country. */
  importDutyRate: number;
  /** Import VAT/GST charged at the border on (goods + shipping + duty). */
  importTaxRate: number;
  /** Goods valued at or below this amount (in `currency`) enter duty/tax free. Assumes the buyer pays in this currency. */
  deMinimis: number;
  /** Per-traveller duty-free allowance for goods carried in personally (in `currency`). */
  travellerAllowance: number;
}

export type PurchaseMode = "local" | "ship" | "travel";

export interface Buyer {
  country: CountryCode;
  currency: CurrencyCode;
  /** Card / bank FX markup on foreign-currency purchases, e.g. 0.03 = 3 %. */
  cardFxFee: number;
  /** Which purchase routes the buyer is willing to use. */
  modes: PurchaseMode[];
}

/** Rates relative to a single base (USD): 1 USD = rates[code] units of code. */
export interface FxTable {
  base: "USD";
  rates: Record<CurrencyCode, number>;
  asOf: string;
}

export interface CostLine {
  label: string;
  amount: number; // in buyer currency
}

export interface LandedCost {
  offer: Offer;
  mode: PurchaseMode;
  total: number; // in buyer currency
  currency: CurrencyCode;
  breakdown: CostLine[];
  /** Savings versus the cheapest local (home-country) option; null if none exists. */
  savingsVsLocal: number | null;
  warnings: string[];
}
