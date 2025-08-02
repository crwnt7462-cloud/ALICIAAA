import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Star, MapPin, Clock, Heart } from "lucide-react";
import { getGenericGlassButton } from '@/lib/salonColors';

interface Professional {
 id: string;
 name: string;
 type: string;
 address: string;
 rating: number;
 reviewCount: number;
 priceRange: string;
 image: string;
 services: string[];
 openNow: boolean;
 distance?: string;
}

export default function PlanityStyleProfessionalList() {
 const [, setLocation] = useLocation();
 const [searchQuery, setSearchQuery] = useState('');
 const [selectedCategory, setSelectedCategory] = useState('coiffeur');

 const categories = [
  { id: 'coiffeur', name: 'Coiffeur', count: 1205 },
  { id: 'barbier', name: 'Barbier', count: 324 },
  { id: 'manucure', name: 'Manucure', count: 892 },
  { id: 'institut', name: 'Institut de beauté', count: 456 }
 ];

 const professionals: Professional[] = [
  {
   id: '1',
   name: 'Salon Excellence Paris',
   type: 'Salon de coiffure',
   address: '45 Avenue Victor Hugo, 75116 Paris',
   rating: 4.9,
   reviewCount: 343,
   priceRange: '€€€',
   image: '/salon-1.jpg',
   services: ['Coupe', 'Coloration', 'Brushing'],
   openNow: true,
   distance: '0.8 km'
  },
  {
   id: '2',
   name: 'Coiffure Moderne',
   type: 'Salon de coiffure',
   address: '15 Rue de la Paix, 75002 Paris',
   rating: 4.7,
   reviewCount: 156,
   priceRange: '€€',
   image: '/salon-2.jpg',
   services: ['Coupe', 'Coloration', 'Permanente'],
   openNow: true,
   distance: '1.2 km'
  },
  {
   id: '3',
   name: 'Studio Hair Design',
   type: 'Salon de coiffure',
   address: '8 Boulevard Saint-Germain, 75005 Paris',
   rating: 4.8,
   reviewCount: 289,
   priceRange: '€€€',
   image: '/salon-3.jpg',
   services: ['Coupe', 'Balayage', 'Lissage'],
   openNow: false,
   distance: '2.1 km'
  }
 ];

 const handleProfessionalClick = (professional: Professional) => {
  setLocation(`/salon-detail/${professional.id}`);
 };

 return (
  <div className="min-h-screen bg-gray-50">
   {/* Header */}
   <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
    <div className="max-w-4xl mx-auto px-4 py-4">
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
       Réserver en ligne un RDV avec un coiffeur
      </h1>
     </div>

     {/* Barre de recherche */}
     <div className="flex gap-2">
      <div className="flex-1 relative">
       <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Que cherchez-vous ?"
        className="h-12 pl-4 pr-10 border-gray-300 focus:border-violet-500 focus:ring-violet-500"
       />
       <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
      <div className="flex-1 relative">
       <Input
        placeholder="Adresse, ville..."
        className="h-12 pl-4 border-gray-300 focus:border-violet-500 focus:ring-violet-500"
       />
       <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
      <Button className="h-12 px-6 bg-gray-900 hover:bg-gray-800">
       Rechercher
      </Button>
     </div>
    </div>
   </div>

   <div className="max-w-4xl mx-auto px-4 py-6">
    {/* Catégories */}
    <div className="mb-6">
     <div className="flex gap-2 overflow-x-auto pb-2">
      {categories.map((category) => (
       <Button
        key={category.id}
        variant={selectedCategory === category.id ? "default" : "outline"}
        onClick={() => setSelectedCategory(category.id)}
        className={`whitespace-nowrap ${
         selectedCategory === category.id
          ? 'bg-gray-900 text-white'
          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
       >
        {category.name} ({category.count})
       </Button>
      ))}
     </div>
    </div>

    {/* Titre de section */}
    <div className="mb-6">
     <h2 className="text-lg font-medium text-gray-900 mb-2">Coiffeur</h2>
     <p className="text-sm text-gray-600">
      Découvrez nos coiffeurs à Paris et prenez rendez-vous en ligne
     </p>
    </div>

    {/* Liste des professionnels */}
    <div className="space-y-4">
     {professionals.map((professional) => (
      <Card 
       key={professional.id}
       className="border border-gray-200 hover:border-gray-300 cursor-pointer transition-all hover:shadow-md"
       onClick={() => handleProfessionalClick(professional)}
      >
       <CardContent className="p-0">
        <div className="flex">
         {/* Image */}
         <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-l-lg flex items-center justify-center">
          <div className="w-16 h-16 bg-white rounded-full shadow-inner flex items-center justify-center">
           <div className="w-8 h-1 bg-gray-400 rounded-full transform rotate-45"></div>
          </div>
         </div>

         {/* Contenu */}
         <div className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
           <div>
            <h3 className="font-semibold text-gray-900 mb-1">{professional.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
             <MapPin className="h-3 w-3" />
             <span>{professional.address}</span>
             {professional.distance && (
              <span className="text-gray-500">• {professional.distance}</span>
             )}
            </div>
            <div className="flex items-center gap-2 mb-2">
             <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-current text-amber-400" />
              <span className="text-sm font-medium text-gray-900">{professional.rating}</span>
              <span className="text-sm text-gray-500">({professional.reviewCount} avis)</span>
             </div>
             <span className="text-sm text-gray-500">{professional.priceRange}</span>
            </div>
           </div>
           
           <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
           >
            <Heart className="h-4 w-4" />
           </Button>
          </div>

          <div className="flex items-center gap-2 mb-3">
           {professional.services.slice(0, 3).map((service) => (
            <Badge key={service} variant="secondary" className="text-xs">
             {service}
            </Badge>
           ))}
          </div>

          <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
            {professional.openNow ? (
             <div className="flex items-center gap-1 text-green-600 text-sm">
              <Clock className="h-3 w-3" />
              <span>Ouvert maintenant</span>
             </div>
            ) : (
             <div className="flex items-center gap-1 text-red-600 text-sm">
              <Clock className="h-3 w-3" />
              <span>Fermé</span>
             </div>
            )}
           </div>
           
           <Button
            size="sm"
            className="bg-gray-900 hover:bg-gray-800 text-white px-4"
           >
            Voir les créneaux
           </Button>
          </div>
         </div>
        </div>
       </CardContent>
      </Card>
     ))}
    </div>
   </div>
  </div>
 );
}