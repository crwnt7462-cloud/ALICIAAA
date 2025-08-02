import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  Calendar,
  Heart,
  Share2,
  ChevronLeft,
  Scissors,
  Palette
} from "lucide-react";
import { useLocation } from "wouter";

export default function EliteCoiffureMarais() {
  const [, setLocation] = useLocation();
  const [isLiked, setIsLiked] = useState(false);

  // Couleurs spécifiques pour Elite Coiffure Marais
  const salonColors = {
    primary: "#8B5CF6", // Violet premium
    accent: "#A855F7",
    background: "#F8FAFC",
    text: "#1E293B"
  };

  const salonData = {
    id: "salon-elite-marais",
    name: "Elite Coiffure Marais",
    category: "Coiffure Premium",
    description: "Salon de coiffure haut de gamme spécialisé dans les coupes tendances et colorations premium. Notre équipe experte vous offre un service personnalisé dans un cadre moderne et chaleureux.",
    address: "12 rue des Rosiers, 75004 Paris",
    phone: "01 42 74 88 92",
    rating: 4.9,
    reviews: 156,
    images: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop"
    ],
    services: [
      { name: "Coupe Femme", price: "65€", duration: "45min", icon: "✂️" },
      { name: "Coupe Homme", price: "45€", duration: "30min", icon: "✂️" },
      { name: "Coloration Premium", price: "120€", duration: "2h30", icon: "🎨" },
      { name: "Balayage", price: "150€", duration: "3h", icon: "🌟" },
      { name: "Brushing", price: "35€", duration: "30min", icon: "💨" },
      { name: "Traitement Capillaire", price: "80€", duration: "1h", icon: "💆" }
    ],
    openingHours: {
      "Lundi": "Fermé",
      "Mardi": "9h00 - 19h00", 
      "Mercredi": "9h00 - 19h00",
      "Jeudi": "9h00 - 21h00",
      "Vendredi": "9h00 - 19h00",
      "Samedi": "9h00 - 18h00",
      "Dimanche": "10h00 - 17h00"
    },
    team: [
      { name: "Sophie Martin", role: "Directrice artistique", experience: "15 ans" },
      { name: "Lucas Dubois", role: "Coloriste expert", experience: "8 ans" },
      { name: "Emma Rousseau", role: "Styliste", experience: "5 ans" }
    ]
  };

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: salonColors.background }}
    >
      {/* Header avec image */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={salonData.images[0]} 
          alt={salonData.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <button 
          onClick={() => setLocation('/search')}
          className="absolute top-4 left-4 p-2 rounded-full bg-white/90 backdrop-blur-sm"
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </button>

        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className="p-2 rounded-full bg-white/90 backdrop-blur-sm"
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-700'}`} />
          </button>
          <button className="p-2 rounded-full bg-white/90 backdrop-blur-sm">
            <Share2 className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        <div className="absolute bottom-4 left-4 text-white">
          <h1 className="text-2xl font-bold mb-1">{salonData.name}</h1>
          <div className="flex items-center gap-2 text-sm">
            <Badge 
              variant="secondary" 
              className="bg-white/20 text-white border-white/30"
            >
              {salonData.category}
            </Badge>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{salonData.rating}</span>
              <span className="text-white/80">({salonData.reviews})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="px-4 py-6 space-y-6">
        {/* Informations */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">{salonData.address}</p>
                <p className="text-sm text-gray-600">Le Marais - 5 min à pied du métro Saint-Paul</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-500" />
              <p className="font-medium">{salonData.phone}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-500" />
              <p className="font-medium text-green-600">Ouvert aujourd'hui 9h00 - 19h00</p>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-2">À propos</h2>
            <p className="text-gray-600 leading-relaxed">{salonData.description}</p>
          </CardContent>
        </Card>

        {/* Services */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-4">Nos prestations</h2>
            <div className="space-y-3">
              {salonData.services.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{service.icon}</span>
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-gray-600">{service.duration}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold" style={{ color: salonColors.primary }}>
                      {service.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Équipe */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-4">Notre équipe</h2>
            <div className="space-y-3">
              {salonData.team.map((member, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.role} • {member.experience}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Horaires */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-4">Horaires d'ouverture</h2>
            <div className="space-y-2">
              {Object.entries(salonData.openingHours).map(([day, hours]) => (
                <div key={day} className="flex justify-between">
                  <span className="text-gray-600">{day}</span>
                  <span className={hours === "Fermé" ? "text-red-600" : "text-gray-900 font-medium"}>
                    {hours}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bouton de réservation */}
        <div className="fixed bottom-4 left-4 right-4">
          <Button 
            onClick={() => setLocation('/salon-booking')}
            className="w-full py-4 text-lg font-semibold rounded-2xl shadow-lg"
            style={{ 
              backgroundColor: salonColors.primary,
              color: 'white'
            }}
          >
            <Calendar className="h-5 w-5 mr-2" />
            Réserver maintenant
          </Button>
        </div>
      </div>
    </div>
  );
}