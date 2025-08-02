import { useLocation } from 'wouter';
import { 
  Home, Calendar, Settings, MessageCircle, 
  Sparkles, Users, BarChart3 
} from 'lucide-react';

export function BottomNavigationFloating() {
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
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      {/* Barre flottante avec ombre et effet glassmorphism */}
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-2xl shadow-black/10 px-6 py-3">
        <div className="flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`flex flex-col items-center gap-1 transition-all duration-200 ${
                item.active
                  ? 'text-violet-600 transform scale-110'
                  : 'text-gray-500 hover:text-gray-700 hover:scale-105'
              }`}
            >
              <div className={`p-2 rounded-2xl transition-all duration-200 ${
                item.active 
                  ? 'bg-violet-100 shadow-lg shadow-violet-200/50' 
                  : 'hover:bg-gray-100'
              }`}>
                <item.icon className={`h-5 w-5 ${
                  item.active ? 'text-violet-600' : 'text-current'
                }`} />
              </div>
              <span className={`text-xs font-medium ${
                item.active ? 'text-violet-600' : 'text-current'
              }`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}