import { createClient } from '@supabase/supabase-js';
import { slugify } from '../utils/slugify';

const supabaseUrl = process.env.SUPABASE_URL || 'https://efkekkajoyfgtyqziohy.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVma2Vra2Fqb3lmZ3R5cXppb2h5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzI3ODI5NCwiZXhwIjoyMDcyODU0Mjk0fQ.KLfHaxzhEXfgq-gSTQXLWYG5emngLbrCBK6w7me78yw';
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Vérifier et corriger automatiquement les salons sans public_slug
 * Cette fonction est appelée au démarrage du serveur
 */
export async function ensureAllSalonsHavePublicSlug() {
  console.log('🔍 Vérification des public_slug manquants...');
  
  try {
    // Récupérer tous les salons sans public_slug ou avec public_slug vide
    const { data: salonsWithoutSlug, error } = await supabase
      .from('salons')
      .select('id, name, public_slug')
      .or('public_slug.is.null,public_slug.eq.')
      .eq('is_template', false);
      
    if (error) {
      console.error('❌ Erreur lors de la vérification des public_slug:', error);
      return;
    }
    
    if (!salonsWithoutSlug || salonsWithoutSlug.length === 0) {
      console.log('✅ Tous les salons ont un public_slug valide');
      return;
    }
    
    console.log(`📝 ${salonsWithoutSlug.length} salon(s) sans public_slug détecté(s)`);
    
    for (const salon of salonsWithoutSlug) {
      const newSlug = slugify(salon.name || 'salon-sans-nom');
      
      // Vérifier l'unicité du slug
      const { data: existingSalon } = await supabase
        .from('salons')
        .select('id')
        .eq('public_slug', newSlug)
        .single();
      
      let finalSlug = newSlug;
      if (existingSalon && existingSalon.id !== salon.id) {
        finalSlug = `${newSlug}-${salon.id.substring(0, 8)}`;
      }
      
      // Mettre à jour le salon
      const { error: updateError } = await supabase
        .from('salons')
        .update({ public_slug: finalSlug })
        .eq('id', salon.id);
        
      if (updateError) {
        console.error(`❌ Erreur lors de la mise à jour du salon ${salon.id}:`, updateError);
      } else {
        console.log(`✅ Public slug généré: "${salon.name}" → ${finalSlug}`);
      }
    }
    
    console.log('🎉 Vérification des public_slug terminée');
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration des public_slug:', error);
  }
}