#!/usr/bin/env bash
# Apply supabase/setup.sql (schema + seed) via Supabase Management API.
# Requires: export SUPABASE_ACCESS_TOKEN=sbp_…  (https://supabase.com/dashboard/account/tokens)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PROJECT_REF="${SUPABASE_PROJECT_REF:-vmqggaksvweiyhevgebs}"
SQL_FILE="${1:-$ROOT/supabase/setup.sql}"

if [[ -z "${SUPABASE_ACCESS_TOKEN:-}" ]]; then
  echo "Missing SUPABASE_ACCESS_TOKEN."
  echo "Create a PAT at https://supabase.com/dashboard/account/tokens"
  echo "then: export SUPABASE_ACCESS_TOKEN=sbp_… && $0"
  echo ""
  echo "Or paste $SQL_FILE into Supabase → SQL Editor → Run."
  exit 1
fi

if [[ ! -f "$SQL_FILE" ]]; then
  echo "Missing $SQL_FILE"
  exit 1
fi

echo "==> Applying $(basename "$SQL_FILE") to project $PROJECT_REF…"
SUPABASE_PROJECT_REF="$PROJECT_REF" SQL_FILE="$SQL_FILE" python3 - <<'PY'
import json, os, pathlib, urllib.request, urllib.error
ref = os.environ.get("SUPABASE_PROJECT_REF", "vmqggaksvweiyhevgebs")
token = os.environ["SUPABASE_ACCESS_TOKEN"]
sql = pathlib.Path(os.environ["SQL_FILE"]).read_text()
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
        print("SQL OK", res.status, body[:500])
except urllib.error.HTTPError as e:
    print("SQL failed", e.code, e.read().decode()[:1200])
    raise SystemExit(1)
PY

echo "==> Verifying REST…"
# Uses publishable key from js/supabase-config.js if present
node - <<'NODE'
const fs = require('fs')
const cfg = fs.readFileSync('js/supabase-config.js', 'utf8')
const url = (cfg.match(/url:\s*'([^']+)'/) || [])[1]
const key = (cfg.match(/anonKey:\s*'([^']+)'/) || [])[1]
if (!url || !key) {
  console.log('Skip REST verify (no config)')
  process.exit(0)
}
fetch(`${url}/rest/v1/gallery_images?select=id&limit=1`, {
  headers: { apikey: key, Authorization: `Bearer ${key}` },
})
  .then(async (r) => {
    const t = await r.text()
    console.log('REST', r.status, t.slice(0, 200))
    if (!r.ok) process.exit(1)
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
NODE

echo "Done."
