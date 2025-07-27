import { useQuery } from "@tanstack/react-query";
import { CalendarCheck, TrendingUp, Users, Clock, ChevronRight, Plus, Award, Star, Calendar, Settings, UserCheck, Share2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingDashboard } from "@/components/ui/loading-spinner";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: revenueChart = [], isLoading: revenueLoading } = useQuery({
    queryKey: ["/api/dashboard/revenue-chart"],
  });

  const { data: upcomingAppointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ["/api/dashboard/upcoming-appointments"],
  });

  const { data: topServices = [], isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/dashboard/top-services"],
  });

  const { data: staffPerformance = [], isLoading: staffLoading } = useQuery({
    queryKey: ["/api/dashboard/staff-performance"],
  });

  const { data: clientRetention, isLoading: retentionLoading } = useQuery({
    queryKey: ["/api/dashboard/client-retention"],
  });

  const { lastMessage } = useWebSocket();

  useEffect(() => {
    if (lastMessage?.type?.includes('appointment')) {
      // Could refetch all dashboard data here
    }
  }, [lastMessage]);

  if (statsLoading || revenueLoading || appointmentsLoading || servicesLoading || staffLoading || retentionLoading) {
    return <LoadingDashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-violet-600 relative overflow-hidden">
      {/* Formes géométriques en arrière-plan */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-white/8 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-white/6 rounded-full blur-xl"></div>
      </div>

      {/* Header avec navigation */}
      <div className="relative z-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-white text-lg font-semibold">Ask Rendly</h1>
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => setLocation('/dashboard')}
              className="text-white/90 hover:text-white text-sm font-medium transition-colors"
            >
              Planning
            </button>
            <button 
              onClick={() => setLocation('/clients')}
              className="text-white/90 hover:text-white text-sm font-medium transition-colors"
            >
              Clients
            </button>
            <button 
              onClick={() => setLocation('/ai')}
              className="text-white/90 hover:text-white text-sm font-medium transition-colors"
            >
              IA
            </button>
            <button 
              onClick={() => setLocation('/settings')}
              className="text-white/90 hover:text-white text-sm font-medium transition-colors"
            >
              Contact
            </button>
          </nav>
        </div>
        <Button 
          className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 text-white rounded-full px-6 py-2 text-sm font-medium shadow-lg hover:scale-105 transition-all"
          onClick={() => setLocation('/business-features')}
        >
          Members Area
        </Button>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 px-6 py-12 text-center max-w-4xl mx-auto">
        {/* Titre principal */}
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-4 leading-tight">
            Transformez Votre Salon
            <br />
            <span className="font-semibold">En Empire de Beauté</span>
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            Nous permettons aux salons d'exceller grâce à l'intelligence artificielle, 
            des conversations clients fluides et des outils d'analyse avancés pour maximiser votre croissance.
          </p>
          <Button 
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 text-white rounded-full px-8 py-3 text-lg font-medium shadow-lg hover:scale-105 transition-all"
            onClick={() => setLocation('/ai')}
          >
            Tester l'IA Gratuitement
          </Button>
        </div>

        {/* Section des fonctionnalités */}
        <div className="relative mb-16">
          {/* Bulle centrale Community */}
          <div className="relative mb-12">
            <div className="w-64 h-64 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
              <div className="text-center">
                <h3 className="text-white text-xl font-semibold mb-2">Community.</h3>
                <p className="text-white/80 text-sm px-4">Connectez-vous avec d'autres professionnels</p>
              </div>
            </div>
            
            {/* Bulles satellites */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div 
                className="absolute top-16 left-8 w-20 h-20 bg-white/15 rounded-full flex items-center justify-center backdrop-blur-sm cursor-pointer hover:bg-white/25 transition-all"
                onClick={() => setLocation('/ai')}
              >
                <span className="text-white text-sm font-medium">Training.</span>
              </div>
              <div 
                className="absolute top-16 right-8 w-20 h-20 bg-white/15 rounded-full flex items-center justify-center backdrop-blur-sm cursor-pointer hover:bg-white/25 transition-all"
                onClick={() => setLocation('/business-features')}
              >
                <span className="text-white text-sm font-medium">Pro Desk.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section inférieure blanche */}
      <div className="bg-white rounded-t-[3rem] -mt-16 relative z-20 px-6 py-12">
        {/* Titre section */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-light text-gray-900 mb-4">
            Devenez Expert avec Ask Rendly
          </h3>
        </div>

        {/* Grid des fonctionnalités */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Training & Community */}
          <div className="text-left">
            <h4 className="text-xl font-semibold text-gray-900 mb-4">
              Training. Community.<br />Mentorship.
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Rejoignez notre communauté de professionnels de la beauté avec un programme 
              de formation basé sur l'IA AVANT tout.<br /><br />
              Profitez de notre plateforme étudiante pour les salons-partenaires nouvellement lancés 
              et notre formidable communauté d'aide pour accélérer votre réussite.
            </p>
          </div>

          {/* Pro Desk */}
          <div className="text-left">
            <h4 className="text-xl font-semibold text-gray-900 mb-4">Pro Desk</h4>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Le point de départ où vous pouvez suivre suffisamment d'informations 
              sur vos clients et votre salon.<br /><br />
              Nos recommandations d'IA vous aident à optimiser vos créneaux. Les données 
              pratiques d'amélioration de l'activité offrent des conseils sur les autres outils.
            </p>
            <Button 
              className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 text-white rounded-full px-6 py-2 text-sm font-medium shadow-lg hover:scale-105 transition-all"
              onClick={() => setLocation('/business-features')}
            >
              Members Area →
            </Button>
          </div>
        </div>

        {/* Section statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
          <Card className="border-0 shadow-sm bg-gray-50 rounded-xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {(stats as any)?.todayAppointments || 12}
              </div>
              <div className="text-xs text-gray-500">RDV Aujourd'hui</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gray-50 rounded-xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {(stats as any)?.weekRevenue ? `${(stats as any).weekRevenue}` : '3,240'}€
              </div>
              <div className="text-xs text-gray-500">CA Semaine</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gray-50 rounded-xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">89%</div>
              <div className="text-xs text-gray-500">Fidélisation</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gray-50 rounded-xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">156</div>
              <div className="text-xs text-gray-500">Clients Actifs</div>
            </CardContent>
          </Card>
        </div>

        {/* Section finale */}
        <div className="text-center mb-16">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Pourquoi Nous Choisir ?</h3>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto mb-8">
            Nous gérons votre infrastructure technique pour que vous puissiez vous concentrer 
            sur ce que vous faites de mieux : sublimer vos clients.
          </p>
          <Button 
            className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 text-white rounded-full px-8 py-3 font-medium shadow-lg hover:scale-105 transition-all"
            onClick={() => setLocation('/ai')}
          >
            Commencer Gratuitement
          </Button>
        </div>

        {/* Section inspiration */}
        <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-light text-gray-900 mb-2">D'abord s'améliorer.</h3>
          <h3 className="text-2xl font-light text-gray-900 mb-2">Puis conquérir le marché.</h3>
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Puis devenir une référence.</h3>
          <Button 
            variant="outline"
            className="border-2 border-purple-400 text-purple-600 hover:bg-gradient-to-r hover:from-purple-500 hover:to-violet-600 hover:text-white hover:border-transparent rounded-full px-6 py-2 font-medium shadow-lg hover:scale-105 transition-all"
            onClick={() => setLocation('/business-features')}
          >
            Rejoindre Pro Desk
          </Button>
        </div>

        {/* Section obstacles */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8">Surmontez Les Obstacles.</h3>
          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="w-16 h-2 bg-purple-200 rounded-full"></div>
            <div className="w-32 h-2 bg-purple-600 rounded-full"></div>
            <div className="w-16 h-2 bg-purple-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}