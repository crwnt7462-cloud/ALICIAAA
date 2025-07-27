import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Calendar, Settings } from "lucide-react";

export default function ClientDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('accueil');
  const [clientData, setClientData] = useState<any>(null);

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
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Bonjour {clientData.firstName} !
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
        <div className="max-w-lg mx-auto px-6 py-2">
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