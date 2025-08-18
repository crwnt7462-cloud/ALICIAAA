import { useLocation } from "wouter";
import { Home, Calendar, Users, BarChart3, Sparkles, Settings } from "lucide-react";

export default function ProBottomNavigation() {
  const [location, setLocation] = useLocation();

  const navItems = [
    {
      path: '/dashboard',
      icon: Home,
      label: 'Dashboard',
      active: location === '/dashboard'
    },
    {
      path: '/planning',
      icon: Calendar,
      label: 'Planning',
      active: location === '/planning'
    },
    {
      path: '/clients-modern',
      icon: Users,
      label: 'Clients',
      active: location === '/clients-modern'
    },
    {
      path: '/ai-assistant-fixed',
      icon: Sparkles,
      label: 'IA',
      active: location === '/ai-assistant-fixed'
    },
    {
      path: '/services-management',
      icon: Settings,
      label: 'Services',
      active: location === '/services-management'
    },
    {
      path: '/messaging-hub',
      icon: BarChart3,
      label: 'Messages',
      active: location === '/messaging-hub'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => setLocation(item.path)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 ${
              item.active
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}