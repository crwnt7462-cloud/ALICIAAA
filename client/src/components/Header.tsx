import { Bell, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="bg-white dark:bg-dark-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <i className="fas fa-cut text-white text-sm"></i>
          </div>
          <div>
            <h1 className="font-semibold text-lg">
              {user?.businessName || 'Salon Élégance'}
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}`
                : 'Professionnel de la beauté'
              }
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-lg bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-yellow-400" />
            ) : (
              <Moon className="h-4 w-4 text-gray-600" />
            )}
          </Button>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600"
            >
              <Bell className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </Button>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
