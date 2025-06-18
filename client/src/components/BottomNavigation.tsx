import { Home, Calendar, Users, CalendarPlus, MessageCircle } from "lucide-react";
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
  { path: "/booking", icon: CalendarPlus, label: "Réservations" },
  { path: "/forum", icon: MessageCircle, label: "Forum", hasNotification: true },
];

export function BottomNavigation() {
  const [location, setLocation] = useLocation();

  return (
    <nav className="bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`flex flex-col items-center py-2 px-3 transition-colors relative ${
                isActive
                  ? "text-primary"
                  : "text-gray-500 dark:text-gray-400 hover:text-primary"
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
              {item.hasNotification && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
