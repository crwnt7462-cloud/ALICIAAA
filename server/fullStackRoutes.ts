import type { Express } from "express";
import { createServer, type Server } from "http";
import { firebaseStorage } from "./firebaseStorage";
import { storage as memoryStorage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { FIREBASE_CONFIG, FIREBASE_INSTRUCTIONS } from "./firebaseSetup";

// Configuration: utiliser Firebase ou stockage mémoire
const USE_FIREBASE = false; // Désactivé temporairement pour corriger les comptes test
const storage = memoryStorage;

// 🔥 STOCKAGE EN MÉMOIRE POUR LES SALONS PUBLICS
const publicSalonsStorage = new Map<string, any>();

// Logging de l'état
FIREBASE_CONFIG.logStatus();
if (!USE_FIREBASE && process.env.USE_FIREBASE === 'true') {
  console.log(FIREBASE_INSTRUCTIONS);
}

export async function registerFullStackRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

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

  // Salon/BookingPage routes (compatible Firebase)
  app.get('/api/booking-pages/:id', async (req, res) => {
    try {
      const { id } = req.params;
      console.log('📖 Récupération page salon:', id);
      
      let salon = await storage.getSalon?.(id);
      
      if (!salon) {
        console.log('ℹ️ Salon non trouvé, retour données par défaut:', id);
        // Données par défaut pour le salon de démo
        salon = {
          id: 'salon-demo',
          name: 'Excellence Paris',
          description: 'Salon de beauté premium au cœur de Paris',
          longDescription: 'Notre salon de beauté offre une expérience unique avec des services haut de gamme dans un cadre élégant et moderne.',
          address: '15 Avenue des Champs-Élysées, 75008 Paris',
          phone: '+33 1 42 25 76 89',
          rating: 4.8,
          reviews: 156,
          coverImageUrl: '/api/placeholder/400/250',
          logoUrl: '/api/placeholder/80/80',
          photos: ['/api/placeholder/300/200', '/api/placeholder/300/200'],
          verified: true,
          certifications: ['Bio Certifié', 'Produits Naturels', 'Expertise Reconnue'],
          awards: ['Meilleur Salon 2024', 'Prix Excellence'],
          customColors: {
            primary: '#7c3aed',
            accent: '#a855f7',
            buttonText: '#ffffff',
            priceColor: '#7c3aed',
            neonFrame: '#a855f7'
          },
          serviceCategories: [
            {
              id: 'cheveux',
              name: 'Cheveux',
              icon: '💇‍♀️',
              expanded: true,
              services: [
                {
                  id: 'coupe-brushing',
                  name: 'Coupe + Brushing',
                  description: 'Coupe personnalisée avec brushing professionnel',
                  price: 65,
                  duration: 60
                },
                {
                  id: 'coloration',
                  name: 'Coloration complète',
                  description: 'Coloration avec soin professionnel',
                  price: 85,
                  duration: 120
                }
              ]
            },
            {
              id: 'soins-visage',
              name: 'Soins Visage',
              icon: '✨',
              expanded: false,
              services: [
                {
                  id: 'soin-hydratant',
                  name: 'Soin Hydratant',
                  description: 'Soin complet hydratation intensive',
                  price: 75,
                  duration: 75
                }
              ]
            },
            {
              id: 'epilation',
              name: 'Épilation',
              icon: '🪒',
              expanded: false,
              services: [
                {
                  id: 'epilation-jambes',
                  name: 'Épilation jambes complètes',
                  description: 'Épilation cire chaude jambes entières',
                  price: 45,
                  duration: 45
                }
              ]
            }
          ],
          userId: '1',
          updatedAt: new Date()
        };
      } else {
        console.log('📖 Salon trouvé en mémoire:', id);
      }
      
      res.json(salon);
    } catch (error) {
      console.error('❌ Erreur récupération salon:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

  app.put('/api/salon/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const salonData = req.body;
      
      console.log('💾 Sauvegarde salon:', id, Object.keys(salonData));
      
      let savedSalon;
      if (storage.updateBookingPage) {
        console.log('💾 Sauvegarde salon dans le stockage:', id);
        savedSalon = await storage.updateBookingPage(id, salonData);
        console.log('✅ Salon sauvegardé avec succès:', id);
      } else {
        savedSalon = salonData;
      }
      
      // 🔥 INTÉGRATION AUTOMATIQUE AU SYSTÈME DE RECHERCHE PUBLIC
      if (salonData.isPublished !== false) {
        const publicSalonData = {
          id: id,
          name: salonData.name || 'Salon sans nom',
          description: salonData.description || '',
          address: salonData.address || '',
          phone: salonData.phone || '',
          rating: 4.5,
          reviews: 0,
          verified: true,
          category: determineCategory(salonData.serviceCategories || []),
          city: extractCity(salonData.address || ''),
          services: extractServices(salonData.serviceCategories || []),
          customColors: salonData.customColors,
          shareableUrl: `/salon/${id}`,
          isActive: true,
          createdAt: new Date(),
          nextSlot: 'Disponible aujourd\'hui'
        };
        
        // Ajouter ou mettre à jour dans le système de recherche
        publicSalonsStorage.set(id, publicSalonData);
        console.log('🌟 Salon ajouté au système de recherche public:', id);
      }
      
      res.json({ 
        success: true, 
        message: 'Salon sauvegardé et publié avec succès', 
        salon: savedSalon,
        shareableUrl: `${req.protocol}://${req.get('host')}/salon/${id}`,
        publicListing: true
      });
    } catch (error) {
      console.error('❌ Erreur sauvegarde salon:', error);
      res.status(500).json({ success: false, message: 'Erreur lors de la sauvegarde' });
    }
  });

  // Route pour rechercher les salons publics par catégorie et ville
  app.get('/api/public/salons', async (req, res) => {
    try {
      const { category, city, q } = req.query;
      
      // Récupérer tous les salons publics
      let allSalons = Array.from(publicSalonsStorage.values());
      
      // Ajouter salon démo
      const demoSalon = {
        id: "demo-user",
        name: "Studio Élégance Paris",
        rating: 4.8,
        reviews: 247,
        image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&h=200&fit=crop",
        location: "Paris 1er",
        distance: "1.2 km",
        nextSlot: "Aujourd'hui 14h30",
        services: ["Coupe & Styling", "Coloration", "Soins Capillaires"],
        priceRange: "€€€",
        category: 'coiffure',
        city: 'paris',
        verified: true,
        shareableUrl: '/salon/demo-user'
      };
      
      allSalons.push(demoSalon);
      
      // Filtrer par catégorie et ville
      let salons = allSalons;
      if (category) {
        salons = salons.filter(salon => salon.category === category.toLowerCase());
      }
      if (city) {
        salons = salons.filter(salon => salon.city === city.toLowerCase() || salon.location?.toLowerCase().includes(city.toLowerCase()));
      }
      if (q) {
        const queryLower = (q as string).toLowerCase();
        salons = salons.filter(salon => 
          salon.name.toLowerCase().includes(queryLower) ||
          salon.services?.some((service: string) => service.toLowerCase().includes(queryLower))
        );
      }
      
      res.json({ success: true, salons });
    } catch (error) {
      console.error('Erreur recherche salons:', error);
      res.status(500).json({ success: false, message: 'Erreur de recherche' });
    }
  });

  // Dashboard routes (compatible Firebase)
  app.get('/api/dashboard/upcoming-appointments', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      let appointments = [];
      if (storage.getAppointments) {
        appointments = await storage.getAppointments(userId);
      }
      
      res.json(appointments.slice(0, 5)); // Limiter à 5 prochains RDV
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ message: 'Failed to fetch appointments' });
    }
  });

  // Notification routes (Firebase ready)
  app.get('/api/notifications', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      let notifications = [];
      if (storage.getNotifications) {
        notifications = await storage.getNotifications(userId);
      }
      
      res.json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ message: 'Failed to fetch notifications' });
    }
  });

  app.post('/api/notifications', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const notificationData = {
        ...req.body,
        userId,
        isRead: false
      };

      let notification;
      if (storage.createNotification) {
        notification = await storage.createNotification(notificationData);
      } else {
        notification = { ...notificationData, id: Date.now(), createdAt: new Date() };
      }
      
      res.json(notification);
    } catch (error) {
      console.error('Error creating notification:', error);
      res.status(500).json({ message: 'Failed to create notification' });
    }
  });

  // Client routes (Firebase ready) 
  app.post('/api/client/register', async (req, res) => {
    try {
      const clientData = {
        ...req.body,
        userId: req.body.userId || '1' // Default userId pour éviter l'erreur de contrainte
      };
      
      let client;
      if (storage.createClient) {
        client = await storage.createClient(clientData);
      } else {
        client = { ...clientData, id: Date.now().toString(), createdAt: new Date(), updatedAt: new Date() };
      }
      
      res.json({ success: true, client });
    } catch (error) {
      console.error('Error registering client:', error);
      res.status(500).json({ success: false, message: 'Failed to register client' });
    }
  });

  app.get('/api/client/by-email/:email', async (req, res) => {
    try {
      const { email } = req.params;
      
      // Pour l'instant, retourner un client fictif pour les tests
      const client = {
        id: 1,
        email,
        firstName: 'Client',
        lastName: 'Test',
        phone: '+33123456789',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      res.json(client);
    } catch (error) {
      console.error('Error fetching client:', error);
      res.status(500).json({ message: 'Failed to fetch client' });
    }
  });

  // Appointment routes (Firebase ready)
  app.post('/api/appointments', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const appointmentData = {
        ...req.body,
        userId,
        status: 'confirmed'
      };

      let appointment;
      if (storage.createAppointment) {
        appointment = await storage.createAppointment(appointmentData);
      } else {
        appointment = { 
          ...appointmentData, 
          id: Date.now(), 
          createdAt: new Date(), 
          updatedAt: new Date() 
        };
      }
      
      res.json(appointment);
    } catch (error) {
      console.error('Error creating appointment:', error);
      res.status(500).json({ message: 'Failed to create appointment' });
    }
  });

  // Services routes
  app.get('/api/services', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const services = await storage.getServices(userId);
      res.json(services);
    } catch (error) {
      console.error('Error fetching services:', error);
      res.status(500).json({ message: 'Failed to fetch services' });
    }
  });

  app.get('/api/services/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const service = await storage.getServiceById?.(id);
      
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      
      res.json(service);
    } catch (error) {
      console.error('Error fetching service:', error);
      res.status(500).json({ message: 'Failed to fetch service' });
    }
  });

  // Clients routes  
  app.get('/api/clients', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const clients = await storage.getClients(userId);
      res.json(clients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      res.status(500).json({ message: 'Failed to fetch clients' });
    }
  });

  // Route de test simple
  app.get('/api/test', (req, res) => {
    res.json({ message: 'API fonctionne', timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Fonctions utilitaires pour déterminer la catégorie et extraire les données
function determineCategory(serviceCategories: any[]): string {
  if (!serviceCategories || serviceCategories.length === 0) return 'beaute';
  
  const firstCategory = serviceCategories[0];
  const categoryName = firstCategory.name?.toLowerCase() || '';
  
  if (categoryName.includes('cheveux') || categoryName.includes('coiffure') || categoryName.includes('coupe')) {
    return 'coiffure';
  } else if (categoryName.includes('barbe') || categoryName.includes('barbier')) {
    return 'barbier';
  } else if (categoryName.includes('ongle') || categoryName.includes('manucure')) {
    return 'ongles';
  } else if (categoryName.includes('massage') || categoryName.includes('spa')) {
    return 'massage';
  } else if (categoryName.includes('visage') || categoryName.includes('soin') || categoryName.includes('esthé')) {
    return 'esthetique';
  }
  
  return 'beaute';
}

function extractCity(address: string): string {
  if (!address) return 'paris';
  
  // Extraire la ville de l'adresse
  const cityMatch = address.match(/(\d{5})\s+([^,]+)/);
  if (cityMatch) {
    return cityMatch[2].toLowerCase().trim();
  }
  
  // Fallback - chercher "Paris" dans l'adresse
  if (address.toLowerCase().includes('paris')) {
    return 'paris';
  }
  
  return 'paris';
}

function extractServices(serviceCategories: any[]): string[] {
  const services: string[] = [];
  
  serviceCategories.forEach(category => {
    if (category.services && Array.isArray(category.services)) {
      category.services.forEach((service: any) => {
        if (service.name) {
          services.push(service.name);
        }
      });
    }
  });
  
  return services.slice(0, 5); // Limiter à 5 services max
}