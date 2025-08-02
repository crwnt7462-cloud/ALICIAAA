import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Eye, Palette } from "lucide-react";
import { getGenericGlassButton } from '@/lib/salonColors';

export default function PageBuilder() {
 const [, setLocation] = useLocation();
 const { toast } = useToast();

 const [customization, setCustomization] = useState({
  // Personnalisation de la page de réservation de base
  salonName: "Mon Salon",
  salonDescription: "Spécialisé dans les soins de beauté",
  primaryColor: "#8B5CF6",
  secondaryColor: "#F59E0B",
  logoUrl: "",
  showPrices: true,
  requireDeposit: true,
  depositPercentage: 30,
  welcomeMessage: "Bienvenue ! Prenez rendez-vous facilement.",
  thankYouMessage: "Merci pour votre réservation !"
 });

 const saveCustomization = () => {
  // Sauvegarder dans le localStorage pour l'instant
  localStorage.setItem('pageCustomization', JSON.stringify(customization));
  toast({ 
   title: "Personnalisation sauvegardée!", 
   description: "Vos modifications ont été appliquées à la page de réservation" 
  });
 };

 const previewBooking = () => {
  // Sauvegarder d'abord puis rediriger vers la page de réservation
  localStorage.setItem('pageCustomization', JSON.stringify(customization));
  setLocation('/booking');
 };

 return (
  <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
   {/* Header */}
   <div className="bg-white shadow-sm border-b">
    <div className="max-w-4xl mx-auto px-4 py-4">
     <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
       <Button 
        variant="outline" 
        size="sm"
        onClick={() => setLocation("/business-features")}
       >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour
       </Button>
       <div>
        <h1 className="text-xl font-bold text-gray-900">Personnalisation Page</h1>
        <p className="text-sm text-gray-500">Personnalisez votre page de réservation</p>
       </div>
      </div>
      
      <div className="flex items-center space-x-2">
       <Button 
        variant="outline" 
        size="sm"
        onClick={previewBooking}
       >
        <Eye className="w-4 h-4 mr-2" />
        Aperçu
       </Button>
       <Button 
        size="sm"
        onClick={saveCustomization}
        className="bg-violet-600 hover:bg-violet-700"
       >
        <Save className="w-4 h-4 mr-2" />
        Sauvegarder
       </Button>
      </div>
     </div>
    </div>
   </div>

   {/* Contenu principal */}
   <div className="max-w-4xl mx-auto px-4 py-6">

    <div className="grid md:grid-cols-2 gap-6">
     {/* Panneau de personnalisation */}
     <div className="space-y-6">
      <Card>
       <CardHeader>
        <CardTitle className="flex items-center">
         <Palette className="w-5 h-5 mr-2 text-violet-600" />
         Informations de base
        </CardTitle>
       </CardHeader>
       <CardContent className="space-y-4">
        <div>
         <Label htmlFor="salonName">Nom du salon</Label>
         <Input
          id="salonName"
          value={customization.salonName}
          onChange={(e) => setCustomization(prev => ({...prev, salonName: e.target.value}))}
          placeholder="Mon Salon"
         />
        </div>
        <div>
         <Label htmlFor="salonDescription">Description</Label>
         <Textarea
          id="salonDescription"
          value={customization.salonDescription}
          onChange={(e) => setCustomization(prev => ({...prev, salonDescription: e.target.value}))}
          placeholder="Spécialisé dans les soins de beauté..."
          rows={2}
         />
        </div>
        <div>
         <Label htmlFor="welcomeMessage">Message d'accueil</Label>
         <Input
          id="welcomeMessage"
          value={customization.welcomeMessage}
          onChange={(e) => setCustomization(prev => ({...prev, welcomeMessage: e.target.value}))}
          placeholder="Bienvenue !"
         />
        </div>
       </CardContent>
      </Card>

      <Card>
       <CardHeader>
        <CardTitle>Design</CardTitle>
       </CardHeader>
       <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
         <div>
          <Label htmlFor="primaryColor">Couleur principale</Label>
          <Input
           id="primaryColor"
           type="color"
           value={customization.primaryColor}
           onChange={(e) => setCustomization(prev => ({...prev, primaryColor: e.target.value}))}
           className="h-12"
          />
         </div>
         <div>
          <Label htmlFor="secondaryColor">Couleur secondaire</Label>
          <Input
           id="secondaryColor"
           type="color"
           value={customization.secondaryColor}
           onChange={(e) => setCustomization(prev => ({...prev, secondaryColor: e.target.value}))}
           className="h-12"
          />
         </div>
        </div>
        
        <div className="flex items-center justify-between">
         <Label>Afficher les prix</Label>
         <Switch
          checked={customization.showPrices}
          onCheckedChange={(checked) => setCustomization(prev => ({...prev, showPrices: checked}))}
         />
        </div>
        
        <div className="flex items-center justify-between">
         <Label>Demander un acompte</Label>
         <Switch
          checked={customization.requireDeposit}
          onCheckedChange={(checked) => setCustomization(prev => ({...prev, requireDeposit: checked}))}
         />
        </div>
       </CardContent>
      </Card>

     </div>

     {/* Aperçu */}
     <div className="sticky top-6">
      <Card>
       <CardHeader>
        <CardTitle className="flex items-center">
         <Eye className="w-5 h-5 mr-2" />
         Aperçu de votre page
        </CardTitle>
       </CardHeader>
       <CardContent>
        <div 
         className="border rounded-lg overflow-hidden"
         style={{ 
          background: `linear-gradient(135deg, ${customization.primaryColor}20, ${customization.secondaryColor}20)`
         }}
        >
         {/* Header preview */}
         <div 
          className="p-6 text-center text-white"
          style={{ 
           background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`
          }}
         >
          <h2 className="text-lg font-bold">
           {customization.salonName}
          </h2>
          <p className="text-sm opacity-90">
           {customization.salonDescription}
          </p>
          <p className="text-xs mt-2 opacity-75">
           {customization.welcomeMessage}
          </p>
         </div>
         
         {/* Exemple contenu */}
         <div className="p-4 bg-white">
          <h3 className="font-medium mb-3">Services disponibles</h3>
          <div className="space-y-2">
           <div className="flex justify-between text-sm">
            <span>Coupe + Brushing</span>
            {customization.showPrices && <span>45€</span>}
           </div>
           <div className="flex justify-between text-sm">
            <span>Coloration</span>
            {customization.showPrices && <span>65€</span>}
           </div>
           <div className="flex justify-between text-sm">
            <span>Soin capillaire</span>
            {customization.showPrices && <span>35€</span>}
           </div>
          </div>
          
          <Button 
           className="w-full mt-4" 
           size="sm"
           style={{ 
            background: `linear-gradient(to right, ${customization.primaryColor}, ${customization.secondaryColor})`
           }}
          >
           Réserver maintenant
          </Button>

          {customization.requireDeposit && (
           <p className="text-xs text-center mt-2 text-gray-600">
            Acompte de {customization.depositPercentage}% requis
           </p>
          )}
         </div>
        </div>

        <div className="mt-4 text-center">
         <Button 
          onClick={previewBooking}
          variant="outline"
          size="sm"
          className="w-full"
         >
          <Eye className="w-4 h-4 mr-2" />
          Voir la page complète
         </Button>
        </div>
       </CardContent>
      </Card>
     </div>
    </div>
   </div>
  </div>
 );
}