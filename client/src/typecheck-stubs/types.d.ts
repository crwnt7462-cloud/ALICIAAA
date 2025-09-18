// Types minimaux pour le typecheck ciblé
export type UUID = string;

export interface CustomColors {
  accent?: string;
  primary?: string;
  secondary?: string;
  background?: string;
  foreground?: string;
}

export interface Salon {
  id: UUID;
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  description?: string | null;
  customColors?: CustomColors | null;
  photos?: string[] | null;
}

export interface Service {
  id: UUID;
  salonId: UUID;
  name: string;
  price: number;
  duration: number; // requis dans ton projet
}

// Expose (facultatif) des constantes utilitaires si utilisées
export const DEFAULT_CUSTOM_COLORS: Required<CustomColors>;
export function normalizeCustomColors(
  input: Partial<CustomColors> | null | undefined
): Required<CustomColors>;
