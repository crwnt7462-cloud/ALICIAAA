import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function BusinessSuccess() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4">
          <div className="flex justify-between items-center h-14">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Avyento</h1>
              <p className="text-xs text-gray-500">Inscription réussie</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Icône de succès */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">✓</span>
            </div>
          </div>

          {/* Message de succès */}
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Inscription réussie !
            </h2>
            
            <p className="text-gray-600">
              Votre inscription a été traitée avec succès. Vous recevrez un email de confirmation avec vos accès dans quelques minutes.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <h3 className="font-medium text-blue-900 mb-2">Prochaines étapes :</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Vérifiez votre boîte email</li>
                <li>• Connectez-vous à votre espace pro</li>
                <li>• Configurez vos services et horaires</li>
                <li>• Invitez votre équipe</li>
              </ul>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left">
              <h3 className="font-medium text-gray-900 mb-2">Support client :</h3>
              <p className="text-sm text-gray-600">
                Une question ? Contactez-nous à{" "}
                <a href="mailto:support@avyento.com" className="text-violet-600 hover:underline">
                  support@avyento.com
                </a>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-3">
            <Button
              onClick={() => setLocation("/pro-login")}
              className="w-full h-10 bg-violet-600 hover:bg-violet-700 text-white font-medium"
            >
              Accéder à mon espace pro
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="w-full h-10 text-gray-600 border-gray-300 hover:bg-gray-50"
            >
              Retour
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}