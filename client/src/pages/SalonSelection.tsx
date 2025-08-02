import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AuthGuard from "@/components/AuthGuard";

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  salonCount: number;
}

interface Salon {
  id: string;
  name: string;
  category: string;
  address: string;
  rating: number;
  reviews: number;
  price: string;
  image: string;
  services: string[];
  openNow: boolean;
}

export default function SalonSelection() {
  const [, setLocation] = useLocation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [salons, setSalons] = useState<Salon[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Récupérer la catégorie depuis l'URL si présente
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = urlParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
    
    loadCategories();
    loadSalons(categoryFromUrl || '');
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadSalons(selectedCategory);
    }
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/service-categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Erreur chargement catégories:", error);
    }
  };

  const loadSalons = async (category = '') => {
    try {
      setLoading(true);
      const url = category 
        ? `/api/salons?category=${category}` 
        : '/api/salons';
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setSalons(data.salons);
      }
    } catch (error) {
      console.error("Erreur chargement salons:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les salons",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredSalons = salons.filter((salon: Salon) =>
    salon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salon.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSalonSelect = (salon: Salon) => {
    // Rediriger vers la page de réservation du salon
    setLocation(`/booking?salon=${salon.id}&category=${selectedCategory}`);
  };

  return (
    <AuthGuard requiredAuth="client">
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/category-selection')}
              className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
            >
              ←
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedCategory 
                  ? `Salons ${categories.find(c => c.id === selectedCategory)?.name || ''}`
                  : 'Choisissez votre salon'
                }
              </h1>
              <p className="text-gray-600">
                {selectedCategory 
                  ? `Réservez dans un salon ${categories.find(c => c.id === selectedCategory)?.name?.toLowerCase() || ''}`
                  : 'Trouvez le salon parfait pour vous'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Barre de recherche */}
        <div className="space-y-4">
          <Input
            placeholder="Rechercher un salon ou une adresse..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 text-lg"
          />
        </div>

        {/* Catégories */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Catégories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant={selectedCategory === '' ? "default" : "outline"}
              onClick={() => {
                setSelectedCategory('');
                loadSalons();
              }}
              className="h-20 flex-col space-y-2"
            >
              <span className="text-2xl">🏪</span>
              <span>Tous</span>
            </Button>
            
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="h-20 flex-col space-y-2"
              >
                <span className="text-2xl">{category.icon}</span>
                <span>{category.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {category.salonCount}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Liste des salons */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedCategory 
                ? `Salons ${categories.find(c => c.id === selectedCategory)?.name || ''}`
                : 'Tous les salons'
              }
            </h2>
            <span className="text-gray-600">
              {filteredSalons.length} salon{filteredSalons.length > 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des salons...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredSalons.map((salon) => (
                <Card key={salon.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleSalonSelect(salon)}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{salon.name}</h3>
                          {salon.openNow ? (
                            <Badge className="bg-green-100 text-green-800">Ouvert</Badge>
                          ) : (
                            <Badge variant="secondary">Fermé</Badge>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-3">{salon.address}</p>
                        
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span className="font-medium">{salon.rating}</span>
                            <span className="text-gray-500">({salon.reviews} avis)</span>
                          </div>
                          <span className="text-gray-500">{salon.price}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {salon.services.slice(0, 3).map((service, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                          {salon.services.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{salon.services.length - 3} autres
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <Button 
                        className="ml-4"
                        onClick={() => handleSalonSelect(salon)}
                      >
                        Réserver
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && filteredSalons.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">Aucun salon trouvé</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedCategory('');
                  setSearchTerm('');
                  loadSalons();
                }}
                className="mt-4"
              >
                Voir tous les salons
              </Button>
            </div>
          )}
        </div>
      </div>
      </div>
    </AuthGuard>
  );
}