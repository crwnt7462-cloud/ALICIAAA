import React, { useState } from 'react';
import { X, CreditCard } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface BookingDetails {
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  appointmentDate: string;
  appointmentTime: string;
  staffName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  depositRequired: number;
  isWeekendPremium?: boolean;
  discount?: number;
}

interface SalonInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  rating?: number;
  reviewCount?: number;
  website?: string;
  policies: {
    cancellation: string;
    lateness: string;
    deposit: string;
    rescheduling: string;
  };
  openingHours: Record<string, string>;
}

interface BookingConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookingDetails: BookingDetails;
  salonInfo: SalonInfo;
  isLoading?: boolean;
}

export default function BookingConfirmationPopup({
  isOpen,
  onClose,
  onConfirm,
  bookingDetails,
  salonInfo,
  isLoading = false
}: BookingConfirmationPopupProps) {
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);

  const finalPrice = bookingDetails.servicePrice - (bookingDetails.discount || 0);
  const depositAmount = bookingDetails.depositRequired || 0;

  // Fonction de formatage date sécurisée
  const formatDateForDisplay = () => {
    try {
      if (bookingDetails.appointmentDate && bookingDetails.appointmentTime) {
        // Si la date est déjà au format français
        if (bookingDetails.appointmentDate.includes('juillet') || bookingDetails.appointmentDate.includes('janvier')) {
          return bookingDetails.appointmentDate;
        }
        return bookingDetails.appointmentDate;
      }
      return bookingDetails.appointmentDate || 'Date à définir';
    } catch (error) {
      return bookingDetails.appointmentDate || 'Date à définir';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      {/* Modal élégant et complet */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full relative overflow-hidden">
        {/* Header avec titre et X */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-purple-50">
          <h2 className="text-xl font-semibold text-gray-900">
            Confirmer votre réservation
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 rounded-full hover:bg-white/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Contenu principal */}
        <div className="p-6 space-y-5">
          {/* Détails service - Card principale */}
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 text-center border border-violet-100">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {bookingDetails.serviceName}
            </h3>
            <div className="space-y-2 text-gray-700 mb-4">
              <p className="text-lg font-medium">{formatDateForDisplay()}</p>
              <p className="text-lg">à {bookingDetails.appointmentTime}</p>
              <p className="text-base text-gray-600">avec {bookingDetails.staffName}</p>
            </div>
            <div className="border-t border-violet-200 pt-4">
              <p className="text-4xl font-bold text-violet-700 mb-2">{bookingDetails.servicePrice}€</p>
              {depositAmount > 0 && (
                <p className="text-sm text-violet-600 bg-violet-100 rounded-full px-3 py-1 inline-block">
                  Acompte requis: {depositAmount}€
                </p>
              )}
            </div>
          </div>

          {/* Salon - Card secondaire */}
          <div className="bg-gray-50 rounded-xl p-5 text-center border border-gray-200">
            <h4 className="font-bold text-gray-900 text-lg mb-1">{salonInfo.name}</h4>
            <p className="text-gray-600">{salonInfo.address}</p>
          </div>

          {/* Conditions importantes - Bien visible */}
          <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
            <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
              <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
              Conditions importantes
            </h5>
            <div className="text-sm text-gray-700 space-y-2">
              <p className="flex items-start">
                <span className="text-amber-600 mr-2">•</span>
                Annulation gratuite jusqu'à 24h avant
              </p>
              <p className="flex items-start">
                <span className="text-amber-600 mr-2">•</span>
                Retard de +15min = annulation automatique
              </p>
              {depositAmount > 0 && (
                <p className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  Acompte de {depositAmount}€ requis pour confirmer
                </p>
              )}
            </div>
          </div>

          {/* Case à cocher - Mise en évidence */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="accept-policies"
                checked={acceptedPolicies}
                onCheckedChange={(checked) => setAcceptedPolicies(checked === true)}
                className="mt-1 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
              />
              <label
                htmlFor="accept-policies"
                className="text-sm text-gray-700 leading-relaxed flex-1 cursor-pointer font-medium"
              >
                J'accepte les conditions du salon et confirme ma réservation. Je comprends que l'acompte sera débité immédiatement.
              </label>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 h-12 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 border border-gray-200"
            >
              Modifier
            </button>
            <button
              onClick={onConfirm}
              disabled={!acceptedPolicies || isLoading}
              className="flex-1 h-12 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all duration-200 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Traitement...
                </div>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Confirmer et payer
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}