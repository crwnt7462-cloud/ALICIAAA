import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Phone, 
  Clock, 
  Calendar,
  Heart,
  Share2,
  CheckCircle,
  Camera,
  Globe,
  MessageCircle,
  Award,
  Users,
  ChevronRight,
  Filter
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
  helpful?: number;
  photos?: number;
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
  instagram?: string;
  facebook?: string;
  awards: string[];
  teamSize: number;
  experience: string;
  languages: string[];
  paymentMethods: string[];
  accessibility: string[];
  ratingBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export default function SalonDetail() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'reviews'>('overview');
  const [isFavorite, setIsFavorite] = useState(false);
  
  const salonId = 1;

  const { data: business } = useQuery({
    queryKey: ['/api/public/business', salonId],
    queryFn: async () => {
      return {
        id: 1,
        name: "Studio Élégance",
        description: "Salon moderne spécialisé dans les coupes tendances et colorations artistiques. Notre équipe d'experts vous accueille dans un cadre contemporain au cœur de Paris.",
        address: "42 rue de Rivoli",
        city: "Paris 1er",
        phone: "01 42 36 89 12",
        email: "contact@studio-elegance.fr",
        website: "studio-elegance.fr",
        instagram: "@studioelegance",
        rating: 4.8,
        reviewCount: 247,
        priceRange: "€€€",
        specialties: ["Balayage", "Coupe", "Coloration"],
        openingHours: {
          "Lundi": "9h00 - 19h00",
          "Mardi": "9h00 - 19h00", 
          "Mercredi": "9h00 - 19h00",
          "Jeudi": "9h00 - 20h00",
          "Vendredi": "9h00 - 20h00",
          "Samedi": "8h00 - 18h00",
          "Dimanche": "Fermé"
        },
        photos: ["1", "2", "3", "4", "5", "6"],
        verified: true,
        responseTime: "Répond en 2h",
        awards: ["Top Salon 2024", "Excellence Service"],
        teamSize: 8,
        experience: "12 ans",
        languages: ["Français", "Anglais"],
        paymentMethods: ["CB", "Espèces", "Chèques"],
        accessibility: ["Accès PMR", "Parking"],
        ratingBreakdown: {
          5: 180,
          4: 45,
          3: 15,
          2: 5,
          1: 2
        }
      } as Business;
    }
  });

  const { data: services } = useQuery({
    queryKey: ['/api/public/services', salonId],
    queryFn: async () => {
      return [
        { id: 1, name: "Coupe Femme", description: "Coupe personnalisée avec shampoing", price: 65, duration: 60, category: "Coupe" },
        { id: 2, name: "Coupe Homme", description: "Coupe moderne avec finition", price: 45, duration: 45, category: "Coupe" },
        { id: 3, name: "Coloration", description: "Coloration complète avec soin", price: 95, duration: 120, category: "Coloration" },
        { id: 4, name: "Balayage", description: "Technique de mèches naturelles", price: 140, duration: 180, category: "Coloration" },
        { id: 5, name: "Soin Hydratant", description: "Masque réparateur professionnel", price: 35, duration: 30, category: "Soin" },
        { id: 6, name: "Brushing", description: "Mise en forme avec produits premium", price: 35, duration: 45, category: "Styling" }
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
          comment: "Service exceptionnel ! Jessica a parfaitement réalisé ma coloration. Le salon est moderne et l'équipe très professionnelle. Je recommande vivement.",
          date: "2024-01-10",
          service: "Coloration",
          verified: true,
          helpful: 12,
          photos: 2
        },
        {
          id: 2,
          clientName: "Sophie M.",
          rating: 5,
          comment: "Première fois dans ce salon et je suis conquise ! Thomas a fait une coupe magnifique. Service impeccable, je reviendrai sans hésiter.",
          date: "2024-01-08",
          service: "Coupe Femme",
          verified: true,
          helpful: 8,
          photos: 1
        },
        {
          id: 3,
          clientName: "Emma R.",
          rating: 5,
          comment: "Mon balayage est parfait ! Technique irréprochable et résultat naturel. L'équipe est à l'écoute et très compétente.",
          date: "2024-01-05",
          service: "Balayage",
          verified: true,
          helpful: 15,
          photos: 3
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
            ? 'fill-amber-400 text-amber-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (!business) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header épuré */}
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="bg-white/90 backdrop-blur-sm hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
        
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFavorite(!isFavorite)}
            className="bg-white/90 backdrop-blur-sm hover:bg-white"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="bg-white/90 backdrop-blur-sm hover:bg-white"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200" />
      </div>

      {/* Infos principales */}
      <div className="px-4 pb-6 -mt-8">
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{business.name}</h1>
                  {business.verified && (
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    {renderStars(Math.floor(business.rating))}
                  </div>
                  <span className="font-semibold">{business.rating}</span>
                  <span className="text-gray-500">({business.reviewCount} avis)</span>
                  <Badge variant="outline" className="ml-2">{business.priceRange}</Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{business.address}, {business.city}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-green-600">{business.responseTime}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {business.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="bg-violet-100 text-violet-700">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <Button 
              onClick={() => setLocation(`/book/${business.id}`)}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-3"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Réserver maintenant
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Onglets navigation */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-20">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="w-full h-12 bg-white rounded-none border-b-0">
            <TabsTrigger value="overview" className="flex-1 data-[state=active]:bg-violet-50 data-[state=active]:text-violet-700">
              Infos
            </TabsTrigger>
            <TabsTrigger value="services" className="flex-1 data-[state=active]:bg-violet-50 data-[state=active]:text-violet-700">
              Services
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1 data-[state=active]:bg-violet-50 data-[state=active]:text-violet-700">
              Avis
            </TabsTrigger>
          </TabsList>

          <div className="px-4 py-6">
            <TabsContent value="overview" className="mt-0 space-y-6">
              {/* À propos */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">À propos</h3>
                  <p className="text-gray-700 leading-relaxed">{business.description}</p>
                </CardContent>
              </Card>

              {/* Horaires */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Horaires</h3>
                  <div className="space-y-2">
                    {Object.entries(business.openingHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="text-gray-600">{day}</span>
                        <span className={hours === 'Fermé' ? 'text-red-600' : 'text-gray-900'}>{hours}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Contact</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-violet-600" />
                      <span>{business.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-violet-600" />
                      <span>{business.website}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-4 h-4 text-violet-600" />
                      <span>{business.instagram}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="mt-0 space-y-4">
              {services?.map((service) => (
                <Card key={service.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>{service.duration} min</span>
                          <Badge variant="outline" className="text-xs">{service.category}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{service.price}€</div>
                        <Button size="sm" className="mt-2 bg-violet-600 hover:bg-violet-700">
                          Choisir
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="reviews" className="mt-0 space-y-4">
              {/* Statistiques condensées */}
              <Card className="bg-violet-50 border-violet-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-violet-600">{business.rating}/5</div>
                      <div className="flex items-center gap-1 mb-1">
                        {renderStars(Math.floor(business.rating))}
                      </div>
                      <div className="text-sm text-gray-600">{business.reviewCount} avis</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 mb-1">97% recommandent</div>
                      <div className="text-sm text-gray-600">Service noté 4.9/5</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Avis clients */}
              {reviews?.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-violet-100 text-violet-600 font-medium">
                          {review.clientName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{review.clientName}</span>
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
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{review.comment}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 text-gray-500">
                        {review.photos && review.photos > 0 && (
                          <div className="flex items-center gap-1">
                            <Camera className="w-4 h-4" />
                            <span>{review.photos}</span>
                          </div>
                        )}
                        {review.helpful && review.helpful > 0 && (
                          <span>Utile ({review.helpful})</span>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-violet-600">
                        Utile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}