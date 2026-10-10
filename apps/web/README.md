# CompareGadgetsHub — website

Next.js (App Router) + Tailwind CSS v4. The design system is ported from the Lovable homepage
(`UzairAli44/gadget-love-compare`): same oklch tokens, Manrope type, radii, shadows and utilities.

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm run build
```

## Structure
| Path | What |
|---|---|
| `app/globals.css` | Design tokens (`:root` + dark via `prefers-color-scheme`) and component utilities. Change colours here only. |
| `components/` | Shared UI: header, footer, logo, product card, section heading, page hero, breadcrumbs, freshness, state box, search box |
| `components/product/` | Product page offer tables (Pakistan / Worldwide) |
| `components/forms/` | Field wrapper, form status, report-a-price and contact forms |
| `lib/catalog/` | **The only data boundary.** `data.ts` is sample data; `index.ts` holds all queries pages use |
| `lib/site.ts` | Navigation, quick filters, budgets |
| `app/api/reports`, `app/api/contact` | Validated form endpoints that forward to webhooks (see `docs/DEPLOYMENT.md`) |

## Pages
`/` · `/phones` · `/laptops` · `/[product]` (`?variant=`, `?mode=global`) · `/search?q=` · `/deals` ·
`/report-price` · `/contact` · `/how-we-compare` · `/about` · `/disclaimer` · `/privacy` · 404
