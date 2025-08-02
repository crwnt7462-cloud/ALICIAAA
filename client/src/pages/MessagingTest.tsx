// Page de test de la messagerie temps réel
import { useState } from 'react';
import { useLocation } from 'wouter';
import RealTimeMessaging from './RealTimeMessaging';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MessageCircle, User, Users } from 'lucide-react';

export default function MessagingTest() {
  const [, setLocation] = useLocation();
  const [activeConversation, setActiveConversation] = useState<string | null>(null);

  // Si une conversation est active, afficher la messagerie temps réel
  if (activeConversation) {
    const isClient = activeConversation === 'client';
    
    const clientInfo = {
      id: 'client_1',
      name: 'Marie Dupont',
      type: 'client' as const
    };

    const professionalInfo = {
      id: 'pro_1',
      name: 'Mon Salon',
      type: 'professional' as const
    };

    return (
      <RealTimeMessaging
        currentUserId={isClient ? clientInfo.id : professionalInfo.id}
        currentUserType={isClient ? clientInfo.type : professionalInfo.type}
        currentUserName={isClient ? clientInfo.name : professionalInfo.name}
        otherUserId={isClient ? professionalInfo.id : clientInfo.id}
        otherUserType={isClient ? professionalInfo.type : clientInfo.type}
        otherUserName={isClient ? professionalInfo.name : clientInfo.name}
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
              className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Test Messagerie Temps Réel</h1>
              <p className="text-gray-600">Démonstration du système de messagerie fonctionnel</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Description */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Messagerie Temps Réel Fonctionnelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                Cette messagerie utilise un système temps réel basique avec stockage en mémoire. 
                Les messages sont envoyés via fetch() au backend et affichés instantanément dans l'interface.
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">Fonctionnalités implémentées :</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Envoi de messages en temps réel via API</li>
                  <li>• Stockage des conversations en mémoire</li>
                  <li>• Chargement automatique de l'historique</li>
                  <li>• Interface responsive avec bulles de messages</li>
                  <li>• Actualisation automatique toutes les 3 secondes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sélection du type d'utilisateur */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Test en tant que Client</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Testez l'interface client pour envoyer des messages au salon
                </p>
                <Button
                  onClick={() => setActiveConversation('client')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Ouvrir la messagerie client
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-violet-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Test en tant que Professionnel</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Testez l'interface pro pour répondre aux messages clients
                </p>
                <Button
                  onClick={() => setActiveConversation('professional')}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white" 
                >
                  Ouvrir la messagerie pro
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informations techniques */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Informations Techniques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium">Backend</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Service MessagingService avec stockage en mémoire</li>
                  <li>• API Routes : POST /api/messaging/send</li>
                  <li>• GET /api/messaging/conversation/:clientId/:professionalId</li>
                  <li>• Données de test pré-chargées</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Frontend</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Composant RealTimeMessaging réutilisable</li>
                  <li>• Interface avec bulles de messages</li>
                  <li>• Actualisation automatique</li>
                  <li>• Gestion des erreurs et loading</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}