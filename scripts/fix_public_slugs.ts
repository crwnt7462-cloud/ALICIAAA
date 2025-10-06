import { supabase } from '../server/db';
import { slugify } from '../server/utils/slugify';

async function fixAllSalonSlugs() {
  const { data: salons, error } = await supabase
    .from('salons')
    .select('id, name');
  if (error) {
    console.error('Erreur récupération salons:', error);
    process.exit(1);
  }
  for (const salon of salons) {
    const newSlug = slugify(salon.name || '');
    if (!newSlug) continue;
    const { error: updateErr } = await supabase
      .from('salons')
      .update({ public_slug: newSlug })
      .eq('id', salon.id);
    if (updateErr) {
      console.error(`Erreur update salon ${salon.id}:`, updateErr.message);
    } else {
      console.log(`Salon ${salon.id}: slug corrigé -> ${newSlug}`);
    }
  }
  console.log('Correction des slugs terminée.');
}

fixAllSalonSlugs();
