import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Share2,
  Copy,
  MessageCircle,
} from "lucide-react";

export default function BusinessFeatures() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Vérifier l'authentification
  const { data: sessionData, isLoading } = useQuery({
    queryKey: ['/api/auth/check-session'],
    retry: false,
  });

  useEffect(() => {
    // Rediriger vers login si pas connecté
    if (!isLoading && (!sessionData || !sessionData.authenticated)) {
      setLocation('/pro-login');
    }
  }, [sessionData, isLoading, setLocation]);

  // Données du salon (récupérées depuis la session)
  const salonData = sessionData?.user ? {
    name: sessionData.user.businessName || "Mon Salon",
    handle: sessionData.user.mention_handle || "monsalon"
  } : { name: "Mon Salon", handle: "monsalon" };

  const salonUrl = `${window.location.origin}/salon/${salonData.handle}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copié !",
        description: "Le lien a été copié dans le presse-papiers"
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Pro Tools
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Partagez votre salon avec vos clients
        </p>
      </div>

      {/* Lien de partage du salon */}
      <Card className="border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Share2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {salonData.name}
            </h3>
            <p className="text-sm text-gray-600">
              Partagez votre lien unique avec vos clients
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Votre lien de salon :</p>
              <div className="flex items-center gap-2 bg-gray-50 rounded-md p-3">
                <code className="flex-1 text-sm text-violet-600 font-mono truncate">
                  {salonUrl}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(salonUrl)}
                  className="shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => copyToClipboard(salonUrl)}
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copier
              </Button>
              <Button
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Découvrez mon salon : ${salonUrl}`)}`)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}