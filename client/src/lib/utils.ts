import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formate un prix en euros avec la locale française
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR' 
  }).format(price);
}

/**
 * Formate une durée en minutes
 */
export function formatDuration(minutes: number): string {
  return `${minutes} min`;
}
