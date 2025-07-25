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
import { ArrowLeft, Building2, MapPin, Phone, Mail, FileText, CreditCard, Shield, Check, Crown, Zap, Star, Sparkles } from "lucide-react";
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

interface PlanDetails {
  name: string;
  price: number;
  features: string[];
  color: string;
  icon: any;
  badge?: string;
}

const planDetails: Record<string, PlanDetails> = {
  essentiel: {
    name: "ESSENTIEL",
    price: 29,
    color: "from-green-500 to-emerald-600",
    icon: Zap,
    features: [
      "Gestion des rendez-vous illimitée",
      "Base clients complète",
      "Planning automatisé",
      "Support par email"
    ]
  },
  professionnel: {
    name: "PROFESSIONNEL",
    price: 79,
    color: "from-blue-500 to-purple-600",
    icon: Star,
    badge: "Populaire",
    features: [
      "Toutes les fonctionnalités Essentiel",
      "Rappels SMS automatiques",
      "Analytics avancés",
      "Intégrations calendrier",
      "Support prioritaire"
    ]
  },
  premium: {
    name: "PREMIUM",
    price: 149,
    color: "from-purple-500 to-pink-600",
    icon: Crown,
    badge: "Recommandé",
    features: [
      "Toutes les fonctionnalités Professionnel",
      "IA d'optimisation planning",
      "Messagerie directe clients",
      "Page de réservation personnalisée",
      "Formation personnalisée",
      "Support téléphonique 7j/7"
    ]
  }
};

export default function BusinessRegistration() {
  const [, setLocation] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<string>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('plan') || "professionnel";
  });
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

  const currentPlan = planDetails[selectedPlan];
  const IconComponent = currentPlan?.icon || Star;

  const onSubmit = async (data: BusinessFormData) => {
    setIsLoading(true);
    try {
      // Créer l'inscription d'entreprise
      const registrationResponse = await fetch('/api/business-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          planType: selectedPlan,
          status: 'pending'
        })
      });

      if (!registrationResponse.ok) {
        throw new Error('Erreur lors de l\'inscription');
      }

      const { businessId } = await registrationResponse.json();

      // Créer la session de paiement
      const paymentResponse = await fetch('/api/create-business-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          planType: selectedPlan,
          customerEmail: data.email,
          customerName: `${data.ownerFirstName} ${data.ownerLastName}`,
          businessName: data.businessName
        })
      });

      if (!paymentResponse.ok) {
        throw new Error('Erreur lors de la création du paiement');
      }

      const { checkoutUrl } = await paymentResponse.json();
      window.location.href = checkoutUrl;

    } catch (error: any) {
      console.error('Erreur inscription:', error);
      alert('Erreur lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-violet-50/30">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Rendly</h1>
              <p className="text-xs text-gray-500 -mt-1">Inscription Professionnelle</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/professional-plans")}
              className="text-gray-600 hover:text-gray-900 h-8 px-3"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Retour
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Formulaire principal */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Informations de votre entreprise
                </h2>
                <p className="text-gray-600 text-sm">
                  Complétez ces informations pour finaliser votre inscription
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
                  {/* Informations générales */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-violet-600" />
                      Établissement
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="businessName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Nom de l'entreprise *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Salon Excellence" className="h-9" />
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
                            <FormLabel className="text-sm font-medium">Type d'établissement *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-9">
                                  <SelectValue placeholder="Sélectionnez..." />
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="siret"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Numéro SIRET *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="12345678901234" className="h-9" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="legalForm"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Forme juridique *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-9">
                                  <SelectValue placeholder="Sélectionnez..." />
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
                    </div>
                  </div>

                  {/* Adresse */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-violet-600" />
                      Adresse
                    </h3>
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Adresse complète *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="15 rue de la Paix" className="h-9" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Ville *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Paris" className="h-9" />
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
                            <FormLabel className="text-sm font-medium">Code postal *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="75001" className="h-9" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <Phone className="w-5 h-5 text-violet-600" />
                      Contact
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Téléphone *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="01 23 45 67 89" className="h-9" />
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
                            <FormLabel className="text-sm font-medium">Email professionnel *</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" placeholder="contact@salon-excellence.fr" className="h-9" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Responsable */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-violet-600" />
                      Responsable légal
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="ownerFirstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Prénom *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Marie" className="h-9" />
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
                            <FormLabel className="text-sm font-medium">Nom *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Dubois" className="h-9" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="vatNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Numéro de TVA (optionnel)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="FR12345678901" className="h-9" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Description de votre activité (optionnel)</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Décrivez brièvement votre établissement et vos spécialités..."
                              className="min-h-[80px] resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Bouton de soumission */}
                  <div className="pt-4 border-t border-gray-100">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-10 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                          Traitement en cours...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Finaliser et payer
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>

          {/* Récapitulatif du plan */}
          <div className="space-y-6">
            <Card className="bg-white shadow-lg border-0 sticky top-6">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-gray-900">
                    Récapitulatif
                  </CardTitle>
                  {currentPlan?.badge && (
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                      {currentPlan.badge}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Plan sélectionné */}
                <div className={`p-4 rounded-lg bg-gradient-to-br ${currentPlan?.color || 'from-blue-500 to-purple-600'} text-white`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{currentPlan?.name || 'PROFESSIONNEL'}</h3>
                      <p className="text-white/80 text-sm">Plan mensuel</p>
                    </div>
                  </div>
                  
                  <div className="text-center py-2">
                    <div className="text-3xl font-bold">{currentPlan?.price || 79}€</div>
                    <div className="text-white/80 text-sm">par mois</div>
                  </div>
                </div>

                {/* Fonctionnalités incluses */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-violet-600" />
                    Fonctionnalités incluses
                  </h4>
                  <div className="space-y-2">
                    {(currentPlan?.features || []).map((feature, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Garanties */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-700 font-medium text-sm mb-2">
                    <Shield className="w-4 h-4" />
                    Vos garanties
                  </div>
                  <div className="space-y-1 text-green-600 text-sm">
                    <div>✓ 14 jours d'essai gratuit</div>
                    <div>✓ Sans engagement</div>
                    <div>✓ Support inclus</div>
                    <div>✓ Paiement sécurisé</div>
                  </div>
                </div>

                {/* Changement de plan */}
                <div className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocation("/professional-plans")}
                    className="text-violet-600 border-violet-200 hover:bg-violet-50 h-8"
                  >
                    Changer de plan
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