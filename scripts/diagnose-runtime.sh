#!/bin/bash
# AUDIT: Script de diagnostic runtime Vite
set -euo pipefail
CACHE_DIR=".cache"
mkdir -p "$CACHE_DIR"
# Vérifie le root id attendu par main.tsx
if [ -f "client/index.html" ]; then
  grep -Eo '<div id="[^"]+"' client/index.html > "$CACHE_DIR/runtime.notes.txt"
else
  echo "client/index.html introuvable" > "$CACHE_DIR/runtime.notes.txt"
fi
# Dump vite.config.* (alias, plugins)
if ls vite.config.* 1> /dev/null 2>&1; then
  cat vite.config.* > "$CACHE_DIR/vite.config.dump.txt"
else
  echo "vite.config introuvable" > "$CACHE_DIR/vite.config.dump.txt"
fi
# Build dev (sans affecter la prod)
(cd client && npx vite build --mode development) > "$CACHE_DIR/vite.build.log" 2>&1 || true
echo "\nFichiers générés :"
echo "  $CACHE_DIR/runtime.notes.txt"
echo "  $CACHE_DIR/vite.config.dump.txt"
echo "  $CACHE_DIR/vite.build.log"
echo "\nOuvre la console navigateur sur http://localhost:5173 et copie la 1ère erreur + stack."
