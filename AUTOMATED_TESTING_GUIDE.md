# 🔍 Guide Test Automatisé - Booking Data Flow

## Vue d'ensemble

Le script `booking_smoke.sh` valide automatiquement que vos corrections anti-"fake data" fonctionnent correctement en testant l'intégralité du flux de données.

## Configuration rapide

1. **Copier le fichier de config**
   ```bash
   cp .env.booking_test.example .env.booking_test
   ```

2. **Remplir les variables** dans `.env.booking_test`
   ```bash
   # URLs de base
   BASE_URL="http://localhost:5173"
   FRONT_ORIGIN="http://localhost:5173"
   
   # Credentials Supabase
   SUPABASE_URL="https://your-project.supabase.co"
   SUPABASE_ANON_KEY="eyJ..."
   
   # Test Case A (obligatoire)
   SALON_A_ID="salon-uuid-123"
   SERVICE_A_ID="service-uuid-456"
   EXPECTED_PRICE_A="45"
   EXPECTED_DURATION_A="35"
   
   # Test Case B (différenciation)
   SALON_B_ID="salon-uuid-789"
   SERVICE_B_ID="service-uuid-012"
   EXPECTED_PRICE_B="55"
   EXPECTED_DURATION_B="60"
   ```

3. **Lancer le test**
   ```bash
   ./booking_smoke.sh
   ```

## Ce que le test valide

### ✅ 1. CORS Preflight
- Vérifie que le frontend peut appeler votre API
- Alerte si CORS mal configuré

### ✅ 2. API Booking - Salon A
- Teste `/api/salons/salon/{id}/services`
- Valide que les données retournées matchent vos attentes
- Prix, durée, nom du service

### ✅ 3. Différenciation des données
- Teste avec Salon B / Service B 
- S'assure que les services sont bien distincts
- Alerte si cache mal configuré ou mapping incorrect

### ✅ 4. Supabase RLS
- Teste l'accès direct à Supabase en anonyme
- Valide que les données correspondent à l'API
- Teste les services inactifs (si configuré)

### ✅ 5. Accessibilité page (optionnel)
- Vérifie que la page booking est accessible
- Utile pour les tests de déploiement

## Interprétation des résultats

### 🟢 Succès complet
```
🎉 SMOKE TEST COMPLETED
✅ CORS preflight working
✅ Booking API returning correct data  
✅ Service A: Coupe homme (45€, 35min)
✅ Supabase RLS accessible
```
**Action**: RAS, tout fonctionne

### 🟡 Avertissements
```
⚠️ Services A and B are identical - possible cache/mapping issue
```
**Action**: Vérifier que vos IDs de test sont différents, ou que useEffectiveService utilise bien les bons paramètres de cache

```
⚠️ Supabase vs API price mismatch (50 vs 45)
```
**Action**: Vérifier que l'API et Supabase sont synchronisées

### 🔴 Échecs critiques  
```
❌ API Request Failed
```
**Action**: Vérifier que votre serveur est démarré et accessible

```
❌ Service A not found in API response
```
**Action**: Vérifier que SALON_A_ID et SERVICE_A_ID existent dans votre DB

```
❌ Price mismatch for Service A
```
**Action**: Soit mettre à jour EXPECTED_PRICE_A, soit corriger les données en DB

## Utilisation en développement

### Avant chaque commit majeur
```bash
./booking_smoke.sh
```

### Avant déploiement (CI/CD)
```bash
# Dans votre pipeline
- name: Smoke Test Booking
  run: |
    cp .env.booking_test.prod .env.booking_test
    ./booking_smoke.sh
```

### Debug d'un problème spécifique
```bash
# Test uniquement CORS
curl -I -H "Origin: http://localhost:5173" http://localhost:5173/api/salons/salon/123/services

# Test API directement 
curl http://localhost:5173/api/salons/salon/YOUR_SALON_ID/services | jq .

# Test Supabase direct
curl -H "apikey: YOUR_ANON_KEY" \
  "https://your-project.supabase.co/rest/v1/salon_services?salon_id=eq.YOUR_SALON_ID"
```

## Intégration avec votre workflow

### 1. Tests automatiques au démarrage
Ajouter dans votre `package.json` :
```json
{
  "scripts": {
    "test:smoke": "./booking_smoke.sh",
    "dev:validated": "npm run dev && npm run test:smoke"
  }
}
```

### 2. Pre-commit hook
```bash
# .git/hooks/pre-commit
#!/bin/sh
./booking_smoke.sh
```

### 3. Monitoring continu
Lancer le test toutes les 30 minutes en production pour détecter les régressions.

## Troubleshooting

### "jq: command not found"
```bash
# macOS
brew install jq

# Linux
sudo apt-get install jq
```

### "Permission denied"
```bash
chmod +x booking_smoke.sh
```

### Variables d'environnement manquantes
Vérifiez que `.env.booking_test` existe et contient toutes les variables obligatoires du `.env.booking_test.example`.

## Extension du test

Pour ajouter de nouveaux cas de test, modifier le script en ajoutant:
- Nouvelles variables dans `.env.booking_test.example`  
- Nouveaux tests dans `booking_smoke.sh`
- Documentation des nouveaux tests dans ce guide