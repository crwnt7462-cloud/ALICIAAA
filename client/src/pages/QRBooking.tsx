import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Download, Share2, Calendar, MapPin, Clock, User, Scissors, Euro, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import QRCodeLib from "qrcode";
import { useToast } from "@/hooks/use-toast";

const QRBooking = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Fetch appointments
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["/api/appointments"],
  });

  // Fetch business info
  const { data: businessInfo = {} } = useQuery({
    queryKey: ["/api/business-info"],
  });

  const generateQRCode = async (appointment: any) => {
    setIsGenerating(true);
    setSelectedAppointment(appointment);

    try {
      // Create comprehensive appointment data
      const appointmentData = {
        id: appointment.id,
        clientName: `${appointment.client?.firstName} ${appointment.client?.lastName}`,
        serviceName: appointment.service?.name,
        date: appointment.appointmentDate,
        time: appointment.startTime,
        duration: appointment.service?.duration,
        price: appointment.service?.price,
        staffName: appointment.staff?.name,
        businessName: businessInfo.name || "Mon Salon",
        businessAddress: businessInfo.address || "123 Rue de la Beauté, Paris",
        businessPhone: businessInfo.phone || "+33 1 23 45 67 89",
        confirmationCode: `CONF-${appointment.id}-${Date.now().toString().slice(-4)}`,
        bookingUrl: `${window.location.origin}/booking/confirm/${appointment.id}`,
        managementUrl: `${window.location.origin}/appointment/${appointment.id}/manage`
      };

      // Generate QR code URL
      const qrData = JSON.stringify(appointmentData);
      const canvas = qrCanvasRef.current;
      
      if (canvas) {
        await QRCodeLib.toCanvas(canvas, qrData, {
          width: 300,
          margin: 2,
          color: {
            dark: '#1f2937',
            light: '#ffffff'
          },
          errorCorrectionLevel: 'M'
        });
        
        const url = canvas.toDataURL();
        setQrCodeUrl(url);
      }

      toast({
        title: "QR Code généré",
        description: "Le QR code a été créé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le QR code",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeUrl && selectedAppointment) {
      const link = document.createElement('a');
      link.download = `qr-appointment-${selectedAppointment.id}.png`;
      link.href = qrCodeUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "QR Code téléchargé",
        description: "Le fichier a été sauvegardé avec succès",
      });
    }
  };

  const shareQRCode = async () => {
    if (navigator.share && selectedAppointment) {
      try {
        await navigator.share({
          title: `Rendez-vous - ${selectedAppointment.service?.name}`,
          text: `Votre rendez-vous du ${new Date(selectedAppointment.appointmentDate).toLocaleDateString('fr-FR')} à ${selectedAppointment.startTime}`,
          url: `${window.location.origin}/appointment/${selectedAppointment.id}/manage`
        });
      } catch (error) {
        // Fallback to clipboard
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(`${window.location.origin}/appointment/${selectedAppointment.id}/manage`);
          toast({
            title: "Lien copié",
            description: "Le lien de gestion a été copié dans le presse-papier",
          });
        }
      }
    }
  };

  const upcomingAppointments = appointments.filter((apt: any) => 
    new Date(apt.appointmentDate) >= new Date() && apt.status !== 'cancelled'
  );

  const todayAppointments = appointments.filter((apt: any) => {
    const today = new Date().toDateString();
    return new Date(apt.appointmentDate).toDateString() === today && apt.status !== 'cancelled';
  });

  return (
    <div className="p-4 space-y-6 bg-gradient-to-br from-gray-50/50 to-violet-50/30 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">QR Codes Rendez-vous</h1>
          <p className="text-gray-600 text-sm mt-1">
            Générez des QR codes pour vos rendez-vous clients
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-violet-100 text-violet-800">
            {upcomingAppointments.length} rendez-vous à venir
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Générer QR</TabsTrigger>
          <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
          <TabsTrigger value="upcoming">À venir</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          {/* QR Code Generator */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Sélectionner un rendez-vous</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun rendez-vous à venir</h3>
                      <p className="text-gray-600">
                        Créez des rendez-vous pour générer des QR codes
                      </p>
                    </div>
                  ) : (
                    upcomingAppointments.slice(0, 10).map((appointment: any) => (
                      <div 
                        key={appointment.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedAppointment?.id === appointment.id 
                            ? 'border-violet-500 bg-violet-50' 
                            : 'border-gray-200 hover:border-violet-300'
                        }`}
                        onClick={() => generateQRCode(appointment)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {appointment.client?.firstName} {appointment.client?.lastName}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {appointment.service?.name} • {appointment.service?.duration}min • {appointment.service?.price}€
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(appointment.appointmentDate).toLocaleDateString('fr-FR')}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {appointment.startTime}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge 
                              className={
                                appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }
                            >
                              {appointment.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">QR Code généré</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  {!selectedAppointment ? (
                    <div className="py-12">
                      <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Sélectionnez un rendez-vous</h3>
                      <p className="text-gray-600">
                        Choisissez un rendez-vous pour générer son QR code
                      </p>
                    </div>
                  ) : isGenerating ? (
                    <div className="py-12">
                      <div className="animate-spin w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-600">Génération du QR code...</p>
                    </div>
                  ) : (
                    <>
                      <canvas 
                        ref={qrCanvasRef}
                        className="mx-auto border border-gray-200 rounded-lg"
                        style={{ maxWidth: '100%' }}
                      />
                      
                      {selectedAppointment && (
                        <div className="bg-gray-50 p-4 rounded-lg text-left">
                          <h4 className="font-semibold text-sm mb-2">Informations du rendez-vous:</h4>
                          <div className="space-y-1 text-xs text-gray-600">
                            <div className="flex items-center">
                              <User className="w-3 h-3 mr-2" />
                              {selectedAppointment.client?.firstName} {selectedAppointment.client?.lastName}
                            </div>
                            <div className="flex items-center">
                              <Scissors className="w-3 h-3 mr-2" />
                              {selectedAppointment.service?.name}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-2" />
                              {new Date(selectedAppointment.appointmentDate).toLocaleDateString('fr-FR')}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-2" />
                              {selectedAppointment.startTime} ({selectedAppointment.service?.duration}min)
                            </div>
                            <div className="flex items-center">
                              <Euro className="w-3 h-3 mr-2" />
                              {selectedAppointment.service?.price}€
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Button 
                          onClick={downloadQRCode}
                          className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Télécharger
                        </Button>
                        <Button 
                          onClick={shareQRCode}
                          variant="outline"
                          className="flex-1"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Partager
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="today" className="space-y-6">
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Rendez-vous d'aujourd'hui</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun rendez-vous aujourd'hui</h3>
                    <p className="text-gray-600">
                      Profitez de cette journée plus calme !
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {todayAppointments.map((appointment: any) => (
                      <div key={appointment.id} className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {appointment.startTime} - {appointment.client?.firstName} {appointment.client?.lastName}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {appointment.service?.name} ({appointment.service?.duration}min)
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              className={
                                appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }
                            >
                              {appointment.status}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => generateQRCode(appointment)}
                            >
                              <QrCode className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6">
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Rendez-vous à venir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun rendez-vous à venir</h3>
                    <p className="text-gray-600">
                      Les nouveaux rendez-vous apparaîtront ici
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {upcomingAppointments.map((appointment: any) => (
                      <div key={appointment.id} className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {appointment.client?.firstName} {appointment.client?.lastName}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {appointment.service?.name} • {appointment.service?.price}€
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(appointment.appointmentDate).toLocaleDateString('fr-FR')}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {appointment.startTime}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              className={
                                appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }
                            >
                              {appointment.status}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => generateQRCode(appointment)}
                            >
                              <QrCode className="w-4 h-4 mr-1" />
                              QR
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QRBooking;