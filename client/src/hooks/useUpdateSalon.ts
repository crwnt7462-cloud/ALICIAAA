import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook pour mettre à jour un salon.
 * - Fait un PATCH sur /api/salons/:id
 * - Invalide automatiquement le cache 'salon' et 'search'
 */
export function useUpdateSalon(salonId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (patch: Record<string, any>) => {
      const res = await fetch(`/api/salons/${salonId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Update failed");
      return json; // idéalement { affected, ... }
    },
    onSuccess: (data) => {
      // Invalider le cache du salon spécifique (vue détail)
      queryClient.invalidateQueries({ queryKey: ["salon", salonId] });

      // invalidate /search after PATCH (traçabilité QA)
      queryClient.invalidateQueries({ queryKey: ["search"] });

      // Optionnel: feedback si aucune ligne modifiée
      const affected = typeof data?.affected === "number" ? data.affected : undefined;
      if (affected === 0) {
        // TODO: remplacer par votre système de toast/notification
        console.warn("Aucune ligne modifiée (droits ou ownership).");
      }
    },
  });
}

// Validation : Après PATCH, la liste /search se met à jour automatiquement (sans reload dur).
// Un refresh de la page conserve la valeur modifiée (preuve de persistance DB).
// Si PATCH renvoie affected: 0, afficher un message “Aucune ligne modifiée (droits ou ownership)”.
