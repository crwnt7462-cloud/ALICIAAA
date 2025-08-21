import React from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, MapPin, Clock, User, ArrowLeft } from "lucide-react";
import { MobileBottomNav } from '@/components/MobileBottomNav';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header avec design Avyento */}
      <div className="bg-white/90 backdrop-blur-16 border-b border-violet-200/30 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.history.back()}
              className="h-10 w-10 rounded-full bg-violet-100/50 hover:bg-violet-200/70"
            >
              <ArrowLeft className="h-4 w-4 text-violet-700" />
            </Button>
            <div className="flex-1">
              <h1 className="font-semibold text-gray-900">Confirmation de réservation</h1>
              <div className="text-sm text-gray-600">Salon Excellence Paris</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 pb-20 lg:pb-6">
        {/* Animation de succès avec glassmorphism */}
        <div className="text-center py-8 lg:py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 bg-green-500/10 backdrop-blur-12 border border-green-200/30 rounded-full mb-6 animate-pulse shadow-lg">
            <CheckCircle className="w-12 h-12 lg:w-14 lg:h-14 text-green-600" />
          </div>
          
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Réservation confirmée !
          </h1>
          
          <p className="text-gray-600 mb-8 text-base lg:text-lg">
            Votre rendez-vous a été enregistré avec succès
          </p>
        </div>

        {/* Détails de la réservation - Design glassmorphism */}
        <div className="bg-white/70 backdrop-blur-16 border border-violet-100/30 rounded-3xl shadow-xl p-6 lg:p-8 mb-6">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-6">
            Détails de votre rendez-vous
          </h2>
          
          <div className="space-y-5">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-violet-500/10 backdrop-blur-12 border border-violet-200/30 rounded-2xl">
                <Calendar className="w-6 h-6 text-violet-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-base">
                  {selectedDateTime?.date || "Jeudi 20 février"}
                </p>
                <p className="text-sm text-gray-500">Date du rendez-vous</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-amber-500/10 backdrop-blur-12 border border-amber-200/30 rounded-2xl">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-base">
                  {selectedDateTime?.time || "11:00"}
                </p>
                <p className="text-sm text-gray-500">Heure du rendez-vous</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-500/10 backdrop-blur-12 border border-blue-200/30 rounded-2xl">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-base">
                  {selectedProfessional === 'any' ? 'Aucune préférence' : selectedProfessional}
                </p>
                <p className="text-sm text-gray-500">Professionnel(le)</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-green-500/10 backdrop-blur-12 border border-green-200/30 rounded-2xl">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-base">Salon Excellence Paris</p>
                <p className="text-sm text-gray-500">45 Avenue Victor Hugo, 75116 Paris</p>
              </div>
            </div>
          </div>
        </div>

        {/* Service et paiement - Design glassmorphism */}
        <div className="bg-white/70 backdrop-blur-16 border border-violet-100/30 rounded-3xl shadow-xl p-6 lg:p-8 mb-6">
          <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-6">
            Service réservé
          </h3>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-medium text-gray-900 text-base">Coupe Signature</p>
              <p className="text-sm text-gray-500">30 minutes</p>
            </div>
            <span className="text-xl font-bold text-violet-600">39,00 €</span>
          </div>
          
          <div className="bg-green-500/10 backdrop-blur-12 border border-green-200/40 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-green-800">Acompte payé</p>
                <p className="text-sm text-green-600">Le reste sera réglé sur place</p>
              </div>
              <span className="text-lg font-bold text-green-700">11,70 €</span>
            </div>
          </div>
        </div>

        {/* Informations importantes - Design glassmorphism */}
        <div className="bg-amber-500/10 backdrop-blur-16 border border-amber-200/40 rounded-3xl shadow-xl p-6 lg:p-8 mb-8">
          <h3 className="text-lg lg:text-xl font-semibold text-amber-800 mb-4">
            Informations importantes
          </h3>
          
          <ul className="space-y-3 text-sm text-amber-700">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              <span>Merci d'arriver 5 minutes avant votre rendez-vous</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              <span>En cas d'empêchement, prévenez au moins 24h à l'avance</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              <span>Votre confirmation a été envoyée par email</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              <span>Le solde de 27,30 € sera à régler sur place</span>
            </li>
          </ul>
        </div>

        {/* Actions - Boutons glass violet */}
        <div className="space-y-4">
          <Button
            onClick={handleBackToHome}
            className="w-full h-12 lg:h-14 bg-violet-600/90 hover:bg-violet-700/90 backdrop-blur-16 border border-violet-400/30 text-white font-semibold rounded-2xl shadow-xl transition-all duration-300"
          >
            Retour à l'accueil
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setLocation('/avyento-account')}
            className="w-full h-12 lg:h-14 bg-white/70 backdrop-blur-16 border border-violet-200/50 text-violet-600 hover:bg-violet-50/70 rounded-2xl shadow-xl font-semibold transition-all duration-300"
          >
            Voir mes rendez-vous
          </Button>
        </div>
      </div>

      {/* Navigation mobile */}
      <MobileBottomNav />
    </div>
  );
}