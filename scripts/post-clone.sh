#!/bin/bash

# 🔄 Script post-clone pour configuration automatique
# Ce script s'exécute automatiquement après un clone Git

set -e

echo "🔄 Configuration post-clone d'Avyento..."

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    echo "   Veuillez installer Node.js 18+ depuis https://nodejs.org"
    exit 1
fi

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    echo "   npm est généralement inclus avec Node.js"
    exit 1
fi

echo "✅ Node.js $(node --version) et npm $(npm --version) détectés"

# Rendre les scripts exécutables
chmod +x setup.sh
chmod +x scripts/migrate-db.sh

# Créer le fichier .env s'il n'existe pas
if [ ! -f .env ]; then
    echo "📝 Création du fichier .env..."
    cp .env.example .env
    echo "⚠️  IMPORTANT: Configurez vos variables d'environnement dans .env"
else
    echo "✅ Fichier .env existe déjà"
fi

echo ""
echo "🎉 Configuration post-clone terminée !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Configurez vos variables d'environnement dans .env"
echo "2. Lancez le setup : npm run setup"
echo "3. Démarrer l'application : npm run dev:full"
echo ""
echo "📚 Documentation complète dans README.md"
