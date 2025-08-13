/**
 * Types centralisés pour l'application salon de beauté
 * Remplace tous les 'any' pour une meilleure robustesse TypeScript
 */

export interface Salon {
  id: string;
  slug: string;
  name: string;
  address: string;
  location: string | undefined; // Pour rétrocompatibilité avec exactOptionalPropertyTypes
  phone: string | undefined;
  email: string | undefined;
  description: string | undefined;
  photos: string[] | undefined;
  amenities: string[] | undefined;
  createdAt: string | undefined;
  updatedAt: string | undefined;
}

export interface Professional {
  id: string;
  salonId: string;
  name: string;
  email: string | undefined;
  phone: string | undefined;
  image: string | undefined;
  specialties: string | string[];
  rating: number | undefined;
  experience: number | undefined;
  nextSlot: string | undefined;
  bio: string | undefined;
  isActive: boolean | undefined;
  createdAt: string | undefined;
  updatedAt: string | undefined;
}

export interface Service {
  id: string;
  salonId: string;
  name: string;
  description: string | undefined;
  price: number;
  duration: number; // en minutes
  depositAmount: number | undefined;
  category: string | undefined;
  isActive: boolean | undefined;
  createdAt: string | undefined;
  updatedAt: string | undefined;
}

export interface Appointment {
  id: string;
  salonId: string;
  professionalId: string;
  serviceId: string;
  clientId: string | undefined;
  clientEmail: string;
  clientPhone: string | undefined;
  clientName: string | undefined;
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes: string | undefined;
  paymentStatus: 'pending' | 'partial' | 'completed' | 'refunded' | undefined;
  depositPaid: number | undefined;
  totalAmount: number | undefined;
  createdAt: string | undefined;
  updatedAt: string | undefined;
}

export interface TimeSlot {
  time: string;
  date: string;
  available?: boolean;
}

export interface DateInfo {
  date: string;
  day: string;
  full?: string;
  expanded?: boolean;
}

export interface BookingFormData {
  staffMember: string;
  phone: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  acceptCGU: boolean;
  saveCard: boolean;
}

export interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  cardholderName: string;
}

export interface PreBookingData {
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  selectedDate: string | undefined;
  selectedTime: string | undefined;
  professionalId: string | undefined;
  professionalName: string | undefined;
}

// Types pour les réponses API
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Types pour les erreurs
export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}

// Types pour les paramètres de requête
export interface GetProfessionalsParams {
  salonId: string;
  serviceId?: string;
  date?: string;
}

export interface GetServicesParams {
  salonId: string;
  categoryId?: string;
}

export interface GetAppointmentsParams {
  salonId?: string;
  professionalId?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  status?: Appointment['status'];
  page?: number;
  limit?: number;
}

export interface CreateAppointmentParams {
  salonId: string;
  professionalId: string;
  serviceId: string;
  clientEmail: string;
  clientPhone?: string;
  clientName?: string;
  startTime: string;
  notes?: string;
  paymentIntentId?: string;
}

// Type guards pour vérifier les types à runtime
export const isSalon = (obj: unknown): obj is Salon => {
  return typeof obj === 'object' && obj !== null && 
         typeof (obj as Salon).id === 'string' &&
         typeof (obj as Salon).slug === 'string' &&
         typeof (obj as Salon).name === 'string';
};

export const isProfessional = (obj: unknown): obj is Professional => {
  return typeof obj === 'object' && obj !== null && 
         typeof (obj as Professional).id === 'string' &&
         typeof (obj as Professional).salonId === 'string' &&
         typeof (obj as Professional).name === 'string';
};

export const isService = (obj: unknown): obj is Service => {
  return typeof obj === 'object' && obj !== null && 
         typeof (obj as Service).id === 'string' &&
         typeof (obj as Service).salonId === 'string' &&
         typeof (obj as Service).name === 'string' &&
         typeof (obj as Service).price === 'number';
};

export const isAppointment = (obj: unknown): obj is Appointment => {
  return typeof obj === 'object' && obj !== null && 
         typeof (obj as Appointment).id === 'string' &&
         typeof (obj as Appointment).salonId === 'string' &&
         typeof (obj as Appointment).professionalId === 'string' &&
         typeof (obj as Appointment).serviceId === 'string' &&
         typeof (obj as Appointment).startTime === 'string';
};