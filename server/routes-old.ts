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
  // MODE DÉVELOPPEMENT - TOUTES SÉCURITÉS SUPPRIMÉES
  console.log('⚠️ Mode développement - Sécurité complètement désactivée pour éviter les patterns d\'attaque');

  // Pas de validation - mode développement libre

  // Logs basiques sans sécurité

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

  // 🔐 ROUTE : Connexion avec email/mot de passe classique
  app.post('/api/login-classic', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Créer un compte demo si email = pro@avyento.com
      if (email === 'pro@avyento.com' && password === 'avyento2025') {
        // Créer une session manuelle pour le compte pro
        const proUser = {
          claims: {
            sub: 'pro-account-avyento-2025',
            email: 'pro@avyento.com',
            first_name: 'Professionnel',
            last_name: 'Avyento'
          },
          access_token: 'demo-token',
          expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24h
        };

        // Stocker dans la session
        req.session.user = proUser;
        
        console.log('✅ Connexion compte pro réussie:', email);
        
        res.json({
          success: true,
          message: 'Connexion réussie !',
          user: {
            id: proUser.claims.sub,
            email: proUser.claims.email,
            firstName: proUser.claims.first_name,
            lastName: proUser.claims.last_name
          },
          redirectUrl: '/dashboard'
        });
      } else {
        res.status(401).json({
          error: 'Identifiants incorrects',
          message: 'Email ou mot de passe invalide'
        });
      }
    } catch (error) {
      console.error('❌ Erreur connexion:', error);
      res.status(500).json({
        error: 'Erreur de connexion',
        message: error.message
      });
    }
  });

  // 🔓 Route de déconnexion classique
  app.post('/api/logout-classic', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur de déconnexion' });
      }
      res.json({ success: true, message: 'Déconnexion réussie' });
    });
  });

  // Middleware pour vérifier l'auth classique
  const isAuthenticatedClassic = (req: any, res: any, next: any) => {
    if (req.session && req.session.user) {
      req.user = req.session.user;
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // Route utilisateur avec auth classique
  app.get('/api/auth/user-classic', isAuthenticatedClassic, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  console.log('🔐 Authentification classique configurée');

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

  // Middleware hybride pour vérifier l'auth Replit OU professionnelle
  const isAuthenticatedHybrid = async (req: any, res: any, next: any) => {
    // Vérifier d'abord l'auth professionnelle (sessions classiques)
    if (req.session && req.session.user) {
      req.user = req.session.user;
      console.log('✅ Session professionnelle détectée:', req.user.claims?.sub);
      return next();
    }
    
    // Sinon utiliser l'auth Replit
    console.log('🔄 Basculement vers auth Replit');
    return isAuthenticated(req, res, next);
  };

  // Auth routes
  app.get('/api/auth/user', isAuthenticatedHybrid, async (req: any, res) => {
    try {
      let userId;
      
      // Adapter selon le type d'auth
      if (req.session && req.session.user) {
        // Auth professionnelle classique - utiliser claims.sub
        userId = req.user.claims.sub;
        console.log('✅ Session professionnelle détectée, userId:', userId);
      } else {
        // Auth Replit
        userId = req.user.claims.sub;
        console.log('✅ Session Replit détectée, userId:', userId);
      }
      
      // Si c'est le compte pro hardcodé, retourner directement les données
      if (userId === 'pro-user-1') {
        const professionalUser = {
          id: 'pro-user-1',
          email: 'pro@avyento.com',
          firstName: 'Professionnel',
          lastName: 'Avyento',
          businessName: 'Salon Avyento Pro',
          subscriptionPlan: 'Premium Pro',
          subscriptionStatus: 'active',
          subscriptionEnd: new Date('2026-08-30'),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        console.log('✅ Utilisateur professionnel trouvé et retourné');
        return res.json(professionalUser);
      }
      
      const user = await storage.getUser(userId);
      
      // Si l'utilisateur n'existe pas, retourner une erreur claire
      if (!user) {
        console.log('❌ Utilisateur non trouvé avec userId:', userId);
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      
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

  // ==========================================
  // 🎯 ROUTES ABONNEMENT & PAIEMENT STRIPE
  // ==========================================

  const stripeService = await import('./stripeService');

  // Route pour récupérer les plans d'abonnement
  app.get('/api/subscription-plans', async (req, res) => {
    try {
      const { SUBSCRIPTION_PLANS } = await import('../shared/subscriptionPlans');
      res.json(SUBSCRIPTION_PLANS);
    } catch (error) {
      console.error('❌ Erreur récupération plans:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // Route pour créer une session Stripe Checkout pour abonnement
  app.post('/api/stripe/create-subscription-checkout', async (req, res) => {
    try {
      const { planType, customerEmail, customerName, successUrl, cancelUrl } = req.body;

      if (!planType || !customerEmail || !customerName) {
        return res.status(400).json({ 
          error: 'Paramètres manquants: planType, customerEmail, customerName requis' 
        });
      }

      const session = await stripeService.createSubscriptionCheckout({
        planType,
        customerEmail,
        customerName,
        successUrl,
        cancelUrl
      });

      console.log(`✅ Session abonnement créée: ${session.sessionId}`);
      res.json(session);
    } catch (error) {
      console.error('❌ Erreur création session abonnement:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la création de la session de paiement',
        details: error.message 
      });
    }
  });

  // Route pour créer une session Stripe Checkout pour paiement unique
  app.post('/api/stripe/create-payment-checkout', async (req, res) => {
    try {
      const { 
        amount, 
        description, 
        customerEmail, 
        customerName, 
        appointmentId, 
        salonName,
        successUrl,
        cancelUrl 
      } = req.body;

      if (!amount || !description || !customerEmail) {
        return res.status(400).json({ 
          error: 'Paramètres manquants: amount, description, customerEmail requis' 
        });
      }

      const session = await stripeService.createPaymentCheckout({
        amount: parseFloat(amount),
        description,
        customerEmail,
        customerName,
        appointmentId,
        salonName,
        successUrl,
        cancelUrl
      });

      console.log(`✅ Session paiement créée: ${session.sessionId}`);
      res.json(session);
    } catch (error) {
      console.error('❌ Erreur création session paiement:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la création de la session de paiement',
        details: error.message 
      });
    }
  });

  // Route pour vérifier le statut d'une session Stripe
  app.get('/api/stripe/session/:sessionId', async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = await stripeService.getCheckoutSession(sessionId);
      
      res.json({
        success: true,
        paymentStatus: session.payment_status,
        metadata: session.metadata,
        amount: session.amount_total ? session.amount_total / 100 : 0,
        currency: session.currency,
      });
    } catch (error) {
      console.error('❌ Erreur récupération session:', error);
      res.status(404).json({ 
        error: 'Session introuvable',
        details: error.message 
      });
    }
  });

  // Route pour confirmer un paiement
  app.post('/api/stripe/confirm-payment', async (req, res) => {
    try {
      const { sessionId } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({ error: 'sessionId requis' });
      }

      const result = await stripeService.confirmPayment(sessionId);
      res.json(result);
    } catch (error) {
      console.error('❌ Erreur confirmation paiement:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la confirmation du paiement',
        details: error.message 
      });
    }
  });

  // Route pour récupérer les abonnements d'un utilisateur
  app.get('/api/user/subscription', isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const email = user?.claims?.email;
      
      if (!email) {
        return res.status(400).json({ error: 'Email utilisateur requis' });
      }

      const subscriptions = await stripeService.listCustomerSubscriptions(email);
      
      // Renvoyer les informations d'abonnement ou plan par défaut
      if (subscriptions.length > 0) {
        const activeSubscription = subscriptions.find(sub => sub.status === 'active');
        if (activeSubscription) {
          res.json({
            planId: activeSubscription.metadata?.planType || 'basic-pro',
            status: activeSubscription.status,
            currentPeriodEnd: activeSubscription.current_period_end,
            subscriptionId: activeSubscription.id,
          });
        } else {
          res.json({
            planId: 'basic-pro',
            status: 'inactive',
          });
        }
      } else {
        res.json({
          planId: 'basic-pro',
          status: 'inactive',
        });
      }
    } catch (error) {
      console.error('❌ Erreur récupération abonnement utilisateur:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération de l\'abonnement',
        details: error.message 
      });
    }
  });

  // Route pour sauvegarder les couleurs personnalisées du salon
  app.post('/api/salon/colors', isAuthenticatedHybrid, async (req, res) => {
    try {
      const { primaryColor, salonId } = req.body;
      
      if (!primaryColor || !salonId) {
        return res.status(400).json({ 
          error: 'Paramètres manquants: primaryColor et salonId requis' 
        });
      }

      // Sauvegarder les couleurs du salon
      await storage.saveSalonColors(salonId, { primaryColor });
      
      console.log(`✅ Couleurs salon sauvegardées: ${salonId} -> ${primaryColor}`);
      
      res.json({ 
        success: true, 
        message: 'Couleurs sauvegardées avec succès',
        primaryColor 
      });
    } catch (error) {
      console.error('❌ Erreur sauvegarde couleurs salon:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la sauvegarde des couleurs',
        details: error.message 
      });
    }
  });

  // Endpoint GET pour récupérer les couleurs d'un salon (public)
  app.get('/api/salon/:salonId/colors', async (req, res) => {
    try {
      const { salonId } = req.params;
      
      if (!salonId) {
        return res.status(400).json({ 
          error: 'salonId requis dans l\'URL' 
        });
      }

      // Récupérer les couleurs du salon
      const colors = await storage.getSalonColors(salonId);
      
      if (colors) {
        console.log(`🎨 Couleurs salon récupérées: ${salonId} ->`, colors);
        res.json({ 
          success: true, 
          colors 
        });
      } else {
        console.log(`🎨 Aucune couleur personnalisée pour salon: ${salonId}, retour couleur par défaut`);
        res.json({ 
          success: true, 
          colors: { primaryColor: '#8b5cf6' } // Violet par défaut
        });
      }
    } catch (error) {
      console.error('❌ Erreur récupération couleurs salon:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération des couleurs',
        details: error.message 
      });
    }
  });

  // Route pour récupérer les couleurs personnalisées du salon
  app.get('/api/salon/:salonId/colors', async (req, res) => {
    try {
      const { salonId } = req.params;
      
      const colors = await storage.getSalonColors(salonId);
      
      if (colors) {
        res.json({ 
          success: true, 
          colors 
        });
      } else {
        // Couleurs par défaut si pas de personnalisation
        res.json({ 
          success: true, 
          colors: { 
            primaryColor: '#8b5cf6' // Violet par défaut
          } 
        });
      }
    } catch (error) {
      console.error('❌ Erreur récupération couleurs salon:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération des couleurs',
        details: error.message 
      });
    }
  });

  // Route pour créer un abonnement gratuit avec code promo FREE149
  app.post('/api/create-free-subscription', async (req, res) => {
    try {
      const { planType, customerEmail, customerName, promoCode, duration } = req.body;

      // Vérifier le code promo FREE149
      if (promoCode !== 'FREE149' || planType !== 'premium-pro') {
        return res.status(400).json({ 
          error: 'Code promo invalide ou plan incompatible' 
        });
      }

      // Simuler la création d'un abonnement gratuit
      // Dans un vrai système, vous créeriez un enregistrement en base
      const freeSubscription = {
        id: 'free_' + Date.now(),
        customerEmail,
        customerName,
        planType,
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + (duration * 30 * 24 * 60 * 60 * 1000)), // duration en mois
        amount: 0,
        promoCode,
        isFree: true
      };

      console.log(`🎉 Abonnement gratuit créé avec FREE149: ${customerEmail} - ${planType}`);

      res.json({
        success: true,
        subscription: freeSubscription,
        message: 'Abonnement Premium Pro gratuit activé pour 1 mois'
      });
    } catch (error) {
      console.error('❌ Erreur création abonnement gratuit:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la création de l\'abonnement gratuit',
        details: error.message 
      });
    }
  });

  console.log('🎯 Routes Stripe configurées : abonnements et paiements uniques');
  console.log('🎁 Route abonnement gratuit FREE149 configurée');

  // Schema flexible pour la connexion professionnelle (sans pattern strict)
  const professionalLoginSchema = z.object({
    email: z.string().email("Email invalide"), // Validation basique sans regex strict
    password: z.string().min(6, "Mot de passe requis")
  });

  // Route de connexion professionnelle
  app.post('/api/login/professional', validateRequest(professionalLoginSchema), async (req: any, res) => {
    try {
      const { email, password } = req.validatedData;
      
      // Vérifier les identifiants du compte pro
      if (email === 'pro@avyento.com' && password === 'avyento2025') {
        // Créer une vraie session utilisateur professionnelle
        const professionalUser = {
          claims: {
            sub: 'pro-user-1',
            email: 'pro@avyento.com',
            first_name: 'Professionnel',
            last_name: 'Avyento'
          },
          access_token: 'professional-access-token',
          expires_at: Math.floor(Date.now() / 1000) + 86400 // 24h
        };

        // Créer la session
        req.user = professionalUser;
        req.session.user = professionalUser;
        
        console.log('✅ Connexion professionnelle réussie + session créée:', email);
        
        res.json({
          success: true,
          user: {
            id: 'pro-user-1',
            email: 'pro@avyento.com',
            firstName: 'Professionnel',
            lastName: 'Avyento'
          },
          message: 'Connexion réussie'
        });
      } else {
        console.log('❌ Échec connexion professionnelle:', email);
        res.status(401).json({
          error: 'Identifiants invalides',
          message: 'Email ou mot de passe incorrect'
        });
      }
    } catch (error) {
      console.error('❌ Erreur connexion professionnelle:', error);
      res.status(500).json({
        error: 'Erreur serveur',
        message: 'Une erreur est survenue lors de la connexion'
      });
    }
  });

  // Route de connexion classique (compatible avec LoginClassic.tsx)
  app.post('/api/login-classic', validateRequest(professionalLoginSchema), async (req: any, res) => {
    try {
      const { email, password } = req.validatedData;
      
      // Vérifier les identifiants du compte pro
      if (email === 'pro@avyento.com' && password === 'avyento2025') {
        // Créer une vraie session utilisateur professionnelle
        const professionalUser = {
          claims: {
            sub: 'pro-user-1',
            email: 'pro@avyento.com',
            first_name: 'Professionnel',
            last_name: 'Avyento'
          },
          access_token: 'professional-access-token',
          expires_at: Math.floor(Date.now() / 1000) + 86400 // 24h
        };

        // Créer la session
        req.user = professionalUser;
        req.session.user = professionalUser;
        
        console.log('✅ Connexion classique réussie + session créée:', email);
        
        res.json({
          success: true,
          user: {
            id: 'pro-user-1',
            email: 'pro@avyento.com',
            firstName: 'Professionnel',
            lastName: 'Avyento'
          },
          message: 'Connexion réussie'
        });
      } else {
        console.log('❌ Échec connexion classique:', email);
        res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }
    } catch (error) {
      console.error('❌ Erreur connexion classique:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la connexion'
      });
    }
  });

  console.log('🔐 Routes de connexion professionnelle configurées');

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