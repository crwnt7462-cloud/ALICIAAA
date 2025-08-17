import { useLocation } from 'wouter';
import { 
  Home, Calendar, Sparkles, Users, BarChart3 
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
    <>
      {/* Navigation universelle en bas - mobile et desktop */}
      <div className="fixed bottom-1 left-1/2 transform -translate-x-1/2 z-50">
        {/* Barre flottante glassmorphism responsive */}
        <div className="bg-white/20 backdrop-blur-md border border-white/30 shadow-xl rounded-full px-4 py-1.5 md:px-6 md:py-2">
          <div className="flex items-center gap-3 md:gap-6">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => setLocation(item.path)}
                className={`flex flex-col items-center gap-0.5 md:gap-1 transition-all duration-200 px-1.5 py-0.5 md:px-2 md:py-1 ${
                  item.active
                    ? 'text-gray-900 transform scale-105'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <item.icon className="h-3.5 w-3.5 md:h-5 md:w-5" />
                <span className="text-[9px] md:text-[11px] font-medium">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
