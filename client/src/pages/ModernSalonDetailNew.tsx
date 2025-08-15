import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SalonPageTemplate } from "@/components/SalonPageTemplate";

// Import des données par défaut (simulé car le fichier server n'est pas accessible côté client)
const defaultServices = [
  {
    id: 1,
    name: 'Coupe homme classique',
    description: 'Coupe traditionnelle avec finition soignée',
    price: 35,
    duration: 45,
    category: 'Coupe & Styling',
    rating: 4.9,
    reviewCount: 87
  },
  {
    id: 2,
    name: 'Coupe moderne avec styling',
    description: 'Coupe tendance avec mise en forme personnalisée',
    price: 45,
    duration: 60,
    category: 'Coupe & Styling',
    rating: 4.8,
    reviewCount: 64
  },
  {
    id: 3,
    name: 'Taille de barbe complète',
    description: 'Taille, mise en forme et soins de la barbe',
    price: 25,
    duration: 30,
    category: 'Barbe & Moustache',
    rating: 4.9,
    reviewCount: 92
  },
  {
    id: 4,
    name: 'Rasage traditionnel',
    description: 'Rasage au blaireau avec serviettes chaudes',
    price: 30,
    duration: 45,
    category: 'Barbe & Moustache',
    rating: 4.8,
    reviewCount: 73
  },
  {
    id: 5,
    name: 'Soin capillaire hydratant',
    description: 'Traitement en profondeur pour cheveux secs',
    price: 40,
    duration: 60,
    category: 'Soins & Traitements',
    rating: 4.7,
    reviewCount: 45
  }
];

const defaultStaff = [
  {
    id: 1,
    name: 'Alexandre Martin',
    role: 'Barbier Senior',
    specialties: ['Coupes classiques', 'Rasage traditionnel', 'Soins barbe'],
    rating: 4.9,
    reviewsCount: 127,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 2,
    name: 'Sophie Dubois',
    role: 'Styliste',
    specialties: ['Coupes modernes', 'Colorations', 'Styling'],
    rating: 4.8,
    reviewsCount: 98,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b811b147?w=150&h=150&fit=crop&crop=face'
  }
];

const defaultReviews = [
  {
    id: 1,
    clientName: 'Marc D.',
    rating: 5,
    comment: 'Excellent service, très professionnel. Je recommande vivement !',
    date: '2024-01-15',
    service: 'Coupe & Styling',
    verified: true,
    ownerResponse: {
      message: 'Merci beaucoup Marc ! Nous sommes ravis de votre satisfaction.',
      date: '2024-01-16'
    }
  },
  {
    id: 2,
    clientName: 'Julie M.',
    rating: 5,
    comment: 'Salon très accueillant, personnel compétent. Résultat parfait !',
    date: '2024-01-10',
    service: 'Soins & Traitements',
    verified: true
  }
];

/**
 * Page salon utilisant automatiquement le SalonPageTemplate
 * Tous les nouveaux salons auront la même mise en page standardisée
 */
function ModernSalonDetailNew() {
  const [location] = useLocation();
  
  // Extraction du slug salon depuis l'URL
  const salonSlug = location.split('/salon/')[1];
  
  // Récupération des données salon depuis l'API
  const { data: salonData, isLoading } = useQuery({
    queryKey: [`/api/salon/${salonSlug}`],
    enabled: !!salonSlug,
    retry: false
  });
  
  // États de chargement
  if (!salonSlug) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Salon non spécifié</h1>
          <button 
            onClick={() => window.location.href = '/search'}
            className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Rechercher un salon
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du salon...</p>
        </div>
      </div>
    );
  }

  if (!salonData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Salon non trouvé</h1>
          <p className="text-gray-600 mb-4">Le salon {salonSlug} n'existe pas.</p>
          <button 
            onClick={() => window.location.href = '/search'}
            className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Rechercher un salon
          </button>
        </div>
      </div>
    );
  }

  // Adapter les données API au format SalonPageTemplate
  const templateData = {
    id: salonData.id || Math.floor(Math.random() * 10000),
    name: salonData.name || 'Salon',
    slug: salonSlug,
    description: salonData.description || 'Salon de beauté professionnel',
    address: salonData.address || 'Adresse non renseignée',
    phone: salonData.phone || 'Téléphone non renseigné',
    rating: salonData.rating || 4.8,
    reviewsCount: salonData.reviewsCount || 0,
    coverImageUrl: salonData.coverImageUrl,
    logo: salonData.logo,
    openingHours: salonData.openingHours || {
      'Lundi': { open: '09:00', close: '19:00' },
      'Mardi': { open: '09:00', close: '19:00' },
      'Mercredi': { open: '09:00', close: '19:00' },
      'Jeudi': { open: '09:00', close: '19:00' },
      'Vendredi': { open: '09:00', close: '20:00' },
      'Samedi': { open: '08:00', close: '18:00' },
      'Dimanche': { closed: true, open: '', close: '' }
    },
    amenities: salonData.amenities || ['Wi-Fi gratuit', 'Climatisation', 'Parking'],
    priceRange: salonData.priceRange || '€€',
    customColors: salonData.customColors
  };

  // Transformer les serviceCategories en format services plats
  const services = salonData.serviceCategories?.length > 0 
    ? salonData.serviceCategories.flatMap((category: any) => 
        category.services?.map((service: any) => ({
          ...service,
          category: category.name
        })) || []
      )
    : defaultServices;
  const staff = salonData.staff?.length > 0 ? salonData.staff : defaultStaff;
  const reviews = salonData.reviews?.length > 0 ? salonData.reviews : defaultReviews;

  // ✅ UTILISATION AUTOMATIQUE DU TEMPLATE STANDARDISÉ
  return (
    <SalonPageTemplate
      salonData={templateData}
      services={services}
      staff={staff}
      reviews={reviews}
      isOwner={false}
    />
  );
}

export default ModernSalonDetailNew;