# Application de Gestion de Salon de Beauté

## Overview
Cette plateforme web vise à révolutionner la gestion des salons et instituts de beauté en offrant une solution complète et intuitive. Le projet intègre des fonctionnalités avancées pour la gestion des rendez-vous, de la clientèle, des services, et des stocks, le tout soutenu par une intelligence artificielle de pointe. L'objectif est d'améliorer l'expérience client, d'optimiser les opérations des professionnels de la beauté et de proposer des outils d'analyse prédictive et de marketing pour une différenciation concurrentielle maximale.

## User Preferences

### Style de Communication
- Interface en français
- Terminologie professionnelle beauté
- Design moderne et élégant
- Focus sur l'innovation technologique
- **NOUVEAU**: Application niveau SaaS professionnel avec code production-ready

### Objectifs Business
- Différenciation concurrentielle maximale
- Adoption technologies révolutionnaires
- Amélioration expérience client
- Optimisation opérationnelle
- **NOUVEAU**: Qualité SaaS entreprise avec architecture scalable

### Priorités Techniques
- Performance et fluidité interface
- Sécurité données clients
- Évolutivité architecture
- Intégration IA avancée
- **NOUVEAU**: Code propre, maintenable, sans debt technique
- **NOUVEAU**: Design system cohérent glassmorphism professionnel

## System Architecture

### Frontend
- **Framework**: React TypeScript + Vite
- **UI/UX**: Tailwind CSS + shadcn/ui avec design system production.css professionnel. Architecture nettoyée passée de 169 à 25 routes essentielles organisées par fonctionnalité.
- **Navigation**: Routing SaaS organisé: Auth → Dashboard → Features → Legal
- **Design Philosophy**: Glassmorphism professionnel avec variables CSS unifiées, animations fluides (fade-in, slide-up, scale-in), états visuels standardisés (loading, success, error). Design mobile-first responsive avec palette violette/amber cohérente.
- **Architecture**: App.saas.tsx propre avec imports organisés par catégories, suppression debt technique, routes SEO-optimized pour salons showcase.
- **IA Assistant**: Interface chat moderne avec AIAssistantFixed, résolution complète des erreurs React Hooks, accès Premium Pro (149€) fonctionnel.

### Backend
- **Framework**: Express.js + TypeScript
- **Core Services**: AIService (optimisation planning, prédiction, chatbot), ConfirmationService (notifications auto emails/SMS, intégration calendriers), NotificationService (push notifications, alertes), ReceiptService (génération reçus/factures PDF).
- **Advanced Features**: Système de mentions @ avec handles uniques, gestion complète des stocks avec alertes, messagerie directe premium, système d'acompte et créateur de pages personnalisées.
- **Security**: Authentification JWT PRO/CLIENT avec bcrypt et sessions sécurisées.

### Database
- **Type**: PostgreSQL avec Drizzle ORM
- **Schema**: Base de données étendue avec plus de 34 tables couvrant les utilisateurs, clients, rendez-vous, services, staff, avis, programmes de fidélité, promotions, notifications, listes d'attente, etc. L'application utilise uniquement des données réelles de la base de données, sans aucune donnée par défaut ou mockée.

### General Design Principles
- **Modularity**: Structure des dossiers claire (`client/`, `server/`, `shared/`, `assets/`) pour une meilleure organisation et maintenabilité.
- **Scalability**: Architecture conçue pour l'évolutivité avec des services bien définis.
- **User Experience**: Priorité à la fluidité de l'interface, aux interactions intuitives et à la clarté visuelle. Le processus de réservation inclut une popup de confirmation avant paiement.

## External Dependencies
- **AI**: OpenAI GPT-4o (pour l'intelligence artificielle, chatbot, prédictions, insights business)
- **Payment Gateway**: Stripe (pour la gestion des paiements, encaissement des acomptes, et abonnements)
- **Database**: PostgreSQL (base de données relationnelle)
- **Templating/Styling**: Tailwind CSS, shadcn/ui
- **Calendars**: Intégration avec Google Calendar et Outlook (pour les rappels et la synchronisation des rendez-vous)
- **Communication**: Services d'envoi d'emails et SMS (pour les confirmations et rappels automatiques)