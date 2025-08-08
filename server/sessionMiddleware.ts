import session from "express-session";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

// Configuration des sessions persistantes avec PostgreSQL
export function configureSession() {
  const pgStore = connectPg(session);
  
  return session({
    store: new pgStore({
      conString: process.env.DATABASE_URL,
      tableName: 'sessions',
      createTableIfMissing: false, // Table déjà créée par Drizzle
    }),
    secret: process.env.SESSION_SECRET || require('crypto').randomBytes(64).toString('hex'),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    },
    name: 'beauty.session',
  });
}

// Middleware pour les comptes professionnels
export function authenticateUser(req: any, res: any, next: any) {
  const session = req.session as any;
  if (!session?.userId || session?.userType !== 'professional') {
    return res.status(401).json({ message: "Non autorisé - Connexion professionnelle requise" });
  }
  req.user = { id: session.userId };
  next();
}

// Middleware pour les comptes clients
export function authenticateClient(req: any, res: any, next: any) {
  const session = req.session as any;
  if (!session?.clientId || session?.userType !== 'client') {
    return res.status(401).json({ message: "Non autorisé - Connexion client requise" });
  }
  next();
}

// Middleware pour vérifier les deux types de comptes
export function authenticateAny(req: any, res: any, next: any) {
  const session = req.session as any;
  if (!session?.userId && !session?.clientId) {
    return res.status(401).json({ message: "Non autorisé - Connexion requise" });
  }
  next();
}