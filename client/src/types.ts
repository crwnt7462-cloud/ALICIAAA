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

export type ApiError = { message: string; status?: number };