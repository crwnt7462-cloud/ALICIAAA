import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Star, Calendar, ArrowLeft, Scissors, Users, Palette } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";

export default function CoiffureService() {
  const [, setLocation] = useLocation();
  const [searchLocation, setSearchLocation] = useState("");

  const coiffureServices = [
    {
      id: 1,
      name: "Coupe Femme",
      description: "Coupe personnalisée adaptée à votre morphologie",
      price: "45-80€",
      duration: "45 min",
      icon: <Scissors className="w-6 h-6" />
    },
    {
      id: 2,
      name: "Coloration",
      description: "Couleur complète ou mèches selon vos envies",
      price: "70-120€",
      duration: "2h",
      icon: <Palette className="w-6 h-6" />
    },
    {
      id: 3,
      name: "Brushing",
      description: "Mise en forme et volume professionnel",
      price: "30-45€",
      duration: "30 min",
      icon: <Users className="w-6 h-6" />
    },
    {
      id: 4,
      name: "Coupe Homme",
      description: "Coupe moderne adaptée à votre style",
      price: "25-40€",
      duration: "30 min",
      icon: <Scissors className="w-6 h-6" />
    }
  ];

  const topSalons = [
    {
      id: "salon-excellence",
      name: "Salon Excellence Paris",
      location: "Paris 16ème",
      rating: 4.9,
      reviews: 324,
      nextSlot: "Aujourd'hui 15h",
      speciality: "Coiffure & Coloration"
    },
    {
      id: "salon-moderne",
      name: "Salon Moderne République",
      location: "Paris 10ème",
      rating: 4.8,
      reviews: 198,
      nextSlot: "Demain 9h30",
      speciality: "Coiffure Créative"
    }
  ];

  const handleSearch = () => {
    setLocation(`/search?q=coiffure&location=${encodeURIComponent(searchLocation || 'paris')}`);
  };

  return (
    <div className="min-h-screen" 
         style={{
           background: '#f8f9fa',
           backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(168, 85, 247, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.06) 0%, transparent 50%)',
         }}>
      
      {/* Header */}
      <header className="bg-white/40 backdrop-blur-md border-white/30 border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => setLocation("/")}
                className="glass-button p-2 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5 text-black" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">Services Coiffure</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-md border-white/40 border rounded-full px-4 py-2 mb-6">
            <Scissors className="w-5 h-5 text-violet-600" />
            <span className="text-sm font-medium text-black">Services Coiffure</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trouvez votre coiffeur idéal
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Découvrez les meilleurs salons de coiffure près de chez vous et réservez en quelques clics
          </p>

          {/* Barre de recherche */}
          <div className="max-w-md mx-auto mb-8">
            <div className="space-y-3">
              <div className="relative">
                <Input
                  placeholder="Ville"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="h-12 pl-4 pr-12 text-sm rounded-xl border border-gray-300 focus:border-violet-500 bg-white/50 backdrop-blur-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          setSearchLocation("Près de moi");
                        },
                        (error) => console.log("Géolocalisation non disponible")
                      );
                    }
                  }}
                  className="absolute right-4 top-3 text-violet-500 active:text-violet-700"
                >
                  <MapPin className="w-6 h-6" />
                </button>
              </div>
              <Button 
                onClick={handleSearch}
                className="w-full h-12 glass-button text-black text-sm font-medium rounded-xl"
              >
                <Search className="w-4 h-4 mr-2" />
                Rechercher des salons de coiffure
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Services disponibles */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Services populaires</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coiffureServices.map((service) => (
              <Card key={service.id} className="bg-white/30 backdrop-blur-md border-white/40 hover:bg-white/40 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {service.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-violet-600">{service.price}</span>
                    <span className="text-gray-500">{service.duration}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Salons recommandés */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Salons recommandés</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {topSalons.map((salon) => (
              <Card key={salon.id} className="bg-white/30 backdrop-blur-md border-white/40 hover:bg-white/40 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{salon.name}</h3>
                      <p className="text-sm text-gray-600">{salon.location}</p>
                      <p className="text-sm text-violet-600 font-medium">{salon.speciality}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{salon.rating}</span>
                      <span className="text-xs text-gray-500">({salon.reviews})</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <span className="text-green-600 font-medium">Disponible</span>
                      <span className="text-gray-500 ml-2">{salon.nextSlot}</span>
                    </div>
                    <Button 
                      className="glass-button text-black px-4 py-2 text-sm rounded-lg"
                      onClick={() => setLocation(`/salon/${salon.id}`)}
                    >
                      Réserver
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button 
              className="glass-button text-black px-8 py-3 text-base rounded-xl"
              onClick={handleSearch}
            >
              Voir tous les salons de coiffure
            </Button>
          </div>
        </motion.section>

      </div>
    </div>
  );
}