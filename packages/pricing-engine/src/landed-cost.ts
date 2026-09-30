import { convert, round2 } from "./fx.ts";
import type {
  Buyer,
  CostLine,
  CountryTaxRules,
  FxTable,
  LandedCost,
  Offer,
  PurchaseMode,
} from "./types.ts";

export type TaxRulesLookup = (country: string) => CountryTaxRules | undefined;

/**
 * The shelf price with tax removed, in the offer's currency.
 * Comparing sticker prices across countries is meaningless without this step:
 * a US price excludes sales tax while a German price includes 19 % VAT.
 */
function netOfTax(offer: Offer, rules: CountryTaxRules): number {
  return offer.priceIncludesTax
    ? offer.price.amount / (1 + rules.consumerTaxRate)
    : offer.price.amount;
}

function grossWithTax(offer: Offer, rules: CountryTaxRules): number {
  return offer.priceIncludesTax
    ? offer.price.amount
    : offer.price.amount * (1 + rules.consumerTaxRate);
}

/**
 * Computes what the buyer really pays, in their own currency, for one offer via one route.
 * Returns null when the route is impossible (e.g. the retailer does not ship to the buyer).
 */
export function landedCost(
  offer: Offer,
  mode: PurchaseMode,
  buyer: Buyer,
  fx: FxTable,
  taxRules: TaxRulesLookup,
): Omit<LandedCost, "savingsVsLocal"> | null {
  const seller = taxRules(offer.country);
  const home = taxRules(buyer.country);
  if (!seller || !home) return null;

  const isDomestic = offer.country === buyer.country;
  if (mode === "local" && !isDomestic) return null;
  if (mode !== "local" && isDomestic) return null;
  if (mode === "ship" && !offer.shipsTo.includes(buyer.country)) return null;

  const toBuyer = (amountInOfferCcy: number) =>
    convert(amountInOfferCcy, offer.price.currency, buyer.currency, fx);

  const lines: CostLine[] = [];
  const warnings: string[] = [];

  if (mode === "local") {
    lines.push({ label: "Price incl. local tax", amount: toBuyer(grossWithTax(offer, seller)) });
  } else if (mode === "ship") {
    // Exports are zero-rated: the foreign retailer does not charge its own VAT/sales tax.
    const goods = toBuyer(netOfTax(offer, seller));
    const shipping = toBuyer(offer.shippingTo?.[buyer.country] ?? 0);
    lines.push({ label: "Price excl. foreign tax", amount: goods });
    if (shipping > 0) lines.push({ label: "International shipping", amount: shipping });
    if (offer.shippingTo?.[buyer.country] === undefined) {
      warnings.push("Shipping cost unknown; estimate excludes it.");
    }
    lines.push({ label: "Card FX fee", amount: (goods + shipping) * buyer.cardFxFee });

    if (goods > home.deMinimis) {
      const duty = (goods + shipping) * home.importDutyRate;
      const importTax = (goods + shipping + duty) * home.importTaxRate;
      if (duty > 0) lines.push({ label: "Import duty", amount: duty });
      if (importTax > 0) lines.push({ label: "Import VAT/GST", amount: importTax });
    }
  } else {
    // Travel: buyer pays the shelf price abroad, reclaims part of the VAT, then clears home customs.
    const gross = toBuyer(grossWithTax(offer, seller));
    const taxPaid = gross - toBuyer(netOfTax(offer, seller));
    const refund = taxPaid * seller.touristRefundShareOfTax;
    lines.push({ label: "Shelf price abroad", amount: gross });
    lines.push({ label: "Card FX fee", amount: gross * buyer.cardFxFee });
    if (refund > 0) lines.push({ label: "Tourist tax refund", amount: -refund });

    const declaredValue = gross - refund;
    if (declaredValue > home.travellerAllowance) {
      const dutiable = declaredValue - home.travellerAllowance;
      const duty = dutiable * home.importDutyRate;
      const importTax = (dutiable + duty) * home.importTaxRate;
      if (duty > 0) lines.push({ label: "Import duty (above allowance)", amount: duty });
      if (importTax > 0) lines.push({ label: "Import VAT/GST (above allowance)", amount: importTax });
    }
    warnings.push("Assumes you are already travelling; flight and hotel are not included.");
  }

  if (!isDomestic && !offer.internationalWarranty) {
    warnings.push("Manufacturer warranty may not be honoured in your country.");
  }
  if (offer.regionalNotes?.length) warnings.push(...offer.regionalNotes);

  const breakdown = lines.map((l) => ({ label: l.label, amount: round2(l.amount) }));
  const total = round2(lines.reduce((sum, l) => sum + l.amount, 0));
  return { offer, mode, total, currency: buyer.currency, breakdown, warnings };
}

/**
 * Ranks every feasible (offer, route) pair for one product variant, cheapest first.
 * This is the core question the site answers: "where in the world is this cheapest for ME?"
 */
export function compareGlobally(
  offers: Offer[],
  buyer: Buyer,
  fx: FxTable,
  taxRules: TaxRulesLookup,
): LandedCost[] {
  const results: Omit<LandedCost, "savingsVsLocal">[] = [];
  for (const offer of offers) {
    if (!offer.inStock) continue;
    for (const mode of buyer.modes) {
      const r = landedCost(offer, mode, buyer, fx, taxRules);
      if (r) results.push(r);
    }
  }

  const localTotals = results.filter((r) => r.mode === "local").map((r) => r.total);
  const bestLocal = localTotals.length ? Math.min(...localTotals) : null;

  return results
    .map((r) => ({
      ...r,
      savingsVsLocal: bestLocal === null ? null : round2(bestLocal - r.total),
    }))
    .sort((a, b) => a.total - b.total);
}
