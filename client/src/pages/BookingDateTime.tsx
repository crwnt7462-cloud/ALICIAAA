import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface DaySchedule {
  date: string;
  dayName: string;
  expanded: boolean;
  slots: TimeSlot[];
}

export default function BookingDateTime() {
  const [, setLocation] = useLocation();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<DaySchedule[]>([
    {
      date: "Samedi 16 août",
      dayName: "Samedi",
      expanded: true,
      slots: [
        { time: "09:00", available: true },
        { time: "09:30", available: true },
        { time: "12:30", available: true },
        { time: "13:00", available: true },
        { time: "17:30", available: true },
        { time: "18:00", available: true },
        { time: "18:30", available: true }
      ]
    },
    {
      date: "Dimanche 17 août",
      dayName: "Dimanche",
      expanded: false,
      slots: [
        { time: "10:00", available: true },
        { time: "10:30", available: true },
        { time: "14:00", available: true },
        { time: "14:30", available: true },
        { time: "16:00", available: true }
      ]
    },
    {
      date: "Lundi 18 août",
      dayName: "Lundi",
      expanded: false,
      slots: [
        { time: "09:00", available: true },
        { time: "11:00", available: true },
        { time: "15:00", available: true },
        { time: "16:30", available: true }
      ]
    },
    {
      date: "Mardi 19 août",
      dayName: "Mardi",
      expanded: false,
      slots: [
        { time: "08:30", available: true },
        { time: "10:00", available: true },
        { time: "13:30", available: true },
        { time: "17:00", available: true }
      ]
    },
    {
      date: "Mercredi 20 août",
      dayName: "Mercredi",
      expanded: false,
      slots: [
        { time: "09:30", available: true },
        { time: "11:30", available: true },
        { time: "14:00", available: true },
        { time: "16:00", available: true }
      ]
    },
    {
      date: "Jeudi 21 août",
      dayName: "Jeudi",
      expanded: false,
      slots: [
        { time: "10:00", available: true },
        { time: "12:00", available: true },
        { time: "15:30", available: true },
        { time: "18:00", available: true }
      ]
    },
    {
      date: "Vendredi 22 août",
      dayName: "Vendredi",
      expanded: false,
      slots: [
        { time: "09:00", available: true },
        { time: "11:00", available: true },
        { time: "14:30", available: true },
        { time: "17:30", available: true }
      ]
    }
  ]);

  const toggleDay = (index: number) => {
    setSchedule(prev => prev.map((day, i) => 
      i === index ? { ...day, expanded: !day.expanded } : day
    ));
  };

  const selectTimeSlot = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      // Stocker la sélection et passer à l'inscription
      localStorage.setItem('selectedDateTime', JSON.stringify({
        date: selectedDate,
        time: selectedTime
      }));
      setLocation('/avyento-style-booking-fixed');
    }
  };

  const handleBack = () => {
    setLocation('/professional-selection');
  };

  const handleAddService = () => {
    // Retourner à la sélection de services pour ajouter une prestation
    setLocation('/salon');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <img 
              src="/avyento-logo.png" 
              alt="Avyento"
              className="w-auto"
              style={{ height: '115px' }}
            />
            <div className="w-10" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 lg:px-8">
        {/* Récapitulatif de réservation - style salon glassmorphism */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200/50 shadow-sm p-4 lg:p-6 mx-4 lg:mx-0 mt-6 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Coupe Bonhomme</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Durée :</span>
              <span className="font-medium">30 min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Prix :</span>
              <span className="font-medium">39,00 €</span>
            </div>
            {selectedDate && selectedTime && (
              <div className="pt-2 border-t border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date :</span>
                  <span className="font-medium">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Heure :</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bouton "Ajouter une prestation" avec même style que "Continuer" */}
        <div className="px-4 lg:px-0 pb-2">
          <Button 
            onClick={handleAddService}
            className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-semibold"
          >
            Ajouter une prestation à la suite
          </Button>
        </div>

        {/* Étape */}
        <div className="px-4 mb-4">
          <div className="text-sm text-violet-600 font-medium mb-1">2. Choix de la date & heure</div>
        </div>

        {/* Planning par jour - responsive */}
        <div className="space-y-1 mx-4 lg:mx-0">
          {schedule.map((day, index) => (
            <div key={day.date} className="bg-white/95 backdrop-blur-md rounded-xl border border-gray-200/50 shadow-sm overflow-hidden">
              {/* En-tête du jour */}
              <button
                onClick={() => toggleDay(index)}
                className="w-full px-4 lg:px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
              >
                <span className="font-medium text-gray-900">{day.date}</span>
                {day.expanded ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>

              {/* Créneaux horaires - responsive grid */}
              {day.expanded && (
                <div className="px-4 lg:px-6 pb-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-3">
                    {day.slots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => selectTimeSlot(day.date, slot.time)}
                        disabled={!slot.available}
                        className={`h-10 lg:h-12 rounded-xl border text-sm font-medium transition-all ${
                          selectedDate === day.date && selectedTime === slot.time
                            ? 'bg-violet-600 text-white border-violet-600 shadow-lg'
                            : slot.available
                            ? 'bg-gray-50 text-gray-900 border-gray-200 hover:bg-gray-100 hover:border-violet-300'
                            : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer avec bouton Continuer - responsive */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-gray-200/50 p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
            <Button
              onClick={handleContinue}
              disabled={!selectedDate || !selectedTime}
              className="w-full h-12 lg:h-14 bg-violet-600 hover:bg-violet-700 text-white font-semibold disabled:bg-gray-300 rounded-xl text-base lg:text-lg"
            >
              Continuer
            </Button>
          </div>
        </div>

        {/* Footer Avyento */}
        <div className="text-center py-4 text-xs text-gray-500">
          avyento.com
        </div>
      </div>
    </div>
  );
}