import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
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
  Palette,
  Users,
  Info
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

interface Professional {
  id: number;
  name: string;
  image: string;
  photoUrl?: string;
  rating: number;
  specialties: string[];
  nextSlot: string;
  experience: string;
  description?: string;
  available: boolean;
}

interface SalonData {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  address: string;
  phone: string;
  verified: boolean;
  certifications: string[];
  awards: string[];
  longDescription: string;
  coverImageUrl: string;
  photos: string[];
  serviceCategories: ServiceCategory[];
  customColors?: {
    primary: string;
    accent: string;
    buttonText: string;
    buttonClass: string;
    intensity: number;
  };
}

interface SalonDetailProps {
  params: { id: string };
}

export default function SalonDetail({ params }: SalonDetailProps) {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('services');
  const salonId = params.id;

  // Récupérer les données du salon depuis PostgreSQL
  const { data: salon, isLoading, error } = useQuery({
    queryKey: [`/api/salon/${salonId}`],
    enabled: !!salonId
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-300">Chargement du salon...</p>
        </div>
      </div>
    );
  }

  if (error || !salon) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Salon non trouvé</h1>
          <p className="text-gray-300 mb-4">Ce salon n'existe pas ou n'est plus disponible.</p>
          <Button 
            onClick={() => setLocation('/search')}
            className="bg-violet-500 hover:bg-violet-600 text-white"
          >
            Retour à la recherche
          </Button>
        </div>
      </div>
    );
  }

  const handleBookService = (service: Service) => {
    sessionStorage.setItem('selectedService', JSON.stringify({
      id: service.id,
      name: service.name,
      price: service.price,
      duration: service.duration,
      description: service.description,
      salonId: salon.id,
      salonName: salon.name
    }));
    setLocation('/booking');
  };

  // Onglets identiques à SalonPageEditor
  const tabs = [
    { id: 'services', label: 'Services', icon: Calendar },
    { id: 'professionnels', label: 'Équipe', icon: User },
    { id: 'info', label: 'Infos', icon: MapPin },
    { id: 'couleurs', label: 'Couleurs', icon: Palette }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec photo de couverture - COPIE EXACTE de SalonPageEditor */}
      <div className="relative h-64 bg-gradient-to-br from-amber-600 to-orange-700">
        <img 
          src={salon.coverImageUrl || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&auto=format"} 
          alt={salon.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        
        {/* Boutons d'action dans le header */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <button 
            onClick={() => setLocation('/')}
            className="glass-button-secondary w-10 h-10 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="glass-button-secondary text-white rounded-xl"
              onClick={() => setLocation('/booking')}
            >
              <Calendar className="w-4 h-4 mr-1" />
              Réserver
            </Button>
          </div>
        </div>
        
        {/* Informations salon en overlay - EXACTEMENT comme SalonPageEditor */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold">{salon.name}</h1>
            {salon.verified && (
              <CheckCircle className="h-5 w-5 text-blue-400" />
            )}
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" style={{ 
                color: salon.customColors?.primary || '#f59e0b',
                fill: salon.customColors?.primary || '#f59e0b' 
              }} />
              <span className="font-semibold">{salon.rating || 4.5}</span>
              <span className="opacity-80">({salon.reviews || 0} avis)</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span className="opacity-80">Le Marais</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets - EXACTEMENT comme SalonPageEditor */}
      <div className="bg-white border-b">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? `text-violet-600 border-violet-500`
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="p-4 space-y-4">
        {activeTab === 'services' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Nos Services</h2>
            {salon.serviceCategories && salon.serviceCategories.map((category: ServiceCategory) => (
              <Card key={category.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-violet-600" />
                      {category.name}
                    </h3>
                  </div>
                  <div className="divide-y">
                    {category.services.map((service: Service) => (
                      <div key={service.id} className="p-4 flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{service.name}</h4>
                          {service.description && (
                            <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {service.duration}
                            </div>
                            <span className="font-bold text-lg text-violet-600">
                              {service.price === 0 ? 'Gratuit' : `${service.price}€`}
                            </span>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleBookService(service)}
                          className="ml-4 bg-violet-600 hover:bg-violet-700 text-white"
                        >
                          Réserver
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'professionnels' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Notre Équipe</h2>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Équipe professionnelle</h3>
                <p className="text-gray-600">Nos professionnels qualifiés sont à votre service pour vous offrir une expérience exceptionnelle.</p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'info' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Informations</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-violet-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Adresse</h4>
                    <p className="text-gray-600">{salon.address || "Adresse non renseignée"}</p>
                  </div>
                </div>
                {salon.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-violet-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Téléphone</h4>
                      <p className="text-gray-600">{salon.phone}</p>
                    </div>
                  </div>
                )}
                {salon.longDescription && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">À propos</h4>
                    <p className="text-gray-600">{salon.longDescription}</p>
                  </div>
                )}
                {salon.certifications && salon.certifications.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {salon.certifications.map((cert: string, index: number) => (
                        <Badge key={index} className="bg-violet-100 text-violet-800">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'couleurs' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Couleurs du salon</h2>
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 rounded-lg mx-auto mb-2"
                      style={{ backgroundColor: salon.customColors?.primary || '#7c3aed' }}
                    ></div>
                    <p className="text-sm text-gray-600">Couleur principale</p>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 rounded-lg mx-auto mb-2"
                      style={{ backgroundColor: salon.customColors?.accent || '#a855f7' }}
                    ></div>
                    <p className="text-sm text-gray-600">Couleur d'accent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}