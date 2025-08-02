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
  User
} from "lucide-react";
import { useLocation } from "wouter";

export default function BarbierGentlemanBastille() {
  const [, setLocation] = useLocation();
  const [isLiked, setIsLiked] = useState(false);

  // Couleurs spécifiques pour Barbier Gentleman (Bleu masculin)
  const salonColors = {
    primary: "#1E40AF", // Bleu royal
    accent: "#3B82F6",
    background: "#F8FAFC",
    text: "#1E293B"
  };

  const salonData = {
    id: "barbier-gentleman-bastille",
    name: "Gentleman Barbier Bastille",
    category: "Barbier Traditionnel",
    description: "Barbier traditionnel pour hommes, spécialisé dans les coupes classiques et soins de barbe. Ambiance authentique et savoir-faire artisanal depuis 1920.",
    address: "45 rue de la Roquette, 75011 Paris",
    phone: "01 48 05 92 34",
    rating: 4.7,
    reviews: 89,
    images: [
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&h=600&fit=crop"
    ],
    services: [
      { name: "Coupe Classique", price: "35€", duration: "30min", icon: "✂️" },
      { name: "Coupe + Barbe", price: "50€", duration: "45min", icon: "🧔" },
      { name: "Taille de Barbe", price: "25€", duration: "20min", icon: "✨" },
      { name: "Rasage Traditionnel", price: "40€", duration: "30min", icon: "🪒" },
      { name: "Soin Barbe Premium", price: "45€", duration: "35min", icon: "💼" },
      { name: "Shampoing + Coupe", price: "40€", duration: "40min", icon: "🧴" }
    ],
    openingHours: {
      "Lundi": "Fermé",
      "Mardi": "9h00 - 19h00", 
      "Mercredi": "9h00 - 19h00",
      "Jeudi": "9h00 - 19h00",
      "Vendredi": "9h00 - 19h00",
      "Samedi": "9h00 - 18h00",
      "Dimanche": "10h00 - 16h00"
    },
    team: [
      { name: "Antoine Dubois", role: "Maître barbier", experience: "20 ans" },
      { name: "Pierre Martin", role: "Barbier expert", experience: "12 ans" },
      { name: "Jean-Luc Bernard", role: "Spécialiste rasage", experience: "15 ans" }
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
                <p className="text-sm text-gray-600">Bastille - 2 min à pied du métro Bastille</p>
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
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="outline" className="text-blue-700 border-blue-300">Traditionnel</Badge>
              <Badge variant="outline" className="text-blue-700 border-blue-300">Depuis 1920</Badge>
              <Badge variant="outline" className="text-blue-700 border-blue-300">Hommes uniquement</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-4">Nos prestations</h2>
            <div className="space-y-3">
              {salonData.services.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-blue-100 bg-blue-50/30">
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
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-semibold">
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
            <User className="h-5 w-5 mr-2" />
            Réserver maintenant
          </Button>
        </div>
      </div>
    </div>
  );
}