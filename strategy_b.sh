#!/bin/bash

# Stratégie B - Simple et robuste (tout dans salon_services)
source .env.local

echo "=== Stratégie B - Services Simples ==="

SALON_ID="de331471-f436-4d82-bbc7-7e70d6af7958"

# B.1 - Vérifier structure salon_services
echo "1) Structure salon_services actuelle:"
curl -s \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  "$SUPABASE_URL/rest/v1/salon_services?select=*&limit=1" | jq 'keys // "empty"'

# B.2 - Supprimer les overrides existants pour ce salon pour nettoyer
echo ""
echo "2) Nettoyage overrides existants..."
curl -s \
  -X DELETE \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Prefer: return=minimal" \
  "$SUPABASE_URL/rest/v1/salon_services?salon_id=eq.$SALON_ID"

# B.3 - Créer les services complets pour ce salon
echo ""
echo "3) Création services complets pour salon $SALON_ID..."

# Service 1: Coupe Bonhomme (comme utilisé par l'API actuelle)
curl -s \
  -X POST \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  "$SUPABASE_URL/rest/v1/salon_services" \
  -d "{\"salon_id\": \"$SALON_ID\", \"service_id\": 1, \"price\": 39, \"duration\": 30}"

# Service 2: Coupe + Brushing
curl -s \
  -X POST \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  "$SUPABASE_URL/rest/v1/salon_services" \
  -d "{\"salon_id\": \"$SALON_ID\", \"service_id\": 2, \"price\": 55, \"duration\": 60}"

# Service 3: Coloration
curl -s \
  -X POST \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  "$SUPABASE_URL/rest/v1/salon_services" \
  -d "{\"salon_id\": \"$SALON_ID\", \"service_id\": 3, \"price\": 75, \"duration\": 90}"

echo ""
echo "Services créés"

# B.4 - Vérifier les données créées
echo ""
echo "4) Vérification des services créés:"
curl -s \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  "$SUPABASE_URL/rest/v1/salon_services?salon_id=eq.$SALON_ID&select=*" | jq '.'

echo ""
echo "=== Test avec JOIN services ==="

# B.5 - Test de lecture avec JOIN pour récupérer les noms
curl -s \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  "$SUPABASE_URL/rest/v1/salon_services?salon_id=eq.$SALON_ID&select=service_id,price,duration,services(name)" | jq '.'

echo ""
echo "=== Fin Stratégie B ==="