#!/bin/bash

# 🗄️ Script de migration de base de données
# Ce script initialise la base de données avec les tables nécessaires

set -e

echo "🗄️ Initialisation de la base de données..."

# Vérifier que les variables d'environnement sont configurées
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL n'est pas définie"
    echo "   Veuillez configurer vos variables d'environnement dans .env"
    exit 1
fi

if [ -z "$SUPABASE_URL" ]; then
    echo "❌ SUPABASE_URL n'est pas définie"
    echo "   Veuillez configurer vos variables d'environnement dans .env"
    exit 1
fi

echo "✅ Variables d'environnement détectées"

# Vérifier la connexion à Supabase
echo "🔍 Test de connexion à Supabase..."
if curl -s -f "$SUPABASE_URL/rest/v1/" -H "apikey: $SUPABASE_ANON_KEY" > /dev/null; then
    echo "✅ Connexion Supabase réussie"
else
    echo "❌ Impossible de se connecter à Supabase"
    echo "   Vérifiez vos variables SUPABASE_URL et SUPABASE_ANON_KEY"
    exit 1
fi

# Exécuter les migrations Drizzle
echo "📊 Exécution des migrations..."
npm run db:push

echo "✅ Base de données initialisée avec succès"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Vérifiez vos tables dans le dashboard Supabase"
echo "2. Lancez l'application : npm run dev:full"
echo "3. Testez l'API : curl http://localhost:3000/ping"
