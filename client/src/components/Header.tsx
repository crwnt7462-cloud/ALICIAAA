import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">✂</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-xl">
              Beauty Pro
            </h1>
            <p className="text-sm text-blue-600 font-medium">
              Gestion professionnelle
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
          >
            <Search className="h-4 w-4" />
          </Button>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
          </div>
          <div className="flex items-center space-x-3 bg-gray-50 px-3 py-2 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {user?.firstName?.[0] || 'M'}
              </span>
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900">{user?.firstName || 'Marie'} {user?.lastName || 'Dubois'}</p>
              <p className="text-gray-500">Propriétaire</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
