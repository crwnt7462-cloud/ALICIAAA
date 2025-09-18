import type { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

/**
 * Middleware : vérifie que le salon appartient bien à l'utilisateur connecté.
 * - Récupère l'ID user depuis req.auth (JWT Supabase) ou req.session
 * - Charge owner_id du salon dans la DB
 * - Refuse si mismatch
 */
export async function requireSalonOwnership(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  const jwt = req.headers.authorization?.replace('Bearer ', '');
  if (!jwt) return res.status(401).json({ error: 'Missing token' });

  // Crée un client Supabase scopé utilisateur (RLS réelle)
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${jwt}` } }
  });

  // Vérifie ownership + is_template=false
  const { data, error } = await supabase
    .from('salons')
    .select('id')
    .eq('id', id)
    .eq('is_template', false)
    .single();

  // Mapping d’erreurs : permissions/RLS → 403 (pas 500)
  if (error?.code === '42501' || error?.message?.includes('permission')) {
    return res.status(403).json({ error: 'Forbidden (RLS)' });
  }
  if (error || !data) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  req.ctx = req.ctx || {};
  req.ctx.salonId = id;
  next();
}
