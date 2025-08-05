import React, { useState, useEffect } from 'react';
import { X, CreditCard } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useQuery } from '@tanstack/react-query';

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
  userId?: string; // ID du propriétaire du salon
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

  // Récupérer les conditions personnalisées du salon
  const { data: businessSettings } = useQuery({
    queryKey: [`/api/business-settings/${salonInfo.userId}`],
    enabled: isOpen && !!salonInfo.userId,
    retry: false,
  });

  const finalPrice = bookingDetails.servicePrice - (bookingDetails.discount || 0);
  const depositAmount = bookingDetails.depositRequired || 0;

  // Utiliser les conditions personnalisées si disponibles, sinon utiliser les conditions par défaut
  const getPolicy = (type: 'cancellation' | 'late' | 'deposit' | 'modification') => {
    if (businessSettings?.settings) {
      switch (type) {
        case 'cancellation':
          return businessSettings.settings.cancellationPolicy || "Annulation gratuite 24h avant";
        case 'late':
          return businessSettings.settings.latePolicy || "Retard +15min = annulation";
        case 'deposit':
          return businessSettings.settings.depositPolicy || (depositAmount > 0 ? `Acompte ${depositAmount}€` : "");
        case 'modification':
          return businessSettings.settings.modificationPolicy || "Modification gratuite jusqu'à 24h avant";
        default:
          return '';
      }
    }
    // Fallback vers les politiques par défaut
    switch (type) {
      case 'cancellation':
        return salonInfo.policies?.cancellation || "Annulation gratuite 24h avant";
      case 'late':
        return salonInfo.policies?.lateness || "Retard +15min = annulation";
      case 'deposit':
        return salonInfo.policies?.deposit || (depositAmount > 0 ? `Acompte ${depositAmount}€` : "");
      case 'modification':
        return salonInfo.policies?.rescheduling || "Modification gratuite jusqu'à 24h avant";
      default:
        return '';
    }
  };

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
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
      {/* Modal compact fond blanc */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-xs w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            Confirmer réservation
          </h2>
          <button 
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Contenu compact */}
        <div className="p-3 space-y-2">
          {/* Service condensé */}
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <h3 className="text-sm font-bold text-gray-900 mb-1">
              {bookingDetails.serviceName}
            </h3>
            <div className="text-xs text-gray-600 space-y-0.5 mb-2">
              <p>{formatDateForDisplay()} à {bookingDetails.appointmentTime}</p>
              <p>avec {bookingDetails.staffName}</p>
            </div>
            <p className="text-xl font-bold text-gray-900">{bookingDetails.servicePrice}€</p>
            {depositAmount > 0 && (
              <p className="text-xs text-gray-600 mt-1">
                Acompte: {depositAmount}€
              </p>
            )}
          </div>

          {/* Salon */}
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="font-semibold text-gray-900 text-xs">{salonInfo.name}</p>
            <p className="text-xs text-gray-600">{salonInfo.address}</p>
          </div>

          {/* Conditions personnalisées dynamiques */}
          <div className="bg-amber-50 rounded-lg p-2">
            <p className="font-semibold text-gray-900 text-xs mb-1">Conditions du salon</p>
            <div className="text-xs text-gray-700 space-y-0.5">
              <p>• {getPolicy('cancellation')}</p>
              <p>• {getPolicy('late')}</p>
              {depositAmount > 0 && <p>• {getPolicy('deposit')}</p>}
              <p>• {getPolicy('modification')}</p>
            </div>
          </div>

          {/* Case à cocher */}
          <div className="flex items-start space-x-2 p-2">
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

          {/* Boutons compacts avec glass style */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 h-8 glass-button text-black rounded-lg text-xs font-medium hover:glass-effect transition-all"
            >
              Modifier
            </button>
            <button
              onClick={onConfirm}
              disabled={!acceptedPolicies || isLoading}
              className="flex-1 h-8 glass-button text-black rounded-lg text-xs font-medium hover:glass-effect transition-all flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <CreditCard className="h-3 w-3 mr-1" />
                  Confirmer
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}