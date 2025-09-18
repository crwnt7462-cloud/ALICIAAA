// Signatures minimalistes des appels utilisés par le hook
import type { Salon } from "@/types";
export declare function updateSalon(
  salonId: string, payload: Partial<Salon>
): Promise<Salon>;
export declare function fetchSalon(
  salonId: string
): Promise<Salon>;
