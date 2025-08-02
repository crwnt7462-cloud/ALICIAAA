#!/bin/bash
echo "🔄 Uniformisation MASSIVE des boutons Réserver..."

# Patterns à rechercher et remplacer
find client/src/pages -name "*.tsx" -type f | while read file; do
  if grep -q "Réserver" "$file"; then
    echo "Traitement: $file"
    
    # Remplacer tous les styles de boutons violet/gradient/orange par glassmorphism
    sed -i 's/className="bg-violet-600 text-white/className={`${getGenericGlassButton(0)} text-black/g' "$file"
    sed -i 's/className="bg-orange-500 text-white/className={`${getGenericGlassButton(1)} text-black/g' "$file"
    sed -i 's/className="bg-gradient-to-r from-violet-500 to-purple-600 text-white/className={`${getGenericGlassButton(2)} text-black/g' "$file"
    sed -i 's/className="bg-gradient-to-r from-amber-400 to-orange-500 text-white/className={`${getGenericGlassButton(3)} text-black/g' "$file"
    sed -i 's/className="bg-gradient-to-r from-purple-500 to-violet-600 text-white/className={`${getGenericGlassButton(4)} text-black/g' "$file"
    
    # Remplacer les autres styles communs
    sed -i 's/bg-violet-600 hover:bg-violet-700 text-white/className={`${getGenericGlassButton(0)} text-black/g' "$file"
    sed -i 's/bg-orange-500 hover:bg-orange-600 text-white/className={`${getGenericGlassButton(1)} text-black/g' "$file"
    
    # Nettoyage des doubles espaces
    sed -i 's/  / /g' "$file"
  fi
done

echo "✅ Conversion terminée!"
