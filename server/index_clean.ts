import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import { createClient } from '@supabase/supabase-js';
import { hashSync, compareSync } from 'bcryptjs';

dotenv.config();

const app = express();

// Configuration CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:5174',
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration session
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24h
  }
}));

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Health check
app.get('/ping', (_req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

// Registration endpoint pour clients
app.post('/api/client/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    // Vérifier si l'utilisateur existe déjà
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .limit(1)
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ error: 'Un compte avec cet email existe déjà' });
    }

    // Hash du mot de passe
    const hashedPassword = hashSync(password, 12);

    // Insérer dans la table users
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, password: hashedPassword }])
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Erreur insertion:', error);
      return res.status(500).json({ error: error.message });
    }

    // Créer la session
    (req.session as any).user = {
      id: data?.id,
      email: data?.email,
      userType: 'client'
    };

    // Générer un token
    const token = Buffer.from(`${data?.id || 'temp'}:${Date.now()}`).toString('base64');

    res.json({
      success: true,
      user: {
        id: data?.id,
        email: data?.email,
        userType: 'client'
      },
      token
    });

  } catch (error) {
    console.error('Erreur registration client:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Login endpoint unifié
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    // Chercher d'abord dans users (clients)
    let userData = null;
    let userType = 'client';
    
    const { data: clientUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1)
      .maybeSingle();

    if (clientUser) {
      userData = clientUser;
      userType = 'client';
    } else {
      // Chercher dans pro_users (professionnels)
      const { data: proUser } = await supabase
        .from('pro_users')
        .select('*')
        .eq('email', email)
        .limit(1)
        .maybeSingle();

      if (proUser) {
        userData = proUser;
        userType = 'pro';
      }
    }

    if (!userData || !compareSync(password, userData.password)) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    // Créer la session
    (req.session as any).user = {
      id: userData.id,
      email: userData.email,
      userType
    };

    res.json({
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        userType
      }
    });

  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Route salon pour clients
app.get('/api/salon/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const { data: salon, error } = await supabase
      .from('salons')
      .select(`
        *,
        pro_users!salons_user_id_fkey (name, email),
        services (*)
      `)
      .eq('public_slug', slug)
      .limit(1)
      .maybeSingle();

    if (error || !salon) {
      return res.status(404).json({ error: 'Salon non trouvé' });
    }

    res.json(salon);
  } catch (error) {
    console.error('Erreur récupération salon:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur le port ${PORT}`);
  console.log(`📡 API disponible à http://localhost:${PORT}`);
});