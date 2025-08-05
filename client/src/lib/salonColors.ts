// Fonction utilitaire globale pour les couleurs glassmorphism des salons
// Centralise la logique des couleurs pour tous les boutons du site

export type SalonColorVariant = 'pink' | 'indigo' | 'amber' | 'rose' | 'emerald' | 'violet' | 'neutral';

// Mapping des salons vers leurs couleurs
export const getSalonColor = (salonId?: string): SalonColorVariant => {
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

// Fonction pour obtenir la classe CSS glassmorphism
export const getSalonButtonClass = (salonId?: string, variant: SalonColorVariant = getSalonColor(salonId)): string => {
  const classMap: Record<SalonColorVariant, string> = {
    pink: 'glass-button-pink',
    indigo: 'glass-button-indigo',
    amber: 'glass-button-amber',
    rose: 'glass-button-rose',
    emerald: 'glass-button-emerald',
    violet: 'glass-button-violet',
    neutral: 'glass-button-neutral'
  };
  return classMap[variant];
};

// Fonction pour obtenir une couleur aléatoire (pour les cas génériques)
export const getRandomSalonColor = (): SalonColorVariant => {
  const colors: SalonColorVariant[] = ['pink', 'indigo', 'amber', 'rose', 'emerald'];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Fonction pour les pages sans salon spécifique
export const getGenericGlassButton = (index: number = 0): string => {
  const colors: SalonColorVariant[] = ['violet', 'indigo', 'violet', 'rose', 'emerald'];
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
    violet: 'glass-card-violet',
    neutral: 'glass-card-neutral'
  };
  return classMap[variant];
};