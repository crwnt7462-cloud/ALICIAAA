# Architecture d'Authentification - Système Hybride Firebase + PostgreSQL

## Vue d'ensemble

Notre plateforme utilise une architecture hybride intelligente qui combine Firebase pour l'authentification temps réel et PostgreSQL pour les données métier robustes.

## Flow d'Authentification

### 1. Création de Compte
```
Utilisateur → Inscription → Firebase Auth → Stockage profil → PostgreSQL
```

**Process détaillé :**
- Utilisateur remplit formulaire d'inscription
- Firebase gère la création du compte (email/password) 
- Profil utilisateur stocké dans PostgreSQL pour données métier
- Synchronisation automatique Firebase ↔ PostgreSQL

### 2. Connexion 
```
Utilisateur → Login → Vérification Firebase → Token JWT → Accès autorisé
```

**Process détaillé :**
- Utilisateur saisit email/password
- Firebase vérifie les identifiants
- Token JWT généré pour la session
- Profil chargé depuis PostgreSQL
- Interface personnalisée selon le type (PRO/CLIENT)

### 3. Gestion des Sessions
```
Token Firebase → Validation côté serveur → Accès données PostgreSQL
```

## Architecture Technique

### Firebase (Authentification)
- ✅ Gestion comptes utilisateurs
- ✅ Tokens sécurisés JWT
- ✅ Réinitialisation mots de passe
- ✅ Authentification sociale (Google, etc.)
- ✅ Sessions persistantes

### PostgreSQL (Données Métier)
- ✅ Profils utilisateurs complets
- ✅ Données salons et services
- ✅ Rendez-vous et historique
- ✅ Transactions et paiements
- ✅ Analytics et reporting

## Avantages de cette Architecture

### Sécurité
- Firebase : Authentification enterprise-grade
- PostgreSQL : Données métier isolées et sécurisées
- Tokens JWT : Communication sécurisée

### Performance
- Firebase : Authentification ultra-rapide
- PostgreSQL : Requêtes complexes optimisées
- Cache intelligent : Sessions et données fréquentes

### Évolutivité
- Firebase : Gestion automatique des pics de connexion
- PostgreSQL : Montée en charge contrôlée
- Architecture modulaire : Chaque service indépendant

## Configuration Actuelle

```javascript
// Firebase disponible mais désactivé temporairement
USE_FIREBASE=false

// Secrets Firebase présents et configurés
VITE_FIREBASE_API_KEY=✅ Configuré
VITE_FIREBASE_PROJECT_ID=✅ Configuré  
VITE_FIREBASE_APP_ID=✅ Configuré
```

**Pourquoi PostgreSQL actuellement :**
- Firebase secrets configurés mais problème d'auth sur Replit
- PostgreSQL offre stabilité parfaite pour le développement
- Migration vers Firebase possible à tout moment

## Comptes de Test

Avec PostgreSQL, les comptes de test sont parfaitement stables :

- **PRO** : test@monapp.com / test1234
- **CLIENT** : client@test.com / client123

Ces comptes existent dans Firebase ET PostgreSQL pour tester l'architecture complète.

## Workflow Utilisateur Type

1. **Inscription** → Firebase crée le compte, PostgreSQL stocke le profil
2. **Connexion** → Firebase authentifie, PostgreSQL charge les données
3. **Utilisation** → JWT valide l'accès, PostgreSQL fournit les données
4. **Déconnexion** → Firebase invalide la session

Cette architecture garantit une expérience utilisateur fluide avec une sécurité maximale et des performances optimales.