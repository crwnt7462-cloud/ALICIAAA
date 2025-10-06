import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook pour mettre à jour un salon.
 * - Fait un POST sur /api/salon/update
 * - Invalide automatiquement le cache 'salon' et 'search'
 */
export function useUpdateSalon(salonId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (salonData: Record<string, any>) => {
      // Convert editingData format to the expected format for /api/salon/update
      const payload = {
        salonId,
        salonData: {
          nom: salonData.name || '',
          description: salonData.description || '',
          adresse: salonData.businessAddress || '',
          telephone: salonData.businessPhone || '',
          horaires: salonData.horaires || '',
          facebook: salonData.facebook || '',
          instagram: salonData.instagram || '',
          tiktok: salonData.tiktok || '',
          customColors: salonData.customColors || null
        },
        serviceCategories: salonData.serviceCategories || [],
        teamMembers: salonData.teamMembers || [],
        coverImage: salonData.coverImageUrl || '',
        galleryImages: salonData.galleryImages || []
      };

      const res = await fetch('/api/salon/update', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Update failed");
      return json;
    },
    onSuccess: (data) => {
      // Invalider le cache du salon spécifique (vue détail)
      queryClient.invalidateQueries({ queryKey: ["salon", salonId] });

      // invalidate /search after POST (traçabilité QA)
      queryClient.invalidateQueries({ queryKey: ["search"] });

      // Optionnel: feedback si aucune ligne modifiée
      const affected = typeof data?.affected === "number" ? data.affected : undefined;
      if (affected === 0) {
        // TODO: remplacer par votre système de toast/notification
        console.warn("Aucune ligne modifiée (droits ou ownership).");
      }
    },
  });
}// Validation : Après PATCH, la liste /search se met à jour automatiquement (sans reload dur).
// Un refresh de la page conserve la valeur modifiée (preuve de persistance DB).
// Si PATCH renvoie affected: 0, afficher un message “Aucune ligne modifiée (droits ou ownership)”.
