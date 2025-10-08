
import { seedDefaultSalonTemplate } from './seedData';
import { ensureAllSalonsHavePublicSlug } from './migrations/ensurePublicSlugs';
import { Router } from 'express';
// Optionnel: stub DB health
// let healthDb; // doublon supprimé
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
import { storage } from './storage';

const app = express();

// Lightweight ping endpoint to verify server responsiveness quickly
app.get('/ping', (_req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

// PATCH /api/salon/my-salon : modifie le public_slug du salon du user connecté
app.patch('/api/salon/my-salon', async (req, res) => {
  const session = req.session as typeof req.session & { user?: { id: string } };
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Non authentifié' });
  }
  const { name } = req.body;
  if (typeof name !== 'string' || name.length < 2 || name.length > 100) {
    return res.status(400).json({ error: 'Nom du salon invalide.' });
  }
  try {
    // Générer le slug à partir du nouveau nom
    const generatedSlug = slugify(name);
    if (!generatedSlug || generatedSlug.length < 2 || generatedSlug.length > 100 || !/^[a-zA-Z0-9-_]+$/.test(generatedSlug)) {
      return res.status(400).json({ error: 'Nom du salon invalide pour générer le slug.' });
    }

    // Vérifier unicité du slug
    const { data: existing, error: checkErr } = await supabase
      .from('salons')
      .select('id')
      .eq('public_slug', generatedSlug)
      .neq('owner_id', session.user.id)
      .maybeSingle();
    if (checkErr) return res.status(500).json({ error: checkErr.message });
    if (existing) return res.status(409).json({ error: 'Ce lien est déjà utilisé par un autre salon.' });

    // Mettre à jour le nom et le slug du salon du user connecté
    const { data: salon, error: fetchErr } = await supabase
      .from('salons')
      .select('id')
      .eq('owner_id', session.user.id)
      .single();
    if (fetchErr || !salon) return res.status(404).json({ error: 'Salon non trouvé' });

    const { error: updateErr } = await supabase
      .from('salons')
      .update({ name, public_slug: generatedSlug })
      .eq('id', salon.id);
    if (updateErr) return res.status(500).json({ error: updateErr.message });

    res.json({ success: true, public_slug: generatedSlug, name });
  } catch (e) {
    console.error('Erreur PATCH /api/salon/my-salon:', e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// (imports uniques ci-dessus, doublons supprimés)

// PATCH /api/salon/my-salon : modifie le public_slug du salon du user connecté
app.patch('/api/salon/my-salon', async (req, res) => {
  const session = req.session;
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

app.use(session({
  secret: 'un_secret_sûr',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, sameSite: 'lax' }
}));

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
  const session = req.session as typeof req.session & AliciaSessionData;
  if (!session.user) {
    return res.status(401).json({ user: null });
  }
  res.json({ user: session.user });
});

// Route GET /api/me : alias pour compatibilité avec useAuth
app.get('/api/me', (req, res) => {
  const session = req.session as typeof req.session & AliciaSessionData;
  if (!session.user) {
    return res.json({ ok: false, user: null });
  }
  res.json({ ok: true, user: { id: session.user.id, role: 'pro' } });
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
        
        console.log('✅ Utilisateur déconnecté avec succès');
        // Redirection vers la page d'accueil
        res.redirect('/');
      });
    } else {
      console.log('ℹ️ Aucune session active à détruire');
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
      const m = h.match(/^Bearer\s+(.+)$/i);
      const token = m?.[1]?.trim();
      if (token === "dev-pro")  req.user = { id: "dev-pro", role: "pro" };
      if (token === "dev-user") req.user = { id: "dev-user", role: "user" };
    }
    next();
  });
}

// Validation environnement au boot
logEnvironmentStatus();

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
    sameSite: 'none', // Permet les cookies cross-domain en dev
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
      const { supabaseConfig } = await import('./lib/clients/supabaseServer');
      supabaseProject = supabaseConfig.projectHost;
      
      // Ping test simple (lecture publique)
      const { supabasePublic } = await import('./lib/clients/supabaseServer');
      if (!supabasePublic) {
        throw new Error('Supabase client not initialized');
      }
      const { error } = await supabasePublic.from('services').select('id').limit(1);
      
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
app.use("/", professionnelsRouter); // ← monte les routes professionnels (inclut /api/salons/:salonId/professionals)
import { compareSync, hashSync } from 'bcryptjs';
import { supabase } from './db'; // garde ton import existant

app.post('/api/login', async (req, res) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[LOGIN] raw body:', req.body);
  }

  const email = String(req.body?.email ?? '').trim().toLowerCase(); // normaliser l’email
  const password = String(req.body?.password ?? '');                // pas de trim()

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  // Essayer d'abord dans la table users (clients)
  let { data: clients, error: clientError } = await supabase!
    .from('users')
    .select('*')
    .ilike('email', email)
    .limit(1);

  if (clientError) return res.status(500).json({ error: clientError.message });

  let user = clients?.[0];
  let userType = 'client';

  // Si pas trouvé dans users, essayer dans pro_users
  if (!user) {
    const { data: pros, error: proError } = await supabase!
      .from('pro_users')
      .select('*')
      .ilike('email', email)
      .limit(1);

    if (proError) return res.status(500).json({ error: proError.message });
    
    user = pros?.[0];
    userType = 'professional';
  }

  if (!user) return res.status(401).json({ error: 'Identifiants incorrects' });

  const ok = compareSync(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Identifiants incorrects' });

  const session = req.session as typeof req.session & AliciaSessionData;
  session.user = {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    salonName: user.salon_name || null,
  };
  return res.json({
    success: true,
    ok: true,
    user: session.user,
    userType: userType,
    token: `${userType}_${user.id}_${Date.now()}`
  });
});

// ----- FALLBACK D'INSCRIPTION PROFESSIONNELLE (garantie d'écriture en DB)
// Si, pour une raison quelconque, les routes complètes ne sont pas montées,
// ce handler minimal s'assure que /api/register/professional écrit bien dans la base.
app.post('/api/register/professional', async (req, res) => {
  try {
    const userData = req.body || {};
    const email = String(userData.email || '').trim().toLowerCase();
    const firstName = String(userData.firstName || '').trim();
    const lastName = String(userData.lastName || (userData.lastName || '')).trim();
    const businessName = String(userData.businessName || '').trim();
    const password = userData.password || null;

    if (!email || !firstName || !businessName || !password) {
      return res.status(400).json({ error: 'Email, prénom, mot de passe et nom du salon requis' });
    }

    // Vérifier si l'utilisateur existe déjà dans pro_users
    const { data: existing, error: existErr } = await supabase.from('pro_users').select('id').ilike('email', email).limit(1);
    if (existErr) {
      console.error('Supabase check existing error:', existErr);
      return res.status(500).json({ error: 'Erreur serveur lors de la vérification' });
    }
    if (existing && existing.length > 0) {
      return res.status(400).json({ error: 'Un compte avec cet email existe déjà' });
    }

    // Hasher le mot de passe avec bcryptjs (cohérence avec authRoutes.ts)
    const { hashSync } = await import('bcryptjs');
    const hashed = hashSync(String(password), 10);

    const insertPayload: any = {
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

    const { data, error } = await supabase.from('pro_users').insert([insertPayload]).select('id,email').limit(1).maybeSingle();
    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: error.message || 'Erreur insertion Supabase' });
    }

    // Créer la session
    try {
      const sessionAny: any = req.session;
      sessionAny.user = {
        id: data?.id || null,
        email: data?.email || email,
        type: 'professional',
        businessName: businessName,
        isAuthenticated: true
      };
    } catch (e) {
      console.warn('Warning: session unavailable after register', e);
    }

    return res.status(201).json({ success: true, account: data });
  } catch (error: any) {
    console.error('Fallback pro register error (supabase):', error && error.message ? error.message : error);
    return res.status(500).json({ error: "Erreur serveur lors de l'inscription" });
  }
});

// ----- INSCRIPTION CLIENT (table users)
app.post('/api/client/register', async (req, res) => {
  try {
    const userData = req.body || {};
    const email = String(userData.email || '').trim().toLowerCase();
    const password = userData.password || null;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    // Vérifier si l'utilisateur existe déjà dans users
    const { data: existing, error: existErr } = await supabase.from('users').select('id').ilike('email', email).limit(1);
    if (existErr) {
      console.error('Supabase check existing error:', existErr);
      return res.status(500).json({ error: 'Erreur serveur lors de la vérification' });
    }
    if (existing && existing.length > 0) {
      return res.status(409).json({ error: 'Un compte avec cet email existe déjà' });
    }

    // Hasher le mot de passe
    const hashedPassword = hashSync(password, 12);

    // Insérer dans la table users avec structure simplifiée
    const insertPayload = {
      email,
      password: hashedPassword
    };

    const { data, error } = await supabase.from('users').insert([insertPayload]).select('*').limit(1).maybeSingle();
    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: error.message || 'Erreur insertion Supabase' });
    }

    // Créer la session
    try {
      const sessionAny: any = req.session;
      sessionAny.user = {
        id: data?.id || null,
        email: data?.email || email,
        type: 'client',
        userType: 'client'
      };
    } catch (sessionError) {
      console.warn('Session error:', sessionError);
    }

    // Générer un token
    const token = Buffer.from(`${data?.id || 'temp'}:${Date.now()}`).toString('base64');

    res.json({
      success: true,
      user: {
        id: data?.id,
        email: data?.email || email,
        userType: 'client'
      },
      token
    });

  } catch (error) {
    console.error('Erreur registration client:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Route pour récupérer le salon de l'utilisateur connecté
app.get('/api/salon/my-salon', async (req, res) => {
  const session = req.session as typeof req.session & AliciaSessionData;
  if (!session.user) {
    return res.status(401).json({ error: 'Non authentifié' });
  }

  try {
    const { data: salon, error } = await supabase
      .from('salons')
      .select('*')
      .eq('owner_id', session.user.id)
      .single();

    // Ajout du log de debug
    console.log('[DEBUG /api/salon/my-salon] owner_id:', session.user.id, 'salon trouvé:', salon, 'erreur:', error);

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
          coverImageUrl: ''
        });
      }
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
        // Ne pas faire échouer la requête pour autant, utiliser un slug temporaire
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
    console.error('Erreur lors de la récupération du salon:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour créer un salon personnalisé avec URL générée
app.post('/api/salon/create-personalized', async (req, res) => {
  const session = req.session as typeof req.session & AliciaSessionData;
  if (!session.user) {
    return res.status(401).json({ error: 'Non authentifié' });
  }

  try {
  const sup = supabase! as any;
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
      const { data: current, error: fetchSlugErr } = await sup
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
          const { data: exists } = await sup
            .from('salons')
            .select('id')
            .eq('public_slug', uniqueSlug)
            .maybeSingle();
          if (!exists) break;
          attempt += 1;
          uniqueSlug = `${candidate}-${Math.random().toString(36).slice(2, 6)}`;
        }

        // Persist the chosen slug
        const { error: updateSlugErr } = await sup
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
  const session = req.session as typeof req.session & AliciaSessionData;
  if (!session.user) {
    return res.status(401).json({ error: 'Non authentifié' });
  }

  try {
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
    const { slug } = req.params;

    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({ ok: false, error: 'Slug requis' });
    }

    // Use public anon client to respect RLS
    const { supabasePublic } = await import('./lib/clients/supabaseServer');

    if (!supabasePublic) {
      console.error('public_salon_fetch_err', { slug, error: 'supabasePublic client not configured' });
      return res.status(500).json({ ok: false, error: 'Supabase public client not available' });
    }

    let salonRow: any = null;

    // 1) Resolve salon by public_slug first
    try {
      const { data, error } = await supabasePublic
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
        const { data, error } = await supabasePublic
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
        const { data: pros, error: prosErr } = await (supabasePublic as any)
          .from('professionals')
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
          .from('professionals')
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
        // try advanced photos table
        const { data: photos, error: photosErr } = await (supabasePublic as any)
          .from('salon_photos_advanced')
          .select('image_url')
          .eq('salon_id', salonId)
          .order('id', { ascending: true });
        if (!photosErr && Array.isArray(photos)) {
          gallery_images = (photos || []).map((p: any) => p.image_url).filter(Boolean);
        } else if (photosErr) {
          console.error('public_salon_fetch_err', { slug, step: 'gallery', error: photosErr.message });
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
    const { professionalId } = req.params;
    const { serviceId, dateRange } = req.body;
    
    console.log(`🕒 Récupération créneaux pour professionnel ${professionalId}, service ${serviceId}`);
    
    // Simuler des créneaux dynamiques basés sur le professionnel
    const generateSlots = (professionalId: string, date: Date) => {
      const dayOfWeek = date.getDay();
      const isProfessional1 = professionalId.includes('1') || professionalId.includes('hi');
      const isProfessional2 = professionalId.includes('2') || professionalId.includes('oo');
      
      let slots = [];
      
      if (isProfessional1) {
        // Professionnel 1 : disponible matin et fin d'après-midi
        slots = [
          { time: "09:00", available: true, booked: false },
          { time: "09:30", available: true, booked: false },
          { time: "10:00", available: true, booked: false },
          { time: "10:30", available: true, booked: false },
          { time: "11:00", available: true, booked: false },
          { time: "16:00", available: true, booked: false },
          { time: "16:30", available: true, booked: false },
          { time: "17:00", available: true, booked: false },
          { time: "17:30", available: true, booked: false }
        ];
      } else if (isProfessional2) {
        // Professionnel 2 : disponible après-midi
        slots = [
          { time: "14:00", available: true, booked: false },
          { time: "14:30", available: true, booked: false },
          { time: "15:00", available: true, booked: false },
          { time: "15:30", available: true, booked: false },
          { time: "16:00", available: true, booked: false },
          { time: "16:30", available: true, booked: false },
          { time: "18:00", available: true, booked: false },
          { time: "18:30", available: true, booked: false }
        ];
      } else {
        // Professionnel par défaut : toute la journée
        slots = [
          { time: "09:00", available: true, booked: false },
          { time: "09:30", available: true, booked: false },
          { time: "10:00", available: true, booked: false },
          { time: "10:30", available: true, booked: false },
          { time: "14:00", available: true, booked: false },
          { time: "14:30", available: true, booked: false },
          { time: "15:00", available: true, booked: false },
          { time: "15:30", available: true, booked: false },
          { time: "16:00", available: true, booked: false },
          { time: "16:30", available: true, booked: false }
        ];
      }
      
      // Simuler quelques créneaux déjà pris
      if (Math.random() > 0.7) {
        const randomIndex = Math.floor(Math.random() * slots.length);
        slots[randomIndex].booked = true;
        slots[randomIndex].available = false;
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
        slots: generateSlots(professionalId, new Date(date))
      });
    }
    
    res.json({
      professionalId,
      serviceId,
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
      return res.status(500).json({ error: 'Base de données non disponible' });
    }

    // Pour l'instant, on récupère depuis le salon par défaut
    const { data: salon, error } = await supabase
      .from('salons')
      .select('team_members')
      .eq('id', 'b5dcf79a-1ba6-4ef0-be59-63e4789d257e')
      .single();

    if (error) {
      console.error('Erreur récupération staff:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    const staff = (salon?.team_members || []).map((member: any, index: number) => ({
      id: member.id || index + 1,
      firstName: member.firstName || member.name?.split(' ')[0] || member.name || 'Prénom',
      lastName: member.lastName || member.name?.split(' ').slice(1).join(' ') || 'Nom',
      email: member.email || `${member.name?.toLowerCase().replace(/\s+/g, '.') || 'staff'}@salon.com`,
      phone: member.phone || '0123456789',
      role: member.role || member.title || 'Professionnel',
      specialties: Array.isArray(member.specialties) ? member.specialties : (member.specialties?.split(',') || ['Coupe']),
      commissionRate: member.commissionRate || 50,
      isActive: member.isActive !== false,
      ...member
    }));

    res.json(staff);
  } catch (error) {
    console.error('Erreur API staff:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/staff', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Base de données non disponible' });
    }

    const { firstName, lastName, email, phone, role, specialties, commissionRate, isActive } = req.body;

    // Récupérer les team_members actuels
    const { data: salon, error: fetchError } = await supabase
      .from('salons')
      .select('team_members')
      .eq('id', 'b5dcf79a-1ba6-4ef0-be59-63e4789d257e')
      .single();

    if (fetchError) {
      console.error('Erreur récupération salon:', fetchError);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    const currentMembers = salon?.team_members || [];
    const newId = Math.max(0, ...currentMembers.map((m: any) => m.id || 0)) + 1;
    
    const newMember = {
      id: newId,
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      email,
      phone,
      role,
      title: role,
      specialties: Array.isArray(specialties) ? specialties : [specialties],
      commissionRate: commissionRate || 50,
      isActive: isActive !== false,
      bio: `Professionnel ${role} expérimenté`,
      rating: 4.5,
      review_count: 0,
      next_available: 'Aujourd\'hui'
    };

    const updatedMembers = [...currentMembers, newMember];

    // Mettre à jour dans Supabase
    const { error: updateError } = await supabase
      .from('salons')
      .update({ team_members: updatedMembers })
      .eq('id', 'b5dcf79a-1ba6-4ef0-be59-63e4789d257e');

    if (updateError) {
      console.error('Erreur mise à jour team_members:', updateError);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    res.json(newMember);
  } catch (error) {
    console.error('Erreur ajout staff:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.put('/api/staff/:id', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Base de données non disponible' });
    }

    const staffId = parseInt(req.params.id);
    const updates = req.body;

    // Récupérer les team_members actuels
    const { data: salon, error: fetchError } = await supabase
      .from('salons')
      .select('team_members')
      .eq('id', 'b5dcf79a-1ba6-4ef0-be59-63e4789d257e')
      .single();

    if (fetchError) {
      console.error('Erreur récupération salon:', fetchError);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    const currentMembers = salon?.team_members || [];
    const memberIndex = currentMembers.findIndex((m: any) => m.id === staffId);

    if (memberIndex === -1) {
      return res.status(404).json({ error: 'Membre non trouvé' });
    }

    // Mettre à jour le membre
    const updatedMember = {
      ...currentMembers[memberIndex],
      ...updates,
      name: updates.firstName && updates.lastName ? `${updates.firstName} ${updates.lastName}` : currentMembers[memberIndex].name
    };

    currentMembers[memberIndex] = updatedMember;

    // Mettre à jour dans Supabase
    const { error: updateError } = await supabase
      .from('salons')
      .update({ team_members: currentMembers })
      .eq('id', 'b5dcf79a-1ba6-4ef0-be59-63e4789d257e');

    if (updateError) {
      console.error('Erreur mise à jour team_members:', updateError);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    res.json(updatedMember);
  } catch (error) {
    console.error('Erreur modification staff:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.delete('/api/staff/:id', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Base de données non disponible' });
    }

    const staffId = parseInt(req.params.id);

    // Récupérer les team_members actuels
    const { data: salon, error: fetchError } = await supabase
      .from('salons')
      .select('team_members')
      .eq('id', 'b5dcf79a-1ba6-4ef0-be59-63e4789d257e')
      .single();

    if (fetchError) {
      console.error('Erreur récupération salon:', fetchError);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    const currentMembers = salon?.team_members || [];
    const filteredMembers = currentMembers.filter((m: any) => m.id !== staffId);

    if (filteredMembers.length === currentMembers.length) {
      return res.status(404).json({ error: 'Membre non trouvé' });
    }

    // Mettre à jour dans Supabase
    const { error: updateError } = await supabase
      .from('salons')
      .update({ team_members: filteredMembers })
      .eq('id', 'b5dcf79a-1ba6-4ef0-be59-63e4789d257e');

    if (updateError) {
      console.error('Erreur mise à jour team_members:', updateError);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    res.json({ message: 'Membre supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression staff:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/staff/stats', async (req, res) => {
  try {
    // Stats de base pour l'affichage
    res.json({
      totalRevenue: 0,
      totalAppointments: 0,
      averageRating: 4.5
    });
  } catch (error) {
    console.error('Erreur stats staff:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes pour la gestion des appointments
app.get('/api/appointments', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Base de données non disponible' });
    }

    // Vérifier l'authentification
    const session = req.session as typeof req.session & { user?: { id: string; salonId?: string } };
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const sessionUserId = session.user.id;
    const { date, staff_id, salon_id, salon_slug } = req.query as { [k: string]: string };

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

    console.log('🗓️ Récupération appointments - Owner:', ownerToFilter, 'Date:', date, 'Staff:', staff_id, 'salon_id:', salon_id, 'salon_slug:', salon_slug);

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

    // Filtrer par staff si fourni
    if (staff_id && typeof staff_id === 'string') {
      query = query.eq('staff_id', staff_id);
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
        staffId: apt.staff_id || null,
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
      return res.status(500).json({ error: 'Base de données non disponible' });
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

    let salonId: string;
    let userId: string;

    // CAS 1: Utilisateur authentifié (tableau de bord salon)
    const session = req.session as typeof req.session & { user?: { id: string; salonId?: string } };
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

    console.log('💾 Données appointment avec salon_id:', { salon_id: salonId, client_name, date, start_time });

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
      const session = req.session as typeof req.session & AliciaSessionData;
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
      const session = req.session as typeof req.session & AliciaSessionData;
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
      const session = req.session as typeof req.session & AliciaSessionData;
      
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
        
        const session = req.session as typeof req.session & AliciaSessionData;
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
        
        const session = req.session as typeof req.session & AliciaSessionData;
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