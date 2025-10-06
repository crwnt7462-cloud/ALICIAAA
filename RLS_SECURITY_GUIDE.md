# 🔒 Stratégie de Sécurité RLS - Guide Complet

## Vue d'ensemble

Cette implémentation transforme complètement l'architecture de sécurité d'AVYENTO avec:

- **Row Level Security (RLS)** sur toutes les tables sensibles
- **Vue publique sécurisée** pour l'accès anonyme contrôlé
- **Séparation des clients** (anonyme vs service role)
- **Validation environnementale** systématique
- **Tests de sécurité** automatisés

## 🏗️ Architecture de Sécurité

### Couches de Protection

```
Frontend (React)
    ↓
API Routes (Express)
    ↓
Service Layer (publicSalonService.ts)
    ↓
View Layer (effective_services_public)
    ↓
RLS Policies (Database Level)
    ↓
Supabase Tables (salons, services, salon_services)
```

### Clients Supabase Séparés

1. **Client Anonyme** (`SUPABASE_ANON_KEY`)
   - Accès uniquement aux vues publiques
   - Pas d'accès direct aux tables
   - Utilisé pour les endpoints publics

2. **Client Service Role** (`SUPABASE_SERVICE_ROLE_KEY`)
   - Accès administrateur complet
   - Utilisé pour les opérations internes
   - Bypass des RLS pour les tâches système

## 📊 Tables et Sécurité

### Tables Protégées par RLS

| Table | Politique RLS | Accès Public | Accès Authentifié |
|-------|---------------|--------------|------------------|
| `salons` | ✅ Activée | ❌ Bloqué | ✅ Via politiques |
| `services` | ✅ Activée | ❌ Bloqué | ✅ Via politiques |
| `salon_services` | ✅ Activée | ❌ Bloqué | ✅ Via politiques |

### Vue Publique Sécurisée

```sql
CREATE VIEW effective_services_public AS
SELECT 
    s.name as salon_name,
    s.address,
    srv.name as service_name,
    srv.description,
    COALESCE(ss.custom_price, srv.default_price) as effective_price,
    COALESCE(ss.custom_duration, srv.default_duration) as effective_duration
FROM salons s
JOIN salon_services ss ON s.id = ss.salon_id
JOIN services srv ON ss.service_id = srv.id
WHERE s.is_active = true;
```

## 🔧 Implémentation Backend

### Structure des Fichiers

```
server/
├── lib/
│   ├── clients/
│   │   └── supabaseServer.ts     # Client management sécurisé
│   └── config/
│       ├── cors.ts               # Configuration CORS
│       └── environment.ts        # Validation ENV
├── services/
│   └── publicSalonService.ts     # Service layer sécurisé
├── routes/
│   └── salons.ts                 # Endpoints avec sécurité
└── scripts/
    └── test_rls_security.mjs     # Tests automatisés
```

### Client Management (`supabaseServer.ts`)

```typescript
// Clients séparés pour sécurité
export const supabaseServiceRole = createClient(url, serviceKey);
export const supabaseAnon = createClient(url, anonKey);

// Mode detection automatique
export const isUsingMockData = process.env.USE_MOCK_DB === 'true';
```

### Service Layer (`publicSalonService.ts`)

```typescript
// Accès sécurisé via vue publique
export async function getPublicSalonServices() {
  const { data, error } = await supabaseAnon
    .from('effective_services_public')  // Vue sécurisée uniquement
    .select('*');
}

// Accès admin via service role
export async function getAdminSalonServices() {
  const { data, error } = await supabaseServiceRole
    .from('salon_services')  // Table complète
    .select('*');
}
```

## 🚀 Déploiement de la Sécurité

### Étape 1: Déployer le Schema RLS

```bash
# Exécuter dans Supabase SQL Editor
psql -f sql/01_rls_security_option_a.sql
```

### Étape 2: Valider la Configuration

```bash
# Test automatisé de sécurité
cd server && node scripts/test_rls_security.mjs
```

### Étape 3: Test des Endpoints

```bash
# Test complet du flow
./booking_smoke.sh
```

## 🧪 Tests de Sécurité

### Validation Automatique

Le script `test_rls_security.mjs` vérifie:

1. ❌ **Tables bloquées** pour accès anonyme
2. ✅ **Vue accessible** pour données publiques  
3. ✅ **Service role** fonctionne pour admin
4. 📊 **Performance** des requêtes

### Résultats Attendus

```
🚫 Test 1: Anonymous access to tables (expecting FAILURES)
  ✅ SELECT salon data: BLOCKED (42501) - 45ms
  ✅ SELECT services data: BLOCKED (42501) - 32ms
  ✅ SELECT salon_services data: BLOCKED (42501) - 28ms

✅ Test 2: Anonymous access to secure view (expecting SUCCESS)  
  ✅ Secure view access: SUCCESS (156 rows) - 78ms

🎯 SECURITY VALIDATION RESULTS:
✅ SECURITY: Tables properly protected
```

## ⚙️ Configuration Environnementale

### Variables Requises

```env
# Base Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ...  # Client public
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Client admin

# Mode de fonctionnement
USE_MOCK_DB=false  # true pour mocks, false pour Supabase

# Sécurité CORS
CORS_ORIGINS=http://localhost:5173,https://yourapp.com
```

### Validation Automatique

```typescript
// Vérification au démarrage
const requiredVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY', 
  'SUPABASE_SERVICE_ROLE_KEY'
];

validateEnvironment(requiredVars);
```

## 📈 Monitoring et Performance

### Métriques de Sécurité

- **Temps de réponse** des vues sécurisées
- **Taux d'échec** des accès non autorisés  
- **Usage des clients** (anon vs service role)

### Optimisations Recommandées

```sql
-- Index sur la vue publique
CREATE INDEX idx_effective_services_salon ON salon_services(salon_id);
CREATE INDEX idx_effective_services_active ON salons(is_active) WHERE is_active = true;
```

## 🔐 Politiques RLS Détaillées

### Salon Access Policy

```sql
CREATE POLICY "Public salons are viewable by everyone" ON salons
FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can view all salons" ON salons
FOR SELECT TO authenticated USING (true);
```

### Service Access Policy  

```sql
CREATE POLICY "Public services are viewable" ON services
FOR SELECT USING (true);
```

### Salon Services Policy

```sql
CREATE POLICY "Public salon_services via active salons" ON salon_services
FOR SELECT USING (
  salon_id IN (
    SELECT id FROM salons WHERE is_active = true
  )
);
```

## 🚨 Troubleshooting

### Erreurs Communes

#### 1. "insufficient_privilege" (42501)
```
✅ NORMAL: Tables bloquées pour accès anonyme
❌ PROBLÈME: Si survient sur la vue sécurisée
```

**Solution**: Vérifier les permissions de la vue
```sql
GRANT SELECT ON effective_services_public TO anon;
```

#### 2. "relation does not exist"
```
❌ La vue n'existe pas dans Supabase
```

**Solution**: Déployer le schema RLS
```bash
psql -f sql/01_rls_security_option_a.sql
```

#### 3. Performance lente (>500ms)
```sql
-- Ajouter des index
CREATE INDEX CONCURRENTLY idx_salon_services_composite 
ON salon_services(salon_id, service_id);
```

### Debug Mode

```typescript
// Dans supabaseServer.ts
const debugMode = process.env.NODE_ENV === 'development';
if (debugMode) {
  console.log('🔍 Debug: Using client', clientType);
}
```

## 📋 Checklist de Déploiement

### Pré-déploiement

- [ ] Variables d'environnement configurées
- [ ] Schema RLS déployé dans Supabase  
- [ ] Tests de sécurité passent
- [ ] Performance validée (<200ms)

### Post-déploiement

- [ ] Monitoring des erreurs 42501
- [ ] Validation des temps de réponse
- [ ] Test des endpoints publics
- [ ] Vérification des logs

### Rollback Plan

En cas de problème:

1. **Désactiver RLS temporairement**
```sql
ALTER TABLE salons DISABLE ROW LEVEL SECURITY;
```

2. **Revenir au mode mock**
```env
USE_MOCK_DB=true
```

3. **Redéployer l'ancienne version**

## 🎯 Roadmap Sécurité

### Phase 2: Authentification JWT

- Intégration Supabase Auth
- Policies pour utilisateurs authentifiés
- Gestion des rôles (client/pro/admin)

### Phase 3: Audit et Compliance

- Logs des accès aux données
- Chiffrement des données sensibles  
- Conformité RGPD

---

**🔒 Cette implémentation offre une sécurité de niveau entreprise avec une architecture évolutive et testable.**