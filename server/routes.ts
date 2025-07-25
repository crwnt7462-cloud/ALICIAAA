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

  // Route de connexion PRO simplifiée
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Compte test PRO
      if (email === 'test@monapp.com' && password === 'test1234') {
        const proToken = `pro_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        res.json({
          success: true,
          user: {
            id: 'test-pro-user',
            email: 'test@monapp.com',
            handle: '@usemyrr',
            role: 'professional',
            salon: 'Salon Excellence Paris',
            token: proToken
          },
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

  const httpServer = createServer(app);
  return httpServer;
}