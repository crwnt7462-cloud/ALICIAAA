// Script pour nettoyer le localStorage des données d'anciens salons
console.log('🧹 Nettoyage du localStorage...');

// Supprimer toutes les clés liées aux salons
const keysToRemove = [];
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && (key.includes('salon') || key.includes('booking') || key.includes('selected'))) {
    keysToRemove.push(key);
  }
}

keysToRemove.forEach(key => {
  localStorage.removeItem(key);
  console.log(`🗑️ Supprimé: ${key}`);
});

console.log('✅ localStorage nettoyé !');
