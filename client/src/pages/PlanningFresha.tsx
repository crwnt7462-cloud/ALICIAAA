import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus, MoreHorizontal, X, User, Phone, Mail, Clock, Calendar } from "lucide-react";
import avyentoProLogo from "@assets/Logo avyento pro._1755451965339.png";

// Interface Employee conservée pour compatibilité future

type Appointment = {
  id: string;
  employeeId: string;
  title: string;
  client: string;
  email?: string;
  startTime: string;
  endTime: string;
  day: number; // 0-6 (dimanche à samedi)
  color: string;
  status: 'confirmed' | 'pending';
  price: number;
  duration: string;
  employee: string;
  paymentStatus: 'à encaisser' | 'acompte réglé' | 'payé';
};

const appointments: Appointment[] = [
  // Lundi (jour 1) - Coupe et Coloration
  {
    id: '1',
    employeeId: '1',
    title: 'Coupe + Coloration',
    client: 'Sophie Martin',
    email: 'sophie.martin@gmail.com',
    startTime: '09:00',
    endTime: '11:30',
    day: 1,
    color: '#EC4899',
    status: 'confirmed',
    price: 125,
    duration: '2h 30',
    employee: 'Alicia',
    paymentStatus: 'acompte réglé'
  },
  {
    id: '2',
    employeeId: '1',
    title: 'Brushing',
    client: 'Marie Dubois',
    email: 'marie.dubois@yahoo.fr',
    startTime: '12:00',
    endTime: '12:45',
    day: 1,
    color: '#8B5CF6',
    status: 'confirmed',
    price: 35,
    duration: '45 min',
    employee: 'Alicia',
    paymentStatus: 'payé'
  },
  {
    id: '3',
    employeeId: '1',
    title: 'Coupe Homme',
    client: 'Pierre Laurent',
    email: 'p.laurent@hotmail.com',
    startTime: '14:00',
    endTime: '14:30',
    day: 1,
    color: '#06B6D4',
    status: 'confirmed',
    price: 28,
    duration: '30 min',
    employee: 'Alicia',
    paymentStatus: 'à encaisser'
  },
  {
    id: '4',
    employeeId: '1',
    title: 'Soin Capillaire',
    client: 'Emma Roussel',
    email: 'emma.roussel@orange.fr',
    startTime: '15:30',
    endTime: '16:30',
    day: 1,
    color: '#10B981',
    status: 'confirmed',
    price: 55,
    duration: '1h',
    employee: 'Alicia',
    paymentStatus: 'payé'
  },
  // Mardi (jour 2) - Planning chargé
  {
    id: '5',
    employeeId: '1',
    title: 'Balayage',
    client: 'Julie Bernard',
    email: 'julie.bernard@gmail.com',
    startTime: '09:00',
    endTime: '12:00',
    day: 2,
    color: '#F59E0B',
    status: 'confirmed',
    price: 180,
    duration: '3h',
    employee: 'Alicia',
    paymentStatus: 'acompte réglé'
  },
  {
    id: '6',
    employeeId: '1',
    title: 'Coupe Enfant',
    client: 'Lucas Petit',
    email: 'parent.petit@free.fr',
    startTime: '13:30',
    endTime: '14:00',
    day: 2,
    color: '#EF4444',
    status: 'confirmed',
    price: 20,
    duration: '30 min',
    employee: 'Alicia',
    paymentStatus: 'payé'
  },
  {
    id: '7',
    employeeId: '1',
    title: 'Lissage',
    client: 'Camille Blanc',
    email: 'c.blanc@gmail.com',
    startTime: '14:30',
    endTime: '16:30',
    day: 2,
    color: '#8B5CF6',
    status: 'confirmed',
    price: 90,
    duration: '2h',
    employee: 'Alicia',
    paymentStatus: 'payé'
  },
  // Mercredi (jour 3) - Planning modéré
  {
    id: '8',
    employeeId: '1',
    title: 'Permanente',
    client: 'Nina Roux',
    email: 'nina.roux@yahoo.fr',
    startTime: '10:00',
    endTime: '13:00',
    day: 3,
    color: '#06B6D4',
    status: 'confirmed',
    price: 110,
    duration: '3h',
    employee: 'Alicia',
    paymentStatus: 'acompte réglé'
  },
  {
    id: '9',
    employeeId: '1',
    title: 'Coupe Femme',
    client: 'Sarah Dubois',
    email: 's.dubois@outlook.com',
    startTime: '15:00',
    endTime: '16:00',
    day: 3,
    color: '#EC4899',
    status: 'confirmed',
    price: 45,
    duration: '1h',
    employee: 'Alicia',
    paymentStatus: 'payé'
  },
  // Jeudi (jour 4) - Journée légère
  {
    id: '10',
    employeeId: '1',
    title: 'Consultation',
    client: 'Amélie Moreau',
    email: 'amelie.moreau@free.fr',
    startTime: '10:30',
    endTime: '11:00',
    day: 4,
    color: '#10B981',
    status: 'pending',
    price: 15,
    duration: '30 min',
    employee: 'Alicia',
    paymentStatus: 'à encaisser'
  },
  {
    id: '11',
    employeeId: '1',
    title: 'Mèches',
    client: 'Léa Garcia',
    email: 'lea.garcia@sfr.fr',
    startTime: '14:00',
    endTime: '16:00',
    day: 4,
    color: '#F59E0B',
    status: 'confirmed',
    price: 85,
    duration: '2h',
    employee: 'Alicia',
    paymentStatus: 'acompte réglé'
  },
  // Vendredi (jour 5) - Journée complète
  {
    id: '12',
    employeeId: '1',
    title: 'Coupe + Couleur',
    client: 'Isabelle Martin',
    email: 'i.martin@laposte.net',
    startTime: '09:30',
    endTime: '12:30',
    day: 5,
    color: '#EC4899',
    status: 'confirmed',
    price: 95,
    duration: '3h',
    employee: 'Alicia',
    paymentStatus: 'acompte réglé'
  },
  {
    id: '13',
    employeeId: '1',
    title: 'Brushing',
    client: 'Céline Laurent',
    email: 'celine.laurent@orange.fr',
    startTime: '13:30',
    endTime: '14:15',
    day: 5,
    color: '#8B5CF6',
    status: 'confirmed',
    price: 35,
    duration: '45 min',
    employee: 'Alicia',
    paymentStatus: 'payé'
  },
  {
    id: '14',
    employeeId: '1',
    title: 'Coupe Homme',
    client: 'Thomas Dupont',
    email: 't.dupont@hotmail.com',
    startTime: '15:00',
    endTime: '15:30',
    day: 5,
    color: '#06B6D4',
    status: 'confirmed',
    price: 28,
    duration: '30 min',
    employee: 'Alicia',
    paymentStatus: 'à encaisser'
  },
  {
    id: '15',
    employeeId: '1',
    title: 'Soin Profond',
    client: 'Manon Petit',
    email: 'manon.petit@wanadoo.fr',
    startTime: '16:00',
    endTime: '17:00',
    day: 5,
    color: '#10B981',
    status: 'confirmed',
    price: 60,
    duration: '1h',
    employee: 'Alicia',
    paymentStatus: 'payé'
  },
  // Samedi (jour 6) - Week-end actif
  {
    id: '16',
    employeeId: '1',
    title: 'Balayage',
    client: 'Clara Roussel',
    email: 'clara.roussel@gmail.com',
    startTime: '09:00',
    endTime: '11:30',
    day: 6,
    color: '#F59E0B',
    status: 'confirmed',
    price: 140,
    duration: '2h30',
    employee: 'Alicia',
    paymentStatus: 'acompte réglé'
  },
  {
    id: '17',
    employeeId: '1',
    title: 'Coupe + Styling',
    client: 'Océane Bernard',
    email: 'oceane.bernard@sfr.fr',
    startTime: '12:30',
    endTime: '14:00',
    day: 6,
    color: '#EC4899',
    status: 'confirmed',
    price: 65,
    duration: '1h30',
    employee: 'Alicia',
    paymentStatus: 'payé'
  },
  {
    id: '18',
    employeeId: '1',
    title: 'Coupe Enfant',
    client: 'Hugo Blanc',
    email: 'parent.blanc@orange.fr',
    startTime: '14:30',
    endTime: '15:00',
    day: 6,
    color: '#EF4444',
    status: 'confirmed',
    price: 20,
    duration: '30 min',
    employee: 'Alicia',
    paymentStatus: 'à encaisser'
  },
  // Dimanche (jour 0) - Fermé
  {
    id: '19',
    employeeId: '1',
    title: 'FERMÉ',
    client: '',
    email: '',
    startTime: '09:00',
    endTime: '19:00',
    day: 0,
    color: '#9CA3AF',
    status: 'confirmed',
    price: 0,
    duration: '10h',
    employee: 'Alicia',
    paymentStatus: 'payé'
  }
];

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];

const weekDays = [
  { short: 'lundi', full: 'lundi', index: 1 },
  { short: 'mardi', full: 'mardi', index: 2 },
  { short: 'mercredi', full: 'mercredi', index: 3 },
  { short: 'jeudi', full: 'jeudi', index: 4 },
  { short: 'vendredi', full: 'vendredi', index: 5 },
  { short: 'samedi', full: 'samedi', index: 6 },
  { short: 'dimanche', full: 'dimanche', index: 0 }
];

export default function PlanningFresha() {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<{ day: number; hour: string; appointment?: Appointment } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredAppointment, setHoveredAppointment] = useState<{ id: string; x: number; y: number } | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  // Calcul des dates de la semaine courante
  const currentWeek = useMemo(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1 + (currentWeekOffset * 7)); // Commence lundi
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  }, [currentWeekOffset]);

  const navigate = (direction: 'prev' | 'next') => {
    setCurrentWeekOffset(prev => direction === 'next' ? prev + 1 : prev - 1);
  };

  const goToToday = () => {
    setCurrentWeekOffset(0);
  };

  // Fonction pour gérer le clic sur un créneau
  const handleSlotClick = (day: number, hour: string, appointment?: Appointment) => {
    setSelectedSlot({ day, hour, appointment });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  // Fonctions pour gérer les actions des boutons
  const handleCallClient = () => {
    if (selectedSlot?.appointment?.client) {
      alert(`Appeler ${selectedSlot.appointment.client}`);
      // Ici vous pouvez intégrer avec un service de téléphonie
    }
  };

  const handleMessageClient = () => {
    if (selectedSlot?.appointment?.client) {
      alert(`Envoyer un message à ${selectedSlot.appointment.client}`);
      // Ici vous pouvez ouvrir l'interface de messagerie
    }
  };

  const handleModifyAppointment = () => {
    alert('Ouverture de l\'interface de modification...');
    // Ici vous pouvez ouvrir un formulaire de modification
    closeModal();
  };

  const handleCancelAppointment = () => {
    if (selectedSlot?.appointment) {
      const confirmed = confirm(`Êtes-vous sûr de vouloir annuler le rendez-vous avec ${selectedSlot.appointment.client} ?`);
      if (confirmed) {
        alert('Rendez-vous annulé avec succès');
        closeModal();
      }
    }
  };

  const handleNewAppointment = () => {
    alert('Ouverture du formulaire de nouveau rendez-vous...');
    // Ici vous pouvez ouvrir un formulaire de création
    closeModal();
  };

  const handleBlockSlot = () => {
    if (selectedSlot) {
      alert(`Créneau du ${weekDays.find(d => d.index === selectedSlot.day)?.full} à ${selectedSlot.hour} bloqué`);
      closeModal();
    }
  };

  const handleSearchClient = () => {
    alert('Ouverture de la recherche client...');
    // Ici vous pouvez ouvrir l'interface de recherche de clients
    closeModal();
  };

  // Gestionnaires pour le tooltip au survol
  const handleMouseEnter = (appointmentId: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Largeur responsive du tooltip
    const tooltipWidth = Math.min(288, viewportWidth - 20); // w-72 ou largeur écran - 20px
    
    // Positionner à gauche par défaut
    let x = rect.left - tooltipWidth - 10;
    let y = rect.top;
    
    // Si le tooltip sortirait à gauche de l'écran, le positionner à droite
    if (x < 10) {
      x = rect.right + 10;
      
      // Si même à droite il sort de l'écran, le centrer
      if (x + tooltipWidth > viewportWidth - 10) {
        x = Math.max(10, (viewportWidth - tooltipWidth) / 2);
      }
    }
    
    // Ajuster verticalement si le tooltip sortirait de l'écran
    const estimatedTooltipHeight = 200;
    if (y + estimatedTooltipHeight > viewportHeight - 10) {
      y = Math.max(10, viewportHeight - estimatedTooltipHeight - 10);
    }
    
    // S'assurer que le tooltip ne sorte pas en haut
    if (y < 10) {
      y = 10;
    }
    
    setHoveredAppointment({
      id: appointmentId,
      x: Math.max(10, Math.min(x, viewportWidth - tooltipWidth - 10)),
      y: Math.max(10, y)
    });
  };

  const handleMouseLeave = () => {
    setHoveredAppointment(null);
  };

  // Fonction pour calculer la position des rendez-vous
  const getAppointmentStyle = (appointment: Appointment) => {
    const startTimeParts = appointment.startTime.split(':');
    const endTimeParts = appointment.endTime.split(':');
    
    const startHour = parseInt(startTimeParts[0] || '9');
    const startMinute = parseInt(startTimeParts[1] || '0');
    const endHour = parseInt(endTimeParts[0] || '10');
    const endMinute = parseInt(endTimeParts[1] || '0');

    const startSlotIndex = timeSlots.findIndex(slot => parseInt((slot.split(':')[0] || '9')) === startHour);
    const totalStartMinutes = startHour * 60 + startMinute;
    const totalEndMinutes = endHour * 60 + endMinute;
    const durationMinutes = totalEndMinutes - totalStartMinutes;

    const top = (startSlotIndex * 60) + ((startMinute / 60) * 60); // 60px par heure
    const height = (durationMinutes / 60) * 60; // 60px par heure

    return {
      top: `${top}px`,
      height: `${height}px`,
      backgroundColor: appointment.color,
      opacity: 0.8
    };
  };

  const formatWeekRange = () => {
    const start = currentWeek[0];
    const end = currentWeek[6];
    if (!start || !end) return '';
    return `${start.getDate()} ${start.toLocaleDateString('fr-FR', { month: 'short' })} – ${end.getDate()} ${end.toLocaleDateString('fr-FR', { month: 'short' })}, ${end.getFullYear()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header style Fresha */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo et navigation */}
          <div className="flex items-center space-x-6">
            <img src={avyentoProLogo} alt="Avyento Pro" className="h-[90px]" />
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={goToToday} className="text-sm">
                Aujourd'hui
              </Button>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" onClick={() => navigate('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-sm font-medium text-gray-700 min-w-[180px] hover:bg-gray-100"
                  onClick={() => setShowCalendar(true)}
                >
                  {formatWeekRange()}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate('next')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Actions droite */}
          <div className="flex items-center space-x-4">
            <Select defaultValue="team">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="team">Toute l'équipe</SelectItem>
                <SelectItem value="alicia">Alicia</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            <Select defaultValue="week">
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Jour</SelectItem>
                <SelectItem value="week">Semaine</SelectItem>
                <SelectItem value="month">Mois</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-black text-white hover:bg-gray-800">
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </div>
        </div>
      </div>

      {/* Planning principal */}
      <div className="p-6">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {/* Header des jours */}
            <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
              {/* Colonne employé */}
              <div className="p-4 border-r border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500 text-white text-sm font-medium flex items-center justify-center">
                    A
                  </div>
                  <span className="font-medium text-gray-900">Alicia</span>
                </div>
              </div>

              {/* Colonnes des jours */}
              {weekDays.map((weekDay, index) => {
                const date = currentWeek[index];
                const isToday = date && date.toDateString() === new Date().toDateString();
                
                return (
                  <div key={weekDay.index} className={`p-4 border-r border-gray-200 last:border-r-0 ${isToday ? 'bg-blue-50' : ''}`}>
                    <div className="text-center">
                      <div className="text-xs font-medium text-gray-500 uppercase mb-1">
                        {date?.getDate()} {weekDay.short}
                      </div>
                      {isToday && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 mx-auto"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Grille horaire */}
            <div className="relative">
              <div className="grid grid-cols-8">
                {/* Colonne des heures */}
                <div className="border-r border-gray-200 bg-white">
                  {timeSlots.map((slot, index) => (
                    <div key={index} className="flex items-start justify-center pt-2 text-xs text-gray-500 border-b border-gray-100 font-medium" style={{ height: '60px' }}>
                      {slot}
                    </div>
                  ))}
                </div>

                {/* Colonnes des jours */}
                {weekDays.map((weekDay) => (
                  <div key={weekDay.index} className="relative border-r border-gray-200 last:border-r-0">
                    {/* Créneaux horaires */}
                    {timeSlots.map((slot, slotIndex) => (
                      <div
                        key={slotIndex}
                        className="h-15 border-b border-gray-100 hover:bg-gray-50 cursor-pointer relative"
                        style={{ height: '60px' }}
                        onClick={() => handleSlotClick(weekDay.index, slot)}
                      />
                    ))}
                    
                    {/* Rendez-vous pour ce jour */}
                    {appointments
                      .filter(apt => apt.day === weekDay.index)
                      .map((appointment) => (
                        <div
                          key={appointment.id}
                          className="absolute left-1 right-1 rounded text-xs font-medium text-white p-2 z-10 border border-gray-300 cursor-pointer hover:shadow-lg transition-shadow"
                          style={getAppointmentStyle(appointment)}
                          onClick={() => handleSlotClick(weekDay.index, appointment.startTime, appointment)}
                          onMouseEnter={(e) => handleMouseEnter(appointment.id, e)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <div className="font-semibold">{appointment.startTime} - {appointment.endTime}</div>
                          <div className="mt-1">{appointment.title}</div>
                          {appointment.client && (
                            <div className="text-gray-200 text-xs">{appointment.client}</div>
                          )}
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de détails du rendez-vous */}
      {isModalOpen && selectedSlot && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {selectedSlot.appointment ? (
              // Modal pour un rendez-vous existant
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Détails du rendez-vous</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeModal}
                    className="rounded-full h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Service */}
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
                      style={{ backgroundColor: selectedSlot.appointment.color }}
                    ></div>
                    <div>
                      <div className="font-semibold text-gray-800">{selectedSlot.appointment.title}</div>
                      <div className="text-sm text-gray-600">
                        {selectedSlot.appointment.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                      </div>
                    </div>
                  </div>

                  {/* Horaire */}
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="font-medium text-gray-800">
                        {selectedSlot.appointment.startTime} - {selectedSlot.appointment.endTime}
                      </div>
                      <div className="text-sm text-gray-600">
                        {weekDays.find(d => d.index === selectedSlot.day)?.full}
                      </div>
                    </div>
                  </div>

                  {/* Client */}
                  {selectedSlot.appointment.client && (
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="font-medium text-gray-800">{selectedSlot.appointment.client}</div>
                        <div className="text-sm text-gray-600">Client régulier</div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button className="flex-1" variant="outline" onClick={handleCallClient}>
                      <Phone className="w-4 h-4 mr-2" />
                      Appeler
                    </Button>
                    <Button className="flex-1" variant="outline" onClick={handleMessageClient}>
                      <Mail className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" variant="outline" onClick={handleModifyAppointment}>
                      Modifier
                    </Button>
                    <Button className="flex-1 text-red-600 hover:text-red-700" variant="outline" onClick={handleCancelAppointment}>
                      Annuler
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              // Modal pour créer un nouveau rendez-vous
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Nouveau rendez-vous</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeModal}
                    className="rounded-full h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Horaire sélectionné */}
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-800">
                        {weekDays.find(d => d.index === selectedSlot.day)?.full}
                      </div>
                      <div className="text-sm text-blue-600">
                        {selectedSlot.hour} - Créneau disponible
                      </div>
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  <div className="space-y-2">
                    <Button className="w-full justify-start" onClick={handleNewAppointment}>
                      <Plus className="w-4 h-4 mr-2" />
                      Réserver un client
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={handleBlockSlot}>
                      <Clock className="w-4 h-4 mr-2" />
                      Bloquer le créneau
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={handleSearchClient}>
                      <User className="w-4 h-4 mr-2" />
                      Rechercher un client
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tooltip au survol */}
      {hoveredAppointment && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: `${hoveredAppointment.x}px`,
            top: `${hoveredAppointment.y}px`
          }}
        >
          {(() => {
            const appointment = appointments.find(apt => apt.id === hoveredAppointment.id);
            if (!appointment) return null;

            return (
              <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-72 max-w-[calc(100vw-20px)]">
                {/* Header avec avatar et infos client */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">
                      {appointment.client.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm">{appointment.client}</h3>
                    {appointment.email && (
                      <p className="text-xs text-gray-500">{appointment.email}</p>
                    )}
                  </div>
                </div>

                {/* Service et prix */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-800">{appointment.title}</h4>
                    <p className="text-xs text-gray-500">{appointment.employee} • {appointment.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{appointment.price} €</p>
                  </div>
                </div>

                {/* Statut de paiement */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">Statut paiement:</span>
                  <span 
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      appointment.paymentStatus === 'payé' 
                        ? 'bg-green-100 text-green-700'
                        : appointment.paymentStatus === 'acompte réglé'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {appointment.paymentStatus}
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Calendrier de sélection */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header du calendrier */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <button 
                  className="glass-button-purple flex items-center justify-center w-10 h-10 rounded-xl"
                  onClick={() => setCurrentWeekOffset(currentWeekOffset - 4)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-lg font-medium bg-gradient-to-r from-purple-600 to-amber-500 bg-clip-text text-transparent">
                  {formatWeekRange()}
                </span>
                <button 
                  className="glass-button-purple flex items-center justify-center w-10 h-10 rounded-xl"
                  onClick={() => setCurrentWeekOffset(currentWeekOffset + 4)}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <button 
                className="glass-button-purple flex items-center justify-center w-10 h-10 rounded-xl"
                onClick={() => setShowCalendar(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Calendrier double mois */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
              {[0, 1].map((monthOffset) => {
                const currentDate = new Date();
                currentDate.setMonth(currentDate.getMonth() + monthOffset);
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                
                const monthNames = [
                  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
                ];

                const firstDay = new Date(year, month, 1);
                const lastDay = new Date(year, month + 1, 0);
                const daysInMonth = lastDay.getDate();
                const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Lundi = 0

                const days = [];
                // Jours vides au début
                for (let i = 0; i < startingDayOfWeek; i++) {
                  days.push(null);
                }
                // Jours du mois
                for (let day = 1; day <= daysInMonth; day++) {
                  days.push(day);
                }

                return (
                  <div key={monthOffset} className="text-center">
                    <div className="flex items-center justify-between mb-4">
                      <Button variant="ghost" size="sm" onClick={() => {}}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <h3 className="text-lg font-semibold">
                        {monthNames[month]} {year}
                      </h3>
                      <Button variant="ghost" size="sm" onClick={() => {}}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* En-têtes des jours */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.'].map((day) => (
                        <div key={day} className="text-xs text-gray-500 font-medium p-2">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Grille des jours */}
                    <div className="grid grid-cols-7 gap-1">
                      {days.map((day, index) => {
                        if (day === null) {
                          return <div key={`empty-${monthOffset}-${index}`} className="p-2"></div>;
                        }

                        const currentWeekStart = currentWeek[0];
                        const currentWeekEnd = currentWeek[6];
                        const dayDate = new Date(year, month, day);
                        
                        const isCurrentWeekStart = currentWeekStart && dayDate.toDateString() === currentWeekStart.toDateString();
                        const isCurrentWeekEnd = currentWeekEnd && dayDate.toDateString() === currentWeekEnd.toDateString();
                        const isInCurrentWeek = currentWeekStart && currentWeekEnd && 
                          dayDate >= currentWeekStart && dayDate <= currentWeekEnd;

                        return (
                          <button
                            key={`day-${monthOffset}-${day}`}
                            className={`
                              p-2 h-10 w-10 rounded-full text-sm font-medium transition-all duration-300
                              hover:scale-105 hover:shadow-lg
                              ${isCurrentWeekStart || isCurrentWeekEnd 
                                ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/25 backdrop-blur-sm border border-purple-400/20' 
                                : isInCurrentWeek 
                                ? 'bg-gradient-to-br from-purple-100/80 to-purple-200/60 text-purple-700 backdrop-blur-sm border border-purple-300/30 shadow-md'
                                : 'text-gray-700 hover:bg-gradient-to-br hover:from-purple-50/50 hover:to-purple-100/30 hover:backdrop-blur-sm'
                              }
                            `}
                            onClick={() => {
                              // Logique pour sélectionner une semaine
                              setShowCalendar(false);
                            }}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Boutons de sélection rapide */}
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                'Dans 1 semaine',
                'Dans 2 semaines', 
                'Dans 3 semaines',
                'Dans 4 semaines',
                'Dans 5 semaines'
              ].map((option, index) => (
                <button
                  key={option}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-purple-100/40 backdrop-blur-sm border border-purple-200/30 text-purple-700 hover:bg-purple-200/40 hover:border-purple-300/40 transition-all duration-300"
                  onClick={() => {
                    setCurrentWeekOffset(index + 1);
                    setShowCalendar(false);
                  }}
                >
                  {option}
                </button>
              ))}
              <button className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-100/40 backdrop-blur-sm border border-gray-200/30 text-gray-600 hover:bg-gray-200/40 hover:border-gray-300/40 transition-all duration-300">
                Plus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}