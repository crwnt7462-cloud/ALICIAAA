// Alias pour useProfessionals - permet d'unifier la source de vérité
// entre "Choisir un professionnel" et "Équipe" du salon
import useProfessionals, { type UseProfessionalsResult } from './useProfessionals';

/**
 * Hook unifié pour récupérer l'équipe d'un salon
 * Source unique de données pour :
 * - Page "Choisir un·e professionnel·le" (flux booking)
 * - Section "Équipe" (affichage salon)
 * 
 * @param salonId - ID du salon
 * @param options - Options optionnelles (pour futur usage)
 * @returns Même interface que useProfessionals
 */
export interface UseSalonTeamOptions {
  includeTags?: boolean; // Par défaut true (déjà inclus dans l'API)
}

export interface UseSalonTeamResult extends UseProfessionalsResult {}

export default function useSalonTeam(
  salonId: string | undefined, 
  options: UseSalonTeamOptions = { includeTags: true }
): UseSalonTeamResult {
  // Utiliser directement useProfessionals - même source de données
  return useProfessionals(salonId);
}

// Export du type Professional pour faciliter l'usage
export type { Professional } from './useStaffManagement';