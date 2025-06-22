import { LayoutDashboard, Calendar, Users, CalendarPlus, Brain } from "lucide-react";
import { useLocation } from "wouter";

interface NavItem {
  path: string;
  icon: React.ComponentType<any>;
  label: string;
  hasNotification?: boolean;
}

const navItems: NavItem[] = [
  { path: "/", icon: LayoutDashboard, label: "Tableau de bord" },
  { path: "/planning", icon: Calendar, label: "Planning" },
  { path: "/clients", icon: Users, label: "Clients" },
  { path: "/booking", icon: CalendarPlus, label: "Nouveau RDV" },
  { path: "/ai", icon: Brain, label: "Assistant Pro", hasNotification: true },
];

export function BottomNavigation() {
  const [location, setLocation] = useLocation();

  return (
    <nav className="bg-white/90 backdrop-blur-lg border-t border-gray-200/50 px-4 py-3 shadow-luxury">
      <div className="flex justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`flex flex-col items-center py-3 px-3 transition-all duration-300 relative rounded-2xl min-w-0 ${
                isActive
                  ? "text-white shadow-lg scale-105"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/60"
              }`}
              style={isActive ? {
                background: 'linear-gradient(135deg, hsl(262, 83%, 58%) 0%, hsl(217, 91%, 60%) 100%)',
              } : {}}
            >
              <Icon className={`w-5 h-5 mb-1.5 ${isActive ? 'scale-110' : ''} transition-all duration-300`} />
              <span className={`text-[10px] font-medium leading-tight text-center max-w-[60px] ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
              {item.hasNotification && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-400 to-pink-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
