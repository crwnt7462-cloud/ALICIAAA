import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User, Euro, Phone, Mail } from "lucide-react";

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  salon: any;
  service: any;
  date: string;
  time: string;
  clientInfo: any;
  staff?: any;
}

export default function BookingConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  salon,
  service,
  date,
  time,
  clientInfo,
  staff
}: BookingConfirmationModalProps) {
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Confirmer votre réservation
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Vérifiez les détails de votre rendez-vous avant de confirmer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Salon */}
          {salon && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                {salon.photos && salon.photos[0] && (
                  <img 
                    src={salon.photos[0]} 
                    alt={salon.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{salon.name}</h3>
                  {salon.address && (
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {salon.address}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Service */}
          {service && (
            <div className="border-l-4 border-purple-500 pl-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-800">{service.name}</h4>
                  {service.description && (
                    <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                  )}
                </div>
                <Badge variant="secondary" className="ml-2">
                  <Euro className="w-3 h-3 mr-1" />
                  {service.price}
                </Badge>
              </div>
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                {service.duration} minutes
              </div>
            </div>
          )}

          {/* Date et heure */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-purple-600 mr-2" />
                <div>
                  <p className="font-medium text-gray-800">{formatDate(date)}</p>
                  <p className="text-sm text-gray-600">à {time}</p>
                </div>
              </div>
              {staff && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">Avec</p>
                  <p className="font-medium text-gray-800">{staff.name}</p>
                </div>
              )}
            </div>
          </div>

          {/* Informations client */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h5 className="font-medium text-gray-800 mb-3 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Vos informations
            </h5>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700">
                <strong>Nom :</strong> {clientInfo.firstName} {clientInfo.lastName}
              </p>
              <p className="text-gray-700 flex items-center">
                <Mail className="w-3 h-3 mr-1" />
                {clientInfo.email}
              </p>
              {clientInfo.phone && (
                <p className="text-gray-700 flex items-center">
                  <Phone className="w-3 h-3 mr-1" />
                  {clientInfo.phone}
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col space-y-2">
          <Button 
            onClick={onConfirm}
            className="w-full bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700"
          >
            Confirmer la réservation
          </Button>
          <Button 
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            Modifier
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}