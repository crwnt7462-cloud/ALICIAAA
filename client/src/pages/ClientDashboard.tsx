import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
 Calendar, Star, Settings, Bell, User, MessageCircle,
 Clock, MapPin, CreditCard, Gift, Heart, Sparkles, Home, CalendarDays
} from "lucide-react";

export default function ClientDashboard() {
 const { toast } = useToast();
 const [, setLocation] = useLocation();
 const [activeTab, setActiveTab] = useState<string>('accueil');
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

 // Vue principale avec sections adaptées aux clients
 const renderMainView = () => (
  <div className="min-h-screen bg-gray-50">
   {/* Header unique - Style iPhone */}
   <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
    <div className="max-w-lg mx-auto px-4 py-3">
     <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
       <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center">
        <span className="text-white font-bold text-lg">C</span>
       </div>
       <h1 className="text-lg font-semibold text-gray-600">Mon Compte</h1>
      </div>
      <div className="flex items-center gap-3">
       <div className="relative">
        <Bell className="h-5 w-5 text-gray-600" />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
       </div>
       <button className="glass-button-secondary h-8 w-8 rounded-xl flex items-center justify-center" onClick={() => setLocation('/settings')}>
        <Settings className="h-4 w-4" />
       </button>
      </div>
     </div>
    </div>
   </div>

   <div className="max-w-lg mx-auto p-4 space-y-4">
    {/* Réservation rapide avec glassmorphism */}
    <div className="glass-button neon-violet rounded-lg p-4">
     <button 
      className="w-full bg-transparent hover:bg-white/10 text-white font-medium py-2 rounded-lg"
      onClick={() => setLocation('/search')}
     >
      Réserver un rendez-vous
     </button>
    </div>

    {/* Prochain RDV */}
    <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-green-50/30">
     <CardContent className="p-6">
      <div className="flex items-start gap-4">
       <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center">
        <Clock className="h-6 w-6 text-white" />
       </div>
       <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
         <h2 className="text-lg font-semibold text-gray-600">Prochain RDV</h2>
         <Badge className="bg-green-600 text-white px-2 py-1 text-xs font-medium rounded-full">
          Confirmé
         </Badge>
        </div>
        <p className="text-gray-600 text-sm mb-4">
         Coupe + Brushing - Salon Excellence
        </p>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
         <div className="text-center">
          <div className="text-xl font-bold text-gray-600 mb-1">14h30</div>
          <div className="text-xs text-gray-600">Demain</div>
         </div>
         <div className="text-center">
          <div className="text-xl font-bold text-gray-600 mb-1">45€</div>
          <div className="text-xs text-gray-600">Prix</div>
         </div>
         <div className="text-center">
          <div className="text-xl font-bold text-gray-600 mb-1">1h</div>
          <div className="text-xs text-gray-600">Durée</div>
         </div>
        </div>

        <Button 
         onClick={() => setLocation('/client-rdv')}
         className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg"
        >
         Gérer mes RDV
        </Button>
       </div>
      </div>
     </CardContent>
    </Card>

    {/* Mes favoris */}
    <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-pink-50/30">
     <CardContent className="p-6">
      <div className="flex items-start gap-4">
       <div className="w-12 h-12 bg-pink-600 rounded-2xl flex items-center justify-center">
        <Heart className="h-6 w-6 text-white" />
       </div>
       <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
         <h2 className="text-lg font-semibold text-gray-600">Mes Favoris</h2>
         <Badge className="bg-pink-600 text-white px-2 py-1 text-xs font-medium rounded-full">
          3 salons
         </Badge>
        </div>
        <p className="text-gray-600 text-sm mb-4">
         Vos salons préférés à portée de clic
        </p>
        
        <div className="space-y-2 mb-4">
         <div className="flex items-center justify-between p-2 bg-white rounded-lg">
          <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
           <span className="text-sm font-medium">Salon Excellence</span>
          </div>
          <button className="glass-button neon-violet px-3 py-1 rounded-lg text-sm">Réserver</button>
         </div>
         <div className="flex items-center justify-between p-2 bg-white rounded-lg">
          <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
           <span className="text-sm font-medium">Beauty Studio</span>
          </div>
          <button className="glass-button neon-violet px-3 py-1 rounded-lg text-sm">Réserver</button>
         </div>
        </div>

        <button 
         onClick={() => setLocation('/search')}
         className="w-full glass-button neon-violet font-medium py-3 rounded-lg"
        >
         Découvrir plus de salons
        </button>
       </div>
      </div>
     </CardContent>
    </Card>

    {/* Programme fidélité */}
    <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-amber-50/30">
     <CardContent className="p-6">
      <div className="flex items-start gap-4">
       <div className="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center">
        <Gift className="h-6 w-6 text-white" />
       </div>
       <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
         <h2 className="text-lg font-semibold text-gray-600">Fidélité</h2>
         <Badge className="bg-amber-600 text-white px-2 py-1 text-xs font-medium rounded-full">
          Client VIP
         </Badge>
        </div>
        <p className="text-gray-600 text-sm mb-4">
         245 points disponibles
        </p>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
         <div className="text-center">
          <div className="text-xl font-bold text-gray-600 mb-1">12</div>
          <div className="text-xs text-gray-600">RDV ce mois</div>
         </div>
         <div className="text-center">
          <div className="text-xl font-bold text-gray-600 mb-1">4.8</div>
          <div className="text-xs text-gray-600">Note moyenne</div>
         </div>
         <div className="text-center">
          <div className="text-xl font-bold text-gray-600 mb-1">15%</div>
          <div className="text-xs text-gray-600">Réduction</div>
         </div>
        </div>

        <Button 
         onClick={() => toast({ title: "Fidélité", description: "Programme de fidélité en cours" })}
         className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 rounded-lg"
        >
         Utiliser mes points
        </Button>
       </div>
      </div>
     </CardContent>
    </Card>

    {/* Messagerie */}
    <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-purple-50/30">
     <CardContent className="p-6">
      <div className="flex items-start gap-4">
       <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center">
        <MessageCircle className="h-6 w-6 text-white" />
       </div>
       <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
         <h2 className="text-lg font-semibold text-gray-600">Messages</h2>
         <Badge className="bg-purple-600 text-white px-2 py-1 text-xs font-medium rounded-full">
          2 nouveaux
         </Badge>
        </div>
        <p className="text-gray-600 text-sm mb-4">
         Communiquez avec vos salons
        </p>

        <Button 
         onClick={() => setLocation('/client-messaging')}
         className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg"
        >
         Voir mes messages
        </Button>
       </div>
      </div>
     </CardContent>
    </Card>

    {/* Avis et évaluations */}
    <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-orange-50/30">
     <CardContent className="p-6">
      <div className="flex items-start gap-4">
       <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center">
        <Star className="h-6 w-6 text-white" />
       </div>
       <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
         <h2 className="text-lg font-semibold text-gray-600">Mes Avis</h2>
         <Badge className="bg-orange-600 text-white px-2 py-1 text-xs font-medium rounded-full">
          8 avis
         </Badge>
        </div>
        <p className="text-gray-600 text-sm mb-4">
         Partagez votre expérience
        </p>

        <Button 
         onClick={() => toast({ title: "Avis", description: "Section avis en développement" })}
         className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-lg"
        >
         Laisser un avis
        </Button>
       </div>
      </div>
     </CardContent>
    </Card>

    {/* Paramètres */}
    <Card className="border-0 shadow-sm">
     <CardContent className="p-6">
      <div className="flex items-start gap-4">
       <div className="w-12 h-12 bg-gray-600 rounded-2xl flex items-center justify-center">
        <Settings className="h-6 w-6 text-white" />
       </div>
       <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-600 mb-2">Paramètres</h2>
        <p className="text-gray-600 text-sm mb-4">
         Gérez votre profil et préférences
        </p>

        <Button 
         onClick={() => setLocation('/settings')}
         className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 rounded-lg"
        >
         Accéder aux paramètres
        </Button>
       </div>
      </div>
     </CardContent>
    </Card>
   </div>
  </div>
 );

 const renderContent = () => {
  switch (activeTab) {
   case 'accueil':
    return renderMainView();
   case 'rdv':
    return (
     <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
       <div className="max-w-lg mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center">
           <span className="text-white font-bold text-lg">C</span>
          </div>
          <h1 className="text-lg font-semibold text-gray-600">Mes Rendez-vous</h1>
         </div>
        </div>
       </div>
      </div>
      <div className="max-w-lg mx-auto p-4">
       <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
         <h2 className="text-lg font-semibold text-gray-600 mb-4">Prochain RDV</h2>
         <div className="space-y-3">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
           <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-gray-600">Coupe + Brushing</h3>
            <Badge className="bg-green-600 text-white">Confirmé</Badge>
           </div>
           <p className="text-sm text-gray-600 mb-1">Salon Excellence</p>
           <p className="text-sm text-gray-600">Demain, 30 janvier - 14h30</p>
           <p className="text-sm font-medium text-gray-600 mt-2">45€</p>
          </div>
         </div>
        </CardContent>
       </Card>
      </div>
     </div>
    );
   case 'messages':
    return (
     <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
       <div className="max-w-lg mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center">
           <span className="text-white font-bold text-lg">C</span>
          </div>
          <h1 className="text-lg font-semibold text-gray-600">Messages</h1>
         </div>
        </div>
       </div>
      </div>
      <div className="max-w-lg mx-auto p-4">
       <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
         <h2 className="text-lg font-semibold text-gray-600 mb-4">Conversations</h2>
         <div className="space-y-3">
          <div className="p-4 bg-white rounded-lg border border-gray-200">
           <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
             <h3 className="font-medium text-gray-600">Salon Excellence</h3>
             <p className="text-sm text-gray-600">Votre rendez-vous est confirmé</p>
            </div>
            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
           </div>
          </div>
         </div>
        </CardContent>
       </Card>
      </div>
     </div>
    );
   case 'profil':
    return (
     <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
       <div className="max-w-lg mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center">
           <span className="text-white font-bold text-lg">C</span>
          </div>
          <h1 className="text-lg font-semibold text-gray-600">Mon Profil</h1>
         </div>
        </div>
       </div>
      </div>
      <div className="max-w-lg mx-auto p-4">
       <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
         <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <h2 className="text-lg font-semibold text-gray-600">{clientData?.firstName || 'Client'}</h2>
          <p className="text-gray-600">{clientData?.email}</p>
         </div>
         <div className="space-y-3">
          <Button 
           variant="outline" 
           className="w-full justify-start"
           onClick={() => setLocation('/settings')}
          >
           <Settings className="w-4 h-4 mr-2" />
           Paramètres
          </Button>
          <Button 
           variant="outline" 
           className="w-full justify-start"
           onClick={() => {
            localStorage.removeItem('clientData');
            setLocation('/client-login');
           }}
          >
           Déconnexion
          </Button>
         </div>
        </CardContent>
       </Card>
      </div>
     </div>
    );
   default:
    return renderMainView();
  }
 };

 return (
  <div className="min-h-screen bg-gray-50">
   {renderContent()}
   
   {/* Navigation flottante violette - EXACTEMENT comme BottomNavigation.tsx des pros */}
   <div className="fixed bottom-1 left-1/2 transform -translate-x-1/2 z-50">
    {/* Barre flottante violette compacte */}
    <div className="bg-violet-600 rounded-full shadow-lg px-4 py-2">
     <div className="flex items-center gap-3">
      <button
       onClick={() => setActiveTab('accueil')}
       className={`flex flex-col items-center gap-0.5 transition-all duration-200 px-1 py-1 ${
        activeTab === 'accueil'
         ? 'text-white transform scale-105'
         : 'text-white/70 hover:text-white'
       }`}
      >
       <Home className="h-4 w-4" />
       <span className="text-[10px] font-medium">Accueil</span>
      </button>
      
      <button
       onClick={() => setActiveTab('rdv')}
       className={`flex flex-col items-center gap-0.5 transition-all duration-200 px-1 py-1 ${
        activeTab === 'rdv'
         ? 'text-white transform scale-105'
         : 'text-white/70 hover:text-white'
       }`}
      >
       <Calendar className="h-4 w-4" />
       <span className="text-[10px] font-medium">Planning</span>
      </button>
      
      <button
       onClick={() => setActiveTab('messages')}
       className={`flex flex-col items-center gap-0.5 transition-all duration-200 px-1 py-1 ${
        activeTab === 'messages'
         ? 'text-white transform scale-105'
         : 'text-white/70 hover:text-white'
       }`}
      >
       <MessageCircle className="h-4 w-4" />
       <span className="text-[10px] font-medium">Messages</span>
      </button>
      
      <button
       onClick={() => setActiveTab('profil')}
       className={`flex flex-col items-center gap-0.5 transition-all duration-200 px-1 py-1 ${
        activeTab === 'profil'
         ? 'text-white transform scale-105'
         : 'text-white/70 hover:text-white'
       }`}
      >
       <User className="h-4 w-4" />
       <span className="text-[10px] font-medium">Profil</span>
      </button>
      
      <button
       onClick={() => setLocation('/search')}
       className="flex flex-col items-center gap-0.5 transition-all duration-200 px-1 py-1 text-white/70 hover:text-white"
      >
       <Sparkles className="h-4 w-4" />
       <span className="text-[10px] font-medium">Découvrir</span>
      </button>
     </div>
    </div>
   </div>
  </div>
 );
}