import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";

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
        details: error.message 
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
        details: error.message 
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
        details: error.message 
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
        details: error.message 
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
        details: error.message
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
        details: error.message
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

  const httpServer = createServer(app);
  return httpServer;
}