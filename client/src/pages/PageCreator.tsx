import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Palette, Calendar, Upload, Settings, Globe, Smartphone } from 'lucide-react';

export default function PageCreator() {
  const [, setLocation] = useLocation();
  const [selectedType, setSelectedType] = useState<'salon' | 'booking' | null>(null);

  const pageTypes = [
    {
      type: 'salon' as const,
      title: 'Page Salon',
      description: 'Créez une page vitrine pour votre salon avec photos, services et présentation',
      icon: <Palette className="w-8 h-8" />,
      features: ['Galerie photos', 'Présentation salon', 'Liste des services', 'Équipe', 'Horaires & contact'],
      color: 'violet'
    },
    {
      type: 'booking' as const,
      title: 'Page Réservation',
      description: 'Créez une page de réservation personnalisée pour vos clients',
      icon: <Calendar className="w-8 h-8" />,
      features: ['Calendrier intégré', 'Sélection services', 'Paiement en ligne', 'Confirmation auto', 'Rappels SMS/Email'],
      color: 'blue'
    }
  ];

  if (selectedType) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => setSelectedType(null)}
              className="h-10 w-10 p-0 rounded-full bg-white hover:bg-gray-100 shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Créer une {selectedType === 'salon' ? 'Page Salon' : 'Page Réservation'}
              </h1>
              <p className="text-gray-600">Personnalisez votre page en temps réel</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Éditeur */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedType === 'salon' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nom du salon</label>
                        <input 
                          type="text" 
                          placeholder="Excellence Beauty Paris"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea 
                          placeholder="Votre salon de beauté au cœur de Paris..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 h-20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Photos du salon</label>
                        <Button variant="outline" className="w-full h-20 border-dashed">
                          <Upload className="w-5 h-5 mr-2" />
                          Ajouter des photos
                        </Button>
                      </div>
                    </>
                  )}
                  
                  {selectedType === 'booking' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Titre de la page</label>
                        <input 
                          type="text" 
                          placeholder="Réservez votre rendez-vous"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Message d'accueil</label>
                        <textarea 
                          placeholder="Choisissez votre créneau et service..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 h-20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Services disponibles</label>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">Coupe & Brushing</span>
                            <span className="text-sm text-gray-500">45€</span>
                          </div>
                          <Button variant="outline" size="sm" className="w-full">
                            + Ajouter un service
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Aperçu */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">Aperçu</span>
                <div className="flex bg-gray-100 rounded p-1 ml-auto">
                  <Button variant="ghost" size="sm" className="h-6 px-2">
                    <Smartphone className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 px-2">
                    <Globe className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <Card className="border-2 border-dashed border-gray-300">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {selectedType === 'salon' && (
                      <>
                        <div className="h-32 bg-gradient-to-r from-violet-100 to-pink-100 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500">Photo de couverture</span>
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">Excellence Beauty Paris</h2>
                          <p className="text-gray-600 text-sm">Votre salon de beauté au cœur de Paris...</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-16 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">Photo 1</div>
                          <div className="h-16 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">Photo 2</div>
                        </div>
                      </>
                    )}

                    {selectedType === 'booking' && (
                      <>
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">Réservez votre rendez-vous</h2>
                          <p className="text-gray-600 text-sm">Choisissez votre créneau et service...</p>
                        </div>
                        <div className="space-y-2">
                          <div className="p-3 border border-gray-200 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Coupe & Brushing</span>
                              <span className="text-violet-600 font-semibold">45€</span>
                            </div>
                            <span className="text-sm text-gray-500">45 min</span>
                          </div>
                        </div>
                        <Button className="w-full bg-violet-600 hover:bg-violet-700">
                          Choisir ce service
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button className="flex-1 bg-violet-600 hover:bg-violet-700">
                  Publier la page
                </Button>
                <Button variant="outline">
                  Sauvegarder brouillon
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation('/pro-tools')}
            className="h-10 w-10 p-0 rounded-full bg-white hover:bg-gray-100 shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Créer une nouvelle page</h1>
            <p className="text-gray-600">Choisissez le type de page que vous souhaitez créer</p>
          </div>
        </div>

        {/* Types de pages */}
        <div className="grid md:grid-cols-2 gap-6">
          {pageTypes.map((pageType) => (
            <Card 
              key={pageType.type}
              className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-2 hover:border-violet-300"
              onClick={() => setSelectedType(pageType.type)}
            >
              <CardHeader className="text-center pb-4">
                <div className={`mx-auto w-16 h-16 bg-${pageType.color}-100 rounded-full flex items-center justify-center text-${pageType.color}-600 mb-4`}>
                  {pageType.icon}
                </div>
                <CardTitle className="text-xl">{pageType.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">{pageType.description}</p>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-900">Fonctionnalités incluses :</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {pageType.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-violet-600 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button className="w-full mt-4 bg-violet-600 hover:bg-violet-700">
                  Créer cette page
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}