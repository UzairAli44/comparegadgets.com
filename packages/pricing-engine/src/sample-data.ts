/**
 * ILLUSTRATIVE data for the demo and tests only. Prices, FX rates and tax rules are
 * round, made-up numbers — NOT real market data. Production data comes from the
 * ingestion pipeline and the maintained tax-rules table (see docs/ARCHITECTURE.md).
 */
import type { CountryTaxRules, FxTable, Offer } from "./types.ts";

export const sampleFx: FxTable = {
  base: "USD",
  asOf: "2026-09-30T00:00:00Z",
  rates: { USD: 1, JPY: 150, EUR: 0.9, AED: 3.67, PKR: 280, GBP: 0.78 },
};

export const sampleTaxRules: Record<string, CountryTaxRules> = {
  US: { country: "US", currency: "USD", consumerTaxRate: 0.07, touristRefundShareOfTax: 0, importDutyRate: 0, importTaxRate: 0, deMinimis: 800, travellerAllowance: 800 },
  JP: { country: "JP", currency: "JPY", consumerTaxRate: 0.1, touristRefundShareOfTax: 1, importDutyRate: 0, importTaxRate: 0.1, deMinimis: 10000, travellerAllowance: 200000 },
  DE: { country: "DE", currency: "EUR", consumerTaxRate: 0.19, touristRefundShareOfTax: 0.7, importDutyRate: 0, importTaxRate: 0.19, deMinimis: 0, travellerAllowance: 430 },
  AE: { country: "AE", currency: "AED", consumerTaxRate: 0.05, touristRefundShareOfTax: 0.85, importDutyRate: 0.05, importTaxRate: 0.05, deMinimis: 1000, travellerAllowance: 3000 },
  PK: { country: "PK", currency: "PKR", consumerTaxRate: 0.18, touristRefundShareOfTax: 0, importDutyRate: 0.25, importTaxRate: 0.18, deMinimis: 0, travellerAllowance: 0 },
};

const base = {
  variantId: "apple-iphone-17-pro-256gb",
  inStock: true,
  observedAt: "2026-09-30T00:00:00Z",
};

export const sampleOffers: Offer[] = [
  { ...base, offerId: "us-1", retailer: "Example US Store", country: "US", price: { amount: 1099, currency: "USD" }, priceIncludesTax: false, shipsTo: ["US"], internationalWarranty: true, regionalNotes: ["US model is eSIM-only (no physical SIM tray)."], url: "https://example.com/us" },
  { ...base, offerId: "jp-1", retailer: "Example JP Store", country: "JP", price: { amount: 179800, currency: "JPY" }, priceIncludesTax: true, shipsTo: ["JP"], internationalWarranty: true, regionalNotes: ["Japanese model: camera shutter sound cannot be disabled."], url: "https://example.com/jp" },
  { ...base, offerId: "de-1", retailer: "Example DE Store", country: "DE", price: { amount: 1299, currency: "EUR" }, priceIncludesTax: true, shipsTo: ["DE", "PK", "AE"], shippingTo: { PK: 40, AE: 30 }, internationalWarranty: true, url: "https://example.com/de" },
  { ...base, offerId: "ae-1", retailer: "Example AE Store", country: "AE", price: { amount: 4299, currency: "AED" }, priceIncludesTax: true, shipsTo: ["AE", "PK"], shippingTo: { PK: 80 }, internationalWarranty: true, url: "https://example.com/ae" },
  { ...base, offerId: "pk-1", retailer: "Example PK Store", country: "PK", price: { amount: 520000, currency: "PKR" }, priceIncludesTax: true, shipsTo: ["PK"], internationalWarranty: true, url: "https://example.com/pk" },
];
