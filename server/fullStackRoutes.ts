import type { Express } from "express";
import { storage } from "./storage";
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import bcrypt from 'bcrypt';
import { notificationService } from './notificationService';
import { reminderService } from './reminderService';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-salon-app';
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil',
}) : null;

// Middleware d'authentification PRO
const authenticatePro = async (req: any, res: any, next: any) => {
  const user = (req.session as any)?.user;
  if (!user || user.userType !== 'professional') {
    return res.status(401).json({ error: 'Accès non autorisé - Professionnel requis' });
  }
  req.userId = user.id;
  next();
};

// Middleware d'authentification CLIENT
const authenticateClient = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !token.startsWith('client-')) {
    return res.status(401).json({ error: 'Token client invalide' });
  }
  
  try {
    const clientId = parseInt(token.split('-')[1]);
    const client = await storage.getClientAccount(clientId);
    if (!client) {
      return res.status(401).json({ error: 'Client non trouvé' });
    }
    req.clientId = clientId;
    req.client = client;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide' });
  }
};

export function registerFullStackRoutes(app: Express) {
  
  // ========== AUTHENTIFICATION ==========
  
  // Inscription PRO
  app.post('/api/pro/register', async (req, res) => {
    try {
      const { email, password, businessName, firstName, lastName, phone, address, city } = req.body;

      if (!email || !password || !businessName) {
        return res.status(400).json({ error: 'Données manquantes' });
      }

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Un compte avec cet email existe déjà' });
      }

      const newUser = await storage.createUser({
        email, password, businessName, firstName, lastName, phone, address, city
      });

      res.json({
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          businessName: newUser.businessName
        },
        message: 'Compte professionnel créé avec succès'
      });
    } catch (error) {
      console.error("Erreur inscription PRO:", error);
      res.status(500).json({ error: 'Erreur lors de la création du compte' });
    }
  });

  // Connexion PRO avec session
  app.post('/api/pro/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Compte test PRO
      if (email === 'test@monapp.com' && password === 'test1234') {
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
        
        return res.json({
          success: true,
          user: (req.session as any).user,
          message: 'Connexion PRO réussie'
        });
      }

      const user = await storage.authenticateUser(email, password);
      if (user) {
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
          message: 'Connexion PRO réussie'
        });
      } else {
        res.status(401).json({ error: 'Identifiants incorrects' });
      }
    } catch (error) {
      console.error("Erreur login PRO:", error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // Connexion CLIENT avec token
  app.post('/api/client/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
      }

      const client = await storage.authenticateClient(email, password);
      
      if (client) {
        const token = `client-${client.id}-${Date.now()}`;
        
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

  // Inscription CLIENT
  app.post('/api/client/register', async (req, res) => {
    try {
      const { email, password, firstName, lastName, phone, dateOfBirth } = req.body;

      const existingClient = await storage.getClientAccountByEmail(email);
      if (existingClient) {
        return res.status(400).json({ error: 'Un compte avec cet email existe déjà' });
      }

      const newClient = await storage.createClientAccount({
        email, password, firstName, lastName, phone, dateOfBirth
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

  // Vérification session PRO
  app.get('/api/pro/check-session', async (req, res) => {
    try {
      const user = (req.session as any)?.user;
      if (user && user.userType === 'professional') {
        res.json({ authenticated: true, user: user });
      } else {
        res.json({ authenticated: false });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // Vérification token CLIENT
  app.get('/api/client/check-auth', authenticateClient, async (req: any, res) => {
    res.json({
      success: true,
      client: {
        id: req.client.id,
        email: req.client.email,
        firstName: req.client.firstName,
        lastName: req.client.lastName,
        loyaltyPoints: req.client.loyaltyPoints,
        clientStatus: req.client.clientStatus
      }
    });
  });

  // ========== RÉSERVATIONS & PLANNING ==========

  // Créer un rendez-vous (PRO)
  app.post('/api/appointments', authenticatePro, async (req: any, res) => {
    try {
      const appointmentData = {
        ...req.body,
        userId: req.userId,
        status: 'scheduled'
      };

      const appointment = await storage.createAppointment(appointmentData);
      
      // Envoyer notification temps réel et programmer rappels
      await notificationService.notifyNewAppointment(appointment);
      
      res.json({
        success: true,
        appointment,
        message: 'Rendez-vous créé avec succès'
      });
    } catch (error) {
      console.error('Erreur création RDV:', error);
      res.status(500).json({ error: 'Erreur lors de la création du rendez-vous' });
    }
  });

  // Récupérer les rendez-vous (PRO)
  app.get('/api/appointments', authenticatePro, async (req: any, res) => {
    try {
      const { date } = req.query;
      const appointments = await storage.getAppointments(req.userId, date as string);
      res.json(appointments);
    } catch (error) {
      console.error('Erreur récupération RDV:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des rendez-vous' });
    }
  });

  // Récupérer les rendez-vous CLIENT
  app.get('/api/client/appointments', authenticateClient, async (req: any, res) => {
    try {
      const appointments = await storage.getAppointments(req.clientId.toString());
      res.json(appointments);
    } catch (error) {
      console.error('Erreur RDV client:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des rendez-vous' });
    }
  });

  // Modifier un rendez-vous
  app.patch('/api/appointments/:id', authenticatePro, async (req: any, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const updatedAppointment = await storage.updateAppointment(appointmentId, req.body);
      
      // Notifier les changements
      const changes = Object.keys(req.body);
      await notificationService.notifyAppointmentUpdate(updatedAppointment, changes);
      
      res.json({
        success: true,
        appointment: updatedAppointment,
        message: 'Rendez-vous modifié avec succès'
      });
    } catch (error) {
      console.error('Erreur modification RDV:', error);
      res.status(500).json({ error: 'Erreur lors de la modification du rendez-vous' });
    }
  });

  // Annuler un rendez-vous
  app.delete('/api/appointments/:id', authenticatePro, async (req: any, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const appointment = await storage.getAppointments().find((apt: any) => apt.id === appointmentId);
      
      await storage.deleteAppointment(appointmentId);
      
      // Notifier l'annulation
      if (appointment) {
        await notificationService.notifyAppointmentCancellation(appointment, 'professional');
      }
      
      res.json({
        success: true,
        message: 'Rendez-vous annulé avec succès'
      });
    } catch (error) {
      console.error('Erreur annulation RDV:', error);
      res.status(500).json({ error: 'Erreur lors de l\'annulation du rendez-vous' });
    }
  });

  // ========== GESTION DES SERVICES ==========

  // Récupérer les services (PRO)
  app.get('/api/services', authenticatePro, async (req: any, res) => {
    try {
      const services = await storage.getServices(req.userId);
      res.json(services);
    } catch (error) {
      console.error('Erreur récupération services:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des services' });
    }
  });

  // Créer un service
  app.post('/api/services', authenticatePro, async (req: any, res) => {
    try {
      const serviceData = {
        ...req.body,
        userId: req.userId
      };

      const service = await storage.createService(serviceData);
      res.json({
        success: true,
        service,
        message: 'Service créé avec succès'
      });
    } catch (error) {
      console.error('Erreur création service:', error);
      res.status(500).json({ error: 'Erreur lors de la création du service' });
    }
  });

  // ========== GESTION DES CLIENTS ==========

  // Récupérer les clients (PRO)
  app.get('/api/clients', authenticatePro, async (req: any, res) => {
    try {
      const clients = await storage.getClients(req.userId);
      res.json(clients);
    } catch (error) {
      console.error('Erreur récupération clients:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des clients' });
    }
  });

  // Créer un client
  app.post('/api/clients', authenticatePro, async (req: any, res) => {
    try {
      const clientData = {
        ...req.body,
        userId: req.userId
      };

      const client = await storage.createClient(clientData);
      res.json({
        success: true,
        client,
        message: 'Client créé avec succès'
      });
    } catch (error) {
      console.error('Erreur création client:', error);
      res.status(500).json({ error: 'Erreur lors de la création du client' });
    }
  });

  // ========== PAIEMENTS STRIPE ==========

  // Créer un PaymentIntent pour acompte
  app.post('/api/payments/create-intent', async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ error: 'Service de paiement non configuré' });
      }

      const { amount, appointmentId, clientId } = req.body;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convertir en centimes
        currency: 'eur',
        metadata: {
          appointmentId: appointmentId?.toString() || '',
          clientId: clientId?.toString() || ''
        }
      });

      res.json({
        success: true,
        clientSecret: paymentIntent.client_secret
      });
    } catch (error) {
      console.error('Erreur PaymentIntent:', error);
      res.status(500).json({ error: 'Erreur lors de la création du paiement' });
    }
  });

  // Confirmer le paiement
  app.post('/api/payments/confirm', async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ error: 'Service de paiement non configuré' });
      }

      const { paymentIntentId, appointmentId } = req.body;

      // Vérifier le paiement avec Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        // Mettre à jour le statut du rendez-vous
        if (appointmentId) {
          await storage.updateAppointment(appointmentId, {
            paymentStatus: 'paid',
            depositPaid: (paymentIntent.amount / 100).toString(),
            stripeSessionId: paymentIntentId
          });
        }

        res.json({
          success: true,
          message: 'Paiement confirmé avec succès'
        });
      } else {
        res.status(400).json({ error: 'Paiement non confirmé' });
      }
    } catch (error) {
      console.error('Erreur confirmation paiement:', error);
      res.status(500).json({ error: 'Erreur lors de la confirmation du paiement' });
    }
  });

  // ========== TABLEAUX DE BORD ==========

  // Dashboard PRO - Statistiques
  app.get('/api/dashboard/stats', authenticatePro, async (req: any, res) => {
    try {
      const stats = await storage.getDashboardStats(req.userId);
      res.json(stats);
    } catch (error) {
      console.error('Erreur stats dashboard:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
    }
  });

  // Dashboard CLIENT - Historique et fidélité
  app.get('/api/client/dashboard', authenticateClient, async (req: any, res) => {
    try {
      const client = req.client;
      const appointments = await storage.getAppointments(req.clientId.toString());
      
      // Calculer les données de fidélité
      const totalSpent = appointments
        .filter(apt => apt.status === 'completed')
        .reduce((sum, apt) => sum + parseFloat(apt.totalPrice || '0'), 0);
      
      const nextLoyaltyLevel = client.loyaltyPoints >= 500 ? 'VIP' : 
                               client.loyaltyPoints >= 200 ? 'Premium' : 'Bronze';

      res.json({
        client: {
          ...client,
          totalSpent,
          nextLoyaltyLevel
        },
        appointments,
        loyaltyInfo: {
          currentPoints: client.loyaltyPoints,
          nextLevel: nextLoyaltyLevel,
          pointsToNext: nextLoyaltyLevel === 'VIP' ? 0 : 
                        nextLoyaltyLevel === 'Premium' ? 500 - client.loyaltyPoints :
                        200 - client.loyaltyPoints
        }
      });
    } catch (error) {
      console.error('Erreur dashboard client:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération du dashboard' });
    }
  });

  // ========== NOTIFICATIONS TEMPS RÉEL ==========

  // Marquer notification comme lue
  app.patch('/api/notifications/:id/read', authenticatePro, async (req: any, res) => {
    try {
      // TODO: Implémenter la gestion des notifications
      res.json({ success: true, message: 'Notification marquée comme lue' });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour de la notification' });
    }
  });

  // ========== RECHERCHE PUBLIQUE SALONS ==========

  // Rechercher des salons (public)
  app.get('/api/public/salons/search', async (req, res) => {
    try {
      const { city, service, latitude, longitude } = req.query;
      
      // Pour le moment, retourner des salons de démonstration
      const demoSalons = [
        {
          id: 'salon-1',
          name: 'Salon Excellence Paris',
          address: '123 Avenue des Champs-Élysées, 75008 Paris',
          rating: 4.8,
          reviewCount: 245,
          services: ['Coiffure', 'Esthétique', 'Massage'],
          priceRange: '€€€',
          distance: '0.8 km',
          image: '/salon-demo.jpg'
        },
        {
          id: 'salon-2', 
          name: 'Beauty Studio Marais',
          address: '45 Rue des Rosiers, 75004 Paris',
          rating: 4.6,
          reviewCount: 189,
          services: ['Esthétique', 'Onglerie', 'Massage'],
          priceRange: '€€',
          distance: '1.2 km',
          image: '/salon-demo2.jpg'
        }
      ];

      res.json({
        success: true,
        salons: demoSalons,
        total: demoSalons.length
      });
    } catch (error) {
      console.error('Erreur recherche salons:', error);
      res.status(500).json({ error: 'Erreur lors de la recherche de salons' });
    }
  });

  // Détails d'un salon public
  app.get('/api/public/salons/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      // Salon de démonstration
      const salon = {
        id,
        name: 'Salon Excellence Paris',
        description: 'Un salon de beauté moderne offrant des services de qualité supérieure',
        address: '123 Avenue des Champs-Élysées, 75008 Paris',
        phone: '01 42 34 56 78',
        email: 'contact@salon-excellence.fr',
        rating: 4.8,
        reviewCount: 245,
        services: [
          { id: 1, name: 'Coupe + Brushing', price: 45, duration: 60 },
          { id: 2, name: 'Coloration', price: 85, duration: 120 },
          { id: 3, name: 'Soin Visage', price: 65, duration: 75 }
        ],
        photos: ['/salon-photo1.jpg', '/salon-photo2.jpg', '/salon-photo3.jpg'],
        openingHours: {
          lundi: '9h00-19h00',
          mardi: '9h00-19h00',
          mercredi: '9h00-19h00',
          jeudi: '9h00-19h00',
          vendredi: '9h00-19h00',
          samedi: '9h00-18h00',
          dimanche: 'Fermé'
        },
        reviews: [
          {
            id: 1,
            clientName: 'Marie L.',
            rating: 5,
            comment: 'Service excellent, très professionnel !',
            date: '2024-01-15'
          }
        ]
      };

      res.json({ success: true, salon });
    } catch (error) {
      console.error('Erreur détails salon:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des détails du salon' });
    }
  });

  // ========== DÉCONNEXION ==========

  app.post('/api/auth/logout', async (req, res) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error("Erreur déconnexion:", err);
          return res.status(500).json({ error: 'Erreur lors de la déconnexion' });
        }
        res.clearCookie('connect.sid');
        res.json({ success: true, message: 'Déconnexion réussie' });
      });
    } catch (error) {
      console.error("Erreur déconnexion:", error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // ========== ROUTES STRIPE POUR PAIEMENTS ==========

  // Créer session Stripe pour abonnement professionnel
  app.post('/api/stripe/create-subscription-checkout', async (req, res) => {
    try {
      const { planType, customerEmail, customerName } = req.body;
      
      if (!planType || !customerEmail || !customerName) {
        return res.status(400).json({ message: "Paramètres manquants" });
      }

      if (!stripe) {
        return res.status(500).json({ message: "Stripe non configuré" });
      }

      const planPrices = {
        essentiel: { amount: 2900 }, // 29€/mois
        professionnel: { amount: 7900 }, // 79€/mois  
        premium: { amount: 14900 } // 149€/mois
      };

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const successUrl = `${baseUrl}/stripe/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${baseUrl}/stripe/cancel`;

      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: `Abonnement ${planType.charAt(0).toUpperCase() + planType.slice(1)}`,
                description: `Plan ${planType} pour votre salon`,
              },
              unit_amount: planPrices[planType as keyof typeof planPrices].amount,
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        customer_email: customerEmail,
        metadata: {
          planType,
          customerName,
          type: 'subscription'
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
        subscription_data: {
          trial_period_days: 14, // 14 jours d'essai gratuit
        },
      });

      console.log(`✅ Session abonnement créée: ${session.id}`);
      res.json({ sessionId: session.id, url: session.url });
    } catch (error: any) {
      console.error("Erreur création checkout abonnement:", error);
      res.status(500).json({ message: "Erreur lors de la création du paiement", error: error.message });
    }
  });

  // Créer session Stripe pour acompte de réservation
  app.post('/api/stripe/create-deposit-checkout', async (req, res) => {
    try {
      const { amount, description, customerEmail, customerName, appointmentId, salonName } = req.body;
      
      if (!amount || !description || !customerEmail || !customerName) {
        return res.status(400).json({ message: "Paramètres manquants" });
      }

      if (!stripe) {
        return res.status(500).json({ message: "Stripe non configuré" });
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const successUrl = `${baseUrl}/stripe/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${baseUrl}/stripe/cancel`;

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: `Acompte - ${description}`,
                description: `Réservation chez ${salonName || 'Salon'}`,
              },
              unit_amount: Math.round(amount * 100), // Convertir en centimes
            },
            quantity: 1,
          },
        ],
        customer_email: customerEmail,
        metadata: {
          appointmentId: appointmentId || 'temp',
          customerName,
          salonName: salonName || 'Salon',
          type: 'booking_deposit'
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      console.log(`✅ Session acompte créée: ${session.id} pour ${amount}€`);
      res.json({ sessionId: session.id, url: session.url });
    } catch (error: any) {
      console.error("Erreur création checkout acompte:", error);
      res.status(500).json({ message: "Erreur lors de la création du paiement", error: error.message });
    }
  });

  // Récupérer les détails d'une session Stripe
  app.get('/api/stripe/session/:sessionId', async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      if (!stripe) {
        return res.status(500).json({ message: "Stripe non configuré" });
      }

      const session = await stripe.checkout.sessions.retrieve(sessionId);
      res.json(session);
    } catch (error: any) {
      console.error("Erreur récupération session:", error);
      res.status(500).json({ message: "Erreur récupération session", error: error.message });
    }
  });
}