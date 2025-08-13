import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp,
  Edit,
  Calendar,
  Users,
  Info,
  Palette
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Service {
  id: string;
  name: string;
  description?: string;
  duration: string;
  price: number;
}

interface ServiceCategory {
  id: number;
  name: string;
  expanded: boolean;
  services: Service[];
}

export default function SalonExcellenceDemoMobile() {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('services');

  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([
    {
      id: 1,
      name: 'Coupes Homme',
      expanded: true,
      services: [
        {
          id: '1',
          name: 'Coupe Classique',
          description: 'Coupe traditionnelle aux ciseaux et tondeuse',
          duration: '30min',
          price: 35
        },
        {
          id: '2',
          name: 'Coupe Moderne',
          description: 'Coupe tendance avec finitions précises',
          duration: '45min',
          price: 45
        },
        {
          id: '3',
          name: 'Coupe + Barbe',
          description: 'Coupe complète avec taille de barbe',
          duration: '60min',
          price: 55
        }
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
      {/* Header mobile style avec photo de fond */}
      <div className="relative h-80 bg-gradient-to-br from-amber-600 to-orange-700">
        {/* Image de fond avec overlay sombre */}
        <img 
          src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
          alt="Salon Excellence Demo"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Barre de navigation mobile */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10">
          <button 
            onClick={() => setLocation('/search')}
            className="w-10 h-10 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <button className="w-10 h-10 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Edit className="h-4 w-4 text-white" />
          </button>
        </div>
        
        {/* Informations salon en overlay - style mobile */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Salon Excellence Demo</h1>
          <div className="flex items-center gap-4 text-sm mb-1">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-green-400 text-green-400" />
              <span className="font-semibold">4.5</span>
              <span className="opacity-80">(0 avis)</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span className="opacity-80">Le Marais</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets - style mobile */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="flex">
          <button
            onClick={() => setActiveTab('services')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'services'
                ? 'border-green-400 text-green-600 bg-green-50'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Calendar className="h-4 w-4" />
            Services
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'team'
                ? 'border-green-400 text-green-600 bg-green-50'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="h-4 w-4" />
            Équipe
          </button>
          <button
            onClick={() => setActiveTab('infos')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'infos'
                ? 'border-green-400 text-green-600 bg-green-50'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Info className="h-4 w-4" />
            Infos
          </button>
          <button
            onClick={() => setActiveTab('couleurs')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'couleurs'
                ? 'border-green-400 text-green-600 bg-green-50'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Palette className="h-4 w-4" />
            Couleu...
          </button>
        </div>
      </div>

      {/* Contenu principal - Onglet Services */}
      <div className="p-4 pb-24">
        {activeTab === 'services' && (
          <div className="space-y-3">
            {serviceCategories.map(category => (
              <Card key={category.id} className="overflow-hidden border-gray-200">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-semibold text-lg text-gray-900">{category.name}</h3>
                  {category.expanded ? 
                    <ChevronUp className="h-5 w-5 text-gray-400" /> : 
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  }
                </button>
                
                {category.expanded && (
                  <CardContent className="pt-0 pb-4">
                    <div className="space-y-3">
                      {category.services.map(service => (
                        <div key={service.id} className="p-4 bg-white border border-gray-100 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-base">{service.name}</h4>
                              {service.description && (
                                <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                              )}
                              <div className="flex items-center gap-1 mt-2">
                                <Clock className="h-3 w-3 text-gray-400" />
                                <span className="text-sm text-gray-500">{service.duration}</span>
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <p className="font-bold text-xl text-gray-900">{service.price}€</p>
                              <Button 
                                size="sm" 
                                className="mt-2 bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded-full"
                                onClick={() => {
                                  console.log('[CLICK] type=service-booking, salon=salon-excellence-demo, service=' + service.name);
                                  setLocation('/salon-booking/salon-excellence-paris');
                                }}
                              >
                                Réserver
                              </Button>
                            </div>
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

        {activeTab === 'team' && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Équipe</h3>
            <p className="text-gray-600">Informations sur l'équipe à venir</p>
          </div>
        )}

        {activeTab === 'infos' && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">À propos</h3>
                <p className="text-gray-700 mb-6">Salon de coiffure moderne spécialisé dans les coupes homme et les soins capillaires.</p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span>Le Marais, Paris</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span>01 42 74 XX XX</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span>Lun-Sam: 9h-19h • Dim: Fermé</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'couleurs' && (
          <div className="text-center py-12">
            <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Couleurs</h3>
            <p className="text-gray-600">Services de coloration à venir</p>
          </div>
        )}
      </div>

      {/* Bouton réservation fixe en bas - style mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button 
          className="w-full bg-green-400 hover:bg-green-500 text-white py-4 text-lg font-semibold rounded-xl"
          onClick={() => {
            console.log('[CLICK] type=main-booking, salon=salon-excellence-demo');
            setLocation('/salon-booking/salon-excellence-paris');
          }}
        >
          Réserver maintenant
        </Button>
      </div>
    </div>
  );
}