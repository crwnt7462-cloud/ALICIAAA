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
        // Vérifier d'abord la propriété du salon (si utilisateur connecté)
        try {
          const ownershipResponse = await fetch(`/api/salon/${salonSlug}/ownership`);
          if (ownershipResponse.ok) {
            const ownershipData = await ownershipResponse.json();
            setIsOwner(ownershipData.isOwner);
            
            if (ownershipData.salon && ownershipData.isOwner) {
              // Utiliser les données complètes si propriétaire
              const salon = ownershipData.salon;
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
              
              setSalonData(mappedSalonData);
              setLoading(false);
              return;
            }
          }
        } catch (error) {
          console.log('Vérification propriété non disponible (utilisateur non connecté)');
        }

        // Charger les données du salon (méthode classique)
        const salonResponse = await fetch(`/api/salons/by-slug/${salonSlug}`);
        if (salonResponse.ok) {
          const salon = await salonResponse.json();
          
          // Mapper les données vers le format template
          const mappedSalonData: SalonData = {
            id: salon.id,
            name: salon.name,
            slug: salon.slug,
            description: salon.description || `Salon de beauté professionnel ${salon.name}`,
            address: salon.address || "Adresse non renseignée",
            phone: salon.phone || "Téléphone non renseigné",
            rating: salon.rating || 4.8,
            reviewsCount: salon.reviewsCount || 0,
            coverImageUrl: salon.coverImageUrl,
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
          
          // Charger les services (si disponibles)
          try {
            const servicesResponse = await fetch(`/api/salons/${salon.id}/services`);
            if (servicesResponse.ok) {
              const servicesData = await servicesResponse.json();
              setServices(servicesData);
            }
          } catch (error) {
            console.log('Services non disponibles pour ce salon');
          }
          
          // Charger l'équipe (si disponible)
          try {
            const staffResponse = await fetch(`/api/salons/${salon.id}/staff`);
            if (staffResponse.ok) {
              const staffData = await staffResponse.json();
              setStaff(staffData);
            }
          } catch (error) {
            console.log('Équipe non disponible pour ce salon');
          }
          
          // Charger les avis (si disponibles)
          try {
            const reviewsResponse = await fetch(`/api/salons/${salon.id}/reviews`);
            if (reviewsResponse.ok) {
              const reviewsData = await reviewsResponse.json();
              setReviews(reviewsData);
            }
          } catch (error) {
            console.log('Avis non disponibles pour ce salon');
          }
          
        } else {
          console.error('Salon non trouvé:', salonSlug);
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