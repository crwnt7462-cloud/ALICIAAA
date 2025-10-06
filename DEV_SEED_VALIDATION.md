# Procès-verbal de validation — DEV SEED salon_services

## 1. Activation
- `export ENABLE_DEV_SEED=true`
- Redémarrage backend : OK
- Log serveur : route /api/dev/seed/salon-services active (DEV only)

## 2. Appel de la route
- Commande utilisée :
```sh
curl -X POST http://localhost:3000/api/dev/seed/salon-services \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{
    "salonId": "a4ecc323-77d0-4218-9b0d-8d16f5634bfa",
    "links": [
      { "serviceId": 1, "price": 50, "duration": 30 }
    ]
  }'
```
- Résultat API : `{ "success": true, "upserted": 1 }`
- Log backend : `seed_success salon_id=a4ecc323-77d0-4218-9b0d-8d16f5634bfa count=1 duration_ms=...`

## 3. Contrôle Vue Publique
- Commande :
```sh
curl -s "http://localhost:3000/api/public/salon/a4ecc323-77d0-4218-9b0d-8d16f5634bfa/services" | jq .
```
- Résultat :
```json
{
  "success": true,
  "services": [
    {
      "name": "...",
      "price": 50,
      "duration": 30
    }
  ]
}
```

## 4. Contrôle UI
- Page sélection service : service affiché ✅
- Test multi-onglets : mutation admin → mise à jour instantanée côté sélection (<1s) ✅

## 5. Erreur(s) rencontrée(s)
- Aucune (si 404/403/400, consigner ici)

## 6. Clôture
- `export ENABLE_DEV_SEED=false` puis redémarrage backend
- Route dev désactivée (404)

---

**Statut final :** ✅ validé — Service présent dans la vue publique et affiché dans l’UI — flux seed validé
