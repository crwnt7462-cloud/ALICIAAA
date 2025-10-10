import { Router } from 'express';
import { serviceRole as supabase } from '../lib/clients/supabaseServer';
import { compareSync } from 'bcryptjs';

const router = Router();

// Route GET /api/business/me
router.get('/business/me', (req, res) => {
  const session = req.session as any;
  if (!session || !session.user) {
    return res.status(401).json({ user: null });
  }
  res.json({ user: session.user });
});

// Route GET /api/me : alias pour compatibilité avec useAuth
router.get('/me', (req, res) => {
  const session = req.session as any;
  if (!session?.user) {
    return res.json({ ok: false, user: null });
  }
  res.json({ ok: true, user: { id: session.user.id, role: 'pro' } });
});

// Route GET /api/auth/check-session : pour useAuthSession
router.get('/auth/check-session', (req, res) => {
  const session = req.session as any;
  if (!session || !session.user) {
    return res.status(401).json({ user: null });
  }
  res.json({ user: session.user });
});

// Route POST /api/login
router.post('/login', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'Service temporairement indisponible' });
    }

    const { email, password } = req.body;
    console.log('[LOGIN] raw body:', { email, password: password ? '***' : 'undefined' });

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const { data: user, error } = await supabase
      .from('pro_users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    if (!compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    // Sauvegarder la session
    req.session.user = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      salonName: user.business_name
    };

    req.session.save((err) => {
      if (err) {
        console.error('Erreur sauvegarde session:', err);
        return res.status(500).json({ error: 'Erreur serveur' });
      }
      console.log('✅ Session sauvegardée avec succès');
      console.log('✅ Session ID après sauvegarde:', req.sessionID);
      console.log('✅ Session user après sauvegarde:', req.session.user);
      console.log('✅ Connexion réussie pour:', email, 'Type: professional');
      res.json({
        success: true,
        ok: true,
        user: req.session.user,
        userType: 'professional',
        token: `professional_${user.id}_${Date.now()}`
      });
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route GET /api/auth/user
router.get('/auth/user', (req, res) => {
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

export default router;

