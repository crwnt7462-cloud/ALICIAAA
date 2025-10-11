import { Router } from 'express';
import { serviceRole as supabase } from '../lib/clients/supabaseServer';

const router = Router();

// Route /api/clients
router.get('/clients', async (req, res) => {
  try {
    const { salon_id } = req.query;
    console.log('👥 Récupération clients pour salon:', salon_id);
    
    if (!salon_id || salon_id === 'unknown') {
      return res.status(400).json({ error: 'salon_id requis' });
    }
    
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .eq('salon_id', salon_id);
      
    if (error) {
      console.error('Erreur récupération clients:', error);
      return res.status(500).json({ error: 'Erreur base de données' });
    }
    
    res.json({
      success: true,
      clients: clients || []
    });
  } catch (error) {
    console.error('Erreur récupération clients:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route /api/services
router.get('/services', async (req, res) => {
  try {
    const { salon_id } = req.query;
    console.log('🔧 Récupération services pour salon:', salon_id);
    
    if (!salon_id || salon_id === 'unknown') {
      return res.status(400).json({ error: 'salon_id requis' });
    }
    
    const { data: salon, error } = await supabase
      .from('salon')
      .select('service_categories')
      .eq('id', salon_id)
      .single();
      
    if (error || !salon) {
      return res.status(404).json({ error: 'Salon non trouvé' });
    }
    
    res.json({
      success: true,
      services: salon.service_categories || []
    });
  } catch (error) {
    console.error('Erreur récupération services:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;


