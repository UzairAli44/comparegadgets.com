# CompareGadgetsHub — System Architecture

> **One-line pitch:** Pick a gadget and your country. We show where in the world it is
> cheapest **for you**, in your currency, with every tax, duty, fee and catch included.

---

## 1. The core insight (why this beats "just convert the price")

Converting a sticker price into another currency gives the wrong answer. Other sites do
that already. The value of this product is working out the **true landed cost**:

| Trap | Example | How we handle it |
|---|---|---|
| Tax-inclusive vs tax-exclusive prices | US prices exclude sales tax; EU/UK/JP include VAT | Store `priceIncludesTax`, normalise to net |
| Exports are zero-rated | A German shop shipping abroad removes 19 % VAT | "Ship" route uses net price |
| Tourist VAT refunds | Japan: tax-free at till; EU: ~60–80 % back after operator fees | Per-country `touristRefundShareOfTax` |
| Import duty + import VAT at home | Pakistan, India, Brazil, Turkey add a lot | Per-country duty, import tax, de-minimis, traveller allowance |
| Card FX markup | 2–4 % on foreign-currency cards | Buyer setting |
| Regional hardware | US iPhone is eSIM-only; JP shutter sound; band support; China dual-SIM | `regionalNotes` + compatibility flags |
| Warranty | Some brands honour warranty only in the purchase region | `internationalWarranty` warning |
| Availability | Many retailers will not ship abroad | `shipsTo` per offer; "travel" route instead |

The prototype engine in `packages/pricing-engine` already does this. It ranks every
(offer × route) pair, where the route is **local**, **ship** or **travel**, and returns an itemised
breakdown and warnings. Run `npm run demo -- PK` inside that folder.

---

## 2. High-level architecture

```
                         ┌───────────────────────────────────────────┐
                         │                USERS                      │
                         │  Web (Next.js)  ·  later: mobile app, API │
                         └───────────────┬───────────────────────────┘
                                         │ CDN (Cloudflare) – edge cache, geo-IP → default country
                         ┌───────────────▼───────────────┐
                         │   Web app (Next.js, SSR/ISR)  │  SEO pages: /iphone-17-pro/price-in-the-world
                         └───────────────┬───────────────┘
                                         │
                         ┌───────────────▼───────────────┐
                         │  Public API (TypeScript)      │  /search  /products/:id/compare?country=PK
                         │  + pricing-engine (library)   │  /alerts  /history
                         └──┬──────────┬──────────┬──────┘
                            │          │          │
                 ┌──────────▼──┐ ┌─────▼─────┐ ┌──▼─────────────┐
                 │ PostgreSQL  │ │  Redis    │ │ Search index   │
                 │ catalogue,  │ │  cache,   │ │ (Typesense /   │
                 │ offers,     │ │  rate     │ │  Meilisearch)  │
                 │ price hist. │ │  limits   │ └────────────────┘
                 └──────▲──────┘ └───────────┘
                        │ writes
┌───────────────────────┴──────────────────────────────────────────────────────┐
│                         DATA PIPELINE (the real product)                     │
│                                                                              │
│  Scheduler ──► Queue (BullMQ → SQS/Kafka later) ──► Connector workers        │
│                                                     • Affiliate feeds (CSV/XML/API)
│                                                     • Official brand stores   │
│                                                     • Retailer sites (Playwright, polite)
│                                                     • Price APIs (fallback)   │
│                        │ raw snapshots → object storage (R2/S3), replayable  │
│                        ▼                                                     │
│   Normaliser ─► Product matcher ─► Validator/anomaly check ─► Offer upsert   │
│   (currency,     (GTIN/MPN/part no.,  (price jumps, wrong      + price-history │
│    tax flag,      rules + LLM assist,  variant, stale)          row          │
│    stock)         human review queue)                                        │
│                                                                              │
│  FX service: hourly rates (ECB + commercial feed)  ·  Tax-rules table (versioned)│
└──────────────────────────────────────────────────────────────────────────────┘
                        │
                        ▼
          Alerts worker ──► email / push / WhatsApp / Telegram ("price dropped in UAE")
```

### Principles
1. **Store prices in their original currency.** Convert only when a page is requested, using the current FX
   table. A change in exchange rates then needs no re-scrape.
2. **Store every raw fetch.** Parsers break. When one does, fix it and re-run it over the stored raw pages.
   The source site does not need to be fetched again.
3. **Match on exact variants, not model names.** "iPhone 17 Pro" isn't a product. "iPhone 17 Pro, 256 GB,
   Deep Blue, model A3xxx" is. If the site compares the wrong variant, users stop trusting it.
4. **Tax and duty rules are data, not code.** Keep them in a versioned table that someone can review, with a source
   and "last verified" date on every row.
5. **Show how old each price is.** Every price shows "checked 3 h ago". An old price is worse than no price.

---

## 3. Recommended tech stack

| Layer | Choice | Why |
|---|---|---|
| Language | **TypeScript** everywhere | One language for web, API, workers and the shared pricing engine |
| Web | **Next.js** (App Router, ISR) on Vercel or Cloudflare | SEO-heavy site. Thousands of static "price in X" pages refresh on their own |
| API | **Fastify** or **NestJS** | Fast, typed. NestJS if the team grows |
| DB | **PostgreSQL** (Neon / Supabase / RDS) + **TimescaleDB** or monthly partitions for price history | Relational catalogue and time-series history in one DB |
| Cache | **Redis** (Upstash) | Compare results per (variant, country) cached for about 15 min |
| Search | **Typesense** or **Meilisearch** | Handles typos ("iphon 17 pro max 512") and multiple languages |
| Queue | **BullMQ** on Redis → **SQS/Kafka** at scale | Simple at first, with a clear path to scale |
| Scraping | **Playwright** + rotating residential proxies (only where ToS allow) | Many stores render prices with JavaScript |
| Matching | Rules first (GTIN, MPN, Apple/Samsung part numbers), then **LLM-assisted** for the rest, with a human review UI | Accurate matching is what makes the product work |
| Storage | **Cloudflare R2** | Cheap raw-snapshot archive with no egress fees |
| Observability | Sentry, Grafana/Prometheus, per-connector success dashboards | You must know a store broke within an hour |
| Infra | Docker, Terraform. Start on Railway/Fly/Render, move to AWS/GCP when it pays off | Keep operations minimal early on |

---

## 4. Data model (core tables)

```sql
brand(id, name)
product(id, brand_id, family, name, category, launch_date)          -- "iPhone 17 Pro"
variant(id, product_id, storage, ram, color, attributes jsonb)      -- "256GB / Deep Blue"
regional_model(id, variant_id, region, model_number, part_numbers[],
               sim_type, bands jsonb, notes[])                      -- A3xxx (US), A3yyy (JP)...
identifier(variant_id, kind, value)                                 -- GTIN, EAN, MPN, ASIN...

retailer(id, name, country, domain, ships_to[], affiliate_program, trust_score)
offer(id, variant_id, regional_model_id, retailer_id, country, url,
      price numeric, currency char(3), price_includes_tax bool,
      in_stock bool, condition, shipping jsonb, last_seen_at, first_seen_at)
price_observation(offer_id, observed_at, price, currency, in_stock) -- partitioned / hypertable

country_tax_rules(country, category, consumer_tax_rate, tourist_refund_share,
                  import_duty_rate, import_tax_rate, de_minimis, traveller_allowance,
                  source_url, verified_at, valid_from, valid_to)
fx_rate(currency, rate_vs_usd, as_of)

user(id, email, home_country, currency, card_fx_fee, preferred_routes[])
price_alert(id, user_id, variant_id, target_price, currency, routes[], countries[])
```

---

## 5. Getting the data (the hardest part, so plan it first)

Data sources, in order of preference:

1. **Affiliate networks and feeds.** These are legal and structured, and they pay you. Amazon Associates / PA-API
   (about 20 marketplaces), Awin, CJ, Rakuten, Impact, Admitad (strong in Asia/CIS), Involve Asia, Flipkart,
   Noon (MENA), Daraz (South Asia), Lazada/Shopee (SEA), Mercado Libre (LatAm).
2. **Official brand stores.** Apple, Samsung, Google, Xiaomi and OnePlus publish a price per country. These are the
   anchor "MSRP by country" data and cover the highest-traffic queries.
3. **Direct retailer partnerships.** Once you have traffic, ask retailers for price feeds.
4. **Polite crawling.** Obey robots.txt and ToS, rate-limit requests and identify the crawler. Get legal advice
   per jurisdiction before crawling at scale.
5. **Community prices.** Users report in-store prices with a receipt photo. This fills gaps in markets like
   Pakistan, Nigeria and Egypt, where online data is thin.
6. **Paid SERP/shopping APIs** as a fallback for coverage checks only. They cost too much as a main source.

Refresh cadence: flagship phones every 1–6 h, the long tail daily, and FX hourly. Tax rules are reviewed
monthly and on budget days.

---

## 6. Key features by phase

### Phase 1 — MVP (6–8 weeks)
- About **30 flagship products** (iPhone, Galaxy S/Z, Pixel, MacBook Air/Pro, iPad, AirPods, PS5, Switch 2)
  across about **25 countries** (US, CA, UK, DE, FR, IT, ES, NL, JP, KR, SG, HK, MY, TH, AE, SA, IN, PK, TR,
  AU, NZ, BR, MX, CN, CH).
- Data: official brand stores plus Amazon/affiliate feeds.
- Compare page: "Cheapest for **you** in **PKR**", with the local, ship and travel routes and a full breakdown.
- Programmatic SEO pages: `/iphone-17-pro/price-in-the-world`, `/iphone-17-pro/price-in-japan`,
  `/cheapest-country-to-buy/iphone-17-pro`.
- Price-history chart and simple email alerts.

### Phase 2 — Growth (months 3–6)
- 500+ products, more retailers, the matching/review tool, community price reports.
- A **"Travelling to Dubai? Here's what to buy there"** planner. This hook has strong viral potential.
- Mobile app / PWA, plus WhatsApp and Telegram alerts (big in South Asia, MENA and LatAm).
- Localisation: Urdu, Arabic, Hindi, Spanish, Portuguese, Turkish, Japanese.

### Phase 3 — Scale and moat (months 6–18)
- More categories: laptops, cameras, consoles, wearables, then beauty and luxury goods.
- **Package-forwarder integration** (buy in the US, ship through a forwarder) with a quote shown inside the result.
- **B2B data API / Gadget Price Index.** Sell data to journalists, analysts, retailers and grey-market importers.
- Second-hand/refurbished prices, trade-in values and "best time to buy" predictions.

---

## 7. Scaling and reliability

- Read traffic is mostly SEO pages. ISR plus the CDN serves more than 95 % from the edge, so the API only sees
  cache misses.
- Compare results are cheap to compute: under 1 ms per variant and country, from about 100 offers. Cache the
  result for each (variant, buyer country) pair.
- Workers scale horizontally per connector. Each connector has its own concurrency limit, back-off and
  circuit breaker.
- Anomaly guard: if a new price is more than 40 % off the 7-day median, hold it for review instead of publishing.
  This stops "iPhone for $12" bugs.
- Keep the last good price, marked stale, if a connector breaks. Hide it after a set time-to-live.

---

## 8. Legal and trust checklist
- Affiliate disclosure on every page. Different networks have different rules on cross-border promotion.
- Scraping: obey ToS and robots.txt, and do not collect personal data. Prefer feeds.
- Label clearly that customs figures are *estimates*, and link to the official source.
- GDPR/PDPA-compliant consent for alerts and accounts.
- Never present grey-import or duty-evasion advice. Show legal routes only.

---

## 9. Suggested repository layout (monorepo)

```
apps/
  web/                 Next.js site
  api/                 Fastify/NestJS public API
  workers/             ingestion connectors, matcher, alerts
  admin/               review queue, tax-rules editor, connector health
packages/
  pricing-engine/      ✅ landed-cost engine (prototype in this repo)
  catalog/             product/variant schemas and matching rules
  connectors-sdk/      shared connector interface + test harness
  db/                  schema + migrations (Drizzle/Prisma)
infra/                 Terraform, Docker
docs/                  this file, business notes, ADRs
```
