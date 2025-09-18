#!/usr/bin/env bash
# Audit REST Supabase pour public.salons — ne modifie rien, n'affiche jamais la clé

set -euo pipefail

# Préambule : vérification des variables d'environnement
if [[ -z "${SUPABASE_URL:-}" || -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ]]; then
  echo "❌ Erreur : SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY non définis." >&2
  echo "→ Exporte SUPABASE_URL (https://<ref>.supabase.co) et SUPABASE_SERVICE_ROLE_KEY avant de lancer ce script." >&2
  exit 1
fi

if ! [[ "$SUPABASE_URL" =~ ^https://[a-z0-9-]+\.supabase\.(co|in)$ ]]; then
  echo "❌ Erreur : SUPABASE_URL n'est pas une URL de projet Supabase (.supabase.co ou .supabase.in)." >&2
  exit 1
fi

echo "SUPABASE_URL=$SUPABASE_URL"
echo "Longueur de la clé service role : ${#SUPABASE_SERVICE_ROLE_KEY}"

JQ_BIN=""
if command -v jq >/dev/null 2>&1; then
  JQ_BIN="jq"
fi

# Fonction d'affichage
call_rest() {
  local desc="$1"
  local method="$2"
  local url="$3"
  local extra_headers=("${@:4}")
  echo
  echo "=== $desc ==="
  echo "URL : $url"
  local response
  response=$(curl -sS -w "\nHTTP_CODE:%{http_code}\n" -X "$method" "$url" \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    "${extra_headers[@]}" || true)
  local http_code
  http_code=$(echo "$response" | grep '^HTTP_CODE:' | cut -d: -f2)
  local body
  body=$(echo "$response" | sed '/^HTTP_CODE:/d')
  echo "Code HTTP : $http_code"
  echo "Corps brut :"
  echo "$body"
  if [[ -n "$JQ_BIN" && "$body" =~ ^\{|\[ ]]; then
    echo "Corps formaté (jq) :"
    echo "$body" | jq .
  fi
}

# Appels REST
call_rest "Racine REST" "GET" "$SUPABASE_URL/rest/v1/"
call_rest "OPTIONS sur salons" "OPTIONS" "$SUPABASE_URL/rest/v1/salons"
call_rest "GET salons?select=* & limit=1" "GET" "$SUPABASE_URL/rest/v1/salons?select=*&limit=1"
call_rest "GET salons?select=id & limit=1" "GET" "$SUPABASE_URL/rest/v1/salons?select=id&limit=1"
call_rest "GET salons?select=id,name,label,title,owner_id & limit=1" "GET" "$SUPABASE_URL/rest/v1/salons?select=id,name,label,title,owner_id&limit=1"

echo
echo "=== Prochaines actions côté Supabase Studio ==="
echo "1. Reload schema cache (Settings → API, bouton 'Reload' si présent)"
echo "2. Restart project (Settings → General → Restart project)"
echo "3. Vérifier que le schéma 'public' est exposé dans Settings → API"
echo "4. Vérifier les policies/RLS sur salons et les rôles anon/authenticated"
echo "5. Si une colonne est absente ou anormale, voir le plan SQL dans sql/fix_salons_schema.sql"
