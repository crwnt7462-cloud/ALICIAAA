#!/bin/bash
# scripts/test_rounds.sh — Teste les rounds A→C (owner et non-owner)
# Usage : voir README section How to Test (A→C)

set -euo pipefail

# Prérequis : emails/mdp dans l'env ou passés en argument
OWNER_EMAIL="${OWNER_EMAIL:-correct@gmail.com}"
OWNER_PASSWORD="${OWNER_PASSWORD:-667ryan}"
OTHER_EMAIL="${OTHER_EMAIL:-ag@gmail.com}"
OTHER_PASSWORD="${OTHER_PASSWORD:-667ryan}"

# Génère un token pour un utilisateur donné
get_token() {
  ./get-jwt.sh "$1"
}

# Vérifie /healthz
curl -sf http://localhost:3000/healthz > /dev/null || { echo "[KO] /healthz inaccessible"; exit 1; }
echo "[OK] /healthz accessible"

# Owner token
echo "[INFO] Génération token owner ($OWNER_EMAIL)"
OWNER_TOKEN=$(get_token "$OWNER_EMAIL")

# Non-owner token
echo "[INFO] Génération token non-owner ($OTHER_EMAIL)"
OTHER_TOKEN=$(get_token "$OTHER_EMAIL")

# Test duplication depuis template (Round A)
echo "[TEST] Duplication salon depuis template..."
SALON_ID=$(curl -sf -X POST -H "Authorization: Bearer $OWNER_TOKEN" -H "Content-Type: application/json" \
  -d '{"template_slug":"default-modern"}' http://localhost:3000/api/salons/from-template | jq -r '.id')
if [[ -z "$SALON_ID" || "$SALON_ID" == "null" ]]; then
  echo "[KO] Duplication salon échouée"; exit 1;
else
  echo "[OK] Salon dupliqué : $SALON_ID"
fi

# Test GET /api/salons (owner)
OWNER_COUNT=$(curl -sf -H "Authorization: Bearer $OWNER_TOKEN" http://localhost:3000/api/salons | jq '.total')
echo "[INFO] Salons owner : $OWNER_COUNT"

# Test GET /api/salons (non-owner)
NON_OWNER_COUNT=$(curl -sf -H "Authorization: Bearer $OTHER_TOKEN" http://localhost:3000/api/salons | jq '.total')
if [[ "$NON_OWNER_COUNT" == "0" ]]; then
  echo "[OK] GET /api/salons (non-owner) : data vide"
else
  echo "[KO] GET /api/salons (non-owner) : data non vide ($NON_OWNER_COUNT)"; exit 1;
fi

# Test PATCH (Round B1/B2)
echo "[TEST] PATCH salon (owner)..."
REVISION=$(curl -sf -H "Authorization: Bearer $OWNER_TOKEN" http://localhost:3000/api/salons/$SALON_ID | jq '.revision')
PATCH_RES=$(curl -sf -X PATCH -H "Authorization: Bearer $OWNER_TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Test PATCH","last_known_revision":'$REVISION'}' http://localhost:3000/api/salons/$SALON_ID)
CHANGED=$(echo "$PATCH_RES" | jq -r '.changed_fields | join(",")')
if [[ "$CHANGED" == *"name"* ]]; then
  echo "[OK] PATCH salon : champ modifié ($CHANGED)"
else
  echo "[KO] PATCH salon : champ non modifié"; exit 1;
fi

# Test GET /api/salons/:id (non-owner)
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $OTHER_TOKEN" http://localhost:3000/api/salons/$SALON_ID)
if [[ "$STATUS" == "404" ]]; then
  echo "[OK] GET /api/salons/:id (non-owner) : 404"
else
  echo "[KO] GET /api/salons/:id (non-owner) : $STATUS"; exit 1;
fi

echo "[OK] Tous les tests A→C sont PASS"
