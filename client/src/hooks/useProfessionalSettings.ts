import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface ProfessionalSettings {
  userId?: string;
  salonName?: string;
  salonDescription?: string;
  salonColors?: Record<string, string>;
  workingHours?: Record<string, any>;
  bookingSettings?: Record<string, any>;
  notificationSettings?: Record<string, any>;
  paymentSettings?: Record<string, any>;
  salonPhotos?: string[];
  socialLinks?: Record<string, string>;
  businessInfo?: Record<string, any>;
  customFields?: Record<string, any>;
}

export function useProfessionalSettings() {
  const queryClient = useQueryClient();

  // Récupérer les paramètres
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['/api/professional/settings'],
    select: (data) => data as ProfessionalSettings,
  });

  // Sauvegarder les paramètres
  const saveSettingsMutation = useMutation({
    mutationFn: async (newSettings: Partial<ProfessionalSettings>) => {
      return await apiRequest('POST', '/api/professional/settings', newSettings);
    },
    onSuccess: () => {
      // Invalider le cache pour recharger les données
      queryClient.invalidateQueries({ queryKey: ['/api/professional/settings'] });
      console.log('✅ Paramètres professionnels sauvegardés');
    },
    onError: (error) => {
      console.error('❌ Erreur sauvegarde paramètres:', error);
    }
  });

  return {
    settings: settings || {},
    isLoading,
    error,
    saveSettings: saveSettingsMutation.mutate,
    isSaving: saveSettingsMutation.isPending,
    saveError: saveSettingsMutation.error
  };
}