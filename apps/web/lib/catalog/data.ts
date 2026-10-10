/**
 * SAMPLE CATALOGUE — the single data boundary for the website.
 *
 * Products and specs are real models, but every price, stock flag and timestamp here is
 * illustrative sample data until the ingestion pipeline (docs/ARCHITECTURE.md §5) is live.
 * Pages never import this file directly; they go through ./index.ts, so swapping this for a
 * database or API touches one module only.
 */
import type { Country, Product, Retailer } from "./types";

export const DATA_STATUS = {
  isSample: true,
  fxAsOf: "2026-10-01",
} as const;

export const retailers: Retailer[] = [
  { id: "mega", name: "Mega.pk", short: "MG", url: "https://www.mega.pk", categories: ["phone", "laptop"], bias: -0.01 },
  { id: "daraz", name: "Daraz (official brand stores)", short: "DZ", url: "https://www.daraz.pk", categories: ["phone", "laptop"], bias: -0.02, official: true },
  { id: "telemart", name: "Telemart", short: "TM", url: "https://telemart.pk", categories: ["phone", "laptop"], bias: -0.005 },
  { id: "homeshopping", name: "HomeShopping.pk", short: "HS", url: "https://homeshopping.pk", categories: ["phone", "laptop"], bias: 0.005 },
  { id: "ishopping", name: "iShopping.pk", short: "iS", url: "https://www.ishopping.pk", categories: ["phone", "laptop"], bias: 0.015 },
  { id: "shophive", name: "Shophive", short: "SH", url: "https://www.shophive.com", categories: ["phone", "laptop"], bias: 0.02 },
  { id: "czone", name: "Czone", short: "CZ", url: "https://www.czone.com.pk", categories: ["laptop"], bias: -0.015 },
  { id: "galaxy", name: "Galaxy.pk", short: "GX", url: "https://www.galaxy.pk", categories: ["laptop"], bias: 0 },
];

/** PKR per 1 unit of each currency (sample rates). */
export const pkrPerUnit: Record<string, number> = {
  USD: 281, AED: 76.5, SAR: 74.9, QAR: 77.2, OMR: 730, KWD: 917, BHD: 745, TRY: 6.6,
  JPY: 1.88, KRW: 0.2, SGD: 217, HKD: 36.1, MYR: 64.5, THB: 8.5, CNY: 39.3, INR: 3.2,
  CAD: 203, GBP: 374, EUR: 324, AUD: 184,
};

export const countries: Country[] = [
  { code: "AE", name: "UAE", flag: "🇦🇪", region: "Middle East", currency: "AED", taxIncluded: true, taxRate: 0.05, priceIndex: 1.07, roundTo: 1 },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", region: "Middle East", currency: "SAR", taxIncluded: true, taxRate: 0.15, priceIndex: 1.13, roundTo: 1 },
  { code: "QA", name: "Qatar", flag: "🇶🇦", region: "Middle East", currency: "QAR", taxIncluded: true, taxRate: 0, priceIndex: 1.06, roundTo: 1 },
  { code: "OM", name: "Oman", flag: "🇴🇲", region: "Middle East", currency: "OMR", taxIncluded: true, taxRate: 0.05, priceIndex: 1.08, roundTo: 1 },
  { code: "KW", name: "Kuwait", flag: "🇰🇼", region: "Middle East", currency: "KWD", taxIncluded: true, taxRate: 0, priceIndex: 1.04, roundTo: 1 },
  { code: "BH", name: "Bahrain", flag: "🇧🇭", region: "Middle East", currency: "BHD", taxIncluded: true, taxRate: 0.1, priceIndex: 1.09, roundTo: 1 },
  { code: "TR", name: "Turkey", flag: "🇹🇷", region: "Middle East", currency: "TRY", taxIncluded: true, taxRate: 0.2, priceIndex: 1.62, roundTo: 100 },
  { code: "JP", name: "Japan", flag: "🇯🇵", region: "Asia", currency: "JPY", taxIncluded: true, taxRate: 0.1, priceIndex: 1.01, roundTo: 100 },
  { code: "KR", name: "South Korea", flag: "🇰🇷", region: "Asia", currency: "KRW", taxIncluded: true, taxRate: 0.1, priceIndex: 1.12, roundTo: 1000 },
  { code: "SG", name: "Singapore", flag: "🇸🇬", region: "Asia", currency: "SGD", taxIncluded: true, taxRate: 0.09, priceIndex: 1.11, roundTo: 1 },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰", region: "Asia", currency: "HKD", taxIncluded: true, taxRate: 0, priceIndex: 0.99, roundTo: 1 },
  { code: "MY", name: "Malaysia", flag: "🇲🇾", region: "Asia", currency: "MYR", taxIncluded: true, taxRate: 0, priceIndex: 1.04, roundTo: 1 },
  { code: "TH", name: "Thailand", flag: "🇹🇭", region: "Asia", currency: "THB", taxIncluded: true, taxRate: 0.07, priceIndex: 1.1, roundTo: 10 },
  { code: "CN", name: "China", flag: "🇨🇳", region: "Asia", currency: "CNY", taxIncluded: true, taxRate: 0.13, priceIndex: 1.05, roundTo: 1 },
  { code: "IN", name: "India", flag: "🇮🇳", region: "Asia", currency: "INR", taxIncluded: true, taxRate: 0.18, priceIndex: 1.24, roundTo: 100 },
  { code: "US", name: "USA", flag: "🇺🇸", region: "Americas", currency: "USD", taxIncluded: false, taxRate: 0, priceIndex: 1, roundTo: 1 },
  { code: "CA", name: "Canada", flag: "🇨🇦", region: "Americas", currency: "CAD", taxIncluded: false, taxRate: 0, priceIndex: 1.03, roundTo: 1 },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", region: "Europe", currency: "GBP", taxIncluded: true, taxRate: 0.2, priceIndex: 1.16, roundTo: 1 },
  { code: "DE", name: "Germany", flag: "🇩🇪", region: "Europe", currency: "EUR", taxIncluded: true, taxRate: 0.19, priceIndex: 1.19, roundTo: 1 },
  { code: "FR", name: "France", flag: "🇫🇷", region: "Europe", currency: "EUR", taxIncluded: true, taxRate: 0.2, priceIndex: 1.21, roundTo: 1 },
  { code: "IT", name: "Italy", flag: "🇮🇹", region: "Europe", currency: "EUR", taxIncluded: true, taxRate: 0.22, priceIndex: 1.23, roundTo: 1 },
  { code: "ES", name: "Spain", flag: "🇪🇸", region: "Europe", currency: "EUR", taxIncluded: true, taxRate: 0.21, priceIndex: 1.21, roundTo: 1 },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", region: "Europe", currency: "EUR", taxIncluded: true, taxRate: 0.21, priceIndex: 1.2, roundTo: 1 },
  { code: "IE", name: "Ireland", flag: "🇮🇪", region: "Europe", currency: "EUR", taxIncluded: true, taxRate: 0.23, priceIndex: 1.24, roundTo: 1 },
  { code: "AU", name: "Australia", flag: "🇦🇺", region: "Oceania", currency: "AUD", taxIncluded: true, taxRate: 0.1, priceIndex: 1.12, roundTo: 1 },
];

export const brandStoreUrls: Record<string, string> = {
  Apple: "https://www.apple.com",
  Samsung: "https://www.samsung.com",
  Google: "https://store.google.com",
  Xiaomi: "https://www.mi.com",
  HP: "https://www.hp.com",
  Lenovo: "https://www.lenovo.com",
  ASUS: "https://www.asus.com",
  Dell: "https://www.dell.com",
};

const img = {
  phoneGraphite: "/images/phone-graphite.png",
  phoneMint: "/images/phone-mint.png",
  laptopSilver: "/images/laptop-silver.png",
  laptopGaming: "/images/laptop-gaming.png",
};

export const products: Product[] = [
  {
    slug: "samsung-galaxy-s25-ultra", name: "Samsung Galaxy S25 Ultra", brand: "Samsung", category: "phone",
    image: img.phoneGraphite, tint: "blue", releaseYear: 2025, popularity: 1, globalStores: true,
    summary: "Samsung's flagship with a built-in S Pen, 200 MP camera and seven years of updates.",
    chip: "Snapdragon 8 Elite for Galaxy", chipFamily: "Snapdragon", display: '6.9" QHD+ AMOLED, 120 Hz', battery: "5,000 mAh, 45 W", has5g: true,
    variants: [
      { id: "12-256", label: "12/256 GB", ramGb: 12, storageGb: 256, pkReference: 389999, usdList: 1299 },
      { id: "12-512", label: "12/512 GB", ramGb: 12, storageGb: 512, pkReference: 429999, usdList: 1419 },
    ],
  },
  {
    slug: "apple-iphone-16-pro", name: "Apple iPhone 16 Pro", brand: "Apple", category: "phone",
    image: img.phoneGraphite, tint: "gold", releaseYear: 2024, popularity: 2, globalStores: true,
    summary: "Titanium design, A18 Pro chip and a 5x telephoto camera in the smaller Pro size.",
    chip: "Apple A18 Pro", chipFamily: "Apple A-series", display: '6.3" Super Retina XDR, 120 Hz', battery: "Up to 27 h video", has5g: true,
    variants: [
      { id: "256", label: "256 GB", ramGb: 8, storageGb: 256, pkReference: 424999, usdList: 1099 },
      { id: "512", label: "512 GB", ramGb: 8, storageGb: 512, pkReference: 484999, usdList: 1299 },
    ],
  },
  {
    slug: "google-pixel-9-pro", name: "Google Pixel 9 Pro", brand: "Google", category: "phone",
    image: img.phoneMint, tint: "mint", releaseYear: 2024, popularity: 4, globalStores: true,
    summary: "Clean Android with Google's best camera processing and on-device Gemini features.",
    chip: "Google Tensor G4", chipFamily: "Google Tensor", display: '6.3" LTPO OLED, 120 Hz', battery: "4,700 mAh, 27 W", has5g: true,
    variants: [{ id: "16-256", label: "16/256 GB", ramGb: 16, storageGb: 256, pkReference: 289999, usdList: 1099 }],
  },
  {
    slug: "xiaomi-15", name: "Xiaomi 15", brand: "Xiaomi", category: "phone",
    image: img.phoneMint, tint: "coral", releaseYear: 2025, popularity: 6, globalStores: true,
    summary: "Compact flagship with Leica-tuned cameras and 90 W fast charging.",
    chip: "Snapdragon 8 Elite", chipFamily: "Snapdragon", display: '6.36" AMOLED, 120 Hz', battery: "5,240 mAh, 90 W", has5g: true,
    variants: [{ id: "12-512", label: "12/512 GB", ramGb: 12, storageGb: 512, pkReference: 249999, usdList: 899 }],
  },
  {
    slug: "samsung-galaxy-a56", name: "Samsung Galaxy A56", brand: "Samsung", category: "phone",
    image: img.phoneMint, tint: "blue", releaseYear: 2025, popularity: 3, globalStores: true,
    summary: "Mid-range Galaxy with a metal frame, IP67 rating and six years of updates.",
    chip: "Exynos 1580", chipFamily: "Exynos", display: '6.7" Super AMOLED, 120 Hz', battery: "5,000 mAh, 45 W", has5g: true,
    variants: [{ id: "8-256", label: "8/256 GB", ramGb: 8, storageGb: 256, pkReference: 137999, usdList: 499 }],
  },
  {
    slug: "apple-iphone-16", name: "Apple iPhone 16", brand: "Apple", category: "phone",
    image: img.phoneGraphite, tint: "gold", releaseYear: 2024, popularity: 5, globalStores: true,
    summary: "The standard iPhone with Camera Control, Action button and the A18 chip.",
    chip: "Apple A18", chipFamily: "Apple A-series", display: '6.1" Super Retina XDR, 60 Hz', battery: "Up to 22 h video", has5g: true,
    variants: [
      { id: "128", label: "128 GB", ramGb: 8, storageGb: 128, pkReference: 309999, usdList: 799 },
      { id: "256", label: "256 GB", ramGb: 8, storageGb: 256, pkReference: 349999, usdList: 899 },
    ],
  },
  {
    slug: "xiaomi-redmi-note-14-pro", name: "Xiaomi Redmi Note 14 Pro", brand: "Xiaomi", category: "phone",
    image: img.phoneMint, tint: "mint", releaseYear: 2025, popularity: 7, globalStores: true,
    summary: "200 MP main camera, curved-edge AMOLED and IP68 at a mid-range price.",
    chip: "MediaTek Helio G100 Ultra", chipFamily: "Helio", display: '6.67" AMOLED, 120 Hz', battery: "5,500 mAh, 45 W", has5g: false,
    variants: [{ id: "8-256", label: "8/256 GB", ramGb: 8, storageGb: 256, pkReference: 74999, usdList: 299 }],
  },
  {
    slug: "infinix-note-50-pro", name: "Infinix Note 50 Pro", brand: "Infinix", category: "phone",
    image: img.phoneMint, tint: "mint", releaseYear: 2025, popularity: 8, globalStores: false,
    summary: "Popular Pakistani pick with a big AMOLED screen and fast wired and wireless charging.",
    chip: "MediaTek Helio G100 Ultimate", chipFamily: "Helio", display: '6.78" AMOLED, 144 Hz', battery: "5,200 mAh, 90 W", has5g: false,
    variants: [{ id: "12-256", label: "12/256 GB", ramGb: 12, storageGb: 256, pkReference: 84999 }],
  },
  {
    slug: "tecno-camon-40-pro", name: "Tecno Camon 40 Pro", brand: "Tecno", category: "phone",
    image: img.phoneGraphite, tint: "coral", releaseYear: 2025, popularity: 10, globalStores: false,
    summary: "Camera-focused mid-ranger with a 50 MP main sensor and IP68 protection.",
    chip: "MediaTek Helio G100 Ultimate", chipFamily: "Helio", display: '6.78" AMOLED, 144 Hz', battery: "5,200 mAh, 45 W", has5g: false,
    variants: [{ id: "8-256", label: "8/256 GB", ramGb: 8, storageGb: 256, pkReference: 64999 }],
  },
  {
    slug: "infinix-smart-9", name: "Infinix Smart 9", brand: "Infinix", category: "phone",
    image: img.phoneMint, tint: "gold", releaseYear: 2024, popularity: 9, globalStores: false,
    summary: "Entry-level phone with a large 90 Hz screen and a long-lasting battery.",
    chip: "MediaTek Helio G81", chipFamily: "Helio", display: '6.7" IPS LCD, 90 Hz', battery: "5,000 mAh, 15 W", has5g: false,
    variants: [{ id: "4-64", label: "4/64 GB", ramGb: 4, storageGb: 64, pkReference: 24999 }],
  },
  {
    slug: "tecno-spark-30", name: "Tecno Spark 30", brand: "Tecno", category: "phone",
    image: img.phoneMint, tint: "blue", releaseYear: 2024, popularity: 11, globalStores: false,
    summary: "Budget phone with a 64 MP camera, stereo speakers and IP64 splash resistance.",
    chip: "MediaTek Helio G91", chipFamily: "Helio", display: '6.78" IPS LCD, 90 Hz', battery: "5,000 mAh, 18 W", has5g: false,
    variants: [{ id: "8-128", label: "8/128 GB", ramGb: 8, storageGb: 128, pkReference: 41999 }],
  },
  {
    slug: "apple-macbook-air-m4", name: "Apple MacBook Air M4", brand: "Apple", category: "laptop",
    image: img.laptopSilver, tint: "blue", releaseYear: 2025, popularity: 1, globalStores: true,
    summary: "Fanless, all-day battery laptop for study and work, now with 16 GB as standard.",
    chip: "Apple M4 (10-core CPU)", chipFamily: "Apple M-series", display: '13.6" Liquid Retina', battery: "Up to 18 h", gpu: "8-core Apple GPU", weight: "1.24 kg", uses: ["student", "office", "creator"],
    variants: [
      { id: "16-256", label: "16/256 GB", ramGb: 16, storageGb: 256, pkReference: 319999, usdList: 999 },
      { id: "16-512", label: "16/512 GB", ramGb: 16, storageGb: 512, pkReference: 379999, usdList: 1199 },
    ],
  },
  {
    slug: "hp-victus-15", name: "HP Victus 15", brand: "HP", category: "laptop",
    image: img.laptopGaming, tint: "coral", releaseYear: 2024, popularity: 2, globalStores: true,
    summary: "Affordable 144 Hz gaming laptop with a dedicated RTX graphics card.",
    chip: "Intel Core i7-13620H", chipFamily: "Intel Core i7", display: '15.6" FHD IPS, 144 Hz', battery: "70 Wh", gpu: "NVIDIA RTX 4050 6 GB", weight: "2.29 kg", uses: ["gaming", "creator"],
    variants: [{ id: "16-512", label: "Core i7 · RTX 4050", ramGb: 16, storageGb: 512, pkReference: 284999, usdList: 949 }],
  },
  {
    slug: "lenovo-ideapad-slim-5", name: "Lenovo IdeaPad Slim 5", brand: "Lenovo", category: "laptop",
    image: img.laptopSilver, tint: "gold", releaseYear: 2024, popularity: 3, globalStores: true,
    summary: "Slim aluminium laptop with an OLED option and Intel's AI-ready Core Ultra chips.",
    chip: "Intel Core Ultra 5 125H", chipFamily: "Intel Core Ultra", display: '14" WUXGA OLED', battery: "57 Wh", gpu: "Intel Arc graphics", weight: "1.46 kg", uses: ["student", "office"],
    variants: [{ id: "16-512", label: "Core Ultra 5 · 16 GB", ramGb: 16, storageGb: 512, pkReference: 189999, usdList: 699 }],
  },
  {
    slug: "asus-tuf-gaming-a15", name: "ASUS TUF Gaming A15", brand: "ASUS", category: "laptop",
    image: img.laptopGaming, tint: "blue", releaseYear: 2024, popularity: 4, globalStores: true,
    summary: "Military-grade tough gaming laptop with Ryzen 7 and RTX 4060 graphics.",
    chip: "AMD Ryzen 7 7435HS", chipFamily: "AMD Ryzen 7", display: '15.6" FHD IPS, 144 Hz', battery: "90 Wh", gpu: "NVIDIA RTX 4060 8 GB", weight: "2.2 kg", uses: ["gaming"],
    variants: [{ id: "16-512", label: "Ryzen 7 · RTX 4060", ramGb: 16, storageGb: 512, pkReference: 329999, usdList: 1099 }],
  },
  {
    slug: "dell-inspiron-15-3530", name: "Dell Inspiron 15 3530", brand: "Dell", category: "laptop",
    image: img.laptopSilver, tint: "mint", releaseYear: 2023, popularity: 5, globalStores: true,
    summary: "Dependable everyday laptop for office work and university, with a full-size keyboard.",
    chip: "Intel Core i5-1335U", chipFamily: "Intel Core i5", display: '15.6" FHD, 120 Hz', battery: "41 Wh", gpu: "Intel Iris Xe", weight: "1.62 kg", uses: ["student", "office"],
    variants: [{ id: "8-512", label: "Core i5 · 8 GB", ramGb: 8, storageGb: 512, pkReference: 149999, usdList: 549 }],
  },
  {
    slug: "hp-250-g10", name: "HP 250 G10", brand: "HP", category: "laptop",
    image: img.laptopSilver, tint: "gold", releaseYear: 2023, popularity: 6, globalStores: true,
    summary: "Budget business laptop that covers browsing, Office and online classes.",
    chip: "Intel Core i5-1335U", chipFamily: "Intel Core i5", display: '15.6" FHD IPS', battery: "41 Wh", gpu: "Intel Iris Xe", weight: "1.52 kg", uses: ["student", "office"],
    variants: [{ id: "8-256", label: "Core i5 · 8 GB", ramGb: 8, storageGb: 256, pkReference: 129999, usdList: 499 }],
  },
  {
    slug: "lenovo-loq-15", name: "Lenovo LOQ 15", brand: "Lenovo", category: "laptop",
    image: img.laptopGaming, tint: "coral", releaseYear: 2024, popularity: 7, globalStores: true,
    summary: "Entry gaming laptop with RTX 3050 graphics and a cooling system that stays quiet.",
    chip: "Intel Core i5-12450HX", chipFamily: "Intel Core i5", display: '15.6" FHD IPS, 144 Hz', battery: "60 Wh", gpu: "NVIDIA RTX 3050 6 GB", weight: "2.38 kg", uses: ["gaming", "student"],
    variants: [{ id: "12-512", label: "Core i5 · RTX 3050", ramGb: 12, storageGb: 512, pkReference: 219999, usdList: 749 }],
  },
];
