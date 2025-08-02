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
  Waves
} from "lucide-react";
import { useLocation } from "wouter";

export default function SpaWellnessMontparnasse() {
  const [, setLocation] = useLocation();
  const [isLiked, setIsLiked] = useState(false);

  // Couleurs spécifiques pour Spa Wellness (Vert zen)
  const salonColors = {
    primary: "#059669", // Vert émeraude
    accent: "#10B981",
    background: "#F0FDF4",
    text: "#064E3B"
  };

  const salonData = {
    id: "spa-wellness-montparnasse",
    name: "Spa Wellness Montparnasse",
    category: "Centre de Bien-être",
    description: "Centre de bien-être proposant massages, soins corporels et relaxation dans un environnement zen. Évasion totale au cœur de Paris pour votre bien-être.",
    address: "89 boulevard du Montparnasse, 75006 Paris",
    phone: "01 45 44 27 18",
    rating: 4.8,
    reviews: 178,
    images: [
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop"
    ],
    services: [
      { name: "Massage Relaxant", price: "95€", duration: "1h", icon: "🧘" },
      { name: "Massage Deep Tissue", price: "110€", duration: "1h15", icon: "💆" },
      { name: "Soin Corps Hydratant", price: "75€", duration: "45min", icon: "🌿" },
      { name: "Hammam + Gommage", price: "85€", duration: "1h", icon: "🛁" },
      { name: "Massage Pierres Chaudes", price: "125€", duration: "1h30", icon: "🔥" },
      { name: "Séance Aromathérapie", price: "70€", duration: "45min", icon: "🌸" }
    ],
    openingHours: {
      "Lundi": "10h00 - 20h00",
      "Mardi": "10h00 - 20h00", 
      "Mercredi": "10h00 - 20h00",
      "Jeudi": "10h00 - 21h00",
      "Vendredi": "10h00 - 20h00",
      "Samedi": "9h00 - 19h00",
      "Dimanche": "11h00 - 18h00"
    },
    team: [
      { name: "Sophia Chen", role: "Masseuse certifiée", experience: "10 ans" },
      { name: "Thomas Dubois", role: "Thérapeute holistique", experience: "8 ans" },
      { name: "Amélie Martin", role: "Spécialiste aromathérapie", experience: "7 ans" }
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
                <p className="text-sm text-gray-600">Montparnasse - 3 min à pied du métro Montparnasse</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-500" />
              <p className="font-medium">{salonData.phone}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-500" />
              <p className="font-medium text-green-600">Ouvert aujourd'hui 10h00 - 20h00</p>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-2">À propos</h2>
            <p className="text-gray-600 leading-relaxed">{salonData.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="outline" className="text-green-700 border-green-300">Zen</Badge>
              <Badge variant="outline" className="text-green-700 border-green-300">Relaxation</Badge>
              <Badge variant="outline" className="text-green-700 border-green-300">Bien-être</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-4">Nos prestations</h2>
            <div className="space-y-3">
              {salonData.services.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-green-100 bg-green-50/30">
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
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold">
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
            <Waves className="h-5 w-5 mr-2" />
            Réserver maintenant
          </Button>
        </div>
      </div>
    </div>
  );
}