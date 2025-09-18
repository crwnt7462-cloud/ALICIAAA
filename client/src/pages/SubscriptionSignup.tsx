// Mapping UI → backend pour les plans
const planMap: Record<'basic' | 'premium', 'basic-pro' | 'premium-pro'> = {
  basic: 'basic-pro',
  premium: 'premium-pro',
};
import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  ArrowLeft, 
  Building, 
  FileText, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle,
  Crown,
  Sparkles,
  CreditCard
} from "lucide-react";
import { getGenericGlassButton } from "@/lib/salonColors";

const businessInfoSchema = z.object({
  planType: z.enum(["basic-pro", "advanced-pro", "premium-pro"]),
  companyName: z.string().min(2, "Le nom de l'entreprise est requis"),
  siret: z.string().min(14, "Le SIRET doit contenir 14 chiffres").max(14, "Le SIRET doit contenir 14 chiffres"),
  businessAddress: z.string().min(10, "L'adresse complète est requise"),
  businessPhone: z.string().optional(),
  businessEmail: z.string().email("Email invalide").optional(),
  legalForm: z.string().min(1, "La forme juridique est requise"),
  vatNumber: z.string().optional(),
  billingAddress: z.string().optional(),
  billingName: z.string().optional(),
});

type BusinessInfoForm = z.infer<typeof businessInfoSchema>;

interface SubscriptionSignupProps {
  selectedPlan?: "basic-pro" | "advanced-pro" | "premium-pro";
}

export default function SubscriptionSignup({ selectedPlan = "basic-pro" }: SubscriptionSignupProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BusinessInfoForm>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: {
      planType: selectedPlan,
      companyName: "",
      siret: "",
      businessAddress: "",
      businessPhone: "",
      businessEmail: "",
      legalForm: "",
      vatNumber: "",
      billingAddress: "",
      billingName: "",
    },
  });

  const createSubscriptionMutation = useMutation({
    mutationFn: async (data: BusinessInfoForm) => {
      const response = await apiRequest("POST", "/api/subscriptions/create", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Informations enregistrées",
        description: "Redirection vers le paiement...",
      });
      // Rediriger vers la page de paiement avec l'ID de souscription
      setLocation(`/subscription/payment/${data.subscriptionId}`);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les informations",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BusinessInfoForm) => {
    setIsSubmitting(true);
    createSubscriptionMutation.mutate(data);
  };

  const plans = {
    "basic-pro": {
      name: "Basic Pro",
      price: "29€",
      features: [
        "Gestion des rendez-vous",
        "Base de données clients",
        "Calendrier intégré",
        "Support email",
      ],
      color: "blue",
      icon: <CheckCircle className="w-5 h-5" />,
    },
    "advanced-pro": {
      name: "Advanced Pro",
      price: "79€",
      features: [
        "Tout du Basic Pro",
        "Analytics avancés",
        "Messagerie clients",
        "Notifications personnalisées",
        "Support prioritaire",
      ],
      color: "amber",
      icon: <Sparkles className="w-5 h-5" />,
    },
    "premium-pro": {
      name: "Premium Pro",
      price: "149€",
      features: [
        "Tout de l'Advanced Pro",
        "Intelligence Artificielle",
        "Messagerie directe clients",
        "Analytics prédictifs",
        "Support 24/7",
      ],
      color: "violet",
      icon: <Crown className="w-5 h-5" />,
    },
  };

  const currentPlan = plans[form.watch("planType")];

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/pro-tools")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            Souscription Plan Professionnel
          </h1>
          <div>
            <Label htmlFor="planType">Plan sélectionné</Label>
            <Select
              value={form.watch("planType")}
              onValueChange={(value: 'basic' | 'premium') => form.setValue('planType', planMap[value])}
            >
              {/* ...SelectItems ici... */}
            </Select>
            <div className="flex items-center gap-3 mt-4">
              <div className={`w-12 h-12 bg-${currentPlan.color}-600 rounded-full flex items-center justify-center`}>
                {currentPlan.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{currentPlan.name}</h3>
                <p className="text-2xl font-bold text-gray-900">{currentPlan.price}<span className="text-sm font-normal">/mois</span></p>
              </div>
            </div>
            <Badge className={`bg-${currentPlan.color}-600 text-white mt-2`}>
              {(form.watch("planType") ?? "basic-pro").includes("premium-pro") ? "Premium" : "Basic"}
            </Badge>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
              {currentPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Formulaire d'informations d'entreprise */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Informations d'entreprise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Changement de plan */}
              <div>
                <Label htmlFor="planType">Plan sélectionné</Label>
                <Select
                  value={form.watch("planType")}
                   onValueChange={(value: 'basic' | 'premium') => form.setValue('planType', planMap[value])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic-pro">Basic Pro - 29€/mois</SelectItem>
                    <SelectItem value="advanced-pro">Advanced Pro - 79€/mois</SelectItem>
                    <SelectItem value="premium-pro">Premium Pro - 149€/mois</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Informations de base */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Nom de l'entreprise *</Label>
                  <Input
                    id="companyName"
                    {...form.register("companyName")}
                    placeholder="Salon de beauté XYZ"
                  />
                  {form.formState.errors.companyName && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.companyName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="siret">SIRET *</Label>
                  <Input
                    id="siret"
                    {...form.register("siret")}
                    placeholder="12345678901234"
                    maxLength={14}
                  />
                  {form.formState.errors.siret && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.siret.message}</p>
                  )}
                </div>
              </div>

              {/* Forme juridique */}
              <div>
                <Label htmlFor="legalForm">Forme juridique *</Label>
                <Select
                  value={form.watch("legalForm")}
                  onValueChange={(value) => form.setValue("legalForm", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez la forme juridique" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto-entrepreneur">Auto-entrepreneur</SelectItem>
                    <SelectItem value="eurl">EURL</SelectItem>
                    <SelectItem value="sarl">SARL</SelectItem>
                    <SelectItem value="sas">SAS</SelectItem>
                    <SelectItem value="sasu">SASU</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.legalForm && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.legalForm.message}</p>
                )}
              </div>

              {/* Adresse */}
              <div>
                <Label htmlFor="businessAddress">Adresse de l'entreprise *</Label>
                <Textarea
                  id="businessAddress"
                  {...form.register("businessAddress")}
                  placeholder="123 rue des Fleurs, 75001 Paris"
                  rows={3}
                />
                {form.formState.errors.businessAddress && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.businessAddress.message}</p>
                )}
              </div>

              {/* Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessPhone">Téléphone</Label>
                  <Input
                    id="businessPhone"
                    {...form.register("businessPhone")}
                    placeholder="01 23 45 67 89"
                  />
                </div>

                <div>
                  <Label htmlFor="businessEmail">Email professionnel</Label>
                  <Input
                    id="businessEmail"
                    {...form.register("businessEmail")}
                    type="email"
                    placeholder="contact@salon.fr"
                  />
                </div>
              </div>

              {/* Informations optionnelles */}
              <div>
                <Label htmlFor="vatNumber">Numéro de TVA (optionnel)</Label>
                <Input
                  id="vatNumber"
                  {...form.register("vatNumber")}
                  placeholder="FR 12 345 678 901"
                />
              </div>

              {/* Adresse de facturation */}
              <div>
                <Label htmlFor="billingAddress">Adresse de facturation (si différente)</Label>
                <Textarea
                  id="billingAddress"
                  {...form.register("billingAddress")}
                  placeholder="Laissez vide si identique à l'adresse de l'entreprise"
                  rows={3}
                />
              </div>

              {/* Nom de facturation */}
              <div>
                <Label htmlFor="billingName">Nom de facturation (si différent)</Label>
                <Input
                  id="billingName"
                  {...form.register("billingName")}
                  placeholder="Laissez vide si identique au nom de l'entreprise"
                />
              </div>

              {/* Bouton de soumission */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full ${getGenericGlassButton(1)} py-3 font-semibold`}
                >
                  {isSubmitting ? (
                    "Enregistrement..."
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Continuer vers le paiement
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Note légale */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            En continuant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
            Vous pouvez annuler votre abonnement à tout moment.
          </p>
        </div>
      </div>
    </div>
  );
}