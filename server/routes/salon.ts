import { Router } from 'express';
import { serviceRole as supabase } from '../lib/clients/supabaseServer';

const router = Router();

// Route pour récupérer le salon de l'utilisateur connecté
router.get('/my-salon', async (req, res) => {
  try {
    // Créer le client Supabase directement
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return res.status(503).json({ error: 'Configuration Supabase manquante' });
    }
    
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    const session = req.session as any;
    if (!session || !session.user) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const { data: salon, error } = await supabase
      .from('salons')
      .select('*')
      .eq('owner_id', session.user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Aucun salon trouvé, retourner un salon vide
        return res.json({
          id: null,
          name: '',
          description: '',
          address: '',
          phone: '',
          email: '',
          website: '',
          owner_id: session.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
      console.error('Erreur récupération salon:', error);
      return res.status(500).json({ error: 'Erreur base de données' });
    }

    res.json(salon);
  } catch (error) {
    console.error('Erreur récupération salon:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Route /api/booking-pages/:id
router.get('/booking-pages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('📖 Récupération page salon (booking-pages):', id);
    
    // Logique simplifiée pour récupérer les données du salon
    // Essayer d'abord par public_slug, puis par ID
    let { data: salon, error } = await supabase
      .from('salons')
      .select('*')
      .eq('public_slug', id)
      .single();

    // Si pas trouvé par public_slug, essayer par ID
    if (error || !salon) {
      console.log('🔍 Salon non trouvé par public_slug, essai par ID:', id);
      const result = await supabase
        .from('salons')
        .select('*')
        .eq('id', id)
        .single();
      
      salon = result.data;
      error = result.error;
    }
      
    if (error || !salon) {
      return res.status(404).json({ error: 'Salon non trouvé' });
    }
    
    res.json({
      success: true,
      salon: {
        id: salon.id,
        name: salon.name,
        slug: salon.public_slug,
        description: salon.description,
        services: salon.service_categories || [],
        team: salon.team_members || []
      }
    });
  } catch (error) {
    console.error('Erreur récupération salon:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
