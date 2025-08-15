import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(
  claims: any,
) {
  const user = await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });

  // Créer automatiquement un salon personnel si c'est la première connexion
  await createPersonalSalonIfNeeded(user);
  
  return user;
}

async function createPersonalSalonIfNeeded(user: any) {
  try {
    // Vérifier si l'utilisateur a déjà un salon
    const existingSalons = await storage.getSalonsByOwner(user.id);
    
    if (existingSalons.length === 0) {
      console.log('🏗️ Création salon personnel pour nouvel utilisateur:', user.email);
      
      // Importer la fonction de création automatique
      const { createAutomaticSalonPage } = await import('./autoSalonCreation');
      
      // Créer les données professionnelles par défaut
      const professionalData = {
        businessName: `Salon de ${user.firstName || 'Professionnel'}`,
        email: user.email,
        phone: '+33 1 XX XX XX XX',
        address: 'À définir',
        description: 'Votre salon de beauté professionnel',
        subscriptionPlan: 'basic' as 'basic' | 'premium' | 'enterprise'
      };
      
      // Créer le salon automatiquement
      const newSalon = await createAutomaticSalonPage(professionalData);
      console.log('✅ Salon personnel créé:', newSalon.id);
      
      return newSalon;
    }
  } catch (error) {
    console.error('❌ Erreur création salon personnel:', error);
  }
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  for (const domain of process.env
    .REPLIT_DOMAINS!.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`,
      },
      verify,
    );
    passport.use(strategy);
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/pro-dashboard",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  // Bypass authentication completely - always provide demo user
  req.user = {
    claims: {
      sub: "demo-user",
      email: "demo@beautyapp.com",
      first_name: "Demo",
      last_name: "User"
    },
    access_token: "demo-token",
    expires_at: Math.floor(Date.now() / 1000) + 86400 // 24 hours
  };
  
  // Ensure demo user exists in storage
  try {
    await storage.upsertUser({
      id: "demo-user",
      email: "demo@beautyapp.com",
      firstName: "Demo",
      lastName: "User",
      profileImageUrl: null
    });
  } catch (error) {
    console.log("Demo user creation error:", error);
  }
  
  return next();
};
