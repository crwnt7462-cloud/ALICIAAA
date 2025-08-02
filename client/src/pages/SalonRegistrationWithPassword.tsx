import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Check, Eye, EyeOff } from 'lucide-react';

interface RegistrationData {
  // Informations salon
  salonName: string;
  salonType: string;
  salonAddress: string;
  salonCity: string;
  salonZipCode: string;
  salonPhone: string;
  salonDescription: string;
  
  // Informations propriétaire
  ownerFirstName: string;
  ownerLastName: string;
  ownerEmail: string;
  ownerPhone: string;
  password: string;
  confirmPassword: string;
  
  // Informations business
  siret: string;
  companyName: string;
  legalForm: string;
  vatNumber: string;
  
  // Plan sélectionné
  selectedPlan: string;
}

export default function SalonRegistrationWithPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<RegistrationData>({
    salonName: '',
    salonType: '',
    salonAddress: '',
    salonCity: '',
    salonZipCode: '',
    salonPhone: '',
    salonDescription: '',
    ownerFirstName: '',
    ownerLastName: '',
    ownerEmail: '',
    ownerPhone: '',
    password: '',
    confirmPassword: '',
    siret: '',
    companyName: '',
    legalForm: '',
    vatNumber: '',
    selectedPlan: new URLSearchParams(window.location.search).get('plan') || 'essential'
  });

  const planNames = {
    essential: 'Beauty Essential - 19€/mois',
    professional: 'Beauty Pro - 49€/mois', 
    enterprise: 'Beauty Empire - 99€/mois'
  };

  const updateFormData = (field: keyof RegistrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        return !!(formData.salonName && formData.salonType && formData.salonAddress && formData.salonCity && formData.salonZipCode && formData.salonPhone);
      case 2:
        return !!(formData.ownerFirstName && formData.ownerLastName && formData.ownerEmail && formData.ownerPhone && formData.password && formData.confirmPassword && formData.password === formData.confirmPassword);
      case 3:
        return !!(formData.siret && formData.companyName && formData.legalForm);
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      if (step < 4) setStep(step + 1);
    } else {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erreur mot de passe",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/salon/register-with-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const { registrationId, stripeClientSecret } = await response.json();
        
        // Rediriger vers le paiement Stripe
        setLocation(`/stripe-salon-payment?client_secret=${stripeClientSecret}&registration_id=${registrationId}`);
      } else {
        throw new Error('Erreur lors de l\'inscription');
      }
    } catch (error) {
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => step > 1 ? setStep(step - 1) : setLocation('/subscription-plans')}
              className="h-10 w-10 p-0 rounded-full hover:bg-violet-500/30 backdrop-blur-md border border-violet-300/20"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Inscription salon</h1>
            <div className="w-10" />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Étape {step} sur 4</span>
            <span className="text-sm text-violet-600 font-medium">
              Plan: {planNames[formData.selectedPlan as keyof typeof planNames]}
            </span>
          </div>
          <div className="w-full bg-violet-500/30 backdrop-blur-md border border-violet-300/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-violet-600 to-purple-700 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Étape 1: Informations Salon */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Informations de votre salon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="salonName">Nom du salon *</Label>
                <Input
                  id="salonName"
                  value={formData.salonName}
                  onChange={(e) => updateFormData('salonName', e.target.value)}
                  placeholder="Ex: Salon Excellence Paris"
                />
              </div>

              <div>
                <Label htmlFor="salonType">Type de salon *</Label>
                <Select value={formData.salonType} onValueChange={(value) => updateFormData('salonType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coiffure">Salon de coiffure</SelectItem>
                    <SelectItem value="esthetique">Institut de beauté</SelectItem>
                    <SelectItem value="mixte">Salon mixte</SelectItem>
                    <SelectItem value="barbier">Barbier</SelectItem>
                    <SelectItem value="onglerie">Salon d'onglerie</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="salonAddress">Adresse *</Label>
                <Input
                  id="salonAddress"
                  value={formData.salonAddress}
                  onChange={(e) => updateFormData('salonAddress', e.target.value)}
                  placeholder="Numéro et rue"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="salonCity">Ville *</Label>
                  <Input
                    id="salonCity"
                    value={formData.salonCity}
                    onChange={(e) => updateFormData('salonCity', e.target.value)}
                    placeholder="Ville"
                  />
                </div>
                <div>
                  <Label htmlFor="salonZipCode">Code postal *</Label>
                  <Input
                    id="salonZipCode"
                    value={formData.salonZipCode}
                    onChange={(e) => updateFormData('salonZipCode', e.target.value)}
                    placeholder="75000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="salonPhone">Téléphone salon *</Label>
                <Input
                  id="salonPhone"
                  value={formData.salonPhone}
                  onChange={(e) => updateFormData('salonPhone', e.target.value)}
                  placeholder="01 23 45 67 89"
                />
              </div>

              <div>
                <Label htmlFor="salonDescription">Description (optionnel)</Label>
                <Textarea
                  id="salonDescription"
                  value={formData.salonDescription}
                  onChange={(e) => updateFormData('salonDescription', e.target.value)}
                  placeholder="Décrivez votre salon, vos spécialités..."
                  rows={3}
                />
              </div>

              <Button onClick={handleNextStep} className="w-full bg-violet-500/30 backdrop-blur-md border border-violet-300/20 hover:bg-violet-500/30 backdrop-blur-md border border-violet-300/20">
                Continuer
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Étape 2: Compte utilisateur */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Créez votre compte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ownerFirstName">Prénom *</Label>
                  <Input
                    id="ownerFirstName"
                    value={formData.ownerFirstName}
                    onChange={(e) => updateFormData('ownerFirstName', e.target.value)}
                    placeholder="Prénom"
                  />
                </div>
                <div>
                  <Label htmlFor="ownerLastName">Nom *</Label>
                  <Input
                    id="ownerLastName"
                    value={formData.ownerLastName}
                    onChange={(e) => updateFormData('ownerLastName', e.target.value)}
                    placeholder="Nom"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="ownerEmail">Email de connexion *</Label>
                <Input
                  id="ownerEmail"
                  type="email"
                  value={formData.ownerEmail}
                  onChange={(e) => updateFormData('ownerEmail', e.target.value)}
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <Label htmlFor="ownerPhone">Téléphone personnel *</Label>
                <Input
                  id="ownerPhone"
                  value={formData.ownerPhone}
                  onChange={(e) => updateFormData('ownerPhone', e.target.value)}
                  placeholder="06 12 34 56 78"
                />
              </div>

              <div>
                <Label htmlFor="password">Mot de passe *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    placeholder="Minimum 8 caractères"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                    placeholder="Répétez le mot de passe"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-sm text-red-600">Les mots de passe ne correspondent pas</p>
              )}

              <Button onClick={handleNextStep} className="w-full bg-violet-500/30 backdrop-blur-md border border-violet-300/20 hover:bg-violet-500/30 backdrop-blur-md border border-violet-300/20">
                Continuer
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Étape 3: Informations légales */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Informations légales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="siret">SIRET *</Label>
                <Input
                  id="siret"
                  value={formData.siret}
                  onChange={(e) => updateFormData('siret', e.target.value)}
                  placeholder="12345678901234"
                />
              </div>

              <div>
                <Label htmlFor="companyName">Raison sociale *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => updateFormData('companyName', e.target.value)}
                  placeholder="Nom de votre entreprise"
                />
              </div>

              <div>
                <Label htmlFor="legalForm">Forme juridique *</Label>
                <Select value={formData.legalForm} onValueChange={(value) => updateFormData('legalForm', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez la forme juridique" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto-entrepreneur">Auto-entrepreneur</SelectItem>
                    <SelectItem value="eurl">EURL</SelectItem>
                    <SelectItem value="sarl">SARL</SelectItem>
                    <SelectItem value="sas">SAS</SelectItem>
                    <SelectItem value="sasu">SASU</SelectItem>
                    <SelectItem value="ei">Entreprise individuelle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="vatNumber">Numéro TVA (optionnel)</Label>
                <Input
                  id="vatNumber"
                  value={formData.vatNumber}
                  onChange={(e) => updateFormData('vatNumber', e.target.value)}
                  placeholder="FR12345678901"
                />
              </div>

              <Button onClick={handleNextStep} className="w-full bg-violet-500/30 backdrop-blur-md border border-violet-300/20 hover:bg-violet-500/30 backdrop-blur-md border border-violet-300/20">
                Continuer
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Étape 4: Récapitulatif et validation */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Récapitulatif de votre inscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-violet-50 p-4 rounded-lg">
                <h3 className="font-semibold text-violet-900 mb-2">Plan sélectionné</h3>
                <p className="text-violet-700">{planNames[formData.selectedPlan as keyof typeof planNames]}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Salon</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{formData.salonName}</p>
                    <p>{formData.salonAddress}</p>
                    <p>{formData.salonZipCode} {formData.salonCity}</p>
                    <p>{formData.salonPhone}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{formData.ownerFirstName} {formData.ownerLastName}</p>
                    <p>{formData.ownerEmail}</p>
                    <p>{formData.ownerPhone}</p>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  En créant votre compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
                </p>

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full h-12 bg-violet-500/30 backdrop-blur-md border border-violet-300/20 hover:bg-violet-500/30 backdrop-blur-md border border-violet-300/20 text-white font-semibold"
                >
                  {isSubmitting ? "Traitement en cours..." : "Finaliser l'inscription et payer"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}