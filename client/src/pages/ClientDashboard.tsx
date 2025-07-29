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
          {/* Header élégant */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-8 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">
                    Bonjour {clientData?.firstName || 'Belle'} ✨
                  </h2>
                  <p className="text-purple-100">Votre parcours beauté vous attend</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-white/10 w-12 h-12 rounded-2xl"
                >
                  <Bell className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>

          <div className="px-6 pb-24">
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-xl font-semibold text-gray-900">Habitudes beauté</h1>
            </div>

          {/* Cartes élégantes */}
          <div className="space-y-6 mb-6">
            {/* Carte principale */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="space-y-8">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-2xl mb-4">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-purple-700 font-medium text-sm">Ma routine beauté</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Prendre soin de ma beauté</h3>
                  <p className="text-gray-600">Au moins 2 fois par semaine</p>
                </div>

                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="text-5xl font-black text-gray-900 mb-2">50%</div>
                    <div className="absolute -top-2 -right-6 text-2xl">💫</div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-6 mb-4 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 h-6 rounded-full transition-all duration-700 ease-out relative"
                      style={{ width: '50%' }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Bravo ! 5 jours sur 7 cette semaine ✨
                  </p>
                </div>
              </div>
            </div>

            {/* Carte streak */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 border border-amber-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-1">Série en cours</h4>
                  <p className="text-gray-600 text-sm mb-2">Jours consécutifs</p>
                  <div className="text-3xl font-black text-amber-600">10 jours 🔥</div>
                </div>
              </div>
            </div>
          </div>

          {/* Calendrier élégant */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <Button variant="ghost" size="sm" className="p-3 hover:bg-gray-50 rounded-2xl" onClick={() => {
                const newMonth = new Date(currentMonth);
                newMonth.setMonth(newMonth.getMonth() - 1);
                setCurrentMonth(newMonth);
              }}>
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </Button>
              <div className="text-center">
                <h3 className="font-bold text-gray-900 text-xl mb-1">Juin 2024</h3>
                <p className="text-gray-500 text-sm">Mon parcours beauté</p>
              </div>
              <Button variant="ghost" size="sm" className="p-3 hover:bg-gray-50 rounded-2xl" onClick={() => {
                const newMonth = new Date(currentMonth);
                newMonth.setMonth(newMonth.getMonth() + 1);
                setCurrentMonth(newMonth);
              }}>
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </Button>
            </div>

            {/* Jours de la semaine */}
            <div className="grid grid-cols-7 gap-2 mb-6">
              {['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map((day) => (
                <div key={day} className="text-center text-sm font-bold text-gray-400 py-3">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendrier */}
            <div className="grid grid-cols-7 gap-2 mb-8">
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
                      w-12 h-12 rounded-2xl flex items-center justify-center text-base font-bold relative transition-all duration-200
                      ${isToday ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg scale-110' : 'text-gray-900'}
                      ${isCompleted && !isToday ? 'bg-gradient-to-br from-emerald-100 to-green-100 text-green-700 border-2 border-green-200' : ''}
                      ${isMissed && !isToday ? 'bg-gradient-to-br from-red-50 to-pink-50 text-red-500 border border-red-100' : ''}
                      ${!isCompleted && !isMissed && !isToday ? 'hover:bg-gray-50' : ''}
                    `}>
                      {day}
                      {isCompleted && !isToday && <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full text-white text-xs flex items-center justify-center">✓</div>}
                      {isToday && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                            <Plus className="w-4 h-4 text-purple-600" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Légende stylée */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gradient-to-br from-emerald-100 to-green-100 border border-green-200 rounded-xl flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-gray-700 font-medium">Objectif atteint ✨</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gradient-to-br from-red-50 to-pink-50 border border-red-100 rounded-xl flex items-center justify-center">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                </div>
                <span className="text-gray-700 font-medium">À rattraper 💪</span>
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

      {/* Floating Action Button avec animation sophistiquée */}
      <div className="fixed bottom-8 right-8 z-50">
        {/* Menu options avec animation en cascade */}
        {showFloatingMenu && (
          <div className="absolute bottom-20 right-0 flex flex-col gap-4 mb-2">
            {[
              { icon: Calendar, action: '/search', delay: '0ms', label: 'Réserver' },
              { icon: CalendarDays, action: '/client-rdv', delay: '100ms', label: 'Mes RDV' },
              { icon: Settings, action: '/settings', delay: '200ms', label: 'Paramètres' },
              { icon: MessageSquare, action: '/client-messaging', delay: '300ms', label: 'Messages' }
            ].map((item, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 animate-in slide-in-from-bottom-2 fade-in duration-300"
                style={{ animationDelay: item.delay }}
              >
                <span className="bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium opacity-0 animate-in fade-in duration-200 delay-300">
                  {item.label}
                </span>
                <Button
                  onClick={() => {
                    setLocation(item.action);
                    setShowFloatingMenu(false);
                  }}
                  className="w-14 h-14 rounded-full bg-white shadow-2xl border border-gray-100 text-gray-700 hover:bg-gray-50 hover:scale-110 transition-all duration-200 flex items-center justify-center group"
                  variant="ghost"
                >
                  <item.icon className="w-7 h-7 group-hover:scale-110 transition-transform duration-200" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Bouton principal avec animation plus sophistiquée */}
        <Button
          onClick={() => setShowFloatingMenu(!showFloatingMenu)}
          className={`w-16 h-16 rounded-full shadow-2xl transition-all duration-500 ease-out flex items-center justify-center transform relative overflow-hidden ${
            showFloatingMenu 
              ? 'bg-gradient-to-br from-gray-600 to-gray-700 rotate-135 scale-110' 
              : 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:scale-105'
          }`}
        >
          {/* Effet de ripple */}
          <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
            showFloatingMenu ? 'bg-white/10' : 'bg-transparent'
          }`}></div>
          
          {/* Icône avec animation */}
          <Plus className={`w-8 h-8 text-white transition-all duration-500 ease-out ${
            showFloatingMenu ? 'rotate-135' : 'rotate-0'
          }`} />
          
          {/* Effet de pulsation */}
          {!showFloatingMenu && (
            <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div>
          )}
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