import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, MapPin } from "lucide-react";
import { getGenericGlassButton } from '@/lib/salonColors';

interface CityCard {
 id: string;
 name: string;
 subtitle: string;
 image: string;
 count: number;
}

export default function PlanityStyleBeautyInstitute() {
 const [, setLocation] = useLocation();
 const [searchQuery, setSearchQuery] = useState('');
 const [locationQuery, setLocationQuery] = useState('');

 const popularCities: CityCard[] = [
  {
   id: 'paris',
   name: 'Instituts de beauté à Paris',
   subtitle: 'Découvrez nos',
   image: '/paris-bg.jpg',
   count: 1247
  },
  {
   id: 'marseille',
   name: 'Instituts de beauté à Marseille',
   subtitle: 'Découvrez nos',
   image: '/marseille-bg.jpg',
   count: 324
  },
  {
   id: 'lyon',
   name: 'Instituts de beauté à Lyon',
   subtitle: 'Découvrez nos',
   image: '/lyon-bg.jpg',
   count: 567
  }
 ];

 const additionalCities: CityCard[] = [
  {
   id: 'nice',
   name: 'Instituts de beauté à Nice',
   subtitle: 'Découvrez nos',
   image: '/nice-bg.jpg',
   count: 189
  },
  {
   id: 'toulouse',
   name: 'Instituts de beauté à Toulouse',
   subtitle: 'Découvrez nos',
   image: '/toulouse-bg.jpg',
   count: 234
  },
  {
   id: 'bordeaux',
   name: 'Instituts de beauté à Bordeaux',
   subtitle: 'Découvrez nos',
   image: '/bordeaux-bg.jpg',
   count: 156
  }
 ];

 const handleSearch = () => {
  if (searchQuery || locationQuery) {
   setLocation(`/beauty-institutes/search?q=${searchQuery}&location=${locationQuery}`);
  }
 };

 const handleCityClick = (cityId: string) => {
  setLocation(`/beauty-institutes/${cityId}`);
 };

 return (
  <div className="min-h-screen bg-gray-50">
   {/* Header */}
   <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
    <div className="max-w-6xl mx-auto px-4 py-4">
     <div className="flex items-center gap-4 mb-4">
      <Button
       variant="ghost"
       size="icon"
       onClick={() => window.history.back()}
       className="h-10 w-10 rounded-full"
      >
       <ArrowLeft className="h-4 w-4" />
      </Button>
      <h1 className="text-xl font-semibold text-gray-900">
       Instituts de beauté
      </h1>
     </div>

     {/* Barre de recherche principale */}
     <div className="text-center mb-6">
      <h2 className="text-2xl font-light text-gray-900 mb-6">
       Réserver en ligne un RDV avec un institut de beauté
      </h2>
      
      <div className="flex gap-2 max-w-2xl mx-auto">
       <div className="flex-1 relative">
        <Input
         value={searchQuery}
         onChange={(e) => setSearchQuery(e.target.value)}
         placeholder="Que cherchez-vous ?"
         className="h-12 pl-4 pr-10 border-gray-300 focus:border-violet-500 focus:ring-violet-500 text-base"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
       </div>
       <div className="flex-1 relative">
        <Input
         value={locationQuery}
         onChange={(e) => setLocationQuery(e.target.value)}
         placeholder="Adresse, ville..."
         className="h-12 pl-4 pr-10 border-gray-300 focus:border-violet-500 focus:ring-violet-500 text-base"
        />
        <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
       </div>
       <Button 
        onClick={handleSearch}
        className="h-12 px-8 bg-gray-900 hover:bg-gray-800 text-white font-medium"
       >
        Rechercher
       </Button>
      </div>
     </div>
    </div>
   </div>

   <div className="max-w-6xl mx-auto px-4 py-8">
    {/* Section titre */}
    <div className="mb-8">
     <h3 className="text-lg font-medium text-gray-900 mb-2">Institut de beauté</h3>
    </div>

    {/* Première rangée - 3 grandes cartes */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
     {popularCities.map((city) => (
      <Card 
       key={city.id}
       className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group border-gray-200"
       onClick={() => handleCityClick(city.id)}
      >
       <div className="relative h-48 bg-gradient-to-br from-slate-200 to-slate-300">
        {/* Image de fond simulée avec dégradé */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-100/30 to-amber-100/30"></div>
        
        {/* Contenu */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
         <div className="text-white">
          <p className="text-sm font-medium mb-1 opacity-90">{city.subtitle}</p>
          <h4 className="text-lg font-semibold leading-tight mb-2">{city.name}</h4>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
           {city.count} instituts
          </Badge>
         </div>
        </div>
        
        {/* Overlay sombre pour la lisibilité */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
       </div>
      </Card>
     ))}
    </div>

    {/* Deuxième rangée - 3 cartes supplémentaires */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
     {additionalCities.map((city) => (
      <Card 
       key={city.id}
       className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group border-gray-200"
       onClick={() => handleCityClick(city.id)}
      >
       <div className="relative h-48 bg-gradient-to-br from-slate-200 to-slate-300">
        {/* Image de fond simulée avec dégradé */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-green-100/30"></div>
        
        {/* Contenu */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
         <div className="text-white">
          <p className="text-sm font-medium mb-1 opacity-90">{city.subtitle}</p>
          <h4 className="text-lg font-semibold leading-tight mb-2">{city.name}</h4>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
           {city.count} instituts
          </Badge>
         </div>
        </div>
        
        {/* Overlay sombre pour la lisibilité */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
       </div>
      </Card>
     ))}
    </div>

    {/* Section informative */}
    <div className="mt-12 bg-white rounded-lg border border-gray-200 p-8">
     <div className="max-w-4xl mx-auto text-center">
      <h3 className="text-2xl font-light text-gray-900 mb-4">
       Trouvez votre institut de beauté idéal
      </h3>
      <p className="text-gray-600 text-lg leading-relaxed mb-6">
       Découvrez une sélection d'instituts de beauté près de chez vous. 
       Soins du visage, épilation, manucure, pédicure... Réservez en ligne 
       votre rendez-vous en quelques clics.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
       <div className="text-center">
        <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-3">
         <Search className="h-8 w-8 text-violet-600" />
        </div>
        <h4 className="font-medium text-gray-900 mb-2">Recherche facile</h4>
        <p className="text-sm text-gray-600">
         Trouvez rapidement un institut près de chez vous
        </p>
       </div>
       
       <div className="text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
         <MapPin className="h-8 w-8 text-amber-600" />
        </div>
        <h4 className="font-medium text-gray-900 mb-2">Géolocalisation</h4>
        <p className="text-sm text-gray-600">
         Découvrez les instituts dans votre quartier
        </p>
       </div>
       
       <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
         <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-full"></div>
         </div>
        </div>
        <h4 className="font-medium text-gray-900 mb-2">Réservation instantanée</h4>
        <p className="text-sm text-gray-600">
         Prenez rendez-vous en quelques clics seulement
        </p>
       </div>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
}