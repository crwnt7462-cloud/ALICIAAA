import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Calendar, Settings, User, ChevronLeft, ChevronRight, Plus, CalendarDays, MessageSquare, Bell } from "lucide-react";

export default function ClientDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('accueil');
  const [clientData, setClientData] = useState<any>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);

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
        <div className="min-h-screen bg-gray-50">
          {/* Header professionnel */}
          <div className="bg-white shadow-sm px-6 py-4 mb-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {clientData?.firstName || 'Client'} {clientData?.lastName || ''}
                  </h2>
                  <p className="text-sm text-gray-500">Tableau de bord</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                <Bell className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="px-6 pb-24">
            {/* Titre */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Habitudes beauté</h1>
            </div>

          {/* Cartes professionnelles */}
          <div className="space-y-4 mb-6">
            {/* Carte principale */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Habitude:</h3>
                  <p className="text-gray-700">Prendre soin de sa beauté au moins 2 fois par semaine</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Pourcentage de maintien de l'habitude:</h4>
                  <div className="space-y-3">
                    <div className="text-3xl font-bold text-gray-900">50%</div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: '50%' }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Au cours de la semaine passée, l'habitude a été maintenue 5 jours sur 7
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-900">Nombre de jours sans interruption:</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">10 jours</div>
                </div>
              </div>
            </div>
          </div>

          {/* Calendrier */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" size="sm" onClick={() => {
                const newMonth = new Date(currentMonth);
                newMonth.setMonth(newMonth.getMonth() - 1);
                setCurrentMonth(newMonth);
              }}>
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </Button>
              <h3 className="font-semibold text-gray-900 text-lg">
                Juin 2024
              </h3>
              <Button variant="ghost" size="sm" onClick={() => {
                const newMonth = new Date(currentMonth);
                newMonth.setMonth(newMonth.getMonth() + 1);
                setCurrentMonth(newMonth);
              }}>
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </Button>
            </div>

            {/* Jours de la semaine */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendrier */}
            <div className="grid grid-cols-7 gap-2 mb-6">
              {[
                null, null, null, null, null, 1, 2,
                3, 4, 5, 6, 7, 8, 9,
                10, 11, 12, 13, 14, 15, 16,
                17, 18, 19, 20, 21, 22, 23,
                24, 25, 26, 27, 28, 29, 30
              ].map((day, i) => {
                if (!day) return <div key={i} className="aspect-square"></div>;
                
                const isCompleted = [1, 2, 4, 5, 8, 10, 12, 15, 18, 22, 24, 26, 29].includes(day);
                const isMissed = [3, 6, 7, 9, 11, 13, 14, 17, 19, 20, 21, 23, 25, 27, 28, 30].includes(day);
                const isToday = day === 16;
                
                return (
                  <div key={i} className="aspect-square flex items-center justify-center relative">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium relative
                      ${isToday ? 'bg-purple-600 text-white' : 'text-gray-900'}
                      ${isCompleted && !isToday ? 'bg-green-100 text-green-800' : ''}
                      ${isMissed && !isToday ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {day}
                      {isToday && (
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                            <Plus className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Légende */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Jours où j'ai maintenu l'habitude</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-gray-700">Jours où je n'ai pas maintenu l'habitude</span>
              </div>
            </div>
          </div>
          </div>
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
    <div className="min-h-screen bg-gray-50 relative">
      {/* Contenu principal */}
      {renderContent()}

      {/* Floating Action Button - Animation radiale comme le GIF */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Menu radial qui se déploie en arc */}
        {showFloatingMenu && (
          <div className="absolute inset-0 w-14 h-14">
            {/* Bouton 1 - en haut à gauche */}
            <div 
              className={`absolute transition-all duration-300 ease-out ${
                showFloatingMenu 
                  ? 'transform -translate-x-16 -translate-y-8 opacity-100 scale-100' 
                  : 'transform translate-x-0 translate-y-0 opacity-0 scale-50'
              }`}
              style={{ 
                transitionDelay: showFloatingMenu ? '50ms' : '0ms'
              }}
            >
              <Button
                onClick={() => {
                  setLocation('/search');
                  setShowFloatingMenu(false);
                }}
                className="w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center"
                variant="ghost"
              >
                <Calendar className="w-5 h-5" />
              </Button>
            </div>

            {/* Bouton 2 - en haut */}
            <div 
              className={`absolute transition-all duration-300 ease-out ${
                showFloatingMenu 
                  ? 'transform -translate-x-7 -translate-y-16 opacity-100 scale-100' 
                  : 'transform translate-x-0 translate-y-0 opacity-0 scale-50'
              }`}
              style={{ 
                transitionDelay: showFloatingMenu ? '100ms' : '25ms'
              }}
            >
              <Button
                onClick={() => {
                  setLocation('/client-rdv');
                  setShowFloatingMenu(false);
                }}
                className="w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center"
                variant="ghost"
              >
                <CalendarDays className="w-5 h-5" />
              </Button>
            </div>

            {/* Bouton 3 - en haut à droite */}
            <div 
              className={`absolute transition-all duration-300 ease-out ${
                showFloatingMenu 
                  ? 'transform translate-x-2 -translate-y-16 opacity-100 scale-100' 
                  : 'transform translate-x-0 translate-y-0 opacity-0 scale-50'
              }`}
              style={{ 
                transitionDelay: showFloatingMenu ? '150ms' : '50ms'
              }}
            >
              <Button
                onClick={() => {
                  setLocation('/settings');
                  setShowFloatingMenu(false);
                }}
                className="w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center"
                variant="ghost"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>

            {/* Bouton 4 - à gauche */}
            <div 
              className={`absolute transition-all duration-300 ease-out ${
                showFloatingMenu 
                  ? 'transform -translate-x-16 translate-y-1 opacity-100 scale-100' 
                  : 'transform translate-x-0 translate-y-0 opacity-0 scale-50'
              }`}
              style={{ 
                transitionDelay: showFloatingMenu ? '200ms' : '75ms'
              }}
            >
              <Button
                onClick={() => {
                  setLocation('/client-messaging');
                  setShowFloatingMenu(false);
                }}
                className="w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center"
                variant="ghost"
              >
                <MessageSquare className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Bouton principal avec rotation et changement de couleur */}
        <Button
          onClick={() => setShowFloatingMenu(!showFloatingMenu)}
          className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 ease-out flex items-center justify-center relative ${
            showFloatingMenu 
              ? 'bg-gray-500 hover:bg-gray-600 rotate-45' 
              : 'bg-blue-600 hover:bg-blue-700 rotate-0'
          }`}
        >
          <Plus className="w-6 h-6 text-white transition-transform duration-300" />
        </Button>
      </div>

      {/* Overlay pour fermer le menu */}
      {showFloatingMenu && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-40"
          onClick={() => setShowFloatingMenu(false)}
        />
      )}
    </div>
  );
}