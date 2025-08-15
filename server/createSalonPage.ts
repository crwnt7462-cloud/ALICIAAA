import { SalonData, SalonService, SalonStaff, SalonReview } from '../shared/salonTypes';

/**
 * Service pour créer automatiquement des pages salon avec le template SalonPageTemplate
 * Tous les nouveaux salons utiliseront automatiquement ce système
 */

interface CreateSalonPageData {
  name: string;
  slug: string;
  description: string;
  address: string;
  phone: string;
  services: SalonService[];
  staff?: SalonStaff[];
  reviews?: SalonReview[];
}

export class SalonPageCreator {
  /**
   * Crée une nouvelle page salon avec le template standardisé
   * Le template SalonPageTemplate sera automatiquement utilisé
   */
  static async createSalonPage(data: CreateSalonPageData): Promise<SalonData> {
    const salonData: SalonData = {
      id: Math.floor(Math.random() * 10000),
      name: data.name,
      slug: data.slug,
      description: data.description,
      address: data.address,
      phone: data.phone,
      rating: 4.8, // Note par défaut
      reviewsCount: Math.floor(Math.random() * 50) + 10, // 10-60 avis
      coverImageUrl: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=1200&h=400&fit=crop`,
      logo: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=200&h=200&fit=crop`,
      openingHours: {
        'Lundi': { open: '09:00', close: '19:00' },
        'Mardi': { open: '09:00', close: '19:00' },
        'Mercredi': { open: '09:00', close: '19:00' },
        'Jeudi': { open: '09:00', close: '19:00' },
        'Vendredi': { open: '09:00', close: '20:00' },
        'Samedi': { open: '08:00', close: '18:00' },
        'Dimanche': { closed: true, open: '', close: '' }
      },
      amenities: [
        'Wi-Fi gratuit',
        'Climatisation',
        'Parking gratuit',
        'Accès PMR',
        'Paiement sans contact'
      ],
      priceRange: '€€'
    };

    console.log(`✅ Salon créé automatiquement: ${salonData.name}`);
    console.log(`✅ Template SalonPageTemplate sera utilisé pour /salon/${salonData.slug}`);
    
    return salonData;
  }

  /**
   * Génère automatiquement des services par catégorie
   */
  static generateDefaultServices(): SalonService[] {
    return [
      // Coupe & Styling
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
      // Barbe & Moustache
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
      // Soins & Traitements
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
  }

  /**
   * Génère une équipe par défaut
   */
  static generateDefaultStaff(): SalonStaff[] {
    return [
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
  }

  /**
   * Génère des avis par défaut
   */
  static generateDefaultReviews(): SalonReview[] {
    return [
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
  }
}

// Export des types pour utilisation dans les templates
export type { CreateSalonPageData, SalonData, SalonService, SalonStaff, SalonReview };