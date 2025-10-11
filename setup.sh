#!/bin/bash

# 🚀 Script de setup automatique pour Avyento
# Ce script configure l'environnement complet pour le développement

set -e

echo "🚀 Configuration d'Avyento..."

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js 18+ d'abord."
    exit 1
fi

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez installer npm d'abord."
    exit 1
fi

echo "✅ Node.js et npm détectés"

# Installer les dépendances du serveur
echo "📦 Installation des dépendances du serveur..."
cd server
npm install
cd ..

# Installer les dépendances du client
echo "📦 Installation des dépendances du client..."
cd client
npm install
cd ..

# Créer le fichier .env s'il n'existe pas
if [ ! -f .env ]; then
    echo "📝 Création du fichier .env..."
    cp .env.example .env
    echo "⚠️  IMPORTANT: Veuillez configurer vos variables d'environnement dans le fichier .env"
    echo "   - SUPABASE_URL"
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
    echo "   - SUPABASE_ANON_KEY"
    echo "   - DATABASE_URL"
else
    echo "✅ Fichier .env existe déjà"
fi

# Vérifier que les variables d'environnement sont configurées
echo "🔍 Vérification des variables d'environnement..."
source .env

if [ -z "$SUPABASE_URL" ] || [ "$SUPABASE_URL" = "https://your-project.supabase.co" ]; then
    echo "⚠️  SUPABASE_URL n'est pas configurée"
fi

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ] || [ "$SUPABASE_SERVICE_ROLE_KEY" = "your_service_role_key_here" ]; then
    echo "⚠️  SUPABASE_SERVICE_ROLE_KEY n'est pas configurée"
fi

if [ -z "$SUPABASE_ANON_KEY" ] || [ "$SUPABASE_ANON_KEY" = "your_anon_key_here" ]; then
    echo "⚠️  SUPABASE_ANON_KEY n'est pas configurée"
fi

if [ -z "$DATABASE_URL" ] || [ "$DATABASE_URL" = "postgresql://username:password@host:port/database" ]; then
    echo "⚠️  DATABASE_URL n'est pas configurée"
fi

echo ""
echo "🎉 Setup terminé !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Configurez vos variables d'environnement dans le fichier .env"
echo "2. Lancez le serveur : npm run dev"
echo "3. Lancez le client : cd client && npm run dev"
echo ""
echo "🔗 URLs :"
echo "   - Frontend: http://localhost:5173"
echo "   - Backend: http://localhost:3000"
echo ""
echo "📚 Documentation complète dans README.md"
