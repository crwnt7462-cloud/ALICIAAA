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
      {/* Modal Shell Glassmorphism */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden border border-white/20">
        {/* Header glassmorphism */}
        <div className="px-6 py-5 border-b border-white/20">
          <h2 className="text-center text-xl font-semibold text-gray-900">
            Confirmation de réservation
          </h2>
        </div>

        {/* Contenu scrollable */}
        <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Récapitulatif principal */}
          <div className="bg-gray-50 rounded-xl p-5 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {bookingDetails.serviceName}
            </h3>
            <div className="space-y-1 text-gray-600 mb-4">
              <p className="text-base">{formatDateForDisplay()}</p>
              <p className="text-base">à {bookingDetails.appointmentTime}</p>
              <p className="text-sm">avec {bookingDetails.staffName}</p>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-2xl font-bold text-gray-900">{bookingDetails.servicePrice}€</p>
              {depositAmount > 0 && (
                <p className="text-sm text-gray-500 mt-1">Acompte requis: {depositAmount}€</p>
              )}
            </div>
          </div>

          {/* Salon */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-1">{salonInfo.name}</h4>
            <p className="text-sm text-gray-600">{salonInfo.address}</p>
          </div>

          {/* Conditions importantes */}
          <div className="bg-amber-50 rounded-xl p-4">
            <h5 className="font-medium text-gray-900 mb-2">Conditions importantes</h5>
            <div className="text-sm text-gray-700 space-y-1">
              <p>• Annulation gratuite jusqu'à 24h avant</p>
              <p>• Retard de +15min = annulation automatique</p>
              {depositAmount > 0 && <p>• Acompte de {depositAmount}€ requis pour confirmer</p>}
            </div>
          </div>

          {/* Case à cocher obligatoire */}
          <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-xl">
            <Checkbox
              id="accept-policies"
              checked={acceptedPolicies}
              onCheckedChange={setAcceptedPolicies}
              className="mt-0.5"
            />
            <label
              htmlFor="accept-policies"
              className="text-sm text-gray-700 leading-relaxed flex-1 cursor-pointer"
            >
              J'accepte les conditions du salon et confirme ma réservation. Je comprends que l'acompte sera débité immédiatement.
            </label>
          </div>
        </div>

        {/* Footer avec boutons glassmorphism */}
        <div className="flex gap-3 px-6 py-5 border-t border-white/20 bg-white/40 backdrop-blur-md">
          <button
            onClick={onClose}
            className="flex-1 h-12 bg-white/30 backdrop-blur-md border border-white/40 text-gray-700 hover:bg-white/50 transition-colors rounded-lg font-medium"
          >
            Modifier
          </button>
          <button
            onClick={onConfirm}
            disabled={!acceptedPolicies || isLoading}
            className="flex-1 h-12 bg-violet-600/90 backdrop-blur-md border border-violet-500/30 text-white hover:bg-violet-700/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg font-medium flex items-center justify-center"
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
  );
}