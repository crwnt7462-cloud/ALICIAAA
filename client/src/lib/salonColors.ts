// Fonction utilitaire globale pour les couleurs glassmorphism des salons
// Centralise la logique des couleurs pour tous les boutons du site

export type SalonColorVariant = 'pink' | 'indigo' | 'amber' | 'rose' | 'emerald' | 'neutral';

// Mapping des salons vers leurs couleurs (avec support des couleurs custom)
export const getSalonColor = (salonId?: string, customColors?: any): SalonColorVariant => {
  // Si des couleurs personnalisées sont définies, les utiliser
  if (customColors?.variant) {
    return customColors.variant as SalonColorVariant;
  }
  
  // Sinon, utiliser les couleurs par défaut
  const salonColors: Record<string, SalonColorVariant> = {
    'salon-excellence-paris': 'pink',
    'salon-moderne-republique': 'indigo', 
    'barbier-gentleman-marais': 'amber',
    'institut-beaute-saint-germain': 'rose',
    'nail-art-opera': 'rose',
    'spa-wellness-bastille': 'emerald',
    'beauty-lounge-montparnasse': 'indigo'
  };
  return salonColors[salonId || ''] || 'neutral';
};

// Fonction pour obtenir la classe CSS glassmorphism (avec support couleurs custom)
export const getSalonButtonClass = (salonId?: string, customColors?: any, variant?: SalonColorVariant): string => {
  const effectiveVariant = variant || getSalonColor(salonId, customColors);
  
  const classMap: Record<SalonColorVariant, string> = {
    pink: 'glass-button-pink',
    indigo: 'glass-button-indigo',
    amber: 'glass-button-amber',
    rose: 'glass-button-rose',
    emerald: 'glass-button-emerald',
    neutral: 'glass-button-neutral'
  };
  return classMap[effectiveVariant];
};

// Fonction pour obtenir le style inline custom (si défini)
export const getCustomButtonStyle = (customColors?: any): any => {
  if (!customColors?.primaryColor) return {};
  
  return {
    backgroundColor: customColors.primaryColor,
    borderColor: customColors.primaryColor,
    boxShadow: `0 8px 32px ${customColors.primaryColor}40`,
    color: 'white'
  };
};

// Fonction pour obtenir une couleur aléatoire (pour les cas génériques)
export const getRandomSalonColor = (): SalonColorVariant => {
  const colors: SalonColorVariant[] = ['pink', 'indigo', 'amber', 'rose', 'emerald'];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Fonction pour les pages sans salon spécifique
export const getGenericGlassButton = (index: number = 0): string => {
  const colors: SalonColorVariant[] = ['pink', 'indigo', 'amber', 'rose', 'emerald'];
  const colorIndex = index % colors.length;
  return getSalonButtonClass(undefined, colors[colorIndex]);
};

// Fonction pour cartes glassmorphism des salons
export const getSalonGlassCard = (salonId?: string): string => {
  const variant = getSalonColor(salonId);
  const classMap: Record<SalonColorVariant, string> = {
    pink: 'glass-card-pink',
    indigo: 'glass-card-indigo', 
    amber: 'glass-card-amber',
    rose: 'glass-card-rose',
    emerald: 'glass-card-emerald',
    neutral: 'glass-card-neutral'
  };
  return classMap[variant];
};