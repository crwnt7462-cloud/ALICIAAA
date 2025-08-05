import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Phone, 
  Clock,
  Share2,
  Heart
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
}

export default function SalonPageDemo() {
  const [, setLocation] = useLocation();
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Récupérer les services réels depuis l'API
  const { data: services = [] } = useQuery({
    queryKey: ['/api/services'],
    queryFn: async () => {
      const response = await fetch('/api/services');
      return response.json();
    }
  });

  const salon = {
    name: "Salon Démo Modifiable",
    description: "Salon de beauté professionnel situé au cœur de Paris. Spécialisé en coiffure, soins esthétiques et bien-être.",
    address: "123 Avenue de la Beauté, 75001 Paris",
    phone: "01 42 34 56 78",
    rating: 4.8,
    reviewCount: 127,
    priceRange: "€€",
    openingHours: {
      "Lundi": "9h00 - 19h00",
      "Mardi": "9h00 - 19h00",
      "Mercredi": "9h00 - 19h00",
      "Jeudi": "9h00 - 20h00",
      "Vendredi": "9h00 - 20h00",
      "Samedi": "9h00 - 18h00",
      "Dimanche": "Fermé"
    },
    coverImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=400&fit=crop"
  };

  const handleServiceSelect = (service: Service) => {
    // Stocker le service sélectionné dans sessionStorage
    const selectedServiceData = {
      id: service.id,
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: service.category
    };
    
    console.log('💾 Stockage service sélectionné:', selectedServiceData);
    sessionStorage.setItem('selectedService', JSON.stringify(selectedServiceData));
    console.log('✅ Service stocké, redirection vers réservation');
    
    // Rediriger vers la page de réservation
    setLocation('/salon-booking');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      {/* Header avec image de couverture */}
      <div className="relative h-48 bg-cover bg-center" style={{ backgroundImage: `url(${salon.coverImage})` }}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="h-10 w-10 p-0 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 text-white" />
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => setIsFavorite(!isFavorite)}
              className="h-10 w-10 p-0 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300"
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-white'}`} />
            </Button>
            <Button
              variant="ghost"
              className="h-10 w-10 p-0 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300"
            >
              <Share2 className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4">
        {/* Informations salon */}
        <div className="glass-card p-4 rounded-xl mb-6 -mt-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{salon.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-medium text-gray-900">{salon.rating}</span>
                  <span className="text-sm text-gray-600">({salon.reviewCount} avis)</span>
                </div>
                <Badge variant="secondary" className="text-xs">{salon.priceRange}</Badge>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 mb-4">{salon.description}</p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{salon.address}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>{salon.phone}</span>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="glass-card p-4 rounded-xl mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Nos Services</h2>
          {services.length > 0 ? (
            <div className="space-y-3">
              {services.map((service: Service) => (
                <Card key={service.id} className="glass-card hover:border-violet-300/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{service.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{service.duration} min</span>
                          </div>
                          <Badge variant="outline" className="text-xs">{service.category}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900 mb-2">{service.price}€</div>
                        <Button 
                          size="sm" 
                          className="glass-button-neutral"
                          onClick={() => handleServiceSelect(service)}
                        >
                          Réserver
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Aucun service disponible</p>
            </div>
          )}
        </div>

        {/* Horaires */}
        <div className="glass-card p-4 rounded-xl">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Horaires d'ouverture</h2>
          <div className="space-y-2">
            {Object.entries(salon.openingHours).map(([day, hours]) => (
              <div key={day} className="flex justify-between items-center text-sm">
                <span className="text-gray-900 font-medium">{day}</span>
                <span className="text-gray-600">{hours}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}