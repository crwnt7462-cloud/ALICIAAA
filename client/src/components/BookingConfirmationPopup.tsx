import React, { useState } from 'react';
import { X, Clock, MapPin, Phone, Mail, Star, CreditCard, Calendar, User, Euro } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface BookingDetails {
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  appointmentDate: string;
  appointmentTime: string;
  staffName?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  depositRequired?: number;
  isWeekendPremium?: boolean;
  promoCode?: string;
  discount?: number;
}

interface SalonInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
  policies: {
    cancellation: string;
    lateness: string;
    deposit: string;
    rescheduling: string;
  };
  openingHours: {
    [key: string]: string;
  };
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
  const [acceptedMarketing, setAcceptedMarketing] = useState(false);

  const finalPrice = bookingDetails.servicePrice - (bookingDetails.discount || 0);
  const depositAmount = bookingDetails.depositRequired || 0;
  const remainingAmount = finalPrice - depositAmount;

  // Correction du format de date pour éviter l'erreur "Invalid time value"
  const formatDateForDisplay = () => {
    try {
      if (bookingDetails.appointmentDate && bookingDetails.appointmentTime) {
        // Si la date est déjà au format français (ex: "lundi 28 juillet 2025")
        if (bookingDetails.appointmentDate.includes('juillet') || bookingDetails.appointmentDate.includes('janvier')) {
          return bookingDetails.appointmentDate;
        }
        // Sinon, essayer de parser la date
        const date = new Date(`${bookingDetails.appointmentDate}T${bookingDetails.appointmentTime}`);
        if (!isNaN(date.getTime())) {
          return format(date, 'EEEE dd MMMM yyyy', { locale: fr });
        }
      }
      return bookingDetails.appointmentDate || 'Date à définir';
    } catch (error) {
      return bookingDetails.appointmentDate || 'Date à définir';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-xl">
            <span>Confirmation de réservation</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Salon Info */}
          <div className="glass-card border-white/40 p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-black">{salonInfo.name}</h3>
                {salonInfo.rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{salonInfo.rating}</span>
                    <span className="text-xs text-gray-500">
                      ({salonInfo.reviewCount} avis)
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">{salonInfo.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">{salonInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">{salonInfo.email}</span>
              </div>
              {salonInfo.website && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">{salonInfo.website}</span>
                </div>
              )}
            </div>
          </div>

          {/* Booking Summary */}
          <div className="glass-card border-white/40 p-4">
            <h3 className="text-lg font-semibold text-black mb-4">Récapitulatif de votre réservation</h3>
            
            <div className="space-y-4">
              {/* Service */}
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{bookingDetails.serviceName}</h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{bookingDetails.serviceDuration} min</span>
                    </div>
                    {bookingDetails.staffName && (
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{bookingDetails.staffName}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {bookingDetails.servicePrice}€
                  </div>
                  {bookingDetails.isWeekendPremium && (
                    <Badge variant="secondary" className="text-xs">
                      Tarif weekend
                    </Badge>
                  )}
                </div>
              </div>

              <Separator />

              {/* Date & Time */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">
                    {formatDateForDisplay()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{bookingDetails.appointmentTime}</span>
                </div>
              </div>

              {/* Client Info */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Client</div>
                <div className="font-medium text-gray-900">{bookingDetails.clientName}</div>
                <div className="text-sm text-gray-600">{bookingDetails.clientEmail}</div>
                <div className="text-sm text-gray-600">{bookingDetails.clientPhone}</div>
              </div>

              {/* Pricing */}
              <div className="space-y-2">
                {bookingDetails.promoCode && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600">Code promo: {bookingDetails.promoCode}</span>
                    <span className="text-green-600">-{bookingDetails.discount}€</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex items-center justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{finalPrice}€</span>
                </div>

                {depositAmount > 0 && (
                  <>
                    <div className="flex items-center justify-between text-sm bg-violet-50 p-2 rounded">
                      <span className="flex items-center gap-1">
                        <CreditCard className="h-4 w-4" />
                        Acompte à régler maintenant
                      </span>
                      <span className="font-medium">{depositAmount}€</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Reste à payer sur place</span>
                      <span>{remainingAmount}€</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Salon Policies */}
          <div className="glass-card border-white/40 p-4">
            <h3 className="text-lg font-semibold text-black mb-4">Conditions du salon</h3>
            
            <div className="space-y-3 text-sm">
              <div>
                <div className="font-medium text-gray-900 mb-1">Annulation</div>
                <div className="text-gray-600">{salonInfo.policies.cancellation}</div>
              </div>
              
              <div>
                <div className="font-medium text-gray-900 mb-1">Retard</div>
                <div className="text-gray-600">{salonInfo.policies.lateness}</div>
              </div>
              
              {depositAmount > 0 && (
                <div>
                  <div className="font-medium text-gray-900 mb-1">Acompte</div>
                  <div className="text-gray-600">{salonInfo.policies.deposit}</div>
                </div>
              )}
              
              <div>
                <div className="font-medium text-gray-900 mb-1">Report de rendez-vous</div>
                <div className="text-gray-600">{salonInfo.policies.rescheduling}</div>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="glass-card border-white/40 p-4">
            <h3 className="text-lg font-semibold text-black mb-4">Horaires d'ouverture</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(salonInfo.openingHours).map(([day, hours]) => (
                <div key={day} className="flex justify-between">
                  <span className="text-gray-600">{day}</span>
                  <span className="font-medium text-gray-900">{hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Acceptance Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="accept-policies"
                checked={acceptedPolicies}
                onCheckedChange={setAcceptedPolicies}
              />
              <label
                htmlFor="accept-policies"
                className="text-sm text-gray-700 leading-relaxed"
              >
                J'ai lu et j'accepte les conditions générales du salon, notamment les politiques d'annulation et de retard.
              </label>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox
                id="accept-marketing"
                checked={acceptedMarketing}
                onCheckedChange={setAcceptedMarketing}
              />
              <label
                htmlFor="accept-marketing"
                className="text-sm text-gray-700 leading-relaxed"
              >
                J'accepte de recevoir des communications marketing de ce salon (optionnel).
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 glass-button hover:glass-effect text-black"
            >
              Modifier
            </Button>
            <Button
              onClick={onConfirm}
              disabled={!acceptedPolicies || isLoading}
              className="flex-1 glass-button hover:glass-effect text-white bg-violet-600 hover:bg-violet-700"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Confirmation...
                </div>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Confirmer et payer {depositAmount > 0 ? `${depositAmount}€` : `${finalPrice}€`}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}