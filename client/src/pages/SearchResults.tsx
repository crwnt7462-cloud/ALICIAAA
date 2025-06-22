import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Search, MapPin, Star, Clock, Filter, SlidersHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SearchResults() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [priceRange, setPriceRange] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Extract search params from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q') || '';
    const location = urlParams.get('location') || '';
    setSearchQuery(query);
    setSearchLocation(location);
  }, []);

  const searchResults = [
    {
      id: "demo-user",
      name: "Salon Belle Époque",
      rating: 4.8,
      reviews: 247,
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&h=200&fit=crop",
      location: "Paris 15ème",
      distance: "1.2 km",
      nextSlot: "Aujourd'hui 14h30",
      services: ["Coiffure", "Coloration", "Soins"],
      priceRange: "€€",
      specialties: searchQuery.toLowerCase().includes('coiffure') ? ['Coiffure'] : ['Soins du visage']
    },
    {
      id: "salon-2",
      name: "Beauty Studio Emma",
      rating: 4.9,
      reviews: 189,
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=200&fit=crop",
      location: "Paris 12ème",
      distance: "2.1 km",
      nextSlot: "Demain 10h00",
      services: ["Ongles", "Extensions", "Maquillage"],
      priceRange: "€€€",
      specialties: searchQuery.toLowerCase().includes('ongle') ? ['Ongles'] : ['Maquillage']
    },
    {
      id: "salon-3",
      name: "Wellness Center Spa",
      rating: 4.7,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&h=200&fit=crop",
      location: "Paris 8ème",
      distance: "3.5 km",
      nextSlot: "Aujourd'hui 16h00",
      services: ["Massage", "Spa", "Relaxation"],
      priceRange: "€€€€",
      specialties: searchQuery.toLowerCase().includes('massage') ? ['Massage'] : ['Spa']
    },
    {
      id: "salon-4",
      name: "Coiffure Moderne",
      rating: 4.6,
      reviews: 203,
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300&h=200&fit=crop",
      location: "Paris 11ème",
      distance: "1.8 km",
      nextSlot: "Demain 15h30",
      services: ["Coiffure", "Barbier", "Coloration"],
      priceRange: "€€",
      specialties: searchQuery.toLowerCase().includes('coiffure') ? ['Coiffure'] : ['Barbier']
    }
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (searchLocation) params.set('location', searchLocation);
    window.history.pushState({}, '', `/search?${params.toString()}`);
  };

  const filteredAndSortedResults = searchResults
    .filter(salon => {
      if (priceRange !== 'all' && salon.priceRange !== priceRange) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance);
        case 'price':
          return a.priceRange.length - b.priceRange.length;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={() => setLocation('/')}
              className="text-purple-600 hover:text-purple-700"
            >
              ← Retour à l'accueil
            </Button>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-9 w-64"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Où ?"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-9 w-48"
                  />
                </div>
                <Button onClick={handleSearch} className="bg-purple-600 hover:bg-purple-700">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {searchQuery ? `Résultats pour "${searchQuery}"` : 'Tous les salons'}
            </h1>
            <p className="text-gray-600">
              {filteredAndSortedResults.length} établissement(s) trouvé(s)
              {searchLocation && ` près de ${searchLocation}`}
            </p>
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtres
            </Button>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Mieux notés</SelectItem>
                <SelectItem value="distance">Plus proches</SelectItem>
                <SelectItem value="price">Prix croissant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gamme de prix
                  </label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les prix</SelectItem>
                      <SelectItem value="€">€ (Économique)</SelectItem>
                      <SelectItem value="€€">€€ (Modéré)</SelectItem>
                      <SelectItem value="€€€">€€€ (Élevé)</SelectItem>
                      <SelectItem value="€€€€">€€€€ (Luxe)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAndSortedResults.map((salon) => (
            <Card 
              key={salon.id}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => setLocation(`/book/${salon.id}`)}
            >
              <div className="flex">
                <div className="w-40 h-32 flex-shrink-0">
                  <img 
                    src={salon.image} 
                    alt={salon.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <CardContent className="flex-1 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {salon.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold">{salon.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{salon.location}</span>
                    <span className="text-sm text-gray-400">• {salon.distance}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">{salon.nextSlot}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {salon.specialties.map((specialty) => (
                      <span 
                        key={specialty}
                        className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium"
                      >
                        {specialty}
                      </span>
                    ))}
                    {salon.services.slice(0, 2).map((service) => (
                      <span 
                        key={service}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{salon.reviews} avis</span>
                      <span className="text-sm font-medium text-gray-700">{salon.priceRange}</span>
                    </div>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                      Réserver
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredAndSortedResults.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun résultat trouvé
            </h3>
            <p className="text-gray-600 mb-4">
              Essayez de modifier vos critères de recherche
            </p>
            <Button 
              onClick={() => setLocation('/')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Nouvelle recherche
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}