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
