console.log('authRoutes chargé et monté');
import { Router } from "express";
import { createClient } from '@supabase/supabase-js';
import { hashSync, compareSync } from "bcryptjs";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const router = Router();

// Inscription client
router.post("/register", async (req, res) => {
  console.log('Données reçues dans /api/register:', req.body);
  const {
    firstName,
    lastName,
    salonName,
    siret,
    email,
    phone,
    city,
    address,
    password
  } = req.body;
  if (!email || !password || !salonName || !firstName || !lastName) return res.status(400).json({ error: "Champs requis manquants" });
  // Vérifie si l'utilisateur existe déjà
  const { data: existing, error: existErr } = await supabase.from('pro_users').select('*').eq('email', email).single();
  if (existing) return res.status(409).json({ error: "Utilisateur déjà existant" });
  // Hash du mot de passe
  const hashed = hashSync(password, 10);
  const { data, error } = await supabase.from('pro_users').insert([
    {
      email,
      password: hashed,
      first_name: firstName,
      last_name: lastName,
      salon_name: salonName,
      siret,
      phone,
      city,
      address
    }
  ]).select('id').single();
  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json({ ok: true, userId: data?.id });
});

// Connexion client
router.post("/api/login", async (req, res) => {
  console.log('Tentative de connexion:', req.body);
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email et mot de passe requis" });
    const { data, error: userErr } = await supabase.from('pro_users').select('*').eq('email', email).single();
    console.log('Utilisateur trouvé:', data);
    if (data) {
      console.log('Mot de passe reçu:', password);
      console.log('Hash stocké:', data.password);
    }
    if (!data) return res.status(404).json({ error: "Utilisateur introuvable" });
    if (!compareSync(password, data.password)) return res.status(401).json({ error: "Mot de passe incorrect" });
    // Ici, tu peux générer un token ou une session
    return res.status(200).json({ ok: true, user: { id: data.id, email: data.email, firstName: data.first_name, lastName: data.last_name, salonName: data.salon_name } });
  // Ici, tu peux générer un token ou une session
  return res.status(200).json({ ok: true, user: { id: data.id, email: data.email, firstName: data.first_name, lastName: data.last_name, salonName: data.salon_name } });
});

// Récupérer l'utilisateur connecté (optionnel)
router.get("/api/auth/user", async (req, res) => {
  // DEV: supporte le mode mock via Authorization: Bearer dev-pro ou dev-user
  if (!req.user) {
    // Tente de lire le token dans l'en-tête Authorization
    const h = String(req.headers["authorization"] || req.headers["Authorization"] || "");
    if (h) {
      const m = h.match(/^Bearer\s+(.+)$/i);
      const token = m?.[1]?.trim();
      if (token === "dev-pro") return res.json({ user: { id: "dev-pro", role: "pro" } });
      if (token === "dev-user") return res.json({ user: { id: "dev-user", role: "user" } });
    }
    return res.status(401).json({ error: "Non authentifié" });
  }
  // Utilisateur réel (session ou token)
  return res.json({ user: req.user });
});

// Récupérer les informations de l'entreprise de l'utilisateur connecté
router.get('/api/business/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ user: null });
  }
  res.json({ user: req.session.user });
});

export default router;
