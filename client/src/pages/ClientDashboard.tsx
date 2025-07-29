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

          <div className="px-4 pb-24">
            {/* Actions rapides */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button 
                onClick={() => setLocation('/search')}
                className="h-24 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex flex-col items-center justify-center gap-2"
              >
                <Calendar className="w-6 h-6" />
                <span className="font-medium">Réserver</span>
              </Button>
              <Button 
                onClick={() => setLocation('/client-rdv')}
                className="h-24 bg-green-600 hover:bg-green-700 text-white rounded-xl flex flex-col items-center justify-center gap-2"
              >
                <CalendarDays className="w-6 h-6" />
                <span className="font-medium">Mes RDV</span>
              </Button>
            </div>

            {/* Prochain rendez-vous */}
            <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Prochain rendez-vous</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Coupe + Brushing</p>
                  <p className="text-sm text-gray-600">Salon Excellence - 14h30</p>
                  <p className="text-sm text-gray-500">Demain, 30 janvier</p>
                </div>
                <Button variant="outline" size="sm">
                  Modifier
                </Button>
              </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">12</div>
                  <p className="text-sm text-gray-600">RDV ce mois</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">4.8</div>
                  <p className="text-sm text-gray-600">Note moyenne</p>
                </div>
              </div>
            </div>

            {/* Salons favoris */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Mes salons favoris</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div>
                      <p className="font-medium text-gray-900">Salon Excellence</p>
                      <p className="text-sm text-gray-600">5 RDV</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Réserver
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div>
                      <p className="font-medium text-gray-900">Beauty Studio</p>
                      <p className="text-sm text-gray-600">3 RDV</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Réserver
                  </Button>
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
        {/* Animation exacte du GIF avec coordonnées précises */}
        <div className="relative w-14 h-14">
          {/* Boutons qui apparaissent radialement */}
          {showFloatingMenu && [
            { x: -50, y: -20, color: 'bg-red-400', icon: Calendar, delay: 0 },
            { x: -20, y: -50, color: 'bg-green-400', icon: CalendarDays, delay: 100 },
            { x: 20, y: -50, color: 'bg-yellow-400', icon: Settings, delay: 200 },
            { x: -50, y: 20, color: 'bg-purple-400', icon: MessageSquare, delay: 300 }
          ].map((btn, i) => (
            <div
              key={i}
              className={`absolute w-11 h-11 rounded-full ${btn.color} shadow-lg flex items-center justify-center text-white transition-all duration-500 ease-out`}
              style={{
                transform: `translate(${btn.x}px, ${btn.y}px) scale(${showFloatingMenu ? 1 : 0})`,
                opacity: showFloatingMenu ? 1 : 0,
                transitionDelay: `${btn.delay}ms`,
                left: '50%',
                top: '50%',
                marginLeft: '-22px',
                marginTop: '-22px'
              }}
              onClick={() => {
                if (i === 0) setLocation('/search');
                else if (i === 1) setLocation('/client-rdv');
                else if (i === 2) setLocation('/settings');
                else setLocation('/client-messaging');
                setShowFloatingMenu(false);
              }}
            >
              <btn.icon className="w-5 h-5" />
            </div>
          ))}

          {/* Bouton principal - exactement comme le GIF */}
          <Button
            onClick={() => setShowFloatingMenu(!showFloatingMenu)}
            className={`w-14 h-14 rounded-full shadow-xl transition-all duration-300 ease-out flex items-center justify-center relative overflow-hidden ${
              showFloatingMenu 
                ? 'bg-blue-800 rotate-45' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            style={{
              background: showFloatingMenu 
                ? 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)' 
                : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
            }}
          >
            <Plus 
              className={`w-6 h-6 text-white transition-all duration-300 ease-out ${
                showFloatingMenu ? 'rotate-45' : 'rotate-0'
              }`} 
            />
          </Button>
        </div>
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