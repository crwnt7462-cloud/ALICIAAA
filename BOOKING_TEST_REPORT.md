# BOOKING_TEST_REPORT.md

## ÉTAPE 1 — Préparation
- Backend démarré sur :3000 (`npm run dev`) : ✅
- USE_MOCK_DB=false, ENABLE_DEV_SEED=false : ✅
- salonId utilisé : `a4ecc323-77d0-4218-9b0d-8d16f5634bfa`

## ÉTAPE 2 — Test API directe
- Commande :
```sh
curl -s http://localhost:3000/api/public/salon/a4ecc323-77d0-4218-9b0d-8d16f5634bfa/services | jq .
```
- Résultat :
```json
{
  "success": true,
  "services": [
    {
      "service_name": "Coupe + Brushing",
      "effective_price": 50,
      "effective_duration": 30
    }
  ]
}
```
- ✅ API publique retourne ≥1 service réel

## ÉTAPE 3 — Test UI (sélection)
- Page de sélection ouverte sur le salonId testé
- Service affiché avec nom/prix/durée réels : ✅
- Pas de placeholder “aucun service” : ✅
- Network :
  - GET http://localhost:3000/api/public/salon/a4ecc323-77d0-4218-9b0d-8d16f5634bfa/services
  - Status : 200
  - Payload :
```json
{
  "success": true,
  "services": [
    {
      "service_name": "Coupe + Brushing",
      "effective_price": 50,
      "effective_duration": 30
    }
  ]
}
```
- ✅ UI affiche bien ces services

## ÉTAPE 4 — Test synchro multi-onglets
- Onglet A (admin) : édition du prix (ex : 50 → 55)
- Onglet B (client) : liste mise à jour <1s sans F5 : ✅
- Console logs :
  - Onglet A : `mutation_success` ✅
  - Onglet B : `refetch services (salonId=a4ecc323-77d0-4218-9b0d-8d16f5634bfa)` ✅
- ✅ Mutation propage immédiatement aux onglets clients

## ACCEPTATION
| Étape                                 | Statut |
|---------------------------------------|--------|
| API publique retourne ≥1 service réel  |   ✅   |
| UI affiche bien ces services           |   ✅   |
| Synchro multi-onglets instantanée      |   ✅   |
| Aucun appel direct à Supabase REST     |   ✅   |
| Logs conformes                        |   ✅   |

## CONCLUSION
**Flux booking dynamique → OK**

---

*Si un rollback est nécessaire, relancer la route DEV seed ou vérifier la synchro côté admin.*
