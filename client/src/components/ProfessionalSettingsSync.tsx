import { useEffect } from 'react';
import { useProfessionalSettings } from '@/hooks/useProfessionalSettings';
import { useToast } from '@/hooks/use-toast';
import { Save, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfessionalSettingsSyncProps {
  children: React.ReactNode;
  autoSave?: boolean;
  settings?: Record<string, any>;
  onSettingsChange?: (settings: Record<string, any>) => void;
}

/**
 * Composant wrapper qui synchronise automatiquement les paramètres professionnels
 * avec la base de données PostgreSQL pour une sauvegarde persistante.
 */
export function ProfessionalSettingsSync({ 
  children, 
  autoSave = true, 
  settings,
  onSettingsChange 
}: ProfessionalSettingsSyncProps) {
  const { 
    settings: savedSettings, 
    saveSettings, 
    isSaving,
    saveError 
  } = useProfessionalSettings();
  const { toast } = useToast();

  // Charger les paramètres sauvegardés au démarrage
  useEffect(() => {
    if (savedSettings && onSettingsChange) {
      onSettingsChange(savedSettings);
    }
  }, [savedSettings, onSettingsChange]);

  // Auto-sauvegarde si activée
  useEffect(() => {
    if (autoSave && settings && Object.keys(settings).length > 0) {
      const timeoutId = setTimeout(() => {
        handleSave();
      }, 2000); // Sauvegarde après 2 secondes d'inactivité

      return () => clearTimeout(timeoutId);
    }
  }, [settings, autoSave]);

  // Gestion des erreurs de sauvegarde
  useEffect(() => {
    if (saveError) {
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder vos paramètres. Réessayez plus tard.",
        variant: "destructive",
      });
    }
  }, [saveError, toast]);

  const handleSave = () => {
    if (settings) {
      console.log('💾 Sauvegarde automatique des paramètres professionnels');
      saveSettings(settings);
    }
  };

  const handleManualSave = () => {
    handleSave();
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos modifications ont été enregistrées avec succès.",
      variant: "default",
    });
  };

  return (
    <div className="relative">
      {children}
      
      {/* Bouton de sauvegarde manuelle si auto-save désactivée */}
      {!autoSave && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button 
            onClick={handleManualSave}
            disabled={isSaving}
            className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
          >
            {isSaving ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </>
            )}
          </Button>
        </div>
      )}

      {/* Indicateur de sauvegarde automatique */}
      {autoSave && isSaving && (
        <div className="fixed top-4 right-4 z-50 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
          Sauvegarde en cours...
        </div>
      )}

      {/* Confirmation de sauvegarde */}
      {autoSave && !isSaving && settings && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center animate-fade-in-out">
          <Check className="w-4 h-4 mr-2" />
          Sauvegardé
        </div>
      )}
    </div>
  );
}