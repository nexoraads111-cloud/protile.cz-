#!/usr/bin/env bash
# Deploy reviews SQL (via Management API) + Edge Functions + secrets.
# Requires SUPABASE_ACCESS_TOKEN (never commit). Optional: source .local-secrets/reviews.env
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PROJECT_REF="${SUPABASE_PROJECT_REF:-vmqggaksvweiyhevgebs}"
SECRETS_FILE="${REVIEWS_SECRETS_FILE:-$ROOT/.local-secrets/reviews.env}"

if [[ -f "$SECRETS_FILE" ]]; then
  # shellcheck disable=SC1090
  set -a
  source "$SECRETS_FILE"
  set +a
fi

if [[ -z "${SUPABASE_ACCESS_TOKEN:-}" ]]; then
  echo "Missing SUPABASE_ACCESS_TOKEN. Create a PAT at https://supabase.com/dashboard/account/tokens"
  echo "then: export SUPABASE_ACCESS_TOKEN=sbp_… && $0"
  exit 1
fi

SQL_FILE="$ROOT/supabase/reviews.sql"
if [[ ! -f "$SQL_FILE" ]]; then
  echo "Missing $SQL_FILE"
  exit 1
fi

echo "==> Applying reviews.sql via Management API…"
SUPABASE_PROJECT_REF="$PROJECT_REF" python3 - <<'PY'
import json, os, pathlib, urllib.request
ref = os.environ.get("SUPABASE_PROJECT_REF", "vmqggaksvweiyhevgebs")
token = os.environ["SUPABASE_ACCESS_TOKEN"]
sql = pathlib.Path("supabase/reviews.sql").read_text()
req = urllib.request.Request(
    f"https://api.supabase.com/v1/projects/{ref}/database/query",
    data=json.dumps({"query": sql}).encode(),
    headers={
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    },
    method="POST",
)
try:
    with urllib.request.urlopen(req) as res:
        body = res.read().decode()
        print("SQL OK", res.status, body[:400])
except urllib.error.HTTPError as e:
    print("SQL failed", e.code, e.read().decode()[:800])
    raise SystemExit(1)
PY

echo "==> Setting Edge Function secrets…"
REVIEW_ACTION_SECRET="${REVIEW_ACTION_SECRET:?REVIEW_ACTION_SECRET required}"
REVIEW_NOTIFY_EMAIL="${REVIEW_NOTIFY_EMAIL:-protilecz@gmail.com}"
REVIEW_FROM_EMAIL="${REVIEW_FROM_EMAIL:-ProTile CZ <onboarding@resend.dev>}"
SITE_URL="${SITE_URL:-https://protile.cz}"

SECRET_ARGS=(
  "REVIEW_ACTION_SECRET=${REVIEW_ACTION_SECRET}"
  "REVIEW_NOTIFY_EMAIL=${REVIEW_NOTIFY_EMAIL}"
  "REVIEW_FROM_EMAIL=${REVIEW_FROM_EMAIL}"
  "SITE_URL=${SITE_URL}"
)

if [[ -n "${RESEND_API_KEY:-}" ]]; then
  SECRET_ARGS+=("RESEND_API_KEY=${RESEND_API_KEY}")
else
  echo "WARN: RESEND_API_KEY missing — wiring DB/site secrets only; approval email will stay skipped until Resend is set."
fi

npx --yes supabase secrets set --project-ref "$PROJECT_REF" "${SECRET_ARGS[@]}"

echo "==> Deploying Edge Functions…"
# --no-verify-jwt: email Accept/Cancel links open in a browser without a Supabase JWT
npx --yes supabase functions deploy submit-review --project-ref "$PROJECT_REF" --no-verify-jwt
npx --yes supabase functions deploy review-action --project-ref "$PROJECT_REF" --no-verify-jwt

echo "Done. Test: open https://protile.cz/#recenze → Zanechat recenzi"
if [[ -z "${RESEND_API_KEY:-}" ]]; then
  echo "Still needed: RESEND_API_KEY (user/Resend) → supabase secrets set --project-ref $PROJECT_REF RESEND_API_KEY=…"
fi
