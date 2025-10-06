import { Router } from "express";
import { supabase as supabaseServiceRole } from "../db";

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

    // Récupérer les professionnels directement sans jointure bloquante sur salons
    // On évite la jointure salon car RLS peut bloquer
    const { data: professionnels, error: prosError } = await supabase
      .from('professionnels')
      .select(`
        id,
        nom,
        metier,
        note,
        avis,
        specialites,
        description,
        photo_url
      `)
      .eq('salon_id', salonId);

    if (prosError) {
      console.log('professionals_list_fetch_err', { salon_id: salonId, supabaseError: { code: prosError.code } });
      // RLS à corriger côté DB - Ne PAS remettre service_role
      return res.status(500).json({ error: 'Failed to fetch professionals' });
    }

    // 4. Mapper vers le format UI-ready
    const professionals: ProfessionalResponse[] = (professionnels || []).map(pro => ({
      id: pro.id.toString(),
      name: pro.nom,
      title: pro.metier || null,
      avatarUrl: pro.photo_url || null,
      rating: pro.note || null,
      reviewsCount: pro.avis || null,
      tags: pro.specialites && pro.specialites.length > 0 ? pro.specialites.slice(0, 3) : [],
      nextAvailable: null, // Phase 1: null, à implémenter plus tard avec appointments
      bio: pro.description || null
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
router.get('/api/salon/:salonId/services', async (req, res) => {
  try {
    const { salonId } = req.params;
    if (!salonId) return res.status(400).json({ ok: false, error: 'salonId requis' });
    const { data, error } = await supabaseServiceRole!.from('services').select('*').eq('salon_id', salonId);
    if (error) return res.status(500).json({ ok: false, error: error.message });
    return res.status(200).json({ ok: true, data });
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
});

export default router;
