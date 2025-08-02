// Page de messagerie côté client
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import RealTimeMessaging from './RealTimeMessaging';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MessageCircle } from 'lucide-react';

export default function ClientMessaging() {
  const [, setLocation] = useLocation();
  const [showMessaging, setShowMessaging] = useState(false);

  // Informations client (depuis localStorage ou contexte)
  const clientInfo = {
    id: 'client_1',
    name: 'Marie Dupont',
    type: 'client' as const
  };

  // Informations professionnel (salon de test)
  const professionalInfo = {
    id: 'pro_1',
    name: 'Mon Salon',
    type: 'professional' as const
  };

  if (showMessaging) {
    return (
      <RealTimeMessaging
        currentUserId={clientInfo.id}
        currentUserType={clientInfo.type}
        currentUserName={clientInfo.name}
        otherUserId={professionalInfo.id}
        otherUserType={professionalInfo.type}
        otherUserName={professionalInfo.name}
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
              onClick={() => setLocation('/client-dashboard')}
              className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Messagerie</h1>
              <p className="text-gray-600">Communiquez avec vos salons</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Conversation avec {professionalInfo.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Messagerie temps réel
              </h3>
              <p className="text-gray-600 mb-6">
                Discutez directement avec {professionalInfo.name} pour vos questions et réservations
              </p>
              <Button
                onClick={() => setShowMessaging(true)}
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                Ouvrir la messagerie
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Informations sur la messagerie */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Messages temps réel</h4>
                  <p className="text-sm text-gray-600">Réponse instantanée</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Vos messages sont envoyés instantanément et les réponses apparaissent en temps réel.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Historique sauvegardé</h4>
                  <p className="text-sm text-gray-600">Conversations mémorisées</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Retrouvez l'historique complet de vos échanges avec le salon à tout moment.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}