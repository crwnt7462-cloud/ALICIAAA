import { useState } from 'react';
import { useLocation } from 'wouter';
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

export default function InstitutBeauteSaintGermain() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('services');
  
  // DONNÉES UNIQUES POUR INSTITUT BEAUTÉ SAINT-GERMAIN
  const salonData = {
    id: 'institut-beaute-saint-germain',
    name: 'Institut Beauté Saint-Germain',
    rating: 4.7,
    reviews: 156,
    address: '34 Rue de Seine, 75006 Paris',
    phone: '01 43 26 89 45',
    verified: true,
    certifications: ['Institut agréé CIDESCO', 'Esthéticienne diplômée d\'État', 'Soins anti-âge certifiés'],
    awards: ['Excellence soins visage 2024', 'Institut de référence Saint-Germain', 'Prix qualité service'],
    longDescription: 'Institut Beauté Saint-Germain vous propose une parenthèse bien-être au cœur de Saint-Germain-des-Prés. Spécialisés dans les soins visage haut de gamme et les techniques anti-âge, nous utilisons les dernières innovations cosmétiques pour révéler votre beauté naturelle.',
    coverImageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596178060810-e5042c2d5d28?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ]
  };

  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([
    {
      id: 1,
      name: 'Soins Visage',
      expanded: true,
      services: [
        { id: 1, name: 'Soin Hydratant Classique', price: 75, duration: '1h', description: 'Nettoyage, gommage, masque et hydratation' },
        { id: 2, name: 'Soin Anti-Âge Premium', price: 120, duration: '1h15', description: 'Soin complet avec actifs anti-âge' },
        { id: 3, name: 'Soin Éclat Vitamine C', price: 90, duration: '1h', description: 'Soin illuminateur pour teint terne' },
        { id: 4, name: 'Nettoyage de Peau', price: 85, duration: '1h10', description: 'Extraction des comédons et purification' }
      ]
    },
    {
      id: 2,
      name: 'Soins Corps',
      expanded: false,
      services: [
        { id: 5, name: 'Gommage Corps Relaxant', price: 65, duration: '45min', description: 'Exfoliation douce tout le corps' },
        { id: 6, name: 'Enveloppement Minceur', price: 95, duration: '1h', description: 'Soin raffermissant et drainant' },
        { id: 7, name: 'Soin Anti-Cellulite', price: 80, duration: '50min', description: 'Massage palper-rouler professionnel' },
        { id: 8, name: 'Hydratation Corps Luxe', price: 70, duration: '45min', description: 'Soin nourrissant intégral' }
      ]
    },
    {
      id: 3,
      name: 'Épilations',
      expanded: false,
      services: [
        { id: 9, name: 'Épilation Sourcils', price: 25, duration: '20min', description: 'Épilation + restructuration sourcils' },
        { id: 10, name: 'Épilation Lèvre Supérieure', price: 18, duration: '15min', description: 'Épilation cire tiède' },
        { id: 11, name: 'Épilation Jambes Complètes', price: 55, duration: '45min', description: 'Épilation cire chaude professionnelle' },
        { id: 12, name: 'Épilation Maillot Intégral', price: 45, duration: '30min', description: 'Épilation complète zone intime' }
      ]
    }
  ]);

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
      <div className="relative h-64 bg-gradient-to-br from-rose-400 to-pink-500">
        <img 
          src={salonData.coverImageUrl} 
          alt={salonData.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-25"></div>
        
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
            <h1 className="text-2xl font-bold">{salonData.name}</h1>
            {salonData.verified && (
              <CheckCircle className="h-5 w-5 text-blue-400" />
            )}
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{salonData.rating}</span>
              <span className="opacity-80">({salonData.reviews} avis)</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span className="opacity-80">Saint-Germain</span>
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
                  ? 'glass-button-pink border-b-2 border-rose-600'
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
                              className="mt-2 glass-button-neutral"
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
                <p className="text-gray-700 mb-6">{salonData.longDescription}</p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span>{salonData.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span>{salonData.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span>Lun-Ven: 9h-19h • Sam: 9h-17h • Dim: Fermé</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Expertise & Qualifications</h3>
                <div className="space-y-3">
                  {salonData.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-rose-500" />
                      <span className="text-sm">{cert}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Distinctions</h4>
                  <div className="flex flex-wrap gap-2">
                    {salonData.awards.map((award, index) => (
                      <Badge key={index} variant="secondary" className="bg-rose-100 text-rose-800">
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
                {salonData.rating}/5 étoiles
              </h3>
              <p className="text-gray-600">
                Basé sur {salonData.reviews} avis clients
              </p>
            </div>
            
            {/* Avis exemple */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-rose-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">Camille R.</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Il y a 5 jours</p>
                    <p className="text-sm">"Un institut exceptionnel ! L'esthéticienne est très professionnelle et les soins sont de haute qualité. Ma peau n'a jamais été aussi belle. L'ambiance est très relaxante."</p>
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
          onClick={() => setLocation('/salon-booking')}
        >
          Réserver maintenant
        </Button>
      </div>
    </div>
  );
}