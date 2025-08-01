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
  ChevronUp
} from 'lucide-react';

interface Service {
  id: number;
  name: string;
  price: number;
  duration: string;
  description?: string;
}

interface ServiceCategory {
  id: number;
  name: string;
  expanded: boolean;
  services: Service[];
}

export default function BeautyLoungeMontparnasse() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('services');
  
  // RÉCUPÉRER LES VRAIES DONNÉES UNIQUES DEPUIS L'API
  const { data: salonData, isLoading } = useQuery({
    queryKey: ['/api/booking-pages', 'beauty-lounge-montparnasse'],
    retry: 2,
    refetchOnWindowFocus: false,
    staleTime: 30000
  });

  // Données de fallback pendant le chargement
  const fallbackData = {
    id: 'beauty-lounge-montparnasse',
    name: 'Beauty Lounge Montparnasse',
    rating: 4.5,
    reviews: 89,
    address: '52 Boulevard du Montparnasse, 75014 Paris',
    phone: '01 43 35 67 42',
    verified: true,
    certifications: ['Salon de beauté certifié', 'Coiffure et esthétique', 'Produits premium'],
    awards: ['Nouveau salon prometteur 2024', 'Service personnalisé', 'Ambiance lounge'],
    longDescription: 'Beauty Lounge Montparnasse combine coiffure et esthétique dans un cadre moderne et décontracté. Notre équipe polyvalente vous propose des services beauté complets avec une approche personnalisée dans l\'esprit lounge.',
    coverImageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ]
  };

  // Utiliser les vraies données de l'API ou le fallback
  const displayData = salonData || fallbackData;

  // Utiliser les services depuis l'API ou les services de fallback
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>(() => {
    if (salonData?.serviceCategories && salonData.serviceCategories.length > 0) {
      return salonData.serviceCategories.map((cat, index) => ({
        ...cat,
        expanded: index === 0,
      }));
    }
    
    return [
      {
        id: 1,
        name: 'Coiffure Tendance',
        expanded: true,
        services: [
          { id: 1, name: 'Coupe Moderne', price: 55, duration: '1h', description: 'Coupe actuelle et personnalisée' },
          { id: 2, name: 'Coloration Créative', price: 95, duration: '2h15', description: 'Couleurs tendances et techniques modernes' },
          { id: 3, name: 'Coupe + Couleur', price: 130, duration: '2h45', description: 'Service complet coupe et couleur' },
          { id: 4, name: 'Brushing Professionnel', price: 35, duration: '40min', description: 'Coiffage et finition impeccable' }
        ]
      },
      {
        id: 2,
        name: 'Soins Visage',
        expanded: false,
        services: [
          { id: 5, name: 'Soin Éclat Express', price: 60, duration: '45min', description: 'Soin rapide pour retrouver de l\'éclat' },
          { id: 6, name: 'Soin Hydratant Intense', price: 75, duration: '1h', description: 'Hydratation profonde du visage' },
          { id: 7, name: 'Soin Anti-Âge', price: 90, duration: '1h15', description: 'Soin complet anti-vieillissement' }
        ]
      },
      {
        id: 3,
        name: 'Épilation & Beauté',
        expanded: false,
        services: [
          { id: 8, name: 'Épilation Sourcils', price: 20, duration: '20min', description: 'Restructuration et épilation sourcils' },
          { id: 9, name: 'Épilation Jambes', price: 40, duration: '30min', description: 'Épilation complète des jambes' },
          { id: 10, name: 'Teinture Cils/Sourcils', price: 30, duration: '25min', description: 'Coloration naturelle cils et sourcils' }
        ]
      }
    ];
  });

  const toggleCategory = (categoryId: number) => {
    setServiceCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, expanded: !cat.expanded }
          : cat
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec photo de couverture */}
      <div className="relative h-64 bg-gradient-to-br from-purple-400 to-indigo-500">
        <img 
          src={displayData.coverImageUrl || displayData.photos?.[0] || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'} 
          alt={displayData.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-25"></div>
        
        {/* Bouton retour */}
        <button 
          onClick={() => {
            console.log('🔙 Bouton retour cliqué - Navigation vers /search');
            setLocation('/search');
          }}
          className="absolute top-4 left-4 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all z-10"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        
        {/* Informations salon en overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold">{displayData.name}</h1>
            {displayData.verified && (
              <CheckCircle className="h-5 w-5 text-blue-400" />
            )}
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{displayData.rating || 4.5}</span>
              <span className="opacity-80">({displayData.reviewCount || displayData.reviews || 89} avis)</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span className="opacity-80">Montparnasse</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-white border-b">
        <div className="flex">
          {[
            { id: 'services', label: 'Services', icon: Calendar },
            { id: 'info', label: 'Infos', icon: MapPin },
            { id: 'avis', label: 'Avis', icon: Star }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="p-4">
        {activeTab === 'services' && (
          <div className="space-y-4">
            {serviceCategories.map(category => (
              <Card key={category.id} className="overflow-hidden">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  {category.expanded ? 
                    <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  }
                </button>
                
                {category.expanded && (
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {category.services.map(service => (
                        <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{service.name}</h4>
                            {service.description && (
                              <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                            )}
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Clock className="h-3 w-3" />
                                {service.duration}
                              </div>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <p className="font-bold text-lg">{service.price}€</p>
                            <Button 
                              size="sm" 
                              className="mt-2 bg-purple-600 hover:bg-purple-700"
                              onClick={() => setLocation('/salon-booking')}
                            >
                              Réserver
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'info' && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">À propos</h3>
                <p className="text-gray-700 mb-6">{displayData.description || displayData.longDescription}</p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span>{displayData.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span>{displayData.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span>Mar-Sam: 10h-19h • Lun: Fermé • Dim: 11h-17h</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Concept Lounge</h3>
                <div className="space-y-3">
                  {(displayData.certifications || fallbackData.certifications).map((cert, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">{cert}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Distinctions</h4>
                  <div className="flex flex-wrap gap-2">
                    {(displayData.awards || fallbackData.awards).map((award, index) => (
                      <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800">
                        {award}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'avis' && (
          <div className="space-y-4">
            <div className="text-center py-8">
              <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {displayData.rating || 4.5}/5 étoiles
              </h3>
              <p className="text-gray-600">
                Basé sur {displayData.reviewCount || displayData.reviews || 89} avis clients
              </p>
            </div>
            
            {/* Avis exemple */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">Sarah P.</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Il y a 2 semaines</p>
                    <p className="text-sm">"Super concept ! J'ai pu faire ma coupe et un soin visage en même temps. L'ambiance lounge est très agréable et l'équipe est super sympa. Je recommande !"</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Bouton réservation fixe en bas */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
          onClick={() => setLocation('/salon-booking')}
        >
          Réserver maintenant
        </Button>
      </div>
    </div>
  );
}