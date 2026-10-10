/**
 * Catalogue queries. Every page reads data through these functions only; replacing the
 * sample data with a database/API means re-implementing this module, not the pages.
 */
import { brandStoreUrls, countries, DATA_STATUS, pkrPerUnit, products, retailers } from "./data";
import type {
  Category,
  Country,
  GlobalOffer,
  LaptopUse,
  LocalOffer,
  Product,
  ProductSummary,
  PtaStatus,
  Variant,
  WarrantyType,
} from "./types";

export type * from "./types";
export { DATA_STATUS, countries, retailers };

/** Stable 32-bit hash so sample values never change between renders or deploys. */
function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Spread in [-1, 1] derived from a key. */
const spread = (key: string) => ((hash(key) % 2001) - 1000) / 1000;

/** Round to a Pakistani shelf price ending in 99 / 499 / 999. */
const shelfPrice = (n: number) => Math.max(999, Math.round(n / 500) * 500 - 1);

/** Countries where a brand runs an official online store (default: all). */
const brandCoverage: Record<string, string[]> = {
  Google: ["US", "CA", "GB", "DE", "FR", "IT", "ES", "NL", "IE", "JP", "AU", "IN", "SG"],
  Xiaomi: ["AE", "SA", "QA", "OM", "KW", "BH", "TR", "JP", "KR", "SG", "HK", "MY", "TH", "CN", "IN", "GB", "DE", "FR", "IT", "ES", "NL", "IE", "AU"],
};

export function getProducts(category?: Category): Product[] {
  return products
    .filter((p) => !category || p.category === category)
    .sort((a, b) => a.popularity - b.popularity || a.category.localeCompare(b.category));
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getVariant(product: Product, variantId?: string): Variant {
  return product.variants.find((v) => v.id === variantId) ?? product.variants[0];
}

/** Brands ordered by their most popular model. */
export function getBrands(category?: Category): string[] {
  return [...new Set(getProducts(category).map((p) => p.brand))];
}

export function getLocalOffers(product: Product, variant: Variant): LocalOffer[] {
  const carriers = retailers.filter((r) => r.categories.includes(product.category));
  const keyed = carriers.filter((r, i) => i < 3 || hash(`${product.slug}:${variant.id}:${r.id}:carry`) % 4 !== 0);

  return keyed
    .map((r): LocalOffer => {
      const key = `${product.slug}:${variant.id}:${r.id}`;
      const pta: PtaStatus =
        product.category === "laptop" ? "not_applicable" : !r.official && hash(`${key}:pta`) % 4 === 0 ? "non_pta" : "approved";
      const nonPtaDiscount = pta === "non_pta" ? -0.08 : 0;
      const warranty: WarrantyType = r.official
        ? "official"
        : pta === "non_pta"
          ? "shop"
          : hash(`${key}:warranty`) % 3 === 0
            ? "shop"
            : "official";
      return {
        id: key,
        retailer: r,
        price: shelfPrice(variant.pkReference * (1 + r.bias + nonPtaDiscount + spread(`${key}:price`) * 0.015)),
        inStock: hash(`${key}:stock`) % 9 !== 0,
        pta,
        warranty,
        checkedHoursAgo: 1 + (hash(`${key}:age`) % 20),
        url: r.url,
      };
    })
    .sort((a, b) => Number(b.inStock) - Number(a.inStock) || a.price - b.price);
}

function countryNotes(product: Product, country: Country): string[] {
  const notes: string[] = [];
  if (product.brand === "Apple" && product.category === "phone" && country.code === "US") notes.push("US model is eSIM-only (no SIM tray).");
  if (product.category === "phone" && (country.code === "JP" || country.code === "KR")) notes.push("Camera shutter sound can't be turned off on this regional model.");
  if (product.category === "phone" && product.brand !== "Apple" && country.code === "CN") notes.push("Chinese model may ship without Google services.");
  if (!country.taxIncluded) notes.push("Sales tax is added at checkout.");
  return notes;
}

export function getGlobalOffers(product: Product, variant: Variant): GlobalOffer[] {
  if (!product.globalStores || !variant.usdList) return [];
  const coverage = brandCoverage[product.brand];

  return countries
    .filter((c) => !coverage || coverage.includes(c.code))
    .map((c): GlobalOffer => {
      const key = `${product.slug}:${variant.id}:${c.code}`;
      const usd = variant.usdList! * c.priceIndex * (1 + spread(`${key}:price`) * 0.03);
      const localRaw = (usd * pkrPerUnit.USD) / pkrPerUnit[c.currency];
      const localPrice = Math.max(c.roundTo, Math.round(localRaw / c.roundTo) * c.roundTo - (c.roundTo === 1 ? 1 : 0));
      const pricePkr = Math.round(localPrice * pkrPerUnit[c.currency]);
      return {
        id: key,
        country: c,
        storeName: `${product.brand} official store ${c.name}`,
        localPrice,
        currency: c.currency,
        pricePkr,
        pricePkrExTax: c.taxIncluded ? Math.round(pricePkr / (1 + c.taxRate)) : pricePkr,
        taxIncluded: c.taxIncluded,
        checkedHoursAgo: 2 + (hash(`${key}:age`) % 22),
        url: brandStoreUrls[product.brand] ?? "#",
        notes: countryNotes(product, c),
      };
    })
    .sort((a, b) => a.pricePkr - b.pricePkr);
}

/** Gaps below PKR 3,000 or 2 % are within exchange-rate noise, so they aren't shown as savings. */
function meaningfulSaving(local: number | null, abroad?: number): number {
  if (!local || abroad === undefined) return 0;
  const gap = local - abroad;
  return gap >= 3000 && gap >= local * 0.02 ? gap : 0;
}

export function getSummary(product: Product, variantId?: string): ProductSummary {
  const variant = getVariant(product, variantId);
  // Non-PTA phones can be blocked on Pakistani networks, so they never count as "the lowest price".
  const local = getLocalOffers(product, variant).filter((o) => o.inStock && o.pta !== "non_pta");
  const global = getGlobalOffers(product, variant);
  const lowestPkr = local.length ? Math.min(...local.map((o) => o.price)) : null;
  const bestAbroad = global[0] ?? null;
  return {
    product,
    variant,
    lowestPkr,
    shopCount: local.length,
    bestAbroad,
    savingAbroad: meaningfulSaving(lowestPkr, bestAbroad?.pricePkr),
    checkedHoursAgo: local.length ? Math.min(...local.map((o) => o.checkedHoursAgo)) : 0,
  };
}

/** Most popular phones first, then laptops (6 + 4 by default, as on the homepage design). */
export function getTrending(phones = 6, laptops = 4): ProductSummary[] {
  return [...getProducts("phone").slice(0, phones), ...getProducts("laptop").slice(0, laptops)].map((p) => getSummary(p));
}

/** Best saving per product (its variant with the largest gap), biggest first. */
export function getWorldwideDeals(limit?: number, distinctBrands = false): ProductSummary[] {
  const deals = products
    .map((p) => p.variants.map((v) => getSummary(p, v.id)).sort((a, b) => b.savingAbroad - a.savingAbroad)[0])
    .filter((s) => s.savingAbroad > 0)
    .sort((a, b) => b.savingAbroad - a.savingAbroad);
  if (distinctBrands) {
    const seen = new Set<string>();
    const picked = deals.filter((d) => !seen.has(d.product.brand) && seen.add(d.product.brand));
    return limit ? picked.slice(0, limit) : picked;
  }
  return limit ? deals.slice(0, limit) : deals;
}

export function getStats() {
  return {
    retailers: retailers.length,
    countries: countries.length,
    phones: products.filter((p) => p.category === "phone").length,
    laptops: products.filter((p) => p.category === "laptop").length,
  };
}

export type SortKey = "popular" | "price-asc" | "price-desc" | "newest";

export interface ListingFilters {
  category?: Category;
  brands?: string[];
  min?: number;
  max?: number;
  ram?: number[];
  storage?: number[];
  cpu?: string[];
  uses?: LaptopUse[];
  fiveG?: boolean;
  sort?: SortKey;
}

/** Products matching listing filters; each is summarised at its cheapest matching variant. */
export function listProducts(f: ListingFilters): ProductSummary[] {
  const results: ProductSummary[] = [];
  for (const p of getProducts(f.category)) {
    if (f.brands?.length && !f.brands.some((b) => b.toLowerCase() === p.brand.toLowerCase())) continue;
    if (f.cpu?.length && !f.cpu.includes(p.chipFamily)) continue;
    if (f.uses?.length && !f.uses.some((u) => p.uses?.includes(u))) continue;
    if (f.fiveG && !p.has5g) continue;

    const matching = p.variants
      .filter((v) => !f.ram?.length || f.ram.includes(v.ramGb))
      .filter((v) => !f.storage?.length || f.storage.includes(v.storageGb))
      .map((v) => getSummary(p, v.id))
      .filter((s) => s.lowestPkr !== null)
      .filter((s) => (f.min === undefined || s.lowestPkr! >= f.min) && (f.max === undefined || s.lowestPkr! <= f.max))
      .sort((a, b) => a.lowestPkr! - b.lowestPkr!);
    if (matching[0]) results.push(matching[0]);
  }

  const sort = f.sort ?? "popular";
  return results.sort((a, b) => {
    if (sort === "price-asc") return a.lowestPkr! - b.lowestPkr!;
    if (sort === "price-desc") return b.lowestPkr! - a.lowestPkr!;
    if (sort === "newest") return b.product.releaseYear - a.product.releaseYear || a.product.popularity - b.product.popularity;
    return a.product.popularity - b.product.popularity;
  });
}

/** Simple token search across name, brand, category and variant labels. */
export function searchProducts(query: string, limit?: number): ProductSummary[] {
  const tokens = query.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  if (!tokens.length) return [];
  const scored = products
    .map((p) => {
      const haystack = `${p.name} ${p.brand} ${p.category === "phone" ? "phone mobile smartphone" : "laptop notebook"} ${p.chip} ${p.variants.map((v) => v.label).join(" ")}`.toLowerCase();
      const name = p.name.toLowerCase();
      let score = 0;
      for (const t of tokens) {
        if (name.includes(t)) score += 3;
        else if (haystack.includes(t)) score += 1;
        else return null;
      }
      return { p, score };
    })
    .filter((x): x is { p: Product; score: number } => x !== null)
    .sort((a, b) => b.score - a.score || a.p.popularity - b.p.popularity)
    .map(({ p }) => getSummary(p));
  return limit ? scored.slice(0, limit) : scored;
}

export function getSimilar(product: Product, limit = 4): ProductSummary[] {
  const base = getSummary(product).lowestPkr ?? 0;
  return getProducts(product.category)
    .filter((p) => p.slug !== product.slug)
    .map((p) => getSummary(p))
    .filter((s) => s.lowestPkr !== null)
    .sort((a, b) => Math.abs(a.lowestPkr! - base) - Math.abs(b.lowestPkr! - base))
    .slice(0, limit);
}

/** Search-box suggestions, serialisable for client components. */
export function getSuggestionIndex() {
  return getProducts().map((p) => {
    const s = getSummary(p);
    return { slug: p.slug, name: p.name, brand: p.brand, variant: s.variant.label, image: p.image, lowestPkr: s.lowestPkr, globalStores: p.globalStores };
  });
}
export type Suggestion = ReturnType<typeof getSuggestionIndex>[number];
