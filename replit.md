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

### ✅ Système Contrôle Intensité Couleurs Personnalisées
- **Date**: 02/08/2025
- **Changement**: Ajout contrôle précis d'intensité des couleurs dans l'éditeur salon
- **Impact**: Personnalisation avancée des boutons "Réserver" avec contrôle granulaire
- **Détails**: 
  - ✅ Slider d'intensité 10%-80% pour ajuster opacité couleur
  - ✅ Conversion automatique hex → RGB avec opacité dynamique
  - ✅ Fonction getCustomButtonStyle() pour génération style temps réel
  - ✅ Fallback intelligent vers glass-button-pink si pas de couleur personnalisée
  - ✅ Aperçu immédiat dans onglet "Couleurs" avec mise à jour temps réel
  - ✅ Application automatique sur tous les boutons de réservation
  - ✅ Interface utilisateur intuitive avec labels "Subtile" → "Intense"

### ✅ Conversion Glassmorphism Complète + Interfaces IA
- **Date**: 02/08/2025
- **Changement**: Conversion complète vers glassmorphism unifié pour TOUTES les interfaces
- **Impact**: Design cohérent sur navigation, accueil, client login ET interfaces IA
- **Détails**: 
  - ✅ Navigation menus : glassmorphism transparent avec texte noir
  - ✅ Page d'accueil : salons homepage avec redirections correctes
  - ✅ Client login : connexion fonctionnelle avec compte test
  - ✅ Interfaces IA converties :
    * AIProModern.tsx : menu historique + input glassmorphism
    * ChatGPTInterface.tsx : bulles de chat + zone saisie
    * AIAssistantSimple.tsx : header + messages + input
  - ✅ Texte noir visible sur tous les éléments glassmorphism
  - ✅ Cohérence visuelle totale de l'application

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