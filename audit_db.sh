#!/bin/bash

# Script d'audit de la base de données via API Supabase
source .env.local

echo "=== Audit Base de Données ==="
echo "URL: $SUPABASE_URL"

# 1. Test de connexion
echo "1) Test de connexion..."
curl -s \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  "$SUPABASE_URL/rest/v1/" | head -1

echo ""

# 2. Lister les tables via information_schema
echo "2) Tables dans le schéma public:"
curl -s \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  "$SUPABASE_URL/rest/v1/rpc/get_public_tables" 2>/dev/null || \
curl -s \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  "$SUPABASE_URL/rest/v1/salon_services?select=*&limit=1" | jq -r 'if type == "array" then "salon_services: EXISTS" else "salon_services: " + (.message // "ERROR") end'

echo ""

# 3. Test table services
echo "3) Test table services:"
curl -s \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  "$SUPABASE_URL/rest/v1/services?select=*&limit=1" | jq -r 'if type == "array" then "services: EXISTS" else "services: " + (.message // "ERROR") end'

echo ""

# 4. Structure salon_services
echo "4) Structure salon_services (premiers 2 records):"
curl -s \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  "$SUPABASE_URL/rest/v1/salon_services?select=*&limit=2" | jq '.[0] // {error: "No data or error"}'

echo ""
echo "=== Fin Audit ==="