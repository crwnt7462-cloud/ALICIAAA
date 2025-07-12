import { LayoutDashboard, Calendar, Users, Settings, Brain, BarChart3, Star, Zap, QrCode, MoreHorizontal } from "lucide-react";
import { useLocation } from "wouter";

interface NavItem {
  path: string;
  icon: React.ComponentType<any>;
  label: string;
  hasNotification?: boolean;
}

const navItems: NavItem[] = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Accueil" },
  { path: "/planning", icon: Calendar, label: "Planning" },
  { path: "/analytics", icon: BarChart3, label: "Analytics" },
  { path: "/smart-features", icon: Zap, label: "Smart", hasNotification: true },
  { path: "/more", icon: MoreHorizontal, label: "Plus" },
];

export function BottomNavigation() {
  const [location, setLocation] = useLocation();

  return (
    <nav className="bg-white/95 backdrop-blur-lg border-t border-gray-200/50 px-2 py-2 shadow-luxury safe-area-bottom">
      <div className="flex justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`flex flex-col items-center py-2 px-2 transition-all duration-300 relative rounded-xl min-w-0 ${
                isActive
                  ? "text-white shadow-md"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/60"
              }`}
              style={isActive ? {
                background: 'linear-gradient(135deg, hsl(262, 83%, 58%) 0%, hsl(217, 91%, 60%) 100%)',
              } : {}}
            >
              <Icon className={`w-4 h-4 mb-1 ${isActive ? 'scale-105' : ''} transition-all duration-300`} />
              <span className={`text-[9px] font-medium leading-tight text-center max-w-[50px] ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
              {item.hasNotification && (
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
