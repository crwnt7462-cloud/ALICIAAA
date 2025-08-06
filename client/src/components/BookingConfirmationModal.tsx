import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookingData: {
    serviceName: string;
    servicePrice: number;
    date: string;
    time: string;
    professionalName: string;
    salonName: string;
    salonLocation: string;
    salonPolicies: {
      cancellation: string;
      lateness: string;
      deposit: string;
      modification: string;
    };
  };
}

export default function BookingConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  bookingData
}: BookingConfirmationModalProps) {
  const [acceptConditions, setAcceptConditions] = useState(false);

  if (!isOpen) return null;

  const depositAmount = Math.round(bookingData.servicePrice * 0.5);

  const handleConfirm = () => {
    if (!acceptConditions) return;
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4">
        <div 
          className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4">
            <h2 className="text-xl font-semibold text-gray-900">Confirmer réservation</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 rounded-full hover:bg-gray-100/50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 space-y-4">
            {/* Service Info */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {bookingData.serviceName}
              </h3>
              <p className="text-gray-600 text-sm mb-1">
                {bookingData.date} à {bookingData.time}
              </p>
              <p className="text-gray-600 text-sm mb-6">
                avec {bookingData.professionalName}
              </p>
              
              <div className="text-center mb-2">
                <span className="text-4xl font-bold text-gray-900">
                  {bookingData.servicePrice}€
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Acompte: {depositAmount}€
              </p>
            </div>

            {/* Salon Info */}
            <div className="text-center bg-gray-50/50 rounded-lg p-3 mb-4">
              <h4 className="font-semibold text-gray-900 text-base">
                {bookingData.salonName}
              </h4>
              <p className="text-sm text-gray-600">
                {bookingData.salonLocation}
              </p>
            </div>

            {/* Conditions */}
            <div className="bg-amber-50/80 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">
                Conditions du salon
              </h4>
              <div className="space-y-1 text-xs text-gray-700">
                <p>• {bookingData.salonPolicies.cancellation}</p>
                <p>• {bookingData.salonPolicies.lateness}</p>
                <p>• {bookingData.salonPolicies.deposit}</p>
                <p>• {bookingData.salonPolicies.modification}</p>
              </div>
            </div>

            {/* Acceptance Checkbox */}
            <div className="flex items-start space-x-3 mb-6">
              <Checkbox
                id="accept-conditions"
                checked={acceptConditions}
                onCheckedChange={(checked) => setAcceptConditions(checked as boolean)}
                className="mt-1"
              />
              <label 
                htmlFor="accept-conditions"
                className="text-sm text-gray-700 leading-5 cursor-pointer"
              >
                J'accepte les conditions et confirme ma réservation.
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 glass-button hover:glass-effect text-gray-700 py-3"
              >
                Modifier
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!acceptConditions}
                className={`flex-1 font-semibold py-3 ${
                  acceptConditions 
                    ? 'glass-button hover:glass-effect text-black' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Confirmer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}