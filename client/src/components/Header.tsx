import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold text-lg">S</span>
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 text-lg">
              Studio Pro
            </h1>
            <p className="text-sm text-gray-500">
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
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-medium text-sm">
              {user?.firstName?.[0] || 'U'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
