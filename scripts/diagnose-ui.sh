#!/bin/bash
set -euo pipefail
for f in client/src/components/ui/button.tsx client/src/components/ui/badge.tsx client/src/components/ui/card.tsx; do
  if [ -f "$f" ]; then
    echo "==== $f ===="
    head -40 "$f"
    echo
  fi
done
