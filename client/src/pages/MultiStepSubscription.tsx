import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight, CheckCircle, Crown, Building, Mail, Phone, MapPin, CreditCard, User, Lock, Eye, EyeOff, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getGenericGlassButton } from '@/lib/salonColors';
import { apiRequest } from "@/lib/queryClient";
import { EmailVerificationSuccess } from "@/components/EmailVerificationSuccess";

// Schémas de validation pour chaque étape
const step1Schema = z.object({
  firstName: z.string().min(2, "Le prénom est requis"),
  lastName: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  confirmPassword: z.string(),
  phone: z.string().min(10, "Le téléphone est requis"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

const step2Schema = z.object({
  companyName: z.string().min(2, "Le nom de l'entreprise est requis"),
  siret: z.string().min(14, "Le SIRET doit contenir 14 chiffres").max(14),
  businessAddress: z.string().min(10, "L'adresse complète est requise"),
  businessCity: z.string().min(2, "La ville est requise"),
  businessPostalCode: z.string().min(5, "Le code postal est requis"),
  legalForm: z.enum(["SARL", "SAS", "EURL", "Auto-entrepreneur", "Autre"]),
  vatNumber: z.string().optional(),
});

const step3Schema = z.object({
  planType: z.enum(["basic-pro", "advanced-pro", "premium-pro"]),
  billingAddress: z.string().optional(),
  billingName: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, "Vous devez accepter les conditions"),
});

type Step1Form = z.infer<typeof step1Schema>;
type Step2Form = z.infer<typeof step2Schema>;
type Step3Form = z.infer<typeof step3Schema>;

interface MultiStepSubscriptionProps {
  selectedPlan?: "basic-pro" | "advanced-pro" | "premium-pro";
}

export default function MultiStepSubscription({ selectedPlan = "basic-pro" }: MultiStepSubscriptionProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdAccount, setCreatedAccount] = useState<any>(null);

  // Récupérer le plan depuis l'URL ou localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const planFromUrl = urlParams.get('plan') as "basic-pro" | "advanced-pro" | "premium-pro" | null;
  const planFromStorage = localStorage.getItem('selectedPlan') as "basic-pro" | "advanced-pro" | "premium-pro" | null;
  const finalSelectedPlan = planFromUrl || planFromStorage || selectedPlan || "basic-pro";

  // Logging pour débugger
  console.log('📋 Plan détecté:', { planFromUrl, planFromStorage, selectedPlan, finalSelectedPlan });

  // État pour stocker les données de toutes les étapes
  const [formData, setFormData] = useState({
    step1: {} as Step1Form,
    step2: {} as Step2Form,
    step3: { planType: finalSelectedPlan, acceptTerms: false } as Step3Form,
  });

  // Formulaires pour chaque étape
  const step1Form = useForm<Step1Form>({
    resolver: zodResolver(step1Schema),
    defaultValues: formData.step1,
  });

  const step2Form = useForm<Step2Form>({
    resolver: zodResolver(step2Schema),
    defaultValues: formData.step2,
  });

  const step3Form = useForm<Step3Form>({
    resolver: zodResolver(step3Schema),
    defaultValues: formData.step3,
  });

  // ✨ SUPPRIMÉ - Plus besoin de mutation directe car on utilise l'inscription par email

  const handleStep1Next = (data: Step1Form) => {
    setFormData(prev => ({ ...prev, step1: data }));
    setCurrentStep(2);
  };

  const handleStep2Next = (data: Step2Form) => {
    setFormData(prev => ({ ...prev, step2: data }));
    setCurrentStep(3);
  };

  const handleFinalSubmit = (data: Step3Form) => {
    // Sauvegarder les données de l'étape 3
    setFormData(prev => ({ ...prev, step3: data }));
    
    // ✨ NOUVELLE LOGIQUE : Passer à l'étape de validation email
    setShowEmailVerification(true);
  };

  // Gestion du succès de la vérification email
  const handleEmailVerificationSuccess = (result: any) => {
    console.log('✅ Email vérifié avec succès:', result);
    setCreatedAccount(result.account);
    
    // 💳 AUTO-CONNECTER ET OUVRIR LE SHELL DE PAIEMENT STRIPE
    const autoLoginAndPay = async () => {
      try {
        // 1️⃣ Connexion automatique avec les données d'inscription
        const loginResponse = await fetch('/api/login/professional', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.step1.email,
            password: formData.step1.password
          }),
        });

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          console.log('🔐 Connexion automatique réussie:', loginData);
          
          // 2️⃣ Sauvegarder les données localement pour persistance
          localStorage.setItem('proEmail', formData.step1.email);
          localStorage.setItem('proPassword', formData.step1.password);
          localStorage.setItem('proToken', `pro-${result.account.id}`);
          localStorage.setItem('proData', JSON.stringify(result.account));
          
          // 3️⃣ Rediriger vers le shell de paiement Stripe
          const planPrice = formData.step3.planType === 'basic-pro' ? 29 : 
                           formData.step3.planType === 'advanced-pro' ? 79 : 149;
          
          window.location.href = `/stripe-checkout?plan=${formData.step3.planType}&amount=${planPrice}&email=${formData.step1.email}`;
          
        } else {
          console.error('❌ Échec connexion automatique');
          setShowSuccess(true);
          toast({
            title: "Compte créé !",
            description: "Connectez-vous pour finaliser votre abonnement.",
          });
        }
      } catch (error) {
        console.error('❌ Erreur auto-login:', error);
        setShowSuccess(true);
        toast({
          title: "Compte créé !",
          description: "Connectez-vous pour finaliser votre abonnement.",
        });
      }
    };

    autoLoginAndPay();
  };

  // Gestion du retour depuis la vérification email
  const handleBackFromVerification = () => {
    setShowEmailVerification(false);
  };

  // Gestion de la continuation après le succès
  const handleContinue = () => {
    // Sauvegarder les données pro et rediriger
    if (createdAccount) {
      const token = `pro-${createdAccount.id}`;
      localStorage.setItem('proToken', token);
      localStorage.setItem('proData', JSON.stringify(createdAccount));
    }
    
    // CORRECTION: Redirection vers dashboard au lieu de "/"  
    setLocation('/dashboard');
  };

  const plans = {
    "basic-pro": {
      name: "Plan Basic Pro",
      price: "29€/mois",
      features: [
        "Gestion des rendez-vous",
        "Base de données clients",
        "Calendrier intégré",
        "Support email",
      ],
      color: "blue",
      icon: <CheckCircle className="w-5 h-5 text-white" />,
    },
    "advanced-pro": {
      name: "Plan Advanced Pro", 
      price: "79€/mois",
      features: [
        "Tout du plan Basic Pro",
        "Gestion des stocks",
        "Notifications SMS",
        "Système de fidélité",
        "Statistiques détaillées",
      ],
      color: "green",
      icon: <Building className="w-5 h-5 text-white" />,
    },
    "premium-pro": {
      name: "Plan Premium Pro", 
      price: "149€/mois",
      features: [
        "Tout du plan Advanced Pro",
        "Intelligence Artificielle",
        "Messagerie directe clients",
        "Analytics avancés",
        "Support prioritaire",
      ],
      color: "violet",
      icon: <Crown className="w-5 h-5 text-white" />,
    },
  };

  const currentPlan = plans[step3Form.watch("planType")];

  // Si on est en phase de vérification email
  if (showEmailVerification && !showSuccess) {
    const completeUserData = {
      // Données étape 1 (infos personnelles)
      ownerFirstName: formData.step1.firstName,
      ownerLastName: formData.step1.lastName,
      email: formData.step1.email,
      password: formData.step1.password,
      phone: formData.step1.phone,
      
      // Données étape 2 (infos business)
      businessName: formData.step2.companyName,
      businessType: "salon",
      siret: formData.step2.siret,
      address: formData.step2.businessAddress,
      city: formData.step2.businessCity,
      postalCode: formData.step2.businessPostalCode,
      legalForm: formData.step2.legalForm,
      vatNumber: formData.step2.vatNumber || "",
      description: "",
      
      // Données étape 3 (plan et conditions) - Support multiple formats
      planType: formData.step3.planType || finalSelectedPlan || 'basic-pro',
      subscriptionPlan: formData.step3.planType || finalSelectedPlan || 'basic-pro',
      plan: formData.step3.planType || finalSelectedPlan || 'basic-pro',
    };

    // Inscription directe sans vérification email
    const registerAccount = async () => {
      try {
        const response = await fetch('/api/register/professional', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(completeUserData),
        });

        const data = await response.json();

        if (response.ok) {
          handleEmailVerificationSuccess({ account: data.account });
        } else {
          throw new Error(data.error || "Erreur lors de la création du compte");
        }
      } catch (error: any) {
        console.error('Erreur inscription:', error);
        setShowEmailVerification(false);
      }
    };

    registerAccount();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Création de votre compte en cours...</p>
        </div>
      </div>
    );
  }

  // Si on est en phase de succès
  if (showSuccess && createdAccount) {
    return (
      <EmailVerificationSuccess
        userType="professional"
        account={createdAccount}
        onContinue={handleContinue}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/subscription-plans")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux plans
          </Button>
          
          <h1 className="text-2xl font-bold text-gray-900">
            Créer votre compte professionnel
          </h1>
          <p className="text-gray-600 mt-2">
            Étape {currentStep} sur 3 - {currentStep === 1 ? "Informations personnelles" : currentStep === 2 ? "Informations entreprise" : "Finalisation"}
          </p>
        </div>

        {/* Indicateur de progression */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? `${getGenericGlassButton(step)} text-white`
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step < currentStep ? <Check className="w-4 h-4" /> : step}
              </div>
              {step < 3 && (
                <div
                  className={`flex-1 h-1 mx-4 ${
                    step < currentStep ? `${getGenericGlassButton(step + 3)}` : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Étape 1: Informations personnelles */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={step1Form.handleSubmit(handleStep1Next)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      {...step1Form.register("firstName")}
                      placeholder="Votre prénom"
                    />
                    {step1Form.formState.errors.firstName && (
                      <p className="text-sm text-red-600 mt-1">
                        {step1Form.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      {...step1Form.register("lastName")}
                      placeholder="Votre nom"
                    />
                    {step1Form.formState.errors.lastName && (
                      <p className="text-sm text-red-600 mt-1">
                        {step1Form.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email professionnel *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...step1Form.register("email")}
                    placeholder="votre@email.com"
                  />
                  {step1Form.formState.errors.email && (
                    <p className="text-sm text-red-600 mt-1">
                      {step1Form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input
                    id="phone"
                    {...step1Form.register("phone")}
                    placeholder="06 12 34 56 78"
                  />
                  {step1Form.formState.errors.phone && (
                    <p className="text-sm text-red-600 mt-1">
                      {step1Form.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password">Mot de passe *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...step1Form.register("password")}
                      placeholder="Minimum 8 caractères"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {step1Form.formState.errors.password && (
                    <p className="text-sm text-red-600 mt-1">
                      {step1Form.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      {...step1Form.register("confirmPassword")}
                      placeholder="Confirmer votre mot de passe"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {step1Form.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-600 mt-1">
                      {step1Form.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full">
                  Suivant
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Étape 2: Informations entreprise */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Informations entreprise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={step2Form.handleSubmit(handleStep2Next)} className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Nom de l'entreprise *</Label>
                  <Input
                    id="companyName"
                    {...step2Form.register("companyName")}
                    placeholder="Nom de votre salon"
                  />
                  {step2Form.formState.errors.companyName && (
                    <p className="text-sm text-red-600 mt-1">
                      {step2Form.formState.errors.companyName.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siret">SIRET *</Label>
                    <Input
                      id="siret"
                      {...step2Form.register("siret")}
                      placeholder="12345678901234"
                      maxLength={14}
                    />
                    {step2Form.formState.errors.siret && (
                      <p className="text-sm text-red-600 mt-1">
                        {step2Form.formState.errors.siret.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="legalForm">Forme juridique *</Label>
                    <Select 
                      value={step2Form.watch("legalForm")} 
                      onValueChange={(value) => step2Form.setValue("legalForm", value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SARL">SARL</SelectItem>
                        <SelectItem value="SAS">SAS</SelectItem>
                        <SelectItem value="EURL">EURL</SelectItem>
                        <SelectItem value="Auto-entrepreneur">Auto-entrepreneur</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    {step2Form.formState.errors.legalForm && (
                      <p className="text-sm text-red-600 mt-1">
                        {step2Form.formState.errors.legalForm.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="businessAddress">Adresse du salon *</Label>
                  <Input
                    id="businessAddress"
                    {...step2Form.register("businessAddress")}
                    placeholder="123 rue de la Beauté"
                  />
                  {step2Form.formState.errors.businessAddress && (
                    <p className="text-sm text-red-600 mt-1">
                      {step2Form.formState.errors.businessAddress.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessCity">Ville *</Label>
                    <Input
                      id="businessCity"
                      {...step2Form.register("businessCity")}
                      placeholder="Paris"
                    />
                    {step2Form.formState.errors.businessCity && (
                      <p className="text-sm text-red-600 mt-1">
                        {step2Form.formState.errors.businessCity.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="businessPostalCode">Code postal *</Label>
                    <Input
                      id="businessPostalCode"
                      {...step2Form.register("businessPostalCode")}
                      placeholder="75001"
                      maxLength={5}
                    />
                    {step2Form.formState.errors.businessPostalCode && (
                      <p className="text-sm text-red-600 mt-1">
                        {step2Form.formState.errors.businessPostalCode.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="vatNumber">Numéro TVA (optionnel)</Label>
                  <Input
                    id="vatNumber"
                    {...step2Form.register("vatNumber")}
                    placeholder="FR12345678901"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Précédent
                  </Button>
                  <Button type="submit" className="flex-1">
                    Suivant
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Étape 3: Récapitulatif et plan */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {/* Plan sélectionné */}
            <Card className={`border-${currentPlan.color}-200 bg-gradient-to-r from-${currentPlan.color}-50 to-${currentPlan.color}-100`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-${currentPlan.color}-600 rounded-full flex items-center justify-center`}>
                      {currentPlan.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {currentPlan.name}
                      </h3>
                      <p className="text-2xl font-bold text-gray-900">
                        {currentPlan.price}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocation("/subscription-plans")}
                  >
                    Changer
                  </Button>
                </div>
                <ul className="space-y-2">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Finalisation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Finalisation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={step3Form.handleSubmit(handleFinalSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="billingName">Nom pour facturation (optionnel)</Label>
                    <Input
                      id="billingName"
                      {...step3Form.register("billingName")}
                      placeholder="Si différent du nom d'entreprise"
                    />
                  </div>

                  <div>
                    <Label htmlFor="billingAddress">Adresse de facturation (optionnel)</Label>
                    <Input
                      id="billingAddress"
                      {...step3Form.register("billingAddress")}
                      placeholder="Si différente de l'adresse du salon"
                    />
                  </div>

                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      {...step3Form.register("acceptTerms")}
                      className="mt-1"
                    />
                    <Label htmlFor="acceptTerms" className="text-sm">
                      J'accepte les{" "}
                      <a href="/terms" className="text-violet-600 hover:underline">
                        conditions générales d'utilisation
                      </a>{" "}
                      et la{" "}
                      <a href="/privacy" className="text-violet-600 hover:underline">
                        politique de confidentialité
                      </a>
                    </Label>
                  </div>
                  {step3Form.formState.errors.acceptTerms && (
                    <p className="text-sm text-red-600">
                      {step3Form.formState.errors.acceptTerms.message}
                    </p>
                  )}

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Essai gratuit 7 jours - sans engagement</strong> - Aucun prélèvement immédiat.
                      Vous pourrez annuler à tout moment pendant la période d'essai.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="flex-1"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Précédent
                    </Button>
                    <Button 
                      type="submit" 
                      className={`flex-1 ${getGenericGlassButton(2)}`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Création...
                        </div>
                      ) : (
                        <>
                          Procéder au paiement
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}