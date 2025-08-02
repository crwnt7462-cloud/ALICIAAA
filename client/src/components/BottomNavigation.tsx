import { useLocation } from 'wouter';
import { 
  Home, Calendar, Settings, MessageCircle, 
  Sparkles, Users, BarChart3 
} from 'lucide-react';
import { getGenericGlassButton } from '@/lib/salonColors';

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
    <div className="fixed bottom-1 left-1/2 transform -translate-x-1/2 z-50">
      {/* Barre flottante glassmorphism compacte ultra-transparente */}
      <div className="bg-white/20 backdrop-blur-xl border border-white/10 shadow-xl rounded-full px-4 py-1.5">
        <div className="flex items-center gap-4">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`flex flex-col items-center gap-0.5 transition-all duration-200 px-1.5 py-0.5 ${
                item.active
                  ? 'text-gray-900 transform scale-105'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <item.icon className="h-3.5 w-3.5" />
              <span className="text-[9px] font-medium">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
