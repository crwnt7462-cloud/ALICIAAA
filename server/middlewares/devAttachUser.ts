import type { Request, Response, NextFunction } from 'express';
// DEV ONLY: permet d'attacher un user via headers (ou un mock simple)
export function devAttachUser(req: Request, _res: Response, next: NextFunction) {
  // Ex: curl -H "x-user-id: 123" -H "x-user-role: pro"
  const id = req.header('x-user-id');
  const role = (req.header('x-user-role') as any) || 'pro'; // "pro" par défaut en dev
  if (id) {
    req.user = { id, role: role === 'admin' ? 'admin' : role === 'client' ? 'client' : 'pro' };
  }
  next();
}
