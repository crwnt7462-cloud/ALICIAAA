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

      {/* Menu de navigation en bas */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb">
        <div className="flex justify-around py-3">
          <Button
            variant="ghost"
            onClick={() => handleTabChange('accueil')}
            className={`flex flex-col items-center py-2 px-6 ${
              activeTab === 'accueil' ? 'text-purple-600' : 'text-gray-400'
            }`}
          >
            <div className="w-6 h-6 mb-1 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={activeTab === 'accueil' ? 'text-purple-600' : 'text-gray-400'}>
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Button>

          <Button
            variant="ghost"
            onClick={() => handleTabChange('rdv')}
            className={`flex flex-col items-center py-2 px-6 ${
              activeTab === 'rdv' ? 'text-purple-600' : 'text-gray-400'
            }`}
          >
            <div className="w-6 h-6 mb-1 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={activeTab === 'rdv' ? 'text-purple-600' : 'text-gray-400'}>
                <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Button>

          <Button
            variant="ghost"
            onClick={() => handleTabChange('parametres')}
            className={`flex flex-col items-center py-2 px-6 ${
              activeTab === 'parametres' ? 'text-purple-600' : 'text-gray-400'
            }`}
          >
            <div className="w-6 h-6 mb-1 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={activeTab === 'parametres' ? 'text-purple-600' : 'text-gray-400'}>
                <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col items-center py-2 px-6 text-gray-400"
          >
            <div className="w-6 h-6 mb-1 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col items-center py-2 px-6 text-gray-400"
          >
            <div className="w-6 h-6 mb-1 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}