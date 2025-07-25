import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Building2, MapPin, Phone, Mail, FileText, CreditCard, Shield, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const businessSchema = z.object({
  businessName: z.string().min(2, "Le nom de l'entreprise doit contenir au moins 2 caractères"),
  businessType: z.string().min(1, "Sélectionnez le type d'établissement"),
  siret: z.string().min(14, "Le numéro SIRET doit contenir 14 chiffres").max(14, "Le numéro SIRET doit contenir 14 chiffres"),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  city: z.string().min(2, "La ville doit contenir au moins 2 caractères"),
  postalCode: z.string().min(5, "Le code postal doit contenir 5 chiffres").max(5, "Le code postal doit contenir 5 chiffres"),
  phone: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres"),
  email: z.string().email("Adresse email invalide"),
  ownerFirstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  ownerLastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  legalForm: z.string().min(1, "Sélectionnez la forme juridique"),
  vatNumber: z.string().optional(),
  description: z.string().optional(),
});

type BusinessFormData = z.infer<typeof businessSchema>;

export default function BusinessRegistration() {
  const [, setLocation] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<string>("professional");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      businessName: "",
      businessType: "",
      siret: "",
      address: "",
      city: "",
      postalCode: "",
      phone: "",
      email: "",
      ownerFirstName: "",
      ownerLastName: "",
      legalForm: "",
      vatNumber: "",
      description: "",
    },
  });

  const businessTypes = [
    { value: "salon-coiffure", label: "Salon de coiffure" },
    { value: "barbershop", label: "Barbershop" },
    { value: "institut-beaute", label: "Institut de beauté" },
    { value: "nail-bar", label: "Bar à ongles" },
    { value: "spa", label: "Spa & Bien-être" },
    { value: "centre-esthetique", label: "Centre esthétique" },
    { value: "salon-massage", label: "Salon de massage" },
    { value: "studio-cils", label: "Studio cils & sourcils" },
  ];

  const legalForms = [
    { value: "auto-entrepreneur", label: "Auto-entrepreneur" },
    { value: "eurl", label: "EURL" },
    { value: "sarl", label: "SARL" },
    { value: "sas", label: "SAS" },
    { value: "sasu", label: "SASU" },
    { value: "sa", label: "SA" },
    { value: "sci", label: "SCI" },
  ];

  const plans = {
    essentiel: { name: "ESSENTIEL", price: 29, color: "from-green-500 to-emerald-600" },
    professionnel: { name: "PROFESSIONNEL", price: 79, color: "from-blue-500 to-purple-600" },
    premium: { name: "PREMIUM", price: 149, color: "from-purple-500 to-pink-600" },
  };

  const currentPlan = plans[selectedPlan as keyof typeof plans] || plans.professionnel;

  const onSubmit = async (data: BusinessFormData) => {
    setIsLoading(true);
    
    try {
      // Créer l'enregistrement business
      const businessResponse = await fetch('/api/business-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          planType: selectedPlan,
        }),
      });

      if (!businessResponse.ok) {
        throw new Error('Erreur lors de l\'enregistrement');
      }

      const { businessId } = await businessResponse.json();

      // Créer la session de paiement Stripe
      const paymentResponse = await fetch('/api/create-business-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          planType: selectedPlan,
          customerEmail: data.email,
          customerName: `${data.ownerFirstName} ${data.ownerLastName}`,
          businessName: data.businessName,
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error('Erreur lors de la création du paiement');
      }

      const { checkoutUrl } = await paymentResponse.json();
      
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error('URL de paiement manquante');
      }

    } catch (error) {
      console.error('Erreur inscription:', error);
      // Afficher une erreur à l'utilisateur
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-violet-50/30">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Rendly</h1>
              <p className="text-xs text-gray-500 -mt-1">Inscription Professionnelle</p>
            </div>
            
            <Button 
              variant="ghost" 
              onClick={() => setLocation("/professional-plans")}
              className="text-gray-600 hover:text-violet-600 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux plans
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulaire d'inscription */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Inscription Professionnelle
                </CardTitle>
                <p className="text-gray-600">
                  Complétez vos informations d'entreprise pour commencer
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Informations de l'entreprise */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                        <Building2 className="w-5 h-5 text-violet-600" />
                        Informations de l'entreprise
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="businessName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom de l'établissement *</FormLabel>
                              <FormControl>
                                <Input placeholder="Salon Excellence" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="businessType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type d'établissement *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez le type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {businessTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="siret"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Numéro SIRET *</FormLabel>
                            <FormControl>
                              <Input placeholder="12345678901234" maxLength={14} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description de l'activité</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Décrivez votre activité..." 
                                className="resize-none" 
                                rows={3} 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Adresse */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                        <MapPin className="w-5 h-5 text-violet-600" />
                        Adresse de l'établissement
                      </div>

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Adresse *</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Rue de la Beauté" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ville *</FormLabel>
                              <FormControl>
                                <Input placeholder="Paris" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="postalCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Code postal *</FormLabel>
                              <FormControl>
                                <Input placeholder="75001" maxLength={5} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                        <Phone className="w-5 h-5 text-violet-600" />
                        Informations de contact
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Téléphone *</FormLabel>
                              <FormControl>
                                <Input placeholder="01 23 45 67 89" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email professionnel *</FormLabel>
                              <FormControl>
                                <Input placeholder="contact@monentreprise.fr" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Gérant */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                        <FileText className="w-5 h-5 text-violet-600" />
                        Gérant / Propriétaire
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="ownerFirstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Prénom *</FormLabel>
                              <FormControl>
                                <Input placeholder="Marie" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="ownerLastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom *</FormLabel>
                              <FormControl>
                                <Input placeholder="Dupont" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="legalForm"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Forme juridique *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {legalForms.map((form) => (
                                    <SelectItem key={form.value} value={form.value}>
                                      {form.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="vatNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Numéro de TVA (optionnel)</FormLabel>
                              <FormControl>
                                <Input placeholder="FR12345678901" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        "Création en cours..."
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 mr-2" />
                          Continuer vers le paiement
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Récapitulatif du plan */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Récapitulatif
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="text-center">
                  <Badge className={`bg-gradient-to-r ${currentPlan.color} text-white px-4 py-2 text-lg`}>
                    Plan {currentPlan.name}
                  </Badge>
                  <div className="mt-3">
                    <span className="text-3xl font-bold text-gray-900">{currentPlan.price}€</span>
                    <span className="text-gray-600">/mois</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Facturation mensuelle
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>14 jours d'essai gratuit</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Résiliation à tout moment</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Support client inclus</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Formation personnalisée</span>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-700 font-medium text-sm">
                    <Shield className="w-4 h-4" />
                    Sécurisé et conforme RGPD
                  </div>
                  <p className="text-green-600 text-xs mt-1">
                    Vos données sont protégées et stockées en France
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Vous serez redirigé vers Stripe pour finaliser le paiement sécurisé
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}