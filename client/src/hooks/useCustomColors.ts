import { useState, useEffect } from 'react';

export interface CustomColors {
  primary: string;
  accent: string;
  buttonText: string;
  buttonClass: string;
  priceColor: string;
  neonFrame: string;
  intensity: number;
}

export function useCustomColors(salonSlug?: string) {
  const [customColors, setCustomColors] = useState<CustomColors | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!salonSlug) return;

    const loadCustomColors = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/salon/${salonSlug}/custom-colors`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.customColors) {
            setCustomColors(data.customColors);
            console.log('🎨 CustomColors chargées pour', salonSlug, ':', data.customColors);
            
            // Appliquer les couleurs au document
            applyCustomColorsToDocument(data.customColors);
          }
        }
      } catch (error) {
        console.error('❌ Erreur chargement customColors:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCustomColors();
  }, [salonSlug]);

  const applyCustomColorsToDocument = (colors: CustomColors) => {
    if (!colors) return;
    
    const root = document.documentElement;
    root.style.setProperty('--salon-primary', colors.primary);
    root.style.setProperty('--salon-accent', colors.accent);
    root.style.setProperty('--salon-button-text', colors.buttonText);
    root.style.setProperty('--salon-price-color', colors.priceColor);
    root.style.setProperty('--salon-neon-frame', colors.neonFrame);
    
    console.log('✅ Variables CSS appliquées:', colors);
  };

  const resetCustomColors = () => {
    const root = document.documentElement;
    root.style.removeProperty('--salon-primary');
    root.style.removeProperty('--salon-accent');
    root.style.removeProperty('--salon-button-text');
    root.style.removeProperty('--salon-price-color');
    root.style.removeProperty('--salon-neon-frame');
    
    setCustomColors(null);
  };

  return {
    customColors,
    loading,
    applyCustomColorsToDocument,
    resetCustomColors
  };
}