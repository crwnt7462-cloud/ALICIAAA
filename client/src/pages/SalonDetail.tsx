import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Phone, 
  Clock, 
  Calendar,
  Heart,
  Share2,
  Scissors,
  Palette,
  Sparkles,
  User,
  CheckCircle,
  Camera
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

interface Review {
  id: number;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  service: string;
  verified: boolean;
}

interface Business {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website?: string;
  image?: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  specialties: string[];
  openingHours: {
    [key: string]: string;
  };
  photos: string[];
  verified: boolean;
  responseTime: string;
}

export default function SalonDetail() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'services' | 'reviews' | 'photos' | 'info'>('services');
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Récupérer l'ID du salon depuis l'URL (simulation)
  const salonId = 1; // En réalité, cela viendrait des paramètres d'URL

  const { data: business } = useQuery({
    queryKey: ['/api/public/business', salonId],
    queryFn: async () => {
      // Simulation de données détaillées pour un salon
      return {
        id: 1,
        name: "Studio Élégance Paris",
        description: "Salon de beauté haut de gamme spécialisé dans les coupes tendances, colorations artistiques et soins capillaires premium. Notre équipe d'experts vous accueille dans un cadre moderne et chaleureux.",
        address: "42 rue de Rivoli",
        city: "Paris 1er",
        phone: "01 42 36 89 12",
        email: "contact@studio-elegance.fr",
        website: "www.studio-elegance-paris.fr",
        image: "/api/placeholder/400/300",
        rating: 4.8,
        reviewCount: 247,
        priceRange: "€€€",
        specialties: ["Coupe & Styling", "Coloration", "Soins Capillaires", "Extensions"],
        openingHours: {
          "Lundi": "9h00 - 19h00",
          "Mardi": "9h00 - 19h00", 
          "Mercredi": "9h00 - 20h00",
          "Jeudi": "9h00 - 20h00",
          "Vendredi": "9h00 - 20h00",
          "Samedi": "8h00 - 18h00",
          "Dimanche": "Fermé"
        },
        photos: [
          "/api/placeholder/300/200",
          "/api/placeholder/300/200", 
          "/api/placeholder/300/200",
          "/api/placeholder/300/200"
        ],
        verified: true,
        responseTime: "Répond en moins de 2h"
      } as Business;
    }
  });

  const { data: services } = useQuery({
    queryKey: ['/api/public/services', salonId],
    queryFn: async () => {
      return [
        {
          id: 1,
          name: "Coupe Femme",
          description: "Coupe personnalisée avec shampoing et brushing",
          price: 65,
          duration: 60,
          category: "Coupe"
        },
        {
          id: 2,
          name: "Coloration Complète",
          description: "Coloration racines + longueurs avec soin",
          price: 95,
          duration: 120,
          category: "Coloration"
        },
        {
          id: 3,
          name: "Balayage",
          description: "Technique de mèches naturelles",
          price: 120,
          duration: 150,
          category: "Coloration"
        },
        {
          id: 4,
          name: "Soin Hydratant",
          description: "Masque réparateur pour cheveux secs",
          price: 35,
          duration: 30,
          category: "Soin"
        },
        {
          id: 5,
          name: "Brushing",
          description: "Mise en forme avec produits de finition",
          price: 25,
          duration: 30,
          category: "Styling"
        }
      ] as Service[];
    }
  });

  const { data: reviews } = useQuery({
    queryKey: ['/api/salon/reviews', salonId],
    queryFn: async () => {
      return [
        {
          id: 1,
          clientName: "Marie L.",
          rating: 5,
          comment: "Absolument parfait ! L'équipe est très professionnelle et le résultat dépasse mes attentes. Je recommande vivement !",
          date: "2024-01-10",
          service: "Coloration Complète",
          verified: true
        },
        {
          id: 2,
          clientName: "Sophie D.",
          rating: 5,
          comment: "Salon magnifique, service impeccable. Ma coiffeuse a su exactement ce que je voulais. Très satisfaite !",
          date: "2024-01-08",
          service: "Coupe Femme",
          verified: true
        },
        {
          id: 3,
          clientName: "Emma R.",
          rating: 4,
          comment: "Très bon salon, ambiance agréable. Le balayage est réussi, juste un petit délai d'attente mais ça valait le coup.",
          date: "2024-01-05",
          service: "Balayage",
          verified: true
        },
        {
          id: 4,
          clientName: "Camille M.",
          rating: 5,
          comment: "Équipe au top ! Conseil personnalisé et résultat parfait. Le salon est très propre et moderne.",
          date: "2024-01-03",
          service: "Soin Hydratant",
          verified: true
        },
        {
          id: 5,
          clientName: "Julie B.",
          rating: 4,
          comment: "Très satisfaite de ma visite. Bon rapport qualité-prix et personnel accueillant.",
          date: "2023-12-28",
          service: "Brushing",
          verified: false
        }
      ] as Review[];
    }
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Coupe':
        return <Scissors className="w-4 h-4" />;
      case 'Coloration':
        return <Palette className="w-4 h-4" />;
      case 'Soin':
        return <Sparkles className="w-4 h-4" />;
      default:
        return <Scissors className="w-4 h-4" />;
    }
  };

  if (!business) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec image */}
      <div className="relative h-64 bg-gradient-to-r from-violet-600 to-purple-600">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/")}
          className="absolute top-4 left-4 z-10 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFavorite(!isFavorite)}
            className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold text-white">{business.name}</h1>
            {business.verified && (
              <CheckCircle className="w-5 h-5 text-blue-400" />
            )}
          </div>
          <div className="flex items-center gap-4 text-white/90 text-sm">
            <div className="flex items-center gap-1">
              {renderStars(Math.floor(business.rating))}
              <span className="ml-1 font-medium">{business.rating}</span>
              <span>({business.reviewCount} avis)</span>
            </div>
            <span>{business.priceRange}</span>
          </div>
        </div>
      </div>

      {/* Informations rapides */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{business.address}, {business.city}</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {business.responseTime}
          </Badge>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          {business.specialties.map((specialty, index) => (
            <Badge key={index} variant="outline" className="whitespace-nowrap">
              {specialty}
            </Badge>
          ))}
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="flex">
          {[
            { key: 'services', label: 'Services', count: services?.length },
            { key: 'reviews', label: 'Avis', count: business.reviewCount },
            { key: 'photos', label: 'Photos', count: business.photos.length },
            { key: 'info', label: 'Infos' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-violet-500 text-violet-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {tab.count && (
                <span className="ml-1 text-xs text-gray-400">({tab.count})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="p-4 pb-20">
        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Nos Services</h2>
              <Button 
                onClick={() => setLocation("/quick-booking")}
                className="bg-violet-600 hover:bg-violet-700"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Réserver
              </Button>
            </div>
            
            {services?.map((service) => (
              <Card key={service.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getCategoryIcon(service.category)}
                        <h3 className="font-medium">{service.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {service.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{service.duration} min</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-violet-600">{service.price}€</p>
                      <Button size="sm" variant="outline" className="mt-2">
                        Choisir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Avis Clients</h2>
              <div className="flex items-center gap-2">
                {renderStars(Math.floor(business.rating))}
                <span className="font-medium">{business.rating}/5</span>
              </div>
            </div>

            {reviews?.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-violet-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{review.clientName}</p>
                          {review.verified && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{new Date(review.date).toLocaleDateString('fr-FR')}</span>
                          <span>•</span>
                          <span>{review.service}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Photos du Salon</h2>
            <div className="grid grid-cols-2 gap-3">
              {business.photos.map((photo, index) => (
                <div key={index} className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'info' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">À Propos</h2>
              <p className="text-gray-700">{business.description}</p>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-3">Horaires d'Ouverture</h3>
              <div className="space-y-2">
                {Object.entries(business.openingHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="text-gray-600">{day}</span>
                    <span className={hours === 'Fermé' ? 'text-red-500' : 'text-gray-900'}>
                      {hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-3">Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{business.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{business.address}, {business.city}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bouton flottant de réservation */}
      <div className="fixed bottom-4 left-4 right-4 z-30">
        <Button 
          onClick={() => setLocation("/quick-booking")}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-xl shadow-lg"
        >
          <Calendar className="w-5 h-5 mr-2" />
          Réserver Maintenant
        </Button>
      </div>
    </div>
  );
}