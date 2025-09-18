import 'express';

declare global {
  namespace Express {
    // Ton “user“ minimal côté serveur
    interface User {
      id: string;
      role: 'pro' | 'client' | 'admin';
      email?: string;
    }

    interface Request {
      user?: User; // sera posé par ton middleware d’auth
    }
  }
}

export {};
