import type { Express } from "express";
import { createServer, type Server } from "http";
import jwt from 'jsonwebtoken';
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { messagingService, type Message } from "./messagingService";

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

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
      const photo = await storage.addSalonPhoto(req.body);
      res.json(photo);
    } catch (error) {
      console.error("Error adding salon photo:", error);
      res.status(500).json({ error: "Failed to add salon photo" });
    }
  });

  app.put('/api/salon-photos/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const photo = await storage.updateSalonPhoto(id, req.body);
      res.json(photo);
    } catch (error) {
      console.error("Error updating salon photo:", error);
      res.status(500).json({ error: "Failed to update salon photo" });
    }
  });

  app.delete('/api/salon-photos/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
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
      const appointments = await storage.getClientAppointments(clientAccountId);
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
      
      res.status(401).json({
        error: 'Identifiants incorrects'
      });
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
  app.get('/api/client/auth/check', async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token === 'mock-client-token') {
      res.json({
        id: 'client-1',
        firstName: 'Marie',
        lastName: 'Dupont',
        email: 'marie.dupont@email.com'
      });
    } else {
      res.status(401).json({ error: 'Non authentifié' });
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

  app.get('/api/salon/:salonId', async (req, res) => {
    try {
      const { salonId } = req.params;
      const salon = await storage.getSalon(salonId);
      
      if (!salon) {
        return res.status(404).json({ error: 'Salon non trouvé' });
      }
      
      res.json({ salon });
    } catch (error) {
      console.error("Erreur récupération salon:", error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération du salon',
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
      
      const allSalons = [
        {
          id: 'salon-1',
          name: 'Salon Excellence Paris',
          category: 'coiffure',
          address: '15 Avenue des Champs-Élysées, 75008 Paris',
          rating: 4.8,
          reviews: 245,
          price: '€€€',
          image: '/salon-1.jpg',
          services: ['Coupe', 'Coloration', 'Brushing', 'Balayage'],
          openNow: true
        },
        {
          id: 'salon-2', 
          name: 'Beauty & Spa Marais',
          category: 'esthetique',
          address: '8 Rue du Marais, 75004 Paris',
          rating: 4.9,
          reviews: 189,
          price: '€€',
          image: '/salon-2.jpg',
          services: ['Soin du visage', 'Épilation', 'Massage', 'Microdermabrasion'],
          openNow: true
        },
        {
          id: 'salon-3',
          name: 'Zen Massage Studio',
          category: 'massage',
          address: '25 Boulevard Saint-Germain, 75005 Paris',
          rating: 4.7,
          reviews: 156,
          price: '€€€',
          image: '/salon-3.jpg',
          services: ['Massage relaxant', 'Massage deep tissue', 'Massage aux pierres chaudes'],
          openNow: false
        },
        {
          id: 'salon-4',
          name: 'Nail Art Gallery',
          category: 'onglerie',
          address: '12 Rue de Rivoli, 75001 Paris',
          rating: 4.6,
          reviews: 203,
          price: '€€',
          image: '/salon-4.jpg',
          services: ['Manucure', 'Pédicure', 'Nail art', 'Pose gel'],
          openNow: true
        },
        {
          id: 'salon-5',
          name: 'Coiffure Moderne',
          category: 'coiffure',
          address: '30 Rue de la Paix, 75002 Paris',
          rating: 4.5,
          reviews: 167,
          price: '€€',
          image: '/salon-5.jpg',
          services: ['Coupe homme', 'Coupe femme', 'Coloration', 'Permanente'],
          openNow: true
        },
        {
          id: 'salon-6',
          name: 'Institut Beauté Luxury',
          category: 'esthetique',
          address: '18 Avenue Montaigne, 75008 Paris',
          rating: 4.9,
          reviews: 298,
          price: '€€€€',
          image: '/salon-6.jpg',
          services: ['Soin anti-âge', 'Peeling', 'Lifting', 'Botox'],
          openNow: true
        }
      ];
      
      const filteredSalons = category 
        ? allSalons.filter(salon => salon.category === category)
        : allSalons;
      
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

      const note = await storage.createOrUpdateClientNote(noteData);
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

  const httpServer = createServer(app);
  return httpServer;
}