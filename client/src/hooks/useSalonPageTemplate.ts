import { useState, useEffect } from 'react';

interface SalonService {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
}

interface SalonStaff {
  id: number;
  name: string;
  role: string;
  avatar?: string;
  specialties: string[];
  rating: number;
  reviewsCount: number;
}

interface SalonReview {
  id: number;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  service: string;
  verified: boolean;
  ownerResponse?: {
    message: string;
    date: string;
  };
}

interface SalonData {
  id: number;
  name: string;
  slug: string;
  description: string;
  address: string;
  phone: string;
  rating: number;
  reviewsCount: number;
  coverImageUrl?: string;
  logo?: string;
  openingHours: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };
  amenities: string[];
  priceRange: string;
  customColors?: {
    primary: string;
    accent: string;
    buttonText: string;
    buttonClass: string;
    priceColor: string;
    neonFrame: string;
    intensity: number;
  };
}

/**
 * Hook pour générer les données standardisées d'un salon
 * Peut être utilisé avec des données réelles ou par défaut
 */
export function useSalonPageTemplate(salonSlug: string): {
  salonData: SalonData | null;
  services: SalonService[];
  staff: SalonStaff[];
  reviews: SalonReview[];
  loading: boolean;
  isOwner: boolean;
} {
  const [salonData, setSalonData] = useState<SalonData | null>(null);
  const [services, setServices] = useState<SalonService[]>([]);
  const [staff, setStaff] = useState<SalonStaff[]>([]);
  const [reviews, setReviews] = useState<SalonReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const loadSalonData = async () => {
      try {
        // ✅ CORRECTION : Utiliser directement la route publique qui contient toutes les données
        console.log('🔍 Chargement salon public:', salonSlug);
        const salonResponse = await fetch(`/api/salon/${salonSlug}`);
        
        if (salonResponse.ok) {
          const salonResponseData = await salonResponse.json();
          console.log('✅ Données salon reçues:', salonResponseData);
          
          if (salonResponseData) {
            const salon = salonResponseData;
            const mappedSalonData: SalonData = {
              id: salon.id,
              name: salon.name,
              slug: salon.slug || salonSlug,
              description: salon.description || `Salon de beauté professionnel ${salon.name}`,
              address: salon.address || "Adresse non renseignée",
              phone: salon.phone || "Téléphone non renseigné",
              rating: salon.rating || 4.8,
              reviewsCount: salon.reviewCount || 0,
              coverImageUrl: salon.photos?.[0] || salon.coverImageUrl,
              logo: salon.logoUrl,
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
              customColors: salon.customColors
            };
            
            console.log('🎨 CustomColors récupérées:', salon.customColors);
            
            // ✅ INCLURE les serviceCategories complètes dans salonData
            const enrichedSalonData = {
              ...mappedSalonData,
              serviceCategories: salon.serviceCategories || []
            };
            
            setSalonData(enrichedSalonData);
            
            // ✅ Extraire les services des catégories
            if (salon.serviceCategories && salon.serviceCategories.length > 0) {
              const extractedServices: SalonService[] = [];
              
              salon.serviceCategories.forEach((category: any) => {
                if (category.services && category.services.length > 0) {
                  category.services.forEach((service: any) => {
                    extractedServices.push({
                      id: service.id,
                      name: service.name || 'Service sans nom',
                      description: service.description || `Service ${service.name || 'professionnel'}`,
                      price: service.price || 0,
                      duration: parseInt(service.duration) || 30,
                      category: category.name || 'Services',
                      rating: service.rating || 4.5,
                      reviewCount: service.reviewCount || 0,
                      photos: service.photos || []
                    });
                  });
                }
              });
              
              setServices(extractedServices);
              console.log('✅ Services extraits:', extractedServices.length, extractedServices);
            } else {
              console.log('⚠️ Aucune catégorie de services trouvée');
            }
            
            // ✅ Extraire l'équipe
            if (salon.professionals && salon.professionals.length > 0) {
              setStaff(salon.professionals);
              console.log('✅ Équipe extraite:', salon.professionals.length);
            }
            
            // ✅ Extraire les avis
            if (salon.reviews && salon.reviews.length > 0) {
              setReviews(salon.reviews);
              console.log('✅ Avis extraits:', salon.reviews.length);
            }
            
            setLoading(false);
            return;
          }
        } else {
          console.error('❌ Erreur lors du chargement du salon:', salonResponse.status);
        }
        
        // Fallback: essayer la route ownership
        try {
          const ownershipResponse = await fetch(`/api/salon/${salonSlug}/ownership`);
          if (ownershipResponse.ok) {
            const ownershipData = await ownershipResponse.json();
            setIsOwner(ownershipData.isOwner);
            
            if (ownershipData.salon) {
              const salon = ownershipData.salon;
              const mappedSalonData: SalonData = {
                slug: salon.slug || salonSlug,
                description: salon.description || `Salon de beauté professionnel ${salon.name}`,
                address: salon.address || "Adresse non renseignée",
                phone: salon.phone || "Téléphone non renseigné",
                rating: salon.rating || 4.8,
                reviewsCount: salon.reviewCount || 0,
                coverImageUrl: salon.photos?.[0] || salon.coverImageUrl,
                logo: salon.logoUrl,
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
                customColors: salon.customColors
              };
              
              setSalonData(mappedSalonData);
              
              // ✅ Extraire les services des catégories pour propriétaire aussi
              if (salon.serviceCategories && salon.serviceCategories.length > 0) {
                const extractedServices: SalonService[] = [];
                
                salon.serviceCategories.forEach((category: any) => {
                  if (category.services && category.services.length > 0) {
                    category.services.forEach((service: any) => {
                      extractedServices.push({
                        id: service.id,
                        name: service.name,
                        description: service.description || `Service ${service.name}`,
                        price: service.price,
                        duration: service.duration,
                        category: category.name || 'Services',
                        rating: service.rating,
                        reviewCount: service.reviewCount,
                        photos: service.photos || []
                      });
                    });
                  }
                });
                
                setServices(extractedServices);
                console.log('✅ Services propriétaire extraits:', extractedServices.length);
              }
              
              // ✅ Extraire l'équipe
              if (salon.professionals && salon.professionals.length > 0) {
                setStaff(salon.professionals);
                console.log('✅ Équipe extraite:', salon.professionals.length);
              }
              
              // ✅ Extraire les avis
              if (salon.reviews && salon.reviews.length > 0) {
                setReviews(salon.reviews);
                console.log('✅ Avis extraits:', salon.reviews.length);
              }
              
              setLoading(false);
              return;
            }
          }
        } catch (error) {
          console.log('❌ Erreur propriété salon:', error);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du salon:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSalonData();
  }, [salonSlug]);

  return {
    salonData,
    services,
    staff,
    reviews,
    loading,
    isOwner
  };
}

/**
 * Données par défaut pour les démonstrations
 */
export function getDefaultSalonData(salonName: string, salonSlug: string): {
  salonData: SalonData;
  services: SalonService[];
  staff: SalonStaff[];
  reviews: SalonReview[];
} {
  const defaultSalonData: SalonData = {
    id: Math.floor(Math.random() * 1000),
    name: salonName,
    slug: salonSlug,
    description: `Salon de beauté professionnel ${salonName} - Excellence et savoir-faire`,
    address: "123 Rue de la Beauté, 75001 Paris",
    phone: "01 23 45 67 89",
    rating: 4.8,
    reviewsCount: 127,
    coverImageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    logo: undefined,
    openingHours: {
      lundi: { open: '09:00', close: '19:00' },
      mardi: { open: '09:00', close: '19:00' },
      mercredi: { open: '09:00', close: '19:00' },
      jeudi: { open: '09:00', close: '19:00' },
      vendredi: { open: '09:00', close: '19:00' },
      samedi: { open: '09:00', close: '18:00' },
      dimanche: { closed: true, open: '', close: '' }
    },
    amenities: ['WiFi gratuit', 'Climatisation', 'Parking', 'Accessible PMR', 'Produits bio'],
    priceRange: '€€'
  };

  const defaultServices: SalonService[] = [
    {
      id: 1,
      name: "Coupe Femme",
      description: "Coupe personnalisée selon votre morphologie",
      price: 45,
      duration: 60,
      category: "coiffure"
    },
    {
      id: 2,
      name: "Coloration",
      description: "Coloration professionnelle avec produits haut de gamme",
      price: 80,
      duration: 120,
      category: "coiffure"
    },
    {
      id: 3,
      name: "Soin Visage",
      description: "Soin hydratant et purifiant adapté à votre peau",
      price: 60,
      duration: 75,
      category: "soins"
    },
    {
      id: 4,
      name: "Manucure",
      description: "Soin complet des mains et pose de vernis",
      price: 35,
      duration: 45,
      category: "ongles"
    }
  ];

  const defaultStaff: SalonStaff[] = [
    {
      id: 1,
      name: "Sophie Martin",
      role: "Directrice & Coiffeuse",
      specialties: ["Coupe", "Coloration", "Conseil"],
      rating: 4.9,
      reviewsCount: 89
    },
    {
      id: 2,
      name: "Julien Dubois",
      role: "Coiffeur",
      specialties: ["Coupe Homme", "Barbe", "Styling"],
      rating: 4.8,
      reviewsCount: 56
    },
    {
      id: 3,
      name: "Marie Laurent",
      role: "Esthéticienne",
      specialties: ["Soins Visage", "Épilation", "Maquillage"],
      rating: 4.7,
      reviewsCount: 34
    }
  ];

  const defaultReviews: SalonReview[] = [
    {
      id: 1,
      clientName: "Emma R.",
      rating: 5,
      comment: "Excellent accueil et prestation de qualité ! Sophie a su parfaitement comprendre mes attentes.",
      date: "Il y a 2 jours",
      service: "Coupe Femme",
      verified: true,
      ownerResponse: {
        message: "Merci Emma pour ce retour ! C'est toujours un plaisir de vous recevoir.",
        date: "Il y a 1 jour"
      }
    },
    {
      id: 2,
      clientName: "Thomas L.",
      rating: 5,
      comment: "Premier rendez-vous dans ce salon, très satisfait du résultat. Julien est très professionnel.",
      date: "Il y a 1 semaine",
      service: "Coupe Homme",
      verified: true
    },
    {
      id: 3,
      clientName: "Claire M.",
      rating: 4,
      comment: "Bon salon avec du personnel qualifié. Petit bémol sur l'attente mais sinon très bien.",
      date: "Il y a 2 semaines",
      service: "Soin Visage",
      verified: true,
      ownerResponse: {
        message: "Merci Claire ! Nous travaillons sur l'optimisation de nos créneaux pour réduire l'attente.",
        date: "Il y a 2 semaines"
      }
    }
  ];

  return {
    salonData: defaultSalonData,
    services: defaultServices,
    staff: defaultStaff,
    reviews: defaultReviews
  };
}