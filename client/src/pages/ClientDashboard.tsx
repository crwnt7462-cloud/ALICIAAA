import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Calendar, Settings, User, ChevronLeft, ChevronRight, Plus } from "lucide-react";

export default function ClientDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('accueil');
  const [clientData, setClientData] = useState<any>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    // Récupérer les données client depuis localStorage
    const storedClientData = localStorage.getItem('clientData');
    if (storedClientData) {
      setClientData(JSON.parse(storedClientData));
    } else {
      // Redirection vers login si pas de données client
      setLocation('/client-login');
    }
  }, [setLocation]);

  if (!clientData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre compte...</p>
        </div>
      </div>
    );
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case 'accueil':
        setLocation('/client-accueil');
        break;
      case 'rdv':
        setLocation('/client-rdv');
        break;
      case 'parametres':
        setLocation('/client-parametres');
        break;
    }
  };

  const renderContent = () => {
    if (activeTab === 'accueil') {
      return (
        <div className="max-w-sm mx-auto px-6 py-6 space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Habitudes</h1>
          </div>

          {/* Habitude Card */}
          <Card className="bg-white rounded-2xl p-6 shadow-sm">
            <CardContent className="p-0 space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Habitude:</h3>
                <p className="text-gray-700">Prendre soin de sa beauté 2 fois par semaine</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Pourcentage de maintien de l'habitude:</h4>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-900">50%</div>
                  <Progress value={50} className="h-3 bg-gray-200">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all" />
                  </Progress>
                  <p className="text-sm text-gray-600">
                    Au cours de la semaine passée, l'habitude a été maintenue pendant 5 jours sur 7.
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-900">Nombre de jours sans interruption:</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">10 jours</div>
              </div>
            </CardContent>
          </Card>

          {/* Calendrier */}
          <Card className="bg-white rounded-2xl p-6 shadow-sm">
            <CardContent className="p-0">
              <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="sm" onClick={() => {
                  const newMonth = new Date(currentMonth);
                  newMonth.setMonth(newMonth.getMonth() - 1);
                  setCurrentMonth(newMonth);
                }}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h3 className="font-medium text-gray-900">
                  {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </h3>
                <Button variant="ghost" size="sm" onClick={() => {
                  const newMonth = new Date(currentMonth);
                  newMonth.setMonth(newMonth.getMonth() + 1);
                  setCurrentMonth(newMonth);
                }}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Jours de la semaine */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendrier */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 5 + 1; // Commence un lundi
                  const isCurrentMonth = day > 0 && day <= 30;
                  const isCompleted = isCurrentMonth && [1, 2, 4, 5, 8, 10, 12, 15, 16, 18, 22, 24, 26, 29].includes(day);
                  const isMissed = isCurrentMonth && [3, 6, 7, 9, 11, 13, 14, 17, 19, 20, 21, 23, 25, 27, 28, 30].includes(day);
                  const isToday = day === 16;
                  
                  return (
                    <div key={i} className="aspect-square flex items-center justify-center relative">
                      {isCurrentMonth && (
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium relative
                          ${isToday ? 'bg-purple-600 text-white' : 'text-gray-900'}
                          ${isCompleted && !isToday ? 'bg-green-100' : ''}
                          ${isMissed && !isToday ? 'bg-red-100' : ''}
                        `}>
                          {day}
                          {isToday && (
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                              <Plus className="w-4 h-4 bg-purple-600 text-white rounded-full p-0.5" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Légende */}
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Jours où j'ai maintenu l'habitude</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Jours où je n'ai pas maintenu l'habitude</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Bonjour {clientData?.firstName} !
          </h2>
          <p className="text-gray-600">Bienvenue dans votre espace client</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Contenu principal */}
      <div className="flex-1">
        {renderContent()}
      </div>

      {/* Menu de navigation en bas */}
      <div className="bg-white border-t border-gray-200 safe-area-pb">
        <div className="max-w-sm mx-auto px-6 py-2">
          <div className="flex justify-around">
            <Button
              variant="ghost"
              onClick={() => handleTabChange('accueil')}
              className={`flex flex-col items-center py-3 px-4 ${
                activeTab === 'accueil' ? 'text-violet-600' : 'text-gray-400'
              }`}
            >
              <Home className="w-5 h-5 mb-1" />
              <span className="text-xs">Accueil</span>
            </Button>

            <Button
              variant="ghost"
              onClick={() => handleTabChange('rdv')}
              className={`flex flex-col items-center py-3 px-4 ${
                activeTab === 'rdv' ? 'text-violet-600' : 'text-gray-400'
              }`}
            >
              <Calendar className="w-5 h-5 mb-1" />
              <span className="text-xs">Mes RDV</span>
            </Button>

            <Button
              variant="ghost"
              onClick={() => handleTabChange('parametres')}
              className={`flex flex-col items-center py-3 px-4 ${
                activeTab === 'parametres' ? 'text-violet-600' : 'text-gray-400'
              }`}
            >
              <Settings className="w-5 h-5 mb-1" />
              <span className="text-xs">Paramètres</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}