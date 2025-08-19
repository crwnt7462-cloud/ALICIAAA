import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search as SearchIcon, MapPin, Star, Clock, Filter, X } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";

interface Salon {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  distance: string;
  services: string[];
  price: string;
  image: string;
  openNow: boolean;
  category: string;
}

const mockSalons: Salon[] = [
  {
    id: "1",
    name: "Salon Excellence Paris",
    address: "15 Rue de Rivoli, Paris 1er",
    rating: 4.8,
    reviewCount: 127,
    distance: "0.3 km",
    services: ["Coiffure", "Coloration", "Mèches"],
    price: "€€€",
    image: "/api/placeholder/300/200",
    openNow: true,
    category: "coiffure"
  },
  {
    id: "2", 
    name: "Institut Beauté Saint-Germain",
    address: "28 Boulevard Saint-Germain, Paris 5e",
    rating: 4.9,
    reviewCount: 89,
    distance: "0.8 km",
    services: ["Soin visage", "Épilation", "Manucure"],
    price: "€€",
    image: "/api/placeholder/300/200",
    openNow: true,
    category: "esthetique"
  },
  {
    id: "3",
    name: "Barbier Gentleman Marais",
    address: "12 Rue des Rosiers, Paris 4e", 
    rating: 4.7,
    reviewCount: 203,
    distance: "1.2 km",
    services: ["Coupe homme", "Barbe", "Rasage"],
    price: "€€",
    image: "/api/placeholder/300/200",
    openNow: false,
    category: "barbier"
  },
  {
    id: "4",
    name: "Beauty Lounge Montparnasse",
    address: "45 Rue de Rennes, Paris 6e",
    rating: 4.6,
    reviewCount: 156,
    distance: "1.5 km",
    services: ["Soin corps", "Massage", "Gommage"],
    price: "€€€",
    image: "/api/placeholder/300/200",
    openNow: true,
    category: "spa"
  }
];

const categories = [
  { id: "all", name: "Tous", icon: "✨" },
  { id: "coiffure", name: "Coiffure", icon: "✂️" },
  { id: "esthetique", name: "Esthétique", icon: "💆‍♀️" },
  { id: "barbier", name: "Barbier", icon: "🪒" },
  { id: "spa", name: "Spa & Massage", icon: "🧖‍♀️" },
  { id: "onglerie", name: "Onglerie", icon: "💅" }
];

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredSalons, setFilteredSalons] = useState<Salon[]>(mockSalons);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("distance"); // distance, rating, price

  useEffect(() => {
    let filtered = mockSalons;

    // Filtrer par catégorie
    if (selectedCategory !== "all") {
      filtered = filtered.filter(salon => salon.category === selectedCategory);
    }

    // Filtrer par recherche
    if (searchQuery.trim()) {
      filtered = filtered.filter(salon =>
        salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        salon.services.some(service => 
          service.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        salon.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Trier
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "price":
          return a.price.length - b.price.length;
        case "distance":
        default:
          return parseFloat(a.distance) - parseFloat(b.distance);
      }
    });

    setFilteredSalons(filtered);
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50">
      <Header />
      
      {/* Search Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-purple-100/50 sticky top-16 z-40">
        <div className="max-w-md mx-auto p-4">
          {/* Search Bar */}
          <div className="relative mb-4">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un salon, service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-12 py-3 bg-white/90 backdrop-blur-sm border border-purple-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
                showFilters ? 'bg-purple-100 text-purple-600' : 'text-purple-400 hover:bg-purple-50'
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-white/90 text-purple-600 hover:bg-purple-50'
                }`}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 p-4 bg-white/90 backdrop-blur-sm rounded-2xl border border-purple-100"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-purple-900">Trier par</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 text-purple-400 hover:text-purple-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-2">
                {[
                  { value: "distance", label: "Distance" },
                  { value: "rating", label: "Note" },
                  { value: "price", label: "Prix" }
                ].map((sort) => (
                  <button
                    key={sort.value}
                    onClick={() => setSortBy(sort.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      sortBy === sort.value
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-purple-50'
                    }`}
                  >
                    {sort.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-md mx-auto p-4 pb-24">
        <div className="mb-4 text-sm text-purple-600">
          {filteredSalons.length} salon{filteredSalons.length > 1 ? 's' : ''} trouvé{filteredSalons.length > 1 ? 's' : ''}
        </div>

        <div className="space-y-4">
          {filteredSalons.map((salon, index) => (
            <motion.div
              key={salon.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-purple-100/50 hover:shadow-lg transition-all"
            >
              <div className="flex gap-3">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-amber-100 rounded-xl flex-shrink-0 flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-purple-900 truncate">{salon.name}</h3>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-medium">{salon.rating}</span>
                      <span className="text-gray-500">({salon.reviewCount})</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{salon.address}</span>
                    <span className="text-purple-600 font-medium">{salon.distance}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-purple-600">{salon.price}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className={`text-sm ${salon.openNow ? 'text-green-600' : 'text-red-500'}`}>
                        {salon.openNow ? 'Ouvert' : 'Fermé'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {salon.services.slice(0, 3).map((service, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-lg"
                      >
                        {service}
                      </span>
                    ))}
                    {salon.services.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                        +{salon.services.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredSalons.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-amber-100 rounded-full flex items-center justify-center">
              <SearchIcon className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-purple-900 mb-2">Aucun salon trouvé</h3>
            <p className="text-gray-600 text-sm">
              Essayez de modifier vos critères de recherche ou votre catégorie
            </p>
          </motion.div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}