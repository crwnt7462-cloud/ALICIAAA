import React from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, MapPin, Clock, User } from "lucide-react";

export default function BookingSuccess() {
  const [, setLocation] = useLocation();

  // Récupérer les données de la réservation
  const selectedProfessional = localStorage.getItem('selectedProfessional');
  const selectedDateTime = JSON.parse(localStorage.getItem('selectedDateTime') || '{}');

  const handleBackToHome = () => {
    // Nettoyer les données de réservation
    localStorage.removeItem('selectedProfessional');
    localStorage.removeItem('selectedDateTime');
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50">
      <div className="max-w-lg mx-auto p-6">
        {/* Animation de succès */}
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-pulse">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Réservation confirmée !
          </h1>
          
          <p className="text-gray-600 mb-8">
            Votre rendez-vous a été enregistré avec succès
          </p>
        </div>

        {/* Détails de la réservation */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Détails de votre rendez-vous
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-violet-100 rounded-lg">
                <Calendar className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {selectedDateTime?.date || "Jeudi 20 février"}
                </p>
                <p className="text-sm text-gray-500">Date du rendez-vous</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {selectedDateTime?.time || "11:00"}
                </p>
                <p className="text-sm text-gray-500">Heure du rendez-vous</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {selectedProfessional === 'any' ? 'Aucune préférence' : selectedProfessional}
                </p>
                <p className="text-sm text-gray-500">Professionnel(le)</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Bonhomme</p>
                <p className="text-sm text-gray-500">Paris Archives</p>
              </div>
            </div>
          </div>
        </div>

        {/* Service et paiement */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Service réservé
          </h3>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium text-gray-900">Coupe Bonhomme</p>
              <p className="text-sm text-gray-500">30 minutes</p>
            </div>
            <span className="text-lg font-bold text-violet-600">39,00 €</span>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-green-800">Acompte payé</p>
                <p className="text-sm text-green-600">Le reste sera réglé sur place</p>
              </div>
              <span className="text-lg font-bold text-green-700">11,70 €</span>
            </div>
          </div>
        </div>

        {/* Informations importantes */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-amber-800 mb-3">
            Informations importantes
          </h3>
          
          <ul className="space-y-2 text-sm text-amber-700">
            <li>• Merci d'arriver 5 minutes avant votre rendez-vous</li>
            <li>• En cas d'empêchement, prévenez au moins 24h à l'avance</li>
            <li>• Votre confirmation a été envoyée par email</li>
            <li>• Le solde de 27,30 € sera à régler sur place</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleBackToHome}
            className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl"
          >
            Retour à l'accueil
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setLocation('/client-dashboard')}
            className="w-full h-12 border-violet-200 text-violet-600 hover:bg-violet-50 rounded-xl"
          >
            Voir mes rendez-vous
          </Button>
        </div>
      </div>
    </div>
  );
}