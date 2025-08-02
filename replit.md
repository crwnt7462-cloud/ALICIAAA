# Application de Gestion de Salon de Beauté

## Overview

Cette plateforme web vise à révolutionner la gestion des salons et instituts de beauté en offrant une solution complète et intuitive. Le projet intègre des fonctionnalités avancées pour la gestion des rendez-vous, de la clientèle, des services, et des stocks, le tout soutenu par une intelligence artificielle de pointe. L'objectif est d'améliorer l'expérience client, d'optimiser les opérations des professionnels de la beauté et de proposer des outils d'analyse prédictive et de marketing pour une différenciation concurrentielle maximale.

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
- **UI/UX**: Tailwind CSS + shadcn/ui pour un design épuré, professionnel et mobile-first. Les pages professionnelles et clients partagent une cohérence visuelle forte avec des designs unifiés (header, navigation à onglets, cartes, typographie).
- **Navigation**: BottomNavigation pour le menu principal, navigation intuitive avec accès rapide aux fonctionnalités essentielles.
- **Design Philosophy**: Minimaliste, professionnel, mobile-first, avec des éléments visuels cohérents tels que des dégradés violets/amber, des icônes Lucide et des interactions fluides.

### Backend
- **Framework**: Express.js + TypeScript
- **Core Services**: AIService (optimisation planning, prédiction, chatbot), ConfirmationService (notifications auto emails/SMS, intégration calendriers), NotificationService (push notifications, alertes), ReceiptService (génération reçus/factures PDF).
- **Advanced Features**: Système de mentions @ avec handles uniques, gestion complète des stocks avec alertes, messagerie directe premium, système d'acompte et créateur de pages personnalisées.
- **Security**: Authentification JWT PRO/CLIENT avec bcrypt et sessions sécurisées.

### Database
- **Type**: PostgreSQL avec Drizzle ORM
- **Schema**: Base de données étendue avec plus de 34 tables couvrant les utilisateurs, clients, rendez-vous, services, staff, avis, programmes de fidélité, promotions, notifications, listes d'attente, etc.

### General Design Principles
- **Modularity**: Structure des dossiers claire (`client/`, `server/`, `shared/`, `assets/`) pour une meilleure organisation et maintenabilité.
- **Scalability**: Architecture conçue pour l'évolutivité avec des services bien définis.
- **User Experience**: Priorité à la fluidité de l'interface, aux interactions intuitives et à la clarté visuelle.

## External Dependencies

- **AI**: OpenAI GPT-4o (pour l'intelligence artificielle, chatbot, prédictions, insights business) - ✅ CONNECTÉ ET OPÉRATIONNEL
- **Payment Gateway**: Stripe (pour la gestion des paiements, encaissement des acomptes, et abonnements)
- **Database**: PostgreSQL (base de données relationnelle)
- **Templating/Styling**: Tailwind CSS, shadcn/ui
- **Calendars**: Intégration avec Google Calendar et Outlook (pour les rappels et la synchronisation des rendez-vous)
- **Communication**: Services d'envoi d'emails et SMS (pour les confirmations et rappels automatiques)

## Recent Changes (Janvier 2025)

### ✅ Système de Synchronisation Automatique Complet
- **Date**: 01/08/2025 - 22:50
- **Changement**: Synchronisation automatique universelle entre éditeur et pages publiques
- **Impact**: Plus aucun problème de désynchronisation, toutes les modifications sont visibles en 2-4 secondes
- **Fonctionnalités**: Auto-refresh, synchronisation multi-systèmes, variables CSS automatiques, effets néon intégrés

### ✅ Effets Néon et Couleurs Personnalisées
- **Date**: 01/08/2025 - 22:50
- **Changement**: Système d'effets néon automatiques basé sur les couleurs de l'éditeur
- **Impact**: Interface visuellement distinctive avec animations personnalisées
- **Détails**: Animation neon-pulse, box-shadow colorés, support couleur neonFrame, forçage CSS infaillible

### ✅ Système de Sauvegarde Persistante PostgreSQL
- **Date**: 01/08/2025 - 23:30
- **Changement**: Implémentation complète du système de persistance en base de données
- **Impact**: Plus de perte de données au redémarrage, salon persistent définitivement
- **Fonctionnalités**: Table `salons` PostgreSQL, chargement automatique au démarrage, double sauvegarde (mémoire + BDD)

### ✅ Intégration OpenAI Complétée
- **Date**: 01/08/2025
- **Changement**: Connexion OpenAI GPT-4o entièrement fonctionnelle
- **Impact**: L'IA peut maintenant fournir des conseils personnalisés pour l'optimisation des salons
- **Fonctionnalités**: Chat intelligent, analyse prédictive, optimisation planning, conseils business

### ✅ Interface IA Améliorée
- **Date**: 01/08/2025
- **Changement**: Header fixe, scroll optimisé, bouton retour en haut
- **Impact**: Expérience utilisateur grandement améliorée pour les conversations longues
- **Détails**: Header reste visible en permanence, navigation fluide dans l'historique des messages

### ✅ Suppression Complète "Salon Excellence Paris" - PHASE FINALE
- **Date**: 02/08/2025 - 00:10  
- **Changement**: Éradication totale et définitive de TOUTES les références "Excellence" sans exception
- **Impact**: Plus aucune interférence, système 100% dédié aux salons personnalisés
- **Actions Complétées**: 
  * 40+ fichiers nettoyés systématiquement
  * Base PostgreSQL purgée
  * Routes et API corrigées
  * Tous placeholders remplacés par "Mon Salon de Beauté"
- **Résultat Final**: 0 occurrence "Excellence" dans tout le système, plateforme entièrement purifiée