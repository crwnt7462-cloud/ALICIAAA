// Profil client global
export interface ClientData {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string; // <— nouveau champ optionnel
  // ... autres champs si besoin
}
// Politiques du salon
export type SalonPolicies = {
  cancellation: string;
  lateness: string;
  deposit: string;
  modification: string;
};

// Ce que le modal affiche (aperçu)
export interface BookingPreview {
  serviceName: string;
  servicePrice: number;
  date: string;            // "YYYY-MM-DD"
  time: string;            // "HH:mm"
  professionalName: string;
  salonName: string;
  salonLocation: string;
  salonPolicies: SalonPolicies;
  depositAmount?: number;  // optionnel mais souvent utile
}

// Ce que le flux de réservation se passe en interne (inclut les ids)
export interface PreBookingData extends BookingPreview {
  salonId: string;
  serviceId: number;
  professionalId?: number;
}
// ====== AJOUTS / AJUSTEMENTS GLOBAUX ======


export type Service = {
  id: number;
  salonId: string;
  name: string;
  price: number;
  duration: number;
  depositAmount?: number;
};

export type Salon = {
  id: string;
  name: string;
  address?: string;
  location?: string;
  // ...autres champs existants si besoin
};

export type Professional = {
  id: number;
  name: string;
  role?: string;
  availableToday?: boolean;
  // ...reste de tes props
};

export type NavigationMetadata = {
  salonSlug?: string | undefined;
  // ...autres métadonnées si besoin
};

export type BusinessSettings = {
  brandColor?: string;
  logoUrl?: string;
  welcomeMessage?: string;
  description?: string;
  showPrices?: boolean;
  showDuration?: boolean;
  enableInstantBooking?: boolean;
  businessName?: string;
};

export type PromoCode = {
  id: string | number;
  code: string;
  discountType: 'amount' | 'percent';
  discountValue: number;
  serviceIds?: number[];
  isActive?: boolean;
  startsAt?: string;
  endsAt?: string;
};