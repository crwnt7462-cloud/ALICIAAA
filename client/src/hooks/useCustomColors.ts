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
    
    // ✅ Nouvelles variables pour personnalisation avancée
    root.style.setProperty('--salon-currency-symbol', colors.primary);
    root.style.setProperty('--salon-selection-bg', `${colors.primary}10`);
    root.style.setProperty('--salon-selection-border', colors.primary);
    root.style.setProperty('--salon-selection-text', colors.primary);
    root.style.setProperty('--salon-selection-active-bg', `${colors.primary}20`);
    root.style.setProperty('--salon-price-highlight', colors.priceColor);
    
    console.log('✅ Variables CSS appliquées avec personnalisation avancée:', colors);
  };

  const resetCustomColors = () => {
    const root = document.documentElement;
    root.style.removeProperty('--salon-primary');
    root.style.removeProperty('--salon-accent');
    root.style.removeProperty('--salon-button-text');
    root.style.removeProperty('--salon-price-color');
    root.style.removeProperty('--salon-neon-frame');
    root.style.removeProperty('--salon-currency-symbol');
    root.style.removeProperty('--salon-selection-bg');
    root.style.removeProperty('--salon-selection-border');
    root.style.removeProperty('--salon-selection-text');
    root.style.removeProperty('--salon-selection-active-bg');
    root.style.removeProperty('--salon-price-highlight');
    
    setCustomColors(null);
  };

  return {
    customColors,
    loading,
    applyCustomColorsToDocument,
    resetCustomColors
  };
}