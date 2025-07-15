import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
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
  Camera,
  Globe,
  Mail,
  Instagram,
  Facebook,
  MessageCircle,
  ExternalLink,
  Award,
  Shield,
  Zap,
  Users,
  TrendingUp,
  Filter,
  ChevronRight,
  PlayCircle
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
  const [activeTab, setActiveTab] = useState<'services' | 'reviews' | 'photos' | 'info'>('services');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAllReviews, setShowAllReviews] = useState(false);
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
        description: "Salon de beauté haut de gamme spécialisé dans les coupes tendances, colorations artistiques et soins capillaires premium. Notre équipe d'experts vous accueille dans un cadre moderne et chaleureux au cœur de Paris.",
        address: "42 rue de Rivoli",
        city: "Paris 1er",
        phone: "01 42 36 89 12",
        email: "contact@studio-elegance.fr",
        website: "www.studio-elegance-paris.fr",
        instagram: "@studioeleganceparis",
        facebook: "StudioEleganceParis",
        image: "/api/placeholder/400/300",
        rating: 4.8,
        reviewCount: 247,
        priceRange: "€€€",
        specialties: ["Coupe & Styling", "Coloration", "Soins Capillaires", "Extensions", "Balayage"],
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
          "/api/placeholder/300/200",
          "/api/placeholder/300/200",
          "/api/placeholder/300/200"
        ],
        verified: true,
        responseTime: "Répond en moins de 2h",
        awards: ["Prix Excellence 2024", "Salon Éco-responsable", "Top 10 Paris"],
        teamSize: 8,
        experience: "15 ans d'expérience",
        languages: ["Français", "Anglais", "Espagnol"],
        paymentMethods: ["Carte bancaire", "Espèces", "Apple Pay", "Google Pay"],
        accessibility: ["Accès PMR", "Parking proche", "Transport public"],
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
        {
          id: 1,
          name: "Coupe Femme",
          description: "Coupe personnalisée avec shampoing et brushing inclus",
          price: 65,
          duration: 60,
          category: "Coupe"
        },
        {
          id: 2,
          name: "Coupe Homme",
          description: "Coupe moderne avec finition à la tondeuse",
          price: 45,
          duration: 45,
          category: "Coupe"
        },
        {
          id: 3,
          name: "Coloration Complète",
          description: "Coloration racines + longueurs avec soin protecteur",
          price: 95,
          duration: 120,
          category: "Coloration"
        },
        {
          id: 4,
          name: "Balayage Premium",
          description: "Technique de mèches naturelles avec tonalisation",
          price: 140,
          duration: 180,
          category: "Coloration"
        },
        {
          id: 5,
          name: "Mèches Traditionnelles",
          description: "Éclaircissement par mèches avec papier alu",
          price: 85,
          duration: 120,
          category: "Coloration"
        },
        {
          id: 6,
          name: "Soin Hydratant Intense",
          description: "Masque réparateur pour cheveux secs et abîmés",
          price: 35,
          duration: 30,
          category: "Soin"
        },
        {
          id: 7,
          name: "Soin Botox Capillaire",
          description: "Traitement restructurant anti-âge",
          price: 75,
          duration: 90,
          category: "Soin"
        },
        {
          id: 8,
          name: "Brushing Glamour",
          description: "Mise en forme avec produits de finition premium",
          price: 35,
          duration: 45,
          category: "Styling"
        },
        {
          id: 9,
          name: "Chignon Mariée",
          description: "Coiffure élégante pour événements spéciaux",
          price: 85,
          duration: 75,
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
          comment: "Absolument parfait ! L'équipe est très professionnelle et le résultat dépasse mes attentes. Je recommande vivement ce salon, l'accueil est chaleureux et les conseils pertinents.",
          date: "2024-01-10",
          service: "Coloration Complète",
          verified: true
        },
        {
          id: 2,
          clientName: "Sophie D.",
          rating: 5,
          comment: "Salon magnifique, service impeccable. Ma coiffeuse a su exactement ce que je voulais. Très satisfaite du résultat et de l'expérience globale !",
          date: "2024-01-08",
          service: "Coupe Femme",
          verified: true
        },
        {
          id: 3,
          clientName: "Emma R.",
          rating: 4,
          comment: "Très bon salon, ambiance agréable. Le balayage est réussi, juste un petit délai d'attente mais ça valait le coup. Je reviendrai !",
          date: "2024-01-05",
          service: "Balayage Premium",
          verified: true
        },
        {
          id: 4,
          clientName: "Camille M.",
          rating: 5,
          comment: "Équipe au top ! Conseil personnalisé et résultat parfait. Le salon est très propre et moderne. Les produits utilisés sont de qualité.",
          date: "2024-01-03",
          service: "Soin Hydratant Intense",
          verified: true
        },
        {
          id: 5,
          clientName: "Julie B.",
          rating: 4,
          comment: "Très satisfaite de ma visite. Bon rapport qualité-prix et personnel accueillant. L'ambiance est relaxante.",
          date: "2023-12-28",
          service: "Brushing Glamour",
          verified: false
        },
        {
          id: 6,
          clientName: "Alexandra T.",
          rating: 5,
          comment: "Premier rendez-vous et je suis conquise ! La styliste a écouté mes envies et a réalisé exactement ce que j'imaginais. Salon très professionnel.",
          date: "2023-12-25",
          service: "Chignon Mariée",
          verified: true
        },
        {
          id: 7,
          clientName: "Lucas M.",
          rating: 5,
          comment: "Excellent accueil, coupe parfaite. Le barbier est très doué et donne de bons conseils. Je recommande sans hésiter !",
          date: "2023-12-20",
          service: "Coupe Homme",
          verified: true
        },
        {
          id: 8,
          clientName: "Inès K.",
          rating: 4,
          comment: "Très contente du soin botox, mes cheveux sont visiblement plus beaux. Personnel attentionné et cadre agréable.",
          date: "2023-12-18",
          service: "Soin Botox Capillaire",
          verified: true
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
      {/* Header avec image amélioré */}
      <div className="relative h-72 bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/30" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/")}
          className="absolute top-4 left-4 z-10 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFavorite(!isFavorite)}
            className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/20"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/20"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl font-bold text-white">{business.name}</h1>
            {business.verified && (
              <div className="bg-blue-500 rounded-full p-1">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-white/90 text-sm mb-3">
            <div className="flex items-center gap-1">
              {renderStars(Math.floor(business.rating))}
              <span className="ml-1 font-medium text-lg">{business.rating}</span>
              <span>({business.reviewCount} avis)</span>
            </div>
            <span className="bg-white/20 px-2 py-1 rounded-full text-xs">{business.priceRange}</span>
          </div>

          <div className="flex items-center gap-4 text-white/80 text-sm">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{business.address}, {business.city}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span className="text-green-300">{business.responseTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Informations rapides améliorées */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-violet-500" />
            <span className="text-gray-600">{business.teamSize} coiffeurs</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Award className="w-4 h-4 text-amber-500" />
            <span className="text-gray-600">{business.experience}</span>
          </div>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
          {business.specialties.map((specialty, index) => (
            <Badge key={index} variant="outline" className="whitespace-nowrap bg-violet-50 text-violet-700 border-violet-200">
              {specialty}
            </Badge>
          ))}
        </div>

        {business.awards.length > 0 && (
          <div className="flex gap-2 overflow-x-auto">
            {business.awards.map((award, index) => (
              <Badge key={index} className="whitespace-nowrap bg-amber-100 text-amber-800 border-amber-200">
                <Award className="w-3 h-3 mr-1" />
                {award}
              </Badge>
            ))}
          </div>
        )}
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

            {/* Filtres par catégorie */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className={selectedCategory === 'all' ? 'bg-violet-600' : ''}
              >
                Tous
              </Button>
              {['Coupe', 'Coloration', 'Soin', 'Styling'].map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? 'bg-violet-600' : 'whitespace-nowrap'}
                >
                  {category}
                </Button>
              ))}
            </div>
            
            {services
              ?.filter(service => selectedCategory === 'all' || service.category === selectedCategory)
              .map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-violet-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getCategoryIcon(service.category)}
                        <h3 className="font-semibold text-lg">{service.name}</h3>
                        <Badge variant="outline" className="text-xs bg-violet-50 text-violet-700 border-violet-200">
                          {service.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 leading-relaxed">{service.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{service.duration} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="w-4 h-4" />
                          <span>Populaire</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold text-violet-600 mb-2">{service.price}€</p>
                      <Button 
                        size="sm" 
                        className="bg-violet-600 hover:bg-violet-700 text-white min-w-[80px]"
                        onClick={() => setLocation("/quick-booking")}
                      >
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
                <span className="font-medium text-lg">{business.rating}/5</span>
              </div>
            </div>

            {/* Répartition des notes */}
            <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200">
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">Répartition des notes</h3>
                {Object.entries(business.ratingBreakdown)
                  .reverse()
                  .map(([rating, count]) => (
                  <div key={rating} className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-1 min-w-[60px]">
                      <span className="text-sm">{rating}</span>
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <Progress 
                        value={(count / business.reviewCount) * 100} 
                        className="h-2"
                      />
                    </div>
                    <span className="text-sm text-gray-600 min-w-[30px]">{count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Avis clients */}
            {reviews?.slice(0, showAllReviews ? reviews.length : 3).map((review) => (
              <Card key={review.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-violet-100 text-violet-600">
                          {review.clientName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
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
                          <span className="text-violet-600">{review.service}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </CardContent>
              </Card>
            ))}

            {reviews && reviews.length > 3 && (
              <Button
                variant="outline"
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="w-full"
              >
                {showAllReviews ? 'Voir moins' : `Voir tous les avis (${reviews.length})`}
                <ChevronRight className={`w-4 h-4 ml-2 transition-transform ${showAllReviews ? 'rotate-90' : ''}`} />
              </Button>
            )}
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Galerie Photos</h2>
              <Badge variant="outline" className="text-xs">
                {business.photos.length} photos
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {business.photos.map((photo, index) => (
                <div key={index} className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-400 via-purple-500 to-pink-500 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <PlayCircle className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {index === 0 && (
                    <Badge className="absolute top-2 left-2 bg-amber-500 text-white">
                      Mise en avant
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            <Card className="bg-violet-50 border-violet-200">
              <CardContent className="p-4 text-center">
                <Camera className="w-8 h-8 text-violet-600 mx-auto mb-2" />
                <p className="text-sm text-violet-700 font-medium">Toutes les photos sont régulièrement mises à jour</p>
                <p className="text-xs text-violet-600 mt-1">Dernière mise à jour : Il y a 2 jours</p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'info' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">À Propos</h2>
              <p className="text-gray-700 leading-relaxed">{business.description}</p>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-violet-500" />
                Horaires d'Ouverture
              </h3>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {Object.entries(business.openingHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">{day}</span>
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          hours === 'Fermé' 
                            ? 'bg-red-100 text-red-600' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Phone className="w-4 h-4 text-violet-500" />
                Contact & Réseaux
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium">{business.phone}</p>
                        <p className="text-xs text-gray-500">Appeler directement</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{business.email}</p>
                        <p className="text-xs text-gray-500">Envoyer un email</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                    </div>
                  </CardContent>
                </Card>

                {business.website && (
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-violet-500" />
                        <div>
                          <p className="font-medium">{business.website}</p>
                          <p className="text-xs text-gray-500">Site web officiel</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex gap-2">
                  {business.instagram && (
                    <Card className="flex-1 hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <Instagram className="w-5 h-5 text-pink-500" />
                          <div>
                            <p className="font-medium text-sm">{business.instagram}</p>
                            <p className="text-xs text-gray-500">Instagram</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {business.facebook && (
                    <Card className="flex-1 hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <Facebook className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-sm">{business.facebook}</p>
                            <p className="text-xs text-gray-500">Facebook</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-violet-500" />
                Adresse & Accès
              </h3>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">{business.address}</p>
                      <p className="text-gray-600">{business.city}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {business.accessibility.map((access, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {access}
                        </Badge>
                      ))}
                    </div>

                    <Button className="w-full bg-violet-600 hover:bg-violet-700" size="sm">
                      <MapPin className="w-4 h-4 mr-2" />
                      Voir l'itinéraire
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-3">Informations Pratiques</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Modes de paiement</h4>
                  <div className="flex flex-wrap gap-1">
                    {business.paymentMethods.map((method, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {method}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Langues parlées</h4>
                  <div className="flex flex-wrap gap-1">
                    {business.languages.map((language, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {language}
                      </Badge>
                    ))}
                  </div>
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