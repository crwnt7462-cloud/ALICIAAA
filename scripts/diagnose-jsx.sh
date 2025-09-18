#!/bin/bash
set -euo pipefail
# Diagnostic JSX/TS client
# 1) npm run diag:jsx
# 2) Ouvre .cache/tsc.client.showconfig.json et vérifie lib/types
# 3) Inspecte .cache/tsc.client.files.txt et .cache/tsc.client.traceresolution.txt
# 4) Si .cache/jsx-overrides.txt non vide, supprime les surcharges puis relance typecheck

if [ ! -f tsconfig.client.json ]; then
  echo "tsconfig.client.json absent. Abandon." >&2
  exit 1
fi
mkdir -p .cache
npx tsc -p tsconfig.client.json --showConfig > .cache/tsc.client.showconfig.json
npx tsc -p tsconfig.client.json --listFiles > .cache/tsc.client.files.txt
npx tsc -p tsconfig.client.json --traceResolution > .cache/tsc.client.traceresolution.txt
grep -RIn "declare global[^{]*{[[:space:]]*namespace JSX" . > .cache/jsx-overrides.txt || true
echo "\nFichiers générés :"
echo "  .cache/tsc.client.showconfig.json"
echo "  .cache/tsc.client.files.txt"
echo "  .cache/tsc.client.traceresolution.txt"
echo "  .cache/jsx-overrides.txt"
echo "Prochaines étapes :"
echo "1) Vérifier lib/types dans showconfig. 2) Vérifier lib.dom.d.ts et @types/react dans files. 3) Vérifier jsx-runtime dans traceresolution. 4) Si jsx-overrides.txt non vide, supprimer les surcharges puis relancer typecheck."
