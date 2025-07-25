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
import { ArrowLeft, Building2, MapPin, Phone, Mail, FileText, CreditCard, Shield, Check, Crown, Zap, Star, Sparkles, Diamond, Gift } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/20">
      {/* Header ultra-luxueux */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                <Diamond className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Rendly</h1>
                <p className="text-xs text-slate-500 font-medium">Inscription Professionnelle</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => setLocation("/professional-plans")}
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-full px-4 py-2 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulaire principal */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-violet-600/5 to-purple-600/5 p-8 border-b border-slate-100">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Votre entreprise
                    </h2>
                    <p className="text-slate-600 font-medium">
                      Créons ensemble votre espace professionnel
                    </p>
                  </div>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-8">
                  {/* Informations générales */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900">Votre établissement</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="businessName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-slate-700 mb-2">Nom de l'entreprise *</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Salon Excellence Paris" 
                                className="h-12 rounded-2xl border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm focus:shadow-lg focus:border-violet-400 transition-all duration-200 text-slate-900 font-medium placeholder:text-slate-400" 
                              />
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
                            <FormLabel className="text-sm font-semibold text-slate-700 mb-2">Type d'établissement *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm focus:shadow-lg transition-all duration-200">
                                  <SelectValue placeholder="Choisissez votre spécialité..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-2xl border-slate-200 shadow-xl backdrop-blur-sm">
                                {businessTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value} className="rounded-xl">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="siret"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-slate-700 mb-2">Numéro SIRET *</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="12345678901234" 
                                className="h-12 rounded-2xl border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm focus:shadow-lg focus:border-violet-400 transition-all duration-200 text-slate-900 font-medium placeholder:text-slate-400" 
                              />
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
                            <FormLabel className="text-sm font-semibold text-slate-700 mb-2">Forme juridique *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm focus:shadow-lg transition-all duration-200">
                                  <SelectValue placeholder="Choisissez votre statut..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-2xl border-slate-200 shadow-xl backdrop-blur-sm">
                                {legalForms.map((form) => (
                                  <SelectItem key={form.value} value={form.value} className="rounded-xl">
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

                  {/* Adresse avec style luxueux */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900">Votre adresse</h3>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-slate-700 mb-2">Adresse complète *</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="15 avenue des Champs-Élysées" 
                              className="h-12 rounded-2xl border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm focus:shadow-lg focus:border-violet-400 transition-all duration-200 text-slate-900 font-medium placeholder:text-slate-400" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-slate-700 mb-2">Ville *</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Paris" 
                                className="h-12 rounded-2xl border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm focus:shadow-lg focus:border-violet-400 transition-all duration-200 text-slate-900 font-medium placeholder:text-slate-400" 
                              />
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
                            <FormLabel className="text-sm font-semibold text-slate-700 mb-2">Code postal *</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="75008" 
                                className="h-12 rounded-2xl border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm focus:shadow-lg focus:border-violet-400 transition-all duration-200 text-slate-900 font-medium placeholder:text-slate-400" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Contact avec style luxueux */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                        <Phone className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900">Vos coordonnées</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-slate-700 mb-2">Téléphone professionnel *</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="01 23 45 67 89" 
                                className="h-12 rounded-2xl border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm focus:shadow-lg focus:border-violet-400 transition-all duration-200 text-slate-900 font-medium placeholder:text-slate-400" 
                              />
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
                            <FormLabel className="text-sm font-semibold text-slate-700 mb-2">Email professionnel *</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="email" 
                                placeholder="contact@salon-excellence.fr" 
                                className="h-12 rounded-2xl border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm focus:shadow-lg focus:border-violet-400 transition-all duration-200 text-slate-900 font-medium placeholder:text-slate-400" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Responsable avec style luxueux */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900">Responsable légal</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="ownerFirstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-slate-700 mb-2">Prénom du dirigeant *</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Marie-Claire" 
                                className="h-12 rounded-2xl border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm focus:shadow-lg focus:border-violet-400 transition-all duration-200 text-slate-900 font-medium placeholder:text-slate-400" 
                              />
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
                            <FormLabel className="text-sm font-semibold text-slate-700 mb-2">Nom de famille *</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Dubois-Laurent" 
                                className="h-12 rounded-2xl border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm focus:shadow-lg focus:border-violet-400 transition-all duration-200 text-slate-900 font-medium placeholder:text-slate-400" 
                              />
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
                          <FormLabel className="text-sm font-semibold text-slate-700 mb-2">Numéro de TVA (optionnel)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="FR12345678901" 
                              className="h-12 rounded-2xl border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm focus:shadow-lg focus:border-violet-400 transition-all duration-200 text-slate-900 font-medium placeholder:text-slate-400" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Description avec style luxueux */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900">Présentez votre salon</h3>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-slate-700 mb-2">Votre histoire et vos spécialités (optionnel)</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Salon haut de gamme spécialisé dans les techniques de coloration avancées, situé au cœur du 8ème arrondissement. Notre équipe d'experts vous accueille dans un cadre raffiné..."
                              className="min-h-[100px] resize-none rounded-2xl border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm focus:shadow-lg focus:border-violet-400 transition-all duration-200 text-slate-900 font-medium placeholder:text-slate-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Bouton de soumission luxueux */}
                  <div className="pt-8 border-t border-slate-100">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl blur opacity-25"></div>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="relative w-full h-14 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 hover:from-violet-700 hover:via-purple-700 hover:to-violet-800 text-white font-semibold text-lg rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3" />
                            Traitement sécurisé en cours...
                          </>
                        ) : (
                          <>
                            <Gift className="w-5 h-5 mr-3" />
                            Finaliser mon inscription premium
                            <Sparkles className="w-5 h-5 ml-3" />
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-center text-xs text-slate-500 mt-4 font-medium">
                      Paiement 100% sécurisé • SSL • RGPD
                    </p>
                  </div>
                </form>
              </Form>
            </div>
          </div>

          {/* Récapitulatif luxueux du plan */}
          <div className="space-y-8">
            <Card className="bg-white/70 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden sticky top-8">
              <CardHeader className="bg-gradient-to-br from-slate-50 to-violet-50/30 pb-6">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                    <Diamond className="w-5 h-5 text-violet-600" />
                    <span>Votre plan</span>
                  </CardTitle>
                  {currentPlan?.badge && (
                    <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 px-3 py-1 rounded-full font-semibold shadow-lg">
                      {currentPlan.badge}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-8 p-6">
                {/* Plan sélectionné avec design luxueux */}
                <div className={`relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br ${currentPlan?.color || 'from-blue-500 to-purple-600'} text-white shadow-2xl`}>
                  {/* Effet de brillance */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl">{currentPlan?.name || 'PROFESSIONNEL'}</h3>
                          <p className="text-white/80 text-sm font-medium">Abonnement mensuel</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center py-4">
                      <div className="text-4xl font-bold mb-1">{currentPlan?.price || 79}€</div>
                      <div className="text-white/80 text-sm font-medium">par mois • Sans engagement</div>
                    </div>
                  </div>
                </div>

                {/* Fonctionnalités incluses avec style luxueux */}
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-6 border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-4 flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <span>Tout ce qui est inclus</span>
                  </h4>
                  <div className="space-y-3">
                    {(currentPlan?.features || []).map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-5 h-5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-slate-700 font-medium text-sm leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Garanties luxueuses */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-3xl border border-emerald-200/50">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-bold text-emerald-800">Vos garanties premium</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span className="text-emerald-700 font-medium text-sm">14 jours gratuits</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span className="text-emerald-700 font-medium text-sm">Sans engagement</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span className="text-emerald-700 font-medium text-sm">Support VIP</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span className="text-emerald-700 font-medium text-sm">Sécurité bancaire</span>
                    </div>
                  </div>
                </div>

                {/* Changement de plan avec style */}
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => setLocation("/professional-plans")}
                    className="text-violet-600 border-violet-200 hover:bg-violet-50 rounded-full px-6 py-2 font-medium transition-all duration-200 hover:border-violet-300 hover:shadow-lg"
                  >
                    Modifier mon plan
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