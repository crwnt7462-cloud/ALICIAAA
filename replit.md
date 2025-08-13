# Application de Gestion de Salon de Beauté

## Overview
Cette plateforme web vise à révolutionner la gestion des salons et instituts de beauté en offrant une solution complète et intuitive. Le projet intègre des fonctionnalités avancées pour la gestion des rendez-vous, de la clientèle, des services, et des stocks, le tout soutenu par une intelligence artificielle de pointe. L'objectif est d'améliorer l'expérience client, d'optimiser les opérations des professionnels de la beauté et de proposer des outils d'analyse prédictive et de marketing pour une différenciation concurrentielle maximale.

## Recent Changes
- ✅ REMPLACEMENT COMPLET LOGO AVYENTO : Nouveau logo violet moderne remplace tous les anciens logos "Rendly" 
- ✅ MISE À JOUR BRANDING COMPLÈTE : Toutes les références textuelles "Rendly" remplacées par "Avyento"
- ✅ COHÉRENCE VISUELLE : Logo unifié sur toutes les pages de connexion, inscription et interfaces
- ✅ CORRECTION CRITIQUE INSCRIPTION : Résolution erreur base de données colonne `user_id` manquante dans `client_accounts`
- ✅ INSCRIPTION CLIENT OPÉRATIONNELLE : Système création compte avec hash bcrypt fonctionnel
- ✅ PRIX DYNAMIQUES CORRIGÉS : Affichage prix professionnels réels dans processus paiement
- ✅ VALIDATION SYSTÈME : Tests inscription client et professionnel réussis

## User Preferences

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

## System Architecture

### Frontend
- **Framework**: React TypeScript + Vite
- **UI/UX**: Tailwind CSS + shadcn/ui pour un design épuré, professionnel et mobile-first. Cohérence visuelle forte avec des designs unifiés (header, navigation à onglets, cartes, typographie).
- **Navigation**: BottomNavigation pour le menu principal, navigation intuitive avec accès rapide aux fonctionnalités essentielles.
- **Design Philosophy**: Minimaliste, professionnel, mobile-first, avec des éléments visuels cohérents tels que des dégradés violets/amber, des icônes Lucide et des interactions fluides. Le design est 100% glassmorphism sur toutes les interfaces, incluant les cartes statistiques, les boutons, et les interfaces IA. Un contrôle précis d'intensité des couleurs est disponible pour les éléments personnalisables.
- **IA Assistant**: Interface chat moderne avec AIAssistantFixed, résolution complète des erreurs React Hooks, accès Premium Pro (149€) fonctionnel.

### Backend
- **Framework**: Express.js + TypeScript
- **Core Services**: AIService (optimisation planning, prédiction, chatbot), ConfirmationService (notifications auto emails/SMS, intégration calendriers), NotificationService (push notifications, alertes), ReceiptService (génération reçus/factures PDF).
- **Advanced Features**: Système de mentions @ avec handles uniques, gestion complète des stocks avec alertes, messagerie directe premium, système d'acompte et créateur de pages personnalisées.
- **Security**: Authentification JWT PRO/CLIENT avec bcrypt et sessions sécurisées.
- **Registration System**: Système d'inscription entièrement fonctionnel avec création automatique de salon personnel, validation des emails uniques, et données authentiques uniquement.

### Database
- **Type**: PostgreSQL avec Drizzle ORM
- **Schema**: Base de données étendue avec plus de 34 tables couvrant les utilisateurs, clients, rendez-vous, services, staff, avis, programmes de fidélité, promotions, notifications, listes d'attente, etc. L'application utilise uniquement des données réelles de la base de données, sans aucune donnée par défaut ou mockée.
- **Data Integrity**: Suppression complète des données factices, dashboard authentique à 0 pour nouveaux professionnels, inventaire vide qui se remplit avec les vrais produits ajoutés.

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