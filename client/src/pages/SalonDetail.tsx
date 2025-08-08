import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Star, MapPin, Phone, Mail, Users, Clock, 
  Award, Heart, Share, Sparkles 
} from "lucide-react";

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du salon...</p>
        </div>
      </div>
    );
  }

  if (error || !salon) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Salon non trouvé</h1>
          <p className="text-gray-600 mb-4">Ce salon n'existe pas ou n'est plus disponible.</p>
          <Button 
            onClick={() => setLocation('/search')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            Retour à la recherche
          </Button>
        </div>
      </div>
    );
  }

  const customColors = salon.customColors || {
    primary: '#10b981',
    accent: '#059669',
    buttonText: '#ffffff'
  };

  const handleBookService = (service: any) => {
    // Sauvegarder le service sélectionné et rediriger vers booking
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

  const formatPrice = (price: number) => {
    return price === 0 ? 'Gratuit' : `${price}€`;
  };

  const tabs = [
    { id: 'services', label: 'Services', icon: Sparkles },
    { id: 'equipe', label: 'Équipe', icon: Users },
    { id: 'infos', label: 'Infos', icon: MapPin },
    { id: 'couleurs', label: 'Couleurs', icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec image de couverture */}
      <div className="relative h-72 bg-gradient-to-br from-emerald-600 to-teal-700">
        {salon.coverImageUrl && (
          <img 
            src={salon.coverImageUrl} 
            alt={salon.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Boutons d'action dans le header */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <button 
            onClick={() => setLocation('/search')}
            className="w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>

          <div className="flex items-center gap-2">
            <button className="w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
              <Heart className="w-5 h-5 text-white" />
            </button>
            <button className="w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
              <Share className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Nom du salon et infos overlay */}
        <div className="absolute bottom-6 left-4 right-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold">{salon.name}</h1>
            {salon.certifications && salon.certifications.length > 0 && (
              <div className="bg-emerald-500 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Award className="w-3 h-3" />
                Certifié
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-medium">{salon.rating || 4.5}</span>
              <span className="text-white/70">({salon.reviewCount || 0} avis)</span>
            </div>
            {salon.address && (
              <div className="flex items-center gap-1 text-white/90">
                <MapPin className="w-4 h-4" />
                <span>{salon.address.split(',')[1] || 'Le Marais'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Badge professionnel */}
      {salon.certifications && salon.certifications.length > 0 && (
        <div className="max-w-lg mx-auto px-4 -mt-3 relative z-10">
          <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2">
            <Users className="w-4 h-4" />
            {salon.certifications[0]}
          </div>
        </div>
      )}

      {/* Navigation par onglets */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-20 mt-4">
        <div className="max-w-lg mx-auto">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-3 py-4 text-sm font-medium flex items-center justify-center gap-2 relative ${
                    activeTab === tab.id
                      ? 'text-emerald-600 border-b-2'
                      : 'text-gray-600'
                  }`}
                  style={activeTab === tab.id ? { borderBottomColor: customColors.primary } : {}}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="max-w-lg mx-auto p-4 space-y-4">
        {activeTab === 'services' && (
          <div className="space-y-4">
            {salon.serviceCategories && salon.serviceCategories.map((category: any) => (
              <div key={category.id}>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  {category.name}
                </h3>
                
                <div className="space-y-3">
                  {category.services && category.services.map((service: any) => (
                    <Card key={service.id} className="bg-white border border-gray-100">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{service.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                            <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {service.duration}
                              </div>
                              <span 
                                className="font-bold text-lg"
                                style={{ color: customColors.primary }}
                              >
                                {formatPrice(service.price)}
                              </span>
                            </div>
                          </div>
                          
                          <Button
                            onClick={() => handleBookService(service)}
                            className="ml-4 text-white font-medium"
                            style={{ 
                              backgroundColor: customColors.primary,
                              color: customColors.buttonText 
                            }}
                          >
                            Réserver
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'equipe' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              Notre équipe
            </h3>
            
            {salon.staff && salon.staff.length > 0 ? (
              <div className="space-y-3">
                {salon.staff.map((member: any) => (
                  <Card key={member.id} className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{member.name}</h4>
                          <p className="text-sm text-gray-600">{member.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Équipe en cours de présentation</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'infos' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              Informations
            </h3>
            
            <Card className="bg-white">
              <CardContent className="p-4 space-y-4">
                {salon.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Adresse</p>
                      <p className="text-gray-600">{salon.address}</p>
                    </div>
                  </div>
                )}
                
                {salon.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Téléphone</p>
                      <p className="text-gray-600">{salon.phone}</p>
                    </div>
                  </div>
                )}
                
                {salon.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">{salon.email}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {salon.longDescription && (
              <Card className="bg-white">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">À propos</h4>
                  <p className="text-gray-600">{salon.longDescription}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'couleurs' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-emerald-600" />
              Couleurs du salon
            </h3>
            
            <Card className="bg-white">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 rounded-full mx-auto mb-2"
                      style={{ backgroundColor: customColors.primary }}
                    ></div>
                    <p className="text-sm font-medium text-gray-900">Couleur principale</p>
                    <p className="text-xs text-gray-500">{customColors.primary}</p>
                  </div>
                  
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 rounded-full mx-auto mb-2"
                      style={{ backgroundColor: customColors.accent }}
                    ></div>
                    <p className="text-sm font-medium text-gray-900">Couleur d'accent</p>
                    <p className="text-xs text-gray-500">{customColors.accent}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Bouton de réservation fixe */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-30">
        <div className="max-w-lg mx-auto">
          <Button
            onClick={() => setLocation('/booking')}
            className="w-full py-4 text-white font-bold text-lg"
            style={{ 
              backgroundColor: customColors.primary,
              color: customColors.buttonText 
            }}
          >
            Réserver maintenant
          </Button>
        </div>
      </div>

      {/* Espace pour le bouton fixe */}
      <div className="h-20"></div>
    </div>
  );
}