import { Home, Calendar, Users, CalendarPlus, MessageCircle, Brain } from "lucide-react";
import { useLocation } from "wouter";

interface NavItem {
  path: string;
  icon: React.ComponentType<any>;
  label: string;
  hasNotification?: boolean;
}

const navItems: NavItem[] = [
  { path: "/", icon: Home, label: "Tableau de bord" },
  { path: "/planning", icon: Calendar, label: "Planning" },
  { path: "/clients", icon: Users, label: "Clients" },
  { path: "/booking", icon: CalendarPlus, label: "Réservations" },
  { path: "/ai", icon: Brain, label: "IA & Auto", hasNotification: true },
  { path: "/support", icon: MessageCircle, label: "Support" },
];

export function BottomNavigation() {
  const [location, setLocation] = useLocation();

  return (
    <nav className="bg-white border-t border-gray-200 px-6 py-3">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`flex flex-col items-center py-1 px-2 transition-all duration-200 relative ${
                isActive
                  ? "text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
              {item.hasNotification && (
                <div className="absolute top-0 right-1 w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
              {isActive && (
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
