import { Router } from 'express';
import { supabase } from '../db';

const dashboardRouter = Router();

// GET /api/dashboard/stats
// Renvoie des stats pour le salon connecté
dashboardRouter.get('/stats', async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId || !supabase) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    // Nombre de rendez-vous pour ce salon
    const { count: appointmentsCount } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Chiffre d'affaires pour ce salon
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('price')
      .eq('user_id', userId);
    if (error) throw error;
    
    const totalRevenue = appointments?.reduce((sum, a) => sum + (a.price || 0), 0) || 0;

    // Calcul des revenus par période
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const yearStart = new Date(today.getFullYear(), 0, 1);

    // Revenus de la semaine
    const { data: weeklyApps } = await supabase
      .from('appointments')
      .select('price')
      .eq('user_id', userId)
      .gte('date', weekStart.toISOString().split('T')[0]);
    const weeklyRevenue = weeklyApps?.reduce((sum, a) => sum + (a.price || 0), 0) || 0;

    // Revenus du mois
    const { data: monthlyApps } = await supabase
      .from('appointments')
      .select('price')
      .eq('user_id', userId)
      .gte('date', monthStart.toISOString().split('T')[0]);
    const monthlyRevenue = monthlyApps?.reduce((sum, a) => sum + (a.price || 0), 0) || 0;

    // Revenus de l'année
    const { data: yearlyApps } = await supabase
      .from('appointments')
      .select('price')
      .eq('user_id', userId)
      .gte('date', yearStart.toISOString().split('T')[0]);
    const yearlyRevenue = yearlyApps?.reduce((sum, a) => sum + (a.price || 0), 0) || 0;

    const revenue = {
      Day: { value: 0, data: [0, 0, 0, 0, 0, 0, 0] }, // TODO: calculer journée
      Week: { value: weeklyRevenue, data: [0, 0, 0, 0, 0, 0, weeklyRevenue] },
      Month: { value: monthlyRevenue, data: [0, 0, 0, monthlyRevenue] },
      Year: { value: yearlyRevenue, data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, yearlyRevenue] }
    };

    res.json({ 
      appointmentsCount, 
      totalRevenue,
      revenue
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || String(error) });
  }
});

// GET /api/dashboard/today-appointments
// Renvoie les rendez-vous du jour pour ce salon
dashboardRouter.get('/today-appointments', async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId || !supabase) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('appointments')
      .select('appointment_time, client_name, service, duration, price')
      .eq('user_id', userId)
      .eq('date', today)
      .order('appointment_time');
    
    if (error) throw error;

    // Transformer les données pour le format attendu par le frontend
    const formattedAppointments = data?.map(apt => ({
      time: apt.appointment_time || '00:00',
      client: apt.client_name || 'Client inconnu',
      service: apt.service || 'Service inconnu',
      duration: apt.duration || '1h00'
    })) || [];

    res.json(formattedAppointments);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || String(error) });
  }
});

// GET /api/dashboard/popular-services
// Renvoie les services les plus réservés pour ce salon
dashboardRouter.get('/popular-services', async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId || !supabase) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const { data, error } = await supabase
      .from('appointments')
      .select('service, price')
      .eq('user_id', userId);
    
    if (error) throw error;

    // Calculer les services populaires manuellement
    const serviceStats = data?.reduce((acc: any, apt) => {
      const serviceName = apt.service || 'Service inconnu';
      if (!acc[serviceName]) {
        acc[serviceName] = { count: 0, revenue: 0 };
      }
      acc[serviceName].count++;
      acc[serviceName].revenue += apt.price || 0;
      return acc;
    }, {}) || {};

    // Convertir en tableau et trier par popularité
    const popularServices = Object.entries(serviceStats)
      .map(([name, stats]: [string, any]) => ({
        name,
        count: stats.count,
        revenue: stats.revenue,
        growth: '+0%' // TODO: calculer la croissance réelle
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    res.json(popularServices);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || String(error) });
  }
});

export default dashboardRouter;
