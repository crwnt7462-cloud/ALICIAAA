# Application de Gestion de Salon de Beauté

Une application web complète pour la gestion de salons et instituts de beauté avec système de réservation en ligne simplifié.

## 🚀 Fonctionnalités principales

### Pour les professionnels
- **Tableau de bord** avec statistiques et métriques
- **Gestion des rendez-vous** avec planning interactif
- **Base clients** complète
- **Gestion des services** et tarifs
- **Système de partage** de liens de réservation

### Pour les clients
- **Réservation simplifiée** en une page
- **Paiement d'acompte** de 20€ intégré
- **Interface mobile** optimisée
- **Confirmation automatique**

## 🛠 Technologies utilisées

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Base de données**: PostgreSQL + Drizzle ORM
- **UI**: Tailwind CSS + shadcn/ui
- **Authentification**: Session-based auth
- **Requêtes**: TanStack Query

## 📦 Installation

### 1. Prérequis
```bash
Node.js 18+
PostgreSQL 14+
```

### 2. Installation des dépendances
```bash
npm install
```

### 3. Configuration de la base de données
```bash
# Créer le fichier .env
cp .env.example .env

# Ajouter votre URL de base de données
echo "DATABASE_URL=postgresql://user:password@localhost:5432/salon_beaute" >> .env

# Synchroniser le schéma
npm run db:push
```

### 4. Démarrage du serveur de développement
```bash
npm run dev
```

L'application sera accessible sur http://localhost:5000

## 🏗 Structure du projet

```
salon-beaute-app/
├── client/src/
│   ├── pages/          # Pages de l'application
│   ├── components/     # Composants réutilisables
│   ├── hooks/          # Hooks React personnalisés
│   └── lib/            # Utilitaires et configuration
├── server/             # API backend
├── shared/             # Types et schémas partagés
└── docs/              # Documentation
```

## 📱 Pages principales

### Interface professionnelle
- `/dashboard` - Tableau de bord principal
- `/planning` - Gestion des rendez-vous
- `/clients` - Base de données clientèle
- `/services` - Configuration des services
- `/share-booking` - Génération de liens de partage
- `/ai` - Fonctionnalités d'automatisation

### Interface client publique
- `/booking` - Réservation simplifiée
- `/book/[salon-name]` - Lien de réservation personnalisé

## 🔧 Scripts disponibles

```bash
# Développement
npm run dev

# Build production
npm run build

# Démarrage production
npm start

# Migration base de données
npm run db:push
```

## 🌟 Fonctionnalités clés

### Système de réservation simplifié
- Formulaire unique avec toutes les informations
- Sélection service, date et heure intuitive
- Acompte fixe de 20€
- Calcul automatique du reste à payer
- Confirmation immédiate

### Partage de liens personnalisés
- Génération automatique de liens
- Partage WhatsApp/SMS/Email
- Interface mobile optimisée
- Personnalisation du nom du salon

### Tableau de bord professionnel
- Statistiques en temps réel
- Graphiques de revenus
- Prochains rendez-vous
- Services populaires
- Performance de l'équipe

## 🔐 Sécurité

- Authentification par session
- Validation des données avec Zod
- Protection CSRF
- Variables d'environnement sécurisées

## 📊 Base de données

### Tables principales
- `users` - Comptes professionnels
- `clients` - Base clientèle
- `services` - Catalogue des prestations
- `appointments` - Rendez-vous
- `staff` - Équipe du salon

### Tables avancées
- `reviews` - Avis clients
- `loyalty_programs` - Programme de fidélité
- `waiting_list` - Liste d'attente

## 🚀 Déploiement

### Variables d'environnement requises
```env
DATABASE_URL=postgresql://...
NODE_ENV=production
SESSION_SECRET=your-secret-key
```

### Build et déploiement
```bash
npm run build
npm start
```

## 📝 Utilisation

### 1. Configuration initiale
1. Connectez-vous à l'interface admin
2. Ajoutez vos services et tarifs
3. Configurez votre équipe (optionnel)

### 2. Partage du lien de réservation
1. Allez dans "Partager" (menu du bas)
2. Personnalisez le nom de votre salon
3. Copiez le lien généré
4. Partagez-le avec vos clients

### 3. Gestion des réservations
1. Consultez le tableau de bord pour les statistiques
2. Utilisez le planning pour gérer les rendez-vous
3. Accédez à la base clients pour le suivi

## 🆘 Support

Pour toute question ou problème :
1. Vérifiez la documentation
2. Consultez les logs d'erreur
3. Vérifiez la configuration de la base de données

## 📄 Licence

Application développée pour les professionnels de la beauté.
Tous droits réservés.

---

*Application créée avec ❤️ pour simplifier la gestion des salons de beauté*