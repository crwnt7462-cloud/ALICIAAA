export type Salon = {
  id: string;          // peut servir de slug
  name: string;
  description?: string | null;
  address?: string | null;
};

export type Service = {
  id: string;
  salonId: string;
  name: string;
  price: number;
};

export type Professional = {
  id: number;
  salon_id: string;
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  image?: string;
  specialties?: string | string[];
  color?: string;
  rating?: number;
  experience?: number;
  nextSlot?: string;
  bio?: string;
  is_active?: boolean;
  work_schedule?: any;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiError = { message: string; status?: number };