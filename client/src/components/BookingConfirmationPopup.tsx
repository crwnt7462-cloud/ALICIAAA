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
    <div className="fixed inset-0 bg-gradient-to-br from-violet-900/30 via-purple-900/20 to-indigo-900/30 backdrop-blur-md z-[9999] flex items-center justify-center p-2">
      {/* Modal glassmorphism violet */}
      <div className="bg-white/20 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-2xl max-w-sm w-full max-h-[95vh] overflow-y-auto">
        {/* Header glassmorphism */}
        <div className="flex items-center justify-between p-4 border-b border-white/20 bg-white/10 backdrop-blur-xl rounded-t-3xl">
          <h2 className="text-lg font-semibold text-white drop-shadow-lg">
            Confirmer réservation
          </h2>
          <button 
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-white/80 hover:text-white rounded-full hover:bg-white/20 backdrop-blur-sm transition-all"
          >
            <X className="w-4 h-4 drop-shadow" />
          </button>
        </div>
        
        {/* Contenu glassmorphism */}
        <div className="p-4 space-y-3">
          {/* Service - Card glassmorphism violette */}
          <div className="bg-white/25 backdrop-blur-xl border border-white/30 rounded-2xl p-4 text-center shadow-lg">
            <h3 className="text-lg font-bold text-white mb-2 drop-shadow-lg">
              {bookingDetails.serviceName}
            </h3>
            <div className="text-sm text-white/90 space-y-1 mb-3 drop-shadow">
              <p>{formatDateForDisplay()} à {bookingDetails.appointmentTime}</p>
              <p>avec {bookingDetails.staffName}</p>
            </div>
            <p className="text-2xl font-bold text-white mb-1 drop-shadow-lg">{bookingDetails.servicePrice}€</p>
            {depositAmount > 0 && (
              <p className="text-xs text-violet-200 bg-violet-500/30 backdrop-blur-sm rounded-full px-3 py-1 inline-block border border-violet-300/30">
                Acompte: {depositAmount}€
              </p>
            )}
          </div>

          {/* Salon glassmorphism */}
          <div className="bg-white/20 backdrop-blur-xl border border-white/25 rounded-xl p-3 text-center shadow-lg">
            <p className="font-bold text-white text-sm drop-shadow">{salonInfo.name}</p>
            <p className="text-xs text-white/80 drop-shadow">{salonInfo.address}</p>
          </div>

          {/* Conditions glassmorphism */}
          <div className="bg-amber-500/20 backdrop-blur-xl border border-amber-300/30 rounded-xl p-3 shadow-lg">
            <p className="font-semibold text-white text-sm mb-2 drop-shadow">Conditions importantes</p>
            <div className="text-xs text-white/90 space-y-1 drop-shadow">
              <p>• Annulation gratuite jusqu'à 24h avant</p>
              <p>• Retard +15min = annulation automatique</p>
              {depositAmount > 0 && <p>• Acompte {depositAmount}€ requis</p>}
            </div>
          </div>

          {/* Case à cocher glassmorphism */}
          <div className="bg-blue-500/20 backdrop-blur-xl border border-blue-300/30 rounded-xl p-3 shadow-lg">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="accept-policies"
                checked={acceptedPolicies}
                onCheckedChange={(checked) => setAcceptedPolicies(checked === true)}
                className="mt-0.5 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 border-white/50 bg-white/20"
              />
              <label
                htmlFor="accept-policies"
                className="text-xs text-white/90 flex-1 cursor-pointer drop-shadow"
              >
                J'accepte les conditions et confirme ma réservation.
              </label>
            </div>
          </div>

          {/* Boutons glassmorphism */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 h-10 bg-white/20 backdrop-blur-xl border border-white/30 text-white rounded-xl text-sm font-medium hover:bg-white/30 transition-all shadow-lg drop-shadow"
            >
              Modifier
            </button>
            <button
              onClick={onConfirm}
              disabled={!acceptedPolicies || isLoading}
              className="flex-1 h-10 bg-gradient-to-r from-violet-600/80 to-purple-600/80 backdrop-blur-xl border border-violet-400/50 text-white rounded-xl text-sm font-medium hover:from-violet-700/90 hover:to-purple-700/90 disabled:from-gray-500/50 disabled:to-gray-600/50 disabled:border-gray-400/30 flex items-center justify-center shadow-lg transition-all"
            >
              {isLoading ? (
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span className="text-xs drop-shadow">...</span>
                </div>
              ) : (
                <>
                  <CreditCard className="h-3 w-3 mr-1 drop-shadow" />
                  <span className="text-xs drop-shadow">Confirmer</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}