#!/bin/bash

# Script de correction par étapes via API REST
source .env.local

echo "=== Correction Base de Données Services (Method 2) ==="

# 1) Vérifier structure actuelle services
echo "1) Structure actuelle services:"
curl -s \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  "$SUPABASE_URL/rest/v1/services?select=*&limit=1" | jq 'keys'

echo ""

# 2) Mise à jour manuelle des services avec duration (PATCH)
echo "2) Ajout durées par PATCH..."

# Service 1: Coupe + Brushing -> 60 min
curl -s \
  -X PATCH \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  "$SUPABASE_URL/rest/v1/services?id=eq.1" \
  -d '{"duration": 60}'

# Service 2: Coloration -> 90 min  
curl -s \
  -X PATCH \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  "$SUPABASE_URL/rest/v1/services?id=eq.2" \
  -d '{"duration": 90}'

# Service 3: Balayage -> 120 min
curl -s \
  -X PATCH \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  "$SUPABASE_URL/rest/v1/services?id=eq.3" \
  -d '{"duration": 120}'

echo "Services mis à jour avec durées"

# 3) Vérification finale
echo ""
echo "3) Vérification services avec durées:"
curl -s \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  "$SUPABASE_URL/rest/v1/services?select=id,name,price,duration" | jq '.'

echo ""

# 4) Créer quelques overrides salon_services pour test
SALON_ID="de331471-f436-4d82-bbc7-7e70d6af7958"
echo "4) Création overrides salon test pour salon $SALON_ID..."

# Override service 1 (Coupe + Brushing) : prix spécial salon 35€ au lieu de 50€
curl -s \
  -X POST \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  "$SUPABASE_URL/rest/v1/salon_services" \
  -d "{\"salon_id\": \"$SALON_ID\", \"service_id\": 1, \"price\": 35, \"duration\": 30}"

echo "Override créé pour Coupe + Brushing"
echo ""
echo "=== Fin Corrections ==="