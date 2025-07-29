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
        <div className="min-h-screen bg-gray-50 px-6 pt-16 pb-24">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-xl font-semibold text-gray-900">Habitudes beauté</h1>
          </div>

          {/* Habitude Card */}
          <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Habitude :</h3>
                <p className="text-gray-700 text-base">Prendre soin de sa beauté au moins 2 fois par semaine</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-4">Pourcentage de maintien de l'habitude :</h4>
                <div className="space-y-3">
                  <div className="text-3xl font-bold text-gray-900">50%</div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full transition-all duration-300 ease-in-out"
                      style={{ width: '50%' }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Au cours de la semaine passée, l'habitude a été maintenue 5 jours sur 7
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 rounded-3xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="font-medium text-gray-900 leading-tight">Nombre de jours sans interruption :</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 ml-11">10 jours</div>
              </div>
            </div>
          </div>

          {/* Calendrier */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" size="sm" className="p-2" onClick={() => {
                const newMonth = new Date(currentMonth);
                newMonth.setMonth(newMonth.getMonth() - 1);
                setCurrentMonth(newMonth);
              }}>
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </Button>
              <h3 className="font-medium text-gray-900 text-lg">
                Juin 2024
              </h3>
              <Button variant="ghost" size="sm" className="p-2" onClick={() => {
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
                      w-10 h-10 rounded-full flex items-center justify-center text-base font-medium relative
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

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Menu options - apparaît quand showFloatingMenu est true */}
        {showFloatingMenu && (
          <div className="absolute bottom-16 right-0 flex flex-col gap-3 mb-2">
            <Button
              onClick={() => {
                setLocation('/search');
                setShowFloatingMenu(false);
              }}
              className="w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center"
              variant="ghost"
            >
              <Calendar className="w-6 h-6" />
            </Button>
            <Button
              onClick={() => {
                setLocation('/client-rdv');
                setShowFloatingMenu(false);
              }}
              className="w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center"
              variant="ghost"
            >
              <CalendarDays className="w-6 h-6" />
            </Button>
            <Button
              onClick={() => {
                setLocation('/settings');
                setShowFloatingMenu(false);
              }}
              className="w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center"
              variant="ghost"
            >
              <Settings className="w-6 h-6" />
            </Button>
            <Button
              onClick={() => {
                setLocation('/client-messaging');
                setShowFloatingMenu(false);
              }}
              className="w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center"
              variant="ghost"
            >
              <MessageSquare className="w-6 h-6" />
            </Button>
          </div>
        )}

        {/* Bouton principal + */}
        <Button
          onClick={() => setShowFloatingMenu(!showFloatingMenu)}
          className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center ${
            showFloatingMenu 
              ? 'bg-gray-600 hover:bg-gray-700 rotate-45' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <Plus className="w-7 h-7 text-white" />
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