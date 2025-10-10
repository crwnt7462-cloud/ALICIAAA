import { useLocation } from "wouter";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Contenu principal centré */}
      <main className="flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 min-h-screen">
        <div className="text-center w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
          {/* Code d'erreur - Responsive */}
          <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-gray-300 mb-3 sm:mb-4 md:mb-6">
            404
          </div>
          
          {/* Message d'erreur - Responsive */}
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 px-4">
            Page introuvable
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 md:mb-10 px-4 leading-relaxed">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          
          {/* Actions - Responsive */}
          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button
              onClick={() => setLocation('/')}
              className="flex items-center justify-center gap-2 w-full xs:w-auto text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">Retour à l'accueil</span>
              <span className="xs:hidden">Accueil</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 w-full xs:w-auto text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">Page précédente</span>
              <span className="xs:hidden">Précédent</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
