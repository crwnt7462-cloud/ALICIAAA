import { storage } from './storage';

export const salonsData = [
  // COIFFURE - Salons de coiffure (salon Excellence supprimé)

  {
    id: "salon-moderne-republique",
    name: "Salon Moderne République",
    description: "Un salon urbain et branché près de République. Spécialisé dans les coupes tendances et les colorations créatives. L'équipe jeune et dynamique saura vous conseiller.",
    address: "12 Rue du Château d'Eau, 75010 Paris",
    phone: "01 48 03 25 67",
    email: "hello@salonmoderne.fr",
    photos: [
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1588609547484-3c23d3c45d4b?w=800&h=600&fit=crop&auto=format"
    ],
    coverImageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=400&fit=crop&crop=center",
    serviceCategories: [
      {
        id: 1,
        name: "Coiffure Créative",
        services: [
          { id: 1, name: "Coupe Rock", price: 55, duration: 60, description: "Coupe moderne et audacieuse" },
          { id: 2, name: "Coloration fantaisie", price: 100, duration: 120, description: "Couleurs vives et originales" },
          { id: 3, name: "Coupe + Color", price: 130, duration: 150, description: "Formule complète créative" }
        ]
      }
    ],
    tags: ["moderne", "république", "créatif", "tendance"],
    rating: 4.7,
    reviewCount: 198
  },

  // BARBIER - Salons barbier
  {
    id: "barbier-gentleman-marais",
    name: "Gentleman Barbier",
    description: "Barbier traditionnel dans le Marais. Service de rasage à l'ancienne, coupes classiques et modernes. Ambiance authentique avec des barbiers expérimentés.",
    address: "8 Rue des Rosiers, 75004 Paris",
    phone: "01 42 72 14 89",
    email: "contact@gentlemanbarbier.fr",
    photos: [
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&h=600&fit=crop&auto=format"
    ],
    coverImageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&h=400&fit=crop&crop=center",
    serviceCategories: [
      {
        id: 1,
        name: "Services Barbier",
        services: [
          { id: 1, name: "Coupe + Barbe", price: 40, duration: 45, description: "Coupe et taille de barbe professionnelle" },
          { id: 2, name: "Rasage traditionnel", price: 30, duration: 30, description: "Rasage au coupe-chou avec serviettes chaudes" },
          { id: 3, name: "Coupe homme", price: 25, duration: 30, description: "Coupe moderne ou classique" },
          { id: 4, name: "Soin barbe", price: 20, duration: 20, description: "Hydratation et mise en forme" }
        ]
      }
    ],
    tags: ["barbier", "marais", "traditionnel", "rasage"],
    rating: 4.8,
    reviewCount: 156
  },

  // ESTHETIQUE - Instituts de beauté
  {
    id: "institut-beaute-saint-germain",
    name: "Institut Beauté Saint-Germain",
    description: "Institut de beauté premium à Saint-Germain-des-Prés. Soins du visage, épilation, massages relaxants. Produits de luxe Sothys et Clarins.",
    address: "45 Boulevard Saint-Germain, 75006 Paris",
    phone: "01 43 26 89 45",
    email: "rdv@institut-sg.paris",
    photos: [
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&h=600&fit=crop&auto=format"
    ],
    coverImageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=400&fit=crop&crop=center",
    serviceCategories: [
      {
        id: 1,
        name: "Soins Visage",
        services: [
          { id: 1, name: "Soin éclat hydratant", price: 75, duration: 60, description: "Soin complet pour tous types de peau" },
          { id: 2, name: "Soin anti-âge premium", price: 120, duration: 90, description: "Soin raffermissant avec produits Sothys" },
          { id: 3, name: "Nettoyage de peau", price: 65, duration: 75, description: "Extraction des impuretés en douceur" }
        ]
      },
      {
        id: 2,
        name: "Épilation",
        services: [
          { id: 4, name: "Épilation sourcils", price: 25, duration: 20, description: "Mise en forme et épilation précise" },
          { id: 5, name: "Épilation jambes complètes", price: 45, duration: 45, description: "Épilation cire chaude" },
          { id: 6, name: "Épilation maillot", price: 35, duration: 30, description: "Épilation délicate et précise" }
        ]
      }
    ],
    tags: ["institut", "saint-germain", "sothys", "premium"],
    rating: 4.9,
    reviewCount: 287
  },

  // ONGLES - Salons de manucure
  {
    id: "nail-art-opera",
    name: "Nail Art Opéra",
    description: "Studio de nail art près de l'Opéra. Manucures artistiques, poses gel, nail art personnalisé. Techniques japonaises et produits OPI.",
    address: "18 Rue de la Paix, 75009 Paris",
    phone: "01 47 42 33 91",
    email: "booking@nailart-opera.com",
    photos: [
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1619451334792-150bdea40af2?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1595475884928-0ba7b2d59b09?w=800&h=600&fit=crop&auto=format"
    ],
    coverImageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&h=400&fit=crop&crop=center",
    serviceCategories: [
      {
        id: 1,
        name: "Manucure",
        services: [
          { id: 1, name: "Manucure française", price: 40, duration: 45, description: "French manucure classique" },
          { id: 2, name: "Pose gel couleur", price: 55, duration: 60, description: "Pose gel avec couleur au choix" },
          { id: 3, name: "Nail art créatif", price: 75, duration: 90, description: "Design personnalisé et unique" },
          { id: 4, name: "Dépose + manucure", price: 35, duration: 40, description: "Dépose gel et soin des ongles" }
        ]
      },
      {
        id: 2,
        name: "Pédicure",
        services: [
          { id: 5, name: "Pédicure complète", price: 50, duration: 60, description: "Soin complet des pieds" },
          { id: 6, name: "Pose gel pieds", price: 45, duration: 50, description: "Vernis gel longue tenue" }
        ]
      }
    ],
    tags: ["nail-art", "opéra", "opi", "japonais"],
    rating: 4.6,
    reviewCount: 142
  },

  // MASSAGE - Spas et centres de massage
  {
    id: "spa-wellness-bastille",
    name: "Spa Wellness Bastille",
    description: "Centre de bien-être près de Bastille. Massages thérapeutiques, relaxants, californiens. Hammam et sauna. Ambiance zen et apaisante.",
    address: "22 Rue de la Roquette, 75011 Paris",
    phone: "01 48 07 55 82",
    email: "detente@spa-wellness.fr",
    photos: [
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=600&fit=crop&auto=format"
    ],
    coverImageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=400&fit=crop&crop=center",
    serviceCategories: [
      {
        id: 1,
        name: "Massages",
        services: [
          { id: 1, name: "Massage suédois", price: 80, duration: 60, description: "Massage relaxant et décontractant" },
          { id: 2, name: "Massage deep tissue", price: 95, duration: 75, description: "Massage thérapeutique profond" },
          { id: 3, name: "Massage aux pierres chaudes", price: 110, duration: 90, description: "Relaxation complète aux pierres de basalte" },
          { id: 4, name: "Massage californien", price: 75, duration: 60, description: "Massage enveloppant et relaxant" }
        ]
      },
      {
        id: 2,
        name: "Spa",
        services: [
          { id: 5, name: "Accès hammam", price: 25, duration: 45, description: "Séance de hammam traditionnel" },
          { id: 6, name: "Forfait détente", price: 150, duration: 180, description: "Massage + hammam + tisane" }
        ]
      }
    ],
    tags: ["spa", "bastille", "hammam", "bien-être"],
    rating: 4.7,
    reviewCount: 203
  },

  // SALON MIXTE - Coiffure et esthétique
  {
    id: "beauty-lounge-montparnasse",
    name: "Beauty Lounge Montparnasse",
    description: "Concept store beauté à Montparnasse. Coiffure, esthétique, manucure sous un même toit. Équipe polyvalente et ambiance moderne.",
    address: "88 Boulevard du Montparnasse, 75014 Paris",
    phone: "01 43 35 67 21",
    email: "contact@beautylounge.paris",
    photos: [
      "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&h=600&fit=crop&auto=format"
    ],
    coverImageUrl: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800&h=400&fit=crop&crop=center",
    serviceCategories: [
      {
        id: 1,
        name: "Coiffure",
        services: [
          { id: 1, name: "Coupe + Brushing", price: 60, duration: 60, description: "Coupe moderne et brushing" },
          { id: 2, name: "Coloration", price: 95, duration: 120, description: "Coloration personnalisée" }
        ]
      },
      {
        id: 2,
        name: "Esthétique",
        services: [
          { id: 3, name: "Soin du visage", price: 70, duration: 60, description: "Soin hydratant adapté" },
          { id: 4, name: "Épilation sourcils", price: 20, duration: 20, description: "Épilation et restructuration" }
        ]
      },
      {
        id: 3,
        name: "Ongles",
        services: [
          { id: 5, name: "Manucure gel", price: 45, duration: 45, description: "Pose gel couleur" },
          { id: 6, name: "Manucure express", price: 25, duration: 30, description: "Manucure rapide" }
        ]
      }
    ],
    tags: ["concept-store", "montparnasse", "mixte", "moderne"],
    rating: 4.5,
    reviewCount: 167
  }
];

export async function seedSalons() {
  console.log('🏢 Création des salons de test avec photos...');
  
  try {
    for (const salonData of salonsData) {
      console.log(`📍 Création du salon: ${salonData.name}`);
      await storage.createSalon(salonData);
    }
    
    console.log(`✅ ${salonsData.length} salons créés avec succès!`);
    
    // Afficher les salons créés
    console.log('\n📋 Salons disponibles pour les tests:');
    salonsData.forEach((salon, index) => {
      const category = salon.serviceCategories[0]?.name || 'Mixte';
      console.log(`${index + 1}. ${salon.name} (${category}) - ${salon.address.split(',')[1]?.trim()}`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la création des salons:', error);
  }
}