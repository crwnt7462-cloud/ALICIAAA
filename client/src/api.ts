/**
 * Client API centralisé avec types stricts et validation Zod
 * Remplace tous les appels fetch dispersés dans l'application
 */

import { z } from 'zod';
import type { 
  Salon, 
  Professional, 
  Service, 
  Appointment,
  GetProfessionalsParams,
  GetServicesParams,
  GetAppointmentsParams,
  CreateAppointmentParams
} from './types';

// Schémas de validation Zod
const SalonSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(val => String(val)),
  slug: z.string(),
  name: z.string(),
  address: z.string(),
  city: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  description: z.string().optional(),
  photos: z.array(z.string()).optional(),
  professionals: z.array(z.any()).optional(),
  services: z.array(z.any()).optional(),
  amenities: z.array(z.string()).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const ProfessionalSchema = z.object({
  id: z.number(),
  salon_id: z.string(),
  name: z.string(),
  role: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  image: z.string().optional(),
});

const ServiceSchema = z.object({
  id: z.number(),
  salonId: z.string(),
  name: z.string(),
  price: z.number(),
  duration: z.number().optional(),
  description: z.string().optional(),
  depositAmount: z.number().optional(),
  updatedAt: z.string().optional(),
});

const AppointmentSchema = z.object({
  id: z.number(),
  salonId: z.string(),
  serviceId: z.number(),
  professionalId: z.number(),
  clientId: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  notes: z.string().optional(),
  paymentStatus: z.enum(['pending', 'partial', 'completed', 'refunded']).optional(),
  depositPaid: z.number().optional(),
  totalAmount: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// Classe d'erreur personnalisée pour les erreurs API
export class ApiRequestError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

// Fonction utilitaire pour les requêtes HTTP
async function apiRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const finalUrl = path.startsWith('/api') ? path : `/api${path}`;
  const fetchOptions: RequestInit = {
    method: typeof init.method === 'string' ? init.method : 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    body: init.body ?? null,
  };
  const res = await fetch(finalUrl, fetchOptions);

  let data: any = null;
  try { data = await res.json(); } catch {}

  if (!res.ok) {
    throw new Error((data?.error || data?.message) ?? res.statusText ?? 'Request failed');
  }
  return data as T;
}

// Fonctions API typées

/**
 * Récupère un salon par son slug
 */
export async function getSalonBySlug(slug: string): Promise<Salon> {
  if (!slug || typeof slug !== 'string') {
    throw new ApiRequestError(400, 'Slug is required and must be a string');
  }

  const data = await apiRequest<Salon>(`/api/salons/by-slug/${encodeURIComponent(slug)}`);
  
  // Validation avec Zod
  const validatedSalon = SalonSchema.parse(data);
  return validatedSalon;
}

/**
 * Récupère les professionnels d'un salon
 */
export async function getProfessionals(params: GetProfessionalsParams): Promise<Professional[]> {
  const { salonId, serviceId, date } = params;
  
  if (!salonId) {
    throw new ApiRequestError(400, 'salonId is required');
  }

  const searchParams = new URLSearchParams();
  if (serviceId) searchParams.set('serviceId', serviceId);
  if (date) searchParams.set('date', date);

  const url = `/api/salon/${encodeURIComponent(salonId)}/professionals?${searchParams.toString()}`;
  const data = await apiRequest<Professional[]>(url);
  
  // Validation avec Zod - chaque professionnel doit être valide
  const validatedProfessionals = z.array(ProfessionalSchema).parse(data);
  return validatedProfessionals;
}

/**
 * Récupère les services d'un salon
 */
export async function getServices(params: GetServicesParams): Promise<Service[]> {
  const { salonId, categoryId } = params;
  
  if (!salonId) {
    throw new ApiRequestError(400, 'salonId is required');
  }

  const searchParams = new URLSearchParams();
  if (categoryId) searchParams.set('categoryId', categoryId);

  const url = `/api/salon/${encodeURIComponent(salonId)}/services?${searchParams.toString()}`;
  const data = await apiRequest<Service[]>(url);
  
  // Validation avec Zod
  const validatedServices = z.array(ServiceSchema).parse(data);
  return validatedServices;
}

/**
 * Récupère les rendez-vous
 */
export async function getAppointments(params: GetAppointmentsParams = {}): Promise<Appointment[]> {
  const { 
    salonId, 
    professionalId, 
    date, 
    startDate, 
    endDate, 
    status, 
    page, 
    limit 
  } = params;

  const searchParams = new URLSearchParams();
  if (salonId) searchParams.set('salonId', salonId);
  if (professionalId) searchParams.set('professionalId', professionalId);
  if (date) searchParams.set('date', date);
  if (startDate) searchParams.set('startDate', startDate);
  if (endDate) searchParams.set('endDate', endDate);
  if (status) searchParams.set('status', status);
  if (page) searchParams.set('page', page.toString());
  if (limit) searchParams.set('limit', limit.toString());

  const url = `/api/appointments?${searchParams.toString()}`;
  const data = await apiRequest<Appointment[]>(url);
  
  // Validation avec Zod
  const validatedAppointments = z.array(AppointmentSchema).parse(data);
  return validatedAppointments;
}

/**
 * Crée un nouveau rendez-vous
 */
export async function createAppointment(params: CreateAppointmentParams): Promise<Appointment> {
  // Validation des paramètres requis
  if (!params.salonId) throw new ApiRequestError(400, 'salonId is required');
  if (!params.professionalId) throw new ApiRequestError(400, 'professionalId is required');
  if (!params.serviceId) throw new ApiRequestError(400, 'serviceId is required');
  if (!params.clientEmail) throw new ApiRequestError(400, 'clientEmail is required');
  if (!params.startTime) throw new ApiRequestError(400, 'startTime is required');

  const data = await apiRequest<Appointment>('/api/appointments', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  
  // Validation avec Zod
  const validatedAppointment = AppointmentSchema.parse(data);
  return validatedAppointment;
}

/**
 * Crée un Payment Intent pour Stripe
 */
export async function createPaymentIntent(params: {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
}): Promise<{ clientSecret: string; paymentIntentId: string }> {
  if (!params.amount || params.amount <= 0) {
    throw new ApiRequestError(400, 'amount must be positive');
  }

  const response = await apiRequest<{ client_secret: string; id: string }>('/api/create-payment-intent', {
    method: 'POST',
    body: JSON.stringify({
      amount: Math.round(params.amount * 100), // Convertir en centimes
      currency: params.currency || 'eur',
      metadata: params.metadata,
    }),
  });

  return {
    clientSecret: response.client_secret,
    paymentIntentId: response.id,
  };
}

// Export des schémas et utilitaires pour utilisation dans d'autres parties de l'app
export {
  SalonSchema,
  ProfessionalSchema,
  ServiceSchema,
  AppointmentSchema,
  apiRequest,
};