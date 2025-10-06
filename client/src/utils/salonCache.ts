/**
 * Utilitaires pour gérer le cache des salons et éviter la pollution croisée
 */

/**
 * Nettoie tout le cache lié aux salons pour éviter la pollution entre utilisateurs
 */
export function clearSalonCache(): void {
  // Nettoyage du sessionStorage
  sessionStorage.removeItem('salonSlug');
  sessionStorage.removeItem('publicSalonPayload');
  sessionStorage.removeItem('currentSalonSlug');
  
  // Nettoyage du localStorage (données de réservation)
  localStorage.removeItem('selectedService');
  localStorage.removeItem('selectedProfessional');
  
  console.log('🧹 Cache salon nettoyé globalement');
}

/**
 * Nettoie spécifiquement le cache avant de naviguer vers /salon
 * pour un utilisateur connecté
 */
export function clearSalonCacheForAuthenticatedUser(): void {
  clearSalonCache();
  console.log('🧹 Cache salon nettoyé pour utilisateur connecté - navigation vers /salon');
}

/**
 * Nettoie le cache avant de naviguer vers un salon spécifique
 * @param salonSlug - Le slug du salon vers lequel on navigue
 */
export function clearSalonCacheForNavigation(salonSlug?: string): void {
  clearSalonCache();
  
  // Si on navigue vers un salon spécifique, on peut pré-remplir le cache
  if (salonSlug) {
    sessionStorage.setItem('salonSlug', salonSlug);
    console.log(`🧹 Cache salon nettoyé et préparé pour ${salonSlug}`);
  }
}