import { Router } from "express";
import { createClient } from '@supabase/supabase-js';
import { serviceRole as supabaseServiceRole } from "../lib/clients/supabaseServer";

console.log('🔍 supabaseServiceRole importé:', !!supabaseServiceRole);

const router = Router();

// Route publique : GET /api/public/professionnels (ancienne route - à conserver pour rétrocompatibilité)
router.get('/api/public/professionnels', async (req, res) => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Sélectionne les professionnels (membres) de tous les salons
    const selectFields = [
      'id', 'nom', 'metier', 'note', 'avis', 'specialites', 'prochaine_dispo', 'description', 'photo_url', 'salon_id'
    ];
    const { data, error } = await supabase
      .from('professionnels')
      .select(selectFields.join(', '));
    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
    return res.status(200).json({ success: true, professionnels: data });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ success: false, error: errorMessage });
  }
});

// Nouvelle route : GET /api/salons/:salonId/professionals
router.get('/api/salons/:salonId/professionals', async (req, res) => {
  const { salonId } = req.params;

  // Validation du salonId (UUID)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(salonId)) {
    console.log('professionals_list_fetch_err', { salon_id: salonId, error: 'invalid_uuid' });
    return res.status(400).json({ error: 'Invalid salon ID format' });
  }

  try {
    // Utiliser le client Supabase public pour les données non-sensibles
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Récupérer les professionnels depuis la table salons (team_members)
    const { data: salon, error: salonError } = await supabase
      .from('salons')
      .select('team_members')
      .eq('id', salonId)
      .single();

    if (salonError) {
      console.log('professionals_list_fetch_err', { salon_id: salonId, supabaseError: { code: salonError.code } });
      return res.status(500).json({ error: 'Failed to fetch salon' });
    }

    const professionnels = salon?.team_members || [];

    // 4. Mapper vers le format UI-ready
    const professionals: ProfessionalResponse[] = (professionnels || []).map(pro => ({
      id: pro.id.toString(),
      name: pro.name || 'Professionnel',
      title: pro.role || 'Professionnel',
      avatarUrl: pro.avatar || null,
      rating: pro.rating || null,
      reviewsCount: pro.reviewsCount || null,
      tags: pro.specialties && pro.specialties.length > 0 ? pro.specialties.slice(0, 3) : [],
      nextAvailable: pro.nextSlot || null,
      bio: pro.bio || null
    }));

    // Log et réponse
    console.log('professionals_list_fetch_ok', { salon_id: salonId, count: professionals.length });
    
    res.set('Cache-Control', 's-maxage=30, stale-while-revalidate=120');
    return res.status(200).json(professionals);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.log('professionals_list_fetch_err', { salon_id: salonId, error: errorMessage });
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/salon/:salonId/services (exemple, adapte le chemin si besoin)
router.get('/salon/:salonId/services', async (req, res) => {
  try {
    const { salonId } = req.params;
    if (!salonId) return res.status(400).json({ ok: false, error: 'salonId requis' });
    
    // Créer le client Supabase directement
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return res.status(503).json({ ok: false, error: 'Configuration Supabase manquante' });
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.from('services').select('*').eq('salon_id', salonId);
    if (error) return res.status(500).json({ ok: false, error: error.message });
    return res.status(200).json({ ok: true, data });
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
});

export default router;
