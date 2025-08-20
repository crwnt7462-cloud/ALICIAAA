import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Share2, Heart, Phone, MapPin, Star, Clock, ChevronDown, ChevronUp, Calendar, Info, Map, Instagram, Facebook, X } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';
import logoAvyento from '@assets/Logo avyento._1755714467098.png';

export default function ModernSalonCompact() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('services');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('coiffure');
  const [selectedServiceReviews, setSelectedServiceReviews] = useState<{serviceName: string, reviews: any[]} | null>(null);
  const [activeGalleryCategory, setActiveGalleryCategory] = useState('coiffure');
  const [selectedServiceGallery, setSelectedServiceGallery] = useState<{serviceName: string, photos: any[]} | null>(null);
  
  // Données du salon - STATIQUES UNIQUEMENT
  const salonData = {
    name: "Salon Avyento Démo",
    verified: true,
    rating: 4.8,
    reviewCount: 127,
    priceRange: "€€€",
    address: "123 Avenue des Champs-Élysées, 75008 Paris",
    backgroundImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=800&fit=crop&q=80"
  };

  // Onglets de navigation
  const tabs = [
    { id: 'services', label: 'Services', active: activeTab === 'services' },
    { id: 'equipe', label: 'Équipe', active: activeTab === 'equipe' },
    { id: 'galerie', label: 'Galerie', active: activeTab === 'galerie' },
    { id: 'infos', label: 'Infos', active: activeTab === 'infos' },
    { id: 'avis', label: 'Avis', active: activeTab === 'avis' }
  ];

  // Services avec photos
  const serviceCategories = [
    {
      id: 'coiffure',
      name: 'Coiffure',
      description: 'Coupes, colorations et coiffages',
      count: 4,
      services: [
        {
          name: 'Coupe homme classique',
          description: 'Coupe traditionnelle avec finition soignée',
          price: 35,
          duration: 45,
          rating: 4.5,
          reviews: 12,
          image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=100&h=100&fit=crop&q=80',
          photos: [
            { url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=400&fit=crop&q=80', description: 'Coupe classique avant' },
            { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80', description: 'Coupe classique après' },
            { url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&q=80', description: 'Finition soignée' }
          ],
          serviceReviews: [
            { name: "Marc D.", rating: 5, comment: "Excellente coupe, très professionnel !", date: "Il y a 3 jours" },
            { name: "Thomas L.", rating: 4, comment: "Bon service, je recommande.", date: "Il y a 1 semaine" },
            { name: "Pierre M.", rating: 5, comment: "Parfait comme toujours !", date: "Il y a 2 semaines" }
          ]
        },
        {
          name: 'Coupe & Brushing femme',
          description: 'Coupe personnalisée avec mise en forme',
          price: 55,
          duration: 75,
          rating: 4.8,
          reviews: 28,
          image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100&h=100&fit=crop&q=80',
          photos: [
            { url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop&q=80', description: 'Coupe femme avant' },
            { url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=400&fit=crop&q=80', description: 'Brushing terminé' },
            { url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop&q=80', description: 'Mise en forme' },
            { url: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&h=400&fit=crop&q=80', description: 'Résultat final' }
          ],
          serviceReviews: [
            { name: "Sophie R.", rating: 5, comment: "Magnifique coupe ! Je suis ravie du résultat.", date: "Il y a 2 jours" },
            { name: "Marie C.", rating: 5, comment: "Brushing parfait, très satisfaite.", date: "Il y a 5 jours" },
            { name: "Laura B.", rating: 4, comment: "Très bien, coiffeur à l'écoute.", date: "Il y a 1 semaine" },
            { name: "Camille T.", rating: 5, comment: "Service impeccable, je recommande vivement !", date: "Il y a 10 jours" }
          ]
        },
        {
          name: 'Coloration complète',
          description: 'Couleur uniforme sur toute la chevelure',
          price: 85,
          duration: 120,
          rating: 4.7,
          reviews: 15,
          image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=100&h=100&fit=crop&q=80',
          photos: [
            { url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=400&fit=crop&q=80', description: 'Avant coloration' },
            { url: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&h=400&fit=crop&q=80', description: 'Application couleur' },
            { url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop&q=80', description: 'Résultat final' }
          ]
        },
        {
          name: 'Mèches & Balayage',
          description: 'Technique de coloration naturelle',
          price: 95,
          duration: 150,
          rating: 4.9,
          reviews: 22,
          image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop&q=80',
          photos: [
            { url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop&q=80', description: 'Technique balayage' },
            { url: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&h=400&fit=crop&q=80', description: 'Mèches naturelles' },
            { url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=400&fit=crop&q=80', description: 'Avant/Après' },
            { url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop&q=80', description: 'Résultat lumineux' }
          ]
        }
      ]
    },
    {
      id: 'esthetique',
      name: 'Esthétique',
      description: 'Soins du visage et épilation',
      count: 3,
      services: [
        {
          name: 'Soin visage hydratant',
          description: 'Nettoyage et hydratation en profondeur',
          price: 65,
          duration: 60,
          rating: 4.6,
          reviews: 18,
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&q=80',
          photos: [
            { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&q=80', description: 'Préparation du soin' },
            { url: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop&q=80', description: 'Application hydratation' },
            { url: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=400&fit=crop&q=80', description: 'Résultat éclatant' }
          ],
          serviceReviews: [
            { name: "Emma P.", rating: 5, comment: "Soin relaxant, peau très douce après !", date: "Il y a 1 jour" },
            { name: "Julie M.", rating: 4, comment: "Très bien, bon rapport qualité-prix.", date: "Il y a 4 jours" },
            { name: "Sarah D.", rating: 5, comment: "Parfait, esthéticienne très professionnelle.", date: "Il y a 1 semaine" }
          ]
        },
        {
          name: 'Épilation jambes complètes',
          description: 'Épilation à la cire tiède',
          price: 45,
          duration: 45,
          rating: 4.4,
          reviews: 25,
          image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=100&h=100&fit=crop&q=80'
        },
        {
          name: 'Soin anti-âge',
          description: 'Traitement raffermissant et régénérant',
          price: 95,
          duration: 90,
          rating: 4.8,
          reviews: 12,
          image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=100&h=100&fit=crop&q=80'
        }
      ]
    }
  ];

  // Équipe
  const teamMembers = [
    {
      name: 'Sophie Martin',
      role: 'Directrice & Coiffeuse experte',
      specialties: ['Coupe', 'Coloration', 'Brushing'],
      experience: '15 ans d\'expérience',
      image: 'https://images.unsplash.com/photo-1494790108755-2616c479e32?w=150&h=150&fit=crop&q=80'
    },
    {
      name: 'Emma Dubois',
      role: 'Esthéticienne diplômée',
      specialties: ['Soins visage', 'Épilation', 'Massage'],
      experience: '8 ans d\'expérience',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80'
    },
    {
      name: 'Lucas Bernard',
      role: 'Coiffeur spécialisé homme',
      specialties: ['Coupe homme', 'Barbe', 'Rasage'],
      experience: '10 ans d\'expérience',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80'
    }
  ];

  // Avis clients avec réponses du salon
  const reviews = [
    {
      name: 'Marie L.',
      rating: 5,
      date: '2 jours',
      comment: 'Excellent salon ! Sophie a fait des merveilles avec ma couleur. Je recommande vivement !',
      service: 'Coloration complète',
      response: {
        author: 'Sophie Martin - Salon Avyento',
        date: '1 jour',
        message: 'Merci beaucoup Marie pour ce retour ! J\'ai pris beaucoup de plaisir à réaliser cette coloration. À très bientôt ! 💜'
      }
    },
    {
      name: 'Thomas R.',
      rating: 5,
      date: '1 semaine',
      comment: 'Lucas est un vrai professionnel. Coupe parfaite à chaque fois.',
      service: 'Coupe homme classique',
      response: {
        author: 'Lucas Bernard - Salon Avyento',
        date: '6 jours',
        message: 'Merci Thomas ! C\'est toujours un plaisir de vous accueillir. Votre fidélité nous fait très plaisir !'
      }
    },
    {
      name: 'Julie M.',
      rating: 4,
      date: '2 semaines',
      comment: 'Très bon soin du visage avec Emma. Peau toute douce après !',
      service: 'Soin visage hydratant',
      response: {
        author: 'Emma Dubois - Salon Avyento',
        date: '1 semaine',
        message: 'Ravie que le soin vous ait plu Julie ! N\'hésitez pas à revenir pour votre prochain soin. À bientôt !'
      }
    },
    {
      name: 'Camille P.',
      rating: 5,
      date: '3 semaines',
      comment: 'Balayage sublime ! Emma a parfaitement cerné mes attentes. Résultat naturel et lumineux.',
      service: 'Mèches & Balayage'
    }
  ];

  // Galerie organisée par catégories avec noms de prestations
  const galleryCategories = [
    {
      id: 'coiffure',
      name: 'Coiffure',
      count: 8,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop&q=80',
          service: 'Coupe & Brushing femme',
          description: 'Coupe moderne avec brushing'
        },
        {
          url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=400&fit=crop&q=80',
          service: 'Coupe homme classique',
          description: 'Coupe traditionnelle masculine'
        },
        {
          url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=400&fit=crop&q=80',
          service: 'Coloration complète',
          description: 'Coloration châtain doré'
        },
        {
          url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop&q=80',
          service: 'Mèches & Balayage',
          description: 'Balayage naturel blond'
        },
        {
          url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=400&fit=crop&q=80',
          service: 'Coupe tendance homme',
          description: 'Coupe moderne dégradée'
        },
        {
          url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=400&fit=crop&q=80',
          service: 'Mise en plis',
          description: 'Brushing volume et brillance'
        },
        {
          url: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=400&fit=crop&q=80',
          service: 'Coloration fantasy',
          description: 'Couleurs créatives'
        },
        {
          url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=400&fit=crop&q=80',
          service: 'Coiffage mariée',
          description: 'Chignon élégant'
        }
      ]
    },
    {
      id: 'esthetique',
      name: 'Esthétique',
      count: 6,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&q=80',
          service: 'Soin visage hydratant',
          description: 'Soin complet du visage'
        },
        {
          url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=400&fit=crop&q=80',
          service: 'Épilation jambes',
          description: 'Épilation à la cire'
        },
        {
          url: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=400&h=400&fit=crop&q=80',
          service: 'Soin anti-âge',
          description: 'Traitement raffermissant'
        },
        {
          url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=400&fit=crop&q=80',
          service: 'Manucure française',
          description: 'Pose vernis classique'
        },
        {
          url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&q=80',
          service: 'Extension de cils',
          description: 'Pose cils volume'
        },
        {
          url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&q=80',
          service: 'Massage relaxant',
          description: 'Massage bien-être'
        }
      ]
    },
    {
      id: 'avant-apres',
      name: 'Avant/Après',
      count: 4,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&h=400&fit=crop&q=80',
          service: 'Transformation coloration',
          description: 'Du brun au blond'
        },
        {
          url: 'https://images.unsplash.com/photo-1535130720025-72bc6eb37c44?w=400&h=400&fit=crop&q=80',
          service: 'Relooking complet',
          description: 'Coupe et couleur'
        },
        {
          url: 'https://images.unsplash.com/photo-1494790108755-2616c479e32?w=400&h=400&fit=crop&q=80',
          service: 'Soin réparateur',
          description: 'Cheveux abîmés à sains'
        },
        {
          url: 'https://images.unsplash.com/photo-1542596594-b5c2c2f51af9?w=400&h=400&fit=crop&q=80',
          service: 'Coiffage événement',
          description: 'Style casual à glamour'
        }
      ]
    }
  ];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const openServiceGallery = (serviceName: string, photos: any[]) => {
    setSelectedServiceGallery({ serviceName, photos });
  };

  console.log('ModernSalonCompact loaded - no API calls');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/50 to-purple-50/30">
      {/* Header moderne avec logo Avyento - FIXE */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="flex items-center justify-between p-4 lg:p-6 max-w-7xl mx-auto">
          <button 
            onClick={() => setLocation('/')}
            className="bg-gray-100/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-3 lg:p-4 text-gray-700 hover:bg-gray-200/80 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="h-5 w-5 lg:h-6 lg:w-6" />
          </button>

          {/* Logo Avyento centré */}
          <div className="flex-1 flex justify-center">
            <img 
              src={logoAvyento} 
              alt="Avyento" 
              className="h-8 lg:h-12 w-auto object-contain drop-shadow-sm"
            />
          </div>

          {/* Boutons actions - RESPONSIVE */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="bg-white/20 backdrop-blur-xl border border-white/40 rounded-xl sm:rounded-2xl p-2 sm:p-3 lg:p-4 text-gray-700 hover:bg-white/30 transition-all duration-300 shadow-2xl hover:shadow-white/10">
              <Share2 className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
              <span className="hidden xl:inline ml-2 font-medium text-sm lg:text-base">Partager</span>
            </button>
            <button className="bg-white/20 backdrop-blur-xl border border-white/40 rounded-xl sm:rounded-2xl p-2 sm:p-3 lg:p-4 text-gray-700 hover:bg-white/30 transition-all duration-300 shadow-2xl hover:shadow-white/10">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
              <span className="hidden xl:inline ml-2 font-medium text-sm lg:text-base">Favoris</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal avec image compacte */}
      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        
        {/* Image de fond salon avec informations superposées - MOBILE RESPONSIVE */}
        <div className="relative mb-6 sm:mb-8">
          <div 
            className="h-64 sm:h-80 lg:h-96 w-full bg-cover bg-center bg-no-repeat rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl"
            style={{ backgroundImage: `url(${salonData.backgroundImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            
            {/* Informations superposées - RESPONSIVE */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
              <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white mb-2 drop-shadow-lg">{salonData.name}</h1>
              <div className="flex items-center gap-2 text-white/90 mb-3 sm:mb-4">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-sm sm:text-base line-clamp-1">{salonData.address}</span>
              </div>
              
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 sm:h-4 sm:w-4 ${i < Math.floor(salonData.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/40'}`} 
                      />
                    ))}
                    <span className="ml-1 sm:ml-2 text-white font-semibold text-sm sm:text-base">{salonData.rating}</span>
                    <span className="text-white/70 text-xs sm:text-sm">({salonData.reviewCount} avis)</span>
                  </div>
                </div>
                
                {/* Encadré stats - RESPONSIVE */}
                <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl sm:rounded-2xl p-2 sm:p-4 shadow-xl">
                  <div className="grid grid-cols-2 gap-2 sm:gap-6 text-center">
                    <div>
                      <div className="text-lg sm:text-2xl font-bold text-white">{salonData.rating}</div>
                      <div className="text-[10px] sm:text-xs text-white/90">Note moyenne</div>
                    </div>
                    <div>
                      <div className="text-lg sm:text-2xl font-bold text-white">{salonData.reviewCount}</div>
                      <div className="text-[10px] sm:text-xs text-white/90">Avis clients</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Onglets modernes - MOBILE RESPONSIVE */}
        <div className="mb-4 sm:mb-6">
          <div className="flex justify-start gap-1 sm:gap-2 p-1 sm:p-2 bg-gray-100/80 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 sm:py-3 px-3 sm:px-6 rounded-lg sm:rounded-xl font-medium transition-all duration-300 text-sm sm:text-base whitespace-nowrap flex-shrink-0 ${
                  tab.active 
                    ? 'bg-white text-gray-900 shadow-lg' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu des onglets - Panel glassmorphisme */}
        <div className="bg-white/95 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl">
          
          {/* ONGLET SERVICES avec volets dépliants et photos */}
          {activeTab === 'services' && (
            <div className="p-6 lg:p-8">
              <div className="space-y-6">
                {serviceCategories.map((category) => (
                  <div key={category.id} className="bg-white/80 backdrop-blur-2xl border border-white/40 rounded-3xl overflow-hidden shadow-2xl hover:shadow-purple/10 hover:bg-white/85 transition-all duration-300">
                    {/* Header de catégorie compact */}
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full p-4 bg-gradient-to-r from-purple-50/70 to-violet-50/70 backdrop-blur-xl border-b border-white/30 hover:from-purple-100/70 hover:to-violet-100/70 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-left flex-1">
                          <h3 className="font-bold text-lg bg-gradient-to-r from-purple-700 to-violet-700 bg-clip-text text-transparent">{category.name}</h3>
                          <p className="text-gray-600 text-sm">{category.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-xs text-purple-700 bg-white/90 backdrop-blur-xl px-3 py-1 rounded-full font-medium border border-white/50 shadow-sm">
                            {category.count}
                          </div>
                          {expandedCategory === category.id ? (
                            <ChevronUp className="h-4 w-4 text-purple-600" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-purple-600" />
                          )}
                        </div>
                      </div>
                    </button>
                    
                    {/* Contenu dépliable compact */}
                    {expandedCategory === category.id && (
                      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                        {category.services.map((service, index) => (
                          <div key={index} className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-xl p-3 sm:p-4 hover:bg-white/90 hover:shadow-lg hover:shadow-purple/10 transition-all duration-300">
                            <div className="flex items-start gap-3 sm:gap-4">
                              {/* Photo de prestation - RESPONSIVE et CLIQUABLE */}
                              <div className="flex-shrink-0">
                                <button
                                  onClick={() => service.photos && openServiceGallery(service.name, service.photos)}
                                  className="relative group"
                                >
                                  <img
                                    src={service.image}
                                    alt={service.name}
                                    className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-lg sm:rounded-xl object-cover shadow-lg border border-white/40 group-hover:opacity-75 transition-all duration-300 cursor-pointer"
                                  />
                                  {service.photos && (
                                    <div className="absolute inset-0 bg-black/20 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                                      <div className="bg-white/90 backdrop-blur-xl text-gray-800 px-2 py-1 rounded-lg text-xs font-medium">
                                        {service.photos.length} photos
                                      </div>
                                    </div>
                                  )}
                                </button>
                              </div>
                              
                              {/* Contenu service - RESPONSIVE */}
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 sm:mb-3">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 text-base sm:text-lg mb-1 sm:mb-2">{service.name}</h4>
                                    <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">{service.description}</p>
                                  </div>
                                  <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mt-1 sm:mt-0 sm:ml-6">
                                    {service.price}€
                                  </div>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                                  <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="flex items-center gap-1 sm:gap-2 text-gray-600">
                                      <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                                      <span className="font-medium text-xs sm:text-sm">{service.duration} min</span>
                                    </div>
                                    <button 
                                      onClick={() => setSelectedServiceReviews({serviceName: service.name, reviews: service.serviceReviews || []})}
                                      className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-amber-600 transition-colors cursor-pointer"
                                    >
                                      <Star className="h-3 w-3 sm:h-4 sm:w-4 text-amber-400 fill-amber-400" />
                                      <span className="font-medium text-xs sm:text-sm">{service.rating} ({service.reviews})</span>
                                    </button>
                                  </div>
                                  <button 
                                    onClick={() => setLocation('/booking')}
                                    className="bg-gradient-to-r from-purple-600/90 to-violet-600/90 backdrop-blur-xl border border-white/30 text-white px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold hover:from-purple-700/90 hover:to-violet-700/90 transition-all duration-300 shadow-2xl hover:shadow-purple/20 w-full sm:w-auto"
                                  >
                                    Réserver
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* CARTE DU SALON - Ajoutée après les services */}
              <div className="mt-6 sm:mt-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:bg-white/90 transition-all duration-300 shadow-lg">
                  <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-4 flex items-center">
                    <Map className="h-5 w-5 mr-3 text-purple-600" />
                    Localisation du salon
                  </h3>
                  <div className="space-y-4">
                    <div className="text-sm sm:text-base text-gray-600">
                      <div className="flex items-start gap-2 mb-3">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>{salonData.address}</span>
                      </div>
                    </div>
                    
                    {/* Carte interactive (iframe Google Maps) */}
                    <div className="bg-gray-100 rounded-xl sm:rounded-2xl overflow-hidden border border-white/40">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.2739374821735!2d2.2944813156743623!3d48.873792007928746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66fda5b1a8af5%3A0x6ea9a6a56b1c6a3a!2sChamps-%C3%89lys%C3%A9es%2C%2075008%20Paris!5e0!3m2!1sfr!2sfr!4v1629800000000!5m2!1sfr!2sfr"
                        width="100%"
                        height="200"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-32 sm:h-48 lg:h-56"
                        title="Localisation du salon"
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                      <button 
                        onClick={() => window.open('https://maps.google.com/?q=123+Avenue+des+Champs-Élysées,+75008+Paris', '_blank')}
                        className="flex-1 bg-gradient-to-r from-purple-600/90 to-violet-600/90 backdrop-blur-xl border border-white/30 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-xl text-sm sm:text-base font-semibold hover:from-purple-700/90 hover:to-violet-700/90 transition-all duration-300 shadow-2xl hover:shadow-purple/20 text-center"
                      >
                        Ouvrir dans Maps
                      </button>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(salonData.address);
                          // Toast notification could be added here
                        }}
                        className="flex-1 bg-white/80 backdrop-blur-xl border border-white/40 text-gray-700 py-2 sm:py-3 px-4 sm:px-6 rounded-xl text-sm sm:text-base font-medium hover:bg-white/90 transition-all duration-300 shadow-lg text-center"
                      >
                        Copier l'adresse
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ONGLET ÉQUIPE */}
          {activeTab === 'equipe' && (
            <div className="p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Notre équipe d'experts</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {teamMembers.map((member, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-6 text-center hover:bg-white/90 hover:shadow-xl hover:shadow-purple/10 transition-all duration-300">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover shadow-lg border-4 border-white/50"
                    />
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-purple-600 font-medium mb-3">{member.role}</p>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {member.specialties.map((specialty, idx) => (
                          <span key={idx} className="bg-purple-100/80 backdrop-blur-xl text-purple-700 px-3 py-1 rounded-full text-sm border border-white/40">
                            {specialty}
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-600 text-sm mt-3">{member.experience}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ONGLET GALERIE */}
          {activeTab === 'galerie' && (
            <div className="p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Nos réalisations</h2>
              
              {/* Navigation des catégories */}
              <div className="mb-6">
                <div className="flex justify-center gap-2 sm:gap-4 p-1 sm:p-2 bg-gray-100/80 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg overflow-x-auto">
                  {galleryCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveGalleryCategory(category.id)}
                      className={`py-2 sm:py-3 px-3 sm:px-6 rounded-lg sm:rounded-xl font-medium transition-all duration-300 text-sm sm:text-base whitespace-nowrap flex-shrink-0 ${
                        activeGalleryCategory === category.id 
                          ? 'bg-white text-gray-900 shadow-lg' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                      }`}
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Galerie de la catégorie active */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryCategories
                  .find(cat => cat.id === activeGalleryCategory)
                  ?.images.map((image, index) => (
                    <div key={index} className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl overflow-hidden hover:bg-white/90 hover:shadow-xl hover:shadow-purple/10 transition-all duration-300 shadow-lg">
                      <img
                        src={image.url}
                        alt={image.service}
                        className="w-full h-32 sm:h-40 object-cover"
                      />
                      <div className="p-3">
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">{image.service}</h4>
                        <p className="text-gray-600 text-xs">{image.description}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ONGLET INFOS */}
          {activeTab === 'infos' && (
            <div className="p-6 lg:p-8">
              <div className="space-y-8">
                <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center">
                    <Info className="h-5 w-5 mr-3 text-purple-600" />
                    Informations pratiques
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Adresse</h4>
                      <p className="text-gray-600">{salonData.address}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Téléphone</h4>
                      <p className="text-gray-600">+33 1 23 45 67 89</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-3 text-purple-600" />
                    Horaires d'ouverture
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Lundi - Vendredi</span>
                      <span className="text-gray-600">9h00 - 19h00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Samedi</span>
                      <span className="text-gray-600">9h00 - 18h00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Dimanche</span>
                      <span className="text-gray-600">Fermé</span>
                    </div>
                  </div>
                </div>
                
                {/* Section Réseaux Sociaux */}
                <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center">
                    <Share2 className="h-5 w-5 mr-3 text-purple-600" />
                    Retrouvez-nous sur les réseaux
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {/* Instagram */}
                    <a 
                      href="https://instagram.com/salon_avyento" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-gradient-to-r from-pink-500/90 to-purple-500/90 backdrop-blur-xl border border-white/30 text-white px-4 sm:px-6 py-3 rounded-xl font-medium hover:from-pink-600/90 hover:to-purple-600/90 transition-all duration-300 shadow-lg hover:shadow-pink/20"
                    >
                      <Instagram className="h-5 w-5" />
                      <span className="text-sm sm:text-base">Instagram</span>
                    </a>
                    
                    {/* Facebook */}
                    <a 
                      href="https://facebook.com/salon.avyento" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-gradient-to-r from-blue-600/90 to-blue-500/90 backdrop-blur-xl border border-white/30 text-white px-4 sm:px-6 py-3 rounded-xl font-medium hover:from-blue-700/90 hover:to-blue-600/90 transition-all duration-300 shadow-lg hover:shadow-blue/20"
                    >
                      <Facebook className="h-5 w-5" />
                      <span className="text-sm sm:text-base">Facebook</span>
                    </a>
                    
                    {/* TikTok */}
                    <a 
                      href="https://tiktok.com/@salon_avyento" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-gradient-to-r from-gray-900/90 to-black/90 backdrop-blur-xl border border-white/30 text-white px-4 sm:px-6 py-3 rounded-xl font-medium hover:from-black/90 hover:to-gray-800/90 transition-all duration-300 shadow-lg hover:shadow-gray/20"
                    >
                      <FaTiktok className="h-5 w-5" />
                      <span className="text-sm sm:text-base">TikTok</span>
                    </a>
                  </div>
                  
                  <div className="mt-4 p-3 bg-purple-50/80 backdrop-blur-xl border border-purple-200/40 rounded-xl">
                    <p className="text-sm text-purple-700">
                      Suivez-nous pour découvrir nos dernières créations, tendances beauté et conseils d'experts !
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ONGLET AVIS */}
          {activeTab === 'avis' && (
            <div className="p-6 lg:p-8">
              <div className="mb-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className="h-6 w-6 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{salonData.rating}</span>
                </div>
                <p className="text-gray-600">Basé sur {salonData.reviewCount} avis vérifiés</p>
              </div>
              
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-6 hover:bg-white/90 transition-all duration-300 shadow-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{review.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">
                            {Array.from({ length: review.rating }, (_, i) => (
                              <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">Il y a {review.date}</span>
                        </div>
                      </div>
                      <span className="bg-purple-100/80 backdrop-blur-xl text-purple-700 px-3 py-1 rounded-full text-sm border border-white/40">
                        {review.service}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{review.comment}</p>
                    
                    {/* Réponse du salon */}
                    {review.response && (
                      <div className="bg-gradient-to-r from-purple-50/80 to-violet-50/80 backdrop-blur-xl border border-purple-200/40 rounded-2xl p-4 mt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">SA</span>
                          </div>
                          <div>
                            <p className="font-semibold text-purple-800 text-sm">{review.response.author}</p>
                            <p className="text-xs text-purple-600">Il y a {review.response.date}</p>
                          </div>
                        </div>
                        <p className="text-purple-700 text-sm leading-relaxed">{review.response.message}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PIED DE PAGE - Identique à la page d'accueil */}
        <div className="mt-16 text-center text-xs text-gray-500 pb-8">
          <p>© 2025 Beauty Pro. Plateforme de gestion professionnelle.</p>
        </div>
      </div>
      
      {/* MODAL AVIS SPÉCIFIQUES D'UN SERVICE */}
      {selectedServiceReviews && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-xl border border-white/40 rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200/40">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Avis pour</h3>
                <p className="text-purple-600 font-semibold">{selectedServiceReviews.serviceName}</p>
              </div>
              <button
                onClick={() => setSelectedServiceReviews(null)}
                className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-full p-2 hover:bg-white/90 transition-all duration-300 shadow-lg"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {selectedServiceReviews.reviews.length > 0 ? (
                <div className="space-y-4">
                  {selectedServiceReviews.reviews.map((review, index) => (
                    <div key={index} className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl p-4 hover:bg-white/70 transition-all duration-300">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{review.name}</h4>
                          <p className="text-xs text-gray-500">{review.date}</p>
                        </div>
                        <div className="flex">
                          {Array.from({ length: review.rating }, (_, i) => (
                            <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Aucun avis disponible pour cette prestation</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal pour la galerie de photos d'un service */}
      {selectedServiceGallery && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl border border-white/40 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="p-4 sm:p-6 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                  Photos - {selectedServiceGallery.serviceName}
                </h3>
                <button
                  onClick={() => setSelectedServiceGallery(null)}
                  className="bg-gray-100/80 backdrop-blur-xl border border-gray-200/50 rounded-xl p-2 text-gray-600 hover:bg-gray-200/80 transition-all duration-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {selectedServiceGallery.photos.length} photo{selectedServiceGallery.photos.length > 1 ? 's' : ''} disponible{selectedServiceGallery.photos.length > 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {selectedServiceGallery.photos.map((photo, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl overflow-hidden hover:bg-white/90 hover:shadow-xl hover:shadow-purple/10 transition-all duration-300">
                    <img
                      src={photo.url}
                      alt={photo.description}
                      className="w-full h-48 sm:h-56 lg:h-64 object-cover"
                    />
                    <div className="p-3 sm:p-4">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {photo.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}