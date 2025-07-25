import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import AuthGuard from "@/components/AuthGuard";

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  salonCount: number;
}

export default function CategorySelection() {
  const [, setLocation] = useLocation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/service-categories');
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Erreur chargement catégories:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setLocation(`/salon-selection?category=${categoryId}`);
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
                onClick={() => setLocation('/client-dashboard')}
                className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
              >
                ←
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Nouveau rendez-vous</h1>
                <p className="text-gray-600">Choisissez une catégorie de service</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des catégories...</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Que recherchez-vous ?</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Sélectionnez le type de service qui vous intéresse et découvrez les meilleurs salons près de chez vous.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((category) => (
                  <Card 
                    key={category.id} 
                    className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 hover:border-violet-200"
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <CardContent className="p-8 text-center">
                      <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">{category.icon}</span>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{category.name}</h3>
                      <p className="text-gray-600 mb-6 text-lg">{category.description}</p>
                      
                      <div className="flex items-center justify-center gap-4 mb-6">
                        <Badge className="bg-violet-100 text-violet-800 px-4 py-2 text-sm font-medium">
                          {category.salonCount} salon{category.salonCount > 1 ? 's' : ''} disponible{category.salonCount > 1 ? 's' : ''}
                        </Badge>
                      </div>
                      
                      <Button className="w-full h-12 text-lg font-medium bg-violet-600 hover:bg-violet-700">
                        Voir les salons {category.name.toLowerCase()}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center pt-8">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => setLocation('/salon-selection')}
                  className="text-lg px-8 py-3"
                >
                  Voir tous les salons
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}