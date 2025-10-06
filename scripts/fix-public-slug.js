import { createClient } from '@supabase/supabase-js';

// Fonction pour slugifier un nom (copiée de server/utils/slugify.ts)
function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // accents
    .replace(/[^a-z0-9]+/g, '-') // non-alphanum
    .replace(/(^-|-$)+/g, '') // trim -
    .replace(/--+/g, '-'); // double -
}

// Configuration Supabase
const supabaseUrl = 'https://efkekkajoyfgtyqziohy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVma2Vra2Fqb3lmZ3R5cXppb2h5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzI3ODI5NCwiZXhwIjoyMDcyODU0Mjk0fQ.KLfHaxzhEXfgq-gSTQXLWYG5emngLbrCBK6w7me78yw';

const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction pour créer un slug
function createSlug(name) {
  return slugify(name);
}

async function fixPublicSlugs() {
  console.log('🔍 Recherche des salons sans public_slug...');
  
  // Récupérer tous les salons sans public_slug ou avec public_slug vide
  const { data: salons, error } = await supabase
    .from('salons')
    .select('id, name, public_slug')
    .or('public_slug.is.null,public_slug.eq.');
    
  if (error) {
    console.error('❌ Erreur lors de la récupération des salons:', error);
    return;
  }
  
  if (!salons || salons.length === 0) {
    console.log('✅ Tous les salons ont déjà un public_slug');
    return;
  }
  
  console.log(`📝 ${salons.length} salon(s) à corriger`);
  
  for (const salon of salons) {
    const newSlug = createSlug(salon.name || 'salon-sans-nom');
    console.log(`🔧 Mise à jour du salon "${salon.name}" avec le slug: ${newSlug}`);
    
    // Vérifier si ce slug existe déjà
    const { data: existingSalon } = await supabase
      .from('salons')
      .select('id')
      .eq('public_slug', newSlug)
      .single();
    
    let finalSlug = newSlug;
    if (existingSalon && existingSalon.id !== salon.id) {
      // Le slug existe déjà, ajouter un suffixe
      finalSlug = `${newSlug}-${salon.id.substring(0, 8)}`;
      console.log(`⚠️  Slug déjà existant, utilisation de: ${finalSlug}`);
    }
    
    // Mettre à jour le salon
    const { error: updateError } = await supabase
      .from('salons')
      .update({ public_slug: finalSlug })
      .eq('id', salon.id);
      
    if (updateError) {
      console.error(`❌ Erreur lors de la mise à jour du salon ${salon.id}:`, updateError);
    } else {
      console.log(`✅ Salon "${salon.name}" mis à jour avec le slug: ${finalSlug}`);
    }
  }
  
  console.log('🎉 Correction terminée !');
}

// Exécuter le script
fixPublicSlugs().catch(console.error);