import React from 'react';
import { useLocation } from 'wouter';
import { 
  Calendar, 
  Users, 
  Settings, 
  BarChart3, 
  MessageSquare,
  Package,
  User
} from 'lucide-react';

interface ProHeaderProps {
  currentPage?: string;
}

export function ProHeader({ currentPage = 'services' }: ProHeaderProps) {
  const [, setLocation] = useLocation();

  // Menu items spécifiques aux pages professionnelles
  const menuItems = [
    {
      id: 'planning',
      label: 'Planning',
      icon: Calendar,
      path: '/planning',
      active: currentPage === 'planning'
    },
    {
      id: 'services',
      label: 'Services',
      icon: Settings,
      path: '/services-management',
      active: currentPage === 'services'
    },
    {
      id: 'clients',
      label: 'Clients',
      icon: Users,
      path: '/clients',
      active: currentPage === 'clients'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      path: '/business-features',
      active: currentPage === 'analytics'
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      path: '/messaging-hub',
      active: currentPage === 'messages'
    },
    {
      id: 'compte',
      label: 'Mon Compte',
      icon: User,
      path: '/dashboard',
      active: currentPage === 'dashboard'
    }
  ];

  return (
    <header className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => setLocation('/')}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
              avyento.
            </span>
          </div>

          {/* Navigation menu */}
          <nav className="flex items-center space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setLocation(item.path)}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                  ${item.active 
                    ? 'text-purple-600 bg-purple-50 border-b-2 border-purple-600' 
                    : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                  }
                `}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}