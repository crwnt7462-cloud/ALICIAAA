import type { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { salons } from '@shared/schema';
import { eq } from 'drizzle-orm';

// 1) Exige un utilisateur authentifié
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  next();
}

// 2) Exige un compte pro
export function requirePro(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== 'pro' && req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Pro only' });
  }
  next();
}

// 3) Vérifie que l’utilisateur est bien propriétaire du salon visé
export async function requireSalonOwner(req: Request, res: Response, next: NextFunction) {
  const salonId = String(req.params.salonId || req.body?.salonId || '');
  if (!salonId) return res.status(400).json({ error: 'Missing salonId' });

  // On cherche par ID (uuid/texte). Si chez toi c'est un int, on adaptera à l'étape 2.
  const [salon] = await db.select().from(salons).where(eq(salons.id as any, salonId as any)).limit(1);
  if (!salon) return res.status(404).json({ error: 'Salon not found' });
  if (salon.userId !== req.user!.id && req.user!.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Attacher pour la route
  (req as any).salon = salon;
  next();
}
