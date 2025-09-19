import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', override: true });
dotenv.config();

if (!process.env.SUPABASE_URL || !/^https:\/\/.*\.supabase\.(co|in)$/.test(process.env.SUPABASE_URL)) {
  console.error('❌ SUPABASE_URL absent ou invalide :', process.env.SUPABASE_URL);
  process.exit(1);
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY.length < 40) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY absent ou trop court. Longueur :', process.env.SUPABASE_SERVICE_ROLE_KEY?.length);
  process.exit(1);
}
console.log('SUPABASE_URL =', process.env.SUPABASE_URL);
console.log('SRK length =', process.env.SUPABASE_SERVICE_ROLE_KEY.length);
import { seedDefaultSalonTemplate } from "./seedData";

import 'dotenv/config';
import express from "express";
import cors from "cors";
import morgan from "morgan";
import session from "express-session";

// Optionnel: stub DB health
let healthDb;
try {
  healthDb = (await import("./routes/healthDb")).default;
} catch {}
import { Router } from 'express';
import salonsRouter from './routes/salons';
import dashboardRouter from './routes/dashboard';

const app = express();

app.use(express.json());

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

app.use(cors());
app.use(morgan("dev"));
app.use(session({
  secret: 'un_secret_sûr',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, sameSite: 'lax' }
}));

// 1) Health HTTP
app.get("/healthz", (_req, res) => res.status(200).json({ ok: true }));

// 2) (Optionnel) health DB stub si tu l'as
if (healthDb) {
  app.use("/api/_health/db", healthDb);
}

// 3) Routes salons — IMPORTANT
app.use("/api/salons", salonsRouter); // ← monte toutes les routes salons ici
app.use("/api/salons", salonsRouter); // ← monte toutes les routes salons ici
import { compareSync } from 'bcryptjs';
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

  const { data: users, error } = await supabase
    .from('pro_users')
    .select('*')
    .ilike('email', email)
    .limit(1);

  if (error) return res.status(500).json({ error: error.message });

  const user = users?.[0];
  if (!user) return res.status(401).json({ error: 'Identifiants incorrects' });

  const ok = compareSync(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Identifiants incorrects' });

  const session = req.session as typeof req.session & AliciaSessionData;
  session.user = {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    salonName: user.salon_name,
  };
  return res.json({
    ok: true,
    user: session.user
  });
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
  } catch (e) {
    console.error("Seed error:", e);
  }
})();

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SRK length:', process.env.SUPABASE_SERVICE_ROLE_KEY?.length);


const PORT = Number(process.env.PORT || 3000);
// IMPORTANT: on écoute réellement
const server = app.listen(PORT, () => {
  console.log(`✅ API Avyento démarrée sur http://localhost:${PORT}`);
  // console.log(`🔌 DB_PROVIDER=supabase`);
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


const router = Router();

router.use('/salons', salonsRouter);

// ...autres routes...
// (optionnel) export pour tests
export default app;
