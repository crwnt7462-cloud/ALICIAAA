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
- **UI/UX**: Tailwind CSS + shadcn/ui pour un design épuré, professionnel et mobile-first. Cohérence visuelle forte avec des designs unifiés (header, navigation à onglets, cartes, typographie). Le design est 100% glassmorphism sur toutes les interfaces, incluant les cartes statistiques, les boutons, et les interfaces IA.
- **Navigation**: BottomNavigation pour le menu principal, navigation intuitive avec accès rapide aux fonctionnalités essentielles.
- **Design Philosophy**: Minimaliste, professionnel, mobile-first, avec des éléments visuels cohérents tels que des dégradés violets/amber, des icônes Lucide et des interactions fluides.
- **Features**: IA Assistant (chat moderne, accès Premium Pro), système de mentions @, carrousel de galerie avec swipe, système d'avis avancé avec réponses salon, génération automatique de pages salon, gestion des profils d'équipe, affichage détaillé des services.
- **Authentication**: Système d'authentification Replit Auth intégré avec pages de connexion stylées selon la DA Avyento (glassmorphism, gradients violet/amber, animations premium).
- **Salon Templates**: Interface unifiée SalonPageTemplate avec personnalisation complète des couleurs (primary, accent, intensity, buttonText) appliquée dynamiquement aux boutons, onglets, et éléments d'interface. Tous les salons démo utilisent cette interface standardisée.

### Backend
- **Framework**: Express.js + TypeScript
- **Core Services**: AIService (optimisation planning, prédiction, chatbot), ConfirmationService (notifications auto emails/SMS, intégration calendriers), NotificationService (push notifications, alertes), ReceiptService (génération reçus/factures PDF).
- **Advanced Features**: Gestion complète des stocks avec alertes, messagerie directe premium, système d'acompte et créateur de pages personnalisées.
- **Security**: Authentification Replit Auth avec middleware isAuthenticated, création automatique de salons personnels pour chaque propriétaire authentifié.
- **Registration System**: Système d'inscription fonctionnel avec création automatique de salon personnel, validation des emails uniques.
- **Salon Management**: Routes dynamiques /salon/[slug] avec vérification de propriété, dashboard professionnel, gestion des pages salon personnalisées.

### Database
- **Type**: PostgreSQL avec Drizzle ORM
- **Schema**: Base de données étendue avec plus de 34 tables couvrant les utilisateurs, clients, rendez-vous, services, staff, avis, programmes de fidélité, promotions, notifications, listes d'attente, etc. L'application utilise uniquement des données réelles de la base de données.

### General Design Principles
- **Modularity**: Structure des dossiers claire (`client/`, `server/`, `shared/`, `assets/`).
- **Scalability**: Architecture conçue pour l'évolutivité avec des services bien définis.
- **User Experience**: Priorité à la fluidité de l'interface, aux interactions intuitives et à la clarté visuelle.
- **Code Quality**: TypeScript strict mode, API centralisée avec validation Zod, logging système intégré, ErrorBoundary, navigation typée, scripts madge, typecheck et pre-commit hooks.

## External Dependencies
- **AI**: OpenAI GPT-4o
- **Payment Gateway**: Stripe
- **Database**: PostgreSQL
- **Templating/Styling**: Tailwind CSS, shadcn/ui
- **Calendars**: Google Calendar, Outlook
- **Communication**: Services d'envoi d'emails et SMS

## Recent Changes (Août 2025)
- **MOBILE RESPONSIVENESS SALON CREATION (21/08/2025 01h08)**:
  * Page /salon-creation entièrement optimisée pour mobile avec design adaptatif
  * En-tête responsive : boutons compacts sur mobile avec texte masqué sur petits écrans
  * Header salon adapté : hauteur réduite mobile (h-24 vs h-32), images et boutons redimensionnés
  * Section informations salon : texte tronqué, layout flexible avec gap réduit mobile
  * Contenu onglets : padding adaptatif (p-3 mobile, p-6 desktop) et espacement responsive
  * Barre actions flottante : taille et position ajustées pour mobile (bottom-3 vs bottom-4)
  * Modal couleurs responsive : largeur 95% mobile, grid adaptatif, textes et boutons redimensionnés
  * Tous les éléments maintiennent la cohérence design glassmorphism Avyento sur mobile
- **SYSTÈME DE TEMPLATE SALON UNIFIÉ (21/08/2025 00h54)**:
  * Design actuel de la page salon enregistré comme template unique pour toutes les pages /salon/
  * Architecture modulaire avec AvyentoSalonTemplate.ts (configuration), SalonPageTemplate.tsx (composant), SalonPage.tsx (page)
  * Standardisation complète du design glassmorphism Avyento avec couleurs cohérentes
  * Système type-safe permettant personnalisation tout en maintenant cohérence visuelle
  * Documentation complète dans SALON_TEMPLATE_SYSTEM.md
  * Maintenance centralisée : modifier le template met à jour tous les salons automatiquement
- **FLOW DE RÉSERVATION OPTIMISÉ (21/08/2025 00h43)**:
  * Suppression de l'étape redondante de sélection de prestation
  * Accès direct aux créneaux horaires avec service pré-sélectionné
  * Page booking-success redesignée avec glassmorphism Avyento (fond gris/blanc, containers glass)
  * Navigation mobile retirée de la page de confirmation pour un design plus épuré
  * Confirmation que le système Stripe de paiement d'acompte reste pleinement opérationnel
- **SÉCURITÉ MAJEURE - Authentification Renforcée (18/08/2025 21h26)**:
  * Suppression du système de démo utilisateur automatique qui bypassait l'authentification
  * Protection complète de toutes les pages professionnelles (/dashboard, /planning, /services-management, /business-features, /clients, etc.)
  * Protection des pages clients (/avyento-booking, /avyento-account, /original-booking, /notifications, etc.)
  * Messages d'erreur élégants avec design glassmorphism pour accès non autorisé
  * Système d'authentification Replit Auth maintenant pleinement fonctionnel
  * Toutes les routes sensibles nécessitent maintenant une vraie authentification
- **Planning Pro Optimisé Créé**: Page `/planning` complètement repensée avec vue employés + vue d'ensemble, navigation jour/semaine/mois, analytics CA temps réel
- **Analytics Avancées Intégrées**: CA journalier/hebdomadaire/mensuel avec ticket moyen, objectifs et pourcentages d'atteinte en temps réel
- **Layout Pleine Largeur Desktop**: Planning sort du container mobile (`max-w-md`) pour utiliser toute la largeur desktop avec `lg:max-w-none lg:w-full`
- **Design Avyento Cohérent**: Émojis flottants diffus style page d'accueil, cards glassmorphism, animations motion fluides
- **Interface Unifiée Complétée**: Tous les salons démo utilisent SalonPageTemplate avec design Avyento cohérent
- **Personnalisation Couleurs Corrigée**: Boutons de réservation appliquent correctement les couleurs personnalisées avec effet glassmorphism
- **Responsive Mobile Optimisé**: Navigation responsive parfaite avec noms services sur une ligne et galerie catégorisée
- **Synchronisation Temps Réel**: Système de couleurs personnalisées synchronisé entre éditeur et pages publiques
- **Page Professional-Plans Redesignée**: Application complète du design Slay avec positionnement asymétrique des cartes (carte centrale surélevée, cartes latérales décalées), contenu adapté salon Avyento, couleurs violettes thématiques
- **Dashboard Peymen Intégré**: Dashboard professionnel avec design moderne financier (cartes blanches, fond gris, palette bleu/violet) selon maquette exacte
- **Objectif Mensuel Éditable**: Ajout d'un système d'édition pour l'objectif mensuel en euros avec basculement intuitif mode affichage/édition
- **Nettoyage Codebase Complet**: Suppression définitive des 6 pages obsolètes (/home, /pro/login, /client-login-modern, /pro-dashboard, /client-dashboard, /client-dashboard-new) et de leurs routes associées pour simplifier l'architecture
- **Navigation Mobile Optimisée (20/08/2025 19h12)**: Suppression définitive de la sidebar grise qui s'affichait sur mobile, remplacement par navigation MobileBottomNav avec 4 icônes (Accueil, Planning, Clients, Analytics), suppression de Messages, popup de planning optimisé mobile-friendly avec boutons tactiles et design amélioré