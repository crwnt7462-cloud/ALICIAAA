# 🔧 Guide Opérateur - Connexion Supabase SÉCURISÉE

## 🎯 Objectif
Connecter le serveur à Supabase en production **SANS JAMAIS exposer de secrets dans le code**.

## 📋 Prérequis
- Compte Supabase avec projet créé
- Accès au dashboard Supabase  
- Environnement d'exécution (local/host/CI)

---

## 🔐 Étape 1: Récupérer les clés Supabase

### 1.1 Se connecter au dashboard
```bash
https://supabase.com/dashboard
```

### 1.2 Aller dans votre projet > Settings > API
```
Project URL: https://YOUR_PROJECT.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ SÉCURITÉ:**
- `anon public` = lecture publique (OK côté front)
- `service_role` = admin total (JAMAIS côté front, UNIQUEMENT serveur)

---

## 🌍 Étape 2: Configuration environnement

### 2.1 Développement local

```bash
# Copier le template
cp server/.env.example server/.env

# Éditer avec vos vraies valeurs
vi server/.env
```

**Remplacer dans server/.env:**
```bash
# AVANT
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_ANON_KEY  
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_SERVICE_ROLE_KEY

# APRÈS (avec VOS vraies valeurs)
SUPABASE_URL=https://abcd1234.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3...
```

**Activer la DB réelle:**
```bash
# Dans server/.env
USE_MOCK_DB=false
FRONT_ORIGIN=http://localhost:5173
```

### 2.2 Production/Staging (sans fichier .env)

**GitHub Actions:**
```yaml
env:
  SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
  SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}  
  SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
  USE_MOCK_DB: false
  FRONT_ORIGIN: https://myapp.com
```

**Render/Railway/Fly.io:**
```bash
# Via interface web ou CLI
SUPABASE_URL=https://abcd1234.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
USE_MOCK_DB=false
FRONT_ORIGIN=https://myapp.com
NODE_ENV=production
```

**Docker/Kubernetes:**
```bash
docker run -e SUPABASE_URL="https://abcd1234.supabase.co" \
  -e SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -e USE_MOCK_DB=false \
  myapp:latest
```

---

## ✅ Étape 3: Vérification

### 3.1 Test de connexion
```bash
# Depuis le dossier server/
node scripts/check_db.mjs
```

**Résultat attendu:**
```
✅ db_check_success {
  status: 'connected',
  recordsFound: 0,
  responseTime: 123,
  projectHost: 'abcd1234'
}
```

### 3.2 Test de l'API
```bash
# Démarrer le serveur
npm run dev

# Test healthz
curl http://localhost:3000/healthz
```

**Résultat attendu:**
```json
{
  "ok": true,
  "db": "ok", 
  "supabaseProject": "abcd1234",
  "mode": "database"
}
```

### 3.3 Test du booking flow
```bash
# Lancer les tests automatisés
./booking_smoke.sh
```

**Résultat attendu:**
```
✅ CORS OK (204)
✅ Booking API returning correct data
✅ Service A: Coupe homme (45€, 35min)  
```

---

## 🚨 Dépannage

### ❌ "SUPABASE_URL manquant"
- Vérifier que `server/.env` existe
- Vérifier que la variable est bien définie dans l'environnement

### ❌ "Database error fetching services"
- Tables `services` et `salon_services` existent ?
- RLS policies configurées ?
- Service role key correcte ?

### ❌ "Origin not allowed by CORS" 
- Définir `FRONT_ORIGIN=http://localhost:5173` (dev)
- Définir `FRONT_ORIGIN=https://yourdomain.com` (prod)

### ❌ "db_check_fail"
```bash
# Test manuel
curl -H "apikey: YOUR_ANON_KEY" \
  "https://YOUR_PROJECT.supabase.co/rest/v1/services?select=id&limit=1"
```

---

## 🔄 Workflow complet

### Développement
```bash
# 1. Configuration
cp server/.env.example server/.env
vi server/.env  # Remplir les clés Supabase

# 2. Activer DB
echo "USE_MOCK_DB=false" >> server/.env

# 3. Test
node server/scripts/check_db.mjs
npm run dev
./booking_smoke.sh
```

### Déploiement production  
```bash
# 1. Variables d'environnement sur la plateforme
# (via interface web ou CLI)

# 2. Deploy
git push origin main

# 3. Vérification post-deploy
curl https://yourapp.com/healthz
./booking_smoke.sh  # avec BASE_URL=https://yourapp.com
```

---

## 🔒 Règles de sécurité

### ✅ À FAIRE
- ✅ Stocker les secrets dans l'environnement d'exécution  
- ✅ Utiliser service_role UNIQUEMENT côté serveur
- ✅ Valider les variables au boot (fail fast)
- ✅ Logger sans exposer les valeurs sensibles

### ❌ JAMAIS FAIRE
- ❌ Commiter un fichier `.env` avec de vraies valeurs
- ❌ Hardcoder des clés dans le code source
- ❌ Utiliser service_role côté frontend  
- ❌ Logger les clés dans les traces

---

## 📞 Support

En cas de problème:
1. Vérifier les logs du serveur
2. Tester avec `node scripts/check_db.mjs`
3. Vérifier les RLS policies Supabase
4. Consulter la documentation Supabase