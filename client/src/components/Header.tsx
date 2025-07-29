import { useQuery } from "@tanstack/react-query";
import { Bell, Menu, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export function Header() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
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

  return (
    <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200/50 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-8 w-8"
            onClick={() => {
              setLocation("/business-features");
              toast({
                title: "Configuration salon",
                description: "Paramètres généraux du salon"
              });
            }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
          </Button>
          <div>
            <h1 className="font-semibold text-gray-900 text-sm">{getPageTitle()}</h1>
            {user?.firstName && (
              <p className="text-xs text-gray-500">
                Bonjour, {user.firstName}
              </p>
            )}
          </div>
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
  );
}