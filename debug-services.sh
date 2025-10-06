#!/bin/bash

# Script de diagnostic pour debug les services

echo "🔍 Diagnostic Services API"
echo "========================"

# Configuration
API_BASE="http://localhost:3002"
SALON_ID="e334ec3b-9200-48d4-a9fa-cc044ade2c03"

# Obtenir JWT
JWT=$(bash get-jwt.sh)
echo "✅ JWT obtenu: ${JWT:0:30}..."

# Test 1: Vérifier que le salon existe
echo ""
echo "1️⃣  Vérification salon existant:"
curl -s -H "Authorization: Bearer $JWT" "$API_BASE/api/salons" | jq '.data[] | {id, name}'

# Test 2: Tester l'endpoint services publics (devrait marcher même sans services)
echo ""
echo "2️⃣  Test services publics:"
curl -s "$API_BASE/api/public/salon/$SALON_ID/services" | jq '.'

# Test 3: Tester l'endpoint admin (pour voir l'erreur exacte)
echo ""
echo "3️⃣  Test services admin:"
curl -s -H "Authorization: Bearer $JWT" "$API_BASE/api/salons/salon/$SALON_ID/services/admin" | jq '.'

# Test 4: Créer un service simple
echo ""
echo "4️⃣  Création service simple:"
curl -s -X POST \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{"name":"Service Debug","price":25,"duration":30,"description":"Test debug"}' \
  "$API_BASE/api/salons/salon/$SALON_ID/services" | jq '.'

echo ""
echo "✨ Diagnostic terminé"