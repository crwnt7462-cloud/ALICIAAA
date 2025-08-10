import type { Express } from "express";
import { createServer, type Server } from "http";
import jwt from 'jsonwebtoken';
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { messagingService, type Message } from "./messagingService";
import { registerFullStackRoutes } from "./fullStackRoutes";
import Stripe from "stripe";

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

// Configuration Stripe
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-06-30.basil",
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);
  
  // Register all full-stack routes
  registerFullStackRoutes(app);

  // Register new advanced feature routes
  // Import inline to avoid module resolution issues
  const promoCodeSchema = {
    create: (data: any) => ({
      code: data.code?.toUpperCase(),
      description: data.description,
      discountType: data.discountType,
      discountValue: data.discountValue,
      validFrom: new Date(data.validFrom),
      validUntil: new Date(data.validUntil),
      maxUses: data.maxUses,
      weekendPremium: data.weekendPremium || false,
      isActive: data.isActive !== false,
      applicableServices: data.applicableServices || [],
    })
  };

  // Routes existantes (API d'authentification, etc.)
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

  // Route pour récupérer le salon du professionnel connecté
  app.get('/api/user/salon', async (req: any, res) => {
    res.set('Content-Type', 'application/json');
    
    try {
      console.log(`🎯 Utilisateur démo - retour salon démo directement`);
      const demoSalon = await storage.getSalon('salon-demo');
      if (demoSalon) {
        console.log(`✅ Salon démo trouvé: ${demoSalon.name}`);
        return res.status(200).json(demoSalon);
      } else {
        console.log(`❌ Salon démo non trouvé, création...`);
        return res.status(404).json({ error: 'Salon démo non disponible' });
      }
    } catch (error) {
      console.error("Error fetching user salon:", error);
      return res.status(500).json({ message: "Failed to fetch user salon" });
    }
  });

  // Route pour récupérer l'abonnement de l'utilisateur  
  app.get('/api/user/subscription', async (req: any, res) => {
    res.set('Content-Type', 'application/json');
    
    try {
      console.log(`💳 Retour plan Premium Pro pour demo`);
      const subscription = {
        planId: 'premium',
        planName: 'Premium Pro', 
        price: 149,
        status: 'active',
        userId: 'demo-user'
      };
      console.log(`✅ Plan demo: ${subscription.planName} (${subscription.price}€)`);
      return res.status(200).json(subscription);
    } catch (error) {
      console.error("Error fetching user subscription:", error);
      return res.status(500).json({ message: "Failed to fetch user subscription" });
    }
  });

  // Routes pour les photos de salon
  app.get('/api/salon-photos/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const photos = await storage.getSalonPhotos(userId);
      res.json(photos);
    } catch (error) {
      console.error("Error fetching salon photos:", error);
      res.status(500).json({ error: "Failed to fetch salon photos" });
    }
  });

  app.post('/api/salon-photos', async (req, res) => {
    try {
      const photo = await storage.addSalonPhoto(req.body.userId, req.body);
      res.json(photo);
    } catch (error) {
      console.error("Error adding salon photo:", error);
      res.status(500).json({ error: "Failed to add salon photo" });
    }
  });

  app.put('/api/salon-photos/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const photo = await storage.updateSalonPhoto(id, req.body);
      res.json(photo);
    } catch (error) {
      console.error("Error updating salon photo:", error);
      res.status(500).json({ error: "Failed to update salon photo" });
    }
  });

  app.delete('/api/salon-photos/:id', async (req, res) => {
    try {
      const id = req.params.id;
      await storage.deleteSalonPhoto(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting salon photo:", error);
      res.status(500).json({ error: "Failed to delete salon photo" });
    }
  });

  // Routes pour les rendez-vous liés aux comptes clients
  app.get('/api/client-appointments/:clientAccountId', async (req, res) => {
    try {
      const { clientAccountId } = req.params;
      const appointments = await storage.getAppointments(clientAccountId);
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching client appointments:", error);
      res.status(500).json({ error: "Failed to fetch client appointments" });
    }
  });

  app.post('/api/appointments/:id/link-client', async (req, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const { clientAccountId } = req.body;
      // Cette fonctionnalité sera implémentée plus tard
      // await storage.linkAppointmentToClient(appointmentId, clientAccountId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error linking appointment to client:", error);
      res.status(500).json({ error: "Failed to link appointment to client" });
    }
  });



  // Routes d'inscription PRO
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, businessName, firstName, lastName, phone, address, city } = req.body;

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Un compte avec cet email existe déjà' });
      }

      // Créer le nouveau compte PRO
      const newUser = await storage.createUser({
        email,
        password,
        businessName,
        firstName,
        lastName,
        phone,
        address,
        city
      });

      // 🚀 CRÉATION AUTOMATIQUE DU SALON PERSONNEL pour ce professionnel
      const { createAutomaticSalonPage } = await import('./autoSalonCreation');
      const automaticSalon = await createAutomaticSalonPage({
        ownerName: `${firstName} ${lastName}`,
        businessName: businessName || `Salon ${firstName}`,
        email,
        phone: phone || '01 23 45 67 89',
        address: address || 'Adresse non spécifiée',
        subscriptionPlan: 'basic',
        services: ['Coiffure', 'Soins'],
        description: `Salon professionnel de ${firstName} ${lastName}`
      });

      console.log(`✅ Salon personnel créé pour ${email}: /salon/${automaticSalon.id}`);

      // Générer un token pour la connexion automatique
      const token = `demo-token-${newUser.id}`;
      
      res.json({
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          businessName: newUser.businessName,
          salonId: automaticSalon.id,  // ← Salon unique pour ce professionnel
          salonUrl: `/salon/${automaticSalon.id}`
        },
        salon: {
          id: automaticSalon.id,
          name: automaticSalon.name,
          url: automaticSalon.shareableUrl
        },
        token: token,
        message: `Compte PRO créé avec succès ! Votre salon est accessible sur /salon/${automaticSalon.id}`
      });
    } catch (error) {
      console.error("Erreur inscription PRO:", error);
      res.status(500).json({
        error: 'Erreur lors de la création du compte'
      });
    }
  });

  // Route de connexion PRO avec session persistante
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Compte test PRO
      if (email === 'test@monapp.com' && password === 'test1234') {
        // Stocker les données utilisateur dans la session
        (req.session as any).user = {
          id: 'test-pro-user',
          email: 'test@monapp.com',
          firstName: 'Salon',
          lastName: 'Excellence',
          businessName: 'Salon Excellence Paris',
          handle: '@usemyrr',
          role: 'professional',
          userType: 'professional'
        };
        
        res.json({
          success: true,
          user: (req.session as any).user,
          message: 'Connexion PRO réussie'
        });
        return;
      }

      // Authentification réelle
      const user = await storage.authenticateUser(email, password);
      if (user) {
        // Générer un token pour la connexion
        const token = `demo-token-${user.id}`;
        
        (req.session as any).user = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          businessName: user.businessName,
          role: 'professional',
          userType: 'professional'
        };
        
        res.json({
          success: true,
          user: (req.session as any).user,
          token: token,
          message: 'Connexion PRO réussie'
        });
      } else {
        console.log(`❌ Échec de connexion pour: ${email}`);
        res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
    } catch (error) {
      console.error("Erreur login PRO:", error);
      res.status(500).json({
        error: 'Erreur serveur'
      });
    }
  });

  // Route pour vérifier la session actuelle
  app.get('/api/auth/check-session', async (req, res) => {
    try {
      const user = (req.session as any)?.user;
      if (user) {
        res.json({
          authenticated: true,
          user: user
        });
      } else {
        res.json({
          authenticated: false
        });
      }
    } catch (error) {
      console.error("Erreur vérification session:", error);
      res.status(500).json({
        error: 'Erreur serveur'
      });
    }
  });

  // Route de déconnexion
  app.post('/api/auth/logout', async (req, res) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error("Erreur déconnexion:", err);
          return res.status(500).json({ error: 'Erreur lors de la déconnexion' });
        }
        res.clearCookie('connect.sid'); // Nom par défaut du cookie de session
        res.json({ success: true, message: 'Déconnexion réussie' });
      });
    } catch (error) {
      console.error("Erreur déconnexion:", error);
      res.status(500).json({
        error: 'Erreur serveur'
      });
    }
  });

  // Routes pour authentification client
  app.post('/api/client/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
      }

      const client = await storage.authenticateClient(email, password);
      
      if (client) {
        // Generate a secure JWT token
        const jwt = require('jsonwebtoken');
        const secret = process.env.JWT_SECRET || 'default-jwt-secret-change-in-production';
        const token = jwt.sign(
          { 
            clientId: client.id, 
            email: client.email,
            type: 'client'
          },
          secret,
          { expiresIn: '7d' } // Token expire dans 7 jours
        );
        
        res.json({
          success: true,
          client: {
            id: client.id,
            email: client.email,
            firstName: client.firstName,
            lastName: client.lastName,
            loyaltyPoints: client.loyaltyPoints,
            clientStatus: client.clientStatus,
            token
          }
        });
      } else {
        res.status(401).json({ error: 'Identifiants incorrects' });
      }
    } catch (error) {
      console.error('Client login error:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  app.post('/api/client/register', async (req, res) => {
    try {
      const { email, password, firstName, lastName, phone, dateOfBirth } = req.body;

      // Check if client already exists
      const existingClient = await storage.getClientAccountByEmail(email);
      if (existingClient) {
        return res.status(400).json({ error: 'Un compte avec cet email existe déjà' });
      }

      const newClient = await storage.createClientAccount({
        email,
        password,
        firstName,
        lastName,
        phone,
        dateOfBirth
      });

      const token = `client-${newClient.id}-${Date.now()}`;

      res.json({
        success: true,
        client: {
          id: newClient.id,
          email: newClient.email,
          firstName: newClient.firstName,
          lastName: newClient.lastName,
          loyaltyPoints: newClient.loyaltyPoints,
          clientStatus: newClient.clientStatus,
          token
        }
      });
    } catch (error) {
      console.error('Client registration error:', error);
      res.status(500).json({ error: 'Erreur lors de la création du compte' });
    }
  });

  app.get('/api/client/auth/check', async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Token manquant', 
        details: 'Authorization header requis' 
      });
    }

    try {
      const jwt = require('jsonwebtoken');
      const secret = process.env.JWT_SECRET || 'default-jwt-secret-change-in-production';
      
      // Vérifier et décoder le JWT
      const decoded = jwt.verify(token, secret) as any;
      
      if (decoded.type !== 'client') {
        return res.status(401).json({ 
          error: 'Type de token invalide',
          details: 'Token client requis'
        });
      }

      const client = await storage.getClientAccount(decoded.clientId);
      
      if (client) {
        res.json({
          id: client.id,
          email: client.email,
          firstName: client.firstName,
          lastName: client.lastName,
          loyaltyPoints: client.loyaltyPoints,
          clientStatus: client.clientStatus
        });
      } else {
        res.status(401).json({ 
          error: 'Utilisateur introuvable',
          details: 'Le compte client n\'existe plus'
        });
      }
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        res.status(401).json({ 
          error: 'Token expiré', 
          details: 'Veuillez vous reconnecter' 
        });
      } else if (error.name === 'JsonWebTokenError') {
        res.status(401).json({ 
          error: 'Token invalide', 
          details: 'Format de token incorrect' 
        });
      } else {
        res.status(500).json({ 
          error: 'Erreur serveur', 
          details: 'Impossible de valider le token' 
        });
      }
    }
  });

  // API pour l'éditeur de page salon
  app.put('/api/booking-pages/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Simuler la mise à jour de la page salon
      const updatedPage = {
        id,
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      res.json({
        success: true,
        page: updatedPage,
        message: 'Page salon mise à jour avec succès'
      });
    } catch (error) {
      console.error("Erreur mise à jour page salon:", error);
      res.status(500).json({
        error: 'Erreur lors de la mise à jour de la page salon'
      });
    }
  });

  // API pour récupérer la page salon actuelle
  app.get('/api/booking-pages/current', async (req, res) => {
    try {
      // Simuler récupération de la page salon actuelle
      const currentPage = {
        id: 'salon-test-pro-user',
        salonName: 'Salon Excellence Paris',
        salonDescription: 'Salon de beauté professionnel situé au cœur de Paris. Spécialisé en coiffure, soins esthétiques et bien-être.',
        salonAddress: '123 Avenue des Champs-Élysées, 75008 Paris',
        salonPhone: '01 42 25 76 88',
        logoUrl: null,
        coverImageUrl: null,
        photos: [],
        primaryColor: '#8B5CF6',
        isPublished: true,
        pageUrl: 'salon-excellence-paris'
      };
      
      res.json(currentPage);
    } catch (error) {
      console.error("Erreur récupération page salon:", error);
      res.status(500).json({
        error: 'Erreur lors de la récupération de la page salon'
      });
    }
  });

  // Routes salon pour workflow d'abonnement
  app.post('/api/salon/register', async (req, res) => {
    try {
      const { salonData, subscriptionPlan } = req.body;
      
      // Créer le salon avec le plan d'abonnement
      const salon = await storage.createSalon({
        ...salonData,
        subscriptionPlan
      });
      
      res.json({ 
        success: true, 
        salon,
        message: 'Salon créé avec succès'
      });
    } catch (error) {
      console.error("Erreur création salon:", error);
      res.status(500).json({ 
        error: 'Erreur lors de la création du salon',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  });

  // ✅ ROUTE STANDARDISÉE UNIQUE POUR SALON BY ID
  app.get('/api/salon/:salonId', async (req, res) => {
    try {
      const { salonId } = req.params;
      console.log(`🔍 API: Récupération salon ID: ${salonId}`);
      
      const salon = await storage.getSalon(salonId);
      
      if (!salon) {
        console.log(`❌ API: Salon non trouvé: ${salonId}`);
        return res.status(404).json({ 
          error: 'Salon non trouvé',
          salonId,
          message: `Aucun salon trouvé avec l'identifiant: ${salonId}`
        });
      }
      
      console.log(`✅ API: Salon trouvé: ${salon.name} (${salonId})`);
      
      // Réponse normalisée avec structure cohérente
      const normalizedSalon = {
        id: salon.id,
        name: salon.name,
        description: salon.description,
        address: salon.address,
        phone: salon.phone,
        email: salon.email,
        customColors: salon.customColors || {},
        serviceCategories: salon.serviceCategories || [],
        photos: salon.photos || [],
        isPublished: salon.isPublished,
        createdAt: salon.createdAt,
        updatedAt: salon.updatedAt
      };
      
      res.json(normalizedSalon);
    } catch (error) {
      console.error("❌ API: Erreur récupération salon:", error);
      res.status(500).json({ 
        error: 'Erreur serveur lors de la récupération du salon',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  });

  app.put('/api/salon/:salonId', async (req, res) => {
    try {
      const { salonId } = req.params;
      const updateData = req.body;
      
      const updatedSalon = await storage.updateSalon(salonId, updateData);
      
      if (!updatedSalon) {
        return res.status(404).json({ error: 'Salon non trouvé' });
      }
      
      res.json({ 
        success: true, 
        salon: updatedSalon,
        message: 'Salon mis à jour avec succès'
      });
    } catch (error) {
      console.error("Erreur mise à jour salon:", error);
      res.status(500).json({ 
        error: 'Erreur lors de la mise à jour du salon',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  });

  // Route de simulation Stripe checkout
  app.post('/api/stripe/checkout', async (req, res) => {
    try {
      const { salonId, plan } = req.body;
      
      // Simuler une session Stripe
      const checkoutSession = {
        id: `cs_${Date.now()}`,
        url: `https://checkout.stripe.com/c/pay/cs_${Date.now()}`,
        success_url: `/edit-salon?salonId=${salonId}&success=true`,
        cancel_url: '/salon-registration',
        amount: plan === 'pro' ? 4900 : 14900, // en centimes
        currency: 'eur'
      };
      
      res.json({
        success: true,
        checkoutSession,
        message: 'Session de paiement créée'
      });
    } catch (error) {
      console.error("Erreur checkout Stripe:", error);
      res.status(500).json({ 
        error: 'Erreur lors de la création de la session de paiement',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  });

  // Routes d'authentification client
  app.post('/api/client/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Simuler une authentification client réussie
      if (email && password) {
        const clientToken = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        res.json({
          success: true,
          client: {
            id: Date.now(),
            email,
            firstName: "Client",
            lastName: "Test",
            token: clientToken
          },
          message: 'Connexion réussie'
        });
      } else {
        res.status(400).json({
          error: 'Email et mot de passe requis'
        });
      }
    } catch (error) {
      console.error("Erreur login client:", error);
      res.status(500).json({
        error: 'Erreur lors de la connexion',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  });

  app.post('/api/client/register', async (req, res) => {
    try {
      const { email, password, firstName, lastName, phone } = req.body;
      
      // Simuler une inscription client réussie
      if (email && password && firstName && lastName) {
        const clientToken = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        res.json({
          success: true,
          client: {
            id: Date.now(),
            email,
            firstName,
            lastName,
            phone,
            token: clientToken
          },
          message: 'Inscription réussie'
        });
      } else {
        res.status(400).json({
          error: 'Informations requises manquantes'
        });
      }
    } catch (error) {
      console.error("Erreur inscription client:", error);
      res.status(500).json({
        error: 'Erreur lors de l\'inscription',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  });

  // Routes pour la réservation client - Liste des salons par catégorie
  app.get('/api/salons', async (req, res) => {
    try {
      const { category } = req.query;
      console.log('🔍 RECHERCHE SALONS - Catégorie:', category);
      
      // ✅ CORRECTION MAJEURE: Utiliser les vrais salons PostgreSQL créés par les pros
      let realSalons = [];
      try {
        realSalons = await storage.getSalons();
        console.log(`📊 ${realSalons.length} salons réels trouvés en PostgreSQL`);
      } catch (error) {
        console.error('❌ Erreur récupération salons PostgreSQL:', error);
      }
      
      // Transformer les salons PostgreSQL au format attendu par l'interface
      const formattedSalons = realSalons.map(salon => ({
        id: salon.id,
        name: salon.name,
        category: 'coiffure', // Peut être déterminé depuis serviceCategories
        address: salon.address,
        rating: salon.rating || 4.8,
        reviews: salon.reviewCount || 0,
        price: '€€€',
        image: salon.photos?.[0] || salon.coverImageUrl || '/salon-default.jpg',
        services: salon.serviceCategories?.[0]?.services?.map((s: any) => s.name) || ['Service professionnel'],
        openNow: salon.isPublished || true,
        description: salon.description,
        phone: salon.phone,
        email: salon.email
      }));
      
      console.log(`✅ ${formattedSalons.length} salons formatés pour recherche`);
      
      // Filtrer par catégorie si spécifiée
      const filteredSalons = category 
        ? formattedSalons.filter(salon => salon.category === category)
        : formattedSalons;
      
      console.log(`🎯 ${filteredSalons.length} salons après filtrage catégorie`);
      
      res.json({
        success: true,
        salons: filteredSalons,
        total: filteredSalons.length
      });
    } catch (error) {
      console.error("Erreur récupération salons:", error);
      res.status(500).json({
        error: 'Erreur lors de la récupération des salons'
      });
    }
  });

  // Route des catégories de services
  app.get('/api/service-categories', async (req, res) => {
    try {
      const categories = [
        {
          id: 'coiffure',
          name: 'Coiffure',
          description: 'Coupes, colorations, brushings',
          icon: '✂️',
          salonCount: 2
        },
        {
          id: 'esthetique',
          name: 'Esthétique',
          description: 'Soins du visage, épilation',
          icon: '💆‍♀️',
          salonCount: 2
        },
        {
          id: 'massage',
          name: 'Massage',
          description: 'Massages relaxants, thérapeutiques',
          icon: '💆',
          salonCount: 1
        },
        {
          id: 'onglerie',
          name: 'Onglerie',
          description: 'Manucure, pédicure, nail art',
          icon: '💅',
          salonCount: 1
        }
      ];
      
      res.json({
        success: true,
        categories
      });
    } catch (error) {
      console.error("Erreur récupération catégories:", error);
      res.status(500).json({
        error: 'Erreur lors de la récupération des catégories'
      });
    }
  });

  // Route de santé
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      message: 'API Salon en fonctionnement'
    });
  });

  // Route pour créer un nouveau client
  app.post("/api/clients", async (req: any, res) => {
    try {
      const { firstName, lastName, email, phone } = req.body;
      
      if (!firstName || !lastName || !email) {
        return res.status(400).json({ 
          error: 'Prénom, nom et email sont requis' 
        });
      }

      const newClient = {
        id: `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        firstName,
        lastName,
        email,
        phone: phone || '',
        createdAt: new Date().toISOString(),
        totalSpent: 0,
        totalAppointments: 0,
        lastVisit: null,
        status: 'active'
      };

      res.json({
        success: true,
        client: newClient,
        message: 'Client créé avec succès'
      });
    } catch (error) {
      console.error("Erreur création client:", error);
      res.status(500).json({ 
        error: 'Erreur lors de la création du client',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  });

  // Client Notes Management Routes
  app.get("/api/clients-with-notes", async (req: any, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "Token manquant" });
      }
      
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const professionalId = decoded.userId;

      const clients = await storage.getClientsByProfessional(professionalId);
      res.json(clients);
    } catch (error) {
      console.error("Error fetching clients with notes:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des clients" });
    }
  });

  app.post("/api/client-notes", async (req: any, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "Token manquant" });
      }
      
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const professionalId = decoded.userId;

      const noteData = {
        ...req.body,
        professionalId
      };

      const note = await storage.createOrUpdateClientNote(noteData.clientId, noteData.content, noteData.professionalId);
      res.json(note);
    } catch (error) {
      console.error("Error saving client note:", error);
      res.status(500).json({ message: "Erreur lors de la sauvegarde" });
    }
  });

  // Custom Tags Management Routes
  app.get("/api/custom-tags", async (req: any, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "Token manquant" });
      }
      
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const professionalId = decoded.userId;

      const tags = await storage.getCustomTagsByProfessional(professionalId);
      res.json(tags);
    } catch (error) {
      console.error("Error fetching custom tags:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des tags" });
    }
  });

  app.post("/api/custom-tags", async (req: any, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "Token manquant" });
      }
      
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const professionalId = decoded.userId;

      const tagData = {
        ...req.body,
        professionalId
      };

      const tag = await storage.createCustomTag(tagData);
      res.json(tag);
    } catch (error) {
      console.error("Error creating custom tag:", error);
      res.status(500).json({ message: "Erreur lors de la création du tag" });
    }
  });

  app.delete("/api/custom-tags/:tagId", async (req: any, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "Token manquant" });
      }
      
      const { tagId } = req.params;
      await storage.deleteCustomTag(tagId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting custom tag:", error);
      res.status(500).json({ message: "Erreur lors de la suppression du tag" });
    }
  });

  // ===== ROUTE RECHERCHE UTILISATEURS =====
  app.get("/api/users/search", async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string') {
        return res.json([]);
      }
      
      // Recherche simulation pour le moment - retourne utilisateurs de test
      const testUsers = [
        {
          id: 'test-pro-user',
          name: 'Salon Excellence Paris',
          handle: '@usemyrr',
          userType: 'pro',
          isOnline: true,
          lastSeen: 'En ligne'
        },
        {
          id: 'test-client-user',
          name: 'Client Test',
          handle: '@client_test',
          userType: 'client',
          isOnline: false,
          lastSeen: 'Il y a 1h'
        },
        {
          id: 'marie-user',
          name: 'Marie Dupont',
          handle: '@marie_d',
          userType: 'client',
          isOnline: true,
          lastSeen: 'En ligne'
        },
        {
          id: 'sophie-user',
          name: 'Sophie Martin',
          handle: '@sophie_m',
          userType: 'client',
          isOnline: false,
          lastSeen: 'Il y a 2h'
        }
      ];
      
      // Filtrer selon la recherche
      const searchTerm = q.toLowerCase();
      const results = testUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.handle.toLowerCase().includes(searchTerm)
      );
      
      res.json(results);
    } catch (error) {
      console.error("Erreur recherche utilisateurs:", error);
      res.status(500).json({ error: 'Erreur lors de la recherche' });
    }
  });

  // ===== ROUTES MESSAGERIE TEMPS RÉEL =====
  app.post("/api/messaging/send", async (req, res) => {
    try {
      const { fromUserId, fromUserType, fromUserName, toUserId, toUserType, toUserName, content } = req.body;
      if (!fromUserId || !fromUserType || !fromUserName || !toUserId || !toUserType || !toUserName || !content) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
      }
      const message = messagingService.sendMessage(fromUserId, fromUserType, fromUserName, toUserId, toUserType, toUserName, content);
      res.json({ success: true, message, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error("Erreur envoi message:", error);
      res.status(500).json({ error: "Erreur lors de l'envoi du message" });
    }
  });

  app.get("/api/messaging/conversation/:clientId/:professionalId", async (req, res) => {
    try {
      const { clientId, professionalId } = req.params;
      const messages = messagingService.getConversationMessages(clientId, professionalId);
      res.json({ success: true, messages, total: messages.length });
    } catch (error) {
      console.error("Erreur récupération messages:", error);
      res.status(500).json({ error: "Erreur lors de la récupération des messages" });
    }
  });

  app.get("/api/messaging/conversations/:userId/:userType", async (req, res) => {
    try {
      const { userId, userType } = req.params;
      if (userType !== 'client' && userType !== 'professional') {
        return res.status(400).json({ error: "Type d'utilisateur invalide" });
      }
      const conversations = messagingService.getUserConversations(userId, userType);
      res.json({ success: true, conversations, total: conversations.length });
    } catch (error) {
      console.error("Erreur récupération conversations:", error);
      res.status(500).json({ error: "Erreur lors de la récupération des conversations" });
    }
  });

  // API pour le système de réservation
  app.post('/api/stripe/create-payment-intent', async (req, res) => {
    try {
      const { amount, bookingData } = req.body;
      
      // Simulation de création d'intention de paiement Stripe
      const clientSecret = `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`;
      
      // Sauvegarder les données de réservation temporairement
      // En production, vous utiliseriez une vraie base de données
      const bookingId = Date.now().toString();
      
      console.log('💳 Intention de paiement créée:', {
        amount,
        clientSecret,
        bookingId,
        bookingData
      });

      res.json({ 
        clientSecret,
        bookingId,
        amount 
      });
    } catch (error) {
      console.error('Erreur création payment intent:', error);
      res.status(500).json({ error: 'Erreur lors de la création du paiement' });
    }
  });

  // API pour l'inscription salon avec paiement
  app.post('/api/salon/register-with-payment', async (req, res) => {
    try {
      const registrationData = req.body;
      
      // Générer un ID d'inscription unique
      const registrationId = `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Simulation de création d'intention de paiement Stripe pour l'abonnement
      const planPrices = {
        essential: 19,
        professional: 49,
        enterprise: 99
      };
      
      const amount = planPrices[registrationData.selectedPlan as keyof typeof planPrices] || 19;
      const stripeClientSecret = `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`;
      
      // Sauvegarder temporairement les données d'inscription
      console.log('🏢 Inscription salon créée:', {
        registrationId,
        salonName: registrationData.salonName,
        ownerEmail: registrationData.ownerEmail,
        selectedPlan: registrationData.selectedPlan,
        amount
      });

      res.json({
        registrationId,
        stripeClientSecret,
        amount,
        planName: registrationData.selectedPlan
      });
    } catch (error) {
      console.error('Erreur inscription salon:', error);
      res.status(500).json({ error: 'Erreur lors de l\'inscription' });
    }
  });

  // API pour confirmer le paiement d'inscription
  app.post('/api/salon/confirm-payment', async (req, res) => {
    try {
      const { registrationId, paymentStatus } = req.body;
      
      if (paymentStatus === 'succeeded') {
        // En production: créer le compte salon, l'abonnement, etc.
        console.log('✅ Paiement confirmé pour inscription:', registrationId);
        
        res.json({
          success: true,
          salonId: `salon_${registrationId}`,
          message: 'Salon créé avec succès'
        });
      } else {
        res.status(400).json({ error: 'Paiement échoué' });
      }
    } catch (error) {
      console.error('Erreur confirmation paiement:', error);
      res.status(500).json({ error: 'Erreur lors de la confirmation' });
    }
  });

  // ===== ROUTES COMPLÈTES POUR SYSTÈME COMPLET =====

  // SUPPRIMÉ: Route dupliquée avec celle ligne 655

  // Services Management Routes
  app.get('/api/services/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const services = await storage.getServicesByUserId ? 
        await storage.getServicesByUserId(userId) : 
        [];
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.post('/api/services', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ 
          error: "Unauthorized",
          details: "User authentication required to create services" 
        });
      }

      // Validation des données requises avec conversion des types
      const { name, price, duration } = req.body;
      if (!name || price === undefined || price === null || !duration) {
        return res.status(400).json({
          error: "Missing required fields",
          details: "Service must have name, price, and duration"
        });
      }

      // Conversion et validation du prix robuste
      const numericPrice = typeof price === 'string' ? parseFloat(price) : Number(price);
      if (!numericPrice || isNaN(numericPrice) || numericPrice <= 0) {
        return res.status(400).json({
          error: "Invalid price",
          details: "Price must be a positive number"
        });
      }

      const serviceData = {
        ...req.body,
        price: numericPrice, // Utiliser le prix numérique validé
        userId, // Associer au user authentifié
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('🔧 Création service pour user:', userId, 'Service:', name);
      const service = await storage.createService(serviceData);
      
      console.log('✅ Service créé avec ID:', service.id);
      res.json(service);
    } catch (error) {
      console.error("Error creating service:", error);
      res.status(500).json({ 
        error: "Failed to create service",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.put('/api/services/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const serviceData = req.body;
      
      console.log('🔧 Modification service ID:', id, 'Données:', serviceData);
      
      if (!id || isNaN(id)) {
        return res.status(400).json({ 
          error: "Invalid service ID",
          details: "Service ID must be a number" 
        });
      }

      // Convertir le prix en nombre si nécessaire
      if (serviceData.price && typeof serviceData.price === 'string') {
        serviceData.price = parseFloat(serviceData.price).toFixed(2);
      }

      const updatedService = await storage.updateService(id, serviceData);
      
      console.log('✅ Service mis à jour:', updatedService.name);
      res.json(updatedService);

      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          error: "Invalid service ID",
          details: "Service ID must be a positive integer"
        });
      }

      // Vérifier que le service appartient à l'utilisateur
      const existingService = await storage.getServiceById(id);
      if (!existingService) {
        return res.status(404).json({
          error: "Service not found",
          details: `No service found with ID ${id}`
        });
      }

      // Note: userId validation removed for now due to type mismatch

      const updateData = {
        ...req.body,
        updatedAt: new Date()
      };

      console.log('🔧 Mise à jour service ID:', id);
      const service = await storage.updateService(id, updateData);
      
      console.log('✅ Service mis à jour:', service.name);
      res.json(service);
    } catch (error) {
      console.error("Error updating service:", error);
      res.status(500).json({ 
        error: "Failed to update service",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.delete('/api/services/:id', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const id = parseInt(req.params.id);
      
      if (!userId) {
        return res.status(401).json({ 
          error: "Unauthorized",
          details: "User authentication required" 
        });
      }

      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          error: "Invalid service ID",
          details: "Service ID must be a positive integer"
        });
      }

      // Vérifier que le service appartient à l'utilisateur
      const existingService = await storage.getServiceById(id);
      if (!existingService) {
        return res.status(404).json({
          error: "Service not found",
          details: `No service found with ID ${id}`
        });
      }

      if (existingService.userId !== userId) {
        return res.status(403).json({
          error: "Forbidden",
          details: "You can only delete your own services"
        });
      }

      console.log('🗑️ Suppression service ID:', id, 'par user:', userId);
      await storage.deleteService(id);
      
      console.log('✅ Service supprimé avec succès');
      res.json({ 
        success: true,
        message: `Service ${existingService.name} deleted successfully`,
        deletedServiceId: id
      });
    } catch (error) {
      console.error("Error deleting service:", error);
      res.status(500).json({ 
        error: "Failed to delete service",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Clients Management Routes
  app.get('/api/clients/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const clients = await storage.getClients(userId);
      res.json(clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  app.post('/api/clients', async (req, res) => {
    try {
      const client = await storage.createClient(req.body);
      res.json(client);
    } catch (error) {
      console.error("Error creating client:", error);
      res.status(500).json({ error: "Failed to create client" });
    }
  });

  app.put('/api/clients/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const client = await storage.updateClient(id, req.body);
      res.json(client);
    } catch (error) {
      console.error("Error updating client:", error);
      res.status(500).json({ error: "Failed to update client" });
    }
  });

  app.delete('/api/clients/:id', async (req, res) => {
    try {
      const id = req.params.id;
      await storage.deleteClient(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting client:", error);
      res.status(500).json({ error: "Failed to delete client" });
    }
  });

  // Staff Management Routes
  app.get('/api/staff/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const staff = await storage.getStaff(userId);
      res.json(staff);
    } catch (error) {
      console.error("Error fetching staff:", error);
      res.status(500).json({ error: "Failed to fetch staff" });
    }
  });

  app.post('/api/staff', async (req, res) => {
    try {
      const staff = await storage.createStaff(req.body);
      res.json(staff);
    } catch (error) {
      console.error("Error creating staff:", error);
      res.status(500).json({ error: "Failed to create staff" });
    }
  });

  app.put('/api/staff/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const staff = await storage.updateStaff(id, req.body);
      res.json(staff);
    } catch (error) {
      console.error("Error updating staff:", error);
      res.status(500).json({ error: "Failed to update staff" });
    }
  });

  app.delete('/api/staff/:id', async (req, res) => {
    try {
      const id = req.params.id;
      await storage.deleteStaff(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting staff:", error);
      res.status(500).json({ error: "Failed to delete staff" });
    }
  });

  // Appointments Management Routes
  app.get('/api/appointments/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const { date } = req.query;
      const appointments = await storage.getAppointments(userId);
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ error: "Failed to fetch appointments" });
    }
  });

  app.post('/api/appointments', async (req, res) => {
    try {
      const appointment = await storage.createAppointment(req.body);
      res.json(appointment);
    } catch (error) {
      console.error("Error creating appointment:", error);
      res.status(500).json({ error: "Failed to create appointment" });
    }
  });

  app.put('/api/appointments/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const appointment = await storage.updateAppointment(id, req.body);
      res.json(appointment);
    } catch (error) {
      console.error("Error updating appointment:", error);
      res.status(500).json({ error: "Failed to update appointment" });
    }
  });

  app.delete('/api/appointments/:id', async (req, res) => {
    try {
      const id = req.params.id;
      await storage.deleteAppointment(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting appointment:", error);
      res.status(500).json({ error: "Failed to delete appointment" });
    }
  });

  // Dashboard Routes
  app.get('/api/dashboard/stats/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const stats = await storage.getDashboardStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  app.get('/api/dashboard/revenue-chart', async (req, res) => {
    try {
      const userId = (req.session as any)?.user?.id || 'demo';
      const revenueChart = await storage.getRevenueChart(userId);
      res.json(revenueChart);
    } catch (error) {
      console.error("Error fetching revenue chart:", error);
      res.status(500).json({ error: "Failed to fetch revenue chart" });
    }
  });

  app.get('/api/dashboard/upcoming-appointments', async (req, res) => {
    try {
      const userId = (req.session as any)?.user?.id || 'demo';
      const appointments = await storage.getUpcomingAppointments(userId);
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching upcoming appointments:", error);
      res.status(500).json({ error: "Failed to fetch upcoming appointments" });
    }
  });

  app.get('/api/dashboard/top-services', async (req, res) => {
    try {
      const userId = (req.session as any)?.user?.id || 'demo';
      const services = await storage.getTopServices(userId);
      res.json(services);
    } catch (error) {
      console.error("Error fetching top services:", error);
      res.status(500).json({ error: "Failed to fetch top services" });
    }
  });

  app.get('/api/dashboard/staff-performance', async (req, res) => {
    try {
      const userId = (req.session as any)?.user?.id || 'demo';
      const performance = await storage.getStaffPerformance(userId);
      res.json(performance);
    } catch (error) {
      console.error("Error fetching staff performance:", error);
      res.status(500).json({ error: "Failed to fetch staff performance" });
    }
  });

  app.get('/api/dashboard/client-retention', async (req, res) => {
    try {
      const userId = (req.session as any)?.user?.id || 'demo';
      const retention = await storage.getClientRetentionRate(userId);
      res.json(retention);
    } catch (error) {
      console.error("Error fetching client retention:", error);
      res.status(500).json({ error: "Failed to fetch client retention" });
    }
  });

  // ❌ ROUTE SUPPRIMÉE - Utiliser /api/salon/:salonId à la place

  app.post('/api/salon/register', async (req, res) => {
    try {
      const salon = await storage.createSalon(req.body);
      res.json({ success: true, salon });
    } catch (error) {
      console.error("Error creating salon:", error);
      res.status(500).json({ error: "Failed to create salon" });
    }
  });

  app.put('/api/salon/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const salon = await storage.updateSalon(id, req.body);
      res.json({ success: true, salon });
    } catch (error) {
      console.error("Error updating salon:", error);
      res.status(500).json({ error: "Failed to update salon" });
    }
  });

  // Business Registration Routes
  app.post('/api/business/register', async (req, res) => {
    try {
      const registration = await storage.createBusinessRegistration(req.body);
      res.json({ success: true, registration });
    } catch (error) {
      console.error("Error creating business registration:", error);
      res.status(500).json({ error: "Failed to create business registration" });
    }
  });

  app.get('/api/business/registration/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const registration = await storage.getBusinessRegistration(id);
      res.json(registration);
    } catch (error) {
      console.error("Error fetching business registration:", error);
      res.status(500).json({ error: "Failed to fetch business registration" });
    }
  });

  // Subscription Management Routes
  app.post('/api/subscriptions', async (req, res) => {
    try {
      const subscription = await storage.createSubscription(req.body);
      res.json({ success: true, subscription });
    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ error: "Failed to create subscription" });
    }
  });

  app.get('/api/subscriptions/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const subscriptions = await storage.getSubscriptionsByUserId(userId);
      res.json(subscriptions);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      res.status(500).json({ error: "Failed to fetch subscriptions" });
    }
  });

  // Routes Stripe pour paiements réels
  app.post('/api/create-payment-intent', async (req, res) => {
    try {
      console.log('💳 Création Payment Intent - Données reçues:', req.body);
      
      if (!stripe) {
        console.error('❌ Stripe non configuré');
        return res.status(500).json({ error: "Stripe not configured. Please set STRIPE_SECRET_KEY." });
      }

      const { amount, currency = 'eur', metadata = {} } = req.body;
      
      // Conversion robuste du montant
      const numericAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
      
      if (!numericAmount || isNaN(numericAmount) || numericAmount <= 0) {
        console.error('❌ Montant invalide:', { received: amount, converted: numericAmount });
        return res.status(400).json({ 
          error: "Invalid amount",
          details: "Amount must be a positive number",
          received: amount
        });
      }

      console.log('🔧 Création Payment Intent Stripe...');
      
      // Créer un Payment Intent avec Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(numericAmount * 100), // Convertir en centimes avec montant validé
        currency,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });
      
      console.log('✅ Payment Intent créé:', paymentIntent.id);
      
      res.json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: numericAmount,
        currency: currency
      });
    } catch (error: any) {
      console.error("❌ Erreur création Payment Intent:", error);
      res.status(500).json({ 
        success: false,
        error: error?.message || "Failed to create payment intent",
        details: error?.code || 'stripe_error'
      });
    }
  });

  app.post('/api/confirm-booking-payment', async (req, res) => {
    try {
      const { paymentIntentId, bookingData } = req.body;
      
      if (!stripe) {
        return res.status(500).json({ error: "Stripe not configured" });
      }

      // Vérifier le statut du paiement
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        // Créer la réservation en base
        const appointment = await storage.createAppointment({
          clientAccountId: bookingData.clientId,
          salonId: bookingData.salonId || 1,
          serviceId: bookingData.serviceId || 1,
          staffId: bookingData.staffId || 1,
          appointmentDate: bookingData.date,
          appointmentTime: bookingData.time,
          status: 'confirmed',
          totalPrice: bookingData.totalPrice,
          depositPaid: bookingData.depositAmount,
          paymentIntentId: paymentIntentId,
          notes: bookingData.notes || ''
        });

        res.json({
          success: true,
          appointment,
          paymentStatus: paymentIntent.status
        });
      } else {
        res.status(400).json({
          error: "Payment not completed",
          paymentStatus: paymentIntent.status
        });
      }
    } catch (error: any) {
      console.error("Error confirming booking payment:", error);
      res.status(500).json({ error: error?.message || "Failed to confirm payment" });
    }
  });

  // Route de test pour notifications
  app.post('/api/test-notification', async (req, res) => {
    try {
      const { userId = 'demo', type = 'appointment', title, message } = req.body;
      
      // TODO: Importer et implémenter notificationService
      console.log(`🧪 Test notification (simulée) envoyée à ${userId}`);
      res.json({ 
        success: true, 
        message: `Notification simulée envoyée à ${userId}`,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Erreur test notification:', error);
      res.status(500).json({ success: false, error: error?.message || 'Erreur inconnue' });
    }
  });

  // Routes pour les codes promo
  app.get('/api/promo-codes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      // Mock data for now - would implement in storage later
      const promoCodes = [
        {
          id: 1,
          code: 'WELCOME20',
          description: 'Remise de bienvenue pour nouveaux clients',
          discountType: 'percentage',
          discountValue: 20,
          validFrom: new Date('2025-01-01'),
          validUntil: new Date('2025-12-31'),
          maxUses: 100,
          currentUses: 15,
          weekendPremium: false,
          isActive: true,
          applicableServices: []
        },
        {
          id: 2,
          code: 'WEEKEND10',
          description: 'Remise spéciale weekend',
          discountType: 'fixed_amount',
          discountValue: 10,
          validFrom: new Date('2025-01-01'),
          validUntil: new Date('2025-06-30'),
          maxUses: 50,
          currentUses: 32,
          weekendPremium: true,
          isActive: true,
          applicableServices: [1, 2]
        }
      ];
      res.json(promoCodes);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
      res.status(500).json({ message: 'Failed to fetch promo codes' });
    }
  });

  app.post('/api/promo-codes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const promoCodeData = promoCodeSchema.create(req.body);
      
      // Mock response - would implement in storage
      const newPromoCode = {
        id: Date.now(),
        ...promoCodeData,
        currentUses: 0,
        salonId: userId
      };
      
      res.status(201).json(newPromoCode);
    } catch (error) {
      console.error('Error creating promo code:', error);
      res.status(500).json({ message: 'Failed to create promo code' });
    }
  });

  // Routes pour la fiabilité client
  app.get('/api/client-reliability', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      // Mock data for demo
      const reliabilityData = [
        {
          clientId: 'client-1',
          consecutiveCancellations: 0,
          reliabilityScore: 95,
          totalAppointments: 12,
          totalCancellations: 1,
          totalNoShows: 0,
          customDepositPercentage: null
        },
        {
          clientId: 'client-2',
          consecutiveCancellations: 2,
          reliabilityScore: 25,
          totalAppointments: 8,
          totalCancellations: 4,
          totalNoShows: 1,
          customDepositPercentage: 70,
          lastCancellationDate: new Date('2025-01-15')
        }
      ];
      res.json(reliabilityData);
    } catch (error) {
      console.error('Error fetching client reliability:', error);
      res.status(500).json({ message: 'Failed to fetch client reliability' });
    }
  });

  // Routes pour les équipes (staff)
  app.get('/api/staff', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      // Mock staff data
      const staff = [
        {
          id: 1,
          firstName: 'Marie',
          lastName: 'Dubois',
          email: 'marie@salon.com',
          phone: '0123456789',
          specialties: ['Coiffure', 'Coloration'],
          color: '#8B5CF6',
          isActive: true,
          workSchedule: {
            monday: { start: '09:00', end: '18:00' },
            tuesday: { start: '09:00', end: '18:00' },
            wednesday: { start: '09:00', end: '18:00' },
            thursday: { start: '09:00', end: '18:00' },
            friday: { start: '09:00', end: '18:00' },
            saturday: { start: '10:00', end: '17:00' }
          }
        },
        {
          id: 2,
          firstName: 'Sophie',
          lastName: 'Martin',
          email: 'sophie@salon.com',
          phone: '0123456790',
          specialties: ['Manucure', 'Pédicure'],
          color: '#06B6D4',
          isActive: true,
          workSchedule: {
            tuesday: { start: '10:00', end: '19:00' },
            wednesday: { start: '10:00', end: '19:00' },
            thursday: { start: '10:00', end: '19:00' },
            friday: { start: '10:00', end: '19:00' },
            saturday: { start: '09:00', end: '16:00' }
          }
        }
      ];
      res.json(staff);
    } catch (error) {
      console.error('Error fetching staff:', error);
      res.status(500).json({ message: 'Failed to fetch staff' });
    }
  });

  // Route pour récupérer les détails d'une réservation
  app.get('/api/bookings/:bookingId', async (req, res) => {
    console.log('🎯 API /api/bookings/:bookingId appelée avec ID:', req.params.bookingId);
    
    try {
      const { bookingId } = req.params;
      console.log('🔍 Recherche réservation ID:', bookingId);
      
      // Définir explicitement le content-type
      res.setHeader('Content-Type', 'application/json');
      
      // Récupérer les détails du rendez-vous depuis la base de données
      const booking = await storage.getAppointmentById(parseInt(bookingId));
      console.log('📋 Réservation trouvée:', booking);
      
      if (!booking) {
        console.log('❌ Réservation non trouvée pour ID:', bookingId);
        return res.status(404).json({ error: 'Réservation non trouvée' });
      }

      // Récupérer les informations du service et du salon
      const service = booking.serviceId ? await storage.getServiceById(booking.serviceId) : null;
      const salon = await storage.getSalonByUserId(booking.userId);
      console.log('🏪 Service:', service?.name, 'Salon:', salon?.name);

      const response = {
        id: booking.id,
        professional: `${booking.clientName || 'Professionnel'}`,
        service: service?.name || 'Service non spécifié',
        salon: salon?.name || 'Salon de beauté',
        date: booking.appointmentDate,
        time: booking.startTime,
        duration: service?.duration ? `${service.duration} min` : '60 min',
        price: booking.totalPrice ? `${booking.totalPrice}€` : service?.price ? `${service.price}€` : '0€',
        address: salon?.address || 'Adresse non spécifiée',
        phone: salon?.phone || 'Numéro non spécifié',
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        depositPaid: booking.depositPaid
      };

      console.log('✅ Réponse API préparée:', response);
      return res.json(response);
    } catch (error) {
      console.error("❌ Erreur récupération détails réservation:", error);
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({ 
        error: 'Erreur lors de la récupération des détails',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  });

  const httpServer = createServer(app);

  // Initialize WebSocket service for real-time notifications
  const { websocketService } = await import('./websocketService');
  websocketService.initialize(httpServer);

  return httpServer;
}