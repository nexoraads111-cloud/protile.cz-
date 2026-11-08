# Recenze (otzivy) — setup

Public `#recenze` lists approved reviews. Button **Zanechat recenzi** opens a modal form → stored as `pending` → admin email to **protilecz@gmail.com** with **Přijmout** / **Zrušit** (HMAC-signed links) → approve shows publicly.

Rating is optional (1–5 or empty).

Project: `vmqggaksvweiyhevgebs` · site: [https://protile.cz](https://protile.cz)

## 1. SQL

Supabase → SQL Editor → run `supabase/reviews.sql`.

## 2. Edge Functions

Deploy from repo (needs Supabase CLI + project login / `SUPABASE_ACCESS_TOKEN`):

```bash
supabase functions deploy submit-review --project-ref vmqggaksvweiyhevgebs --no-verify-jwt
supabase functions deploy review-action --project-ref vmqggaksvweiyhevgebs --no-verify-jwt
```

Or: `SUPABASE_ACCESS_TOKEN=sbp_… ./scripts/deploy-reviews.sh`

## 3. Secrets (Supabase → Edge Functions → Secrets)

| Secret | Required | Notes |
|--------|----------|--------|
| `RESEND_API_KEY` | **Yes** for email | From [resend.com](https://resend.com) — **never commit to git** |
| `REVIEW_ACTION_SECRET` | **Yes** | Long random string (≥32 chars), e.g. `openssl rand -hex 32` |
| `REVIEW_NOTIFY_EMAIL` | Optional | Default / production: `protilecz@gmail.com` |
| `SITE_URL` | Optional | `https://protile.cz` |
| `REVIEW_FROM_EMAIL` | Optional | Until domain verified: `ProTile CZ <onboarding@resend.dev>` (**only delivers to the Resend account owner**). After verifying a domain: e.g. `ProTile CZ <recenze@protile.cz>` |

### GitHub Actions (Pages build)

Repo secrets (Settings → Secrets and variables → Actions):

| Secret | Notes |
|--------|--------|
| `VITE_SUPABASE_URL` | `https://vmqggaksvweiyhevgebs.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Publishable / anon key (`sb_publishable_…`) |

```bash
printf '%s' 'https://vmqggaksvweiyhevgebs.supabase.co' | gh secret set VITE_SUPABASE_URL -R nexoraads111-cloud/protile.cz-
printf '%s' 'YOUR_PUBLISHABLE_KEY' | gh secret set VITE_SUPABASE_ANON_KEY -R nexoraads111-cloud/protile.cz-
```

Then redeploy Pages (push to `main` or **Actions → Deploy to GitHub Pages → Run workflow**).

### Resend domain (required for production inbox)

With `from: onboarding@resend.dev`, Resend **only** allows sending to the account owner.  
To deliver approval emails to **`protilecz@gmail.com`**:

1. Open [resend.com/domains](https://resend.com/domains) → **Add domain** `protile.cz` (or a subdomain).
2. Add the DNS records Resend shows.
3. Wait until domain is **Verified**.
4. Set Edge secret `REVIEW_FROM_EMAIL` to something like `ProTile CZ <recenze@protile.cz>` (must use that domain).
5. Keep `REVIEW_NOTIFY_EMAIL=protilecz@gmail.com`.

`SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` / `SUPABASE_ANON_KEY` are usually injected automatically for Edge Functions.

## 4. Admin use

1. Visitor fills **Recenze** form on the site.
2. You get email at `protilecz@gmail.com`.
3. **Přijmout** → status `approved` → visible publicly.
4. **Zrušit** → status `rejected` → hidden.

Links expire in 14 days and cannot be guessed (HMAC).

## Blocker

Without `RESEND_API_KEY`, submissions can still be saved as pending (function returns a skip reason), but **no approval email** is sent. Coordinator must provide a Resend API key to finish the email path.
