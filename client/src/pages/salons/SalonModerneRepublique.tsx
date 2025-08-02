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

export default function SalonModerneRepublique() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('services');
  
  // DONNÉES UNIQUES POUR SALON MODERNE RÉPUBLIQUE
  const salonData = {
    id: 'salon-moderne-republique',
    name: 'Salon Moderne République',
    rating: 4.6,
    reviews: 284,
    address: '12 Boulevard de la République, 75010 Paris',
    phone: '01 53 24 67 89',
    verified: true,
    certifications: ['Salon éco-responsable', 'Produits bio certifiés', 'Coiffure créative'],
    awards: ['Innovation 2024', 'Prix du développement durable', 'Salon tendance'],
    longDescription: 'Salon Moderne République allie créativité et responsabilité environnementale. Nos coiffeurs experts utilisent exclusivement des produits bio et créent des coupes sur-mesure dans un esprit moderne et écologique. Situé près de la République, nous offrons une expérience coiffure unique.',
    coverImageUrl: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1633681926035-ec1ac984418a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ]
  };

  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([
    {
      id: 1,
      name: 'Coupes Créatives',
      expanded: true,
      services: [
        { id: 1, name: 'Coupe Signature', price: 75, duration: '1h', description: 'Coupe personnalisée selon votre style' },
        { id: 2, name: 'Coupe Asymétrique', price: 80, duration: '1h15', description: 'Coupe moderne et audacieuse' },
        { id: 3, name: 'Coupe + Styling', price: 95, duration: '1h30', description: 'Coupe + coiffage créatif' },
        { id: 4, name: 'Relooking Complet', price: 150, duration: '2h30', description: 'Consultation + coupe + couleur' }
      ]
    },
    {
      id: 2,
      name: 'Colorations Bio',
      expanded: false,
      services: [
        { id: 5, name: 'Coloration Végétale', price: 90, duration: '2h', description: 'Coloration 100% naturelle' },
        { id: 6, name: 'Highlights Naturels', price: 120, duration: '2h30', description: 'Mèches avec produits bio' },
        { id: 7, name: 'Coloration Fantasy', price: 140, duration: '3h', description: 'Couleurs vives et créatives' },
        { id: 8, name: 'Tie & Dye Bio', price: 160, duration: '3h30', description: 'Dégradé de couleur naturel' }
      ]
    },
    {
      id: 3,
      name: 'Soins Naturels',
      expanded: false,
      services: [
        { id: 9, name: 'Masque Réparateur Bio', price: 45, duration: '30min', description: 'Soin intensif aux huiles naturelles' },
        { id: 10, name: 'Soin Cuir Chevelu', price: 55, duration: '45min', description: 'Massage et soin purifiant' },
        { id: 11, name: 'Rituel Hydratation', price: 65, duration: '1h', description: 'Soin complet hydratation intense' }
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
      <div className="relative h-64 bg-gradient-to-br from-emerald-400 to-teal-500">
        <img 
          src={salonData.coverImageUrl} 
          alt={salonData.name}
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
              <span className="opacity-80">République</span>
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
                  ? 'glass-button-pink border-b-2 border-emerald-600'
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
                    <span>Lun-Sam: 10h-20h • Dim: 11h-19h</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Engagement Éco-Responsable</h3>
                <div className="space-y-3">
                  {salonData.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm">{cert}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Récompenses</h4>
                  <div className="flex flex-wrap gap-2">
                    {salonData.awards.map((award, index) => (
                      <Badge key={index} variant="secondary" className="bg-emerald-100 text-emerald-800">
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
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">Sophie M.</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Il y a 3 jours</p>
                    <p className="text-sm">"J'adore l'approche éco-responsable de ce salon ! Ma coupe est magnifique et j'ai adoré l'utilisation de produits naturels. L'équipe est créative et à l'écoute."</p>
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