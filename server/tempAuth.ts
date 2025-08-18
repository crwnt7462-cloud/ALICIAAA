// Système d'authentification temporaire pour les tests professionnels
// À remplacer par Replit Auth une fois corrigé

import type { Express, RequestHandler } from "express";
import { storage } from "./storage";

// Session temporaire en mémoire (remplacer par PostgreSQL en production)
const tempSessions = new Map<string, any>();

// Middleware d'authentification temporaire
export const tempAuthMiddleware: RequestHandler = async (req: any, res, next) => {
  const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
  
  if (sessionId && tempSessions.has(sessionId)) {
    req.user = tempSessions.get(sessionId);
    req.isAuthenticated = () => true;
    return next();
  }
  
  // Créer un utilisateur de test automatiquement pour les démos
  const demoUser = {
    id: 'demo-user-' + Date.now(),
    email: 'demo@salon-test.fr',
    firstName: 'Démo',
    lastName: 'Professionnel',
    businessName: 'Salon Démo',
    isProfessional: true
  };
  
  // Créer une session temporaire
  const newSessionId = 'demo-session-' + Date.now();
  tempSessions.set(newSessionId, demoUser);
  
  req.user = demoUser;
  req.isAuthenticated = () => true;
  
  // Envoyer le cookie de session
  res.cookie('sessionId', newSessionId, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
  
  next();
};

export const setupTempAuth = (app: Express) => {
  // Route de connexion temporaire
  app.get('/api/login', (req: any, res) => {
    const demoUser = {
      id: 'demo-pro-' + Date.now(),
      email: 'pro@avyento-demo.fr',
      firstName: 'Professionnel',
      lastName: 'Démo',
      businessName: 'Salon Avyento Démo',
      isProfessional: true,
      subscriptionPlan: 'premium-pro'
    };
    
    const sessionId = 'demo-session-' + Date.now();
    tempSessions.set(sessionId, demoUser);
    
    res.cookie('sessionId', sessionId, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.redirect('/dashboard');
  });
  
  // Route de déconnexion
  app.get('/api/logout', (req: any, res) => {
    const sessionId = req.cookies?.sessionId;
    if (sessionId) {
      tempSessions.delete(sessionId);
      res.clearCookie('sessionId');
    }
    res.redirect('/');
  });
  
  // Route pour récupérer l'utilisateur
  app.get('/api/auth/user', tempAuthMiddleware, (req: any, res) => {
    res.json(req.user);
  });
};

// Middleware simple qui autorise toujours l'accès (pour les tests)
export const isAuthenticated: RequestHandler = tempAuthMiddleware;