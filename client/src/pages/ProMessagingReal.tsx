// Page de messagerie côté professionnel
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import RealTimeMessaging from './RealTimeMessaging';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MessageCircle, User } from 'lucide-react';

export default function ProMessagingReal() {
  const [, setLocation] = useLocation();
  const [showMessaging, setShowMessaging] = useState(false);

  // Informations professionnel (depuis localStorage ou contexte)
  const professionalInfo = {
    id: 'pro_1',
    name: 'Salon Excellence',
    type: 'professional' as const
  };

  // Informations client (client de test)
  const clientInfo = {
    id: 'client_1',
    name: 'Marie Dupont',
    type: 'client' as const
  };

  if (showMessaging) {
    return (
      <RealTimeMessaging
        currentUserId={professionalInfo.id}
        currentUserType={professionalInfo.type}
        currentUserName={professionalInfo.name}
        otherUserId={clientInfo.id}
        otherUserType={clientInfo.type}
        otherUserName={clientInfo.name}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="h-10 w-10 p-0 rounded-full hover:bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Messagerie Pro</h1>
              <p className="text-gray-600">Communication directe avec vos clients</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Conversation avec {clientInfo.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Messagerie professionnelle temps réel
              </h3>
              <p className="text-gray-600 mb-6">
                Répondez directement aux questions de {clientInfo.name} et gérez vos échanges clients
              </p>
              <Button
                onClick={() => setShowMessaging(true)}
                className="bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 hover:bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 text-violet-700"
              >
                Ouvrir la messagerie
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Fonctionnalités pro */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <h4 className="font-medium">Réponse rapide</h4>
                  <p className="text-sm text-gray-600">Temps réel</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Répondez instantanément aux questions de vos clients pour améliorer leur expérience.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Gestion client</h4>
                  <p className="text-sm text-gray-600">Suivi personnalisé</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Gardez un historique de tous les échanges avec chaque client pour un service personnalisé.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Communication</h4>
                  <p className="text-sm text-gray-600">Professionnelle</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Communiquez de manière professionnelle avec vos clients pour renforcer votre image de marque.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}