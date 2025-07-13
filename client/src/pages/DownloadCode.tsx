import { Download, FileArchive, Code, Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function DownloadCode() {
  const { toast } = useToast();

  const handleDownload = () => {
    // Créer un lien direct vers l'API de téléchargement
    const link = document.createElement('a');
    link.href = '/download-code';
    link.download = 'salon-beaute-code-complet.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Téléchargement démarré !",
      description: "Le fichier ZIP va se télécharger automatiquement.",
    });
  };

  return (
    <div className="p-4 space-y-6 bg-gradient-to-br from-gray-50/50 to-purple-50/30 min-h-full">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileArchive className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Code Source Complet</h1>
          <p className="text-gray-600 text-sm mt-1">
            Téléchargez tout le code de votre application
          </p>
        </div>

        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center">
              <Code className="w-5 h-5 mr-2 text-blue-600" />
              Contenu de l'archive
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Code source React + TypeScript complet
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Backend Express avec toutes les API
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Base de données PostgreSQL + schémas
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Page de réservation simplifiée
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Système de partage de liens
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Documentation complète (README.md)
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleDownload}
          className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl"
        >
          <Download className="w-5 h-5 mr-2" />
          Télécharger le code complet
        </Button>

        <Card className="border-0 shadow-sm bg-yellow-50/80 backdrop-blur-sm rounded-xl mt-6">
          <CardContent className="p-4">
            <h3 className="font-semibold text-yellow-800 mb-2 flex items-center">
              <Smartphone className="w-4 h-4 mr-2" />
              Installation rapide
            </h3>
            <div className="space-y-2 text-sm text-yellow-700">
              <div className="flex items-start">
                <span className="w-5 h-5 bg-yellow-200 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">1</span>
                <span>Extraire l'archive ZIP téléchargée</span>
              </div>
              <div className="flex items-start">
                <span className="w-5 h-5 bg-yellow-200 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">2</span>
                <span>Installer Node.js et PostgreSQL</span>
              </div>
              <div className="flex items-start">
                <span className="w-5 h-5 bg-yellow-200 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">3</span>
                <span>Lancer <code className="bg-yellow-100 px-1 rounded text-xs">npm install</code></span>
              </div>
              <div className="flex items-start">
                <span className="w-5 h-5 bg-yellow-200 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">4</span>
                <span>Configurer la base de données (.env)</span>
              </div>
              <div className="flex items-start">
                <span className="w-5 h-5 bg-yellow-200 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">5</span>
                <span>Démarrer avec <code className="bg-yellow-100 px-1 rounded text-xs">npm run dev</code></span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-gray-500 mt-4">
          <p>Taille : ~158 KB • Format : ZIP</p>
          <p>Code source complet prêt à déployer</p>
        </div>
      </div>
    </div>
  );
}