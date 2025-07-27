import { useLocation } from 'wouter';
import { 
  Home, Calendar, Settings, MessageCircle, 
  Sparkles, Users, BarChart3 
} from 'lucide-react';

export function BottomNavigation() {
  const [location, setLocation] = useLocation();

  const navItems = [
    {
      label: 'Accueil',
      icon: Home,
      path: '/',
      active: location === '/' || location === '/dashboard'
    },
    {
      label: 'Planning',
      icon: Calendar,
      path: '/planning',
      active: location === '/planning'
    },
    {
      label: 'Clients',
      icon: Users,
      path: '/clients',
      active: location === '/clients'
    },
    {
      label: 'Pro Tools',
      icon: BarChart3,
      path: '/business-features',
      active: location === '/business-features' || location.includes('/pro-')
    },
    {
      label: 'IA',
      icon: Sparkles,
      path: '/ai',
      active: location === '/ai' || location.includes('/ai-')
    }
  ];

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      {/* Barre flottante violette sobre */}
      <div className="bg-violet-600 rounded-2xl shadow-lg px-4 py-2">
        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`flex flex-col items-center gap-1 transition-all duration-200 py-2 px-3 rounded-xl ${
                item.active
                  ? 'bg-white/20 text-white transform scale-105'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span className="text-xs font-medium">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
