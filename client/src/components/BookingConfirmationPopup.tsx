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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-2">
      {/* Modal compact qui tient dans l'écran */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full max-h-[95vh] overflow-y-auto">
        {/* Header compact */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-purple-50">
          <h2 className="text-lg font-semibold text-gray-900">
            Confirmer réservation
          </h2>
          <button 
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-700 rounded-full hover:bg-white/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Contenu condensé */}
        <div className="p-4 space-y-3">
          {/* Service + Détails en une seule card */}
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-4 text-center border border-violet-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {bookingDetails.serviceName}
            </h3>
            <div className="text-sm text-gray-700 space-y-1 mb-3">
              <p>{formatDateForDisplay()} à {bookingDetails.appointmentTime}</p>
              <p>avec {bookingDetails.staffName}</p>
            </div>
            <p className="text-2xl font-bold text-violet-700 mb-1">{bookingDetails.servicePrice}€</p>
            {depositAmount > 0 && (
              <p className="text-xs text-violet-600 bg-violet-100 rounded-full px-2 py-1 inline-block">
                Acompte: {depositAmount}€
              </p>
            )}
          </div>

          {/* Salon compact */}
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="font-bold text-gray-900 text-sm">{salonInfo.name}</p>
            <p className="text-xs text-gray-600">{salonInfo.address}</p>
          </div>

          {/* Conditions en liste compacte */}
          <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
            <p className="font-semibold text-gray-900 text-sm mb-2">Conditions importantes</p>
            <div className="text-xs text-gray-700 space-y-1">
              <p>• Annulation gratuite jusqu'à 24h avant</p>
              <p>• Retard +15min = annulation automatique</p>
              {depositAmount > 0 && <p>• Acompte {depositAmount}€ requis</p>}
            </div>
          </div>

          {/* Case à cocher compacte */}
          <div className="bg-blue-50 rounded-xl p-3">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="accept-policies"
                checked={acceptedPolicies}
                onCheckedChange={(checked) => setAcceptedPolicies(checked === true)}
                className="mt-0.5 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
              />
              <label
                htmlFor="accept-policies"
                className="text-xs text-gray-700 flex-1 cursor-pointer"
              >
                J'accepte les conditions et confirme ma réservation.
              </label>
            </div>
          </div>

          {/* Boutons compacts */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 h-10 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
            >
              Modifier
            </button>
            <button
              onClick={onConfirm}
              disabled={!acceptedPolicies || isLoading}
              className="flex-1 h-10 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-violet-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span className="text-xs">...</span>
                </div>
              ) : (
                <>
                  <CreditCard className="h-3 w-3 mr-1" />
                  <span className="text-xs">Confirmer</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}