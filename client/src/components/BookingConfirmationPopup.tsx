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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      {/* Shell Modal comme connexion/paiement */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 overflow-hidden">
        {/* Barre de titre shell système */}
        <div className="h-8 bg-gray-100 rounded-t-2xl flex items-center justify-between px-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-xs text-gray-600 font-medium">Confirmation</span>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Contenu du shell */}
        <div className="bg-white p-6 text-center space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Date et heure comme dans l'image */}
          <div className="space-y-1">
            <p className="text-lg text-gray-700">{formatDateForDisplay()}</p>
            <p className="text-lg text-gray-700">à {bookingDetails.appointmentTime}</p>
            <p className="text-lg text-gray-700">avec {bookingDetails.staffName}</p>
          </div>

          {/* Prix principal exactement comme l'image */}
          <div className="py-6">
            <p className="text-5xl font-light text-gray-900">{bookingDetails.servicePrice}€</p>
            {depositAmount > 0 && (
              <p className="text-sm text-gray-600 mt-2">Acompte requis: {depositAmount}€</p>
            )}
          </div>

          {/* Nom du salon exactement comme l'image */}
          <div className="space-y-1">
            <h3 className="text-xl font-medium text-gray-900">{salonInfo.name}</h3>
            <p className="text-gray-600">{salonInfo.address}</p>
          </div>

          {/* Conditions importantes dans shell */}
          <div className="bg-yellow-50 rounded-lg p-4 text-left">
            <h4 className="font-semibold text-gray-900 mb-3">Conditions importantes</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p>• Annulation gratuite jusqu'à 24h avant</p>
              <p>• Retard de +15min = annulation automatique</p>
              {depositAmount > 0 && <p>• Acompte de {depositAmount}€ requis pour confirmer</p>}
            </div>
          </div>

          {/* Case à cocher dans shell */}
          <div className="flex items-start space-x-3 text-left">
            <Checkbox
              id="accept-policies"
              checked={acceptedPolicies}
              onCheckedChange={(checked) => setAcceptedPolicies(checked === true)}
              className="mt-1"
            />
            <label
              htmlFor="accept-policies"
              className="text-sm text-gray-700 leading-relaxed flex-1 cursor-pointer"
            >
              J'accepte les conditions du salon et confirme ma réservation. Je comprends que l'acompte sera débité immédiatement.
            </label>
          </div>

          {/* Bouton shell */}
          <button
            onClick={onConfirm}
            disabled={!acceptedPolicies || isLoading}
            className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
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