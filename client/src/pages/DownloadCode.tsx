import { useState } from "react";
import { Download, Code, Github, FileText, Copy, Check, Mail, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function DownloadCode() {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      toast({
        title: "Copié !",
        description: `${label} copié dans le presse-papiers.`,
      });
      setTimeout(() => setCopiedText(null), 2000);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le texte.",
        variant: "destructive",
      });
    }
  };

  const downloadOptions = [
    {
      title: "Code source complet",
      description: "Archive ZIP contenant tout le code source de l'application",
      icon: Download,
      color: "bg-blue-100 text-blue-600",
      action: () => {
        // Simuler un téléchargement
        const link = document.createElement('a');
        link.href = '/salon-beaute-code-complet.zip';
        link.download = 'salon-beaute-code-complet.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Téléchargement démarré",
          description: "Le code source est en cours de téléchargement.",
        });
      }
    },
    {
      title: "Repository GitHub",
      description: "Lien vers le repository GitHub du projet",
      icon: Github,
      color: "bg-gray-100 text-gray-600",
      action: () => {
        const githubUrl = "https://github.com/votre-username/salon-manager";
        copyToClipboard(githubUrl, "Lien GitHub");
      }
    },
    {
      title: "Documentation technique",
      description: "Guide complet d'installation et de configuration",
      icon: FileText,
      color: "bg-green-100 text-green-600",
      action: () => {
        window.open('/documentation.pdf', '_blank');
      }
    }
  ];

  const technicalSpecs = {
    frontend: [
      "React 18 avec TypeScript",
      "Vite pour le bundling",
      "Tailwind CSS + shadcn/ui",
      "TanStack Query pour les requêtes",
      "Wouter pour le routing",
      "React Hook Form + Zod"
    ],
    backend: [
      "Node.js + Express.js",
      "TypeScript strict mode",
      "PostgreSQL + Drizzle ORM",
      "Authentification Replit Auth",
      "API REST complète",
      "Services IA (OpenAI GPT-4o)"
    ],
    features: [
      "Gestion complète des rendez-vous",
      "Base de données clients",
      "Système de réservation publique",
      "Intelligence artificielle intégrée",
      "Interface mobile-first",
      "Notifications automatiques"
    ]
  };

  const installationSteps = `# Installation et démarrage

## Prérequis
- Node.js 18+
- PostgreSQL
- Compte OpenAI (optionnel)

## Installation
\`\`\`bash
# Cloner le repository
git clone https://github.com/votre-username/salon-manager
cd salon-manager

# Installer les dépendances
npm install

# Configuration des variables d'environnement
cp .env.example .env
# Éditer .env avec vos paramètres

# Migration de la base de données
npm run db:push

# Démarrer l'application
npm run dev
\`\`\`

## Variables d'environnement requises
\`\`\`
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-... (optionnel)
SENDGRID_API_KEY=... (optionnel)
STRIPE_SECRET_KEY=... (optionnel)
\`\`\`

## Déploiement
L'application est prête pour le déploiement sur:
- Replit (recommandé)
- Vercel
- Railway
- Render`;

  return (
    <div className="p-4 space-y-6 bg-gradient-to-br from-gray-50/50 to-purple-50/30 min-h-full">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Code className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Code source</h1>
          <p className="text-gray-600 text-sm mt-1">
            Téléchargez le code complet de l'application
          </p>
        </div>

        {/* Download Options */}
        <div className="space-y-3 mb-6">
          {downloadOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Card key={option.title} className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`w-12 h-12 ${option.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {option.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {option.description}
                      </p>
                      <Button 
                        onClick={option.action}
                        size="sm"
                        className="w-full"
                      >
                        {option.title.includes("GitHub") ? "Copier le lien" : 
                         option.title.includes("Documentation") ? "Voir la doc" : "Télécharger"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Technical Specifications */}
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Spécifications techniques</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-purple-800 mb-2">Frontend</h4>
              <ul className="space-y-1">
                {technicalSpecs.frontend.map((spec, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center">
                    <div className="w-1 h-1 bg-purple-400 rounded-full mr-2"></div>
                    {spec}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Backend</h4>
              <ul className="space-y-1">
                {technicalSpecs.backend.map((spec, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center">
                    <div className="w-1 h-1 bg-blue-400 rounded-full mr-2"></div>
                    {spec}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-green-800 mb-2">Fonctionnalités</h4>
              <ul className="space-y-1">
                {technicalSpecs.features.map((spec, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center">
                    <div className="w-1 h-1 bg-green-400 rounded-full mr-2"></div>
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Installation Guide */}
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center justify-between">
              Guide d'installation
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(installationSteps, "Guide d'installation")}
                className="h-8 px-2"
              >
                {copiedText === installationSteps ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-gray-100 whitespace-pre-wrap">
                {installationSteps}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
          <CardContent className="p-4 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Besoin d'aide ?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Pour toute question sur l'installation ou la personnalisation
            </p>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1"
                onClick={() => copyToClipboard("support@salon-manager.com", "Email de support")}
              >
                <Mail className="w-4 h-4 mr-2" />
                Support email
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1"
                onClick={() => window.open("https://discord.gg/salon-manager", "_blank")}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Discord
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* License */}
        <div className="text-center text-xs text-gray-500 mt-6">
          <p>Code source sous licence MIT</p>
          <p>© 2024 Salon Manager. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
}