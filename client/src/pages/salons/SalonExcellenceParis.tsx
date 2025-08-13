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

export default function SalonExcellenceParis() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('services');
  
  // RÉCUPÉRER LES VRAIES DONNÉES UNIQUES DEPUIS L'API
  const { data: salonData, isLoading } = useQuery({
    queryKey: ['/api/booking-pages', 'salon-excellence-paris'],
    retry: 2,
    refetchOnWindowFocus: false,
    staleTime: 30000
  });

  // Données de fallback pendant le chargement
  const fallbackData = {
    id: 'salon-excellence-paris',
    name: 'Excellence Hair Paris',
    rating: 4.8,
    reviews: 347,
    address: '45 Avenue des Champs-Élysées, 75008 Paris',
    phone: '01 42 65 78 90',
    verified: true,
    certifications: ['Certifié L\'Oréal Professionnel', 'Salon de coiffure agréé', 'Formation continue équipe'],
    awards: ['Meilleur salon Champs-Élysées 2024', 'Excellence service client', 'Prix innovation coiffure'],
    longDescription: 'Excellence Hair Paris vous accueille dans un cadre luxueux au cœur des Champs-Élysées. Notre équipe de coiffeurs experts vous propose des services haut de gamme avec les dernières tendances et techniques de coiffure. Spécialisés dans la coiffure femme, nous offrons également des soins capillaires personnalisés.',
    coverImageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ]
  };

  // Utiliser les vraies données de l'API ou le fallback
  const displayData = salonData || fallbackData;

  // Utiliser les services depuis l'API ou les services de fallback
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>(() => {
    if (salonData?.serviceCategories && salonData.serviceCategories.length > 0) {
      return salonData.serviceCategories.map((cat, index) => ({
        ...cat,
        expanded: index === 0, // Premier onglet ouvert par défaut
      }));
    }
    
    // Services de fallback si pas de données API
    return [
      {
        id: 1,
        name: 'Coiffure Femme',
        expanded: true,
        services: [
          { id: 1, name: 'Coupe + Brushing', price: 85, duration: '1h15', description: 'Coupe personnalisée selon votre morphologie + brushing' },
          { id: 2, name: 'Coupe + Couleur', price: 150, duration: '2h30', description: 'Coupe + coloration complète avec produits L\'Oréal' },
          { id: 3, name: 'Coupe + Mèches', price: 180, duration: '3h', description: 'Coupe + mèches techniques (balayage, ombré)' },
          { id: 4, name: 'Brushing Seul', price: 45, duration: '45min', description: 'Brushing professionnel avec finition laque' },
          { id: 5, name: 'Chignon/Coiffure Mariée', price: 120, duration: '1h30', description: 'Coiffure événementielle sur-mesure' }
        ]
      },
      {
        id: 2,
        name: 'Coloration',
        expanded: false,
        services: [
          { id: 6, name: 'Coloration Racines', price: 75, duration: '1h30', description: 'Retouche racines couleur existante' },
          { id: 7, name: 'Coloration Complète', price: 95, duration: '2h', description: 'Coloration intégrale avec shampooing soin' },
          { id: 8, name: 'Balayage Californien', price: 160, duration: '3h', description: 'Technique balayage pour effet naturel' },
          { id: 9, name: 'Ombré Hair', price: 140, duration: '2h30', description: 'Dégradé de couleur tendance' }
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
      <div className="relative h-64 bg-gradient-to-br from-violet-400 to-purple-500">
        <img 
          src={displayData.coverImageUrl || displayData.photos?.[0] || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'} 
          alt={displayData.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        
        {/* Bouton retour */}
        <button 
          onClick={() => {
            console.log('🔙 Bouton retour cliqué - Navigation vers /search');
            setLocation('/search');
          }}
          className="absolute top-4 left-4 glass-button-secondary w-10 h-10 rounded-full flex items-center justify-center z-10"
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
              <span className="font-semibold">{displayData.rating || 4.8}</span>
              <span className="opacity-80">({displayData.reviewCount || displayData.reviews || 347} avis)</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span className="opacity-80">Champs-Élysées</span>
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
                  ? 'glass-button-pink border-b-2 border-violet-600'
                  : 'glass-button-secondary'
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
                              className="mt-2 glass-button-pink"
                              onClick={() => {
                                console.log('[CLICK] type=service-booking, salon=salon-excellence-paris, service=' + service.name);
                                setLocation('/salon-booking/salon-excellence-paris');
                              }}
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
                    <span>Lun-Sam: 9h-19h • Dim: 10h-18h</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Certifications & Récompenses</h3>
                <div className="space-y-3">
                  {(displayData.certifications || fallbackData.certifications).map((cert, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-amber-500" />
                      <span className="text-sm">{cert}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Récompenses</h4>
                  <div className="flex flex-wrap gap-2">
                    {(displayData.awards || fallbackData.awards).map((award, index) => (
                      <Badge key={index} variant="secondary" className="bg-amber-100 text-amber-800">
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
                {displayData.rating || 4.8}/5 étoiles
              </h3>
              <p className="text-gray-600">
                Basé sur {displayData.reviewCount || displayData.reviews || 347} avis clients
              </p>
            </div>
            
            {/* Avis exemple */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-violet-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">Marie L.</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Il y a 2 jours</p>
                    <p className="text-sm">"Excellent service ! Ma coiffeuse a parfaitement compris ce que je voulais. Le salon est magnifique et très propre. Je recommande vivement !"</p>
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
          className="w-full glass-button py-3"
          onClick={() => {
            console.log('[CLICK] type=main-booking, salon=salon-excellence-paris');
            setLocation('/salon-booking/salon-excellence-paris');
          }}
        >
          Réserver maintenant
        </Button>
      </div>
    </div>
  );
}