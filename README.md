# 🚀 Avyento - Plateforme de Réservation de Salons

Une application full-stack moderne pour la gestion et la réservation de salons de beauté, développée avec React, TypeScript, Express et Supabase.

## ✨ Fonctionnalités

- 🎨 **Interface moderne** avec design glassmorphism
- 📱 **Responsive design** optimisé mobile
- 🔐 **Authentification sécurisée** (professionnels et clients)
- 📅 **Gestion des rendez-vous** en temps réel
- 💳 **Paiements intégrés** avec Stripe
- 🏪 **Gestion multi-salons** avec pages personnalisées
- 📊 **Dashboard analytique** complet
- 🔄 **Synchronisation temps réel** avec Supabase

## 🛠️ Technologies

### Frontend
- **React 18** avec TypeScript
- **Vite** pour le build et dev server
- **Tailwind CSS** pour le styling
- **Framer Motion** pour les animations
- **Wouter** pour le routing
- **React Query** pour la gestion d'état

### Backend
- **Node.js** avec Express
- **TypeScript** pour la sécurité des types
- **Supabase** pour la base de données et auth
- **Stripe** pour les paiements
- **Drizzle ORM** pour les requêtes DB

## 🚀 Installation Rapide

### Prérequis
- **Node.js 18+** et npm
- **Git** pour cloner le repository
- **Compte Supabase** (gratuit)

### 1. Cloner le projet
```bash
git clone <votre-repo-url>
cd ALICIAAA
```

### 2. Setup automatique
```bash
npm run setup
```

### 3. Configuration des variables d'environnement
Copiez `.env.example` vers `.env` et configurez vos variables :

```bash
cp .env.example .env
```

Éditez le fichier `.env` avec vos vraies valeurs :
```env
# Configuration Supabase
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
SUPABASE_ANON_KEY=votre_anon_key

# Configuration Base de données
DATABASE_URL=postgresql://username:password@host:port/database

# Configuration serveur
PORT=3000
NODE_ENV=development

# Configuration CORS
FRONT_ORIGIN=http://localhost:5173
```

### 4. Démarrer l'application
```bash
# Démarrer le serveur et le client en parallèle
npm run dev:full

# Ou séparément :
npm run dev          # Serveur backend (port 3000)
npm run dev:client   # Client frontend (port 5173)
```

## 📋 Scripts Disponibles

### Installation
- `npm run setup` - Configuration automatique complète
- `npm run install-all` - Installation de toutes les dépendances

### Développement
- `npm run dev` - Serveur backend uniquement
- `npm run dev:client` - Client frontend uniquement  
- `npm run dev:full` - Serveur + client en parallèle

### Build
- `npm run build` - Build du serveur
- `npm run build:client` - Build du client
- `npm run build:full` - Build complet

### Tests et Qualité
- `npm run typecheck` - Vérification TypeScript serveur
- `npm run typecheck:client` - Vérification TypeScript client
- `npm run typecheck:full` - Vérification TypeScript complète
- `npm run lint` - Linting du code
- `npm run smoke` - Tests de fumée

## 🔧 Configuration Détaillée

### Supabase Setup
1. Créez un projet sur [supabase.com](https://supabase.com)
2. Récupérez votre URL et vos clés API
3. Configurez les variables dans `.env`

### Base de données
L'application utilise Supabase PostgreSQL. Les tables sont créées automatiquement au premier démarrage.

### Stripe (Optionnel)
Pour activer les paiements :
1. Créez un compte [Stripe](https://stripe.com)
2. Ajoutez vos clés dans `.env` :
```env
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

## 🌐 URLs de l'Application

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:3000
- **API Health Check** : http://localhost:3000/ping

## 📁 Structure du Projet

```
ALICIAAA/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Composants réutilisables
│   │   ├── pages/         # Pages de l'application
│   │   ├── hooks/         # Hooks personnalisés
│   │   ├── lib/           # Utilitaires et config
│   │   └── styles/        # Fichiers CSS
│   ├── package.json
│   └── vite.config.ts
├── server/                 # Backend Express
│   ├── routes/            # Routes API
│   ├── lib/               # Utilitaires serveur
│   ├── migrations/        # Migrations DB
│   └── index.ts           # Point d'entrée
├── .env.example           # Template variables d'environnement
├── setup.sh              # Script de setup automatique
├── package.json          # Dépendances et scripts
└── README.md             # Cette documentation
```

## 🐛 Résolution de Problèmes

### Problèmes CSS
Si les styles ne s'affichent pas correctement :
```bash
cd client
npm install
npm run build
```

### Problèmes de base de données
Vérifiez votre configuration Supabase :
```bash
npm run diag:supabase
```

### Ports occupés
```bash
# Libérer le port 3000
npm run port:free:3010
```

### Réinstallation complète
```bash
rm -rf node_modules client/node_modules
npm run install-all
```

## 🔒 Sécurité

- ✅ Variables sensibles dans `.env` (non commitées)
- ✅ Authentification JWT sécurisée
- ✅ Validation des données avec Zod
- ✅ CORS configuré correctement
- ✅ Rate limiting activé

## 📚 Documentation API

L'API est documentée avec des endpoints RESTful :

- `GET /api/salons` - Liste des salons
- `POST /api/auth/login` - Connexion
- `GET /api/booking-pages/:id` - Page de réservation
- `POST /api/appointments` - Créer un rendez-vous

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
1. Vérifiez cette documentation
2. Consultez les issues GitHub
3. Créez une nouvelle issue si nécessaire

---

**Développé avec ❤️ pour les professionnels de la beauté**