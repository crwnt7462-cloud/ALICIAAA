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
      path: '/dashboard',
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
      {/* Barre flottante violette taille référence */}
      <div className="bg-violet-600 rounded-full shadow-lg px-6 py-3">
        <div className="flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`flex flex-col items-center gap-1 transition-all duration-200 ${
                item.active
                  ? 'text-white transform scale-110'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
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
