# Application de Gestion de Salon de Beauté - Documentation

## Vue d'ensemble du projet

Une plateforme web simple et efficace pour la gestion de salons et instituts de beauté, avec interface professionnelle et gestion complète des rendez-vous.

### Stack Technologique
- **Frontend**: React TypeScript + Vite
- **Backend**: Express.js + TypeScript  
- **Base de données**: PostgreSQL avec Drizzle ORM
- **UI**: Tailwind CSS + shadcn/ui
- **IA**: OpenAI GPT-4o pour l'intelligence artificielle
- **Technologies avancées**: QR codes, analytics prédictives, chatbot IA

## Architecture du Projet

### Structure des Dossiers
```
├── client/src/
│   ├── components/     # Composants UI réutilisables
│   ├── pages/         # Pages de l'application
│   ├── hooks/         # Hooks React personnalisés
│   └── lib/           # Utilitaires et configuration
├── server/            # API Backend Express
├── shared/            # Schémas et types partagés
└── assets/           # Ressources statiques
```

### Pages Principales
- **Dashboard** : Tableau de bord avec métriques de base
- **Planning** : Gestion des rendez-vous
- **Clients** : Gestion de la clientèle
- **Services** : Configuration des prestations
- **IA Pro** : Fonctionnalités d'intelligence artificielle

## Fonctionnalités Principales

### 1. Gestion des Rendez-vous
- Planning interactif avec vue journalière/hebdomadaire
- Création et modification de rendez-vous
- Gestion des créneaux horaires
- Statuts des rendez-vous (confirmé, en attente, annulé)

### 2. Gestion Clientèle
- Base de données clients complète
- Historique des rendez-vous
- Informations de contact
- Recherche et filtrage

### 3. Gestion des Services
- Catalogue des prestations
- Tarification et durée
- Configuration des services
- Attribution aux membres de l'équipe

### 4. Tableau de Bord
- Vue d'ensemble des activités
- Statistiques de base
- Prochains rendez-vous
- Indicateurs de performance

## Services Backend Avancés

### 1. AIService
Intelligence artificielle pour :
- Optimisation planning quotidien
- Prédiction risques d'annulation/absence
- Génération insights business
- Réponses chatbot contextuelles

### 2. ConfirmationService
Notifications automatiques :
- Emails de confirmation HTML élaborés
- SMS avec liens de gestion
- Intégration calendriers (Google, Outlook)
- Rappels personnalisés

### 3. NotificationService
Système de notifications push :
- Nouvelles réservations
- Détection créneaux libres
- Rappels automatiques
- Alertes paiements

### 4. ReceiptService
Génération automatique :
- Reçus PDF professionnels
- Factures personnalisées
- Logos et branding
- Envoi automatique

## Base de Données Étendue

### Tables Principales
- **users** : Comptes professionnels
- **clients** : Base clients complète
- **appointments** : Gestion rendez-vous
- **services** : Catalogue prestations
- **staff** : Équipe salon

### Tables Avancées
- **reviews** : Système d'avis clients
- **loyalty_programs** : Programme fidélité
- **promotions** : Offres et réductions
- **notifications** : Historique notifications
- **waiting_list** : Liste d'attente intelligente
- **forum_posts** : Communauté professionnels

## Navigation Simple

### Menu Principal (BottomNavigation)
1. **Accueil** : Dashboard principal
2. **Planning** : Gestion des rendez-vous
3. **Clients** : Base de données clientèle
4. **Services** : Configuration des prestations
5. **IA Pro** : Fonctionnalités d'assistance intelligente

### Architecture de Navigation
- Interface mobile-first
- Design épuré et professionnel
- Navigation intuitive
- Accès rapide aux fonctionnalités essentielles

## Changements Récents

### Décembre 2024
- ✅ Navigation simplifiée avec 5 sections principales
- ✅ Interface utilisateur épurée et professionnelle
- ✅ Gestion complète des rendez-vous et clients
- ✅ Architecture backend robuste
- ✅ Documentation projet mise à jour

### Fonctionnalités en Développement
- 🔄 Intégration Stripe pour paiements
- 🔄 Notifications push mobiles
- 🔄 Synchronisation calendriers externes
- 🔄 API publique pour intégrations

## Préférences Utilisateur

### Style de Communication
- Interface en français
- Terminologie professionnelle beauté
- Design moderne et élégant
- Focus sur l'innovation technologique

### Objectifs Business
- Différenciation concurrentielle maximale
- Adoption technologies révolutionnaires
- Amélioration expérience client
- Optimisation opérationnelle

### Priorités Techniques
- Performance et fluidité interface
- Sécurité données clients
- Évolutivité architecture
- Intégration IA avancée

## Instructions de Développement

### Standards de Code
- TypeScript strict mode
- Composants React fonctionnels
- Tailwind CSS pour styling
- Drizzle ORM pour base de données

### Workflow de Développement
1. Modifications schéma → `shared/schema.ts`
2. Mise à jour storage → `server/storage.ts`
3. Routes API → `server/routes.ts`
4. Interface → `client/src/pages/`
5. Tests et validation

### Commandes Utiles
- `npm run dev` : Démarrage serveur développement
- `npm run db:push` : Synchronisation schéma base
- `npm run build` : Build production

## Notes Importantes

- ⚠️ OpenAI API key requise pour fonctionnalités IA
- ⚠️ PostgreSQL configuré via DATABASE_URL
- ⚠️ Secrets management via variables environnement
- ⚠️ Mobile-first design obligatoire

## Contact et Support

Application développée pour révolutionner l'industrie de la beauté avec des technologies de pointe et une expérience utilisateur exceptionnelle.

---
*Dernière mise à jour : Décembre 2024*