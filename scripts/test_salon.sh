#!/usr/bin/env bash
# TEST SALON — GET → PATCH → GET, autonome et robuste
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"

if [[ -z "${TEST_TOKEN:-}" || ${#TEST_TOKEN} -le 0 ]]; then
  echo "❌ TEST_TOKEN missing. Run: export TEST_TOKEN=\"$(jq -r '.access_token' /tmp/sb_login.json)\"" >&2
  exit 1
fi

echo "BASE_URL: $BASE_URL"
echo "Token length: ${#TEST_TOKEN}"

# Récup SALON_ID
if [[ -z "${SALON_ID:-}" ]]; then
  FIRST_JSON="$(curl -sS -H 'Accept: application/json' "$BASE_URL/api/salons/first")"
  SALON_ID="$(printf '%s' "$FIRST_JSON" | jq -er '.id' 2>/dev/null || true)"
fi
if [[ -z "$SALON_ID" || "$SALON_ID" == "null" ]]; then
  echo "❌ No salon found. Run: ./scripts/seed_salon.sh" >&2
  exit 1
fi

echo "SALON_ID: $SALON_ID"

# Détection PRIMARY_TEXT_COL
S_JSON="$(curl -sS -H 'Accept: application/json' -H "Authorization: Bearer $TEST_TOKEN" "$BASE_URL/api/salons/$SALON_ID")"
if jq -er 'has("name")' <<<"$S_JSON" >/dev/null; then PTC="name";
elif jq -er 'has("label")' <<<"$S_JSON" >/dev/null; then PTC="label";
elif jq -er 'has("title")' <<<"$S_JSON" >/dev/null; then PTC="title";
else echo "❌ No primary text column (name|label|title) on this record." >&2; exit 1; fi
CURRENT_VAL="$(printf '%s' "$S_JSON" | jq -er ".${PTC} // empty" 2>/dev/null || true)"
echo "PRIMARY_TEXT_COL: $PTC"
echo "Current value: $CURRENT_VAL"

# GET de référence
GET_CODE="$(curl -sS -o /tmp/salon_get.json -w '%{http_code}' -H 'Accept: application/json' -H "Authorization: Bearer $TEST_TOKEN" "$BASE_URL/api/salons/$SALON_ID")"
echo "--- [GET /api/salons/$SALON_ID] Status: $GET_CODE"
cat /tmp/salon_get.json | jq . || true
if [[ "$GET_CODE" -ge 400 ]]; then exit 1; fi

# PATCH sur la bonne colonne
NEW_VAL="AutoTest $(date -u +%FT%TZ)"
PATCH_BODY="$(jq -n --arg k "$PTC" --arg v "$NEW_VAL" '{($k): $v}')"
PATCH_CODE="$(curl -sS -o /tmp/salon_patch.json -w '%{http_code}' -X PATCH \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TEST_TOKEN" \
  -d "$PATCH_BODY" \
  "$BASE_URL/api/salons/$SALON_ID")"
echo "--- [PATCH /api/salons/$SALON_ID] Status: $PATCH_CODE"
if [[ "$PATCH_CODE" == "200" || "$PATCH_CODE" == "201" ]]; then
  AFFECTED="$(jq -er '.affected // empty' </tmp/salon_patch.json || true)"
  [[ -n "$AFFECTED" ]] && echo "affected: $AFFECTED"
fi
if [[ "$PATCH_CODE" == "403" ]]; then
  echo "❌ Forbidden or not owner. Ensure owner_id matches token sub (seed with service role)." >&2
  exit 1
fi
if [[ "$PATCH_CODE" -ge 400 ]]; then
  cat /tmp/salon_patch.json | jq . >&2
  exit 1
fi

# RE-GET et vérif
REGET_CODE="$(curl -sS -o /tmp/salon_reget.json -w '%{http_code}' -H 'Accept: application/json' -H "Authorization: Bearer $TEST_TOKEN" "$BASE_URL/api/salons/$SALON_ID")"
echo "--- [RE-GET /api/salons/$SALON_ID] Status: $REGET_CODE"
cat /tmp/salon_reget.json | jq .
NEW_READ="$(jq -er ".${PTC} // empty" </tmp/salon_reget.json || true)"
if [[ "$NEW_READ" != "$NEW_VAL" ]]; then
  echo "❌ Persistence check failed for $PTC. Expected: '$NEW_VAL' Got: '$NEW_READ'" >&2
  echo "ℹ️  If PATCH returned 200 with affected=0, check ownership (owner_id/sub) and whitelist." >&2
  exit 1
fi

echo "✅ Persistence OK: $PTC updated to '$NEW_READ'"

# --- Validation ---
# 1. ./scripts/test_salon.sh → Status PATCH: 200 (ou 403 si owner KO), affected affiché si renvoyé.
# 2. Le re-GET montre la valeur modifiée sur la bonne colonne (name|label|title).
# 3. Si 403, message d’aide ownership clair.
