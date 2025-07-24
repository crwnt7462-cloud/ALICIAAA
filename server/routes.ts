import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { db } from "./db";
import { aiService } from "./aiService";
import { notificationService } from "./notificationService";
import { stripeService } from "./stripeService";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { configureSession, authenticateUser, authenticateClient, authenticateAny } from "./sessionMiddleware";
import { appointments, clients, users, clientAccounts } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import {
  insertServiceSchema,
  insertClientSchema,
  insertStaffSchema,
  insertAppointmentSchema,
  loginSchema,
  registerSchema,
  clientRegisterSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {

  // Route de connexion démo pour les tests de développement
  app.post('/api/demo-login', async (req: any, res: any) => {
    try {
      // Créer une session de test pour un utilisateur professionnel
      if (req.session) {
        (req.session as any).userId = "demo-user";
        (req.session as any).userType = "professional";
      }
      
      res.json({
        success: true,
        message: "Connexion démo réussie",
        user: {
          id: "demo-user",
          businessName: "Salon Beautiful",
          email: "salon@example.com",
          firstName: "Marie",
          lastName: "Dubois"
        }
      });
    } catch (error) {
      console.error("Demo login error:", error);
      res.status(500).json({ message: "Erreur de connexion démo" });
    }
  });

  // Route pour récupérer l'utilisateur connecté
  app.get('/api/auth/user', authenticateUser, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Demo user data
      if (userId === "demo-user") {
        return res.json({
          id: "demo-user",
          businessName: "Salon Beautiful",
          address: "123 Avenue de la Beauté, 75001 Paris",
          city: "Paris",
          phone: "01 42 34 56 78",
          email: "salon@example.com",
          firstName: "Marie",
          lastName: "Dubois",
          profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b5e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
        });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur" });
    }
  });

  // Configure session middleware for persistent authentication
  app.use(configureSession());
  
  // Auth middleware
  await setupAuth(app);

  // Professional Authentication Routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const result = registerSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Données invalides", 
          errors: result.error.flatten().fieldErrors 
        });
      }

      const existingUser = await storage.getUserByEmail(result.data.email);
      if (existingUser) {
        return res.status(409).json({ 
          message: "Un compte existe déjà avec cet email" 
        });
      }

      const user = await storage.createUser(result.data);
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json({ 
        message: "Compte créé avec succès", 
        user: userWithoutPassword 
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Erreur lors de la création du compte" });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const result = loginSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Données invalides", 
          errors: result.error.flatten().fieldErrors 
        });
      }

      // Demo credentials
      if (result.data.email === "salon@example.com" && result.data.password === "password123") {
        const testUser = {
          id: "demo-user",
          email: "salon@example.com",
          firstName: "Sarah",
          lastName: "Martin",
          businessName: "Salon Beautiful",
          phone: "01 42 34 56 78",
          address: "123 Avenue de la Beauté, 75001 Paris",
          city: "Paris",
          isProfessional: true,
          isVerified: true
        };

        // Save session
        req.session.userId = testUser.id;
        req.session.userType = 'professional';
        req.session.user = testUser;

        res.json({ 
          message: "Connexion réussie", 
          user: testUser 
        });
        return;
      }

      const user = await storage.authenticateUser(result.data.email, result.data.password);
      if (!user) {
        return res.status(401).json({ 
          message: "Email ou mot de passe incorrect" 
        });
      }

      // Save session
      req.session.userId = user.id;
      req.session.userType = 'professional';
      req.session.user = user;

      const { password, ...userWithoutPassword } = user;
      res.json({ 
        message: "Connexion réussie", 
        user: userWithoutPassword 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Erreur lors de la connexion" });
    }
  });

  app.get('/api/auth/user', authenticateUser, async (req: any, res) => {
    try {
      if (req.user?.id === "demo-user") {
        const testUser = {
          id: "demo-user",
          email: "salon@example.com",
          firstName: "Sarah",
          lastName: "Martin",
          businessName: "Salon Beautiful",
          phone: "01 42 34 56 78",
          address: "123 Avenue de la Beauté, 75001 Paris",
          city: "Paris",
          isProfessional: true,
          isVerified: true
        };
        return res.json(testUser);
      }

      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur" });
    }
  });

  // Client Authentication Routes
  app.post('/api/client-auth/register', async (req, res) => {
    try {
      const result = clientRegisterSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Données invalides", 
          errors: result.error.flatten().fieldErrors 
        });
      }

      const existingClient = await storage.getClientByEmail(result.data.email);
      if (existingClient) {
        return res.status(409).json({ 
          message: "Un compte client existe déjà avec cet email" 
        });
      }

      const client = await storage.createClientAccount(result.data);
      const { password, ...clientWithoutPassword } = client;
      
      res.status(201).json({ 
        message: "Compte client créé avec succès", 
        client: clientWithoutPassword 
      });
    } catch (error) {
      console.error("Client registration error:", error);
      res.status(500).json({ message: "Erreur lors de la création du compte client" });
    }
  });

  app.post('/api/client-auth/login', async (req, res) => {
    try {
      const result = loginSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Données invalides", 
          errors: result.error.flatten().fieldErrors 
        });
      }

      // Demo client credentials
      if (result.data.email === "client@demo.com" && result.data.password === "password") {
        const testClient = {
          id: "demo-client",
          email: "client@demo.com",
          firstName: "Marie",
          lastName: "Dupont",
          phone: "0123456789",
          isVerified: true
        };

        res.json({ 
          message: "Connexion client réussie", 
          client: testClient 
        });
        return;
      }

      const client = await storage.authenticateClient(result.data.email, result.data.password);
      if (!client) {
        return res.status(401).json({ 
          message: "Email ou mot de passe incorrect" 
        });
      }

      const { password, ...clientWithoutPassword } = client;
      res.json({ 
        message: "Connexion client réussie", 
        client: clientWithoutPassword 
      });
    } catch (error) {
      console.error("Client login error:", error);
      res.status(500).json({ message: "Erreur lors de la connexion client" });
    }
  });

  // Services routes
  app.get('/api/services', authenticateUser, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const services = await storage.getServices(userId);
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.post('/api/services', authenticateUser, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const serviceData = insertServiceSchema.parse({ ...req.body, userId });
      const service = await storage.createService(serviceData);
      res.json(service);
    } catch (error) {
      console.error("Error creating service:", error);
      res.status(400).json({ message: "Failed to create service" });
    }
  });

  // Clients routes
  app.get('/api/clients', authenticateUser, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const clients = await storage.getClients(userId);
      res.json(clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });

  app.post('/api/clients', authenticateUser, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const clientData = insertClientSchema.parse({ ...req.body, userId });
      const client = await storage.createClient(clientData);
      res.json(client);
    } catch (error) {
      console.error("Error creating client:", error);
      res.status(400).json({ message: "Failed to create client" });
    }
  });

  // Staff routes
  app.get('/api/staff', authenticateUser, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const staff = await storage.getStaff(userId);
      res.json(staff);
    } catch (error) {
      console.error("Error fetching staff:", error);
      res.status(500).json({ message: "Failed to fetch staff" });
    }
  });

  app.post('/api/staff', authenticateUser, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const staffData = insertStaffSchema.parse({ ...req.body, userId });
      const staff = await storage.createStaff(staffData);
      res.json(staff);
    } catch (error) {
      console.error("Error creating staff:", error);
      res.status(400).json({ message: "Failed to create staff" });
    }
  });

  // Appointments routes
  app.get('/api/appointments', authenticateUser, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { date } = req.query;
      const appointments = await storage.getAppointments(userId, date);
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.post('/api/appointments', authenticateUser, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const appointmentData = insertAppointmentSchema.parse({ ...req.body, userId });
      const appointment = await storage.createAppointment(appointmentData);
      res.json(appointment);
    } catch (error) {
      console.error("Error creating appointment:", error);
      res.status(400).json({ message: "Failed to create appointment" });
    }
  });

  // Dashboard routes
  app.get('/api/dashboard/stats', authenticateUser, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const stats = await storage.getDashboardStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  app.get('/api/dashboard/revenue-chart', authenticateUser, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const revenueData = await storage.getRevenueChart(userId);
      res.json(revenueData);
    } catch (error) {
      console.error("Error fetching revenue chart:", error);
      res.status(500).json({ message: "Failed to fetch revenue chart" });
    }
  });

  app.get('/api/dashboard/upcoming-appointments', authenticateUser, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const upcomingAppointments = await storage.getUpcomingAppointments(userId);
      res.json(upcomingAppointments);
    } catch (error) {
      console.error("Error fetching upcoming appointments:", error);
      res.status(500).json({ message: "Failed to fetch upcoming appointments" });
    }
  });

  app.get('/api/dashboard/top-services', authenticateUser, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const topServices = await storage.getTopServices(userId);
      res.json(topServices);
    } catch (error) {
      console.error("Error fetching top services:", error);
      res.status(500).json({ message: "Failed to fetch top services" });
    }
  });

  app.get('/api/dashboard/staff-performance', authenticateUser, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const staffPerformance = await storage.getStaffPerformance(userId);
      res.json(staffPerformance);
    } catch (error) {
      console.error("Error fetching staff performance:", error);
      res.status(500).json({ message: "Failed to fetch staff performance" });
    }
  });

  app.get('/api/dashboard/client-retention', authenticateUser, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const retentionData = await storage.getClientRetentionRate(userId);
      res.json(retentionData);
    } catch (error) {
      console.error("Error fetching client retention:", error);
      res.status(500).json({ message: "Failed to fetch client retention" });
    }
  });

  // AI Chat route
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, conversationHistory } = req.body;
      const response = await aiService.generateChatResponse(message, conversationHistory);
      res.json(response);
    } catch (error) {
      console.error("AI chat error:", error);
      res.status(500).json({ message: "Erreur lors de la génération de la réponse IA" });
    }
  });

  // Public booking routes
  app.get("/api/public-services/:salonId", async (req, res) => {
    try {
      const { salonId } = req.params;
      const services = await storage.getServices(salonId);
      res.json(services);
    } catch (error: any) {
      console.error("Error fetching public services:", error);
      res.status(500).json({ error: "Erreur lors du chargement des services" });
    }
  });

  app.get("/api/public-staff/:salonId", async (req, res) => {
    try {
      const { salonId } = req.params;
      const staffMembers = await storage.getStaff(salonId);
      res.json(staffMembers);
    } catch (error: any) {
      console.error("Error fetching staff members:", error);
      res.status(500).json({ error: "Erreur lors du chargement de l'équipe" });
    }
  });

  app.get("/api/business-info/:salonId", async (req, res) => {
    try {
      const { salonId } = req.params;
      const user = await storage.getUser(salonId);
      
      if (!user) {
        return res.status(404).json({ error: "Salon non trouvé" });
      }

      res.json({
        name: user.businessName || `Salon ${user.firstName || 'Beauty'}`,
        address: user.address || "123 Rue de la Beauté, 75001 Paris",
        phone: user.phone || "01 23 45 67 89",
        email: user.email || "contact@salon.fr",
        description: "Votre salon de beauté professionnel"
      });
    } catch (error: any) {
      console.error("Error fetching business info:", error);
      res.status(500).json({ error: "Erreur lors du chargement des informations" });
    }
  });

  // Stripe Payment Routes
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, metadata } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Montant invalide" });
      }

      const paymentIntent = await stripeService.createPaymentIntent(amount, metadata);
      
      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id 
      });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ error: error.message || "Erreur lors de la création du paiement" });
    }
  });

  app.post("/api/confirm-payment", async (req, res) => {
    try {
      const { paymentIntentId, bookingData } = req.body;
      
      // Retrieve payment intent to verify payment
      const paymentIntent = await stripeService.retrievePaymentIntent(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        // Create appointment after successful payment
        const appointment = await storage.createAppointment({
          userId: bookingData.salonId,
          serviceId: bookingData.serviceId,
          staffId: bookingData.staffId || null,
          clientName: `${bookingData.clientInfo.firstName} ${bookingData.clientInfo.lastName}`,
          clientEmail: bookingData.clientInfo.email,
          clientPhone: bookingData.clientInfo.phone,
          appointmentDate: bookingData.appointmentDate,
          startTime: bookingData.startTime,
          endTime: bookingData.endTime,
          totalPrice: bookingData.totalPrice,
          depositPaid: bookingData.depositAmount,
          paymentStatus: 'partial',
          status: 'confirmed',
          notes: bookingData.clientInfo.notes || ''
        });

        res.json({ 
          success: true, 
          appointment: appointment,
          message: "Paiement confirmé et rendez-vous créé avec succès"
        });
      } else {
        res.status(400).json({ error: "Paiement non confirmé" });
      }
    } catch (error: any) {
      console.error("Error confirming payment:", error);
      res.status(500).json({ error: error.message || "Erreur lors de la confirmation du paiement" });
    }
  });

  // Public booking route
  app.post("/api/public-booking", async (req, res) => {
    try {
      const { 
        salonId, 
        serviceId, 
        staffId,
        appointmentDate, 
        startTime, 
        endTime,
        clientInfo,
        depositAmount,
        totalPrice
      } = req.body;

      if (!clientInfo || !clientInfo.firstName || !clientInfo.lastName || !clientInfo.email) {
        return res.status(400).json({ 
          error: "Les informations client (prénom, nom, email) sont obligatoires" 
        });
      }

      // Get service and business info
      const [services, businessUser] = await Promise.all([
        storage.getServices(salonId),
        storage.getUser(salonId)
      ]);

      const service = services.find(s => s.id === parseInt(serviceId));
      if (!service || !businessUser) {
        return res.status(404).json({ error: "Service ou salon non trouvé" });
      }

      // If deposit required, create payment intent
      if (depositAmount && depositAmount > 0) {
        const paymentIntent = await stripeService.createPaymentIntent(depositAmount, {
          salonId,
          serviceId,
          serviceName: service.name,
          clientEmail: clientInfo.email,
          appointmentDate,
          startTime
        });

        res.json({
          requiresPayment: true,
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          depositAmount,
          totalPrice: totalPrice || service.price,
          serviceName: service.name,
          businessName: businessUser.businessName
        });
      } else {
        // Create appointment directly if no payment required
        const appointment = await storage.createAppointment({
          userId: salonId,
          serviceId: parseInt(serviceId),
          staffId: staffId ? parseInt(staffId) : null,
          clientName: `${clientInfo.firstName} ${clientInfo.lastName}`,
          clientEmail: clientInfo.email,
          clientPhone: clientInfo.phone,
          appointmentDate,
          startTime,
          endTime,
          totalPrice: totalPrice || service.price,
          depositPaid: "0",
          paymentStatus: 'pending',
          status: 'scheduled',
          notes: clientInfo.notes || ''
        });

        res.json({
          success: true,
          appointment: appointment,
          message: "Rendez-vous créé avec succès"
        });
      }
    } catch (error: any) {
      console.error("Error in public booking:", error);
      res.status(500).json({ error: error.message || "Erreur lors de la réservation" });
    }
  });

  // Create HTTP server without WebSocket in development to avoid conflicts with Vite
  const httpServer = createServer(app);
  
  // Routes d'authentification client
  app.post("/api/client/register", async (req, res) => {
    try {
      const { email, password, firstName, lastName, phone } = req.body;
      
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: "Champs requis manquants" });
      }

      // Vérifier si l'email existe déjà
      const existingClient = await storage.getClientByEmail(email);
      if (existingClient) {
        return res.status(400).json({ message: "Cet email est déjà utilisé" });
      }

      // Créer le compte client
      const client = await storage.createClientAccount({
        email,
        password,
        firstName,
        lastName,
        phone: phone || null,
      });

      // Générer un token simple
      const token = `client_${client.id}_${Date.now()}`;

      res.json({
        token,
        client: {
          id: client.id,
          email: client.email,
          firstName: client.firstName,
          lastName: client.lastName,
          phone: client.phone,
          mentionHandle: client.mentionHandle,
          profileImageUrl: client.profileImageUrl,
        }
      });
    } catch (error) {
      console.error("Error creating client account:", error);
      res.status(500).json({ message: "Erreur lors de la création du compte" });
    }
  });

  app.post("/api/client/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email et mot de passe requis" });
      }

      // Authentifier le client
      const client = await storage.authenticateClient(email, password);
      if (!client) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
      }

      // Générer un token simple
      const token = `client_${client.id}_${Date.now()}`;

      res.json({
        token,
        client: {
          id: client.id,
          email: client.email,
          firstName: client.firstName,
          lastName: client.lastName,
          phone: client.phone,
          mentionHandle: client.mentionHandle,
          profileImageUrl: client.profileImageUrl,
        }
      });
    } catch (error) {
      console.error("Error authenticating client:", error);
      res.status(500).json({ message: "Erreur lors de la connexion" });
    }
  });

  // Middleware d'authentification client
  const isClientAuthenticated = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Token manquant" });
    }

    const token = authHeader.substring(7);
    if (!token.startsWith('client_')) {
      return res.status(401).json({ message: "Token invalide" });
    }

    const clientId = token.split('_')[1];
    req.clientId = clientId;
    next();
  };

  // Routes client authentifiées
  app.get("/api/client/appointments", isClientAuthenticated, async (req, res) => {
    try {
      const appointments = [
        {
          id: 1,
          serviceName: "Coupe + Brushing",
          professionalName: "Marie Dubois", 
          appointmentDate: "2025-01-25",
          appointmentTime: "14:30",
          duration: 60,
          price: 45,
          status: "confirmed",
          salonName: "Salon Excellence",
          salonAddress: "15 rue de la Paix, Paris"
        }
      ];
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching client appointments:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des rendez-vous" });
    }
  });

  app.get("/api/client/messages", isClientAuthenticated, async (req, res) => {
    try {
      const messages = [];
      res.json(messages);
    } catch (error) {
      console.error("Error fetching client messages:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des messages" });
    }
  });

  // Booking Pages API Routes
  app.get('/api/booking-pages/current', authenticateUser, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Demo user data
      if (userId === "demo-user") {
        return res.json({
          salonName: "Salon Beautiful",
          title: "Réservez votre rendez-vous",
          description: "Votre salon de beauté préféré vous accueille sur rendez-vous",
          primaryColor: "#8B5CF6",
          secondaryColor: "#F3F4F6",
          logoUrl: "",
          backgroundImage: "",
          showServices: true,
          showStaff: true,
          requireDeposit: true,
          depositPercentage: 30,
          welcomeMessage: "Bienvenue dans notre salon de beauté",
          bookingRules: "Annulation gratuite jusqu'à 24h avant le rendez-vous",
          isPublished: true,
          views: 127,
          selectedServices: ["Coupe & Brushing", "Coloration", "Soins visage"],
          pageUrl: "salon-beautiful"
        });
      }
      
      const bookingPage = await storage.getCurrentBookingPage(userId);
      res.json(bookingPage);
    } catch (error) {
      console.error("Error fetching current booking page:", error);
      res.status(500).json({ message: "Failed to fetch booking page" });
    }
  });

  app.patch('/api/booking-pages/current', authenticateUser, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Demo user - simulate update
      if (userId === "demo-user") {
        return res.json({
          message: "Page de réservation mise à jour avec succès",
          data: req.body
        });
      }
      
      const updatedPage = await storage.updateCurrentBookingPage(userId, req.body);
      res.json({
        message: "Page de réservation mise à jour avec succès",
        data: updatedPage
      });
    } catch (error) {
      console.error("Error updating booking page:", error);
      res.status(500).json({ message: "Failed to update booking page" });
    }
  });

  app.get('/api/salon-settings', authenticateUser, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Demo user data
      if (userId === "demo-user") {
        return res.json({
          businessName: "Salon Beautiful",
          address: "123 Avenue de la Beauté, 75001 Paris",
          city: "Paris",
          phone: "01 42 34 56 78",
          email: "salon@example.com",
          description: "Salon de beauté haut de gamme spécialisé dans les soins capillaires et esthétiques. Notre équipe experte vous accueille dans un cadre moderne et relaxant pour vous offrir des prestations sur-mesure.",
          coverImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return salon data from user profile
      const salonData = {
        businessName: user.businessName || '',
        address: user.address || '',
        city: user.city || '',
        phone: user.phone || '',
        email: user.email,
        description: user.description || '',
        coverImage: user.profileImageUrl || ''
      };

      res.json(salonData);
    } catch (error) {
      console.error("Error fetching salon settings:", error);
      res.status(500).json({ message: "Failed to fetch salon settings" });
    }
  });

  app.patch('/api/salon-settings', authenticateUser, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Demo user - simulate update
      if (userId === "demo-user") {
        return res.json({
          message: "Paramètres mis à jour avec succès",
          data: req.body
        });
      }
      
      const updatedUser = await storage.updateUserProfile(userId, req.body);
      res.json({
        message: "Paramètres mis à jour avec succès",
        data: updatedUser
      });
    } catch (error) {
      console.error("Error updating salon settings:", error);
      res.status(500).json({ message: "Failed to update salon settings" });
    }
  });

  // Only setup WebSocket in production mode
  if (process.env.NODE_ENV === 'production') {
    const wss = new WebSocketServer({ server: httpServer });

    wss.on('connection', (ws: WebSocket) => {
      console.log('WebSocket client connected');
      
      ws.on('message', (message: Buffer) => {
        console.log('Received:', message.toString());
      });

      ws.on('close', () => {
        console.log('WebSocket client disconnected');
      });
    });
  }

  return httpServer;
}