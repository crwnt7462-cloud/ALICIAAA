#!/bin/bash
set -a
. ./.env.local
set +a
set -euo pipefail

# ── Infos projet ───────────────────────────────────────
PROJECT_REF="${SUPABASE_URL##https://}"
ANON_KEY="$SUPABASE_ANON_KEY"
EMAIL="ag@gmail.com"
PASSWORD="demo123"
# ───────────────────────────────────────────────────────

curl -sS -X POST "https://${PROJECT_REF}/auth/v1/token?grant_type=password" \
  -H "apikey: ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  --data "{\"email\":\"${EMAIL}\",\"password\":\"${PASSWORD}\"}" \
  | jq -r '.access_token // .error_description // .message'