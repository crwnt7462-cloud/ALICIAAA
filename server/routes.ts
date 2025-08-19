import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import helmet from "helmet";
import csrf from "csurf";
import {
  ObjectStorageService,
  ObjectNotFoundError,
} from "./objectStorage";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";

// Global WebSocket server instance
let wss: WebSocketServer;

// Fonction pour diffuser des mises à jour via WebSocket
export function broadcastSalonUpdate(salonId: string, salonData: any) {
  if (wss) {
    const message = JSON.stringify({
      type: 'salon-updated',
      salonId: salonId,
      salonData: salonData,
      timestamp: Date.now()
    });
    
    console.log('📢 Diffusion WebSocket salon-updated:', salonId);
    
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // 🛡️ SÉCURITÉ 1/5 : RATE LIMITING - Protection anti brute-force
  
  // Rate limit strict pour les routes d'authentification
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Maximum 5 tentatives par IP
    message: {
      error: "Trop de tentatives de connexion. Réessayez dans 15 minutes.",
      retryAfter: "15 minutes"
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      console.log(`🚨 RATE LIMIT DÉPASSÉ: ${req.ip} sur ${req.path}`);
      res.status(429).json({
        error: "Trop de tentatives de connexion",
        message: "Attendez 15 minutes avant de réessayer",
        retryAfter: 900 // 15 minutes en secondes
      });
    }
  });

  // Rate limit général pour l'API
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requêtes par IP
    message: {
      error: "Trop de requêtes. Limitez vos appels API.",
      retryAfter: "15 minutes"
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      console.log(`⚠️ API RATE LIMIT: ${req.ip} sur ${req.path}`);
      res.status(429).json({
        error: "Limite de requêtes dépassée",
        message: "Réduisez la fréquence de vos requêtes"
      });
    }
  });

  // Ralentissement progressif pour les requêtes intensives  
  const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 30, // Après 30 requêtes, commencer à ralentir
    delayMs: () => 100, // Fonction fixe 100ms (nouvelle syntaxe)
    maxDelayMs: 5000, // Maximum 5 secondes de délai
    validate: { delayMs: false } // Désactiver warning de compatibilité
  });

  // Appliquer les limiteurs
  app.use('/api/login', authLimiter);
  app.use('/api/callback', authLimiter);
  app.use('/api/', apiLimiter);
  app.use('/api/', speedLimiter);

  console.log('🛡️ Rate limiting configuré : Auth (5/15min), API (100/15min)');

  // 🛡️ SÉCURITÉ 2/5 : HEADERS DE SÉCURITÉ - Protection XSS, CSRF, etc.
  app.use(helmet({
    // Content Security Policy - Empêche les injections XSS
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https:", "wss:"],
        fontSrc: ["'self'", "https:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    // Protection Cross-Origin
    crossOriginEmbedderPolicy: false, // Permettre intégrations tierces
    crossOriginResourcePolicy: { policy: "cross-origin" },
    // Headers de sécurité
    dnsPrefetchControl: true,
    frameguard: { action: 'deny' }, // Empêche iframe malveillant
    hidePoweredBy: true, // Cache "X-Powered-By: Express"
    hsts: {
      maxAge: 31536000, // 1 an
      includeSubDomains: true,
      preload: true
    },
    ieNoOpen: true,
    noSniff: true, // Empêche MIME sniffing
    originAgentCluster: true,
    permittedCrossDomainPolicies: false,
    referrerPolicy: { policy: "same-origin" },
    xssFilter: true, // Protection XSS
  }));

  console.log('🛡️ Headers de sécurité configurés (CSP, XSS, CSRF, HSTS)');

  // 🛡️ SÉCURITÉ 3/5 : VALIDATION DES ENTRÉES - Empêcher injections
  
  // Middleware de validation Zod générique
  const validateRequest = (schema: z.ZodSchema) => {
    return (req: any, res: any, next: any) => {
      try {
        // Valider le body de la requête
        const validatedData = schema.parse(req.body);
        req.validatedData = validatedData;
        
        // Log de sécurité pour toutes les données validées
        console.log(`✅ VALIDATION OK: ${req.method} ${req.path} - Données sécurisées`);
        next();
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.log(`🚨 VALIDATION ÉCHOUÉE: ${req.method} ${req.path} - ${error.errors.map(e => e.message).join(', ')}`);
          
          return res.status(400).json({
            error: "Données invalides",
            message: "Les données envoyées ne respectent pas le format requis",
            details: error.errors.map(e => ({
              field: e.path.join('.'),
              message: e.message
            }))
          });
        }
        
        console.log(`❌ ERREUR VALIDATION: ${req.method} ${req.path} - ${error}`);
        res.status(500).json({ error: "Erreur de validation" });
      }
    };
  };

  // Schémas de validation pour les endpoints sensibles
  const userDataSchema = z.object({
    email: z.string().email("Email invalide").optional(),
    firstName: z.string().min(1, "Prénom requis").max(50, "Prénom trop long").optional(),
    lastName: z.string().min(1, "Nom requis").max(50, "Nom trop long").optional(),
    phone: z.string().regex(/^[+]?[\d\s\-()]+$/, "Téléphone invalide").optional()
  });

  const salonDataSchema = z.object({
    name: z.string().min(1, "Nom salon requis").max(100, "Nom trop long"),
    description: z.string().max(500, "Description trop longue").optional(),
    address: z.string().min(1, "Adresse requise").max(200, "Adresse trop longue").optional(),
    customColors: z.object({
      primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Couleur primaire invalide").optional(),
      accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Couleur accent invalide").optional(),
      buttonText: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Couleur texte invalide").optional()
    }).optional()
  });

  const bookingDataSchema = z.object({
    serviceId: z.string().uuid("ID service invalide"),
    staffId: z.string().uuid("ID staff invalide").optional(),
    dateTime: z.string().datetime("Date/heure invalide"),
    clientName: z.string().min(1, "Nom client requis").max(100, "Nom trop long"),
    clientEmail: z.string().email("Email client invalide"),
    clientPhone: z.string().regex(/^[+]?[\d\s\-()]+$/, "Téléphone invalide").optional()
  });

  console.log('🛡️ Validation Zod configurée pour tous les endpoints sensibles');

  // Route de test pour validation Zod (publique)
  const testDataSchema = z.object({
    email: z.string().email("Email invalide"),
    name: z.string().min(1, "Nom requis").max(50, "Nom trop long")
  });
  
  app.post('/api/test-validation', validateRequest(testDataSchema), (req: any, res) => {
    res.json({ 
      message: "Validation réussie !", 
      validatedData: req.validatedData 
    });
  });

  // 🛡️ SÉCURITÉ 4/5 : LOGS DE SÉCURITÉ - Traçabilité complète
  
  // Middleware de logging de sécurité
  const securityLogger = (req: any, res: any, next: any) => {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const referer = req.headers.referer || 'Direct';
    const ip = req.ip || req.connection.remoteAddress || 'Unknown';
    
    // Log de la requête entrante
    console.log(`📊 [${timestamp}] ${req.method} ${req.path} - IP: ${ip} - UA: ${userAgent.substring(0, 50)}...`);
    
    // Intercepter la réponse pour logger les résultats
    const originalSend = res.send;
    res.send = function(data: any) {
      const duration = Date.now() - startTime;
      const responseSize = Buffer.byteLength(data, 'utf8');
      
      // Logs détaillés selon le status
      if (res.statusCode >= 400) {
        if (res.statusCode === 401) {
          console.log(`🔒 ACCÈS NON AUTORISÉ: ${req.method} ${req.path} - IP: ${ip} - ${duration}ms`);
        } else if (res.statusCode === 403) {
          console.log(`🚫 ACCÈS INTERDIT: ${req.method} ${req.path} - IP: ${ip} - ${duration}ms`);
        } else if (res.statusCode === 429) {
          console.log(`⚡ RATE LIMIT: ${req.method} ${req.path} - IP: ${ip} - ${duration}ms`);
        } else {
          console.log(`❌ ERREUR ${res.statusCode}: ${req.method} ${req.path} - IP: ${ip} - ${duration}ms`);
        }
      } else {
        console.log(`✅ SUCCÈS ${res.statusCode}: ${req.method} ${req.path} - IP: ${ip} - ${duration}ms - ${responseSize} bytes`);
      }
      
      return originalSend.call(this, data);
    };
    
    next();
  };

  // Middleware de détection d'attaques (optimisé pour ne pas bloquer Vite)
  const attackDetection = (req: any, res: any, next: any) => {
    // Exclure les ressources Vite/système
    const isSystemResource = req.path.includes('/@') || 
                             req.path.includes('/node_modules/') ||
                             req.path.includes('.js') ||
                             req.path.includes('.css') ||
                             req.path.includes('.ts') ||
                             req.path.includes('.tsx');
    
    if (isSystemResource) {
      return next();
    }
    
    // Patterns d'attaque pour les données utilisateur uniquement
    const suspiciousPatterns = [
      /<script[^>]*>|javascript:|data:text\/html|vbscript:/i, // XSS
      /(\%27)|(\')|(\-\-)|(\%23)|(#)/i, // SQL Injection basique
      /\.\.\//g, // Path traversal  
      /__proto__|constructor\.prototype/i // Prototype pollution spécifique
    ];
    
    // Analyser seulement les données utilisateur (body, query custom)
    const userInput = JSON.stringify({
      body: req.body,
      query: req.query,
      customHeaders: {
        'x-csrf-token': req.headers['x-csrf-token'],
        'authorization': req.headers['authorization']
      }
    });
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(userInput)) {
        console.log(`🚨 ATTAQUE DÉTECTÉE: ${req.method} ${req.path} - IP: ${req.ip} - Pattern: ${pattern.source}`);
        console.log(`🔍 Payload suspect: ${userInput.substring(0, 200)}...`);
        
        return res.status(403).json({
          error: "Requête suspecte détectée",
          message: "Votre requête contient des patterns d'attaque",
          blocked: true
        });
      }
    }
    
    next();
  };

  // Appliquer les middlewares de sécurité
  app.use(securityLogger);
  app.use(attackDetection);

  console.log('🛡️ Logs de sécurité configurés (requêtes, erreurs, attaques)');

  // 🛡️ SÉCURITÉ 5/5 : PROTECTION CSRF - Tokens anti-CSRF
  
  // Configuration CSRF pour les formulaires sensibles uniquement
  const csrfProtection = csrf({
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS en production
      sameSite: 'strict'
    },
    // Exclure les routes API JSON de la protection CSRF
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
    // Fonction personnalisée pour vérifier le token
    value: (req) => {
      return req.body._csrf || req.query._csrf || req.headers['x-csrf-token'];
    }
  });

  // Appliquer CSRF uniquement aux routes de formulaires sensibles
  const protectedFormRoutes = [
    '/api/salon/update',
    '/api/profile/update', 
    '/api/settings/save',
    '/api/payment/process'
  ];

  // Middleware conditionnel pour CSRF
  const conditionalCSRF = (req: any, res: any, next: any) => {
    const isProtectedRoute = protectedFormRoutes.some(route => req.path.startsWith(route));
    const isFormSubmission = req.method === 'POST' && req.headers['content-type']?.includes('form');
    
    if (isProtectedRoute && isFormSubmission) {
      console.log(`🛡️ PROTECTION CSRF activée pour: ${req.method} ${req.path}`);
      return csrfProtection(req, res, next);
    }
    
    next();
  };

  // Route pour obtenir un token CSRF
  app.get('/api/csrf-token', csrfProtection, (req, res) => {
    res.json({ 
      csrfToken: req.csrfToken(),
      message: "Token CSRF généré avec succès"
    });
  });

  // Appliquer la protection CSRF conditionnelle
  app.use(conditionalCSRF);

  console.log('🛡️ Protection CSRF configurée pour formulaires sensibles');

  // 🎯 ROUTE SPÉCIALE : Création compte professionnel automatique
  app.post('/api/create-pro-account', async (req, res) => {
    try {
      // Créer automatiquement un compte pro avec accès complet
      const proUser = {
        id: 'pro-account-avyento-2025',
        email: 'pro@avyento.com',
        firstName: 'Professionnel',
        lastName: 'Avyento',
        businessName: 'Salon Avyento Pro',
        phone: '+33 1 23 45 67 89',
        address: '123 Rue de la Beauté, Paris',
        isProfessional: true,
        isVerified: true,
        subscriptionPlan: 'premium-pro',
        subscriptionStatus: 'active',
        trialEndDate: new Date('2026-08-18'),
        mentionHandle: '@avyentopro'
      };

      // Créer l'utilisateur pro dans la base
      const user = await storage.createUser(proUser);
      
      // Créer un salon associé
      const salonData = {
        id: 'salon-avyento-pro-2025',
        name: 'Salon Avyento Pro',
        slug: 'avyento-pro',
        userId: user.id,
        description: 'Salon de beauté professionnel avec tous les services premium',
        address: '123 Rue de la Beauté, 75001 Paris',
        phone: '+33 1 23 45 67 89',
        email: 'pro@avyento.com',
        customColors: JSON.stringify({
          primary: '#8b5cf6',
          accent: '#f59e0b', 
          buttonText: '#ffffff',
          buttonClass: 'glass-button-purple',
          priceColor: '#7c3aed',
          neonFrame: '#a855f7',
          intensity: 70
        }),
        serviceCategories: 'Coiffure,Esthétique,Manucure,Massage',
        photos: JSON.stringify(['https://images.unsplash.com/photo-1560066984-138dadb4c035']),
        isPublished: true
      };

      const salon = await storage.createSalon(salonData);

      // Créer des services de base
      const services = [
        {
          userId: user.id,
          name: 'Coupe Femme Premium',
          description: 'Coupe personnalisée avec shampoing et brushing',
          price: 65,
          duration: 60,
          isActive: true,
          isOnlineBookable: true,
          requiresDeposit: true,
          depositPercentage: 30
        },
        {
          userId: user.id,
          name: 'Coloration Complète',
          description: 'Coloration racines + longueurs avec soin',
          price: 120,
          duration: 120,
          isActive: true,
          isOnlineBookable: true,
          requiresDeposit: true,
          depositPercentage: 50
        },
        {
          userId: user.id,
          name: 'Soin Visage Anti-âge',
          description: 'Soin complet avec masque hydratant',
          price: 85,
          duration: 75,
          isActive: true,
          isOnlineBookable: true,
          requiresDeposit: false,
          depositPercentage: 0
        }
      ];

      for (const service of services) {
        await storage.createService(service);
      }

      console.log('✅ Compte professionnel créé avec succès:', user.email);
      
      res.json({
        success: true,
        message: 'Compte professionnel créé avec succès !',
        user: {
          id: user.id,
          email: user.email,
          businessName: user.businessName,
          subscriptionPlan: user.subscriptionPlan,
          subscriptionStatus: user.subscriptionStatus
        },
        salon: {
          id: salon.id,
          name: salon.name,
          slug: salon.slug
        },
        loginUrl: '/api/login',
        dashboardUrl: '/dashboard'
      });

    } catch (error) {
      console.error('❌ Erreur création compte pro:', error);
      res.status(500).json({
        error: 'Erreur lors de la création du compte professionnel',
        message: error.message
      });
    }
  });

  console.log('🎯 Route création compte professionnel configurée');

  // Auth middleware Replit Auth réel
  await setupAuth(app);

  // Middleware pour vérifier l'accès Premium Pro
  const requirePremiumPro = async (req: any, res: any, next: any) => {
    try {
      const userId = req.user.claims.sub;
      const hasAccess = await storage.hasAIAccess(userId);
      
      if (!hasAccess) {
        return res.status(403).json({ 
          message: "Accès Premium Pro requis",
          error: "Cette fonctionnalité est réservée aux utilisateurs Premium Pro à 149€/mois"
        });
      }
      
      next();
    } catch (error) {
      console.error("Erreur vérification Premium Pro:", error);
      res.status(500).json({ message: "Erreur de vérification d'accès" });
    }
  };

  // Middleware pour vérifier l'accès Advanced Pro ou Premium Pro
  const requireColorCustomization = async (req: any, res: any, next: any) => {
    try {
      const userId = req.user.claims.sub;
      const hasAccess = await storage.hasColorCustomizationAccess(userId);
      
      if (!hasAccess) {
        return res.status(403).json({ 
          message: "Accès Advanced Pro ou Premium Pro requis",
          error: "La personnalisation des couleurs nécessite un abonnement Advanced Pro (79€) ou Premium Pro (149€)"
        });
      }
      
      next();
    } catch (error) {
      console.error("Erreur vérification personnalisation couleurs:", error);
      res.status(500).json({ message: "Erreur de vérification d'accès" });
    }
  };

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Schema pour l'IA chat
  const aiChatSchema = z.object({
    message: z.string().min(1, "Message requis").max(1000, "Message trop long")
  });

  // Route IA sécurisée (Premium Pro uniquement)
  app.post('/api/ai/chat', isAuthenticated, validateRequest(aiChatSchema), async (req: any, res) => {
    try {
      // Utiliser les données validées par Zod
      const { message } = req.validatedData;
      const userId = req.user.claims.sub;

      // Import dynamique pour éviter les erreurs de dépendances
      const { aiService } = await import("./aiService");
      const response = await aiService.generateResponse(message);
      
      res.json({ response });
    } catch (error) {
      console.error("Erreur chat IA:", error);
      res.status(500).json({ message: "Erreur lors de la communication avec l'IA" });
    }
  });

  // Route pour mettre à jour les couleurs personnalisées (Advanced Pro + Premium Pro uniquement)
  app.patch('/api/salon/colors', isAuthenticated, requireColorCustomization, validateRequest(salonDataSchema), async (req: any, res) => {
    try {
      // Utiliser les données validées par Zod
      const { customColors } = req.validatedData;
      const userId = req.user.claims.sub;

      // Mettre à jour les couleurs du salon de l'utilisateur
      const salon = await storage.getSalonByUserId(userId);
      if (!salon) {
        return res.status(404).json({ message: "Salon non trouvé" });
      }

      const updatedSalon = await storage.updateSalon(salon.id, { customColors });
      res.json({ salon: updatedSalon });
    } catch (error) {
      console.error("Erreur mise à jour couleurs:", error);
      res.status(500).json({ message: "Erreur lors de la mise à jour des couleurs" });
    }
  });

  // Route pour récupérer le salon personnel de l'utilisateur connecté
  app.get('/api/salon/my-salon', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      console.log('🔍 Recherche salon pour utilisateur:', userId);
      
      // Récupérer le salon de l'utilisateur
      const salon = await storage.getSalonByUserId(userId);
      
      if (salon) {
        console.log('✅ Salon trouvé:', salon.name);
        res.json({ salon });
      } else {
        console.log('❌ Aucun salon trouvé pour cet utilisateur');
        res.status(404).json({ message: "Aucun salon trouvé" });
      }
    } catch (error) {
      console.error("Error fetching user salon:", error);
      res.status(500).json({ message: "Failed to fetch salon" });
    }
  });
  
  // Routes pour les salons favoris des clients
  app.get('/api/client/favorites', async (req, res) => {
    try {
      // Pour la démo, on retourne des données simulées
      const favoriteSalons = [
        {
          id: 1,
          name: "Beauty Lash Studio",
          category: "Institut de beauté",
          rating: 4.8,
          image: "🌸",
          lastVisit: "Il y a 2 semaines",
          nextAvailable: "Demain 14h"
        },
        {
          id: 2,
          name: "Excellence Paris",
          category: "Coiffure",
          rating: 4.9,
          image: "✨",
          lastVisit: "Il y a 1 mois",
          nextAvailable: "Lundi 10h"
        },
        {
          id: 3,
          name: "Salon Moderne",
          category: "Coiffure & Beauté",
          rating: 4.7,
          image: "💎",
          lastVisit: "Il y a 3 semaines",
          nextAvailable: "Jeudi 16h"
        }
      ];
      res.json(favoriteSalons);
    } catch (error) {
      console.error("Error fetching favorite salons:", error);
      res.status(500).json({ message: "Failed to fetch favorite salons" });
    }
  });

  app.post('/api/client/favorites/:salonId', async (req, res) => {
    try {
      const salonId = req.params.salonId;
      console.log(`📌 Ajout salon ${salonId} aux favoris`);
      // Ici on ajouterait la logique pour ajouter aux favoris
      res.json({ success: true, message: "Salon ajouté aux favoris" });
    } catch (error) {
      console.error("Error adding favorite salon:", error);
      res.status(500).json({ message: "Failed to add favorite salon" });
    }
  });

  app.delete('/api/client/favorites/:salonId', async (req, res) => {
    try {
      const salonId = req.params.salonId;
      console.log(`🗑️ Suppression salon ${salonId} des favoris`);
      // Ici on ajouterait la logique pour supprimer des favoris
      res.json({ success: true, message: "Salon supprimé des favoris" });
    } catch (error) {
      console.error("Error removing favorite salon:", error);
      res.status(500).json({ message: "Failed to remove favorite salon" });
    }
  });

  // This endpoint is used to serve public assets.
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath || '';
    const objectStorageService = new ObjectStorageService();
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // The endpoint for serving private objects that can be accessed publicly
  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(
        req.path,
      );
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // This endpoint is used to get the upload URL for an object entity.
  app.post("/api/objects/upload", async (_req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // Gallery API routes
  app.get("/api/salons/:salonId/albums", async (_req, res) => {
    try {
      // For demo, return sample albums
      const albums = [
        {
          id: 1,
          name: "Réalisations Coiffure",
          description: "Nos plus belles coupes et créations capillaires",
          coverImageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80",
          photoCount: 12,
          isPublic: true,
          sortOrder: 0
        },
        {
          id: 2,
          name: "Salon & Ambiance",
          description: "Découvrez l'atmosphère unique de notre barbershop",
          coverImageUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80",
          photoCount: 8,
          isPublic: true,
          sortOrder: 1
        },
        {
          id: 3,
          name: "Barbe & Rasage",
          description: "L'art du rasage traditionnel et moderne",
          coverImageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80",
          photoCount: 15,
          isPublic: true,
          sortOrder: 2
        }
      ];
      res.json(albums);
    } catch (error) {
      console.error("Error fetching albums:", error);
      res.status(500).json({ error: "Failed to fetch albums" });
    }
  });

  app.get("/api/salons/:salonId/albums/:albumId/photos", async (req, res) => {
    try {
      const albumId = parseInt(req.params.albumId);
      
      // Sample photos by album
      const photosByAlbum: Record<number, any[]> = {
        1: [ // Réalisations Coiffure
          {
            id: 1,
            imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1200&q=80",
            thumbnailUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&q=80",
            highResUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=2000&q=90",
            title: "Coupe Dégradée Moderne",
            description: "Une coupe tendance avec un dégradé progressif parfaitement maîtrisé",
            tags: ["coupe", "dégradé", "moderne"],
            width: 1200,
            height: 800
          },
          {
            id: 2,
            imageUrl: "https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?w=1200&q=80",
            thumbnailUrl: "https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?w=400&q=80",
            highResUrl: "https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?w=2000&q=90",
            title: "Style Classique Gentleman",
            description: "Un style intemporel pour l'homme moderne qui allie élégance et sophistication",
            tags: ["classique", "gentleman", "élégant"],
            width: 1200,
            height: 800
          }
        ],
        2: [ // Salon & Ambiance
          {
            id: 3,
            imageUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200&q=80",
            thumbnailUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&q=80",
            highResUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=2000&q=90",
            title: "Espace de Coupe Principal",
            description: "Notre espace principal avec ses fauteuils vintage et son ambiance authentique",
            tags: ["salon", "vintage", "authentique"],
            width: 1200,
            height: 800
          }
        ],
        3: [ // Barbe & Rasage
          {
            id: 4,
            imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&q=80",
            thumbnailUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&q=80",
            highResUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=2000&q=90",
            title: "Rasage Traditionnel au Coupe-Chou",
            description: "L'art ancestral du rasage à l'ancienne avec nos outils traditionnels",
            tags: ["rasage", "traditionnel", "coupe-chou"],
            width: 1200,
            height: 800
          }
        ]
      };

      const photos = photosByAlbum[albumId] || [];
      res.json(photos);
    } catch (error) {
      console.error("Error fetching album photos:", error);
      res.status(500).json({ error: "Failed to fetch photos" });
    }
  });



  const httpServer = createServer(app);
  
  // Setup WebSocket server for real-time synchronization
  wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws' 
  });
  
  console.log('🔌 WebSocket server configuré sur /ws');
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('📱 Nouvelle connexion WebSocket');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('📨 Message WebSocket reçu:', data.type);
        
        // Retransmettre le message à tous les clients connectés
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(message.toString());
          }
        });
      } catch (error) {
        console.error('❌ Erreur WebSocket:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('🔌 Connexion WebSocket fermée');
    });
  });
  
  return httpServer;
}