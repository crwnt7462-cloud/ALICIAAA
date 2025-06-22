import { Bell, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

export function Header() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 px-4 py-3 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 gradient-bg rounded-xl flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg tracking-tight">
              Beauty Pro
            </h1>
            <p className="text-xs text-gradient font-medium">
              Gestion salon
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg"
            onClick={() => setLocation('/clients')}
          >
            <Search className="h-3.5 w-3.5" />
          </Button>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg"
              onClick={() => setLocation('/notifications')}
            >
              <Bell className="h-3.5 w-3.5" />
            </Button>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-purple-500 rounded-full"></span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-50/80 px-2.5 py-1.5 rounded-lg border border-gray-200/50 ml-1">
            <div className="w-6 h-6 gradient-bg rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-semibold">
                {user?.firstName?.[0] || 'M'}
              </span>
            </div>
            <div className="text-xs hidden sm:block">
              <p className="font-semibold text-gray-900 leading-tight">{user?.firstName || 'Marie'}</p>
              <p className="text-gray-500 text-[10px]">Manager</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
