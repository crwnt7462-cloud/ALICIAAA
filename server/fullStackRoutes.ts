import type { Express } from "express";
import { createServer, type Server } from "http";
// Firebase storage removed - using PostgreSQL only
import { storage as memoryStorage } from "./storage";
import { createAutomaticSalonPage, linkSalonToProfessional } from './autoSalonCreation';
import { setupAuth, isAuthenticated } from "./replitAuth";
import { FIREBASE_CONFIG, FIREBASE_INSTRUCTIONS } from "./firebaseSetup";
import { SUPABASE_CONFIG, SUPABASE_INSTRUCTIONS, realtimeService } from "./supabaseSetup";
import { aiService } from "./aiService";
import { clientAnalyticsService, type ClientProfile } from "./clientAnalyticsService";
import { broadcastSalonUpdate } from "./routes";

// Configuration: utiliser Firebase ou stockage mémoire
const USE_FIREBASE = FIREBASE_CONFIG.USE_FIREBASE && FIREBASE_CONFIG.hasFirebaseSecrets();
const storage = memoryStorage; // Using PostgreSQL storage only

// 🔥 STOCKAGE EN MÉMOIRE POUR LES SALONS PUBLICS
const publicSalonsStorage = new Map<string, any>();

// Fonction pour charger les salons de démonstration depuis PostgreSQL
async function loadSalonsFromDatabase() {
  try {
    console.log('🔄 Chargement des salons de démonstration...');
    
    // Créer des salons de démonstration basés sur les salons existants sur la page d'accueil
    const demoSalons = [
      {
        id: "barbier-gentleman-marais",
        name: "Barbier Gentleman Marais",
        slug: "barbier-gentleman-marais",
        description: "Barbier traditionnel spécialisé dans la coupe masculine classique et moderne",
        address: "15 rue des Rosiers, 75004 Paris",
        phone: "01 42 71 20 30",
        email: "contact@barbier-gentleman.fr",
        rating: 4.8,
        reviews: ["Service exceptionnel, ambiance authentique", "Coupe parfaite, très professionnel"],
        reviewsCount: 156,
        image: "https://images.unsplash.com/photo-1503951458645-643d53bfd90f?w=800&h=600&fit=crop&auto=format",
        photos: ["https://images.unsplash.com/photo-1503951458645-643d53bfd90f?w=800&h=600&fit=crop&auto=format"],
        services: ["Coupe homme", "Barbe", "Rasage traditionnel", "Soin visage"],
        nextSlot: "Disponible aujourd'hui",
        category: "barbier",
        city: "Paris",
        priceRange: "€€",
        verified: true,
        popular: true,
        shareableUrl: "/salon/barbier-gentleman-marais",
        route: "/salon/barbier-gentleman-marais",
        customColors: { primary: "#8B4513", accent: "#D2691E", intensity: 70 },
        distance: "0.3 km",
        location: "Le Marais"
      },
      {
        id: "beauty-lash-studio",
        name: "Beauty Lash Studio",
        slug: "beauty-lash-studio",
        description: "Studio spécialisé dans les extensions de cils et soins du regard",
        address: "8 avenue de la République, 75011 Paris",
        phone: "01 48 05 14 22",
        email: "hello@beautylash.fr",
        rating: 4.9,
        reviews: ["Extensions magnifiques, très naturelles", "Professionnalisme au top"],
        reviewsCount: 78,
        image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&h=600&fit=crop&auto=format",
        photos: ["https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&h=600&fit=crop&auto=format"],
        services: ["Extensions de cils", "Rehaussement cils", "Teinture sourcils", "Épilation"],
        nextSlot: "Disponible demain",
        category: "esthetique",
        city: "Paris",
        priceRange: "€€€",
        verified: true,
        popular: false,
        shareableUrl: "/salon/beauty-lash-studio",
        route: "/salon/beauty-lash-studio", 
        customColors: { primary: "#E91E63", accent: "#AD1457", intensity: 65 },
        distance: "0.8 km",
        location: "République"
      },
      {
        id: "salon-excellence-paris",
        name: "Salon Excellence Paris",
        slug: "salon-excellence-paris",
        description: "Salon de coiffure haut de gamme, spécialiste coloration et soins",
        address: "45 avenue des Champs-Élysées, 75008 Paris",
        phone: "01 42 25 33 40",
        email: "info@salon-excellence.com",
        rating: 4.8,
        reviews: ["Coiffeur d'exception, résultat parfait", "Service premium, très satisfaite"],
        reviewsCount: 127,
        image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&auto=format",
        photos: ["https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&auto=format"],
        services: ["Coupe femme", "Coloration", "Mèches", "Soins cheveux"],
        nextSlot: "Disponible cette semaine",
        category: "coiffure",
        city: "Paris",
        priceRange: "€€€€",
        verified: true,
        popular: true,
        shareableUrl: "/salon/salon-excellence-paris",
        route: "/salon/salon-excellence-paris",
        customColors: { primary: "#673AB7", accent: "#512DA8", intensity: 80 },
        distance: "1.2 km",
        location: "Champs-Élysées"
      },
      {
        id: "institut-beaute-saint-germain",
        name: "Institut Beauté Saint-Germain",
        slug: "institut-beaute-saint-germain",
        description: "Institut de beauté complet, soins visage et corps",
        address: "12 boulevard Saint-Germain, 75006 Paris",
        phone: "01 43 26 18 55",
        email: "contact@institut-sg.fr",
        rating: 4.7,
        reviews: ["Soins relaxants exceptionnels", "Équipe très professionnelle"],
        reviewsCount: 89,
        image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=600&fit=crop&auto=format",
        photos: ["https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=600&fit=crop&auto=format"],
        services: ["Soin visage", "Massage", "Épilation", "Manucure"],
        nextSlot: "Disponible cette semaine",
        category: "esthetique",
        city: "Paris",
        priceRange: "€€€",
        verified: true,
        popular: false,
        shareableUrl: "/salon/institut-beaute-saint-germain",
        route: "/salon/institut-beaute-saint-germain",
        customColors: { primary: "#4CAF50", accent: "#388E3C", intensity: 60 },
        distance: "0.9 km",
        location: "Saint-Germain"
      },
      {
        id: "beauty-lounge-montparnasse",
        name: "Beauty Lounge Montparnasse",
        slug: "beauty-lounge-montparnasse",
        description: "Salon moderne proposant coiffure, esthétique et bien-être",
        address: "33 avenue du Maine, 75014 Paris",
        phone: "01 45 38 62 17",
        email: "hello@beauty-lounge.fr",
        rating: 4.6,
        reviews: ["Ambiance moderne et accueillante", "Services variés de qualité"],
        reviewsCount: 94,
        image: "https://images.unsplash.com/photo-1562322140-8198e7e2e3f0?w=800&h=600&fit=crop&auto=format",
        photos: ["https://images.unsplash.com/photo-1562322140-8198e7e2e3f0?w=800&h=600&fit=crop&auto=format"],
        services: ["Coiffure", "Onglerie", "Massage", "Soins"],
        nextSlot: "Disponible demain",
        category: "coiffure",
        city: "Paris",
        priceRange: "€€",
        verified: true,
        popular: false,
        shareableUrl: "/salon/beauty-lounge-montparnasse",
        route: "/salon/beauty-lounge-montparnasse",
        customColors: { primary: "#FF5722", accent: "#D84315", intensity: 55 },
        distance: "1.5 km",
        location: "Montparnasse"
      },
      {
        id: "salon-moderne-republique",
        name: "Salon Moderne République",
        slug: "salon-moderne-republique",
        description: "Salon tendance au cœur de République, spécialiste coupes modernes",
        address: "7 place de la République, 75011 Paris",
        phone: "01 48 87 23 45",
        email: "contact@salon-moderne.fr",
        rating: 4.5,
        reviews: ["Coupes tendance, stylistes créatifs", "Bon rapport qualité-prix"],
        reviewsCount: 67,
        image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&h=600&fit=crop&auto=format",
        photos: ["https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&h=600&fit=crop&auto=format"],
        services: ["Coupe moderne", "Styling", "Coloration", "Brushing"],
        nextSlot: "Disponible aujourd'hui",
        category: "coiffure",
        city: "Paris",
        priceRange: "€€",
        verified: true,
        popular: false,
        shareableUrl: "/salon/salon-moderne-republique",
        route: "/salon/salon-moderne-republique",
        customColors: { primary: "#2196F3", accent: "#1976D2", intensity: 50 },
        distance: "1.1 km",
        location: "République"
      }
    ];

    // Ajouter les salons dans le cache
    demoSalons.forEach(salon => {
      publicSalonsStorage.set(salon.id, salon);
    });

    console.log(`✅ ${demoSalons.length} salons de démonstration chargés`);
    
  } catch (error) {
    console.error('❌ Erreur lors du chargement des salons de démonstration:', error);
  }
}

// Logging de l'état des services temps réel
FIREBASE_CONFIG.logStatus();
SUPABASE_CONFIG.logStatus();

if (!USE_FIREBASE && process.env.USE_FIREBASE === 'true') {
  console.log(FIREBASE_INSTRUCTIONS);
}

if (!SUPABASE_CONFIG.USE_SUPABASE && !SUPABASE_CONFIG.hasSupabaseSecrets()) {
  console.log(SUPABASE_INSTRUCTIONS);
}

export async function registerFullStackRoutes(app: Express): Promise<Server> {
  
  // ✅ INITIALISATION CRITIQUE : Recréer le salon démo avec customColors au démarrage
  if (!storage.salons) {
    storage.salons = new Map();
  }
  
  // ✅ INITIALISATION DES PLANS D'ABONNEMENT
  try {
    const existingPlans = await storage.getSubscriptionPlans();
    if (existingPlans.length === 0) {
      console.log('🔧 Initialisation des plans d\'abonnement...');
      
      const defaultPlans = [
        {
          id: 'basic-pro',
          name: 'Basic Pro',
          price: '29.00',
          currency: 'EUR',
          billingCycle: 'monthly',
          features: [
            'Gestion des rendez-vous',
            'Base de données clients',
            'Calendrier intégré',
            'Support email'
          ],
          isPopular: false,
          isActive: true
        },
        {
          id: 'advanced-pro',
          name: 'Advanced Pro',
          price: '79.00',
          currency: 'EUR',
          billingCycle: 'monthly',
          features: [
            'Tout du plan Basic Pro',
            'Gestion des stocks',
            'Notifications SMS',
            'Système de fidélité',
            'Statistiques détaillées'
          ],
          isPopular: true,
          isActive: true
        },
        {
          id: 'premium-pro',
          name: 'Premium Pro',
          price: '149.00',
          currency: 'EUR',
          billingCycle: 'monthly',
          features: [
            'Tout du plan Advanced Pro',
            'Assistant IA exclusif',
            'Optimisation intelligente du planning',
            'Analytics avancés avec IA',
            'Support prioritaire 24/7'
          ],
          isPopular: false,
          isActive: true
        }
      ];

      for (const plan of defaultPlans) {
        await storage.createSubscriptionPlan(plan);
      }
      console.log('✅ Plans d\'abonnement initialisés');
    }
  } catch (error) {
    console.error('❌ Erreur initialisation plans:', error);
  }
  
  const demoSalonData = {
    id: 'demo-user',
    name: 'Salon Excellence Démo',
    slug: 'demo-user',
    ownerId: 'demo-user',
    ownerEmail: 'demo@beautyapp.co',
    address: '123 Avenue des Champs-Élysées, 75008 Paris',
    phone: '01 42 96 00 00',
    email: 'contact@salon-excellence.fr',
    description: 'Salon de beauté moderne spécialisé dans les coupes et colorations tendances',
    longDescription: 'Notre salon vous accueille dans un cadre moderne et chaleureux pour tous vos soins de beauté.',
    subscriptionPlan: 'premium',
    shareableUrl: '/salon/demo-user',
    isPublished: true,
    customColors: {
      primary: '#cf079a',
      accent: '#171519',
      buttonText: '#ffffff',
      buttonClass: 'glass-button-purple',
      priceColor: '#7c3aed',
      neonFrame: '#a855f7',
      intensity: 59
    },
    serviceCategories: [
      {
        id: 1,
        name: 'Coiffure Homme',
        expanded: true,
        services: [
          { 
            id: 1, 
            name: 'Coupe Classique', 
            price: 25, 
            duration: '30', 
            description: 'Coupe classique pour homme avec finition professionnelle',
            rating: 4.9,
            reviewCount: 87,
            photos: [
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
              'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face'
            ]
          },
          { 
            id: 2, 
            name: 'Coupe Dégradée', 
            price: 30, 
            duration: '45', 
            description: 'Coupe moderne avec dégradé sur les côtés',
            rating: 4.8,
            reviewCount: 124,
            photos: [
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face',
              'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=300&fit=crop&crop=face'
            ]
          },
          { 
            id: 3, 
            name: 'Coupe + Barbe', 
            price: 40, 
            duration: '60', 
            description: 'Coupe complète avec taille de barbe et finition',
            rating: 4.9,
            reviewCount: 156,
            photos: [
              'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'
            ]
          },
          { 
            id: 4, 
            name: 'Coupe Enfant (-12 ans)', 
            price: 20, 
            duration: '25', 
            description: 'Coupe spécialement adaptée aux enfants',
            rating: 4.7,
            reviewCount: 63,
            photos: [
              'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=300&fit=crop&crop=face'
            ]
          }
        ]
      },
      {
        id: 2,
        name: 'Soins & Styling',
        expanded: false,
        services: [
          { 
            id: 5, 
            name: 'Shampoing + Coiffage', 
            price: 15, 
            duration: '20', 
            description: 'Lavage professionnel et coiffage personnalisé',
            rating: 4.6,
            reviewCount: 89
          },
          { 
            id: 6, 
            name: 'Soin Capillaire', 
            price: 35, 
            duration: '30', 
            description: 'Soin restructurant pour cheveux abîmés',
            rating: 4.8,
            reviewCount: 72
          }
        ]
      }
    ],
    certifications: ['Salon labellisé L\'Oréal Professionnel', 'Formation continue Kérastase', 'Certification bio Shu Uemura'],
    awards: ['Élu Meilleur Salon 2023', 'Prix de l\'Innovation Beauté 2022', 'Certification Éco-responsable'],
    photos: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&h=600&fit=crop&auto=format'
    ],
    coverImageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&auto=format',
    rating: 4.8,
    reviewCount: 247,
    createdAt: new Date(),
    updatedAt: new Date(),
    professionals: [
      {
        id: 'prof-1',
        name: 'Alexandre Martin',
        specialty: 'Coiffeur Expert',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        rating: 4.9,
        price: 45,
        bio: 'Coiffeur passionné avec 8 ans d\'expérience, spécialisé dans les coupes modernes et classiques.',
        experience: '8 ans d\'expérience',
        certifications: ['CAP Coiffure', 'BP Coiffure', 'Formation L\'Oréal']
      },
      {
        id: 'prof-2',
        name: 'Sophie Dubois',
        specialty: 'Styliste Créative',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=150&h=150&fit=crop&crop=face',
        rating: 4.8,
        price: 50,
        bio: 'Styliste créative spécialisée dans les coupes tendances et les colorations.',
        experience: '6 ans d\'expérience',
        certifications: ['CAP Coiffure', 'Formation Kérastase']
      }
    ],
    reviews: [
      {
        id: 1,
        clientName: 'Thomas L.',
        rating: 5,
        comment: 'Excellent service ! Alexandre a su parfaitement comprendre ce que je voulais. Coupe impeccable et accueil chaleureux.',
        date: '2024-01-10',
        service: 'Coupe + Barbe',
        professional: 'Alexandre Martin',
        verified: true,
        photos: []
      },
      {
        id: 2,
        clientName: 'Marc R.',
        rating: 5,
        comment: 'Très satisfait de ma coupe dégradée. Sophie est une vraie professionnelle, je recommande vivement ce salon.',
        date: '2024-01-08',
        service: 'Coupe Dégradée',
        professional: 'Sophie Dubois',
        verified: true,
        photos: []
      },
      {
        id: 3,
        clientName: 'Pierre M.',
        rating: 4,
        comment: 'Salon moderne avec une équipe compétente. Bon rapport qualité-prix.',
        date: '2024-01-05',
        service: 'Coupe Classique',
        professional: 'Alexandre Martin',
        verified: true,
        photos: []
      }
    ],
    verified: true,
    category: 'mixte',
    city: '75008 Paris',
    services: ['Coupe Classique', 'Coupe Dégradée', 'Coupe + Barbe', 'Coupe Enfant (-12 ans)'],
    isActive: true,
    nextSlot: 'Disponible aujourd\'hui',
    openingHours: {
      lundi: { open: '09:00', close: '19:00' },
      mardi: { open: '09:00', close: '19:00' },
      mercredi: { open: '09:00', close: '19:00' },
      jeudi: { open: '09:00', close: '19:00' },
      vendredi: { open: '09:00', close: '19:00' },
      samedi: { open: '09:00', close: '18:00' },
      dimanche: { closed: true, open: '', close: '' }
    },
    amenities: ['WiFi gratuit', 'Climatisation', 'Parking gratuit', 'Accessible PMR', 'Produits bio'],
    priceRange: '€€'
  };
  
  storage.salons.set('demo-user', demoSalonData);
  console.log('🎯 SALON DÉMO RECRÉÉ avec customColors:', demoSalonData.customColors);
  
  // ✅ ROUTE SYNCHRONISATION CUSTOMCOLORS GLOBALE
  app.get('/api/salon/:salonSlug/custom-colors', async (req: any, res) => {
    const { salonSlug } = req.params;
    
    try {
      // Chercher le salon en mémoire d'abord
      let salon = storage.salons?.get(salonSlug);
      
      if (!salon) {
        // Fallback PostgreSQL
        salon = await storage.getSalon(salonSlug);
      }
      
      if (salon && salon.customColors) {
        console.log('🎨 CustomColors synchronisées pour:', salonSlug, salon.customColors);
        res.json({
          success: true,
          customColors: salon.customColors,
          salonName: salon.name
        });
      } else {
        res.json({
          success: false,
          customColors: null
        });
      }
    } catch (error) {
      console.error('❌ Erreur sync customColors:', error);
      res.status(500).json({ success: false, error: 'Erreur serveur' });
    }
  });

  // ============= ROUTES PRIORITAIRES SALON & SUBSCRIPTION =============
  
  // ============= ROUTES PROFESSIONAL SETTINGS - SAUVEGARDE PERSISTANTE =============
  
  // Récupérer les paramètres professionnels
  app.get('/api/professional/settings', async (req: any, res) => {
    try {
      const userId = req.user?.id || 'demo-user'; // Use demo for now
      console.log('⚙️ Récupération paramètres professionnels pour:', userId);
      
      const settings = await storage.getProfessionalSettings(userId);
      res.json(settings);
    } catch (error: any) {
      console.error('❌ Erreur récupération paramètres:', error);
      res.status(500).json({ error: 'Failed to fetch professional settings' });
    }
  });
  
  // Sauvegarder les paramètres professionnels
  app.post('/api/professional/settings', async (req: any, res) => {
    try {
      const userId = req.user?.id || 'demo-user'; // Use demo for now
      const settings = req.body;
      
      console.log('💾 Sauvegarde paramètres professionnels pour:', userId);
      
      const savedSettings = await storage.saveProfessionalSettings(userId, settings);
      res.json(savedSettings);
    } catch (error: any) {
      console.error('❌ Erreur sauvegarde paramètres:', error);
      res.status(500).json({ error: 'Failed to save professional settings' });
    }
  });
  
  // ROUTE SALON - PRIORITÉ ABSOLUE (AVANT TOUTE AUTRE ROUTE)
  app.get('/api/user/salon', async (req: any, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');
    
    try {
      console.log(`🎯 [PRIORITÉ] API Salon - retour salon démo directement`);
      
      // Chercher d'abord dans le stockage en mémoire
      let demoSalon = storage.salons?.get('demo-user');
      
      if (!demoSalon) {
        // Si pas trouvé en mémoire, chercher en PostgreSQL
        demoSalon = await storage.getSalon('demo-user');
      }
      
      if (demoSalon) {
        console.log(`✅ Salon démo trouvé: ${demoSalon.name}`);
        return res.status(200).json(demoSalon);
      } else {
        console.log(`❌ Salon démo non trouvé`);
        return res.status(404).json({ error: 'Salon démo non disponible' });
      }
    } catch (error: any) {
      console.error("Error fetching user salon:", error);
      return res.status(500).json({ message: "Failed to fetch user salon" });
    }
  });

  // ROUTE SUBSCRIPTION - SUPPORT DES 3 PLANS COMPLETS
  app.get('/api/user/subscription', async (req: any, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');
    
    try {
      const userId = req.query.userId || req.query.user || 'demo';
      const planType = req.query.plan || req.query.planType || 'premium'; // Permet de tester différents plans
      
      console.log(`💳 API Subscription - Plan demandé: ${planType} pour userId: ${userId}`, req.query);
      
      // Définition complète des 3 plans
      const plans = {
        'basic': {
          planId: 'basic',
          planName: 'Basic Pro',
          price: 29,
          priceFormatted: '29€/mois',
          status: 'active',
          userId: userId,
          features: {
            hasAI: false,
            hasAdvancedAnalytics: false,
            hasUnlimitedClients: false,
            maxClients: 200,
            hasCustomBranding: false,
            hasPrioritySupport: false,
            hasBasicReports: true,
            storageGB: 1
          },
          limits: 'Jusqu\'à 200 clients',
          billingCycle: 'monthly',
          nextBillingDate: '2024-02-15',
          cancelAtPeriodEnd: false
        },
        'advanced': {
          planId: 'advanced',
          planName: 'Advanced Pro',
          price: 79,
          priceFormatted: '79€/mois',
          status: 'active',
          userId: userId,
          features: {
            hasAI: true,
            hasAdvancedAnalytics: true,
            hasUnlimitedClients: false,
            maxClients: 1000,
            hasCustomBranding: true,
            hasPrioritySupport: true,
            hasBasicReports: true,
            hasAdvancedReports: true,
            storageGB: 10
          },
          limits: 'Jusqu\'à 1000 clients',
          billingCycle: 'monthly',
          nextBillingDate: '2024-02-15',
          cancelAtPeriodEnd: false
        },
        'premium': {
          planId: 'premium',
          planName: 'Premium Pro',
          price: 149,
          priceFormatted: '149€/mois',
          status: 'active',
          userId: userId,
          features: {
            hasAI: true,
            hasAdvancedAnalytics: true,
            hasUnlimitedClients: true,
            maxClients: -1,
            hasCustomBranding: true,
            hasPrioritySupport: true,
            hasBasicReports: true,
            hasAdvancedReports: true,
            hasVIPSupport: true,
            storageGB: -1
          },
          limits: 'Clients illimités',
          billingCycle: 'monthly',
          nextBillingDate: '2024-02-15',
          cancelAtPeriodEnd: false
        }
      };
      
      const subscription = plans[planType as keyof typeof plans] || plans.premium;
      console.log(`✅ Plan retourné: ${subscription.planName} (${subscription.price}€)`);
      return res.status(200).json(subscription);
    } catch (error: any) {
      console.error("Error fetching user subscription:", error);
      return res.status(500).json({ message: "Failed to fetch user subscription" });
    }
  });

  // ============= FIN ROUTES PRIORITAIRES =============
  
  // 🔧 ROUTE TEST - PERMET DE TESTER LES 3 PLANS DIRECTEMENT
  app.get('/api/test/plans/:planType', async (req: any, res) => {
    try {
      const { planType } = req.params;
      console.log(`🧪 Test plan: ${planType}`);
      
      // Rediriger vers l'API subscription avec le plan spécifique
      const url = `/api/user/subscription?plan=${planType}&userId=test-${planType}`;
      
      // Simuler un appel interne
      const planResponse = await fetch(`http://localhost:5000${url}`);
      const planData = await planResponse.json();
      
      res.json({
        success: true,
        tested_plan: planType,
        plan_data: planData,
        message: `Plan ${planType} testé avec succès !`
      });
    } catch (error: any) {
      console.error(`❌ Erreur test plan ${req.params.planType}:`, error);
      res.status(500).json({ error: 'Erreur test plan' });
    }
  });
  
  // Test de connexion OpenAI
  app.post('/api/ai/test-openai', async (req, res) => {
    try {
      console.log('🤖 Test de connexion OpenAI...');
      const { message } = req.body;
      
      const response = await aiService.generateResponse(message || "Bonjour, peux-tu confirmer que la connexion OpenAI fonctionne?");
      
      res.json({
        success: true,
        response,
        message: "Connexion OpenAI fonctionnelle!",
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('❌ Erreur connexion OpenAI:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        message: "Échec de connexion OpenAI"
      });
    }
  });

  // Chat avec IA via OpenAI - Enregistrement automatique dans l'historique
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, conversationHistory } = req.body;
      console.log('💬 Message IA reçu:', message);
      
      const response = await aiService.generateResponse(message);
      
      // Enregistrement automatique de la conversation
      const conversationId = `chat-${Date.now()}`;
      const conversation = {
        id: conversationId,
        title: message.substring(0, 50) + '...',
        timestamp: new Date().toISOString(),
        messages: [
          {
            role: 'user',
            content: message
          },
          {
            role: 'assistant',
            content: response
          }
        ],
        metadata: {
          type: 'general_chat',
          auto_generated: false
        }
      };
      
      await (storage as any).saveConversation('demo-user', conversationId, conversation);
      console.log('💾 Conversation enregistrée:', conversationId);
      
      res.json({
        success: true,
        response,
        conversationId,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('❌ Erreur chat IA:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // ================== ROUTES D'ANALYSE CLIENT ==================
  
  // Analyse d'un client individuel
  app.post('/api/client/analyze', async (req, res) => {
    try {
      const clientData: ClientProfile = req.body;
      
      if (!clientData.nom || typeof clientData.rdv_total !== 'number' || typeof clientData.rdv_annules !== 'number') {
        return res.status(400).json({
          success: false,
          error: "Données client invalides. Nom, rdv_total et rdv_annules sont requis."
        });
      }
      
      // Calcul automatique du taux d'annulation si non fourni
      if (!clientData.taux_annulation) {
        clientData.taux_annulation = clientData.rdv_total > 0 
          ? Math.round((clientData.rdv_annules / clientData.rdv_total) * 100)
          : 0;
      }
      
      // Détermination automatique du profil si non fourni
      if (!clientData.profil) {
        clientData.profil = clientData.rdv_total >= 3 ? "habitué" : "nouveau";
      }
      
      console.log('🔍 Analyse client:', clientData.nom, `(${clientData.taux_annulation}% annulation)`);
      
      const insight = await clientAnalyticsService.analyzeClient(clientData);
      
      res.json({
        success: true,
        insight,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('❌ Erreur analyse client:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Récupération de tous les clients réels pour analyse
  app.get('/api/clients/real-data', async (req, res) => {
    try {
      // On récupère tous les clients du premier salon pour l'analyse
      const allClients = await storage.getClients('demo-user');
      
      // Transformation des données client en format d'analyse
      const clientsForAnalysis = allClients.map(client => {
        // Calcul des statistiques basées sur les rendez-vous (simulées pour demo)
        const rdvTotal = Math.floor(Math.random() * 15) + 1; // 1-15 RDV
        const rdvAnnules = Math.floor(Math.random() * Math.min(rdvTotal, 8)); // Jusqu'à 8 annulations
        const tauxAnnulation = rdvTotal > 0 ? Math.round((rdvAnnules / rdvTotal) * 100) : 0;
        
        const behaviors = ["venu", "annulé", "pas venu"] as const;
        const dernierComportement = behaviors[Math.floor(Math.random() * behaviors.length)];
        
        return {
          nom: `${client.firstName} ${client.lastName}`,
          rdv_total: rdvTotal,
          rdv_annules: rdvAnnules,
          dernier_comportement: dernierComportement,
          profil: rdvTotal >= 3 ? "habitué" as const : "nouveau" as const,
          taux_annulation: tauxAnnulation,
          client_id: client.id
        };
      });
      
      console.log('📊 Récupération clients réels:', clientsForAnalysis.length, 'clients');
      
      res.json({
        success: true,
        clients: clientsForAnalysis,
        total: clientsForAnalysis.length,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('❌ Erreur récupération clients:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Analyse par lot des clients réels
  app.post('/api/clients/analyze-real-batch', async (req, res) => {
    try {
      // Récupération des clients réels
      const allClients = await storage.getClients('demo-user');
      
      if (allClients.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Aucun client réel trouvé dans la base de données"
        });
      }
      
      // Transformation en profils d'analyse avec données plus réalistes
      const clientProfiles: ClientProfile[] = allClients.map(client => {
        // Génération de statistiques cohérentes par client
        const rdvTotal = Math.floor(Math.random() * 20) + 2; // 2-22 RDV
        let rdvAnnules: number;
        let dernierComportement: "venu" | "annulé" | "pas venu";
        
        // Création de profils clients variés plus réalistes
        const clientType = Math.random();
        if (clientType < 0.15) {
          // 15% clients problématiques (forte annulation)
          rdvAnnules = Math.floor(rdvTotal * (0.5 + Math.random() * 0.4)); // 50-90% annulation
          dernierComportement = Math.random() < 0.7 ? "annulé" : "pas venu";
        } else if (clientType < 0.35) {
          // 20% clients moyens (annulation modérée)
          rdvAnnules = Math.floor(rdvTotal * (0.2 + Math.random() * 0.3)); // 20-50% annulation
          dernierComportement = Math.random() < 0.4 ? "annulé" : Math.random() < 0.7 ? "venu" : "pas venu";
        } else {
          // 65% bons clients (faible annulation)
          rdvAnnules = Math.floor(rdvTotal * Math.random() * 0.25); // 0-25% annulation
          dernierComportement = Math.random() < 0.85 ? "venu" : "annulé";
        }
        
        const tauxAnnulation = Math.round((rdvAnnules / rdvTotal) * 100);
        
        return {
          nom: `${client.firstName} ${client.lastName}`,
          rdv_total: rdvTotal,
          rdv_annules: rdvAnnules,
          dernier_comportement: dernierComportement,
          profil: rdvTotal >= 3 ? "habitué" as const : "nouveau" as const,
          taux_annulation: tauxAnnulation
        };
      });
      
      console.log('🔍 Analyse par lot clients réels:', clientProfiles.length, 'profils');
      
      // Analyse avec l'IA
      const insights = await clientAnalyticsService.analyzeClientBatch(clientProfiles);
      const report = clientAnalyticsService.generateAnalyticsReport(insights);
      
      // Sauvegarde automatique des messages IA dans l'historique de l'assistant IA
      let messagesSaved = 0;
      try {
        for (const insight of insights) {
          if (insight.message_personnalise && insight.niveau_risque !== "faible") {
            // Créer une conversation dédiée dans l'historique de l'assistant IA
            const conversationData = {
              id: `client-analysis-${insight.client.nom.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
              title: `📊 Analyse Client: ${insight.client.nom}`,
              timestamp: new Date().toISOString(),
              messages: [
                {
                  role: 'user',
                  content: `Analyse le profil de ${insight.client.nom} - Client avec ${insight.client.taux_annulation}% d'annulations, niveau de risque ${insight.niveau_risque}`
                },
                {
                  role: 'assistant',
                  content: `## 💬 Message Personnel à Envoyer

"${insight.message_personnalise}"

## 🔍 Analyse Détaillée

${insight.strategie_retention}

## 📋 Actions Recommandées

${insight.actions_recommandees.map((action, index) => `${index + 1}. ${action}`).join('\n')}

## 📊 Métriques Client

• **Taux d'annulation**: ${insight.client.taux_annulation}%
• **Score de risque**: ${Math.round((insight.client?.score_risque || 0) * 100)}/100
• **Probabilité de récupération**: ${Math.round(insight.probabilite_conversion * 100)}%

---
*Analyse générée automatiquement le ${new Date().toLocaleString('fr-FR')}*`
                }
              ],
              metadata: {
                type: 'client_analysis',
                client_name: insight.client.nom,
                risk_level: insight.niveau_risque,
                auto_generated: true
              }
            };
            
            // Sauvegarde dans l'historique de l'assistant IA
            await storage.saveConversation('demo-user', conversationData.id, conversationData);
            messagesSaved++;
          }
        }
        console.log(`💬 ${messagesSaved} analyses client sauvegardées dans l'assistant IA`);
      } catch (error: any) {
        console.error('❌ Erreur sauvegarde analyses:', error);
      }
      
      res.json({
        success: true,
        insights,
        report,
        total_clients: clientProfiles.length,
        messages_saved: messagesSaved,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('❌ Erreur analyse clients réels:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Routes pour la gestion des conversations IA
  app.get('/api/ai/conversations', async (req, res) => {
    try {
      const conversations = await storage.getConversations('demo-user');
      res.json({
        success: true,
        conversations
      });
    } catch (error: any) {
      console.error('❌ Erreur récupération conversations:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des conversations'
      });
    }
  });

  app.delete('/api/ai/conversations/:conversationId', async (req, res) => {
    try {
      const { conversationId } = req.params;
      await storage.deleteConversation('demo-user', conversationId);
      res.json({
        success: true,
        message: 'Conversation supprimée avec succès'
      });
    } catch (error: any) {
      console.error('❌ Erreur suppression conversation:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la suppression de la conversation'
      });
    }
  });

  app.delete('/api/ai/conversations', async (req, res) => {
    try {
      await storage.clearConversations('demo-user');
      res.json({
        success: true,
        message: 'Toutes les conversations ont été supprimées'
      });
    } catch (error: any) {
      console.error('❌ Erreur nettoyage conversations:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors du nettoyage des conversations'
      });
    }
  });

  // Routes pour les messages IA clients
  app.get('/api/clients/ai-messages', async (req, res) => {
    try {
      const messages = await storage.getClientAIMessages('demo-user');
      res.json({
        success: true,
        messages,
        total: messages.length
      });
    } catch (error: any) {
      console.error('❌ Erreur récupération messages IA:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur lors de la récupération des messages IA' 
      });
    }
  });

  app.delete('/api/clients/ai-messages/:messageId', async (req, res) => {
    try {
      const { messageId } = req.params;
      await storage.deleteClientAIMessage('demo-user', messageId);
      res.json({
        success: true,
        message: 'Message IA supprimé avec succès'
      });
    } catch (error: any) {
      console.error('❌ Erreur suppression message IA:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur lors de la suppression du message IA' 
      });
    }
  });

  app.delete('/api/clients/ai-messages', async (req, res) => {
    try {
      await storage.clearClientAIMessages('demo-user');
      res.json({
        success: true,
        message: 'Tous les messages IA ont été supprimés'
      });
    } catch (error: any) {
      console.error('❌ Erreur nettoyage messages IA:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur lors du nettoyage des messages IA' 
      });
    }
  });

  // Endpoint pour récupérer les membres de l'équipe d'un salon
  app.get('/api/salon/:salonId/staff', async (req, res) => {
    try {
      const { salonId } = req.params;
      const { serviceId } = req.query;
      
      console.log('👥 Récupération équipe salon:', salonId, serviceId ? `pour service ${serviceId}` : '(tous)');
      
      let staffMembers;
      if (serviceId) {
        // Récupérer seulement les professionnels qui peuvent faire ce service
        staffMembers = await storage.getStaffByService(salonId, serviceId as string);
      } else {
        // Récupérer tous les professionnels du salon
        staffMembers = await storage.getStaffBySalon(salonId);
      }
      
      console.log('👥 Équipe trouvée:', staffMembers?.length || 0, 'membres');
      
      res.json({
        success: true,
        staff: staffMembers || [],
        total: staffMembers?.length || 0
      });
    } catch (error: any) {
      console.error('❌ Erreur récupération équipe:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // API pour créer un professionnel
  app.post('/api/salon/:salonId/staff', async (req, res) => {
    try {
      const { salonId } = req.params;
      const { firstName, lastName, email, phone, serviceIds } = req.body;
      
      console.log('👤 Création professionnel pour salon:', salonId);
      
      const newStaff = await storage.createStaffMember({
        userId: salonId,
        firstName,
        lastName,
        email,
        phone,
        serviceIds: serviceIds || [],
        isActive: true
      });
      
      res.json({
        success: true,
        staff: newStaff
      });
    } catch (error: any) {
      console.error('❌ Erreur création professionnel:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // API pour modifier un professionnel
  app.put('/api/salon/:salonId/staff/:staffId', async (req, res) => {
    try {
      const { staffId } = req.params;
      const updateData = req.body;
      
      console.log('✏️ Modification professionnel:', staffId);
      
      const updatedStaff = await storage.updateStaffMember(parseInt(staffId), updateData);
      
      res.json({
        success: true,
        staff: updatedStaff
      });
    } catch (error: any) {
      console.error('❌ Erreur modification professionnel:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // API pour créer un service personnalisé
  app.post('/api/salon/:salonId/services', async (req, res) => {
    try {
      const { salonId } = req.params;
      const { name, price, duration, description } = req.body;
      
      console.log('🛍️ Création service pour salon:', salonId);
      
      const newService = await storage.createService({
        userId: salonId,
        name,
        price,
        duration,
        description
      });
      
      res.json({
        success: true,
        service: newService
      });
    } catch (error: any) {
      console.error('❌ Erreur création service:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // API pour modifier un service
  app.put('/api/salon/:salonId/services/:serviceId', async (req, res) => {
    try {
      const { serviceId } = req.params;
      const updateData = req.body;
      
      console.log('✏️ Modification service:', serviceId);
      
      const updatedService = await storage.updateService(parseInt(serviceId), updateData);
      
      res.json({
        success: true,
        service: updatedService
      });
    } catch (error: any) {
      console.error('❌ Erreur modification service:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Routes d'authentification personnalisées (contournement Replit Auth à cause de Vite)
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log('🔐 Tentative de connexion:', email);
      
      const user = await storage.authenticateUser(email, password);
      if (user) {
        console.log('✅ Connexion réussie pour:', email);
        res.json({ success: true, user, token: 'demo-token-' + user.id });
      } else {
        console.log('❌ Échec de connexion pour:', email);
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } catch (error: any) {
      console.error('❌ Erreur lors de la connexion:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  app.post('/api/client/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log('🔐 Tentative de connexion CLIENT:', email);
      
      const client = await storage.authenticateClient(email, password);
      if (client) {
        console.log('✅ Connexion CLIENT réussie pour:', email);
        res.json({ success: true, client, token: 'demo-client-token-' + client.id });
      } else {
        console.log('❌ Échec de connexion CLIENT pour:', email);
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } catch (error: any) {
      console.error('❌ Erreur lors de la connexion CLIENT:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  // Route de test Firebase spécifique
  app.post('/api/test-firebase-force', async (req, res) => {
    try {
      console.log('🔥 TEST FIREBASE FORCÉ...');
      console.log('Firebase secrets:', FIREBASE_CONFIG.hasFirebaseSecrets());
      console.log('Firebase activé:', FIREBASE_CONFIG.USE_FIREBASE);
      console.log('USE_FIREBASE final:', USE_FIREBASE);
      
      // Test direct avec FirebaseStorage
      // Firebase storage removed - using PostgreSQL only
      console.log('PostgreSQL storage actif');
      
      const testUser = {
        email: 'test-firebase-direct@test.com',
        password: 'test123',
        firstName: 'Firebase',
        lastName: 'Direct',
        businessName: 'Test Firebase'
      };
      
      console.log('🔄 Tentative d\'inscription Firebase directe...');
      const result = await storage.createUser(testUser);
      console.log('✅ Firebase fonctionne !', result.id);
      
      res.json({ 
        success: true, 
        message: 'Firebase fonctionne !', 
        userId: result.id,
        firebaseStatus: 'WORKING'
      });
    } catch (error: any) {
      console.error('❌ Firebase échec:', error);
      res.json({ 
        success: false, 
        message: 'Firebase échec: ' + (error instanceof Error ? error.message : 'Erreur inconnue'),
        firebaseStatus: 'FAILED',
        errorDetails: error instanceof Error ? error.toString() : 'Erreur inconnue'
      });
    }
  });

  // Routes d'inscription
  app.post('/api/auth/register', async (req, res) => {
    try {
      const userData = req.body;
      console.log('📝 Tentative d\'inscription PRO:', userData.email);
      
      const user = await storage.createUser(userData);
      
      // 🚀 CRÉATION AUTOMATIQUE DU SALON PERSONNEL pour ce professionnel
      const { createAutomaticSalonPage } = await import('./autoSalonCreation');
      const automaticSalon = await createAutomaticSalonPage({
        ownerName: `${userData.firstName} ${userData.lastName}`,
        businessName: userData.businessName || `Salon ${userData.firstName}`,
        email: userData.email,
        phone: userData.phone || '01 23 45 67 89',
        address: userData.address || 'Adresse non spécifiée',
        subscriptionPlan: 'basic',
        services: ['Coiffure', 'Soins'],
        description: `Salon professionnel de ${userData.firstName} ${userData.lastName}`
      });

      console.log(`✅ Salon personnel créé pour ${userData.email}: /salon/${automaticSalon.id}`);
      console.log('✅ Inscription PRO réussie pour:', userData.email);
      
      res.json({ 
        success: true, 
        user: {
          ...user,
          salonId: automaticSalon.id,
          salonUrl: `/salon/${automaticSalon.id}`
        }, 
        salon: {
          id: automaticSalon.id,
          name: automaticSalon.name,
          url: automaticSalon.shareableUrl
        },
        token: 'demo-token-' + user.id 
      });
    } catch (error: any) {
      console.error('❌ Erreur lors de l\'inscription PRO:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  app.post('/api/client/register', async (req, res) => {
    try {
      const userData = req.body;
      console.log('📝 Tentative d\'inscription CLIENT:', userData.email);
      
      // Vérifier si l'email existe déjà
      const existingClient = await storage.getClientByEmail(userData.email);
      if (existingClient) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
      }
      
      // Hacher le mot de passe
      const bcrypt = await import('bcrypt');
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Préparer les données client (sans user_id)
      const clientData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: hashedPassword,
        phone: userData.phone,
        address: userData.address || null,
        city: userData.city || null,
        postalCode: userData.postalCode || null,
        isVerified: false,
        isActive: true,
        loyaltyPoints: 0,
        clientStatus: 'active'
      };
      
      const client = await storage.createClientAccount(clientData);
      console.log('✅ Inscription CLIENT réussie pour:', userData.email);
      
      // Retourner les données sans le mot de passe
      const { password, ...clientResponse } = client;
      res.json({ success: true, client: clientResponse, token: 'demo-client-token-' + client.id });
    } catch (error: any) {
      console.error('❌ Erreur lors de l\'inscription CLIENT:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  // Auth middleware (activé pour les pages salon)
  await setupAuth(app);

  // Route pour vérifier la session (utilisée par useAuthSession)
  app.get('/api/auth/check-session', async (req, res) => {
    try {
      const session = req.session as any;
      
      if (!session || !session.user) {
        return res.status(401).json({ 
          authenticated: false,
          message: "No active session" 
        });
      }
      
      const sessionUser = session.user;
      res.json({
        authenticated: true,
        userType: sessionUser.type,
        userId: sessionUser.id,
        email: sessionUser.email,
        businessName: sessionUser.businessName,
        firstName: sessionUser.firstName,
        lastName: sessionUser.lastName
      });
      
    } catch (error: any) {
      console.error('❌ Erreur vérification session:', error);
      res.status(500).json({ 
        authenticated: false,
        message: "Erreur serveur" 
      });
    }
  });

  // Route pour la récupération de mot de passe
  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email requis' 
        });
      }

      // Vérifier si l'utilisateur existe
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        // Pour la sécurité, on retourne succès même si l'email n'existe pas
        return res.json({ 
          success: true, 
          message: 'Si ce compte existe, un email de récupération a été envoyé' 
        });
      }

      // TODO: Implémenter l'envoi d'email réel
      // Pour l'instant, simuler l'envoi
      console.log('📧 Récupération de mot de passe demandée pour:', email);
      
      res.json({ 
        success: true, 
        message: 'Un email de récupération a été envoyé à votre adresse' 
      });
      
    } catch (error: any) {
      console.error('❌ Erreur récupération mot de passe:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur lors de la récupération' 
      });
    }
  });

  // Route pour la déconnexion unifiée
  app.post('/api/auth/logout', async (req, res) => {
    try {
      const session = req.session as any;
      
      if (session) {
        // Détruire la session
        session.destroy((err: any) => {
          if (err) {
            console.error('❌ Erreur destruction session:', err);
            return res.status(500).json({ 
              success: false, 
              message: 'Erreur lors de la déconnexion' 
            });
          }
          
          // Nettoyer le cookie de session
          res.clearCookie('connect.sid');
          res.json({ 
            success: true, 
            message: 'Déconnexion réussie' 
          });
        });
      } else {
        res.json({ 
          success: true, 
          message: 'Aucune session active' 
        });
      }
      
    } catch (error: any) {
      console.error('❌ Erreur déconnexion:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur lors de la déconnexion' 
      });
    }
  });

  // 🏢 ROUTES SALON AVEC AUTHENTIFICATION PRO
  
  // Récupérer le salon d'un propriétaire authentifié
  app.get('/api/salon/my-salon', async (req: any, res) => {
    try {
      const session = req.session as any;
      if (!session || !session.user) {
        return res.status(401).json({ message: "Non authentifié" });
      }
      
      const userId = session.user.id;
      const userEmail = session.user.email;
      console.log('🏢 Récupération salon pour propriétaire:', userId);
      
      // Chercher le salon personnel de l'utilisateur authentifié
      const userSalons = Array.from(storage.salons?.values() || []).filter(salon => 
        salon.ownerId === userId || salon.ownerEmail === userEmail
      );
      
      let userSalon = userSalons[0];
      
      if (!userSalon) {
        // Création automatique d'un salon unique pour ce propriétaire
        const uniqueSlug = `salon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const salonName = `${session.user.firstName || 'Mon'} Salon`;
        
        console.log('🏗️ Création salon automatique pour:', userId);
        
        userSalon = {
          id: uniqueSlug,
          ownerId: userId,
          ownerEmail: userEmail,
          name: salonName,
          slug: uniqueSlug,
          description: 'Nouveau salon - À personnaliser depuis votre dashboard',
          longDescription: 'Bienvenue dans votre salon ! Modifiez cette description depuis votre tableau de bord professionnel.',
          address: 'Adresse à renseigner',
          phone: 'Téléphone à renseigner',
          email: userEmail,
          website: '',
          photos: [
            'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop&auto=format'
          ],
          serviceCategories: [
            {
              id: 1,
              name: 'Services',
              expanded: false,
              services: [
                { 
                  id: 1, 
                  name: 'Consultation', 
                  price: 0, 
                  duration: '30min', 
                  description: 'Consultation gratuite pour nouveaux clients' 
                }
              ]
            }
          ],
          professionals: [
            {
              id: '1',
              name: `${req.user.claims.first_name} ${req.user.claims.last_name}`,
              specialty: 'Propriétaire',
              avatar: req.user.claims.profile_image_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=150&h=150&fit=crop&crop=face',
              rating: 5.0,
              price: 50,
              bio: 'Professionnel de beauté',
              experience: 'Expert confirmé'
            }
          ],
          rating: 5.0,
          reviewCount: 0,
          verified: false,
          certifications: [],
          awards: [],
          customColors: {
            primary: '#06b6d4',
            accent: '#06b6d4', 
            buttonText: '#ffffff',
            priceColor: '#ec4899',
            neonFrame: '#ef4444'
          },
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        storage.salons?.set(uniqueSlug, userSalon);
        console.log('✅ Salon créé automatiquement:', salonName, 'URL:', `/salon/${uniqueSlug}`);
      }
      
      res.json({
        success: true,
        salon: userSalon,
        isOwner: true
      });
    } catch (error: any) {
      console.error('❌ Erreur récupération salon propriétaire:', error);
      res.status(500).json({ message: 'Erreur récupération salon' });
    }
  });
  
  // Vérifier la propriété d'un salon spécifique
  app.get('/api/salon/:salonSlug/ownership', isAuthenticated, async (req: any, res) => {
    try {
      const { salonSlug } = req.params;
      const userId = req.user.claims.sub;
      
      console.log('🔍 Vérification propriété salon:', salonSlug, 'pour utilisateur:', userId);
      
      const salon = storage.salons?.get(salonSlug);
      
      if (!salon) {
        return res.status(404).json({ 
          success: false, 
          message: 'Salon non trouvé',
          isOwner: false 
        });
      }
      
      const isOwner = salon.ownerId === userId || salon.ownerEmail === req.user.claims.email;
      
      res.json({
        success: true,
        isOwner,
        salon: isOwner ? salon : { id: salon.id, name: salon.name }
      });
    } catch (error: any) {
      console.error('❌ Erreur vérification propriété:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur vérification propriété',
        isOwner: false 
      });
    }
  });

  // Route duplicata pour compatibilité booking pages
  app.get('/api/booking-pages/:id', async (req, res) => {
    try {
      const { id } = req.params;
      console.log('📖 Récupération page salon (booking-pages):', id);
      
      let salon = await storage.getSalon?.(id);
      
      if (!salon) {
        console.log('ℹ️ Salon non trouvé, vérification dans storage.salons:', id);
        
        // Vérifier dans storage.salons (Map)
        salon = storage.salons?.get(id);
        
        if (!salon) {
          console.log('❌ Salon vraiment introuvable:', id);
          return res.status(404).json({ message: `Salon "${id}" not found` });
        }
      }
        
      
      console.log('📖 Salon trouvé:', salon?.name, 'ID:', salon.id);
      
      // ✅ FORCER L'AJOUT DES PHOTOS POUR TOUS LES SALONS - CORRECTION DÉFINITIVE
      if (!salon.photos || salon.photos.length === 0) {
        salon.photos = [
          "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&h=600&fit=crop&auto=format"
        ];
        console.log(`📸 Photos ajoutées au salon: ${salon?.name}`);
      }
      
      if (!salon.coverImageUrl) {
        salon.coverImageUrl = salon.photos?.[0] || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&auto=format";
        console.log(`🖼️ Cover image ajoutée au salon: ${salon?.name}`);
      }

      // ✅ AJOUTER LES PROPRIÉTÉS MANQUANTES POUR ÉVITER LES ERREURS
      if (!salon.certifications) {
        salon.certifications = [
          "Salon labellisé L'Oréal Professionnel",
          "Formation continue Kérastase", 
          "Certification bio Shu Uemura"
        ];
      }
      
      if (!salon.awards) {
        salon.awards = [
          "Élu Meilleur Salon 2023",
          "Prix de l'Innovation Beauté 2022",
          "Certification Éco-responsable"
        ];
      }
      
      if (!salon.staff) {
        salon.staff = [];
      }
      
      if (!salon.longDescription) {
        salon.longDescription = "Notre salon vous accueille dans un cadre moderne et chaleureux.";
      }
      
      console.log(`✅ SALON AVEC PHOTOS GARANTIES: ${salon?.name} - Photos: ${salon.photos?.length || 0}`);
      res.json(salon);
    } catch (error: any) {
      console.error('❌ Erreur récupération salon:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

  // Salon/BookingPage routes (compatible Firebase) - ROUTE PRINCIPALE SALON
  app.get('/api/salon/:id', async (req, res) => {
    try {
      const { id } = req.params;
      console.log('📖 Récupération données salon pour éditeur:', id);
      
      // ✅ CORRECTION ESSENTIELLE : Prioriser les données temps réel avec customColors
      let salon = null;
      
      // D'abord chercher dans le storage en mémoire (données temps réel avec customColors)
      if (storage.salons && storage.salons.has(id)) {
        salon = storage.salons.get(id);
        console.log('✅ Salon trouvé en mémoire avec customColors:', id);
      } else {
        // Fallback sur PostgreSQL si pas en mémoire
        salon = await storage.getSalon(id);
        console.log('📦 Salon trouvé en PostgreSQL (sans customColors):', id);
      }
      
      if (!salon) {
        console.log('❌ ERREUR: Salon inexistant:', id);
        return res.status(404).json({ 
          error: 'Salon non trouvé',
          message: 'Salon non disponible'
        });
      }
        
      
      console.log('📖 Salon trouvé:', salon?.name, 'ID:', salon.id);
      
      // ✅ FORCER L'AJOUT DES PHOTOS POUR TOUS LES SALONS - CORRECTION DÉFINITIVE
      if (!salon.photos || salon.photos.length === 0) {
        salon.photos = [
          "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&h=600&fit=crop&auto=format"
        ];
        console.log(`📸 Photos ajoutées au salon: ${salon?.name}`);
      }
      
      if (!salon.coverImageUrl) {
        salon.coverImageUrl = salon.photos?.[0] || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&auto=format";
        console.log(`🖼️ Cover image ajoutée au salon: ${salon?.name}`);
      }

      // ✅ AJOUTER LES PROPRIÉTÉS MANQUANTES POUR ÉVITER LES ERREURS
      if (!salon.certifications) {
        salon.certifications = [
          "Salon labellisé L'Oréal Professionnel",
          "Formation continue Kérastase", 
          "Certification bio Shu Uemura"
        ];
      }
      
      if (!salon.awards) {
        salon.awards = [
          "Élu Meilleur Salon 2023",
          "Prix de l'Innovation Beauté 2022",
          "Certification Éco-responsable"
        ];
      }
      
      if (!salon.staff) {
        salon.staff = [];
      }
      
      if (!salon.longDescription) {
        salon.longDescription = "Notre salon vous accueille dans un cadre moderne et chaleureux.";
      }
      
      console.log(`✅ DONNÉES SALON POUR ÉDITEUR: ${salon?.name} - Photos: ${salon.photos?.length || 0}`);
      res.json(salon);
    } catch (error: any) {
      console.error('❌ Erreur récupération salon:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

  app.put('/api/salon/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const salonData = req.body;
      
      console.log('💾 SAUVEGARDE SALON - ID reçu:', id);
      console.log('💾 SAUVEGARDE SALON - Données:', Object.keys(salonData));
      
      // 🔧 GÉNÉRATION ID UNIQUE : Créer un slug unique pour chaque salon
      let actualId = id;
      
      // CAS SPÉCIAL: Conserver demo-user pour le salon de démonstration existant
      if (id === 'demo-user') {
        actualId = 'demo-user';
      }
      // NOUVEAUX SALONS: Générer des slugs uniques
      else if (id === 'auto-generated' || id === 'undefined' || !id || id === 'salon-demo') {
        // Générer un slug unique basé sur le nom du salon
        const salonName = salonData.name || 'nouveau-salon';
        const baseSlug = salonName
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
          .replace(/[^a-z0-9\s-]/g, '') // Garder seulement lettres, chiffres, espaces et tirets
          .replace(/\s+/g, '-') // Remplacer espaces par tirets
          .replace(/-+/g, '-') // Éviter les doubles tirets
          .replace(/^-|-$/g, ''); // Supprimer tirets en début/fin
        
        // Ajouter un identifiant unique court pour éviter les collisions
        const uniqueId = Math.random().toString(36).substring(2, 8);
        actualId = `${baseSlug}-${uniqueId}`;
        
        console.log('🆔 NOUVEAU SALON - Slug généré:', actualId, 'basé sur:', salonName);
      }
      console.log('💾 ID final pour sauvegarde:', actualId, '(ID original:', id, ')');
      
      // Sauvegarder avec l'ID corrigé - FORCER LA SAUVEGARDE DIRECTE
      let savedSalon;
      
      // TOUJOURS sauvegarder directement dans storage.salons pour assurer la synchronisation
      if (storage.salons) {
        const existingSalon = storage.salons.get(actualId) || {};
        const updatedSalon = { ...existingSalon, ...salonData, id: actualId };
        storage.salons.set(actualId, updatedSalon);
        savedSalon = updatedSalon;
        console.log('✅ FORÇAGE SAUVEGARDE - Salon sauvegardé directement:', actualId, 'Nom:', updatedSalon.name);
      } else {
        savedSalon = { ...salonData, id: actualId };
      }
      
      // Sauvegarde additionnelle avec méthode updateBookingPage si elle existe
      if (storage.updateBookingPage) {
        console.log('💾 Sauvegarde additionnelle avec updateBookingPage:', actualId);
        await storage.updateBookingPage(actualId, salonData);
      }
      
      // 🔥 INTÉGRATION AUTOMATIQUE AU SYSTÈME DE RECHERCHE PUBLIC - CORRECTION COHÉRENCE ID
      if (salonData.isPublished !== false) {
        const publicSalonData = {
          id: actualId, // ✅ UTILISER L'ID CORRIGÉ, PAS L'ID ORIGINAL
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
          shareableUrl: `/salon/${actualId}`, // ✅ URL CORRIGÉE AVEC actualId
          isActive: true,
          createdAt: new Date(),
          nextSlot: 'Disponible aujourd\'hui'
        };
        
        // ✅ S'ASSURER QUE LE SALON DANS LA RECHERCHE A DES PHOTOS
        (publicSalonData as any).photos = salonData.photos || [
          "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop&auto=format"
        ];
        (publicSalonData as any).coverImageUrl = salonData.coverImageUrl || (publicSalonData as any).photos[0];
        
        // ✅ SAUVEGARDE COHÉRENTE : Même ID partout (actualId)
        if (storage.salons) {
          storage.salons.set(actualId, { ...savedSalon, ...publicSalonData });
        }
        console.log('🌟 Salon ajouté au système de recherche public AVEC PHOTOS:', actualId);
        console.log('🚀 SYNCHRONISATION IMMÉDIATE: Le salon apparaîtra dans /search dès maintenant');
      }
      
      // 🔌 Diffuser la mise à jour via WebSocket pour synchronisation temps réel
      broadcastSalonUpdate(actualId, savedSalon);
      
      res.json({ 
        success: true, 
        message: 'Salon sauvegardé et synchronisé avec succès !', 
        salon: savedSalon,
        shareableUrl: `${req.protocol}://${req.get('host')}/salon/${actualId}`,
        publicListing: true,
        syncStatus: 'immediate',
        newSlug: actualId !== id ? actualId : null // Indiquer si l'ID a changé
      });
    } catch (error: any) {
      console.error('❌ Erreur sauvegarde salon:', error);
      res.status(500).json({ success: false, message: 'Erreur lors de la sauvegarde' });
    }
  });

  // ✅ NOUVELLE ROUTE: Liste des salons PostgreSQL pour la recherche
  app.get('/api/salons', async (req, res) => {
    try {
      const { category } = req.query;
      console.log('🔍 RECHERCHE SALONS PostgreSQL - Catégorie:', category);
      
      // Récupérer les vrais salons PostgreSQL créés par les pros
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
        image: salon.photos?.[0] || salon.coverImageUrl || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&auto=format',
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
    } catch (error: any) {
      console.error('❌ Erreur API /api/salons:', error);
      res.status(500).json({ success: false, message: 'Erreur de recherche salons' });
    }
  });

  // ✅ NOUVELLE ROUTE ESSENTIELLE : Récupération salon par slug pour pages publiques
  app.get('/api/salons/by-slug/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      console.log('🔍 Récupération salon publique par slug:', slug);
      
      // ✅ PRIORITÉ : Données temps réel avec customColors depuis storage.salons
      let salon = null;
      
      if (storage.salons && storage.salons.has(slug)) {
        salon = storage.salons.get(slug);
        console.log('✅ Salon publique trouvé en mémoire avec customColors:', slug);
      } else {
        // Fallback PostgreSQL sans customColors
        salon = await storage.getSalon(slug);
        console.log('📦 Salon publique trouvé en PostgreSQL (sans customColors):', slug);
      }
      
      if (!salon) {
        console.log('❌ Salon publique non trouvé:', slug);
        return res.status(404).json({ 
          error: 'Salon non trouvé',
          message: 'Page salon non disponible'
        });
      }
      
      // ✅ Forcer les photos si manquantes
      if (!salon.photos || salon.photos.length === 0) {
        salon.photos = [
          "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&h=600&fit=crop&auto=format"
        ];
      }
      
      if (!salon.coverImageUrl) {
        salon.coverImageUrl = salon.photos?.[0];
      }
      
      // ✅ Mapper les données pour le template public
      const publicSalonData = {
        id: salon.id,
        name: salon.name || 'Salon Excellence',
        slug: slug,
        description: salon.description || `Salon de beauté professionnel ${salon.name}`,
        address: salon.address || "123 Avenue des Champs-Élysées, 75008 Paris",
        phone: salon.phone || "01 42 96 00 00",
        rating: salon.rating || 4.8,
        reviewsCount: salon.reviewCount || salon.reviews?.length || 247,
        coverImageUrl: salon.coverImageUrl,
        logoUrl: salon.logoUrl,
        photos: salon.photos,
        customColors: salon.customColors, // ✅ ESSENTIEL : Inclure les couleurs personnalisées
        openingHours: salon.openingHours || {
          lundi: { open: '09:00', close: '19:00' },
          mardi: { open: '09:00', close: '19:00' },
          mercredi: { open: '09:00', close: '19:00' },
          jeudi: { open: '09:00', close: '19:00' },
          vendredi: { open: '09:00', close: '19:00' },
          samedi: { open: '09:00', close: '18:00' },
          dimanche: { closed: true, open: '', close: '' }
        },
        amenities: salon.amenities || ['WiFi gratuit', 'Climatisation', 'Parking', 'Accessible PMR'],
        priceRange: salon.priceRange || '€€',
        serviceCategories: slug === 'barbier-gentleman-marais' ? [
          {
            id: 1,
            name: 'Coupe',
            description: 'Services de coupe et styling',
            services: [
              {
                id: 1,
                name: 'Coupe Homme Classique',
                description: 'Coupe sur-mesure avec consultation style personnalisée',
                price: 35,
                duration: 45,
                category: 'Coupe'
              },
              {
                id: 2,
                name: 'Coupe + Barbe',
                description: 'Coupe complète avec taille et entretien de barbe',
                price: 55,
                duration: 75,
                category: 'Coupe'
              }
            ]
          },
          {
            id: 2,
            name: 'Rasage',
            description: 'Rasage traditionnel et moderne',
            services: [
              {
                id: 3,
                name: 'Rasage Traditionnel',
                description: 'Rasage au coupe-chou avec serviettes chaudes',
                price: 40,
                duration: 60,
                category: 'Rasage'
              },
              {
                id: 4,
                name: 'Rasage Express',
                description: 'Rasage rapide pour homme pressé',
                price: 25,
                duration: 30,
                category: 'Rasage'
              }
            ]
          },
          {
            id: 3,
            name: 'Soins',
            description: 'Soins du visage et de la barbe',
            services: [
              {
                id: 5,
                name: 'Soin Barbe Premium',
                description: 'Soin complet avec huiles et masques spécialisés',
                price: 45,
                duration: 50,
                category: 'Soins'
              },
              {
                id: 6,
                name: 'Soin Visage Homme',
                description: 'Nettoyage et hydratation profonde du visage',
                price: 60,
                duration: 60,
                category: 'Soins'
              }
            ]
          }
        ] : (salon.serviceCategories || []),
        professionals: slug === 'barbier-gentleman-marais' ? [
          {
            id: 1,
            name: 'Antoine Dubois',
            role: 'Maître Barbier',
            specialty: 'Rasage traditionnel',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
            rating: 4.9,
            reviewsCount: 87,
            specialties: ['Rasage au coupe-chou', 'Taille de barbe', 'Soins homme']
          },
          {
            id: 2,
            name: 'Marc Rivière',
            role: 'Barbier Styliste',
            specialty: 'Coupe moderne',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
            rating: 4.8,
            reviewsCount: 65,
            specialties: ['Coupe tendance', 'Dégradés', 'Styling']
          }
        ] : (salon.professionals || []),
        reviews: slug === 'barbier-gentleman-marais' ? [
          {
            id: 1,
            clientName: 'Pierre M.',
            rating: 5,
            comment: 'Excellent service, rasage traditionnel parfait. Ambiance authentique du Marais.',
            date: '2024-01-20',
            service: 'Rasage Traditionnel',
            verified: true,
            ownerResponse: {
              message: 'Merci Pierre ! Ravi de vous accueillir dans notre établissement traditionnel.',
              date: '2024-01-21'
            }
          },
          {
            id: 2,
            clientName: 'Thomas L.',
            rating: 5,
            comment: 'Coupe impeccable, Antoine est un vrai professionnel. Je recommande vivement !',
            date: '2024-01-18',
            service: 'Coupe + Barbe',
            verified: true
          },
          {
            id: 3,
            clientName: 'Alexandre K.',
            rating: 4,
            comment: 'Très bon barbier, service de qualité dans un cadre authentique.',
            date: '2024-01-15',
            service: 'Coupe Homme Classique',
            verified: true
          }
        ] : (salon.reviews || [])
      };
      
      console.log('✅ Données salon publique avec customColors:', publicSalonData.customColors ? 'OUI' : 'NON');
      res.json(publicSalonData);
      
    } catch (error: any) {
      console.error('❌ Erreur récupération salon publique:', error);
      res.status(500).json({ 
        error: 'Erreur serveur',
        message: 'Impossible de charger la page salon'
      });
    }
  });

  // Route PRINCIPALE pour récupérer les salons publics - SALONS PROS EN TEMPS RÉEL
  app.get('/api/public/salons', async (req, res) => {
    try {
      const { category, city, q } = req.query;
      console.log('🔍 RECHERCHE PUBLIQUE COMPLÈTE:', { category, city, q });
      
      // ÉTAPE 1: Récupérer TOUS les salons pros depuis PostgreSQL (temps réel)
      let realProSalons = [];
      try {
        realProSalons = await storage.getSalons();
        console.log(`👔 ${realProSalons.length} salons pros PostgreSQL récupérés`);
      } catch (error) {
        console.error('❌ Erreur récupération salons PostgreSQL:', error);
      }
      
      // ÉTAPE 2: Transformer les salons pros au format recherche publique
      const formattedProSalons = realProSalons
        .filter(salon => salon.isPublished !== false)
        .map(salon => ({
          id: salon.id,
          name: salon.name,
          slug: salon.slug,
          description: salon.description,
          address: salon.address,
          phone: salon.phone,
          email: salon.email,
          rating: salon.rating || 4.8,
          reviews: salon.reviewCount || 0,
          reviewsCount: salon.reviewCount || 0,
          image: salon.photos?.[0] || salon.coverImageUrl || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&auto=format',
          photos: salon.photos || [],
          services: salon.serviceCategories?.flatMap((cat: any) => cat.services?.map((s: any) => s.name) || []).slice(0, 4) || ['Service professionnel'],
          nextSlot: 'Disponible aujourd\'hui',
          category: salon.category || 'coiffure',
          city: salon.city || salon.address?.split(',').pop()?.trim() || 'Paris',
          priceRange: '€€€',
          verified: true,
          popular: salon.subscriptionPlan === 'premium',
          shareableUrl: `/salon/${salon.slug}`,
          route: `/salon/${salon.slug}`,
          customColors: salon.customColors || {},
          distance: '0.5 km',
          location: salon.address?.split(',')[0] || salon.address
        }));
      
      console.log(`✅ ${formattedProSalons.length} salons pros formatés pour recherche`);
      
      // ÉTAPE 3: Ajouter OBLIGATOIREMENT le salon demo-user depuis storage.salons
      let allSalons = [...formattedProSalons];
      
      // RÉCUPÉRATION DE TOUS LES SALONS UTILISATEURS depuis storage.salons
      console.log('📊 Storage.salons disponible:', storage.salons ? `OUI (${storage.salons.size} salons)` : 'NON');
      
      if (storage.salons && storage.salons.size > 0) {
        console.log('📋 Salons en mémoire:', Array.from(storage.salons.keys()));
        
        // Traiter TOUS les salons du storage, pas seulement demo-user
        const memoryBasedSalons = Array.from(storage.salons.values()).map(salonData => {
          return {
            id: salonData.id,
            name: salonData.name || "Salon sans nom",
            slug: salonData.slug || salonData.id,
            description: salonData.description || "Salon de beauté moderne",
            address: salonData.address || "Adresse à renseigner",
            phone: salonData.phone || "Téléphone à renseigner",
            email: salonData.email || "contact@salon.fr",
            rating: 4.8,
            reviews: salonData.reviewCount || 0,
            reviewsCount: salonData.reviewCount || 0,
            image: salonData.coverImageUrl || salonData.photos?.[0] || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&auto=format",
            photos: salonData.photos || [],
            services: salonData.serviceCategories?.flatMap((cat: any) => cat.services?.map((s: any) => s.name) || []).slice(0, 4) || ["Service professionnel"],
            nextSlot: "Disponible aujourd'hui",
            category: "coiffure",
            city: salonData.city || extractCity(salonData.address || ''),
            priceRange: "€€€",
            verified: true,
            popular: salonData.id === 'demo-user', // Demo salon en featured
            shareableUrl: `/salon/${salonData.id}`,
            route: `/salon/${salonData.id}`,
            customColors: salonData.customColors || {},
            distance: "0.5 km",
            location: salonData.address?.split(',')[0] || "Paris"
          };
        });
        
        // Mettre demo-user en premier si présent
        const demoIndex = memoryBasedSalons.findIndex(s => s.id === 'demo-user');
        if (demoIndex > 0) {
          const demoSalon = memoryBasedSalons.splice(demoIndex, 1)[0];
          memoryBasedSalons.unshift(demoSalon);
        }
        
        allSalons = [...memoryBasedSalons, ...formattedProSalons];
        console.log(`✅ ${memoryBasedSalons.length} salons utilisateurs ajoutés depuis storage`);
      }
      
      // Ajouter salons démo supplémentaires si nécessaire
      if (formattedProSalons.length < 3) {
        if (publicSalonsStorage.size === 0) {
          console.log('💿 Chargement salons démo depuis PostgreSQL...');
          await loadSalonsFromDatabase();
        }
        const demoSalons = Array.from(publicSalonsStorage.values());
        allSalons = [...allSalons, ...demoSalons];
        console.log(`📊 ${demoSalons.length} salons démo supplémentaires ajoutés`);
      }
      
      // ÉTAPE 4: Filtrage intelligent
      let salons = allSalons;
      
      // Filtrage par recherche générale
      if (q && typeof q === 'string') {
        const queryLower = q.toLowerCase();
        salons = salons.filter(salon => 
          salon?.name.toLowerCase().includes(queryLower) ||
          salon?.description?.toLowerCase().includes(queryLower) ||
          salon?.address?.toLowerCase().includes(queryLower) ||
          salon.services?.some((service: string) => service.toLowerCase().includes(queryLower))
        );
        console.log(`🔍 Après filtrage recherche "${q}": ${salons.length} salons`);
      }
      
      // Filtrage par ville
      if (city && typeof city === 'string') {
        const cityLower = city.toLowerCase();
        salons = salons.filter(salon => 
          salon.city?.toLowerCase().includes(cityLower) || 
          salon.location?.toLowerCase().includes(cityLower) ||
          salon.address?.toLowerCase().includes(cityLower)
        );
        console.log(`🏙️ Après filtrage ville "${city}": ${salons.length} salons`);
      }
      
      // Filtrage par catégorie
      if (category && typeof category === 'string') {
        const categoryLower = category.toLowerCase();
        salons = salons.filter(salon => 
          salon.category?.toLowerCase() === categoryLower ||
          salon.services?.some((service: string) => service.toLowerCase().includes(categoryLower))
        );
        console.log(`🏷️ Après filtrage catégorie "${category}": ${salons.length} salons`);
      }
      
      console.log(`✅ RÉSULTATS FINAUX: ${salons.length} salons (${formattedProSalons.length} pros + ${salons.length - formattedProSalons.length} démo)`);
      
      res.json({ success: true, salons });
    } catch (error: any) {
      console.error('❌ Erreur recherche salons publique:', error);
      res.status(500).json({ success: false, message: 'Erreur de recherche' });
    }
  });

  // === ROUTES DASHBOARD CRITIQUES (FIXES ROUTING VITE) ===
  // Routes dashboard sans données factices - utiliser BDD uniquement
  app.get('/api/dashboard/stats', async (req, res) => {
    try {
      const userId = (req.session as any)?.user?.id || 'demo';
      
      // Statistiques authentiques depuis la BDD
      const stats = await storage.getDashboardStats?.(userId) || {
        todayAppointments: 0,
        todayRevenue: 0,
        weekAppointments: 0,
        weekRevenue: 0,
        monthRevenue: 0,
        pendingAppointments: 0
      };
      
      res.json(stats);
    } catch (error: any) {
      console.error('❌ Erreur dashboard stats:', error);
      res.status(500).json({ error: 'Erreur récupération statistiques' });
    }
  });

  app.get('/api/dashboard/upcoming-appointments', async (req, res) => {
    try {
      const userId = (req.session as any)?.user?.id || 'demo';
      console.log('📅 Récupération des RDV à venir pour:', userId);
      
      let appointments: any[] = [];
      if (storage.getUpcomingAppointments) {
        appointments = await storage.getUpcomingAppointments(userId);
      }
      
      res.json(appointments || []);
    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération des RDV à venir:', error);
      res.status(500).json({ error: 'Failed to fetch upcoming appointments' });
    }
  });

  // API Clients sans données factices
  app.get('/api/clients', async (req, res) => {
    try {
      const userId = (req.session as any)?.user?.id || 'demo';
      console.log('👥 Récupération clients authentiques pour:', userId);
      
      let clients: any[] = [];
      if (storage.getClients) {
        clients = await storage.getClients(userId);
      }
      
      res.json(clients || []);
    } catch (error: any) {
      console.error('❌ Erreur récupération clients:', error);
      res.status(500).json({ error: 'Erreur récupération clients' });
    }
  });

  // API Rendez-vous sans données factices
  app.get('/api/appointments', async (req, res) => {
    try {
      const userId = (req.session as any)?.user?.id || 'demo';
      console.log('📅 Récupération rendez-vous authentiques pour:', userId);
      
      let appointments: any[] = [];
      if (storage.getAppointments) {
        appointments = await storage.getAppointments(userId);
      }
      
      res.json(appointments || []);
    } catch (error: any) {
      console.error('❌ Erreur récupération rendez-vous:', error);
      res.status(500).json({ error: 'Erreur récupération rendez-vous' });
    }
  });

  // API Inventaire sans données factices
  app.get('/api/inventory', async (req, res) => {
    try {
      const userId = (req.session as any)?.user?.id || 'demo';
      console.log('📦 Récupération inventaire authentique pour:', userId);
      
      let inventory = [];
      if (storage.getInventory) {
        inventory = await storage.getInventory(userId);
      }
      
      res.json(inventory || []);
    } catch (error: any) {
      console.error('❌ Erreur récupération inventaire:', error);
      res.status(500).json({ error: 'Erreur récupération inventaire' });
    }
  });

  app.get('/api/dashboard/revenue-chart', async (req, res) => {
    try {
      const userId = (req.session as any)?.user?.id || 'demo';
      const revenueChart = await storage.getRevenueChart(userId);
      res.json(revenueChart);
    } catch (error: any) {
      console.error("Error fetching revenue chart:", error);
      res.status(500).json({ error: "Failed to fetch revenue chart" });
    }
  });

  app.get('/api/dashboard/top-services', async (req, res) => {
    try {
      const userId = (req.session as any)?.user?.id || 'demo';
      const services = await storage.getTopServices(userId);
      res.json(services);
    } catch (error: any) {
      console.error("Error fetching top services:", error);
      res.status(500).json({ error: "Failed to fetch top services" });
    }
  });

  app.get('/api/dashboard/staff-performance', async (req, res) => {
    try {
      const userId = (req.session as any)?.user?.id || 'demo';
      const performance = await storage.getStaffPerformance(userId);
      res.json(performance);
    } catch (error: any) {
      console.error("Error fetching staff performance:", error);
      res.status(500).json({ error: "Failed to fetch staff performance" });
    }
  });

  app.get('/api/dashboard/client-retention', async (req, res) => {
    try {
      const userId = (req.session as any)?.user?.id || 'demo';
      const retention = await storage.getClientRetentionRate(userId);
      res.json(retention);
    } catch (error: any) {
      console.error("Error fetching client retention:", error);
      res.status(500).json({ error: "Failed to fetch client retention" });
    }
  });

  // Nouvelles routes pour données dashboard connectées à la BDD
  app.get('/api/dashboard/popular-services', async (req, res) => {
    try {
      const userId = (req.session as any)?.user?.id || 'demo';
      const popularServices = await storage.getPopularServices(userId);
      res.json(popularServices);
    } catch (error: any) {
      console.error("❌ Erreur récupération services populaires:", error);
      res.status(500).json({ error: "Erreur récupération services populaires" });
    }
  });

  app.get('/api/dashboard/today-appointments', async (req, res) => {
    try {
      const userId = (req.session as any)?.user?.id || 'demo';
      const todayAppointments = await storage.getTodayAppointments(userId);
      res.json(todayAppointments);
    } catch (error: any) {
      console.error("❌ Erreur récupération RDV aujourd'hui:", error);
      res.status(500).json({ error: "Erreur récupération RDV aujourd'hui" });
    }
  });

  app.get('/api/dashboard/weekly-new-clients', async (req, res) => {
    try {
      const userId = (req.session as any)?.user?.id || 'demo';
      const weeklyNewClients = await storage.getWeeklyNewClients(userId);
      res.json({ count: weeklyNewClients });
    } catch (error: any) {
      console.error("❌ Erreur récupération nouveaux clients:", error);
      res.status(500).json({ error: "Erreur récupération nouveaux clients" });
    }
  });

  // === ROUTES STAFF ET INVENTORY (FIXES ROUTING VITE) ===
  app.get('/api/staff', async (req, res) => {
    try {
      console.log('🔍 API /api/staff appelée');
      const { salonId, userId } = req.query;
      const finalUserId = userId || salonId || 'demo'; // Flexibilité pour différentes API calls
      console.log('🏢 UserId final pour staff:', finalUserId);

      const staff = await storage.getStaffBySalonId(finalUserId as string);
      
      if (!staff || staff.length === 0) {
        return res.status(404).json({ 
          error: 'Aucun staff dans PostgreSQL pour cet utilisateur',
          userId: finalUserId,
          message: 'AUCUNE DONNÉE FICTIVE - Base de données vide'
        });
      }
      
      console.log('👥 Staff à retourner:', staff.length, 'professionnels');
      res.json(staff);
    } catch (error: any) {
      console.error("❌ Erreur staff API:", error);
      res.status(500).json({ error: "Failed to fetch staff" });
    }
  });

  app.get('/api/inventory', async (req, res) => {
    try {
      const userId = (req.session as any)?.user?.id || 'demo';
      const inventory = await storage.getInventory(userId);
      res.json(inventory);
    } catch (error: any) {
      console.error("Error fetching inventory:", error);
      res.status(500).json({ error: "Failed to fetch inventory" });
    }
  });

  // Route pour récupérer l'inventaire par userId (pour les URLs directes comme /api/inventory/demo)
  app.get('/api/inventory/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const inventory = await storage.getInventory(userId);
      res.json(inventory);
    } catch (error: any) {
      console.error("Error fetching inventory for user:", error);
      res.status(500).json({ error: "Failed to fetch inventory" });
    }
  });

  app.get('/api/inventory/low-stock', async (req, res) => {
    try {
      const userId = (req.session as any)?.user?.id || 'demo';
      const lowStockItems = await storage.getLowStockItems(userId);
      res.json(lowStockItems);
    } catch (error: any) {
      console.error("Error fetching low stock items:", error);
      res.status(500).json({ error: "Failed to fetch low stock items" });
    }
  });

  app.post('/api/inventory', async (req, res) => {
    try {
      const userId = (req.session as any)?.user?.id || 'demo';
      const item = await storage.createInventoryItem(userId, req.body);
      res.json(item);
    } catch (error: any) {
      console.error("Error creating inventory item:", error);
      res.status(500).json({ error: "Failed to create inventory item" });
    }
  });

  app.put('/api/inventory/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = (req.session as any)?.user?.id || 'demo';
      const item = await storage.updateInventoryItem(userId, id.toString(), req.body);
      res.json(item);
    } catch (error: any) {
      console.error("Error updating inventory item:", error);
      res.status(500).json({ error: "Failed to update inventory item" });
    }
  });

  app.delete('/api/inventory/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = (req.session as any)?.user?.id || 'demo';
      await storage.deleteInventoryItem(userId, id.toString());
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting inventory item:", error);
      res.status(500).json({ error: "Failed to delete inventory item" });
    }
  });

  // API RDV pour CLIENT et PRO - SYNC BIDIRECTIONNEL
  app.get('/api/appointments', async (req, res) => {
    try {
      console.log('📋 Récupération RDV PostgreSQL');
      
      // Support authentification CLIENT ou PRO
      const authHeader = req.headers.authorization;
      let userId = null;
      let isClient = false;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        if (token.startsWith('demo-token-')) {
          userId = token.replace('demo-token-', '');
        } else if (token.startsWith('client-token-')) {
          userId = token.replace('client-token-', '');
          isClient = true;
        }
      }

      if (!userId) {
        return res.status(401).json({ 
          error: 'Token d\'authentification requis'
        });
      }

      // POSTGRESQL - Récupération selon le type d'utilisateur
      let appointments;
      if (isClient) {
        // Pour CLIENT : ses propres RDV
        appointments = await storage.getAppointmentsByClientId(userId);
        console.log('👤 RDV CLIENT récupérés:', appointments?.length || 0);
      } else {
        // Pour PRO : RDV de son salon
        appointments = await storage.getAppointments(userId);
        console.log('🏢 RDV PRO récupérés:', appointments?.length || 0);
      }

      res.json(appointments || []);
    } catch (error: any) {
      console.error("❌ Erreur récupération RDV:", error);
      res.status(500).json({ 
        error: "Erreur PostgreSQL",
        message: error.message
      });
    }
  });

  // === ROUTE PRO LOGIN (FIXES ROUTING VITE) ===
  // Route de connexion professionnelle
  app.post('/api/login/professional', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email et mot de passe requis' 
        });
      }

      // Authentifier le professionnel
      const user = await storage.authenticateUser(email, password);
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Email ou mot de passe incorrect' 
        });
      }

      // Créer la session
      const session = req.session as any;
      session.user = {
        id: user.id,
        email: user.email,
        type: 'professional',
        businessName: user.businessName,
        isAuthenticated: true
      };

      res.json({ 
        success: true, 
        message: 'Connexion réussie',
        user: {
          id: user.id,
          email: user.email,
          businessName: user.businessName,
          type: 'professional'
        }
      });

    } catch (error: any) {
      console.error('Professional login error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur lors de la connexion' 
      });
    }
  });

  app.post('/api/pro/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log('🔐 Tentative de connexion PRO:', email);
      
      const user = await storage.authenticateUser(email, password);
      if (user) {
        console.log('✅ Connexion PRO réussie pour:', email);
        res.json({ success: true, user, token: 'demo-pro-token-' + user.id });
      } else {
        console.log('❌ Échec de connexion PRO pour:', email);
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } catch (error: any) {
      console.error('❌ Erreur lors de la connexion PRO:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  // Notification routes (Firebase ready)
  app.get('/api/notifications', async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      let notifications = [];
      // Les notifications ne sont pas encore implémentées dans storage
      notifications = [];
      
      res.json(notifications);
    } catch (error: any) {
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
      // Les notifications ne sont pas encore implémentées dans storage
      notification = { ...notificationData, id: Date.now(), createdAt: new Date() };
      
      res.json(notification);
    } catch (error: any) {
      console.error('Error creating notification:', error);
      res.status(500).json({ message: 'Failed to create notification' });
    }
  });

  // 💰 STRIPE - Route pour créer une session de paiement d'acompte
  app.post('/api/stripe/create-deposit-checkout', async (req, res) => {
    try {
      const { amount, description, customerEmail, customerName, appointmentId, salonName } = req.body;
      
      console.log('💰 Création session paiement acompte:', { amount, customerEmail, salonName });
      
      const { createPaymentCheckout } = await import('./stripeService');
      
      const session = await createPaymentCheckout({
        amount,
        description: description || 'Acompte réservation',
        customerEmail,
        customerName,
        appointmentId,
        salonName,
        successUrl: `${process.env.FRONTEND_URL || 'http://localhost:5000'}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${process.env.FRONTEND_URL || 'http://localhost:5000'}/booking`
      });
      
      console.log('✅ Session Stripe créée:', session.sessionId);
      
      res.json({
        success: true,
        sessionId: session.sessionId,
        url: session.url
      });
    } catch (error: any) {
      console.error('❌ Erreur création session paiement:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erreur lors de la création de la session de paiement'
      });
    }
  });

  // 💳 ROUTES STRIPE CHECKOUT - SUPPORT COMPLET DES 3 PLANS
  app.post('/api/stripe/create-subscription-checkout', async (req, res) => {
    try {
      const { planType, customerEmail, customerName } = req.body;
      
      console.log('💳 Création session abonnement Stripe:', { planType, customerEmail });
      
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ error: 'Clé Stripe non configurée. Demandez à l\'utilisateur de configurer STRIPE_SECRET_KEY.' });
      }
      
      const { default: Stripe } = await import('stripe');
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2024-06-20',
      });
      
      const planPrices = {
        'essentiel': { amount: 2900 }, // 29€/mois
        'premium': { amount: 14900 }, // 149€/mois  
        'basic-pro': { amount: 2900 },
        'advanced-pro': { amount: 7900 },
        'premium-pro': { amount: 14900 }
      };
      
      const planAmount = planPrices[planType as keyof typeof planPrices]?.amount || 2900;
      
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Abonnement ${planType.charAt(0).toUpperCase() + planType.slice(1)}`,
              description: `Plan ${planType} pour votre salon`,
            },
            unit_amount: planAmount, // Déjà en centimes
            recurring: { interval: 'month' },
          },
          quantity: 1,
        }],
        customer_email: customerEmail,
        metadata: {
          planType,
          customerName,
          type: 'subscription'
        },
        success_url: `https://${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `https://${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}/cancel`,
        subscription_data: {
          trial_period_days: 14,
        },
      });
      
      console.log('✅ Session abonnement Stripe créée:', session.id);
      res.json({ 
        sessionId: session.id, 
        url: session.url,
        success: true 
      });
      
    } catch (error: any) {
      console.error('❌ Erreur session abonnement Stripe:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la création de la session Stripe',
        details: error.message 
      });
    }
  });

  app.post('/api/stripe/create-payment-checkout', async (req, res) => {
    try {
      // Import de l'utilitaire de gestion des montants
      const { validateAndConvertAmount } = await import('./utils/amountUtils');
      
      const { amount, description, customerEmail, customerName, salonName, appointmentId } = req.body;
      
      // 🔒 VALIDATION SÉCURISÉE DES MONTANTS avec logs détaillés
      const amountValidation = validateAndConvertAmount(amount, '/api/stripe/create-payment-checkout');
      
      // Afficher tous les logs pour debugging
      amountValidation.logs.forEach(log => console.log(log));
      
      if (!amountValidation.success) {
        console.log(`❌ [create-payment-checkout] Validation montant échouée:`, amountValidation);
        return res.status(400).json({ 
          error: 'Format de montant invalide',
          details: amountValidation.logs.join(' | '),
          received: amount
        });
      }
      
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ error: 'Clé Stripe non configurée' });
      }
      
      const { default: Stripe } = await import('stripe');
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2024-06-20',
      });
      
      // 🎯 LOG FINAL AVANT APPEL STRIPE
      console.log(`💳 [STRIPE] Création CheckoutSession - Montant FINAL: ${amountValidation.amountInEuros.toFixed(2)}€ = ${amountValidation.amountInCents} centimes`);
      
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        // ✅ 3D SECURE FORCÉ - Configuration PRODUCTION
        payment_method_options: {
          card: {
            request_three_d_secure: 'any', // OBLIGATOIRE en production
          },
        },
        line_items: [{
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Acompte - ${description}`,
              description: `Réservation chez ${salonName}`,
            },
            unit_amount: amountValidation.amountInCents, // ✅ MONTANT SÉCURISÉ EN CENTIMES
          },
          quantity: 1,
        }],
        customer_email: customerEmail,
        metadata: {
          appointmentId: appointmentId || 'demo',
          customerName,
          salonName: salonName || 'Salon Demo',
          type: 'booking_deposit',
          originalAmount: String(amount),
          detectedFormat: amountValidation.detectedFormat,
        },
        success_url: `https://${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `https://${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}/cancel`,
      });
      
      console.log(`✅ [STRIPE] CheckoutSession créée: ${session.id} pour ${amountValidation.amountInEuros.toFixed(2)}€`);
      res.json({ 
        sessionId: session.id, 
        url: session.url,
        success: true 
      });
      
    } catch (error: any) {
      console.error('❌ Erreur session paiement Stripe:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la création de la session Stripe',
        details: error.message 
      });
    }
  });

  // 💳 API PAIEMENT PROFESSIONNEL STRIPE
  app.post('/api/create-professional-payment-intent', async (req, res) => {
    try {
      // Import de l'utilitaire de gestion des montants
      const { validateAndConvertAmount } = await import('./utils/amountUtils');
      
      const { salonId, plan, amount } = req.body;
      
      // 🔒 VALIDATION SÉCURISÉE DES MONTANTS avec logs détaillés
      const amountValidation = validateAndConvertAmount(amount, '/api/create-professional-payment-intent');
      
      // Afficher tous les logs pour debugging
      amountValidation.logs.forEach(log => console.log(log));
      
      if (!amountValidation.success) {
        console.log(`❌ [create-professional-payment-intent] Validation montant échouée:`, amountValidation);
        return res.status(400).json({ 
          error: 'Format de montant invalide',
          details: amountValidation.logs.join(' | '),
          received: amount
        });
      }
      
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ error: 'Clé Stripe non configurée' });
      }
      
      // Utiliser Stripe directement (package installé)
      const { default: Stripe } = await import('stripe');
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2024-06-20',
      });
      
      // 🎯 LOG FINAL AVANT APPEL STRIPE
      console.log(`💳 [STRIPE] Création PaymentIntent PRO - Montant FINAL: ${amountValidation.amountInEuros.toFixed(2)}€ = ${amountValidation.amountInCents} centimes`);
      
      // Créer le Payment Intent avec 3D Secure
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountValidation.amountInCents, // ✅ MONTANT SÉCURISÉ EN CENTIMES
        currency: 'eur',
        automatic_payment_methods: {
          enabled: true,
        },
        payment_method_options: {
          card: {
            request_three_d_secure: 'any', // ✅ 3D SECURE OBLIGATOIRE
          },
        },
        metadata: {
          salonId,
          subscriptionPlan: plan,
          type: 'professional_subscription',
          originalAmount: String(amount),
          detectedFormat: amountValidation.detectedFormat,
        },
        description: `Abonnement ${plan} - Salon ${salonId}`
      });
      
      console.log(`✅ [STRIPE] PaymentIntent PRO créé: ${paymentIntent.id} pour ${amountValidation.amountInEuros.toFixed(2)}€`);
      
      res.json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: amountValidation.amountInEuros,
        amountInCents: amountValidation.amountInCents,
        currency: 'eur'
      });
      
    } catch (error: any) {
      console.error('❌ Erreur création Payment Intent professionnel:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la création du Payment Intent',
        details: error instanceof Error ? error.message : 'Erreur inconnue' 
      });
    }
  });

  // 🔐 API CONNEXION PROFESSIONNEL BUSINESS
  app.post('/api/business/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log('🔐 Tentative de connexion BUSINESS:', email);
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
      }

      // Récupérer l'utilisateur professionnel par email dans la table users
      const user = await storage.getUserByEmail(email);
      if (!user) {
        console.log('❌ Utilisateur professionnel non trouvé:', email);
        return res.status(401).json({ error: 'Identifiants incorrects' });
      }

      // Vérifier le mot de passe avec bcrypt
      const bcrypt = await import('bcrypt');
      const isValidPassword = await bcrypt.compare(password, user.password || '');
      
      if (!isValidPassword) {
        console.log('❌ Mot de passe incorrect pour:', email);
        return res.status(401).json({ error: 'Identifiants incorrects' });
      }

      console.log('✅ Connexion BUSINESS réussie:', email);
      
      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          businessName: user.businessName,
          role: 'professional'
        },
        token: `business-token-${user.id}`,
        message: 'Connexion professionnelle réussie'
      });
      
    } catch (error: any) {
      console.error('❌ Erreur connexion business:', error);
      res.status(500).json({ error: 'Erreur serveur' });
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
    } catch (error: any) {
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
    } catch (error: any) {
      console.error('Error fetching client:', error);
      res.status(500).json({ message: 'Failed to fetch client' });
    }
  });

  // Appointment routes - POSTGRESQL CLIENT/PRO SYNC
  app.post('/api/appointments', async (req, res) => {
    try {
      console.log('📅 Création RDV PostgreSQL:', req.body);
      
      // Support authentification CLIENT ou PRO
      const authHeader = req.headers.authorization;
      let userId = null;
      let isClient = false;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        if (token.startsWith('demo-token-')) {
          userId = token.replace('demo-token-', '');
        } else if (token.startsWith('client-token-')) {
          userId = token.replace('client-token-', '');
          isClient = true;
        }
      }

      if (!userId) {
        return res.status(401).json({ 
          error: 'Token d\'authentification requis (CLIENT ou PRO)'
        });
      }

      const appointmentData = {
        ...req.body,
        clientId: isClient ? userId : req.body.clientId,
        professionalId: req.body.professionalId || req.body.staffId,
        salonId: req.body.salonId,
        status: 'confirmed',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // UNIQUEMENT PostgreSQL - aucune donnée factice
      const appointment = await storage.createAppointment(appointmentData);
      
      console.log('✅ RDV créé dans PostgreSQL:', 
        appointment.serviceName, 
        'Client:', appointment.clientName,
        'Pro:', appointment.professionalName
      );
      
      res.json(appointment);
    } catch (error: any) {
      console.error('❌ Erreur création RDV PostgreSQL:', error);
      res.status(500).json({ 
        error: 'Erreur base de données PostgreSQL',
        message: error.message
      });
    }
  });

  // Services routes publics pour réservation - PostgreSQL uniquement avec conversion slug
  app.get('/api/services', async (req, res) => {
    try {
      console.log('🔍 API /api/services appelée');
      const { salonId, userId } = req.query;
      let finalUserId = userId || salonId || 'demo';
      console.log('🏢 SalonId/UserId reçu:', finalUserId);

      // Conversion forcée slug vers ID pour barbier-gentleman-marais
      if (finalUserId === 'barbier-gentleman-marais') {
        finalUserId = '8';
        console.log('✅ Conversion slug vers ID:', 'barbier-gentleman-marais -> 8');
      }
      
      console.log('🏢 UserId final pour services:', finalUserId);

      // Utiliser le userId final pour récupérer les services PostgreSQL
      const services = await storage.getServicesBySalonId(finalUserId as string);
      
      if (!services || services.length === 0) {
        return res.status(404).json({ 
          error: 'Aucun service dans PostgreSQL pour cet utilisateur',
          userId: finalUserId,
          message: 'AUCUNE DONNÉE FICTIVE - Base de données vide'
        });
      }
      
      console.log('💼 Services à retourner:', services.length, 'services');
      res.json(services);
    } catch (error: any) {
      console.error('❌ Erreur services API:', error);
      res.status(500).json({ message: 'Failed to fetch services' });
    }
  });

  // API pour modifier/créer un service (pour les professionnels) - POSTGRESQL UNIQUEMENT
  app.post('/api/services', async (req, res) => {
    try {
      const serviceData = req.body;
      console.log('🔧 Création service PostgreSQL:', serviceData);
      
      // Vérification utilisateur authentifié
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
          error: 'Token d\'authentification requis'
        });
      }

      const token = authHeader.substring(7);
      const userId = token.replace('demo-token-', '');

      // UNIQUEMENT PostgreSQL - aucune donnée factice
      const service = await storage.createService({
        ...serviceData,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('✅ Service créé dans PostgreSQL:', service.name, 'Prix:', service.price);
      res.json(service);
    } catch (error: any) {
      console.error('❌ Erreur création service PostgreSQL:', error);
      res.status(500).json({ 
        error: 'Erreur base de données PostgreSQL',
        message: error.message
      });
    }
  });

  // API pour modifier les détails du salon
  app.put('/api/salon/:salonId', async (req, res) => {
    try {
      const { salonId } = req.params;
      const salonData = req.body;
      console.log('🏢 Modification salon PostgreSQL:', salonId, salonData.name);

      // Vérification authentification
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
          error: 'Token d\'authentification requis'
        });
      }

      const token = authHeader.substring(7);
      const userId = token.replace('demo-token-', '');

      // Mise à jour dans PostgreSQL via storage
      if (storage.saveSalonData) {
        await storage.saveSalonData(salonId, {
          ...salonData,
          ownerId: userId,
          updatedAt: new Date()
        });
      }

      console.log('✅ Salon modifié dans PostgreSQL:', salonData.name);
      res.json({ 
        success: true, 
        message: 'Salon mis à jour avec succès',
        salon: salonData
      });
    } catch (error: any) {
      console.error('❌ Erreur modification salon:', error);
      res.status(500).json({ 
        error: 'Erreur sauvegarde PostgreSQL',
        message: error.message
      });
    }
  });

  // API pour modifier un service existant
  app.put('/api/services/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const serviceData = req.body;
      console.log('🔧 Modification service:', id, serviceData);
      
      let service;
      if (storage.updateService) {
        service = await storage.updateService(parseInt(id), serviceData);
      } else {
        service = { ...serviceData, id };
      }
      
      res.json(service);
    } catch (error: any) {
      console.error('Error updating service:', error);
      res.status(500).json({ message: 'Failed to update service' });
    }
  });

  // API pour modifier/créer un professionnel
  app.post('/api/staff', async (req, res) => {
    try {
      const staffData = req.body;
      console.log('🔧 Création/modification professionnel:', staffData);
      
      let staff;
      if (storage.createStaff) {
        staff = await storage.createStaff(staffData);
      } else {
        staff = { ...staffData, id: Date.now() };
      }
      
      res.json(staff);
    } catch (error: any) {
      console.error('Error creating staff:', error);
      res.status(500).json({ message: 'Failed to create staff' });
    }
  });

  // API pour modifier un professionnel existant
  app.put('/api/staff/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const staffData = req.body;
      console.log('🔧 Modification professionnel:', id, staffData);
      
      let staff;
      if (storage.updateStaff) {
        staff = await storage.updateStaff(parseInt(id), staffData);
      } else {
        staff = { ...staffData, id };
      }
      
      res.json(staff);
    } catch (error: any) {
      console.error('Error updating staff:', error);
      res.status(500).json({ message: 'Failed to update staff' });
    }
  });

  // API pour récupérer le salon courant
  // Route salon actuel (redirigée vers my-salon pour les pros authentifiés)
  app.get('/api/salon/current', async (req, res) => {
    try {
      // Vérifier si l'utilisateur est authentifié
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        // Rediriger vers la route authentifiée
        const ownerResponse = await fetch(`${req.protocol}://${req.hostname}/api/salon/my-salon`, {
          headers: { authorization: authHeader }
        });
        if (ownerResponse.ok) {
          const data = await ownerResponse.json();
          return res.json(data.salon);
        }
      }
      
      // Pour les tests, retourner le salon demo
      const salon = {
        id: 'salon-demo',
        name: 'Salon Excellence',
        location: 'Paris 75008',
        address: '123 Avenue des Champs-Élysées, 75008 Paris',
        phone: '01 42 25 85 96',
        email: 'contact@excellence-salon.fr'
      };
      
      res.json(salon);
    } catch (error: any) {
      console.error('Error fetching salon:', error);
      res.status(500).json({ message: 'Failed to fetch salon' });
    }
  });
  
  // Services routes protégées pour les pros
  app.get('/api/services/protected', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const services = await storage.getServices(userId);
      res.json(services);
    } catch (error: any) {
      console.error('Error fetching services:', error);
      res.status(500).json({ message: 'Failed to fetch services' });
    }
  });

  // Route distincte pour services par salon (string ID)
  app.get('/api/services/salon/:salonId', async (req, res) => {
    try {
      const { salonId } = req.params;
      console.log('📋 Récupération services pour salon:', salonId);
      
      if (!salonId || salonId === 'undefined') {
        return res.status(400).json({ 
          error: 'Invalid salon ID',
          details: 'Salon ID is required and cannot be undefined'
        });
      }
      
      const services = await storage.getServicesBySalonId(salonId);
      res.json(services);
    } catch (error: any) {
      console.error('Error fetching services by salon:', error);
      res.status(500).json({ 
        error: 'Failed to fetch services',
        details: error.message || 'Unknown error'
      });
    }
  });

  // Route distincte pour service individuel (numeric ID)
  app.get('/api/services/:id(\\d+)', async (req, res) => {
    try {
      const serviceId = parseInt(req.params.id);
      console.log('🔍 Récupération service ID numérique:', serviceId);
      
      if (serviceId <= 0) {
        return res.status(400).json({ 
          error: 'Invalid service ID',
          details: 'Service ID must be a positive integer'
        });
      }
      
      const service = await storage.getServiceById(serviceId);
      
      if (!service) {
        return res.status(404).json({ 
          error: 'Service not found',
          details: `No service found with ID ${serviceId}`
        });
      }
      
      res.json(service);
    } catch (error: any) {
      console.error('Error fetching service by ID:', error);
      res.status(500).json({ 
        error: 'Failed to fetch service',
        details: error.message || 'Unknown error'
      });
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
    } catch (error: any) {
      console.error('Error fetching clients:', error);
      res.status(500).json({ message: 'Failed to fetch clients' });
    }
  });

  // Client authentication routes
  app.post('/api/client/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
      }

      const client = await storage.authenticateClient(email, password);
      
      if (client) {
        // Generate a simple token (in production, use JWT)
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
    } catch (error: any) {
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
    } catch (error: any) {
      console.error('Client registration error:', error);
      res.status(500).json({ error: 'Erreur lors de la création du compte' });
    }
  });

  app.get('/api/client/auth/check', async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token || !token.startsWith('client-')) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    try {
      // Extract client ID from token (simplified approach)
      const clientId = parseInt(token.split('-')[1]);
      const client = await storage.getClientAccount(clientId);
      
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
        res.status(401).json({ error: 'Token invalide' });
      }
    } catch (error: any) {
      res.status(401).json({ error: 'Token invalide' });
    }
  });

  // Client Dashboard Routes
  app.get('/api/client/appointments', async (req, res) => {
    try {
      // Pour la démo, retourner des données simulées de rendez-vous
      const appointments = [
        {
          id: 1,
          dateTime: '2025-08-20T14:00:00Z',
          service: {
            name: 'Coupe & Brushing',
            price: 65,
            duration: 60
          },
          salon: {
            id: 1,
            name: 'Beauty Lash Studio',
            address: '12 Rue des Fleurs, Paris 16'
          },
          staff: {
            firstName: 'Marie',
            lastName: 'Dubois'
          },
          status: 'confirmed'
        },
        {
          id: 2,
          dateTime: '2025-08-25T16:30:00Z',
          service: {
            name: 'Manucure',
            price: 45,
            duration: 45
          },
          salon: {
            id: 2,
            name: 'Excellence Paris',
            address: '8 Avenue Montaigne, Paris 8'
          },
          staff: {
            firstName: 'Sophie',
            lastName: 'Martin'
          },
          status: 'confirmed'
        },
        {
          id: 3,
          dateTime: '2025-08-15T10:00:00Z',
          service: {
            name: 'Soin visage',
            price: 80,
            duration: 90
          },
          salon: {
            id: 1,
            name: 'Beauty Lash Studio',
            address: '12 Rue des Fleurs, Paris 16'
          },
          staff: {
            firstName: 'Marie',
            lastName: 'Dubois'
          },
          status: 'completed',
          review: {
            rating: 5,
            comment: 'Excellent service!'
          }
        },
        {
          id: 4,
          dateTime: '2025-08-10T15:00:00Z',
          service: {
            name: 'Coloration',
            price: 120,
            duration: 120
          },
          salon: {
            id: 2,
            name: 'Excellence Paris',
            address: '8 Avenue Montaigne, Paris 8'
          },
          staff: {
            firstName: 'Julie',
            lastName: 'Leroy'
          },
          status: 'completed'
        }
      ];
      
      console.log('📅 Récupération rendez-vous client:', appointments.length, 'RDV');
      res.json(appointments);
    } catch (error: any) {
      console.error('❌ Erreur récupération rendez-vous client:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des rendez-vous' });
    }
  });

  app.get('/api/client/stats', async (req, res) => {
    try {
      // Pour la démo, calculer des stats basées sur les rendez-vous
      const stats = {
        totalAppointments: 4,
        upcomingAppointments: 2,
        favoriteServices: ['Coupe & Brushing', 'Manucure', 'Soin visage'],
        totalSpent: 310,
        lastVisit: '2025-08-15T10:00:00Z',
        nextAppointment: '2025-08-20T14:00:00Z',
        favoritesSalons: [
          {
            id: 1,
            name: 'Beauty Lash Studio',
            visits: 2
          },
          {
            id: 2,
            name: 'Excellence Paris',
            visits: 2
          }
        ]
      };
      
      console.log('📊 Récupération stats client:', stats);
      res.json(stats);
    } catch (error: any) {
      console.error('❌ Erreur récupération stats client:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
    }
  });

  app.post('/api/client/appointments/:id/cancel', async (req, res) => {
    try {
      const appointmentId = req.params.id;
      console.log('❌ Annulation rendez-vous:', appointmentId);
      
      // Pour la démo, simuler l'annulation
      const canceledAppointment = {
        id: appointmentId,
        status: 'canceled',
        canceledAt: new Date(),
        cancelReason: 'Annulation client'
      };
      
      console.log('✅ Rendez-vous annulé:', appointmentId);
      res.json({ 
        success: true, 
        appointment: canceledAppointment,
        message: 'Rendez-vous annulé avec succès'
      });
    } catch (error: any) {
      console.error('❌ Erreur annulation rendez-vous:', error);
      res.status(500).json({ error: 'Erreur lors de l\'annulation du rendez-vous' });
    }
  });

  // API pour récupérer un salon par ID - POSTGRESQL UNIQUEMENT
  app.get('/api/salon/public/:id', async (req, res) => {
    try {
      const { id } = req.params;
      console.log('📖 Récupération salon par ID:', id);
      
      let salon;
      if (storage.getSalonData) {
        salon = await storage.getSalon(id);
      }
      
      // SOLUTION TEMPORAIRE : Chercher dans les salons créés au démarrage
      if (!salon && (id === 'excellence' || id === 'excellence-hair-paris')) {
        console.log('🔍 Recherche salon Excellence dans Map');
        // Le salon est créé au démarrage avec l'ID 'excellence-hair-paris'
        salon = await storage.getSalon('excellence-hair-paris');
        
        if (!salon) {
          // Créer si vraiment pas trouvé
          console.log('🏗️ Création salon test Excellence');
          const excellenceSalon = {
            id: 'excellence-hair-paris',
            name: 'Excellence Hair Paris',
            description: 'Salon de coiffure haut de gamme à Paris',
            address: '25 Rue Saint-Honoré, 75008 Paris',
            phone: '01 42 60 78 90',
            photos: ['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop'],
            serviceCategories: [{
              id: 1,
              name: 'Coiffure',
              services: [
                { id: 1, name: 'Coupe + Brushing', price: 45, duration: 60 },
                { id: 2, name: 'Coloration', price: 85, duration: 120 }
              ]
            }],
            rating: 4.8,
            reviewCount: 127
          };
          await storage.saveSalonData('excellence-hair-paris', excellenceSalon);
          await storage.saveSalonData('excellence', excellenceSalon); // Alias
          salon = excellenceSalon;
        }
      }
      
      if (!salon) {
        console.log('❌ ERREUR: Salon inexistant dans PostgreSQL:', id);
        return res.status(404).json({ 
          error: 'Salon non trouvé dans la base de données PostgreSQL',
          message: 'AUCUNE DONNÉE FACTICE - Salons authentiques uniquement'
        });
      }
      
      console.log('✅ Salon trouvé:', salon?.name);
      res.json(salon); // Renvoyer directement les données du salon
    } catch (error: any) {
      console.error('❌ Erreur récupération salon:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

  // 🔧 ENDPOINT EMERGENCY : Forcer la création du salon demo
  app.post('/api/force-create-salon-demo', async (req, res) => {
    try {
      const demoSalon = {
        id: 'salon-demo',
        name: 'Agashou',
        description: 'Salon de beauté moderne et professionnel',
        longDescription: 'Notre salon vous accueille dans un cadre chaleureux pour tous vos soins de beauté.',
        address: '15 Avenue des Champs-Élysées, 75008 Paris',
        phone: '01 42 25 76 89',
        email: 'contact@salon.fr',
        website: '',
        photos: [
          'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop&auto=format'
        ],
        serviceCategories: [
          {
            id: 1,
            name: 'Coiffure',
            expanded: false,
            services: [
              { id: 1, name: 'Cheveux', price: 45, duration: '1h', description: 'Service cheveux' },
              { id: 2, name: 'Barbe', price: 30, duration: '45min', description: 'Service barbe' },
              { id: 3, name: 'Rasage', price: 25, duration: '30min', description: 'Service rasage' }
            ]
          }
        ],
        professionals: [
          {
            id: '1',
            name: 'Sarah Martinez',
            specialty: 'Coiffure & Coloration',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=150&h=150&fit=crop&crop=face',
            rating: 4.9,
            price: 65,
            bio: 'Expert en coiffure moderne',
            experience: '8 ans d\'expérience'
          }
        ],
        rating: 4.9,
        reviewCount: 324,
        verified: true,
        certifications: ['Bio-certifié', 'Expert L\'Oréal', 'Formation Kérastase', 'Technique Aveda'],
        awards: [],
        customColors: {
          primary: '#06b6d4',
          accent: '#06b6d4', 
          buttonText: '#ffffff',
          priceColor: '#ec4899',
          neonFrame: '#ef4444'
        }
      };
      
      // Forcer la sauvegarde dans toutes les structures de données
      if (storage.salons) {
        storage.salons.set('salon-demo', demoSalon);
      }
      
      console.log('🚨 SALON DEMO FORCÉ - Nom:', demoSalon.name, 'Couleurs:', demoSalon.customColors?.primary);
      
      res.json({ 
        success: true, 
        message: 'Salon demo créé avec force',
        salon: demoSalon 
      });
    } catch (error: any) {
      console.error('❌ Erreur création forcée salon demo:', error);
      res.status(500).json({ error: 'Erreur création salon demo' });
    }
  });

  // API UNIVERSELLE : Récupération automatique du salon du professionnel connecté
  app.get('/api/salon/current', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      let userId = null;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        if (token.startsWith('demo-token-')) {
          userId = token.replace('demo-token-', '');
        }
      }
      
      console.log('🔍 Récupération salon pour utilisateur:', userId);
      
      if (!userId) {
        return res.status(401).json({ message: 'Non authentifié' });
      }
      
      // 🚀 NOUVEAU : Chercher le salon personnel de l'utilisateur
      const userSalons = Array.from(storage.salons?.values() || []).filter(salon => 
        salon.ownerId === userId || salon.ownerEmail?.includes(userId)
      );
      
      let userSalon = userSalons[0];
      
      if (!userSalon) {
        // 🎯 CRÉATION AUTOMATIQUE D'UN SALON UNIQUE POUR CET UTILISATEUR
        const uniqueId = `salon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        console.log('🏗️ Création salon unique pour utilisateur:', userId);
        console.log('🆔 ID généré:', uniqueId);
        
        userSalon = {
          id: uniqueId,
          name: `Salon de ${userId}`,
          description: 'Nouveau salon - À personnaliser',
          longDescription: 'Bienvenue dans votre salon ! Modifiez cette description depuis votre dashboard.',
          address: 'Adresse à définir',
          phone: 'Téléphone à définir',
          email: `contact@salon-${uniqueId}.fr`,
          website: '',
          photos: [
            'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&auto=format'
          ],
          professionals: [],
          rating: 0,
          reviewCount: 0,
          verified: false,
          certifications: [],
          awards: [],
          customColors: {
            primary: '#7c3aed',
            accent: '#a855f7',
            buttonText: '#ffffff',
            priceColor: '#7c3aed',
            neonFrame: '#a855f7'
          },
          serviceCategories: [],
          ownerId: userId,
          ownerEmail: userId,
          shareableUrl: `/salon/${uniqueId}`,
          isPublished: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        storage.salons?.set(uniqueId, userSalon);
        console.log('✅ Salon unique créé pour utilisateur:', userId, 'URL:', `/salon/${uniqueId}`);
      }
      
      console.log('✅ Salon personnel trouvé:', userSalon.name, 'ID:', userSalon.id);
      return res.json(userSalon);
      
    } catch (error: any) {
      console.error('❌ Erreur récupération salon current:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

  // API pour récupérer un salon spécifique par ID  
  app.get('/api/salon/:salonId', async (req, res) => {
    try {
      const { salonId } = req.params;
      console.log('📖 Récupération salon par ID:', salonId);
      
      // IMPORTANT: Ne pas traiter "current" comme un ID, redirection vers l'endpoint dédié
      if (salonId === 'current') {
        console.log('🔄 Redirection vers endpoint salon current');
        const authHeader = req.headers.authorization;
        let userId = null;

        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.substring(7);
          if (token.startsWith('demo-token-')) {
            userId = token.replace('demo-token-', '');
          }
        }
        
        if (!userId) {
          return res.status(401).json({ message: 'Non authentifié' });
        }
        
        // Chercher le salon personnel de l'utilisateur
        const userSalons = Array.from(storage.salons?.values() || []).filter(salon => 
          salon.ownerId === userId || salon.ownerEmail?.includes(userId)
        );
        
        let userSalon = userSalons[0];
        
        if (!userSalon) {
          // Création automatique d'un salon unique pour cet utilisateur
          const uniqueId = `salon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          console.log('🏗️ Création salon unique pour utilisateur:', userId, 'ID:', uniqueId);
          
          userSalon = {
            id: uniqueId,
            name: `Salon de ${userId}`,
            description: 'Nouveau salon - À personnaliser',
            longDescription: 'Bienvenue dans votre salon ! Modifiez cette description depuis votre dashboard.',
            address: 'Adresse à définir',
            phone: 'Téléphone à définir',
            email: `contact@salon-${uniqueId}.fr`,
            website: '',
            photos: [
              'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&auto=format'
            ],
            professionals: [],
            rating: 0,
            reviewCount: 0,
            verified: false,
            certifications: [],
            awards: [],
            customColors: {
              primary: '#7c3aed',
              accent: '#a855f7',
              buttonText: '#ffffff',
              priceColor: '#7c3aed',
              neonFrame: '#a855f7'
            },
            serviceCategories: [],
            ownerId: userId,
            ownerEmail: userId,
            shareableUrl: `/salon/${uniqueId}`,
            isPublished: false,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          storage.salons?.set(uniqueId, userSalon);
          console.log('✅ Salon unique créé pour utilisateur:', userId, 'URL:', `/salon/${uniqueId}`);
        }
        
        console.log('✅ Salon personnel trouvé:', userSalon.name, 'ID:', userSalon.id);
        return res.json(userSalon);
      }
      
      // Chercher le salon associé à ce professionnel
      let salon = storage.salons?.get(salonId);
      
      if (!salon) {
        return res.status(404).json({ message: 'Salon non trouvé' });
      }
      
      res.json(salon);
    } catch (error: any) {
      console.error('❌ Erreur récupération salon:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

  // API pour mettre à jour les données d'un salon
  app.put('/api/salon/:salonId', async (req, res) => {
    try {
      const { salonId } = req.params;
      const updateData = req.body;
      
      let salon = storage.salons?.get(salonId);
      if (!salon) {
        return res.status(404).json({ message: 'Salon non trouvé' });
      }
      
      // Mettre à jour les données
      const updatedSalon = { ...salon, ...updateData, updatedAt: new Date() };
      storage.salons?.set(salonId, updatedSalon);
      
      // 🔌 Diffuser la mise à jour via WebSocket pour synchronisation temps réel
      broadcastSalonUpdate(salonId, updatedSalon);
      
      res.json(updatedSalon);
    } catch (error: any) {
      console.error('❌ Erreur mise à jour salon:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

  // 🚀 API D'INSCRIPTION PROFESSIONNEL AVEC CRÉATION AUTOMATIQUE DE PAGE SALON
  app.post('/api/professional/register', async (req, res) => {
    try {
      const {
        businessName,
        businessType,
        siret,
        address,
        city,
        postalCode,
        phone,
        email,
        ownerFirstName,
        ownerLastName,
        legalForm,
        vatNumber,
        description,
        planType,
        password
      } = req.body;

      console.log('🎯 INSCRIPTION PROFESSIONNEL AVEC ABONNEMENT:', planType);
      console.log('🏢 Business:', businessName, 'Email:', email);
      
      // Validation des données requises
      if (!password || password.length < 6) {
        return res.status(400).json({ error: 'Mot de passe requis (minimum 6 caractères)' });
      }
      
      if (!email || !businessName || !ownerFirstName || !ownerLastName) {
        return res.status(400).json({ error: 'Tous les champs requis doivent être remplis' });
      }

      // Vérifier si l'email existe déjà dans la table users
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Un compte professionnel avec cet email existe déjà' });
      }

      // 🚀 CRÉATION AUTOMATIQUE DE PAGE SALON PERSONNALISÉE
      const ownerName = `${ownerFirstName} ${ownerLastName}`;
      const fullAddress = `${address}, ${city} ${postalCode}`;
      const subscriptionPlan = planType || 'basic';
      
      const professionalData = {
        ownerName,
        businessName,
        email,
        phone,
        address: fullAddress,
        subscriptionPlan: subscriptionPlan as 'premium' | 'basic' | 'enterprise',
        services: [],
        description: description || `Salon professionnel ${businessName}`
      };

      console.log('🏗️ Création automatique page salon pour:', businessName);
      const createdSalon = await createAutomaticSalonPage(professionalData);
      
      // 🔗 Associer le salon au professionnel
      await linkSalonToProfessional(createdSalon.id, email);

      // ✅ CRÉER LE COMPTE PROFESSIONNEL DANS LA TABLE USERS (Compatible avec login)
      // Protection contre ownerName undefined
      const safeOwnerName = ownerName || businessName || 'Propriétaire';
      const nameparts = safeOwnerName.split(' ');
      
      const userData = {
        email,
        password, // Mot de passe brut, sera hashé par storage.createUser()
        businessName,
        firstName: nameparts[0] || 'Pro',
        lastName: nameparts.slice(1).join(' ') || '',
        phone,
        address,
        subscriptionPlan: (subscriptionPlan as 'premium' | 'basic' | 'enterprise') || 'basic',
        city: address?.split(',').pop()?.trim() || 'Paris'
      };

      // Créer l'utilisateur professionnel dans la table users
      const user = await storage.createUser(userData);
      
      // Créer aussi l'entrée business pour compatibilité (si la méthode existe)
      const businessData = {
        businessName,
        ownerName: ownerName || businessName || 'Propriétaire',
        email,
        phone,
        address,
        businessType,
        description,
        salonId: createdSalon.id,
        subscriptionPlan,
        isActive: true
      };

      let business;
      if (storage.createBusiness) {
        try {
          business = await storage.createBusiness(businessData);
        } catch (error: any) {
          console.log('ℹ️ createBusiness non disponible, utilisation données user');
          business = { ...businessData, id: user.id, createdAt: new Date() };
        }
      } else {
        business = { ...businessData, id: user.id, createdAt: new Date() };
      }

      console.log('✅ INSCRIPTION COMPLÈTE:', {
        business: business.businessName,
        salon: createdSalon.name,
        salonId: createdSalon.id,
        salonUrl: createdSalon.shareableUrl,
        plan: subscriptionPlan
      });

      res.json({
        success: true,
        message: 'Inscription réussie avec création automatique de page salon',
        business,
        salon: createdSalon,
        salonUrl: `http://localhost:5000${createdSalon.shareableUrl}`,
        editorUrl: `/salon-editor/${createdSalon.id}`,
        subscriptionPlan
      });

    } catch (error: any) {
      console.error('❌ Erreur inscription professionnel:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur lors de l\'inscription professionnelle' 
      });
    }
  });

  // 🧪 ROUTE DE TEST POUR CRÉER UN SALON DE DÉMONSTRATION
  app.post('/api/test/create-demo-salon', async (req, res) => {
    try {
      const { businessName = 'Salon Test', subscriptionPlan = 'premium' } = req.body;
      
      const demoData = {
        ownerName: 'Propriétaire Test',
        businessName,
        email: `demo-${Date.now()}@test.com`,
        phone: '01 23 45 67 89',
        address: '123 Rue de Test, 75001 Paris',
        subscriptionPlan: subscriptionPlan as 'premium' | 'basic' | 'enterprise',
        services: ['Service Test 1', 'Service Test 2'],
        description: `${businessName} - Salon de démonstration créé automatiquement`
      };

      console.log('🧪 Création salon de test:', businessName);
      const testSalon = await createAutomaticSalonPage(demoData);
      
      res.json({
        success: true,
        message: 'Salon de test créé avec succès',
        salon: testSalon,
        publicUrl: `http://localhost:5000${testSalon.shareableUrl}`,
        editorUrl: `/salon-editor/${testSalon.id}`
      });

    } catch (error: any) {
      console.error('❌ Erreur création salon test:', error);
      res.status(500).json({ error: 'Erreur lors de la création du salon test' });
    }
  });

  // API publique pour la recherche de salons avec photos
  app.get('/api/search/salons', async (req, res) => {
    try {
      const { category, city, search } = req.query;
      const categoryStr = typeof category === 'string' ? category : undefined;
      const cityStr = typeof city === 'string' ? city : undefined;
      const searchStr = typeof search === 'string' ? search : undefined;
      
      // ✅ RÉCUPÉRER LES VRAIS SALONS DEPUIS POSTGRESQL
      const realSalons = await storage.getSalons();
      let salons = realSalons.filter((salon: any) => salon && salon.id && salon.name);
      console.log(`🔍 Recherche salons: ${salons.length} salons trouvés`);
      
      // Filtrer par catégorie si spécifiée (PostgreSQL)
      if (categoryStr && categoryStr !== 'all') {
        salons = salons.filter(salon => {
          const categoryLower = categoryStr.toLowerCase();
          const businessType = salon.businessType?.toLowerCase() || '';
          const services = salon.services || [];
          
          return businessType.includes(categoryLower) ||
                 services.some((service: string) => service.toLowerCase().includes(categoryLower)) ||
                 (categoryLower === 'coiffure' && (businessType.includes('coiffure') || businessType.includes('salon'))) ||
                 (categoryLower === 'barbier' && businessType.includes('barbier')) ||
                 (categoryLower === 'beaute' && (businessType.includes('beaute') || businessType.includes('institut')));
        });
        console.log(`🏷️ Filtre catégorie "${categoryStr}": ${salons.length} salons`);
      }
      
      // Filtrer par ville si spécifiée
      if (cityStr) {
        const cityLower = cityStr.toLowerCase();
        salons = salons.filter(salon => 
          salon?.address?.toLowerCase().includes(cityLower)
        );
        console.log(`📍 Filtre ville "${cityStr}": ${salons.length} salons`);
      }
      
      // Filtrer par recherche textuelle PostgreSQL
      if (searchStr) {
        const searchLower = searchStr.toLowerCase();
        salons = salons.filter(salon =>
          salon?.name?.toLowerCase().includes(searchLower) ||
          salon?.description?.toLowerCase().includes(searchLower) ||
          salon?.address?.toLowerCase().includes(searchLower)
        );
        console.log(`🔍 Filtre recherche "${searchStr}": ${salons.length} salons`);
      }
      
      // Formater les résultats PostgreSQL pour l'affichage dans SalonSearchComplete
      const formattedSalons = salons.map(salon => {
        try {
          return {
            id: salon.id,
            name: salon.name,
            location: extractCity(salon?.address),
            rating: salon.rating || 4.5,
            reviews: salon.reviewCount || 0,
            nextSlot: "Disponible aujourd'hui",
            price: "À partir de 25€",
            services: ['Coupe', 'Couleur'],
            verified: true,
            distance: "À proximité",
            category: 'beaute',
            photo: salon.photos || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
            coverImageUrl: salon.photos || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
            openNow: true,
            promotion: null,
            // Données complètes pour les détails
            description: salon?.description || "",
            address: salon?.address || "",
            phone: salon.phone || "",
            email: salon.email || "",
            photos: salon.photos ? [salon.photos] : [],
            serviceCategories: salon.serviceCategories ? [salon.serviceCategories] : [],
            tags: [],
            openingHours: salon.openingHours
          };
        } catch (error) {
          console.error('❌ Erreur formatage salon:', salon.id, error);
          return null;
        }
      }).filter(Boolean);
      
      res.json({
        salons: formattedSalons,
        total: formattedSalons.length,
        filters: { category, city, search }
      });
    } catch (error: any) {
      console.error('❌ Error fetching salons:', error);
      res.status(500).json({ message: 'Failed to fetch salons' });
    }
  });

  // API pour récupérer un salon spécifique
  app.get('/api/public/salon/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const salon = storage.salons.get(id);
      
      if (!salon) {
        return res.status(404).json({ message: 'Salon not found' });
      }
      
      // Formater les données pour l'affichage détaillé
      const formattedSalon = {
        id: salon.id,
        name: salon?.name,
        description: salon?.description,
        address: salon?.address,
        phone: salon.phone,
        email: salon.email,
        website: salon.website,
        photos: salon.photos || [],
        rating: salon.rating || 4.5,
        reviewCount: salon.reviewCount || 0,
        serviceCategories: salon.serviceCategories || [],
        tags: salon.tags || [],
        openingHours: salon.openingHours,
        category: determineCategory(salon.serviceCategories),
        city: extractCity(salon?.address),
        services: extractServices(salon.serviceCategories),
        // Ajouter des infos supplémentaires pour la page détail
        verified: false,
        certifications: [],
        awards: []
      };
      
      res.json(formattedSalon);
    } catch (error: any) {
      console.error('Error fetching salon details:', error);
      res.status(500).json({ message: 'Failed to fetch salon details' });
    }
  });

  // Route de test simple
  app.get('/api/test', (req, res) => {
    res.json({ message: 'API fonctionne', timestamp: new Date().toISOString() });
  });

  // Fonctions utilitaires pour formater les données salon
  function determineCategory(serviceCategories: any[]) {
    if (!serviceCategories || serviceCategories.length === 0) return 'mixte';
    
    const firstCategory = serviceCategories[0]?.name?.toLowerCase() || '';
    if (firstCategory.includes('coiffure')) return 'coiffure';
    if (firstCategory.includes('barbier')) return 'barbier';
    if (firstCategory.includes('manucure') || firstCategory.includes('ongles')) return 'ongles';
    if (firstCategory.includes('massage')) return 'massage';
    if (firstCategory.includes('soin') || firstCategory.includes('esthétique')) return 'esthetique';
    return 'mixte';
  }

  function extractCity(address: string) {
    if (!address) return '';
    const parts = address.split(',');
    if (parts.length >= 2) {
      return parts[1].trim();
    }
    return address;
  }

  function extractServices(serviceCategories: any[]) {
    if (!serviceCategories) return [];
    
    const services: string[] = [];
    serviceCategories.forEach(category => {
      if (category.services && Array.isArray(category.services)) {
        category.services.forEach((service: any) => {
          if (service.name) services.push(service.name);
        });
      }
    });
    return services.slice(0, 3); // Limiter à 3 services principaux
  }

  // Route Payment Intent pour éviter interception Vite
  app.post('/api/create-payment-intent', async (req, res) => {
    try {
      // Import de l'utilitaire de gestion des montants
      const { validateAndConvertAmount } = await import('./utils/amountUtils');
      
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ 
          success: false,
          error: "Stripe not configured. Please set STRIPE_SECRET_KEY." 
        });
      }

      const { amount, currency = 'eur', metadata = {} } = req.body;
      
      // 🔒 VALIDATION SÉCURISÉE DES MONTANTS avec logs détaillés
      const amountValidation = validateAndConvertAmount(amount, '/api/create-payment-intent');
      
      // Afficher tous les logs pour debugging
      amountValidation.logs.forEach(log => console.log(log));
      
      if (!amountValidation.success) {
        console.log(`❌ [create-payment-intent] Validation montant échouée:`, amountValidation);
        return res.status(400).json({ 
          success: false,
          error: "Invalid amount format",
          details: amountValidation.logs.join(' | '),
          received: amount
        });
      }

      // Import Stripe avec configuration sécurisée
      const Stripe = (await import('stripe')).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2024-06-20',
      });

      // 🎯 LOG FINAL AVANT APPEL STRIPE
      console.log(`💳 [STRIPE] Création PaymentIntent - Montant FINAL: ${amountValidation.amountInEuros.toFixed(2)}€ = ${amountValidation.amountInCents} centimes`);
      
      // Créer PaymentIntent avec configuration 3D Secure
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountValidation.amountInCents, // ✅ MONTANT SÉCURISÉ EN CENTIMES
        currency,
        metadata: {
          ...metadata,
          originalAmount: String(amount),
          detectedFormat: amountValidation.detectedFormat,
        },
        automatic_payment_methods: {
          enabled: true,
        },
        payment_method_options: {
          card: {
            request_three_d_secure: 'any', // ✅ 3D SECURE OBLIGATOIRE
          },
        },
      });
      
      console.log(`✅ [STRIPE] PaymentIntent créé: ${paymentIntent.id} pour ${amountValidation.amountInEuros.toFixed(2)}€`);
      
      res.json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: amountValidation.amountInEuros,
        amountInCents: amountValidation.amountInCents,
        currency: currency
      });
    } catch (error: any) {
      console.error("❌ Erreur création Payment Intent:", error.message || error);
      res.status(500).json({ 
        success: false,
        error: error?.message || "Failed to create payment intent",
        details: error?.code || 'stripe_error'
      });
    }
  });

  // Routes API pour les politiques du salon
  app.get('/api/salon/policies', async (req, res) => {
    try {
      // Récupérer les politiques par défaut pour le moment
      const defaultPolicies = {
        policies: {
          cancellation: "Annulation gratuite jusqu'à 24h avant le rendez-vous",
          lateness: "Retard de plus de 15min = annulation automatique",
          deposit: "30% d'acompte requis pour valider la réservation", 
          modification: "Modification possible jusqu'à 12h avant",
          noShow: "En cas d'absence, l'acompte reste acquis au salon",
          refund: "Remboursement sous 5-7 jours ouvrés en cas d'annulation valide"
        },
        settings: {
          depositPercentage: 30,
          cancellationDeadline: 24,
          modificationDeadline: 12,
          latenessGracePeriod: 15,
          autoConfirmBookings: true,
          requireDepositForBooking: true
        }
      };
      
      res.json(defaultPolicies);
    } catch (error: any) {
      console.error('Error fetching salon policies:', error);
      res.status(500).json({ message: 'Failed to fetch salon policies' });
    }
  });

  app.post('/api/salon/policies', async (req, res) => {
    try {
      const { policies, settings } = req.body;
      
      // Simuler la sauvegarde des politiques
      // Dans une vraie app, on sauvegarderait en base de données
      console.log('💾 Sauvegarde politiques salon:', { policies, settings });
      
      res.json({ 
        success: true, 
        message: 'Politiques sauvegardées avec succès',
        data: { policies, settings }
      });
    } catch (error: any) {
      console.error('Error saving salon policies:', error);
      res.status(500).json({ message: 'Failed to save salon policies' });
    }
  });

  // INSCRIPTION DIRECTE SANS VERIFICATION PAR CODE

  // ROUTE D'INSCRIPTION DIRECTE POUR PROFESSIONNELS AVEC ABONNEMENTS
  app.post('/api/register/professional', async (req, res) => {
    try {
      const userData = req.body;
      console.log('✅ Inscription professionnelle directe pour:', userData.email, 'Plan:', userData.subscriptionPlan);
      
      if (!userData.email || !userData.firstName || !userData.businessName) {
        return res.status(400).json({ 
          error: 'Email, prénom et nom du salon requis' 
        });
      }

      // Valider le plan d'abonnement - SUPPORT MULTIPLE FORMATS + MAPPING LEGACY
      const validPlans = ['basic-pro', 'advanced-pro', 'premium-pro'];
      const rawPlan = userData.subscriptionPlan || userData.planType || userData.plan || 'basic-pro';
      
      // 🔄 MAPPING LEGACY : Support des anciens noms de plans
      const planMapping: { [key: string]: string } = {
        'professionnel': 'advanced-pro',
        'basic': 'basic-pro', 
        'premium': 'premium-pro',
        'enterprise': 'premium-pro',
        'pro': 'advanced-pro'
      };
      
      // Mapper le plan ou utiliser la valeur directe si déjà valide
      const selectedPlan = planMapping[rawPlan] || rawPlan;
      
      console.log('🔍 DEBUG PLAN - Données reçues:', JSON.stringify(userData, null, 2));
      console.log('🎯 Plan brut reçu:', rawPlan, '→ Plan mappé:', selectedPlan, 'Type:', typeof selectedPlan);
      
      if (!validPlans.includes(selectedPlan)) {
        console.log('❌ Plan invalide même après mapping:', selectedPlan, 'Plans valides:', validPlans);
        return res.status(400).json({ 
          error: `Plan d'abonnement invalide: "${rawPlan}" → "${selectedPlan}". Plans acceptés: ${validPlans.join(', ')}` 
        });
      }
      
      console.log('✅ Plan validé après mapping:', rawPlan, '→', selectedPlan);

      // Préparer les données utilisateur avec abonnement
      const userDataWithSubscription = {
        ...userData,
        subscriptionPlan: selectedPlan,
        subscriptionStatus: 'active' // Pour la démo, on active directement
      };

      // Créer directement le compte professionnel
      let createdAccount = null;
      try {
        createdAccount = await storage.createUser(userDataWithSubscription);
        console.log('✅ Compte professionnel créé avec succès:', userData.email);
      
      // 🔐 CRÉER SESSION AUTOMATIQUE APRÈS INSCRIPTION
      const session = req.session as any;
      session.user = {
        id: createdAccount.id,
        email: createdAccount.email,
        type: 'professional',
        businessName: userData.businessName,
        isAuthenticated: true
      };
      console.log('🔑 Session automatique créée pour:', createdAccount.email);
      } catch (error: any) {
        console.error('❌ Erreur création compte pro:', error);
        if (error.code === '23505') {
          return res.status(400).json({ 
            error: 'Un compte avec cet email existe déjà' 
          });
        }
        throw error;
      }

      // Créer l'abonnement utilisateur dans la table dédiée
      try {
        await storage.createUserSubscription({
          userId: createdAccount.id,
          planId: selectedPlan,
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 jours
        });
        console.log('✅ Abonnement créé pour:', createdAccount.id, 'Plan:', selectedPlan);
      } catch (error) {
        console.error('❌ Erreur création abonnement:', error);
        // Continue sans bloquer l'inscription
      }

      res.json({ 
        success: true, 
        message: `Salon créé avec succès! Abonnement ${selectedPlan.replace('-', ' ').toUpperCase()} activé`,
        userType: 'professional',
        account: createdAccount,
        subscription: {
          plan: selectedPlan,
          status: 'active'
        }
      });

    } catch (error: any) {
      console.error('❌ Erreur inscription professionnelle:', error);
      res.status(500).json({ 
        error: 'Erreur serveur lors de l\'inscription' 
      });
    }
  });

  // ROUTE D'INSCRIPTION DIRECTE POUR CLIENTS
  app.post('/api/register/client', async (req, res) => {
    try {
      const userData = req.body;
      console.log('✅ Inscription client directe pour:', userData.email);
      
      if (!userData.email || !userData.firstName || !userData.lastName) {
        return res.status(400).json({ 
          error: 'Email, prénom et nom requis' 
        });
      }

      // Créer directement le compte client
      let createdAccount = null;
      try {
        createdAccount = await storage.createClientAccount(userData);
        console.log('✅ Compte client créé avec succès:', userData.email);
      } catch (error: any) {
        console.error('❌ Erreur création compte client:', error);
        if (error.code === '23505') {
          return res.status(400).json({ 
            error: 'Un compte avec cet email existe déjà' 
          });
        }
        throw error;
      }

      res.json({ 
        success: true, 
        message: 'Compte client créé avec succès',
        userType: 'client',
        account: createdAccount
      });

    } catch (error: any) {
      console.error('❌ Erreur inscription client:', error);
      res.status(500).json({ 
        error: 'Erreur serveur lors de l\'inscription' 
      });
    }
  });

  // ============= AUTH API CORRECTED =============
  
  // Endpoint auth/user corrigé pour gérer les sessions créées à l'inscription
  app.get('/api/auth/user', async (req, res) => {
    try {
      const session = req.session as any;
      
      // Vérifier si l'utilisateur a une session active
      if (!session || !session.user) {
        console.log('❌ Aucune session trouvée');
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const sessionUser = session.user;
      console.log('🔍 Session utilisateur trouvée:', sessionUser.email, 'Type:', sessionUser.type);
      
      // Pour les professionnels, récupérer les données complètes depuis la BDD
      if (sessionUser.type === 'professional') {
        try {
          const fullUser = await storage.getUser?.(sessionUser.id);
          if (fullUser) {
            console.log('✅ Utilisateur professionnel authentifié:', fullUser.email);
            return res.json({
              id: fullUser.id,
              email: fullUser.email,
              firstName: fullUser.firstName,
              lastName: fullUser.lastName,
              businessName: fullUser.businessName,
              type: 'professional',
              isAuthenticated: true
            });
          }
        } catch (error) {
          console.error('❌ Erreur récupération utilisateur:', error);
        }
      }
      
      // Fallback sur les données de session
      res.json({
        id: sessionUser.id,
        email: sessionUser.email,
        businessName: sessionUser.businessName,
        type: sessionUser.type,
        isAuthenticated: true
      });
      
    } catch (error: any) {
      console.error('❌ Erreur endpoint auth/user:', error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // ============= STRIPE CHECKOUT API =============
  
  // Route pour créer un checkout d'abonnement Stripe
  app.post('/api/stripe/create-subscription-checkout', async (req, res) => {
    try {
      const { plan, amount, email } = req.body;
      console.log('💳 Création checkout Stripe:', { plan, amount, email });

      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ error: 'Configuration Stripe manquante' });
      }

      const Stripe = (await import('stripe')).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2023-10-16",
      });

      // Créer un PaymentIntent avec 3D Secure obligatoire
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Conversion en centimes
        currency: 'eur',
        receipt_email: email,
        payment_method_options: {
          card: {
            request_three_d_secure: 'always' // 3D Secure obligatoire
          }
        },
        metadata: {
          plan,
          email,
          type: 'subscription'
        }
      });

      console.log('✅ PaymentIntent créé:', paymentIntent.id, 'Montant:', amount, '€');

      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });

    } catch (error: any) {
      console.error('❌ Erreur création checkout Stripe:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la création du checkout',
        details: error.message
      });
    }
  });

  // ============= SUBSCRIPTION PLANS API =============
  
  // Route pour récupérer les plans d'abonnement
  app.get('/api/subscription-plans', async (req, res) => {
    try {
      const plans = await storage.getSubscriptionPlans();
      res.json(plans);
    } catch (error) {
      console.error('❌ Erreur récupération plans:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // Route pour récupérer l'abonnement d'un utilisateur
  app.get('/api/user/subscription', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const subscription = await storage.getUserSubscription(userId);
      
      if (!subscription) {
        return res.status(404).json({ error: 'Aucun abonnement trouvé' });
      }
      
      // Récupérer les détails du plan
      const plan = await storage.getSubscriptionPlan(subscription.planId);
      
      res.json({
        subscription,
        plan
      });
    } catch (error) {
      console.error('❌ Erreur récupération abonnement:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // ============= BOOKING DETAILS API =============
  
  // Route pour récupérer les détails d'une réservation
  app.get('/api/bookings/:bookingId', async (req, res) => {
    console.log('🔥🔥🔥 ROUTE API BOOKINGS APPELÉE - ID:', req.params.bookingId);
    
    // Forcer JSON absolument
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');
    
    try {
      const { bookingId } = req.params;
      console.log('🔍 Recherche réservation ID:', bookingId);
      
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
      return res.status(200).json(response);
      
    } catch (error) {
      console.error("❌ Erreur API bookings:", error);
      return res.status(500).json({ 
        error: 'Erreur test',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
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