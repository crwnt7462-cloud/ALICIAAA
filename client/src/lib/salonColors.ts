// Fonction utilitaire globale pour les couleurs glassmorphism des salons
// Centralise la logique des couleurs pour tous les boutons du site

export type SalonColorVariant = 'pink' | 'indigo' | 'amber' | 'rose' | 'emerald' | 'neutral';

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
    neutral: 'glass-button-neutral'
  };
  return classMap[variant];
};

// Fonction pour obtenir une couleur aléatoire (pour les cas génériques)
export const getRandomSalonColor = (): SalonColorVariant => {
  const colors: SalonColorVariant[] = ['pink', 'indigo', 'amber', 'rose', 'emerald'];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Fonction pour les pages sans salon spécifique - Style glassmorphism uniforme
export const getGenericGlassButton = (index: number = 0): string => {
  return 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300';
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