import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Globe, Mic, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Booking() {
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const { data: services = [] } = useQuery({
    queryKey: ["/api/services"],
  });

  const { data: waitingList = [] } = useQuery({
    queryKey: ["/api/waiting-list"],
  });

  // Generate available time slots (mock data for demo)
  const timeSlots = ["09:00", "10:30", "14:00", "15:30", "16:00", "17:00"];
  const availableSlots = ["09:00", "10:30", "14:00", "15:30", "17:00"];

  const handleVoiceBooking = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // Implementation would go here
      alert("Fonctionnalité de réservation vocale en développement");
    } else {
      alert("Votre navigateur ne supporte pas la reconnaissance vocale");
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">Réservations en ligne</h2>

      {/* Booking Widget Preview */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4 flex items-center">
            <Globe className="text-primary w-4 h-4 mr-2" />
            Widget de réservation
          </h3>

          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium mb-2">Service</Label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service: any) => (
                    <SelectItem key={service.id} value={service.id.toString()}>
                      {service.name} ({service.duration}min - {service.price}€)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block text-sm font-medium mb-2">Date souhaitée</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Available Time Slots */}
            <div>
              <Label className="block text-sm font-medium mb-2">Créneaux disponibles</Label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    className={`py-2 px-3 text-sm rounded-lg transition-colors ${
                      !availableSlots.includes(time)
                        ? "opacity-50 cursor-not-allowed"
                        : selectedTime === time
                        ? "bg-primary text-white"
                        : "border border-gray-200 dark:border-gray-600 hover:border-primary hover:text-primary"
                    }`}
                    disabled={!availableSlots.includes(time)}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Voice Booking */}
          <Card className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Mic className="text-white w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">
                    Réservation vocale
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Dites "Je voudrais réserver un RDV"
                  </p>
                </div>
                <Button
                  onClick={handleVoiceBooking}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Waiting List */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4 flex items-center">
            <Clock className="text-orange-500 w-4 h-4 mr-2" />
            Liste d'attente intelligente
            <span className="ml-2 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs px-2 py-1 rounded-full">
              {waitingList.length}
            </span>
          </h3>

          <div className="space-y-3">
            {waitingList.map((item: any, index: number) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-800 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 dark:text-orange-400 text-sm font-medium">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">
                      {item.client
                        ? `${item.client.firstName} ${item.client.lastName}`
                        : "Client inconnu"
                      }
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.service?.name || "Service non spécifié"} • 
                      {item.isFlexible ? " Flexible sur les horaires" : " Horaires spécifiques"}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="bg-primary text-white px-3 py-1 rounded-lg text-sm"
                >
                  Notifier
                </Button>
              </div>
            ))}
            
            {waitingList.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucun client en liste d'attente</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
