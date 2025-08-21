import { useQuery } from "@tanstack/react-query";
import { Bell, Menu, Settings, User, X, Home, Calendar, Users, BarChart3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function Header() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
  });

  const getPageTitle = () => {
    switch (location) {
      case "/dashboard":
        return "Tableau de bord";
      case "/planning":
        return "Planning";
      case "/clients":
        return "Clients";
      case "/services":
        return "Services";
      case "/staff":
        return "Équipe";
      case "/booking":
        return "Nouveau RDV";
      case "/share-booking":
        return "Partager";
      case "/ai":
        return "IA Pro";
      default:
        return "Salon Manager";
    }
  };

  // Menu navigation items pour desktop
  const navItems = [
    {
      label: 'Tableau de bord',
      icon: Home,
      path: '/dashboard',
      active: location === '/dashboard' || location === '/'
    },
    {
      label: 'Planning',
      icon: Calendar,
      path: '/planning-responsive',
      active: location === '/planning-responsive' || location === '/planning'
    },
    {
      label: 'Clients',
      icon: Users,
      path: '/clients-modern',
      active: location === '/clients-modern' || location === '/clients'
    },
    {
      label: 'Analytics',
      icon: BarChart3,
      path: '/client-analytics',
      active: location === '/client-analytics' || location === '/analytics-dashboard'
    },
    {
      label: 'IA Assistant',
      icon: Sparkles,
      path: '/ai-pro-complete',
      active: location === '/ai-pro-complete' || location === '/ai'
    },
    {
      label: 'Paramètres',
      icon: Settings,
      path: '/business-features',
      active: location === '/business-features'
    }
  ];

  return (
    <>
      <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200/50 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between max-w-md mx-auto lg:max-w-none">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-8 w-8"
              onClick={() => {
                setLocation("/");
                toast({
                  title: "Accueil",
                  description: "Retour à l'accueil"
                });
              }}
            >
              <img 
                src="/attached_assets/avyento. (1)_1755286272417.png" 
                alt="Avyento Pro"
                className="w-8 h-8 object-contain rounded-lg"
              />
            </Button>
            <div className="lg:hidden">
              <h1 className="font-semibold text-gray-900 text-sm">{getPageTitle()}</h1>
              {(user as any)?.businessName && (
                <p className="text-xs text-gray-500">
                  {(user as any).businessName}
                </p>
              )}
            </div>
          </div>

          {/* Menu horizontal pour desktop */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  setLocation(item.path);
                  toast({
                    title: item.label,
                    description: `Navigation vers ${item.label}`
                  });
                }}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  item.active
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-purple-600'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0 relative"
            onClick={() => {
              setLocation("/notifications");
              toast({
                title: "Notifications",
                description: "Centre de notifications ouvert"
              });
            }}
          >
            <Bell className="w-4 h-4 text-gray-600" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-2 h-2 p-0 text-xs border-white"
            >
              <span className="sr-only">Notifications</span>
            </Badge>
          </Button>
          
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0"
            onClick={() => {
              setLocation("/business-features");
              toast({
                title: "Paramètres",
                description: "Configuration du salon ouverte"
              });
            }}
          >
            <Settings className="w-4 h-4 text-gray-600" />
          </Button>
        </div>
      </div>
    </header>


    </>
  );
}