#!/bin/bash

# Script pour vérifier les politiques RLS sur la table services

echo "🔍 Vérification des politiques RLS sur la table services"
echo "======================================================"

# Configuration
API_BASE="http://localhost:3002"
JWT=$(bash get-jwt.sh)

echo "📋 Test de création de service (pour voir l'erreur RLS):"

curl -s -X POST \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Service RLS", 
    "price": 35,
    "duration": 45,
    "description": "Test pour debug RLS"
  }' \
  "$API_BASE/api/salons/salon/e334ec3b-9200-48d4-a9fa-cc044ade2c03/services" | jq '.'

echo ""
echo "💡 Pour corriger cela, il faut soit :"
echo "   1. Créer les bonnes politiques RLS pour la table 'services'"
echo "   2. Ou utiliser le service role pour bypasser RLS"
echo ""