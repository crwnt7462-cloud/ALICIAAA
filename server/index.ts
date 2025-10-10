


import { seedDefaultSalonTemplate } from './seedData';
import { ensureAllSalonsHavePublicSlug } from './migrations/ensurePublicSlugs';
import dashboardRouter from './routes/dashboard';
import salonsRouter from './routes/salons';
import professionnelsRouter from './routes/professionnels';
import { slugify } from './utils/slugify';
import express from 'express';
import cors from 'cors';
import { createCorsConfig } from './lib/config/cors';
import { logEnvironmentStatus } from './lib/config/environment';
import morgan from 'morgan';
import session from 'express-session';
import { compareSync, hashSync } from 'bcryptjs';

// Import des routes modulaires
import authRoutes from './routes/auth';
import salonRoutes from './routes/salon';
import dataRoutes from './routes/data';

// Import du client Supabase configuré proprement
import { serviceRole as supabase } from './lib/clients/supabaseServer';



// Configuration des variables d'environnement
// Les variables sensibles sont maintenant dans le fichier .env
if (!process.env.SUPABASE_URL) {
  console.error('❌ SUPABASE_URL manquante dans les variables d\'environnement');
  process.exit(1);
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY manquante dans les variables d\'environnement');
  process.exit(1);
}
if (!process.env.SUPABASE_ANON_KEY) {
  console.error('❌ SUPABASE_ANON_KEY manquante dans les variables d\'environnement');
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL manquante dans les variables d\'environnement');
  process.exit(1);
}

const app = express();

// Lightweight ping endpoint to verify server responsiveness quickly
app.get('/ping', (_req, res) => {
  res.json({ ok: true, ts: Date.now() });
});


// API centralisée pour les données de réservation
app.get('/api/booking/data', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'Service temporairement indisponible' });
    }

    // Validation et sanitization des paramètres
    const salon_slug = typeof req.query.salon_slug === 'string' ? req.query.salon_slug.trim() : undefined;
    const service_id = typeof req.query.service_id === 'string' ? req.query.service_id.trim() : undefined;
    const date = typeof req.query.date === 'string' ? req.query.date.trim() : undefined;
    
    // Validation du format de date
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Format de date invalide. Utilisez YYYY-MM-DD' 
      });
    }
    
    // Validation du salon_slug
    if (salon_slug && !/^[a-zA-Z0-9-_]+$/.test(salon_slug)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Slug de salon invalide' 
      });
    }
    
    // Récupération des données centralisées
    const bookingData: any = {
      services: [],
      timeSlots: [],
      salon: null,
      professionals: []
    };

    // Récupération des services
    if (salon_slug) {
      const { data: salonData } = await supabase
        .from('salons')
        .select(`
          id, name, address, phone, email, description, public_slug,
          services:salon_services(
            id, name, description, duration, price, category
          )
        `)
        .eq('public_slug', salon_slug)
        .single();

      if (salonData) {
        bookingData.salon = salonData;
        bookingData.services = salonData.services || [];
      }
    }

    // Récupération des créneaux disponibles
    if (date) {
      const { data: appointments } = await supabase
        .from('appointments')
        .select('date, time, professional_id')
        .eq('date', date)
        .eq('status', 'confirmed');

      const bookedSlots = appointments?.map((apt: any) => `${apt.date}T${apt.time}`) || [];
      
      // Génération des créneaux disponibles (9h-18h, toutes les 30min)
      const availableSlots = [];
      for (let hour = 9; hour < 18; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          const slotKey = `${date}T${time}`;
          
          if (!bookedSlots.includes(slotKey)) {
            availableSlots.push({
              date,
              time,
              available: true
            });
          }
        }
      }
      
      bookingData.timeSlots = availableSlots;
    }

    // Récupération des professionnels
    if (salon_slug) {
      const { data: salonData } = await supabase
        .from('salons')
        .select(`
          team_members:salon_team_members(
            id, name, role, specialties, rating, experience
          )
        `)
        .eq('public_slug', salon_slug)
        .single();

      if (salonData) {
        bookingData.professionals = salonData.team_members || [];
      }
    }

    res.json({
      success: true,
      data: bookingData
    });
  } catch (error) {
    // Log sécurisé pour le développement uniquement
    if (process.env.NODE_ENV === 'development') {
      console.error('Erreur API booking data:', error);
    }
    
    // Ne pas exposer les détails de l'erreur en production
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? (error instanceof Error ? error.message : 'Erreur inconnue')
      : 'Erreur serveur';
    
    res.status(500).json({ 
      success: false, 
      error: errorMessage 
    });
  }
});

// API pour les catégories de services
app.get('/api/booking/categories', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'Service temporairement indisponible' });
    }

    const { data: categories, error } = await supabase
      .from('service_categories')
      .select('id, name, icon')
      .order('name');

    if (error) {
      console.error('Erreur récupération catégories:', error);
      return res.status(500).json({ success: false, error: 'Erreur serveur' });
    }
    
    res.json({ success: true, data: categories || [] });
  } catch (error) {
    console.error('Erreur API categories:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// PATCH /api/salon/my-salon : modifie le public_slug du salon du user connecté
app.patch('/api/salon/my-salon', async (req, res) => {
  const session = req.session as any;
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Non authentifié' });
  }
  const { public_slug } = req.body;
  if (typeof public_slug !== 'string' || public_slug.length < 2 || public_slug.length > 100 || !/^[a-zA-Z0-9-_]+$/.test(public_slug)) {
    return res.status(400).json({ error: 'Slug invalide (2-100 caractères, lettres/chiffres/-_)' });
  }
  try {
    // Vérifier unicité du slug
    const { data: existing, error: checkErr } = await supabase
      .from('salons')
      .select('id')
      .eq('public_slug', public_slug)
      .neq('owner_id', session.user.id)
      .maybeSingle();
    if (checkErr) return res.status(500).json({ error: checkErr.message });
    if (existing) return res.status(409).json({ error: 'Ce lien est déjà utilisé par un autre salon.' });

    // Mettre à jour le salon du user connecté
    const { data: salon, error: fetchErr } = await supabase
      .from('salons')
      .select('id')
      .eq('owner_id', session.user.id)
      .single();
    if (fetchErr || !salon) return res.status(404).json({ error: 'Salon non trouvé' });

    const { error: updateErr } = await supabase
      .from('salons')
      .update({ public_slug })
      .eq('id', salon.id);
    if (updateErr) return res.status(500).json({ error: updateErr.message });

    res.json({ success: true, public_slug });
  } catch (e) {
    console.error('Erreur PATCH /api/salon/my-salon:', e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));


// Dashboard API
app.use('/api/dashboard', dashboardRouter);

// Route GET /api/business/me : renvoie l'utilisateur connecté (pro)
interface AliciaSessionData {
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    salonName: string;
  };
}

app.get('/api/business/me', (req, res) => {
  const session = req.session as any;
  if (!session || !session.user) {
    return res.status(401).json({ user: null });
  }
  res.json({ user: session.user });
});

// Route GET /api/me : alias pour compatibilité avec useAuth
app.get('/api/me', (req, res) => {
  const session = req.session as any;
  if (!session?.user) {
    return res.json({ ok: false, user: null });
  }
  res.json({ ok: true, user: { id: session.user.id, role: 'pro' } });
});

// Route GET /api/auth/check-session : pour useAuthSession
app.get('/api/auth/check-session', (req, res) => {
  const session = req.session as any;
  if (!session || !session.user) {
    return res.json({ 
      authenticated: false, 
      userType: null,
      user: null 
    });
  }
  
  res.json({
    authenticated: true,
    userType: 'professional',
    userId: session.user.id,
    email: session.user.email,
    firstName: session.user.firstName,
    lastName: session.user.lastName,
    businessName: session.user.salonName
  });
});

// Route GET /api/logout : déconnexion utilisateur avec redirection
app.get('/api/logout', (req, res) => {
  try {
    const session = req.session as any;
    
    if (session) {
      // Détruire la session
      session.destroy((err: any) => {
        if (err) {
          console.error('❌ Erreur destruction session:', err);
          return res.redirect('/?error=logout');
        }
        
        // Nettoyer le cookie de session
        res.clearCookie('connect.sid');
        
        // Log sécurisé pour le développement uniquement
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Utilisateur déconnecté avec succès');
        }
        // Redirection vers la page d'accueil
        res.redirect('/');
      });
    } else {
      // Log sécurisé pour le développement uniquement
      if (process.env.NODE_ENV === 'development') {
        console.log('ℹ️ Aucune session active à détruire');
      }
      // Redirection vers la page d'accueil même sans session
      res.redirect('/');
    }
  } catch (error) {
    console.error('❌ Erreur lors de la déconnexion:', error);
    res.redirect('/?error=logout');
  }
});

// DEV AUTH — n’active que hors prod. Hydrate req.user à partir du header Authorization.
if (process.env.NODE_ENV !== "production") {
  app.use((req, _res, next) => {
    const h = req.headers["authorization"] || req.headers["Authorization"];
    if (h) {
      const m = (h as string).match(/^Bearer\s+(.+)$/i);
      const token = m?.[1]?.trim();
      if (token === "dev-pro")  req.user = { id: "dev-pro", role: "pro" as any };
      if (token === "dev-user") req.user = { id: "dev-user", role: "user" as any };
    }
    next();
  });
}

// Validation environnement au boot (après configuration Supabase)
// logEnvironmentStatus();

// Configuration CORS sécurisée  
const corsConfig = createCorsConfig();
app.use(cors(corsConfig));
app.use(morgan("dev"));
app.use(session({
  secret: 'un_secret_sûr',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, 
    sameSite: 'lax', // Compatible avec localhost
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24h
  }
}));

// 1) Health HTTP avec diagnostics DB/environnement
app.get("/healthz", async (_req, res) => {
  const useMockDb = process.env.USE_MOCK_DB === 'true';
  let dbStatus = 'unknown';
  let supabaseProject = 'unknown';
  
  try {
    if (useMockDb) {
      dbStatus = 'mock';
      supabaseProject = 'mock-mode';
    } else {
      // Test simple de connexion Supabase (sans secrets dans logs)
      supabaseProject = 'efkekkajoyfgtyqziohy';
      
      // Ping test simple (lecture publique)
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }
      const { error } = await supabase.from('services').select('id').limit(1);
      
      dbStatus = error ? 'fail' : 'ok';
    }
  } catch (error) {
    dbStatus = 'fail';
  }
  
  const health = {
    ok: dbStatus !== 'fail',
    db: dbStatus,
    supabaseProject,
    timestamp: new Date().toISOString(),
    mode: useMockDb ? 'mock' : 'database'
  };
  
  const statusCode = health.ok ? 200 : 503;
  res.status(statusCode).json(health);
});

// 2) (Optionnel) health DB stub si tu l'as

// 3) Routes salons — IMPORTANT
app.use("/api/salons", salonsRouter); // ← monte toutes les routes salons ici
app.use("/api/salon", salonsRouter); // ← alias temporaire pour compatibilité front
app.use("/api/public", salonsRouter); // ← expose aussi les routes publiques (public/salons)

// 4) Routes professionnels
app.use("/api", professionnelsRouter); // ← monte les routes professionnels (inclut /api/salons/:salonId/professionals)

// 5) Routes appointments

// 6) Routes modulaires - Auth, Salon, Data
app.use('/api', authRoutes);
app.use('/api/salon', salonRoutes);
app.use('/api', dataRoutes);

// 7) Route pour vérifier si un client peut laisser un avis
app.get('/api/salon/:salonId/can-review', async (req, res) => {
  try {
    const { salonId } = req.params;
    const { clientEmail } = req.query;
    
    if (!clientEmail) {
      return res.status(400).json({ error: 'Email client requis' });
    }
    
    if (!supabase) {
      return res.status(503).json({ error: 'Service temporairement indisponible' });
    }
    
    // Vérifier si le client a eu un RDV passé dans ce salon
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('id, appointment_date, start_time')
      .eq('salon_id', salonId)
      .eq('client_email', clientEmail)
      .lt('appointment_date', new Date().toISOString().split('T')[0]); // RDV passés uniquement
    
    if (error) {
      console.error('Erreur vérification avis:', error);
      return res.status(500).json({ error: 'Erreur base de données' });
    }
    
    const canReview = appointments && appointments.length > 0;
    
    res.json({
      success: true,
      canReview,
      pastAppointments: appointments?.length || 0
    });
    
  } catch (error) {
    console.error('Erreur vérification avis:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 8) Route pour soumettre un avis (seulement si le client a eu un RDV)
app.post('/api/salon/:salonId/review', async (req, res) => {
  try {
    const { salonId } = req.params;
    const { clientEmail, rating, comment, clientName } = req.body;
    
    if (!clientEmail || !rating || !comment) {
      return res.status(400).json({ error: 'Données manquantes' });
    }
    
    if (!supabase) {
      return res.status(503).json({ error: 'Service temporairement indisponible' });
    }
    
    // Vérifier d'abord si le client peut laisser un avis
    const { data: appointments, error: checkError } = await supabase
      .from('appointments')
      .select('id')
      .eq('salon_id', salonId)
      .eq('client_email', clientEmail)
      .lt('appointment_date', new Date().toISOString().split('T')[0]);
    
    if (checkError) {
      console.error('Erreur vérification avis:', checkError);
      return res.status(500).json({ error: 'Erreur base de données' });
    }
    
    if (!appointments || appointments.length === 0) {
      return res.status(403).json({ error: 'Vous devez avoir eu un rendez-vous dans ce salon pour laisser un avis' });
    }
    
    // Insérer l'avis
    const { data: review, error: insertError } = await supabase
      .from('salon_reviews')
      .insert({
        salon_id: salonId,
        client_email: clientEmail,
        client_name: clientName || 'Client anonyme',
        rating: parseInt(rating),
        comment: comment,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('Erreur insertion avis:', insertError);
      return res.status(500).json({ error: 'Erreur lors de l\'enregistrement de l\'avis' });
    }
    
    res.json({
      success: true,
      review: review
    });
    
  } catch (error) {
    console.error('Erreur soumission avis:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 9) Route pour programmer l'envoi de notifications post-RDV
app.post('/api/appointments/:appointmentId/schedule-review-notification', async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { delayHours = 24 } = req.body; // Délai par défaut : 24h
    
    if (!supabase) {
      return res.status(503).json({ error: 'Service temporairement indisponible' });
    }
    
    // Récupérer les détails du RDV
    const { data: appointment, error: fetchError } = await supabase
      .from('appointments')
      .select('*, salon_id, client_email, client_name, appointment_date, start_time')
      .eq('id', appointmentId)
      .single();
    
    if (fetchError || !appointment) {
      return res.status(404).json({ error: 'Rendez-vous non trouvé' });
    }
    
    // Calculer la date d'envoi de la notification
    const appointmentDateTime = new Date(`${appointment.appointment_date}T${appointment.start_time}`);
    const notificationDate = new Date(appointmentDateTime.getTime() + (delayHours * 60 * 60 * 1000));
    
    // Programmer la notification (ici on simule avec un setTimeout, en production utiliser un job queue)
    const notificationData = {
      appointmentId,
      salonId: appointment.salon_id,
      clientEmail: appointment.client_email,
      clientName: appointment.client_name,
      scheduledFor: notificationDate.toISOString()
    };
    
    // En production, utiliser un système de queue comme Bull ou Agenda
    setTimeout(async () => {
      try {
        console.log(`📧 Envoi notification avis pour RDV ${appointmentId} à ${appointment.client_email}`);
        
        // Ici on pourrait envoyer un email ou une notification push
        // Pour l'instant, on log juste
        console.log('📧 Notification envoyée:', notificationData);
        
        // Optionnel : marquer comme envoyé dans la DB
        await supabase
          .from('notification_logs')
          .insert({
            appointment_id: appointmentId,
            type: 'review_request',
            sent_at: new Date().toISOString(),
            status: 'sent'
          });
          
      } catch (error) {
        console.error('Erreur envoi notification:', error);
      }
    }, delayHours * 60 * 60 * 1000);
    
    res.json({
      success: true,
      message: `Notification programmée pour ${notificationDate.toISOString()}`,
      notificationData
    });
    
  } catch (error) {
    console.error('Erreur programmation notification:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 7) Route manquante pour le frontend - /api/salons/by-slug/:slug
app.get('/api/salons/by-slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    console.log('🔍 Récupération salon par slug:', slug);
    
    if (!supabase) {
      return res.status(503).json({ error: 'Service temporairement indisponible' });
    }

    // Essayer d'abord par public_slug
    let { data: salon, error } = await supabase
      .from('salons')
      .select('*')
      .eq('public_slug', slug)
      .single();

    // Si pas trouvé par public_slug, essayer par ID
    if (error || !salon) {
      console.log('🔍 Salon non trouvé par public_slug, essai par ID:', slug);
      const result = await supabase
        .from('salons')
        .select('*')
        .eq('id', slug)
        .single();
      
      salon = result.data;
      error = result.error;
    }

    if (error || !salon) {
      console.log('❌ Salon non trouvé:', slug);
      return res.status(404).json({ error: 'Salon non trouvé' });
    }

    console.log('✅ Salon trouvé:', salon.name);
    res.json(salon);
  } catch (error) {
    console.error('Erreur récupération salon par slug:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    // Attendre que Supabase soit initialisé
    if (!supabase) {
      return res.status(503).json({ error: 'Service temporairement indisponible' });
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('[LOGIN] raw body:', req.body);
    }

    const email = String(req.body?.email ?? '').trim().toLowerCase();
    const password = String(req.body?.password ?? '');

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    // Essayer d'abord dans la table users (clients)
    let { data: clients, error: clientError } = await supabase
      .from('users')
      .select('*')
      .ilike('email', email)
      .limit(1);

    if (clientError) {
      console.error('Erreur requête users:', clientError);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    let user = clients?.[0];
    let userType = 'client';

    // Si pas trouvé dans users, essayer dans pro_users
    if (!user) {
      const { data: pros, error: proError } = await supabase
        .from('pro_users')
        .select('*')
        .ilike('email', email)
        .limit(1);

      if (proError) {
        console.error('Erreur requête pro_users:', proError);
        return res.status(500).json({ error: 'Erreur serveur' });
      }
      
      user = pros?.[0];
      userType = 'professional';
    }

    if (!user) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    const ok = compareSync(password, user.password);
    if (!ok) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    const session = req.session as any;
    session.user = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      salonName: user.salon_name || null,
    };

    // Sauvegarder la session de manière synchrone
    req.session.save((err) => {
      if (err) {
        console.error('❌ Erreur sauvegarde session:', err);
        return res.status(500).json({ error: 'Erreur sauvegarde session' });
      } else {
        console.log('✅ Session sauvegardée avec succès');
        console.log('✅ Session ID après sauvegarde:', req.sessionID);
        console.log('✅ Session user après sauvegarde:', req.session.user);
        console.log('✅ Connexion réussie pour:', email, 'Type:', userType);

        return res.json({
          success: true,
          ok: true,
          user: session.user,
          userType: userType,
          token: `${userType}_${user.id}_${Date.now()}`
        });
      }
    });
  } catch (error) {
    console.error('❌ Erreur login:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ----- FALLBACK D'INSCRIPTION PROFESSIONNELLE (garantie d'écriture en DB)
// Si, pour une raison quelconque, les routes complètes ne sont pas montées,
// ce handler minimal s'assure que /api/register/professional écrit bien dans la base.
app.post('/api/register/professional', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'Service temporairement indisponible' });
    }

    const userData = req.body || {};
    const email = String(userData.email || '').trim().toLowerCase();
    const firstName = String(userData.firstName || '').trim();
    const lastName = String(userData.lastName || '').trim();
    const businessName = String(userData.businessName || '').trim();
    const password = userData.password || null;

    if (!email || !firstName || !businessName || !password) {
      return res.status(400).json({ error: 'Email, prénom, mot de passe et nom du salon requis' });
    }

    // Vérifier si l'utilisateur existe déjà dans pro_users
    const { data: existing, error: existErr } = await supabase
      .from('pro_users')
      .select('id')
      .ilike('email', email)
      .limit(1);

    if (existErr) {
      console.error('Erreur vérification utilisateur existant:', existErr);
      return res.status(500).json({ error: 'Erreur serveur lors de la vérification' });
    }

    if (existing && existing.length > 0) {
      return res.status(400).json({ error: 'Un compte avec cet email existe déjà' });
    }

    // Hasher le mot de passe
    const hashed = hashSync(String(password), 10);

    const insertPayload = {
      email,
      password: hashed,
      first_name: firstName,
      last_name: lastName || null,
      salon_name: businessName,
      siret: userData.siret || null,
      phone: userData.phone || null,
      city: userData.city || null,
      address: userData.address || null
    };

    const { data, error } = await supabase
      .from('pro_users')
      .insert([insertPayload])
      .select('id,email')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Erreur insertion utilisateur:', error);
      return res.status(500).json({ error: error.message || 'Erreur insertion Supabase' });
    }

    // Créer la session
    const session = req.session as any;
    session.user = {
      id: data?.id || null,
      email: data?.email || email,
      firstName: firstName,
      lastName: lastName,
      salonName: businessName,
    };

    console.log('✅ Inscription professionnelle réussie pour:', email);

    return res.status(201).json({ 
      success: true, 
      account: data,
      user: session.user
    });
  } catch (error: any) {
    console.error('❌ Erreur inscription professionnelle:', error);
    return res.status(500).json({ error: "Erreur serveur lors de l'inscription" });
  }
});

// ----- INSCRIPTION CLIENT (table users)
// Endpoints pour le dashboard client
app.get('/api/client/appointments', async (req, res) => {
  try {
    // Récupérer les rendez-vous du client depuis la session ou les paramètres
    const clientId = (req.session as any)?.clientId || req.query.clientId;
    
    if (!clientId) {
      return res.status(401).json({ 
        success: false, 
        error: 'Client non authentifié' 
      });
    }

    // Récupération dynamique depuis la base de données
    try {
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select(`
          id,
          dateTime,
          service:services(name, price),
          salon:salons(name),
          staff:staff(firstName, lastName),
          review:reviews(rating)
        `)
        .eq('client_id', clientId)
        .order('dateTime', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des rendez-vous:', error);
        // En cas d'erreur de base de données, retourner des données vides
        return res.json([]);
      }

      res.json(appointments || []);
    } catch (dbError) {
      console.error('Erreur de base de données:', dbError);
      // En cas d'erreur de base de données, retourner des données vides
      res.json([]);
    }
  } catch (error) {
    console.error('Erreur API appointments:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur serveur' 
    });
  }
});

app.get('/api/client/stats', async (req, res) => {
  try {
    const clientId = (req.session as any)?.clientId || req.query.clientId;
    
    if (!clientId) {
      return res.status(401).json({ 
        success: false, 
        error: 'Client non authentifié' 
      });
    }

    // Récupération dynamique des statistiques depuis la base de données
    try {
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select(`
          id,
          dateTime,
          service:services(name, price)
        `)
        .eq('client_id', clientId);

      if (error) {
        console.error('Erreur lors de la récupération des stats:', error);
        // En cas d'erreur de base de données, retourner des stats vides
        return res.json({
          totalAppointments: 0,
          upcomingAppointments: 0,
          favoriteServices: [],
          totalSpent: 0
        });
      }

      const now = new Date();
      const totalAppointments = appointments?.length || 0;
      const upcomingAppointments = appointments?.filter((apt: any) => 
        new Date(apt.dateTime) > now
      ).length || 0;
      
      // Services favoris (les plus réservés)
      const serviceCounts: any = {};
      appointments?.forEach((apt: any) => {
        if (apt.service?.name) {
          serviceCounts[apt.service.name] = (serviceCounts[apt.service.name] || 0) + 1;
        }
      });
      
      const favoriteServices = Object.entries(serviceCounts)
        .sort(([,a], [,b]) => (b as any) - (a as any))
        .slice(0, 3)
        .map(([name]) => name);

      // Total dépensé
      const totalSpent = appointments?.reduce((sum: any, apt: any) => 
        sum + (apt.service?.price || 0), 0
      ) || 0;

      res.json({
        totalAppointments,
        upcomingAppointments,
        favoriteServices,
        totalSpent
      });
    } catch (dbError) {
      console.error('Erreur de base de données:', dbError);
      // En cas d'erreur de base de données, retourner des stats vides
      res.json({
        totalAppointments: 0,
        upcomingAppointments: 0,
        favoriteServices: [],
        totalSpent: 0
      });
    }
  } catch (error) {
    console.error('Erreur API stats:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur serveur' 
    });
  }
});

app.post('/api/client/appointments/:id/cancel', async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const clientId = (req.session as any)?.clientId || req.body.clientId;
    
    if (!clientId) {
      return res.status(401).json({ 
        success: false, 
        error: 'Client non authentifié' 
      });
    }

    if (!appointmentId) {
      return res.status(400).json({ 
        success: false, 
        error: 'ID de rendez-vous manquant' 
      });
    }

    // Vérifier que le rendez-vous appartient au client
    const { data: appointment, error: fetchError } = await supabase
      .from('appointments')
      .select('id, client_id, dateTime')
      .eq('id', appointmentId)
      .eq('client_id', clientId)
      .single();

    if (fetchError || !appointment) {
      return res.status(404).json({ 
        success: false, 
        error: 'Rendez-vous non trouvé' 
      });
    }

    // Supprimer le rendez-vous
    const { error: deleteError } = await supabase
      .from('appointments')
      .delete()
      .eq('id', appointmentId)
      .eq('client_id', clientId);

    if (deleteError) {
      console.error('Erreur lors de l\'annulation:', deleteError);
      return res.status(500).json({ 
        success: false, 
        error: 'Erreur lors de l\'annulation du rendez-vous' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Rendez-vous annulé avec succès' 
    });
  } catch (error) {
    console.error('Erreur API cancel appointment:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur serveur' 
    });
  }
});

// Endpoint de connexion client
app.post('/api/client/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email et mot de passe requis' 
      });
    }

    // Pour le développement, accepter les identifiants de test
    if (email === 'koifeur@gmail.com' && password === 'password123') {
      const clientData = {
        id: 'test123',
        firstName: 'Test',
        lastName: 'User',
        email: 'koifeur@gmail.com'
      };

      // Créer une session
      (req.session as any).clientId = clientData.id;
      (req.session as any).clientEmail = clientData.email;

      return res.json({ 
        success: true, 
        message: 'Connexion réussie',
        client: clientData
      });
    }

    // En production, vérifier dans la base de données
    try {
      const { data: client, error } = await supabase
        .from('users')
        .select('id, firstName, lastName, email, password')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (error || !client) {
        return res.status(401).json({ 
          success: false, 
          error: 'Email ou mot de passe incorrect' 
        });
      }

      // Vérifier le mot de passe (en production, utiliser bcrypt)
      if (client.password !== password) {
        return res.status(401).json({ 
          success: false, 
          error: 'Email ou mot de passe incorrect' 
        });
      }

      // Créer une session
      (req.session as any).clientId = client.id;
      (req.session as any).clientEmail = client.email;

      // Retourner les données du client (sans le mot de passe)
      const clientData = {
        id: client.id,
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email
      };

      res.json({ 
        success: true, 
        message: 'Connexion réussie',
        client: clientData
      });
    } catch (dbError) {
      console.error('Erreur base de données:', dbError);
      // En cas d'erreur de base de données, utiliser les identifiants de test
      if (email === 'koifeur@gmail.com' && password === 'password123') {
        const clientData = {
          id: 'test123',
          firstName: 'Test',
          lastName: 'User',
          email: 'koifeur@gmail.com'
        };

        (req.session as any).clientId = clientData.id;
        (req.session as any).clientEmail = clientData.email;

        return res.json({ 
          success: true, 
          message: 'Connexion réussie',
          client: clientData
        });
      }

      return res.status(401).json({ 
        success: false, 
        error: 'Email ou mot de passe incorrect' 
      });
    }
  } catch (error) {
    console.error('Erreur API login:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur serveur' 
    });
  }
});

app.post('/api/client/register', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'Service temporairement indisponible' });
    }

    const userData = req.body || {};
    const email = String(userData.email || '').trim().toLowerCase();
    const password = userData.password || null;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    // Vérifier si l'utilisateur existe déjà dans users
    const { data: existing, error: existErr } = await supabase
      .from('users')
      .select('id')
      .ilike('email', email)
      .limit(1);

    if (existErr) {
      console.error('Erreur vérification utilisateur existant:', existErr);
      return res.status(500).json({ error: 'Erreur serveur lors de la vérification' });
    }

    if (existing && existing.length > 0) {
      return res.status(409).json({ error: 'Un compte avec cet email existe déjà' });
    }

    // Hasher le mot de passe
    const hashedPassword = hashSync(password, 12);

    // Insérer dans la table users
    const insertPayload = {
      email,
      password: hashedPassword
    };

    const { data, error } = await supabase
      .from('users')
      .insert([insertPayload])
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Erreur insertion utilisateur:', error);
      return res.status(500).json({ error: error.message || 'Erreur insertion Supabase' });
    }

    // Créer la session
    const session = req.session as any;
    session.user = {
      id: data?.id || null,
      email: data?.email || email,
      firstName: 'Client',
      lastName: 'Utilisateur',
      salonName: null as any,
    };

    console.log('✅ Inscription client réussie pour:', email);

    res.json({
      success: true,
      user: {
        id: data?.id,
        email: data?.email || email,
        userType: 'client'
      },
      token: `client_${data?.id}_${Date.now()}`
    });

  } catch (error) {
    console.error('❌ Erreur inscription client:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Route pour récupérer le salon de l'utilisateur connecté
app.get('/api/salon/my-salon', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'Service temporairement indisponible' });
    }

    const session = req.session as any;
    if (!session.user) {
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
          address: '',
          telephone: '',
          description: '',
          horaires: '',
          facebook: '',
          instagram: '',
          tiktok: '',
          serviceCategories: [],
          teamMembers: [],
          coverImageUrl: '',
          public_slug: '',
          services: []
        });
      }
      console.error('Erreur récupération salon:', error);
      return res.status(500).json({ error: error.message });
    }

    // Générer automatiquement un public_slug si manquant
    let publicSlug = salon.public_slug;
    if (!publicSlug || publicSlug.trim() === '') {
      console.log(`🔧 Auto-génération du public_slug pour le salon ${salon.id}`);
      let generatedSlug = slugify(salon.name || 'salon-sans-nom');
      if (!generatedSlug || generatedSlug.trim() === '') {
        generatedSlug = `salon-${salon.id.substring(0, 8)}`;
      }
      publicSlug = generatedSlug;
      
      // Mettre à jour immédiatement en base
      const { error: updateError } = await supabase
        .from('salons')
        .update({ public_slug: publicSlug })
        .eq('id', salon.id);
        
      if (updateError) {
        console.error('Erreur lors de la mise à jour du public_slug:', updateError);
        publicSlug = `salon-${salon.id.substring(0, 8)}`;
      }
    }

    res.json({
      id: salon.id,
      name: salon.name || '',
      address: salon.business_address || '',
      telephone: salon.business_phone || '',
      description: salon.description || '',
      horaires: salon.horaires || '',
      facebook: salon.facebook || '',
      instagram: salon.instagram || '',
      tiktok: salon.tiktok || '',
      serviceCategories: salon.service_categories || [],
      teamMembers: salon.team_members || [],
      coverImageUrl: salon.cover_image_url || '',
      public_slug: publicSlug,
      services: salon.services || []
    });
  } catch (error) {
    console.error('❌ Erreur récupération salon:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour créer un salon personnalisé avec URL générée
app.post('/api/salon/create-personalized', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'Service temporairement indisponible' });
    }

    const session = req.session as any;
    if (!session.user) {
      return res.status(401).json({ error: 'Non authentifié' });
    }
    const { salonData, serviceCategories, teamMembers, coverImage, galleryImages } = req.body;
    const name = salonData?.nom || salonData?.name || '';
    let public_slug: string | null = (slugify(name) || null);
    if (!public_slug || public_slug.trim() === '') {
      // fallback temporaire, l'id sera connu après insert
      public_slug = null;
    }
    let salonPayload: any = {
      name,
      business_address: salonData?.adresse || '',
      business_phone: salonData?.telephone || '',
      description: salonData?.description || '',
      horaires: salonData?.horaires || '',
      facebook: salonData?.facebook || '',
      instagram: salonData?.instagram || '',
      tiktok: salonData?.tiktok || '',
      service_categories: serviceCategories || [],
      team_members: teamMembers || [],
      cover_image_url: coverImage || '',
      gallery_images: galleryImages || [],
      owner_id: session.user.id,
      is_template: false
    };
    if (public_slug) salonPayload.public_slug = public_slug;

    // Vérifier si l'utilisateur a déjà un salon
    const { data: existingUserSalon } = await supabase
      .from('salons')
      .select('id, name')
      .eq('owner_id', session.user.id)
      .eq('is_template', false)
      .single();

    let salonUrl;
    let salonId;

    if (existingUserSalon) {
      // Vérifier si le salon existant a un public_slug
      const { data: salonWithSlug } = await supabase
        .from('salons')
        .select('public_slug')
        .eq('id', existingUserSalon.id)
        .single();
      
      // Si pas de public_slug ou slug vide, forcer la génération
      if (!salonWithSlug?.public_slug || salonWithSlug.public_slug.trim() === '') {
        console.log(`🔧 Génération automatique du public_slug pour le salon ${existingUserSalon.id}`);
        // Le salonPayload contient déjà le public_slug généré plus haut
      }
      
      // Mettre à jour le salon existant
      const { error: updateError } = await supabase
        .from('salons')
        .update(salonPayload)
        .eq('id', existingUserSalon.id);

      if (updateError) {
        return res.status(500).json({ error: updateError.message });
      }
      
      salonId = existingUserSalon.id;
    } else {
      // Créer un nouveau salon
      const { data: newSalon, error: insertError } = await supabase
        .from('salons')
        .insert(salonPayload)
        .select('id')
        .single();

      if (insertError) {
        return res.status(500).json({ error: insertError.message });
      }

      salonId = newSalon.id;
    }

    // Ensure a public_slug exists for immediate shareable link
    try {
      // Fetch current public_slug
      const { data: current, error: fetchSlugErr } = await supabase
        .from('salons')
        .select('public_slug')
        .eq('id', salonId)
        .single();

      let finalSlug = current?.public_slug;
      if (!finalSlug || finalSlug.trim() === '') {
        // Generate from provided name if possible, else fallback to id prefix
        let candidate = slugify(name || `salon-${salonId.substring(0,8)}`);
        if (!candidate || candidate.trim() === '') candidate = `salon-${salonId.substring(0,8)}`;

        // Try to ensure uniqueness by appending suffix if necessary
        let uniqueSlug = candidate;
        let attempt = 0;
        while (attempt < 5) {
          // Check existence
          const { data: exists } = await supabase
            .from('salons')
            .select('id')
            .eq('public_slug', uniqueSlug)
            .maybeSingle();
          if (!exists) break;
          attempt += 1;
          uniqueSlug = `${candidate}-${Math.random().toString(36).slice(2, 6)}`;
        }

        // Persist the chosen slug
        const { error: updateSlugErr } = await supabase
          .from('salons')
          .update({ public_slug: uniqueSlug })
          .eq('id', salonId);
        if (updateSlugErr) {
          console.error('Erreur lors de la génération du public_slug:', updateSlugErr);
        } else {
          finalSlug = uniqueSlug;
        }
      }

      // Build the public shareable URL
      salonUrl = `/salon/${finalSlug || salonId}`;
    } catch (err) {
      console.error('Erreur lors de l\'assurance du public_slug:', err);
      salonUrl = `/salon/${salonId}`;
    }

    res.json({ 
      success: true, 
      message: 'Salon créé avec succès',
      salonUrl: salonUrl,
      salonId: salonId
    });
  } catch (error) {
    console.error('Erreur lors de la création du salon:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


// Route pour récupérer un salon par son ID (temporaire, en attendant les slugs)
app.get('/api/salon/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: salon, error } = await supabase
      .from('salons')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Salon non trouvé' });
      }
      return res.status(500).json({ error: error.message });
    }

    res.json({
      id: salon.id,
      name: salon.name || '',
      address: salon.business_address || '',
      telephone: salon.business_phone || '',
      description: salon.description || '',
      horaires: salon.horaires || '',
      facebook: salon.facebook || '',
      instagram: salon.instagram || '',
      tiktok: salon.tiktok || '',
      serviceCategories: salon.service_categories || [],
      teamMembers: salon.team_members || [],
      coverImageUrl: salon.cover_image_url || '',
      ownerId: salon.owner_id,
      isTemplate: salon.is_template || false
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du salon:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour mettre à jour le salon (POST pour compatibilité)
app.post('/api/salon/update', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'Service temporairement indisponible' });
    }

    const session = req.session as any;
    if (!session.user) {
      return res.status(401).json({ error: 'Non authentifié' });
    }
    const { salonId, salonData, serviceCategories, teamMembers, coverImage, galleryImages, services } = req.body;

    // Gestion du champ services (jsonb)
    let servicesToSave = undefined;
    if (typeof services !== 'undefined') {
      if (!Array.isArray(services)) {
        return res.status(400).json({ error: 'services doit être un tableau' });
      }
      servicesToSave = services;
      console.debug('[salon/update] services len=', services.length);
    }

    // Gestion du nom et description (multiples sources possibles)
    const nameFromBody = typeof req.body?.name === 'string' ? req.body.name : undefined;
    const descFromBody = typeof req.body?.description === 'string' ? req.body.description : undefined;
    const nameFromData = typeof req.body?.salonData?.name === 'string' ? req.body.salonData.name : undefined;
    const descFromData = typeof req.body?.salonData?.description === 'string' ? req.body.salonData.description : undefined;

    const finalName = nameFromBody ?? nameFromData;
    const finalDescription = descFromBody ?? descFromData;

    const salonPayload: any = {
      name: salonData?.nom || '',
      description: salonData?.description || '',
      business_address: salonData?.adresse || '',
      business_phone: salonData?.telephone || '',
      horaires: salonData?.horaires || '',
      facebook: salonData?.facebook || '',
      instagram: salonData?.instagram || '',
      tiktok: salonData?.tiktok || '',
      service_categories: serviceCategories || [],
      team_members: teamMembers || [],
      cover_image_url: coverImage || '',
      gallery_images: galleryImages || [], // Ajout des images de la galerie
      custom_colors: salonData?.customColors || salonData?.custom_colors || null // Support pour les couleurs personnalisées
    };
    
    // Surcharge avec les valeurs explicites de nom et description
    if (typeof finalName === 'string') salonPayload.name = finalName;
    if (typeof finalDescription === 'string') salonPayload.description = finalDescription;
    
    if (typeof servicesToSave !== 'undefined') {
      salonPayload.services = servicesToSave;
    }
    
    // Log minimal pour debug
    console.debug('[salon/update] set fields', { 
      name: !!finalName, 
      description: !!finalDescription, 
      services: Array.isArray(servicesToSave) ? servicesToSave.length : undefined 
    });

    if (salonId) {
      // Mise à jour d'un salon spécifique - vérifier la propriété
      const { data: salon, error: fetchError } = await supabase
        .from('salons')
        .select('owner_id')
        .eq('id', salonId)
        .single();

      if (fetchError || !salon) {
        return res.status(404).json({ error: 'Salon non trouvé' });
      }

      if (salon.owner_id !== session.user.id) {
        return res.status(403).json({ error: 'Non autorisé' });
      }

      const { error: updateError } = await supabase
        .from('salons')
        .update(salonPayload)
        .eq('id', salonId);

      if (updateError) {
        return res.status(500).json({ error: updateError.message });
      }
    } else {
      // Chercher le salon existant de l'utilisateur
      const { data: existingSalon, error: findError } = await supabase
        .from('salons')
        .select('id')
        .eq('owner_id', session.user.id)
        .single();

      if (findError && findError.code !== 'PGRST116') {
        return res.status(500).json({ error: findError.message });
      }

      if (existingSalon) {
        // Mettre à jour le salon existant
        const { error: updateError } = await supabase
          .from('salons')
          .update({ ...salonPayload, owner_id: session.user.id })
          .eq('id', existingSalon.id);

        if (updateError) {
          return res.status(500).json({ error: updateError.message });
        }
      } else {
        // Créer un nouveau salon
        const { error: insertError } = await supabase
          .from('salons')
          .insert({ ...salonPayload, owner_id: session.user.id });

        if (insertError) {
          return res.status(500).json({ error: insertError.message });
        }
      }
    }

    res.json({ success: true, message: 'Salon mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du salon:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route publique pour accéder à un salon par slug
app.get('/api/public/salon/:slug', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ ok: false, error: 'Service temporairement indisponible' });
    }

    const { slug } = req.params;

    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({ ok: false, error: 'Slug requis' });
    }

    let salonRow: any = null;

    // 1) Resolve salon by public_slug first
    try {
      const { data, error } = await supabase
        .from('salons')
        .select('*')
        .eq('public_slug', slug)
        .limit(1)
        .maybeSingle();

      if (!error && data) salonRow = data;
    } catch (err) {
      console.error('public_salon_fetch_err_resolve', { slug, error: (err as Error).message });
    }

    // Fallback: accept UUID-like slug as id
    if (!salonRow && /[0-9a-f-]{8}-[0-9a-f-]{4}-[0-9a-f-]{4}-[0-9a-f-]{4}-[0-9a-f-]{12}/i.test(slug)) {
      try {
        const { data, error } = await supabase
          .from('salons')
          .select('*')
          .eq('id', slug)
          .limit(1)
          .maybeSingle();
        if (!error && data) salonRow = data;
      } catch (err) {
        console.error('public_salon_fetch_err_resolve_id', { slug, error: (err as Error).message });
      }
    }

    if (!salonRow) {
      console.log('public_salon_not_found', { slug });
      // As requested: return ok:true with salon null for public-consumption (avoid 404 noise)
      return res.json({ ok: true, salon: null });
    }

    // Hydrate relations using public client and respect RLS
    const salonId = salonRow.id;

    // 2) services from salon row directly
    let services: any[] = [];
    if (salonRow.services && Array.isArray(salonRow.services)) {
      services = salonRow.services.map((s: any) => ({
        id: s.id || s.serviceId || s.service_id,
        name: s.name || s.service_name || '',
        price: s.price || s.effective_price || 0,
        duration: s.duration || s.effective_duration || 0,
        description: s.description || '',
        photos: s.photos || []
      }));
      console.log('public_salon_services_fallback_used', { slug, count: services.length });
    }

    // 3) team members (professionals) via embedded row or public client
    let team_members: any[] = [];
    try {
      // If the salon row already contains team_members (e.g. from a view), use it
      if (Array.isArray(salonRow?.team_members) && salonRow.team_members.length > 0) {
        // Preserve rich metadata if present in the embedded team_members JSON
        team_members = (salonRow.team_members || []).map((p: any) => ({
          ...p,
          id: p.id,
          name: p.name || p.full_name || '',
          role: p.role || '',
          avatar: p.avatar || p.photo || '',
          bio: p.bio || '',
          specialties: Array.isArray(p.specialties) ? p.specialties : (p.services || p.speciality || []),
          rating: p.rating ?? p.score ?? 0,
          reviewsCount: p.reviewsCount ?? p.reviews_count ?? 0,
          nextSlot: p.nextSlot || p.next_slot || '',
          experience: p.experience || '' ,
          availableToday: !!p.availableToday
        }));
      } else {
        const { data: pros, error: prosErr } = await supabase
          .from('professionnels')
          .select('id, name, role, avatar, bio')
          .eq('salon_id', salonId)
          .order('id', { ascending: true });

        if (!prosErr && Array.isArray(pros)) {
          team_members = (pros || []).map((p: any) => ({
            id: p.id,
            name: p.name || p.full_name || '',
            role: p.role || '',
            avatar: p.avatar || p.photo || '',
            bio: p.bio || ''
          }));
        } else if (prosErr) {
          console.error('public_salon_fetch_err', { slug, step: 'team', error: prosErr.message });
        }
      }
    } catch (err) {
      console.error('public_salon_fetch_err', { slug, step: 'team', error: (err as Error).message });
      team_members = [];
    }

    // If anon/public client returned no team members (RLS or empty), try
    // using the secure service_role client to fetch professionals and
    // expose only public fields (we'll map them manually).
    try {
      if ((!team_members || team_members.length === 0) && typeof supabase !== 'undefined') {
        const { data: prosSrv, error: prosSrvErr } = await (supabase as any)
          .from('professionnels')
          .select('id, name, role, avatar, photo, bio, full_name')
          .eq('salon_id', salonId)
          .order('id', { ascending: true });
        if (!prosSrvErr && Array.isArray(prosSrv) && prosSrv.length > 0) {
          team_members = (prosSrv || []).map((p: any) => ({
            ...p,
            id: p.id,
            name: p.name || p.full_name || '',
            role: p.role || '',
            avatar: p.avatar || p.photo || '',
            bio: p.bio || '',
            specialties: Array.isArray(p.specialties) ? p.specialties : [],
            rating: p.rating ?? 0,
            reviewsCount: p.reviewsCount ?? 0,
            nextSlot: p.nextSlot || '',
            experience: p.experience || '',
            availableToday: !!p.availableToday
          }));
          console.log('public_salon_team_fallback_service_role_used', { slug, count: team_members.length });
        } else if (prosSrvErr) {
          console.error('public_salon_fetch_err', { slug, step: 'team_service_role', error: prosSrvErr.message || prosSrvErr });
        }
      }
    } catch (err) {
      console.error('public_salon_fetch_err', { slug, step: 'team_service_role', error: (err as Error).message });
    }

    // 4) gallery images: prefer salon.gallery_images column, else try salon_photos_advanced
    let gallery_images: string[] = [];
    try {
      if (Array.isArray(salonRow.gallery_images) && salonRow.gallery_images.length > 0) {
        gallery_images = salonRow.gallery_images.map((g: any) => String(g));
      } else {
        // try advanced photos table (fallback to empty array if table doesn't exist)
        const { data: photos, error: photosErr } = await supabase
          .from('salon_photos_advanced')
          .select('image_url')
          .eq('salon_id', salonId)
          .order('id', { ascending: true });
        
        if (photosErr && photosErr.code === 'PGRST204') {
          // Table doesn't exist, use empty array - this is expected, don't log as error
          gallery_images = [];
        } else if (photosErr) {
          console.error('public_salon_fetch_err', { slug, step: 'gallery', error: photosErr.message });
        } else {
          gallery_images = photos?.map(p => p.image_url) || [];
        }
      }
    } catch (err) {
      console.error('public_salon_fetch_err', { slug, step: 'gallery', error: (err as Error).message });
      gallery_images = [];
    }

    // Project only public salon fields via the whitelist mapper
  const { pickPublicSalonFields, flattenServicesFromCategories } = await import('./lib/mappers/publicSalon');
  let publicSalon = pickPublicSalonFields(salonRow);

  // Always attempt a secure fetch with the service_role client to ensure
  // we can surface image/gallery fields that anon/RLS might hide. We still
  // apply the whitelist (pickPublicSalonFields) so only safe columns are exposed.
  try {
    if (typeof supabase !== 'undefined') {
      try {
        const { data: fullRow, error: fullErr } = await (supabase as any)
          .from('salons')
          .select('*')
          .eq('id', salonId)
          .limit(1)
          .maybeSingle();
        if (!fullErr && fullRow) {
          salonRow = fullRow;
          publicSalon = pickPublicSalonFields(salonRow);
          console.log('public_salon_service_role_used', { slug, id: salonId, keys: Object.keys(fullRow) });
        } else if (fullErr) {
          console.error('public_salon_service_role_fetch_err', { slug, error: fullErr?.message || fullErr });
        }
      } catch (err) {
        console.error('public_salon_service_role_fetch_exception', { slug, error: (err as Error).message });
      }
    }
  } catch (err) {
    console.error('public_salon_service_role_outer_err', { slug, error: (err as Error).message });
  }

    // Attach relations (always arrays)
    publicSalon.services = services || [];
    publicSalon.team_members = team_members || [];
    // Normalize gallery_images to an array of strings (URLs or data URIs)
    publicSalon.gallery_images = (gallery_images || []).map((g: any) => {
      if (!g && g !== 0) return '';
      if (typeof g === 'string') return g;
      if (typeof g === 'object') {
        return String(g.image_url || g.url || g.src || g.path || '');
      }
      return String(g);
    }).filter(Boolean);

    // Normalize and expose service categories in both snake_case and camelCase
    try {
      const rawCategories = salonRow.service_categories ?? salonRow.serviceCategories ?? publicSalon.service_categories ?? publicSalon.serviceCategories ?? [];
      // If it's a JSON string, try to parse
      let normalizedCategories: any[] = [];
      if (!rawCategories) {
        normalizedCategories = [];
      } else if (typeof rawCategories === 'string') {
        try {
          const parsed = JSON.parse(rawCategories);
          normalizedCategories = Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          // not JSON, keep empty
          normalizedCategories = [];
        }
      } else if (Array.isArray(rawCategories)) {
        normalizedCategories = rawCategories;
      } else if (typeof rawCategories === 'object') {
        // maybe an object with categories property
        normalizedCategories = Array.isArray(rawCategories.categories) ? rawCategories.categories : [];
      } else {
        normalizedCategories = [];
      }

      publicSalon.service_categories = normalizedCategories;
      // also expose camelCase for clients that expect it
      publicSalon.serviceCategories = normalizedCategories;
    } catch (err) {
      console.error('public_salon_service_categories_normalize_err', { slug, error: (err as Error).message });
      publicSalon.service_categories = publicSalon.serviceCategories = [];
    }

  // Canonicalize cover image: prefer explicit cover_image_url fields from the row
  let _migrationInfo: any = { attempted: false, uploaded: false, uploadedUrl: null, dbUpdated: false, error: null };
    const coverCandidates = [
      salonRow.cover_image_url,
      salonRow.coverImageUrl,
      salonRow.cover_image,
      salonRow.coverImage,
      publicSalon.cover_image_url,
      publicSalon.coverImageUrl,
      publicSalon.cover_image
    ];
    let chosenCover: string | null = null;
    for (const c of coverCandidates) {
      if (!c && c !== 0) continue;
      if (typeof c === 'string' && c.trim() !== '') { chosenCover = c.trim(); break; }
      if (Array.isArray(c) && c.length > 0 && typeof c[0] === 'string') { chosenCover = c[0]; break; }
      if (typeof c === 'object' && (c.url || c.image_url || c.src)) { chosenCover = String(c.url || c.image_url || c.src); break; }
    }
    // Defensive: avoid sending enormous base64/data blobs in the public payload.
    // If the chosen cover looks like a data URI or is very large, drop it and log.
    try {
      if (typeof chosenCover === 'string' && chosenCover.trim() !== '') {
        const trimmed = chosenCover.trim();
        const isDataUri = /^data:/i.test(trimmed);
        // If we have a data:URI that's moderately large (>200KB) we will
        // upload it to Supabase Storage and persist the public URL so the
        // public API returns a URL instead of a giant inline blob.
        if (isDataUri && trimmed.length > 200000) {
          _migrationInfo.attempted = true;
          try {
            const { uploadDataUriAsPublicUrl } = await import('./lib/storage');
            const bucket = process.env.SUPABASE_PUBLIC_BUCKET || 'public';
            const pubUrl = await uploadDataUriAsPublicUrl(bucket, `covers/${salonId}`, trimmed);
            if (pubUrl) {
              _migrationInfo.uploaded = true;
              _migrationInfo.uploadedUrl = pubUrl;
              // Persist the URL in the DB using service role
              try {
                const { error: updErr } = await (supabase as any)
                  .from('salons')
                  .update({ cover_image_url: pubUrl })
                  .eq('id', salonId);
                if (updErr) {
                  console.error('public_salon_cover_db_update_err', { slug, error: updErr.message || updErr });
                  _migrationInfo.dbUpdated = false;
                  _migrationInfo.error = updErr.message || updErr;
                } else {
                  console.log('public_salon_cover_migrated_to_storage', { slug, salonId, url: pubUrl });
                  _migrationInfo.dbUpdated = true;
                }
                chosenCover = pubUrl;
              } catch (err) {
                console.error('public_salon_cover_db_update_exception', { slug, error: (err as Error).message });
                _migrationInfo.error = (err as Error).message;
                chosenCover = trimmed; // fallback to inline
              }
            } else {
              // Upload failed — keep inline trimmed
              _migrationInfo.uploaded = false;
              _migrationInfo.error = 'upload_failed';
              chosenCover = trimmed;
            }
          } catch (err) {
            console.error('public_salon_cover_upload_err', { slug, error: (err as Error).message });
            _migrationInfo.error = (err as Error).message;
            chosenCover = trimmed;
          }
        } else {
          chosenCover = trimmed;
        }
      }
    } catch (err) {
      console.error('public_salon_cover_check_err', { slug, error: (err as Error).message });
      chosenCover = '';
    }

    // Ensure the publicSalon always has a cover_image_url key (empty string if none)
    publicSalon.cover_image_url = chosenCover || '';

    // Fallback: if no services found via DB/view, but service_categories is present (JSON),
    // flatten categories -> services and use that as a fallback.
    try {
      if ((publicSalon.services || []).length === 0 && (salonRow.service_categories || salonRow.serviceCategories)) {
        const svcRaw = salonRow.service_categories || salonRow.serviceCategories;
        const servicesFallback = flattenServicesFromCategories(svcRaw || []);
        if (Array.isArray(servicesFallback) && servicesFallback.length > 0) {
          publicSalon.services = servicesFallback;
          console.log('public_salon_services_fallback_used', { slug, count: servicesFallback.length });
        }
      }
    } catch (err) {
      console.error('public_salon_fetch_err', { slug, step: 'services_fallback', error: (err as Error).message });
    }

    console.log('public_salon_fetch_ok', { slug, services: publicSalon.services.length, team: publicSalon.team_members.length, gallery: publicSalon.gallery_images.length, fields: Object.keys(publicSalon).length });

    // In dev, include a small debug object to help verify which column held the cover
    if (process.env.NODE_ENV !== 'production') {
      const debugInfo: any = {
        src_lengths: {
          salonRow_cover_image_url: salonRow?.cover_image_url ? String(salonRow.cover_image_url).length : 0,
          salonRow_cover_image: salonRow?.cover_image ? String(salonRow.cover_image).length : 0,
          publicSalon_cover_image_url: publicSalon?.cover_image_url ? String(publicSalon.cover_image_url).length : 0,
          publicSalon_cover_image: publicSalon?.cover_image ? String(publicSalon.cover_image).length : 0,
          chosen_cover_len: (publicSalon?.cover_image_url || '').length
        },
        migration: _migrationInfo,
        team_debug: {
          salonRow_team_len: Array.isArray(salonRow?.team_members) ? salonRow.team_members.length : 0,
          publicSalon_team_len: Array.isArray(publicSalon?.team_members) ? publicSalon.team_members.length : 0,
          fetched_team_count: team_members ? team_members.length : 0,
          sample_from_salonRow: (Array.isArray(salonRow?.team_members) && salonRow.team_members.length>0) ? salonRow.team_members[0] : null,
          sample_from_fetched: (team_members && team_members.length>0) ? team_members[0] : null
        }
      };
      return res.json({ ok: true, salon: publicSalon, _dev_debug: debugInfo });
    }

    return res.json({ ok: true, salon: publicSalon });
  } catch (error) {
    console.error('Erreur lors de la récupération du salon public:', error);
    return res.status(500).json({ ok: false, error: 'Erreur serveur' });
  }
});

// Enregistre la route de diagnostic Appwrite uniquement en dev ou si ENABLE_DIAG_ROUTES n'est pas false
if (process.env.NODE_ENV !== "production" && process.env.ENABLE_DIAG_ROUTES !== "false") {
  // app.use("/api", appwriteDiag);
  // app.use("/api/_health/appwrite", appwriteDiag); // Appwrite non utilisé (stack Supabase). Route désactivée volontairement.
}

// Route simple pour vérifier que le serveur tourne
// (optionnel) ancienne healthz
// app.get("/api/_healthz", (_req, res) => {
//   res.json({ ok: true, provider: currentDbProvider, ts: new Date().toISOString() });
// });

(async () => {
  try {
    await seedDefaultSalonTemplate();
    // Vérifier et corriger les public_slug manquants
    await ensureAllSalonsHavePublicSlug();
  } catch (e) {
    console.error("Seed/Migration error:", e);
  }
})();

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SRK length:', process.env.SUPABASE_SERVICE_ROLE_KEY?.length);

// Route simple de création de PaymentIntent
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'eur', metadata = {} } = req.body;
    
    // Validation simple
    if (!amount || amount < 50) {
      return res.status(400).json({ error: 'Montant invalide' });
    }

    // Simuler un clientSecret pour la démo (remplace par vraie intégration Stripe)
    const mockClientSecret = `pi_demo_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`💳 Payment Intent créé: ${amount/100}€ (${currency})`);
    
    res.json({ 
      clientSecret: mockClientSecret,
      amount,
      currency,
      status: 'requires_payment_method'
    });
  } catch (error) {
    console.error('❌ Erreur create-payment-intent:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour récupérer les créneaux d'un professionnel
app.post('/api/professionals/:professionalId/availability', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'Service temporairement indisponible' });
    }

    const { professionalId } = req.params;
    const { serviceId, dateRange, totalDuration } = req.body;
    
    console.log(`🕒 Récupération créneaux pour professionnel ${professionalId}, service ${serviceId}, durée ${totalDuration}min`);
    
    // Récupérer les données du professionnel depuis l'API publique
    // D'abord, récupérer le salon pour obtenir les professionnels
    const { data: salonData, error: salonError } = await supabase
      .from('salons')
      .select('id, team_members')
      .eq('public_slug', 'salon-15228957')
      .single();

    if (salonError || !salonData) {
      console.error('Salon non trouvé:', salonError);
      return res.status(404).json({ error: 'Salon non trouvé' });
    }

    // Trouver le professionnel dans team_members
    const professional = salonData.team_members?.find((p: any) => p.id == professionalId);
    
    if (!professional) {
      console.error('Professionnel non trouvé dans team_members');
      return res.status(404).json({ error: 'Professionnel non trouvé' });
    }

    // Récupérer les rendez-vous existants pour ce professionnel
    // Note: La table appointments n'a peut-être pas de colonne professional_id
    // On ignore les conflits pour l'instant et on génère tous les créneaux
    const { data: existingAppointments, error: aptError } = await supabase
      .from('appointments')
      .select('date, appointment_time, duration')
      .eq('status', 'confirmed');

    if (aptError) {
      console.error('Erreur récupération rendez-vous:', aptError);
    }

    // Générer les créneaux dynamiques basés sur les données réelles
    const generateSlots = (date: Date, professional: any, totalDuration: number = 60) => {
      const dayOfWeek = date.getDay();
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();
      const currentHour = today.getHours();
      
      // Récupérer les horaires de travail du professionnel
      const workSchedule = professional.work_schedule || professional.workingHours || {
        start: '09:00',
        end: '18:00',
        breaks: []
      };

      const startHour = parseInt(workSchedule.start.split(':')[0]);
      const endHour = parseInt(workSchedule.end.split(':')[0]);
      
      let slots = [];
      
      // Générer les créneaux selon les horaires de travail
      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          
          // Vérifier si le créneau est dans le passé (pour aujourd'hui)
          if (isToday && (hour < currentHour || (hour === currentHour && minute <= today.getMinutes()))) {
            continue;
          }
          
          // Vérifier si le créneau est disponible (pas de conflit avec durée totale)
          const slotStart = new Date(date);
          slotStart.setHours(hour, minute, 0, 0);
          const slotEnd = new Date(slotStart.getTime() + (totalDuration * 60000));
          
          let isAvailable = true;
          let isBooked = false;
          
          // Vérifier les conflits avec les rendez-vous existants
          if (existingAppointments) {
            for (const apt of existingAppointments) {
              if (apt.date === date.toISOString().split('T')[0]) {
                const aptStart = new Date(`${apt.date}T${apt.appointment_time}`);
                const aptDuration = apt.duration ? 
                  (parseInt(apt.duration.split(':')[0]) * 60 + parseInt(apt.duration.split(':')[1])) * 60000 :
                  60 * 60000; // 1h par défaut
                const aptEnd = new Date(aptStart.getTime() + aptDuration);
                
                // Vérifier le chevauchement
                if ((slotStart < aptEnd && slotEnd > aptStart)) {
                  isAvailable = false;
                  isBooked = true;
                  break;
                }
              }
            }
          }
          
          // Vérifier les pauses du professionnel
          if (workSchedule.breaks && Array.isArray(workSchedule.breaks)) {
            for (const breakTime of workSchedule.breaks) {
              const breakStart = new Date(`${date.toISOString().split('T')[0]}T${breakTime.start}`);
              const breakEnd = new Date(`${date.toISOString().split('T')[0]}T${breakTime.end}`);
              
              if (slotStart < breakEnd && slotEnd > breakStart) {
                isAvailable = false;
                break;
              }
            }
          }
          
          slots.push({
            time,
            available: isAvailable,
            booked: isBooked
          });
        }
      }
      
      return slots;
    };
    
    // Générer les créneaux pour la période demandée
    const availability = [];
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' });
      const formattedDate = date.toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      });
      
      availability.push({
        date: formattedDate,
        dayName,
        slots: generateSlots(new Date(date), professional, totalDuration)
      });
    }
    
    res.json({
      professionalId,
      serviceId,
      totalDuration,
      availability
    });
    
  } catch (error) {
    console.error('❌ Erreur availability:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes pour la gestion du staff (team_members)
app.get('/api/staff', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'Service temporairement indisponible' });
    }

    // Récupérer le salon de l'utilisateur connecté
    const session = req.session as any;
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    // Récupérer le salon de l'utilisateur
    const { data: salon, error: salonError } = await supabase
      .from('salons')
      .select('id, team_members')
      .eq('owner_id', session.user.id)
      .single();

    if (salonError || !salon) {
      console.error('Erreur récupération salon:', salonError);
      return res.status(404).json({ error: 'Salon non trouvé' });
    }

    // Récupérer les professionnels depuis la table professionnels
    const { data: professionnels, error: proError } = await supabase
      .from('professionnels')
      .select('*')
      .eq('salon_id', salon.id);

    if (proError) {
      console.error('Erreur récupération professionnels:', proError);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    // Transformer les données pour le frontend
    const staff = (professionnels || []).map((member: any) => ({
      id: member.id,
      firstName: member.first_name || member.name?.split(' ')[0] || 'Prénom',
      lastName: member.last_name || member.name?.split(' ').slice(1).join(' ') || 'Nom',
      email: member.email || `${member.name?.toLowerCase().replace(/\s+/g, '.') || 'staff'}@salon.com`,
      phone: member.phone || '0123456789',
      role: member.role || member.title || 'Professionnel',
      specialties: Array.isArray(member.specialties) ? member.specialties : (member.specialties?.split(',') || ['Coupe']),
      commissionRate: member.commissionRate || 50,
      isActive: member.isActive !== false,
      rating: member.rating || 4.5,
      experience: member.experience || 'Expérimenté',
      bio: member.bio || '',
      avatar: member.avatar || member.photo || '',
      ...member
    }));

    console.log(`✅ Staff récupéré pour salon ${salon.id}: ${staff.length} membres`);

    res.json(staff);
  } catch (error) {
    console.error('❌ Erreur API staff:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/staff', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'Service temporairement indisponible' });
    }

    const session = req.session as any;
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const { firstName, lastName, email, phone, role, specialties, commissionRate, isActive } = req.body;

    // Récupérer le salon de l'utilisateur
    const { data: salon, error: salonError } = await supabase
      .from('salons')
      .select('id')
      .eq('owner_id', session.user.id)
      .single();

    if (salonError || !salon) {
      console.error('Erreur récupération salon:', salonError);
      return res.status(404).json({ error: 'Salon non trouvé' });
    }

    // Créer le professionnel dans la table professionnels
    const newProfessional = {
      salon_id: salon.id,
      first_name: firstName,
      last_name: lastName,
      name: `${firstName} ${lastName}`,
      email: email,
      phone: phone,
      role: role,
      title: role,
      specialties: Array.isArray(specialties) ? specialties : [specialties],
      commissionRate: commissionRate || 50,
      isActive: isActive !== false,
      bio: `Professionnel ${role} expérimenté`,
      rating: 4.5,
      review_count: 0,
      next_available: 'Aujourd\'hui',
      work_schedule: {
        start: '09:00',
        end: '18:00',
        breaks: []
      }
    };

    const { data: createdProfessional, error: createError } = await supabase
      .from('professionnels')
      .insert([newProfessional])
      .select()
      .single();

    if (createError) {
      console.error('Erreur création professionnel:', createError);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    console.log(`✅ Professionnel créé: ${firstName} ${lastName} pour salon ${salon.id}`);

    res.json(createdProfessional);
  } catch (error) {
    console.error('❌ Erreur ajout staff:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.put('/api/staff/:id', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'Service temporairement indisponible' });
    }

    const session = req.session as any;
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const staffId = req.params.id;
    const updates = req.body;

    // Récupérer le salon de l'utilisateur
    const { data: salon, error: salonError } = await supabase
      .from('salons')
      .select('id')
      .eq('owner_id', session.user.id)
      .single();

    if (salonError || !salon) {
      console.error('Erreur récupération salon:', salonError);
      return res.status(404).json({ error: 'Salon non trouvé' });
    }

    // Vérifier que le professionnel appartient au salon
    const { data: professional, error: proError } = await supabase
      .from('professionnels')
      .select('*')
      .eq('id', staffId)
      .eq('salon_id', salon.id)
      .single();

    if (proError || !professional) {
      console.error('Professionnel non trouvé:', proError);
      return res.status(404).json({ error: 'Membre non trouvé' });
    }

    // Préparer les mises à jour
    const updateData = {
      ...updates,
      name: updates.firstName && updates.lastName ? `${updates.firstName} ${updates.lastName}` : professional.name
    };

    // Mettre à jour le professionnel
    const { data: updatedProfessional, error: updateError } = await supabase
      .from('professionnels')
      .update(updateData)
      .eq('id', staffId)
      .eq('salon_id', salon.id)
      .select()
      .single();

    if (updateError) {
      console.error('Erreur mise à jour professionnel:', updateError);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    console.log(`✅ Professionnel mis à jour: ${staffId}`);

    res.json(updatedProfessional);
  } catch (error) {
    console.error('❌ Erreur modification staff:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.delete('/api/staff/:id', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'Service temporairement indisponible' });
    }

    const session = req.session as any;
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const staffId = req.params.id;

    // Récupérer le salon de l'utilisateur
    const { data: salon, error: salonError } = await supabase
      .from('salons')
      .select('id')
      .eq('owner_id', session.user.id)
      .single();

    if (salonError || !salon) {
      console.error('Erreur récupération salon:', salonError);
      return res.status(404).json({ error: 'Salon non trouvé' });
    }

    // Vérifier que le professionnel appartient au salon
    const { data: professional, error: proError } = await supabase
      .from('professionnels')
      .select('id')
      .eq('id', staffId)
      .eq('salon_id', salon.id)
      .single();

    if (proError || !professional) {
      console.error('Professionnel non trouvé:', proError);
      return res.status(404).json({ error: 'Membre non trouvé' });
    }

    // Supprimer le professionnel
    const { error: deleteError } = await supabase
      .from('professionnels')
      .delete()
      .eq('id', staffId)
      .eq('salon_id', salon.id);

    if (deleteError) {
      console.error('Erreur suppression professionnel:', deleteError);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    console.log(`✅ Professionnel supprimé: ${staffId}`);

    res.json({ message: 'Membre supprimé avec succès' });
  } catch (error) {
    console.error('❌ Erreur suppression staff:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/staff/stats', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'Service temporairement indisponible' });
    }

    const session = req.session as any;
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    // Récupérer le salon de l'utilisateur
    const { data: salon, error: salonError } = await supabase
      .from('salons')
      .select('id')
      .eq('owner_id', session.user.id)
      .single();

    if (salonError || !salon) {
      console.error('Erreur récupération salon:', salonError);
      return res.status(404).json({ error: 'Salon non trouvé' });
    }

    // Récupérer les statistiques des rendez-vous
    const { data: appointments, error: aptError } = await supabase
      .from('appointments')
      .select('revenue, rating, status')
      .eq('salon_id', salon.id);

    if (aptError) {
      console.error('Erreur récupération statistiques:', aptError);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    // Calculer les statistiques
    const totalRevenue = appointments?.reduce((sum: any, apt: any) => sum + (apt.revenue || 0), 0) || 0;
    const totalAppointments = appointments?.length || 0;
    const ratings = appointments?.filter((apt: any) => apt.rating).map((apt: any) => apt.rating) || [];
    const averageRating = ratings.length > 0 ? ratings.reduce((sum: any, rating: any) => sum + rating, 0) / ratings.length : 4.5;

    res.json({
      totalRevenue,
      totalAppointments,
      averageRating: Math.round(averageRating * 10) / 10,
      completedAppointments: appointments?.filter((apt: any) => apt.status === 'completed' || !apt.status).length || 0
    });
  } catch (error) {
    console.error('❌ Erreur stats staff:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour récupérer les services assignés à un employé
app.get('/api/staff/:staffId/services', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'Service temporairement indisponible' });
    }

    const session = req.session as any;
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const { staffId } = req.params;

    // Récupérer le salon de l'utilisateur
    const { data: salon, error: salonError } = await supabase
      .from('salons')
      .select('id, services')
      .eq('owner_id', session.user.id)
      .single();

    if (salonError || !salon) {
      console.error('Erreur récupération salon:', salonError);
      return res.status(404).json({ error: 'Salon non trouvé' });
    }

    // Vérifier que l'employé existe et appartient au salon
    const { data: professional, error: proError } = await supabase
      .from('professionnels')
      .select('id, specialties')
      .eq('id', staffId)
      .eq('salon_id', salon.id)
      .single();

    if (proError || !professional) {
      console.error('Employé non trouvé:', proError);
      return res.status(404).json({ error: 'Employé non trouvé' });
    }

    // Récupérer tous les services du salon
    const allServices = salon?.services || [];
    
    // Filtrer les services selon les spécialités du professionnel
    let assignedServices = allServices;
    if (professional.specialties && Array.isArray(professional.specialties)) {
      assignedServices = allServices.filter((service: any) => 
        professional.specialties.some((specialty: any) => 
          service.category === specialty || 
          service.name.toLowerCase().includes(specialty.toLowerCase())
        )
      );
    }
    
    console.log(`✅ Services récupérés pour employé ${staffId}: ${assignedServices.length} services`);
    
    res.json(assignedServices);
  } catch (error) {
    console.error('❌ Erreur récupération services employé:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour récupérer les avis et la note d'un employé
app.get('/api/staff/:staffId/reviews', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'Service temporairement indisponible' });
    }

    const session = req.session as any;
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const { staffId } = req.params;

    // Vérifier que l'employé appartient au salon de l'utilisateur
    const { data: salon, error: salonError } = await supabase
      .from('salons')
      .select('id')
      .eq('owner_id', session.user.id)
      .single();

    if (salonError || !salon) {
      console.error('Erreur récupération salon:', salonError);
      return res.status(404).json({ error: 'Salon non trouvé' });
    }

    // Vérifier que l'employé existe et appartient au salon
    const { data: professional, error: proError } = await supabase
      .from('professionnels')
      .select('id')
      .eq('id', staffId)
      .eq('salon_id', salon.id)
      .single();

    if (proError || !professional) {
      console.error('Employé non trouvé:', proError);
      return res.status(404).json({ error: 'Employé non trouvé' });
    }

    // Récupérer les avis pour cet employé depuis la table appointments
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('professional_id', staffId)
      .not('rating', 'is', null)
      .order('date', { ascending: false });

    if (error) {
      console.error('Erreur récupération avis:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    // Calculer la note moyenne et le nombre d'avis
    const reviews = appointments || [];
    const totalRating = reviews.reduce((sum: any, apt: any) => sum + (apt.rating || 0), 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    
    console.log(`✅ Avis récupérés pour employé ${staffId}: ${reviews.length} avis, note moyenne: ${averageRating.toFixed(1)}`);
    
    res.json({
      averageRating: Math.round(averageRating * 10) / 10, // Arrondir à 1 décimale
      reviewCount: reviews.length,
      reviews: reviews.map((apt: any) => ({
        id: apt.id,
        rating: apt.rating,
        comment: apt.comment || '',
        clientName: apt.client_name,
        date: apt.date,
        service: apt.service
      }))
    });
  } catch (error) {
    console.error('❌ Erreur récupération avis employé:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes pour la gestion des appointments
app.get('/api/appointments', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'Service temporairement indisponible' });
    }

    // Vérifier l'authentification
    const session = req.session as any;
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const sessionUserId = session.user.id;
    const { date, professional_id, salon_id, salon_slug } = req.query as { [k: string]: string };

    // Résoudre l'owner à filtrer: priorité au salon_id / salon_slug si fournis
    let ownerToFilter = sessionUserId;
    if (salon_id) {
      const { data: salonById } = await supabase
        .from('salons')
        .select('owner_id')
        .eq('id', salon_id)
        .single();
      if (salonById?.owner_id) ownerToFilter = salonById.owner_id;
    } else if (salon_slug) {
      const { data: salonBySlug } = await supabase
        .from('salons')
        .select('owner_id')
        .eq('public_slug', salon_slug)
        .single();
      if (salonBySlug?.owner_id) ownerToFilter = salonBySlug.owner_id;
    }

    console.log('🗓️ Récupération appointments - Owner:', ownerToFilter, 'Date:', date, 'Professional:', professional_id, 'salon_id:', salon_id, 'salon_slug:', salon_slug);

    // 🔒 FILTRAGE STRICT PAR USER_ID : Construire la requête
    let query = supabase
      .from('appointments')
      .select('*')
      .eq('user_id', ownerToFilter) // 🔒 FILTRAGE strict par propriétaire du salon
      .order('date', { ascending: true })
      .order('appointment_time', { ascending: true });

    // Filtrer par date si fournie
    if (date) {
      query = query.eq('date', date); // Format YYYY-MM-DD exact
    }

    // Filtrer par professional si fourni
    if (professional_id && typeof professional_id === 'string') {
      query = query.eq('professional_id', professional_id);
    }

    const { data: appointments, error } = await query;

    if (error) {
      console.error('Erreur récupération appointments pour owner:', ownerToFilter, error);
      return res.status(500).json({ error: 'Erreur serveur', details: error.message });
    }

    console.log('📋 Appointments trouvés pour owner', ownerToFilter, ':', appointments?.length || 0);

    // Transformer les données pour le planning
    const formattedAppointments = (appointments || []).map((apt: any) => {
      // Extraire l'heure de début - utiliser appointment_time
      const timeStr = apt.appointment_time || '08:00';
      const [hours, minutes] = timeStr.split(':').map(Number);
      
      // Calculer la durée depuis la colonne duration
      let durationMinutes = 60; // par défaut
      if (apt.duration) {
        const durationParts = apt.duration.split(':');
        durationMinutes = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
      }
      
      // Calculer l'heure de fin
      const startMinutes = hours * 60 + minutes;
      const endMinutes = startMinutes + durationMinutes;
      const endHours = Math.floor(endMinutes / 60);
      const endMins = endMinutes % 60;
      
      return {
        id: apt.id,
        // Frontend expects these exact keys
        appointmentDate: apt.date || new Date().toISOString().split('T')[0],
        startTime: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
        endTime: `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`,
        status: apt.status || 'scheduled',
        // Optional metadata used in some views
        clientName: apt.client_name,
        service: apt.service || 'Service',
        staffId: apt.professional_id || null,
        duration: durationMinutes,
        notes: apt.notes || '',
        type: 'client',
        price: apt.revenue || apt.price || 50,
        clientEmail: apt.client_email,
        clientPhone: apt.client_phone
      };
    });

    res.json(formattedAppointments);
  } catch (error) {
    console.error('Erreur API appointments:', error);
    res.status(500).json({ error: 'Erreur serveur', details: error instanceof Error ? error.message : 'Erreur inconnue' });
  }
});

// Fonction helper pour calculer l'heure de fin
function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const startMinutes = (hours || 0) * 60 + (minutes || 0);
  const endMinutes = startMinutes + durationMinutes;
  const endHours = Math.floor(endMinutes / 60) % 24;
  const endMins = endMinutes % 60;
  return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}:00`;
}

// API pour créer un nouveau rendez-vous
app.post('/api/appointments', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'Service temporairement indisponible' });
    }

    const { 
      client_name, 
      service, 
      date, 
      start_time, 
      duration, 
      price,
      salon_slug // Slug du salon pour les réservations publiques
    } = req.body;

    console.log('📝 Création appointment:', { client_name, service, date, start_time, salon_slug });

    // Normalisation + validation des données obligatoires
    const safeClientName = (typeof client_name === 'string' && client_name.trim().length > 0)
      ? client_name.trim()
      : 'Client';
    if (!service || !date || !start_time) {
      return res.status(400).json({ error: 'Données obligatoires manquantes' });
    }

    let salonId: string | undefined;
    let userId: string | undefined;

    // CAS 1: Utilisateur authentifié (tableau de bord salon)
    const session = req.session as any;
    if (session?.user?.id) {
      userId = session.user.id;
      console.log('📝 Rendez-vous créé via session utilisateur:', userId);
      
      // Récupérer le salon_id du propriétaire connecté
      const { data: userSalon, error: userSalonError } = await supabase
        .from('salons')
        .select('id')
        .eq('owner_id', userId)
        .single();

      if (userSalonError || !userSalon) {
        // Fallback: si on a un slug public dans la requête, on l'utilise pour récupérer le salon
        if (salon_slug) {
          const { data: salonBySlug } = await supabase
            .from('salons')
            .select('id, owner_id')
            .eq('public_slug', salon_slug)
            .single();
          if (salonBySlug) {
            salonId = salonBySlug.id;
            userId = salonBySlug.owner_id || userId;
            console.log('📝 Fallback slug → salon_id:', salonId);
          } else {
            // Dernier fallback: accepter l'insertion sans salon si userId est connu
            console.warn('⚠️ Salon introuvable via session/slug, insertion avec user_id uniquement');
          }
        } else {
          console.warn('⚠️ Salon introuvable pour cet utilisateur, insertion avec user_id uniquement');
        }
      } else {
        salonId = userSalon.id;
        console.log('📝 Salon ID récupéré:', salonId);
      }
    }
    // CAS 2: Réservation publique via salon_slug (pas d'authentification requise)
    else if (salon_slug) {
      console.log('📝 Recherche du salon via slug:', salon_slug);
      
      // Récupérer le salon via son slug
      const { data: salon, error: salonError } = await supabase
        .from('salons')
        .select('id, owner_id, name')
        .eq('public_slug', salon_slug)
        .single();

      if (salonError || !salon) {
        return res.status(404).json({ error: 'Salon non trouvé pour ce slug: ' + salon_slug });
      }

      salonId = salon.id;
      userId = salon.owner_id;
      console.log('📝 Rendez-vous créé pour salon public:', salon_slug, 'salon_id:', salonId);
    }
    else {
      return res.status(401).json({ error: 'Authentification requise ou salon_slug manquant' });
    }
    
    // Vérifier que salonId est défini
    if (!salonId) {
      return res.status(400).json({ error: 'Salon ID manquant' });
    }

    // Préparer les données selon le schéma réel de la table appointments
    const appointmentData = {
      user_id: userId, // Référence vers l'utilisateur professionnel
      client_name: safeClientName,
      service: service || 'Service non spécifié',
      date: date, // Format YYYY-MM-DD
      appointment_time: start_time, // Format HH:MM
      duration: `00:${Math.floor((duration || 60) / 60).toString().padStart(2, '0')}:${((duration || 60) % 60).toString().padStart(2, '0')}`, // Format HH:MM:SS
      revenue: price || 50,
      created_at: new Date().toISOString()
    };

    console.log('💾 Données appointment avec salon_id:', { salon_id: salonId || 'N/A', client_name, date, start_time });

    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert([appointmentData])
      .select()
      .single();

    if (error) {
      console.error('Erreur création appointment pour user:', userId, error);
      return res.status(500).json({ error: 'Erreur création rendez-vous', details: error.message });
    }

    console.log('✅ Appointment créé pour le salon de user:', userId, 'appointment_id:', appointment.id);
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Erreur API création appointment:', error);
    res.status(500).json({ error: 'Erreur serveur', details: error instanceof Error ? error.message : 'Erreur inconnue' });
  }
});

const PORT = Number(process.env.PORT || 3000);

// Bootstrap: mount optional full-stack routes first, then start listening
async function bootstrap() {
  try {
    console.log('✅ Routes de paiement montées');

    // ENDPOINT DE TEST: Auto-login pour tester l'isolation des salons
    app.post('/api/test-login-salon', async (req, res) => {
      const { salonOwnerId } = req.body;
      
      if (!salonOwnerId) {
        return res.status(400).json({ error: 'salonOwnerId requis' });
      }

      // Simuler une session utilisateur
      const session = req.session as any;
      session.user = {
        id: salonOwnerId,
        email: `salon-${salonOwnerId}@test.com`,
        firstName: 'Salon',
        lastName: 'Test',
        salonName: `Salon ${salonOwnerId}`,
      };

      console.log('🧪 Session test créée pour salon:', salonOwnerId);
      res.json({ success: true, user: session.user });
    });

    // ENDPOINT DE TEST: Vérifier l'isolation des appointments
    app.get('/api/test-isolation', async (req, res) => {
      const session = req.session as any;
      if (!session?.user?.id) {
        return res.status(401).json({ error: 'Non authentifié' });
      }

      try {
        const { data: appointments, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('user_id', session.user.id);

        if (error) {
          return res.status(500).json({ error: error.message });
        }

        res.json({
          user: session.user,
          appointmentCount: appointments?.length || 0,
          appointments: appointments || []
        });
      } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
      }
    });

    // ENDPOINT DE DIAGNOSTIC: Voir la structure de la table appointments
    app.get('/api/test-table-structure', async (req, res) => {
      try {
        // Récupérer TOUS les enregistrements pour avoir le vrai count
        const { data: allRecords, error: allError } = await supabase
          .from('appointments')
          .select('*')
          .order('created_at', { ascending: false });

        if (allError) {
          return res.status(500).json({ 
            error: allError.message,
            hint: 'Erreur lors de la lecture de la table appointments'
          });
        }

        // Récupérer un échantillon pour voir la structure
        const { data: sample, error } = await supabase
          .from('appointments')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          return res.status(500).json({ 
            error: error.message,
            hint: 'Erreur lors de la lecture de la table appointments'
          });
        }

        res.json({
          sampleRecord: sample?.[0] || null,
          recordCount: allRecords?.length || 0,
          allRecords: allRecords || [],
          availableColumns: sample?.[0] ? Object.keys(sample[0]) : [],
          hint: 'Structure de la table appointments'
        });
      } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
      }
    });

    // ENDPOINT: Récupérer le propriétaire d'un salon par son slug (pour les réservations)
    app.get('/api/salon/:slug/owner', async (req, res) => {
      try {
        const { slug } = req.params;
        
        // Chercher le salon par son public_slug
        const { data: salon, error } = await supabase
          .from('salons')
          .select('id, owner_id, name, public_slug')
          .eq('public_slug', slug)
          .single();

        if (error || !salon) {
          return res.status(404).json({ error: 'Salon non trouvé' });
        }

        res.json({
          salonId: salon.id,
          ownerId: salon.owner_id,
          salonName: salon.name,
          slug: salon.public_slug
        });
      } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
      }
    });

    // ENDPOINT DE TEST: Vérifier qui est connecté
    app.get('/api/test-whoami', async (req, res) => {
      const session = req.session as any;
      
      if (!session?.user) {
        return res.json({ 
          authenticated: false, 
          message: 'Aucune session active' 
        });
      }
      
      return res.json({ 
        authenticated: true, 
        user: session.user,
        sessionId: req.sessionID || 'unknown'
      });
    });

    // ROUTE DE DEBUG: Page de test planning
    app.get('/debug-planning', (req, res) => {
      res.sendFile('/Users/agash/Downloads/ALICIAAA/debug-planning.html');
    });

    // ROUTE DE DEBUG: Page de test login frontend  
    app.get('/test-login', (req, res) => {
      res.sendFile('/Users/agash/Downloads/ALICIAAA/test-login-frontend.html');
    });

    // ROUTE: Connexion automatique pro
    app.get('/connexion-auto', (req, res) => {
      res.sendFile('/Users/agash/Downloads/ALICIAAA/connexion-auto.html');
    });

    // ENDPOINT SPECIAL: Connexion directe pour le compte pro
    app.post('/api/login-direct-pro', async (req, res) => {
      try {
        const userId = 'pro-account-12345';
        
        const session = req.session as any;
        session.user = {
          id: userId,
          email: `salon-${userId}@test.com`,
          firstName: 'Salon',
          lastName: 'Pro',
          salonName: 'Mon Salon Pro'
        };

        res.json({ 
          success: true, 
          user: session.user,
          message: 'Connecté au compte pro avec rendez-vous'
        });
      } catch (error) {
        res.status(500).json({ error: 'Erreur connexion' });
      }
    });

    // ENDPOINT: Connexion avec le compte qui a vraiment les données
    app.post('/api/login-with-data', async (req, res) => {
      try {
        const userId = '47b38fc8-a9d5-4253-9618-08e81963af42'; // Le compte qui a les vrais rendez-vous
        
        const session = req.session as any;
        session.user = {
          id: userId,
          email: `salon-${userId}@test.com`,
          firstName: 'Salon',
          lastName: 'Test',
          salonName: 'Salon avec rendez-vous'
        };

        console.log('🔑 Connexion test avec système salon_id pour user:', userId);

        res.json({ 
          success: true, 
          user: session.user,
          message: 'Connecté au compte avec isolation par salon_id'
        });
      } catch (error) {
        res.status(500).json({ error: 'Erreur connexion' });
      }
    });

    // Ajout des routes manquantes directement
    console.log('🔧 Ajout des routes manquantes...');
    
    // Route placeholder pour éviter les 404
    app.get('/api/placeholder/:width/:height', (req, res) => {
      res.status(404).json({ error: 'Placeholder image not found' });
    });

    // Route /api/booking-pages/:id
    app.get('/api/booking-pages/:id', async (req, res) => {
      try {
        const { id } = req.params;
        console.log('📖 Récupération page salon (booking-pages):', id);
        
        // Logique simplifiée pour récupérer les données du salon
        const { data: salon, error } = await supabase
          .from('salons')
          .select('*')
          .eq('public_slug', id)
          .single();
          
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
    
    // Route /api/auth/user
    app.get('/api/auth/user', async (req, res) => {
      try {
        const session = req.session as any;
        
        if (!session?.user) {
          return res.status(401).json({ error: 'Non authentifié' });
        }
        
        res.json({
          success: true,
          user: session.user
        });
      } catch (error) {
        console.error('Erreur récupération utilisateur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
      }
    });
    
    // Route /api/clients
    app.get('/api/clients', async (req, res) => {
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
    app.get('/api/services', async (req, res) => {
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
    
    console.log('✅ Routes manquantes ajoutées');

    // IMPORTANT: on écoute réellement
    const server = app.listen(PORT, () => {
      console.log(`✅ API Avyento démarrée sur http://localhost:${PORT}`);
    });

    // Gestion propre des signaux pour shutdown
    ['SIGINT', 'SIGTERM'].forEach(sig => {
      process.on(sig, () => {
        server.close(() => {
          console.log('Shutting down…');
          process.exit(0);
        });
      });
    });
  } catch (e) {
    console.error('❌ Failed to start server:', e);
    process.exit(1);
  }
}

bootstrap().catch(err => {
  console.error('❌ Bootstrap failed:', err && err.message ? err.message : err);
  process.exit(1);
});