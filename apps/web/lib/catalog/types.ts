export type Category = "phone" | "laptop";
export type Tint = "mint" | "blue" | "coral" | "gold";
export type Region = "Middle East" | "Asia" | "Europe" | "Americas" | "Oceania";
export type PtaStatus = "approved" | "non_pta" | "not_applicable";
export type WarrantyType = "official" | "shop" | "none";
export type LaptopUse = "student" | "office" | "gaming" | "creator";
export type CpuFamily = "Intel Core i5" | "Intel Core i7" | "Intel Core Ultra" | "AMD Ryzen 5" | "AMD Ryzen 7" | "Apple M-series" | "MediaTek" | "Snapdragon" | "Exynos" | "Apple A-series" | "Google Tensor" | "Dimensity" | "Helio";

export interface Variant {
  id: string;
  label: string;
  ramGb: number;
  storageGb: number;
  /** Reference shelf price in Pakistan (PKR); individual retailer offers vary around it. */
  pkReference: number;
  /** Manufacturer's US list price before sales tax; drives worldwide store prices. */
  usdList?: number;
}

export interface Product {
  slug: string;
  name: string;
  brand: string;
  category: Category;
  image: string;
  tint: Tint;
  releaseYear: number;
  /** Lower number = more popular in Pakistan. */
  popularity: number;
  /** Brand runs official online stores in the worldwide comparison countries. */
  globalStores: boolean;
  summary: string;
  chip: string;
  chipFamily: CpuFamily;
  display: string;
  battery: string;
  has5g?: boolean;
  gpu?: string;
  weight?: string;
  uses?: LaptopUse[];
  variants: Variant[];
}

export interface Retailer {
  id: string;
  name: string;
  short: string;
  url: string;
  categories: Category[];
  /** Typical price position vs reference (e.g. -0.02 = 2 % cheaper). */
  bias: number;
  official?: boolean;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  region: Region;
  currency: string;
  /** Shelf prices include VAT/GST (false for US/CA where sales tax is added at checkout). */
  taxIncluded: boolean;
  /** Consumer tax rate, used for the "without tax" basis. */
  taxRate: number;
  /** Typical official-store price vs US pre-tax list price, incl. local tax where included. */
  priceIndex: number;
  /** Round local prices to this step (e.g. 100 JPY). */
  roundTo: number;
}

export interface LocalOffer {
  id: string;
  retailer: Retailer;
  price: number;
  inStock: boolean;
  pta: PtaStatus;
  warranty: WarrantyType;
  checkedHoursAgo: number;
  url: string;
}

export interface GlobalOffer {
  id: string;
  country: Country;
  storeName: string;
  localPrice: number;
  currency: string;
  pricePkr: number;
  /** PKR price with consumer tax removed (US/CA: unchanged). */
  pricePkrExTax: number;
  taxIncluded: boolean;
  checkedHoursAgo: number;
  url: string;
  notes: string[];
}

export interface ProductSummary {
  product: Product;
  variant: Variant;
  lowestPkr: number | null;
  shopCount: number;
  bestAbroad: GlobalOffer | null;
  /** PKR saved buying at the cheapest worldwide store vs cheapest in Pakistan (shelf prices). */
  savingAbroad: number;
  checkedHoursAgo: number;
}
