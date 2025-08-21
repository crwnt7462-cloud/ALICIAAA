import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Clock, Star, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
}

export default function ServiceSelection() {
  const [, setLocation] = useLocation();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  // Services organisés par catégorie comme dans l'interface Avyento
  const serviceCategories = [
    {
      name: "ÉPILATION LASER",
      expanded: true,
      description: "FORFAITS 6 SÉANCES (AUTRES FORFAITS DISPONIBLE SUR DEMANDE)",
      services: [
        {
          id: "aisselles",
          name: "Aisselles",
          description: "",
          price: 380,
          duration: "30min"
        },
        {
          id: "maillot-classique", 
          name: "Maillot classique",
          description: "",
          price: 300,
          duration: "30min"
        },
        {
          id: "maillot-echancre",
          name: "Maillot échancré", 
          description: "",
          price: 400,
          duration: "30min"
        },
        {
          id: "maillot-bresilien",
          name: "Maillot brésilien",
          description: "",
          price: 450,
          duration: "30min"
        },
        {
          id: "maillot-integral",
          name: "Maillot intégral",
          description: "",
          price: 500,
          duration: "45min"
        }
      ]
    }
  ];

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const handleContinue = () => {
    if (selectedService) {
      // Stocker le service sélectionné dans le localStorage
      localStorage.setItem('selectedService', selectedService);
      // Rediriger vers la sélection du professionnel
      setLocation('/professional-selection');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setLocation('/salon')}
              className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">avec Justine</h1>
            <div className="w-10" />
          </div>
        </div>
      </div>

      {/* Services par catégorie */}
      <div className="max-w-md mx-auto">
        {serviceCategories.map((category) => (
          <div key={category.name} className="bg-white mb-1">
            {/* En-tête de catégorie */}
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-sm">{category.name}</h3>
              {category.description && (
                <p className="text-xs text-gray-500 mt-1">{category.description}</p>
              )}
            </div>

            {/* Services de la catégorie */}
            <div className="divide-y divide-gray-100">
              {category.services.map((service) => (
                <div 
                  key={service.id}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedService === service.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleServiceSelect(service.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{service.name}</h4>
                      {service.description && (
                        <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <span className="font-semibold text-gray-900">{service.price} €</span>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="w-3 h-3" />
                          {service.duration}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={selectedService === service.id ? "default" : "outline"}
                      size="sm"
                      className={`ml-4 ${
                        selectedService === service.id 
                          ? 'bg-black text-white hover:bg-gray-800' 
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {selectedService === service.id ? '✓' : 'Choisir'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Informations additionnelles */}
        <div className="bg-white mt-6">
          <button className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 border-b border-gray-100">
            <span className="font-medium text-gray-900">Informations</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Bouton continuer fixe en bas */}
        {selectedService && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
            <div className="max-w-md mx-auto">
              <Button 
                onClick={handleContinue}
                className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium"
              >
                Continuer
              </Button>
            </div>
          </div>
        )}

        {/* Footer style Avyento */}
        <div className="text-center py-8 text-xs text-gray-500">
          avyento.com
        </div>
      </div>
    </div>
  );
}