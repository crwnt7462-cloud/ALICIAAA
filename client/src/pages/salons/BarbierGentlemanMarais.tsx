import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Phone, 
  Clock, 
  User,
  Calendar,
  CheckCircle,
  Award,
  ChevronDown,
  ChevronUp,
  Camera,
  X,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Service {
  id: number;
  name: string;
  price: number;
  duration: string;
  description?: string;
  photos?: string[];
}

interface ServiceCategory {
  id: number;
  name: string;
  expanded: boolean;
  services: Service[];
}

interface SalonData {
  id: string;
  name: string;
  description?: string;
  longDescription?: string;
  address?: string;
  phone?: string;
  rating?: number;
  reviews?: number;
  verified?: boolean;
  coverImageUrl?: string;
  photos?: string[];
  themeColor?: string;
  certifications?: string[];
  specialties?: string[];
  awards?: string[];
  serviceCategories?: ServiceCategory[];
}

export default function BarbierGentlemanMarais() {
  // TOUS LES HOOKS DOIVENT ÊTRE EN PREMIER, AVANT TOUTE CONDITION
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('services');
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [photoGalleryOpen, setPhotoGalleryOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(new Set());
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([
    {
      id: 1,
      name: 'Coupes Homme',
      expanded: true,
      services: [
        { 
          id: 1, 
          name: 'Coupe Classique', 
          price: 35, 
          duration: '30min', 
          description: 'Coupe traditionnelle aux ciseaux et tondeuse, réalisée avec précision selon les techniques barbier authentiques. Notre expert vous conseille sur la coupe la mieux adaptée à votre morphologie et votre style de vie.',
          photos: ['https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400', 'https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?w=400']
        },
        { 
          id: 2, 
          name: 'Coupe Dégradée', 
          price: 40, 
          duration: '35min', 
          description: 'Dégradé moderne et personnalisé avec finitions impeccables'
        },
        { 
          id: 3, 
          name: 'Coupe + Barbe', 
          price: 55, 
          duration: '45min', 
          description: 'Forfait complet alliant coupe de cheveux professionnelle et taille de barbe experte. Un service premium qui inclut l\'entretien de votre barbe avec des produits de qualité supérieure pour un résultat impeccable.',
          photos: ['https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?w=400', 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400']
        },
        { 
          id: 4, 
          name: 'Coupe Enfant (-12 ans)', 
          price: 25, 
          duration: '25min', 
          description: 'Coupe spéciale pour les petits messieurs avec attention particulière'
        }
      ]
    },
    {
      id: 2,
      name: 'Barbe & Rasage',
      expanded: false,
      services: [
        { 
          id: 5, 
          name: 'Taille de Barbe', 
          price: 25, 
          duration: '20min', 
          description: 'Taille et mise en forme de barbe avec précision et style'
        },
        { 
          id: 6, 
          name: 'Rasage Traditionnel', 
          price: 45, 
          duration: '40min', 
          description: 'Rasage complet au coupe-chou avec serviettes chaudes dans la pure tradition barbier. Une expérience relaxante et authentique avec des produits de soin haut de gamme pour une peau douce et apaisée.',
          photos: ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400', 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400']
        },
        { 
          id: 7, 
          name: 'Barbe + Moustache', 
          price: 30, 
          duration: '25min', 
          description: 'Entretien complet barbe et moustache'
        },
        { 
          id: 8, 
          name: 'Rasage de Luxe', 
          price: 65, 
          duration: '1h', 
          description: 'Expérience complète avec soins visage premium, rasage traditionnel et finitions luxueuses. Un moment de détente absolue avec masque hydratant, serviettes chaudes et massage du visage pour une expérience sensorielle unique.',
          photos: ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400', 'https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?w=400', 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400']
        }
      ]
    },
    {
      id: 3,
      name: 'Soins Homme',
      expanded: false,
      services: [
        { id: 9, name: 'Soin Visage Homme', price: 50, duration: '45min', description: 'Nettoyage et hydratation du visage' },
        { id: 10, name: 'Masque Purifiant', price: 35, duration: '30min', description: 'Masque spécial peau masculine' },
        { id: 11, name: 'Épilation Sourcils', price: 15, duration: '15min', description: 'Épilation et mise en forme des sourcils' }
      ]
    }
  ]);

  // Extraire l'ID du salon depuis l'URL
  const salonId = location.startsWith('/salon/') ? location.substring(7) : 'barbier-gentleman-marais';
  
  // Récupérer les données du salon depuis l'API
  const { data: salonData, isLoading } = useQuery<SalonData>({
    queryKey: [`/api/salon/${salonId}`],
    enabled: !!salonId,
  });

  // Données par défaut pour éviter les erreurs pendant le loading
  const defaultSalonData: SalonData = {
    id: salonId,
    name: 'Salon en cours de chargement...',
    rating: 5.0,
    reviews: 0,
    address: '',
    phone: '',
    verified: true,
    certifications: [],
    awards: [],
    longDescription: '',
    coverImageUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    photos: [],
    themeColor: '#f59e0b', // couleur ambre par défaut
  };

  const salon: SalonData = salonData || defaultSalonData;

  // Utiliser les services de l'API si disponibles, sinon les services par défaut
  const apiServiceCategories = salonData?.serviceCategories || [];
  const displayServiceCategories = apiServiceCategories.length > 0 ? apiServiceCategories : serviceCategories;

  const toggleCategory = (categoryId: number) => {
    setServiceCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, expanded: !cat.expanded }
          : cat
      )
    );
  };

  const openPhotoGallery = (photos: string[], startIndex: number = 0) => {
    setSelectedPhotos(photos);
    setCurrentPhotoIndex(startIndex);
    setPhotoGalleryOpen(true);
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % selectedPhotos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + selectedPhotos.length) % selectedPhotos.length);
  };

  const toggleDescription = (serviceId: number) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId);
      } else {
        newSet.add(serviceId);
      }
      return newSet;
    });
  };

  const truncateDescription = (text: string, maxLength: number = 80): { text: string; isTruncated: boolean } => {
    if (text.length <= maxLength) {
      return { text, isTruncated: false };
    }
    return { text: text.slice(0, maxLength) + '...', isTruncated: true };
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header avec photo de couverture - Design mobile exact */}
      <div className="relative h-80 bg-gradient-to-br from-amber-600 to-orange-700">
        <img 
          src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          alt="Gentleman Barbier"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40"></div>
        
        {/* Bouton retour - Style Avyento */}
        <button 
          onClick={() => {
            console.log('🔙 Bouton retour cliqué - Navigation vers /search');
            setLocation('/search');
          }}
          className="absolute top-8 left-4 avyento-button-secondary w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center z-10"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        
        {/* Informations salon en overlay - Style Avyento */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-0">Gentleman Barbier</h1>
            <CheckCircle className="h-6 w-6 text-blue-400" />
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">4.9</span>
              <span className="opacity-90">(189 avis)</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 opacity-90" />
              <span className="opacity-90">Le Marais</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets - Style Avyento */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="flex">
          {[
            { id: 'services', label: 'Services', icon: Calendar },
            { id: 'info', label: 'Infos', icon: MapPin },
            { id: 'avis', label: 'Avis', icon: Star }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-2 py-4 px-4 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'text-violet-600 border-b-2 border-violet-600 bg-violet-50/50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              style={{ flex: '0 0 33.33%' }}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu des onglets - Style mobile exact */}
      <div className="bg-white p-6 pb-6">
        {activeTab === 'services' && (
          <div className="space-y-4">
            {displayServiceCategories.map((category: ServiceCategory) => (
              <div key={category.id} className="avyento-card overflow-hidden">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-semibold text-lg text-gray-900">{category.name}</h3>
                  {category.expanded ? 
                    <ChevronUp className="h-5 w-5 text-gray-400" /> : 
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  }
                </button>
                
                {category.expanded && (
                  <div className="border-t border-gray-100">
                    <div className="space-y-0">
                      {category.services.map((service: Service) => {
                        const { text: truncatedDescription, isTruncated } = service.description ? truncateDescription(service.description) : { text: '', isTruncated: false };
                        const isExpanded = expandedDescriptions.has(service.id);
                        
                        return (
                          <div key={service.id} className="p-5 border-b border-gray-50 last:border-b-0">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{service.name}</h4>
                                
                                {/* Galerie photos */}
                                {service.photos && service.photos.length > 0 && (
                                  <div className="flex gap-2 mt-2 mb-2">
                                    {service.photos.slice(0, 3).map((photo, index) => (
                                      <div key={index} className="relative">
                                        <img 
                                          src={photo} 
                                          alt={`${service.name} ${index + 1}`}
                                          className="w-12 h-12 rounded-lg object-cover cursor-pointer hover:scale-105 transition-transform"
                                          onClick={() => openPhotoGallery(service.photos || [], index)}
                                        />
                                        {index === 2 && service.photos.length > 3 && (
                                          <div 
                                            className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center cursor-pointer"
                                            onClick={() => openPhotoGallery(service.photos || [], index)}
                                          >
                                            <span className="text-white text-xs font-semibold">+{service.photos.length - 3}</span>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                    {service.photos.length > 0 && (
                                      <button
                                        onClick={() => openPhotoGallery(service.photos || [], 0)}
                                        className="w-12 h-12 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-violet-400 transition-colors"
                                      >
                                        <Camera className="h-4 w-4 text-gray-400" />
                                      </button>
                                    )}
                                  </div>
                                )}
                                
                                {/* Description avec voir plus */}
                                {service.description && (
                                  <div className="mt-1">
                                    <p className="text-sm text-gray-500">
                                      {isExpanded ? service.description : truncatedDescription}
                                    </p>
                                    {isTruncated && (
                                      <button
                                        onClick={() => toggleDescription(service.id)}
                                        className="text-violet-600 text-sm font-medium hover:text-violet-700 mt-1 flex items-center gap-1"
                                      >
                                        {isExpanded ? 'Voir moins' : 'Voir plus'}
                                        <MoreHorizontal className="h-3 w-3" />
                                      </button>
                                    )}
                                  </div>
                                )}
                                
                                <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                                  <Clock className="h-3 w-3" />
                                  {service.duration}
                                </div>
                              </div>
                              <div className="text-right ml-4">
                                <p className="font-bold text-xl text-gray-900">{service.price}€</p>
                              </div>
                            </div>
                            <button 
                              className="avyento-button-secondary w-full"
                              onClick={() => {
                                console.log('[CLICK] type=service-booking, salon=barbier-gentleman-marais, service=' + service.name);
                                setLocation('/salon-booking/barbier-gentleman-marais');
                              }}
                            >
                              Réserver
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'info' && (
          <div className="space-y-6">
            <div className="avyento-card">
              <h3 className="avyento-subtitle text-gray-900 mb-4">À propos</h3>
                <p className="text-gray-700 mb-6">{salon.description || salon.longDescription || 'Découvrez notre salon de beauté et nos services personnalisés.'}</p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span>{salon.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span>{salon.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span>Mar-Sam: 9h-19h • Lun: Fermé • Dim: 10h-17h</span>
                  </div>
                </div>
            </div>

            <div className="avyento-card">
              <h3 className="avyento-subtitle text-gray-900 mb-4">Spécialités & Expertise</h3>
                <div className="space-y-3">
                  {(salon.certifications || salon.specialties || []).map((cert, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-amber-500" />
                      <span className="text-sm">{cert}</span>
                    </div>
                  ))}
                </div>
                
                {(salon.awards || []).length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Distinctions</h4>
                    <div className="flex flex-wrap gap-2">
                      {(salon.awards || []).map((award, index) => (
                        <Badge key={index} variant="secondary" className="bg-amber-100 text-amber-800">
                          {award}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}

        {activeTab === 'avis' && (
          <div className="space-y-4">
            <div className="text-center py-8">
              <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {salon.rating || 5.0}/5 étoiles
              </h3>
              <p className="text-gray-600">
                Basé sur {salon.reviews || 0} avis clients
              </p>
            </div>
            
            {/* Avis exemple */}
            <div className="avyento-card p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">Pierre D.</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Il y a 1 semaine</p>
                    <p className="text-sm">"Un vrai barbier à l'ancienne ! Le rasage au coupe-chou était parfait et l'ambiance du salon authentique. Je reviendrai sans hésitation."</p>
                  </div>
                </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Carrousel Photos - Style Avyento */}
      {photoGalleryOpen && selectedPhotos.length > 0 && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="avyento-card max-w-4xl w-full max-h-[90vh] relative">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="avyento-subtitle text-gray-900 mb-0">
                Photo {currentPhotoIndex + 1} sur {selectedPhotos.length}
              </h3>
              <button
                onClick={() => setPhotoGalleryOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            {/* Carrousel */}
            <div className="relative bg-gray-100">
              <img
                src={selectedPhotos[currentPhotoIndex]}
                alt={`Photo ${currentPhotoIndex + 1}`}
                className="w-full h-96 object-cover"
              />
              
              {/* Boutons navigation */}
              {selectedPhotos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all"
                  >
                    <ChevronLeft className="h-6 w-6 text-gray-700" />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all"
                  >
                    <ChevronRight className="h-6 w-6 text-gray-700" />
                  </button>
                </>
              )}
              
              {/* Indicateurs */}
              {selectedPhotos.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {selectedPhotos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPhotoIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentPhotoIndex 
                          ? 'bg-white' 
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Miniatures */}
            {selectedPhotos.length > 1 && (
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2 overflow-x-auto">
                  {selectedPhotos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Miniature ${index + 1}`}
                      onClick={() => setCurrentPhotoIndex(index)}
                      className={`w-16 h-16 object-cover rounded-lg cursor-pointer transition-all flex-shrink-0 ${
                        index === currentPhotoIndex
                          ? 'ring-2 ring-violet-500 opacity-100'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}