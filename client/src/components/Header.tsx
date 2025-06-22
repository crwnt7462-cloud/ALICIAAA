import { Bell, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center shadow-luxury">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-xl tracking-tight">
              Beauty Pro
            </h1>
            <p className="text-sm text-gradient font-medium">
              Plateforme de gestion avancée
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 rounded-xl transition-all duration-200"
          >
            <Search className="h-4 w-4" />
          </Button>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 rounded-xl transition-all duration-200"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></span>
          </div>
          <div className="flex items-center space-x-3 bg-gray-50/80 px-4 py-2.5 rounded-xl border border-gray-200/50 ml-2">
            <div className="w-9 h-9 gradient-bg rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-semibold">
                {user?.firstName?.[0] || 'M'}
              </span>
            </div>
            <div className="text-sm">
              <p className="font-semibold text-gray-900">{user?.firstName || 'Marie'} {user?.lastName || 'Dubois'}</p>
              <p className="text-gray-500 text-xs">Salon Manager</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
