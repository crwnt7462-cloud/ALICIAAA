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
  // SYSTEME TEMP AUTH DESACTIVE - Utilisation du système d'authentification principal
  console.log('⚠️ TempAuth désactivé - Système d\'authentification principal utilisé');
  
  // Pas de routes en conflit avec le système principal
  // Les routes d'authentification sont gérées dans fullStackRoutes.ts
};

// Middleware simple qui autorise toujours l'accès (pour les tests)
export const isAuthenticated: RequestHandler = tempAuthMiddleware;