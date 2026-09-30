# CompareGadgetsHub — Product Spec (MVP v1)

**Status:** Draft v1 · **Date:** 2026-09-30 · **Team:** 2 developers
**Domain:** comparegadgetshub.com

> Items marked **[ASSUMPTION]** are defaults chosen where no decision was made. Confirm or change them.

---

## 1. Decisions so far

| Topic | Decision |
|---|---|
| Launch market | **Pakistan only.** Test, learn and tune the data pipeline, then expand |
| Categories | **Mobile phones and laptops** |
| Condition | **New only** [ASSUMPTION]. Used/refurbished comes later |
| Primary user | **Everyday local buyers in Pakistan** |
| Accounts | **None.** Everything is public; no login |
| Alerts | **None in v1** |
| Language | **English** |
| Currency | **PKR** everywhere in the UI |
| Comparison modes | **Local** (Pakistani retailers) and **Global** (official brand stores worldwide, converted to PKR) |
| Community prices | **Yes**, but every report is **verified by us before it shows** |
| Revenue | Undecided. Build so affiliate links and ad slots can be added later without redesign |
| Launch date | None fixed |

### Why Pakistan-only first is the right call
- Two developers can do one market well. Five markets would be done badly.
- Pakistan has large price gaps with other countries, high interest in "price in Dubai/UK/USA", and clear local
  competitors to beat on quality.
- Global mode is still global. It uses brand stores in many countries, but every result is shown **to a
  Pakistani buyer, in PKR**. Adding a second home market later means adding local retailers and tax rules for
  that country; the global data is reused.

---

## 2. Goals and non-goals

### Goals (v1)
1. A Pakistani user can find a phone or laptop and see **every major local retailer's price, cheapest first**, in
   under 10 seconds.
2. With one tap they can switch to **Global** and see the **official store price in about 25 countries**,
   converted to PKR, sortable and filterable.
3. Every price shows **its source and when it was last checked**.
4. The site is **fast on a mid-range Android phone over 4G**, since most Pakistani traffic is mobile.
5. Pages rank on Google for "[product] price in Pakistan" and "[product] price in [country]".

### Non-goals (v1)
- User accounts, wishlists, alerts
- Checkout or selling anything ourselves
- Used/refurbished devices, accessories, tablets, consoles
- Languages other than English
- Home markets other than Pakistan

---

## 3. Key user stories

| # | As a… | I want to… | So that… |
|---|---|---|---|
| U1 | Buyer | search "galaxy s25" and land on the right product | I don't have to browse categories |
| U2 | Buyer | see all Pakistani shops' prices for the variant I want (e.g. 256 GB) | I buy from the cheapest trusted shop |
| U3 | Buyer | filter to **PTA-approved** and **official warranty** only | I don't end up with a blocked phone or no warranty |
| U4 | Buyer | switch to **Global** and see prices in other countries in PKR | I can ask a relative abroad to bring it, or buy it on a trip |
| U5 | Buyer | sort Global by cheapest/most expensive and filter by region | I quickly find the best country |
| U6 | Buyer | see a rough **"cost if brought to Pakistan"** | the global price isn't misleading |
| U7 | Laptop buyer | filter laptops by budget, processor, RAM, SSD, screen size | I find options that fit my needs and budget |
| U8 | Buyer | see price history for a product | I know whether now is a good time to buy |
| U9 | Visitor | report a price I saw in a shop | others benefit, and the site covers shops that aren't online |
| U10 | Admin | review community reports and product matches | only verified data goes live |

---

## 4. Scope of data

### 4.1 Catalogue at launch [ASSUMPTION on counts]
- **Phones:** about 150 models currently sold in Pakistan. Brands: Samsung, Apple, Xiaomi/Redmi/POCO,
  Infinix, Tecno, Vivo, Oppo, Realme, Google, OnePlus, Honor, Motorola, Nothing.
- **Laptops:** about 100 popular models. Brands: Apple, HP, Dell, Lenovo, ASUS, Acer, MSI.
- Each product is broken into **variants**:
  - Phones: RAM/storage (e.g. 8/256), plus colour where the price differs.
  - Laptops: CPU/RAM/SSD/GPU configuration.

### 4.2 Local sources (Pakistan)

Chosen as major, reputable, online-listed outlets. Candidates to verify, checking both the technical side
(is the price reachable) and the legal side (terms of service, robots.txt):

| Type | Phones | Laptops |
|---|---|---|
| Official brand stores / distributors | Samsung PK, Xiaomi PK, Infinix, Tecno, Vivo, Oppo, Realme official PK sites | HP/Dell/Lenovo PK distributors where prices are listed |
| Large retailers | Mega.pk, iShopping.pk, HomeShopping.pk, Telemart, Shophive | Czone, Galaxy.pk, Mega.pk, Shophive, Telemart |
| Marketplace | Daraz (official brand stores / LazMall-type sellers only in v1) | Daraz (official stores only) |
| Apple | Apple authorised resellers in Pakistan (2–3) | same |

Target: **3–5 local prices for every popular product.** Start with the 6–8 sources that cover the most products,
then add more.

### 4.3 Global sources
Official brand stores, one per country, shown in PKR.

| Category | Brands in Global mode v1 |
|---|---|
| Phones | Apple, Samsung, Google Pixel, Xiaomi (where it has official stores), OnePlus |
| Laptops | Apple, Dell, HP, Lenovo, ASUS (where they have official stores) |

**Countries (about 25) [ASSUMPTION]:**
- Middle East: UAE, Saudi Arabia, Qatar, Oman, Kuwait, Bahrain, Turkey
- Asia: Japan, South Korea, Singapore, Hong Kong, Malaysia, Thailand, China, India
- Americas: USA, Canada
- Europe: UK, Germany, France, Italy, Spain, Netherlands, Ireland
- Oceania: Australia

The Middle East is weighted up because many Pakistanis work there or travel there.

Brands without many official stores abroad (Infinix, Tecno and similar) show **"Global comparison not available
for this brand"** instead of empty or misleading data.

### 4.4 Refresh cadence
| Data | Frequency |
|---|---|
| Local prices, top 50 products | every 6 hours |
| Local prices, rest | daily |
| Global official-store prices | daily |
| Exchange rates | hourly (the rate shown is an open-market/interbank rate; see §6.3) |
| Tax/duty rules | reviewed monthly and after each federal budget |

---

## 5. Features and screens

### 5.1 Global layout
- Header: logo, **search bar** (always visible), Phones, Laptops, "How we compare".
- Footer: About, Methodology, Disclaimer, Contact, Report a price, Privacy.
- **Mobile-first.** Design for a 360 px wide screen first, then scale up.
- Light and dark theme, following the phone's setting.
- Every page has a clear "Prices last updated" signal.

### 5.2 Home page
- Big search: "Search any phone or laptop…"
- **Trending in Pakistan:** top 10 viewed products with the cheapest local price.
- **Biggest global savings this week:** products where a foreign price is far below the local one. This is the
  hook that makes global mode interesting.
- Quick links for phone brands and laptop budgets (e.g. "Laptops under 150k", "Phones under 50k").
- Short explainer: "We compare prices in Pakistan and in 25 countries, updated daily."

### 5.3 Search
- Instant suggestions as the user types, tolerant of typos ("iphon 16 pro", "s25 ultra", "redmi note 14").
- The results page shows product cards: image, name, "from PKR X at N shops", and a global badge when available.
- Filters on results: category, brand, price range.

### 5.4 Category / listing pages (`/phones`, `/laptops`, `/phones/samsung`)
Sort options: **Price low→high**, **Price high→low**, **Newest**, **Popular**.

| Phone filters | Laptop filters |
|---|---|
| Brand | Brand |
| Price range (PKR) | Price range (PKR) |
| RAM, storage | Processor (Intel i3/i5/i7/i9, Ryzen 3/5/7/9, Apple M-series) |
| PTA-approved available | RAM, SSD size |
| 5G | Screen size, screen type |
| Battery, display size | Dedicated GPU (yes/no, model) |
| Release year | Use case tags: student, office, gaming, creator [ASSUMPTION] |

### 5.5 Product page. **This is the core screen.**

Top section:
- Image, name, key specs summary, variant picker (e.g. `8/256 GB`, `12/512 GB`)
- **Mode toggle:** `[ 🇵🇰 In Pakistan ]  [ 🌍 Worldwide ]`. Default: In Pakistan.
- Headline line: **"Lowest in Pakistan: PKR 289,999 at Mega.pk"**
- Hint line, when true: **"Up to PKR 58,000 cheaper in UAE → see Worldwide"**

#### Local mode (In Pakistan)
Table/list of offers, one row per retailer:

| Field | Example |
|---|---|
| Retailer (logo + name) | Mega.pk |
| Price (PKR) | 289,999 |
| Stock | In stock / Out of stock |
| PTA status (phones) | PTA-approved / Non-PTA |
| Warranty | Official brand warranty / Shop warranty / None |
| Source badge | Online listing / Community verified |
| Last checked | 3 h ago |
| Button | **Go to shop →** (opens retailer; tracked as outbound click) |

- **Sort:** Price low→high (default), high→low, last updated
- **Filters:** In stock only (default on), PTA-approved only, Official warranty only, retailer, include community prices
- Out-of-stock rows are shown faded at the bottom, never hidden completely.

#### Global mode (Worldwide)
List of countries, one row per country store:

| Field | Example |
|---|---|
| Country (flag + name) | 🇦🇪 UAE |
| Store | Apple Store UAE |
| Local price | AED 4,299 |
| **Price in PKR** | PKR 325,000 |
| Difference vs cheapest in Pakistan | **−PKR 58,000 (−15%)** in green, or +PKR in red |
| Tax note | "incl. 5% VAT" / "excl. sales tax" |
| Last checked | 1 day ago |
| Button | Visit store → |

- **Sort:** Cheapest first (default), most expensive first, biggest saving, alphabetical
- **Filters:**
  - Region: Middle East, Asia, Europe, Americas, Oceania
  - Show only countries **cheaper than Pakistan**
  - **Price basis toggle:**
    - `Shelf price`: the store price converted to PKR. This is the simple view and the default.
    - `Price without foreign tax`: removes VAT/GST and adds US sales tax so prices are comparable.
    - `Estimated cost in Pakistan`: see §6.2.
  - Hide models with regional differences (e.g. eSIM-only, different network bands)
- **Warnings per row** (icon + tooltip), for example:
  - "US model is eSIM-only."
  - "Warranty may not be valid in Pakistan."
  - "Must be PTA-registered in Pakistan; tax applies."
- A summary card above the list: **"Cheapest: Japan, PKR 290,500 | Pakistan: PKR 348,000 | Most expensive:
  Turkey, PKR 460,000"**
- Optional visual: a world map or bar chart of prices by country [ASSUMPTION: bar chart in v1, map later].

#### Below both modes
- **Price history** chart (local lowest price over time, 30/90/365 days). Data is collected from day 1; the chart
  shows once there's at least 14 days of data.
- **Specs** table.
- **Similar products** in the same price range.
- **Report a price** button.

### 5.6 Report a price (community prices)
Form (no login):
- Product + variant (pre-filled when opened from a product page)
- Shop name and city (e.g. Hafeez Centre, Lahore)
- Price (PKR)
- PTA status / warranty type
- Date seen
- **Photo of the price tag or receipt** (required)
- Optional email/phone, only for us to contact them for verification
- Bot protection (Cloudflare Turnstile) and a limit of 5 reports per device per day

Lifecycle: `submitted → under review → verified | rejected`

**Verification rules (admin):**
- The photo clearly shows the product, the price and the shop, and it is recent.
- The price is within a sane range of other prices, or is otherwise double-checked by phone.
- Only **verified** reports show on the site. They carry a "Community verified · date" badge.
- Verified community prices **expire after 14 days** unless re-confirmed.

### 5.7 Static and trust pages
- **How we compare:** sources, update frequency, how currency conversion works, what "estimated cost in
  Pakistan" includes.
- **Disclaimer:** prices can change; taxes are estimates; we are not a seller.
- **About / Contact.**

### 5.8 Admin panel (internal, login required for staff only)
- **Product catalogue:** add/edit products, variants, specs and images.
- **Match review queue:** scraped listings the system couldn't confidently match to a variant. Approve, re-map or
  ignore each one.
- **Community reports queue:** view photo, approve/reject, add a note.
- **Source health dashboard:** each connector's last run, success rate, products found, errors.
- **Tax and rate settings:** PTA tax slabs, customs/sales-tax rates, FX rate source. Every change is dated and
  records its source.
- **Anomaly queue:** prices that changed more than 30% in one update are held here before going live.

---

## 6. Pricing rules

### 6.1 Currency conversion
- Store every price in its original currency and convert to PKR when displaying.
- The UI shows the rate used and its time, e.g. "1 AED = PKR 76.4 · updated 2 h ago".

### 6.2 "Estimated cost in Pakistan" (Global mode, optional view)
This is a Pakistan-specific version of the landed-cost engine in `packages/pricing-engine`.

**Phones:**
```
Price abroad (in PKR)
− tourist VAT refund (only if that country has a refund scheme for tourists)
+ card/exchange fee (default 3%, shown)
+ PTA registration tax (by phone value slab, passport vs CNIC)
= Estimated cost in Pakistan
```
**The PTA tax is the most important factor.** It often wipes out the entire saving for mid-range phones, and
showing it honestly is what makes the site trustworthy. The PTA slabs are stored as admin-editable data with a
source and date, never hard-coded.

**Laptops:**
```
Price abroad (in PKR)
− tourist VAT refund (where available)
+ card/exchange fee
+ customs duty / taxes above the baggage allowance (if applicable)
= Estimated cost in Pakistan
```

Always show the itemised breakdown and the label **"Estimate. Check current PTA/FBR rules before buying."**

### 6.3 Exchange rate
- Default: the **open-market/interbank rate** from a reliable FX feed.
- **[ASSUMPTION]** Card purchases use roughly the bank rate plus fees, which the 3% card fee covers.

---

## 7. Data model additions (Pakistan specifics)

On top of `docs/ARCHITECTURE.md` §4:

```sql
offer.pta_status        enum('approved','non_pta','not_applicable','unknown')
offer.warranty_type     enum('official','shop','international','none','unknown')
offer.source_type       enum('online','community')
offer.city              text null            -- for community prices
community_report(id, variant_id, shop_name, city, price_pkr, pta_status, warranty_type,
                 seen_on date, photo_url, contact null, status, reviewer_id, reviewed_at,
                 reject_reason, expires_at)
pta_tax_slab(id, min_usd, max_usd, tax_passport_pkr, tax_cnic_pkr, source_url, valid_from, valid_to)
laptop_spec(variant_id, cpu_family, cpu_model, ram_gb, ssd_gb, gpu, screen_in, panel, weight_kg)
phone_spec(variant_id, ram_gb, storage_gb, network_5g bool, display_in, battery_mah, chipset, esim, bands jsonb)
outbound_click(id, offer_id, clicked_at, page, mode)  -- no personal data
```

---

## 8. Non-functional requirements

| Area | Requirement |
|---|---|
| Performance | Product page LCP < 2.5 s on mid-range Android over 4G; pages ≤ 200 KB JS |
| SEO | Server-rendered pages; clean URLs; schema.org `Product` + `AggregateOffer`; sitemap; canonical tags |
| Freshness | ≥ 90% of shown local prices checked within 24 h; older prices marked "may be outdated"; > 7 days → hidden |
| Accuracy | Weekly manual spot-check of 30 random prices; target ≥ 98% correct |
| Availability | 99.5% uptime; the site stays up even if every scraper fails, showing the last good data |
| Privacy | No accounts; only anonymous analytics; community report contacts stored separately and deleted after 30 days |
| Accessibility | WCAG 2.1 AA contrast, keyboard navigation, alt text |
| Scraping ethics | Respect robots.txt/ToS, rate limit each site, identify the crawler, prefer feeds/APIs where offered |

### URL structure
```
/                                         home
/phones   /laptops   /phones/samsung      listings
/samsung-galaxy-s25-ultra                 product (local mode)
/samsung-galaxy-s25-ultra?mode=global     product (global mode)
/samsung-galaxy-s25-ultra/price-in-uae    SEO page per country (pre-rendered)
/compare-prices-worldwide/iphone-17-pro   SEO landing for global view
/report-price   /how-we-compare   /disclaimer
```

---

## 9. Tech plan for a 2-developer team

Simplified from the full architecture so two people can build and run it:

| Piece | Choice | Cost/month (rough) |
|---|---|---|
| Web + API | **Next.js** (one app; API routes/server actions) on Vercel or Cloudflare | $0–20 |
| Database | **PostgreSQL** on Neon or Supabase; search via `pg_trgm` + full-text (no separate search engine yet) | $0–25 |
| ORM / migrations | Drizzle | — |
| Scrapers / jobs | Node + **Playwright** workers on a small VPS (e.g. Hetzner), scheduled with cron | $5–15 |
| Raw snapshots / images | Cloudflare R2 | ~$1–5 |
| FX rates | A commercial FX API free/low tier | $0–15 |
| Bot protection | Cloudflare Turnstile | free |
| Monitoring | Sentry (free tier) + a simple source-health page in the admin panel | free |
| Analytics | Plausible or Umami (privacy-friendly) | $0–10 |
| **Total** | | **≈ $10–100/month** before any proxy costs |

Redis, the queue and a dedicated search engine are **added only when needed**. The code structure (connectors,
matcher, pricing engine as separate modules) keeps that path open.

---

## 10. Delivery plan (about 12 weeks, 2 developers)

| Weeks | Dev A | Dev B |
|---|---|---|
| 1–2 | Repo, DB schema, admin catalogue CRUD, seed ~50 products | Connector framework, first 2 local sources, raw snapshot storage |
| 3–4 | Matching rules + match review queue | 4 more local sources, freshness/anomaly checks |
| 5–6 | Web: home, search, listing pages, product page (Local mode) | Global connectors: Apple (25 countries), Samsung |
| 7–8 | Product page Global mode, sort/filters, price-basis toggle | More global brands, FX service, PTA/tax tables + "estimated cost" |
| 9–10 | Community report form + admin moderation, price history chart | Laptop specs and filters, source health dashboard |
| 11 | SEO pages, sitemap, schema.org, performance pass | Catalogue to ~150 phones + ~100 laptops, data QA |
| 12 | Soft launch, fix issues, spot-check accuracy | Monitoring, runbook for broken connectors |

---

## 11. Success metrics (first 3 months after launch)

| Metric | Target |
|---|---|
| Popular products with ≥ 3 local prices | ≥ 80% |
| Local prices checked within 24 h | ≥ 90% |
| Price accuracy (spot check) | ≥ 98% |
| Products with global data (supported brands) | ≥ 90% |
| Outbound "Go to shop" click rate on product pages | ≥ 15% |
| Share of product views that open Global mode | track (tells us how valuable global is) |
| Verified community reports | ≥ 50/month |
| Organic search visits | grow month over month; target 20k/month by month 3 [ASSUMPTION] |

---

## 12. Open questions
1. Should the **"estimated cost in Pakistan"** view be the default in Global mode, or the simple converted price?
   The spec defaults to the simple price, per your request, with the estimate one tap away.
2. Should Daraz include only official brand stores, or also top-rated sellers?
3. Do we want a "compare two products side by side" feature in v1 or v2? The spec puts it in v2.
4. Which FX source should we treat as "the" rate: interbank or open market?
5. Budget for proxies if some retailers block crawlers?
