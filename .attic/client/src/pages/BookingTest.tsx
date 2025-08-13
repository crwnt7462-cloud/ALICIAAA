import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function BookingTest() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    salonId: "demo-user",
    clientFirstName: "Marie",
    clientLastName: "Dubois", 
    clientEmail: "marie.dubois@example.com",
    clientPhone: "06 12 34 56 78",
    serviceId: 11,
    appointmentDate: "2025-06-26",
    startTime: "14:00",
    endTime: "15:00",
    notes: "Test de réservation",
    depositAmount: 15
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await apiRequest("POST", "/api/public-booking", formData);
      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
        toast({
          title: "Réservation créée !",
          description: `Rendez-vous #${data.appointmentId} confirmé`,
        });
      } else {
        throw new Error(data.error || "Erreur inconnue");
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test de Réservation Publique</CardTitle>
          <CardDescription>
            Testez le système de réservation avec génération de reçus
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  value={formData.clientFirstName}
                  onChange={(e) => handleInputChange("clientFirstName", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  value={formData.clientLastName}
                  onChange={(e) => handleInputChange("clientLastName", e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.clientEmail}
                onChange={(e) => handleInputChange("clientEmail", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.clientPhone}
                onChange={(e) => handleInputChange("clientPhone", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.appointmentDate}
                  onChange={(e) => handleInputChange("appointmentDate", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="time">Heure</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange("startTime", e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Notes optionnelles"
              />
            </div>

            <div>
              <Label htmlFor="deposit">Acompte (€)</Label>
              <Input
                id="deposit"
                type="number"
                value={formData.depositAmount}
                onChange={(e) => handleInputChange("depositAmount", parseInt(e.target.value))}
                min="0"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Création en cours..." : "Créer la réservation"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card className="bg-green-50 dark:bg-green-950">
          <CardHeader>
            <CardTitle className="text-green-800 dark:text-green-200">
              Réservation Créée avec Succès !
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p><strong>ID de réservation:</strong> {result.appointmentId}</p>
            <p><strong>Message:</strong> {result.message}</p>
            
            <div className="flex gap-2 flex-wrap">
              <Button asChild variant="outline">
                <a href={result.downloadUrl} target="_blank" rel="noopener noreferrer">
                  Voir le reçu
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={result.manageUrl} target="_blank" rel="noopener noreferrer">
                  Gérer la réservation
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Liens Utiles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2 flex-wrap">
            <Button asChild variant="outline" size="sm">
              <a href="/book/demo-user" target="_blank" rel="noopener noreferrer">
                Page de réservation publique
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href="/api/services" target="_blank" rel="noopener noreferrer">
                Services disponibles
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}