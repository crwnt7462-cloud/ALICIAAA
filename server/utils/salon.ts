// @ts-nocheck
import { db } from '../db';
import { businessRegistrations, services } from '../../shared/schema';
import { eq } from 'drizzle-orm';

export const DEFAULT_SALON_ID = 'salon-default';
export const DEFAULT_SERVICE_ID = 'service-default';

export async function ensureDefaultSalonExists() {
  try {
    const rows = await db.select().from(businessRegistrations).where(eq(businessRegistrations.slug, DEFAULT_SALON_ID)).limit(1);
    if (rows.length === 0) {
      console.log('📋 Création salon par défaut...');
      
      // Générer un SIRET unique pour éviter les conflits
      const uniqueSiret = `11111111${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
      
      await db.insert(businessRegistrations).values({
        businessName: 'Salon Démo',
        slug: DEFAULT_SALON_ID,
        businessType: 'salon',
        siret: uniqueSiret,
        address: '123 Rue de la Beauté',
        city: 'Paris',
        postalCode: '75001',
        phone: '01 23 45 67 89',
        email: 'contact@salon-demo.fr',
        ownerFirstName: 'Demo',
        ownerLastName: 'Owner',
        legalForm: 'SARL',
        description: 'Salon créé automatiquement (fallback)',
        planType: 'basic-pro',
        status: 'approved'
      });
      console.log('✅ Salon par défaut créé');
    } else {
      console.log('✅ Salon par défaut déjà existant');
    }
    
    // Vérifier les services par défaut
    const svc = await db.select().from(services).where(eq(services.id, DEFAULT_SERVICE_ID)).limit(1);
    if (svc.length === 0) {
      console.log('📋 Création service par défaut...');
      await db.insert(services).values({
        id: Math.floor(Math.random() * 1000000), // ID numérique unique
        userId: DEFAULT_SALON_ID, // userId fait référence au salon propriétaire
        name: 'Coupe simple',
        description: 'Service de coupe basique',
        price: 20,
        duration: 30,
        categoryId: 'coupe',
        isActive: true
      });
      console.log('✅ Service par défaut créé');
    } else {
      console.log('✅ Service par défaut déjà existant');
    }
  } catch (error) {
    console.error('Erreur création salon/service par défaut:', error);
    // Ne pas bloquer même en cas d'erreur, permettre au système de continuer
  }
}

export async function resolveSalonSlugOrDefault(salonSlug?: string) {
  const wanted = salonSlug ?? DEFAULT_SALON_ID;
  const rows = await db.select().from(businessRegistrations).where(eq(businessRegistrations.slug, wanted)).limit(1);
  if (rows.length > 0) {
    console.log(`✅ Slug '${wanted}' trouvé directement`);
    return wanted;
  }
  
  // Utiliser le premier salon disponible comme fallback
  const fallbackSalon = await db.select().from(businessRegistrations).where(eq(businessRegistrations.status, 'approved')).limit(1);
  if (fallbackSalon.length > 0) {
    console.log(`🔄 Slug '${wanted}' non trouvé, fallback vers '${fallbackSalon[0].slug}'`);
    return fallbackSalon[0].slug;
  }
  
  // Si aucun salon n'existe, vérifier que le salon par défaut existe
  const def = await db.select().from(businessRegistrations).where(eq(businessRegistrations.slug, DEFAULT_SALON_ID)).limit(1);
  if (def.length === 0) {
    // Environnement corrompu -> on garantit l'existence
    await ensureDefaultSalonExists();
  }
  console.log(`🔄 Fallback vers salon par défaut: ${DEFAULT_SALON_ID}`);
  return DEFAULT_SALON_ID;
}