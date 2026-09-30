import { test } from "node:test";
import assert from "node:assert/strict";
import { compareGlobally, convert, landedCost } from "../src/index.ts";
import type { Buyer, CountryTaxRules, FxTable, Offer } from "../src/index.ts";
import { sampleFx, sampleOffers, sampleTaxRules } from "../src/sample-data.ts";

const rules = (c: string) => sampleTaxRules[c];

const fx: FxTable = { base: "USD", asOf: "t", rates: { USD: 1, EUR: 0.5 } };
const flatRules: Record<string, CountryTaxRules> = {
  AA: { country: "AA", currency: "USD", consumerTaxRate: 0.1, touristRefundShareOfTax: 0, importDutyRate: 0.1, importTaxRate: 0.2, deMinimis: 0, travellerAllowance: 0 },
  BB: { country: "BB", currency: "EUR", consumerTaxRate: 0.25, touristRefundShareOfTax: 0.8, importDutyRate: 0, importTaxRate: 0, deMinimis: 0, travellerAllowance: 0 },
};
const buyer: Buyer = { country: "AA", currency: "USD", cardFxFee: 0, modes: ["local", "ship", "travel"] };
const foreign: Offer = {
  offerId: "b", variantId: "v", retailer: "R", country: "BB", price: { amount: 125, currency: "EUR" },
  priceIncludesTax: true, inStock: true, shipsTo: ["AA"], shippingTo: { AA: 5 }, internationalWarranty: false,
  observedAt: "t", url: "u",
};

test("convert goes through the USD base", () => {
  assert.equal(convert(50, "EUR", "USD", fx), 100);
  assert.equal(convert(100, "USD", "EUR", fx), 50);
  assert.throws(() => convert(1, "XXX", "USD", fx), /No FX rate/);
});

test("ship: strips foreign VAT, then applies home duty and import tax", () => {
  const r = landedCost(foreign, "ship", buyer, fx, (c) => flatRules[c])!;
  // net = 125/1.25 = 100 EUR = 200 USD; shipping 5 EUR = 10 USD
  // duty = 210 * 0.1 = 21; import tax = (210 + 21) * 0.2 = 46.2
  assert.equal(r.total, 200 + 10 + 21 + 46.2);
  assert.ok(r.warnings.some((w) => w.includes("warranty")));
});

test("travel: pays shelf price, gets partial VAT refund, clears customs", () => {
  const r = landedCost(foreign, "travel", buyer, fx, (c) => flatRules[c])!;
  // gross 250 USD, tax 50, refund 40 → 210; duty 21; import tax 46.2
  assert.equal(r.total, 250 - 40 + 21 + 46.2);
});

test("ship is impossible when the retailer does not ship to the buyer", () => {
  const r = landedCost({ ...foreign, shipsTo: [] }, "ship", buyer, fx, (c) => flatRules[c]);
  assert.equal(r, null);
});

test("pre-tax prices (US style) get tax added for local purchases", () => {
  const us = sampleOffers.find((o) => o.country === "US")!;
  const r = landedCost(us, "local", { country: "US", currency: "USD", cardFxFee: 0, modes: ["local"] }, sampleFx, rules)!;
  assert.equal(r.total, 1175.93);
});

test("compareGlobally ranks cheapest first and computes savings vs local", () => {
  const pk: Buyer = { country: "PK", currency: "PKR", cardFxFee: 0.03, modes: ["local", "ship", "travel"] };
  const ranked = compareGlobally(sampleOffers, pk, sampleFx, rules);
  assert.ok(ranked.length > 0);
  for (let i = 1; i < ranked.length; i++) assert.ok(ranked[i - 1].total <= ranked[i].total);
  const local = ranked.find((r) => r.mode === "local")!;
  assert.equal(local.savingsVsLocal, 0);
  assert.ok(ranked.every((r) => r.currency === "PKR"));
});

test("out-of-stock offers are excluded", () => {
  const offers = sampleOffers.map((o) => ({ ...o, inStock: false }));
  const pk: Buyer = { country: "PK", currency: "PKR", cardFxFee: 0, modes: ["local", "ship", "travel"] };
  assert.equal(compareGlobally(offers, pk, sampleFx, rules).length, 0);
});
