import { z } from 'zod';

/**
 * DEV ONLY: Upsert salon_services links for a salon (idempotent, transaction, service_role)
 * Usage: route DEV-only, jamais exposée en prod/public
 */
export const devSeedSalonServicesSchema = z.object({
  salonId: z.string().uuid(),
  links: z.array(z.object({
    serviceId: z.number().int().positive(),
    price: z.number().positive(),
    duration: z.number().int().positive(),
  })).min(1)
});

export async function devSeedSalonServices({ salonId, links }: z.infer<typeof devSeedSalonServicesSchema>) {
  const start = Date.now();
  if (!process.env.ENABLE_DEV_SEED || process.env.ENABLE_DEV_SEED !== 'true') {
    throw Object.assign(new Error('DEV seed route disabled'), { status: 404 });
  }
  if (process.env.NODE_ENV === 'production') {
    throw Object.assign(new Error('Not available in production'), { status: 404 });
  }
  if (!supabaseServiceRole) throw Object.assign(new Error('Service role client not initialized'), { status: 500 });
  // Vérifier existence salon
  const { data: salon, error: salonErr } = await supabaseServiceRole
    .from('salons')
    .select('id')
    .eq('id', salonId)
    .single();
  if (salonErr || !salon) throw Object.assign(new Error('Salon not found'), { status: 400 });

  // Vérifier existence de chaque serviceId
  const serviceIds = links.map(l => l.serviceId);
  const { data: foundServices, error: svcErr } = await supabaseServiceRole
    .from('services')
    .select('id')
    .in('id', serviceIds);
  if (svcErr) throw Object.assign(new Error('Service lookup failed'), { status: 500 });
  const foundIds = (foundServices || []).map(s => s.id);
  for (const l of links) {
    if (!foundIds.includes(l.serviceId)) throw Object.assign(new Error(`Service ${l.serviceId} not found`), { status: 400 });
  }

  // Upsert chaque lien (clé unique salon_id+service_id)
  let upserted = 0;
  for (const l of links) {
    // Vérifier si la liaison existe déjà
    const { data: existing, error: existErr } = await supabaseServiceRole
      .from('salon_services')
      .select('id, custom_price, custom_duration')
      .eq('salon_id', salonId)
      .eq('service_id', l.serviceId)
      .single();
    if (existErr && existErr.code !== 'PGRST116') throw existErr;
    if (!existing) {
      // Insert
      const { error: insErr } = await supabaseServiceRole
        .from('salon_services')
        .insert([{ salon_id: salonId, service_id: l.serviceId, custom_price: l.price, custom_duration: l.duration, active: true }]);
      if (insErr) throw insErr;
      upserted++;
    } else {
      // Update si nécessaire
      if (existing.custom_price !== l.price || existing.custom_duration !== l.duration) {
        const { error: updErr } = await supabaseServiceRole
          .from('salon_services')
          .update({ custom_price: l.price, custom_duration: l.duration, active: true })
          .eq('id', existing.id);
        if (updErr) throw updErr;
        upserted++;
      }
    }
  }
  const durationMs = Date.now() - start;
  console.log('seed_success', { salon_id: salonId, count: upserted, duration_ms: durationMs });
  return { success: true, upserted };
}
/**
 * Service de gestion des données publiques sécurisées
 * 
 * SÉCURITÉ:
 * - Utilise UNIQUEMENT la vue effective_services_public pour l'accès anonyme
 * - Jamais d'accès direct aux tables pour les endpoints publics
 * - Client anon pour lectures publiques, service role pour admin uniquement
 */

import { supabasePublic, supabase as supabaseServiceRole } from '../lib/clients/supabaseServer';

export interface PublicSalonService {
  salon_id: string;
  salon_name: string;
  business_email?: string;
  business_phone?: string;
  business_address?: string;
  public_slug: string;
  service_id: string | number;
  service_name: string;
  effective_price: number;
  effective_duration: number;
  category?: string;
}

export interface PublicSalonData {
  salon_id: string;
  salon_name: string;
  public_slug: string;
  services: {
    serviceId: string;
    name: string;
    price: number;
    duration: number;
    category?: string;
  }[];
  business_info?: {
    email?: string;
    phone?: string;
    address?: string;
  };
}

/**
 * Récupère les services publics d'un salon via la vue sécurisée
 * SÉCURITÉ: Utilise client anon + vue RLS, pas d'accès direct aux tables
 */
export async function getPublicSalonServices(salonId: string): Promise<PublicSalonData | null> {
  const startTime = Date.now();
  
  console.log('public_salon_services_fetch_start', { 
    salon_id: salonId,
    source: 'secure_view',
    client: 'anon' 
  });

  try {
    if (!supabasePublic) {
      throw new Error('Public Supabase client not initialized');
    }

    // SÉCURITÉ: Lecture via vue sécurisée uniquement, jamais les tables directes
    const { data, error } = await supabasePublic
      .from('effective_services_public')
      .select('*')
      .eq('salon_id', salonId);

    const responseTime = Date.now() - startTime;

    if (error) {
      console.error('public_salon_services_fetch_error', { 
        salon_id: salonId,
        error: error.message,
        code: error.code,
        response_time: responseTime
      });
      return null;
    }

    if (!data || data.length === 0) {
      console.log('public_salon_services_fetch_empty', { 
        salon_id: salonId,
        response_time: responseTime,
        hint: 'Salon not public or no services configured'
      });
      return null;
    }

    // Transformer les données de la vue en format API
    const firstRow = data[0];
    const salonData: PublicSalonData = {
      salon_id: firstRow.salon_id,
      salon_name: firstRow.salon_name,
      public_slug: firstRow.public_slug,
      services: data.map(row => ({
        serviceId: row.service_id.toString(),
        name: row.service_name,
        price: row.effective_price,
        duration: row.effective_duration,
        category: row.category
      })),
      business_info: {
        email: firstRow.business_email,
        phone: firstRow.business_phone,
        address: firstRow.business_address
      }
    };

    console.log('public_salon_services_fetch_success', { 
      salon_id: salonId,
      services_count: salonData.services.length,
      response_time: responseTime,
      source: 'secure_view'
    });

    return salonData;

  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error('public_salon_services_fetch_exception', { 
      salon_id: salonId,
      error: error instanceof Error ? error.message : 'Unknown error',
      response_time: responseTime
    });
    return null;
  }
}

/**
 * Liste tous les salons publics via la vue sécurisée
 * SÉCURITÉ: Accès anonyme via vue uniquement
 */
export async function getPublicSalons(limit = 50): Promise<PublicSalonData[]> {
  const startTime = Date.now();
  
  console.log('public_salons_list_start', { 
    limit,
    source: 'secure_view',
    client: 'anon'
  });

  try {
    if (!supabasePublic) {
      throw new Error('Public Supabase client not initialized');
    }

    // SÉCURITÉ: Lecture via vue sécurisée uniquement
    const { data, error } = await supabasePublic
      .from('effective_services_public')
      .select('*')
      .limit(limit * 10); // Marge pour groupement

    const responseTime = Date.now() - startTime;

    if (error) {
      console.error('public_salons_list_error', { 
        error: error.message,
        response_time: responseTime
      });
      return [];
    }

    if (!data || data.length === 0) {
      console.log('public_salons_list_empty', { 
        response_time: responseTime
      });
      return [];
    }

    // Grouper par salon
    const salonMap = new Map<string, PublicSalonData>();
    
    data.forEach(row => {
      const salonId = row.salon_id;
      
      if (!salonMap.has(salonId)) {
        salonMap.set(salonId, {
          salon_id: salonId,
          salon_name: row.salon_name,
          public_slug: row.public_slug,
          services: [],
          business_info: {
            email: row.business_email,
            phone: row.business_phone,
            address: row.business_address
          }
        });
      }

      const salon = salonMap.get(salonId)!;
      salon.services.push({
        serviceId: row.service_id.toString(),
        name: row.service_name,
        price: row.effective_price,
        duration: row.effective_duration,
        category: row.category
      });
    });

    const salons = Array.from(salonMap.values()).slice(0, limit);

    console.log('public_salons_list_success', { 
      salons_count: salons.length,
      total_services: data.length,
      response_time: responseTime,
      source: 'secure_view'
    });

    return salons;

  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error('public_salons_list_exception', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      response_time: responseTime
    });
    return [];
  }
}

/**
 * ADMIN ONLY: Accès direct aux tables avec service role
 * USAGE: Dashboard, gestion interne, pas d'exposition publique
 */
export async function getAdminSalonServices(salonId: string) {
  console.log('admin_salon_services_access', { 
    salon_id: salonId,
    client: 'service_role',
    access_level: 'admin'
  });

  if (!supabaseServiceRole) {
    throw new Error('Service role client not initialized');
  }

  // Accès direct aux tables avec service role (admin uniquement)
  const { data, error } = await supabaseServiceRole
    .from('salon_services')
    .select(`
      service_id,
      price,
      duration,
      active,
      services(name, price, duration, category)
    `)
    .eq('salon_id', salonId);

  if (error) {
    console.error('admin_salon_services_error', { 
      salon_id: salonId,
      error: error.message 
    });
    throw error;
  }

  return data;
}

/**
 * USAGE GUIDELINES:
 * 
 * ✅ Pour endpoints publics (anonymes):
 * - getPublicSalonServices()
 * - getPublicSalons()
 * 
 * ❌ JAMAIS pour endpoints publics:
 * - getAdminSalonServices() 
 * - Accès direct aux tables
 * - Client service role
 * 
 * ✅ Pour dashboard/admin:
 * - getAdminSalonServices()
 * - Client service role OK
 */