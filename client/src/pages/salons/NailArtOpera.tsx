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

export default function NailArtOpera() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('services');
  
  // RÉCUPÉRER LES VRAIES DONNÉES UNIQUES DEPUIS L'API
  const { data: salonData, isLoading } = useQuery({
    queryKey: ['/api/booking-pages', 'nail-art-opera'],
    retry: 2,
    refetchOnWindowFocus: false,
    staleTime: 30000
  });

  // Données de fallback pendant le chargement
  const fallbackData = {
    id: 'nail-art-opera',
    name: 'Nail Art Opéra',
    rating: 4.6,
    reviews: 198,
    address: '12 Avenue de l\'Opéra, 75009 Paris',
    phone: '01 42 96 15 78',
    verified: true,
    certifications: ['Ongles français certifiés', 'Nail art professionnel', 'Produits OPI premium'],
    awards: ['Meilleur nail art 2024', 'Prix créativité ongles', 'Institut de référence Opéra'],
    longDescription: 'Nail Art Opéra vous propose des prestations d\'onglerie haut de gamme près de l\'Opéra. Nos techniciennes expertes créent des nail arts uniques et proposent tous les soins d\'ongles avec les meilleures marques professionnelles.',
    coverImageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1632345031435-8727f6897d53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610992015463-b6dd7f65e445?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
        name: 'Manucure',
        expanded: true,
        services: [
          { id: 1, name: 'Manucure Simple', price: 25, duration: '30min', description: 'Soin des ongles et pose vernis' },
          { id: 2, name: 'Manucure French', price: 35, duration: '45min', description: 'Manucure française classique' },
          { id: 3, name: 'Manucure Gel', price: 45, duration: '1h', description: 'Pose vernis gel longue tenue' },
          { id: 4, name: 'Manucure + Nail Art', price: 55, duration: '1h15', description: 'Manucure avec décoration personnalisée' }
        ]
      },
      {
        id: 2,
        name: 'Pédicure',
        expanded: false,
        services: [
          { id: 5, name: 'Pédicure Classique', price: 35, duration: '45min', description: 'Soin complet des pieds' },
          { id: 6, name: 'Pédicure Spa', price: 50, duration: '1h', description: 'Pédicure avec bain relaxant' },
          { id: 7, name: 'Pédicure Gel', price: 55, duration: '1h15', description: 'Pédicure avec vernis gel' }
        ]
      },
      {
        id: 3,
        name: 'Extensions & Nail Art',
        expanded: false,
        services: [
          { id: 8, name: 'Pose Capsules', price: 65, duration: '1h30', description: 'Extensions ongles avec capsules' },
          { id: 9, name: 'Nail Art Premium', price: 75, duration: '1h45', description: 'Création artistique sur ongles' },
          { id: 10, name: 'Déco Strass', price: 15, duration: '15min', description: 'Décoration avec strass (en supplément)' }
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
      <div className="relative h-64 bg-gradient-to-br from-pink-400 to-rose-500">
        <img 
          src={displayData.coverImageUrl || displayData.photos?.[0] || 'https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'} 
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
              <span className="font-semibold">{displayData.rating || 4.6}</span>
              <span className="opacity-80">({displayData.reviewCount || displayData.reviews || 198} avis)</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span className="opacity-80">Opéra</span>
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
                  ? 'text-pink-600 border-b-2 border-pink-600'
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
                              className="mt-2 bg-pink-600 hover:bg-pink-700"
                              onClick={() => setLocation('/quick-booking')}
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
                    <span>Lun-Sam: 10h-19h • Dim: 11h-18h</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Expertise Nail Art</h3>
                <div className="space-y-3">
                  {(displayData.certifications || fallbackData.certifications).map((cert, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-pink-500" />
                      <span className="text-sm">{cert}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Récompenses</h4>
                  <div className="flex flex-wrap gap-2">
                    {(displayData.awards || fallbackData.awards).map((award, index) => (
                      <Badge key={index} variant="secondary" className="bg-pink-100 text-pink-800">
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
                {displayData.rating || 4.6}/5 étoiles
              </h3>
              <p className="text-gray-600">
                Basé sur {displayData.reviewCount || displayData.reviews || 198} avis clients
              </p>
            </div>
            
            {/* Avis exemple */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-pink-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">Emma K.</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Il y a 4 jours</p>
                    <p className="text-sm">"Un travail exceptionnel ! Le nail art réalisé était exactement ce que je voulais. L'équipe est très créative et professionnelle. Je recommande vivement !"</p>
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
          className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3"
          onClick={() => setLocation('/quick-booking')}
        >
          Réserver maintenant
        </Button>
      </div>
    </div>
  );
}