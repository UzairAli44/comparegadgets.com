# Deployment (Vercel + comparegadgetshub.com)

The website lives in `apps/web` (Next.js). Vercel builds it automatically on every push.

## One-time setup
1. Sign in at https://vercel.com with GitHub.
2. **Add New → Project →** import `UzairAli44/comparegadgets.com`.
3. **Root Directory:** `apps/web` (Framework: Next.js is detected automatically). Click **Deploy**.
4. **Settings → Git → Production Branch:** `main`.
   - Push/merge to `main` → production (comparegadgetshub.com)
   - Push to any other branch → a preview URL (shown on the PR/commit)

## Connect the domain
1. **Settings → Domains →** add `comparegadgetshub.com` (and accept adding `www.comparegadgetshub.com`, which redirects).
2. At your domain registrar's DNS panel, add the records Vercel shows. Typically:

   | Type | Name | Value |
   |---|---|---|
   | A | `@` | `76.76.21.21` |
   | CNAME | `www` | `cname.vercel-dns.com` |

   Use the exact values Vercel displays if they differ. Remove any other A/AAAA records on `@`.
   Alternative: switch the domain's nameservers to Vercel's (`ns1.vercel-dns.com`, `ns2.vercel-dns.com`).
3. Wait until Vercel shows **Valid Configuration** (usually minutes, up to 48 h). HTTPS is issued automatically.

## Local development
```bash
cd apps/web
npm install
npm run dev   # http://localhost:3000
```

## Environment variables (Vercel → Settings → Environment Variables)

| Name | Required | Purpose |
|---|---|---|
| `REPORTS_WEBHOOK_URL` | To accept price reports | `/api/reports` POSTs each validated report here as `multipart/form-data` (fields + the photo). Any webhook receiver works: Zapier/Make, Google Apps Script, or the future admin API. |
| `CONTACT_WEBHOOK_URL` | To accept contact messages | `/api/contact` POSTs each validated message here as JSON. |

Without these, both forms validate input but reply "Submissions aren't switched on yet" (HTTP 503), and nothing is lost silently.
Redeploy after adding or changing a variable.

## Before switching to live data
- `apps/web/lib/catalog/data.ts` is **sample data** (`DATA_STATUS.isSample = true` shows the preview banner).
  Re-implement `apps/web/lib/catalog/index.ts` against the real database/API; pages only call that module.
- Add bot protection (e.g. Cloudflare Turnstile) and rate limiting to `/api/reports` and `/api/contact` before promoting the forms.
