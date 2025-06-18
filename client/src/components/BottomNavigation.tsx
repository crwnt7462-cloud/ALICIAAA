import { Home, Calendar, Users, CalendarPlus, MessageCircle, Brain } from "lucide-react";
import { useLocation } from "wouter";

interface NavItem {
  path: string;
  icon: React.ComponentType<any>;
  label: string;
  hasNotification?: boolean;
}

const navItems: NavItem[] = [
  { path: "/", icon: Home, label: "Accueil" },
  { path: "/planning", icon: Calendar, label: "Planning" },
  { path: "/clients", icon: Users, label: "Clients" },
  { path: "/booking", icon: CalendarPlus, label: "Réserver" },
  { path: "/ai", icon: Brain, label: "IA & Support", hasNotification: true },
];

export function BottomNavigation() {
  const [location, setLocation] = useLocation();

  return (
    <nav className="bg-white border-t border-gray-200 px-6 py-3 shadow-lg">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`flex flex-col items-center py-2 px-3 transition-all duration-200 relative rounded-lg ${
                isActive
                  ? "text-blue-600 bg-blue-50 shadow-sm"
                  : "text-gray-500 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
              {item.hasNotification && (
                <div className="absolute top-1 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
