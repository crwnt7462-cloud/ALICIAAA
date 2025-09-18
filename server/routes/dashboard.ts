import { Router } from 'express';
import { supabase } from '../db';

const dashboardRouter = Router();

// GET /api/dashboard/stats
// Renvoie des stats globales (exemple: nombre de rendez-vous, clients, CA)
dashboardRouter.get('/stats', async (req, res) => {
  try {
    // Exemple: nombre total de rendez-vous
    const { count: appointmentsCount } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true });

    // Exemple: nombre total de clients
    const { count: clientsCount } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true });

    // Exemple: chiffre d'affaires total
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('price');
    if (error) throw error;
    const totalRevenue = appointments?.reduce((sum, a) => sum + (a.price || 0), 0) || 0;

    res.json({ appointmentsCount, clientsCount, totalRevenue });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || String(error) });
  }
});

// GET /api/dashboard/today-appointments
// Renvoie les rendez-vous du jour
dashboardRouter.get('/today-appointments', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .gte('date', today.toISOString())
      .lt('date', tomorrow.toISOString());
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || String(error) });
  }
});

// GET /api/dashboard/popular-services
// Renvoie les services les plus réservés
dashboardRouter.get('/popular-services', async (req, res) => {
  try {
    // Utilise une requête SQL pour obtenir le nom du service et le nombre de réservations
    const { data, error } = await supabase.rpc('popular_services_with_name');
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || String(error) });
  }
});

export default dashboardRouter;
