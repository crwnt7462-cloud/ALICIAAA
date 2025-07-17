import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ArrowRight,
  Gift, 
  Check, 
  Clock, 
  Users, 
  Star,
  Shield,
  Crown,
  Building,
  MapPin,
  User,
  Mail,
  Phone,
  FileText,
  CreditCard,
  CheckCircle,
  Sparkles,
  Zap,
  Award,
  Briefcase,
  Globe,
  Lock
} from "lucide-react";

export default function FreeTrialSignup() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Informations personnelles
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Informations business
    businessName: '',
    siret: '',
    businessType: '',
    businessAddress: '',
    businessCity: '',
    businessPostalCode: '',
    
    // Informations légales
    legalForm: '',
    vatNumber: '',
    
    // Informations de facturation
    billingName: '',
    billingAddress: '',
    billingCity: '',
    billingPostalCode: '',
    sameBillingAddress: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    console.log("Formulaire soumis:", formData);
    setStep(4); // Page de confirmation
  };

  const validateStep = () => {
    if (step === 1) {
      return formData.firstName && formData.lastName && formData.email && formData.phone;
    } else if (step === 2) {
      return formData.businessName && formData.siret && formData.businessType && 
             formData.businessAddress && formData.businessCity && formData.businessPostalCode;
    } else if (step === 3) {
      return formData.legalForm;
    }
    return true;
  };

  if (step === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50/30">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Inscription validée !
                </h1>
              </div>
              <p className="text-gray-600">
                Votre compte professionnel a été créé avec succès
              </p>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader className="space-y-1 pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <CardTitle className="text-xl text-center text-gray-900">
                    Bienvenue !
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span>14 jours d'essai gratuit complet</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Users className="w-4 h-4 text-green-600" />
                    <span>Support client prioritaire</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>Aucune carte bancaire requise</span>
                  </div>
                </div>

                <Button 
                  onClick={() => setLocation("/dashboard")}
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-11"
                >
                  Accéder à mon espace professionnel
                </Button>

                <p className="text-center text-xs text-gray-500 mt-4">
                  Un email de confirmation vous a été envoyé
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50/30">
      {/* Header minimaliste */}
      <div className="p-4">
        <Button
          variant="ghost"
          onClick={() => setLocation("/professional-plans")}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux plans
        </Button>
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="w-full max-w-lg">
          {/* Logo/Titre */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Inscription Professionnelle
              </h1>
            </div>
            <p className="text-gray-600">
              Créez votre compte et testez gratuitement 14 jours
            </p>
          </div>

          {/* Progress simple */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Étape {step} sur 3</span>
              <span className="text-sm text-gray-500">{Math.round((step / 3) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-violet-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1 pb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-violet-600" />
                <CardTitle className="text-xl text-center text-gray-900">
                  {step === 1 && 'Informations personnelles'}
                  {step === 2 && 'Votre établissement'}
                  {step === 3 && 'Informations légales'}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Étape 1: Informations personnelles */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        Prénom
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Jean"
                          className="pl-10 h-11"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        Nom
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Dupont"
                          className="pl-10 h-11"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email professionnel
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="contact@monsalon.fr"
                        className="pl-10 h-11"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Téléphone
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="01 23 45 67 89"
                        className="pl-10 h-11"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

            {/* Étape 2: Informations business */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Nom de l'établissement *</Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Salon Beauté Élégance"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siret">Numéro SIRET *</Label>
                    <Input
                      id="siret"
                      name="siret"
                      value={formData.siret}
                      onChange={handleInputChange}
                      placeholder="12345678901234"
                      maxLength={14}
                      required
                    />
                    <p className="text-xs text-gray-500">14 chiffres sans espaces</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Type d'établissement *</Label>
                    <select
                      id="businessType"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                      required
                    >
                      <option value="">Sélectionnez</option>
                      <option value="salon">Salon de coiffure</option>
                      <option value="spa">Spa / Institut</option>
                      <option value="barbershop">Barbershop</option>
                      <option value="institute">Institut de beauté</option>
                      <option value="freelance">Freelance beauté</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Adresse de l'établissement *</Label>
                  <Input
                    id="businessAddress"
                    name="businessAddress"
                    value={formData.businessAddress}
                    onChange={handleInputChange}
                    placeholder="123 rue de la Beauté"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessCity">Ville *</Label>
                    <Input
                      id="businessCity"
                      name="businessCity"
                      value={formData.businessCity}
                      onChange={handleInputChange}
                      placeholder="Paris"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessPostalCode">Code postal *</Label>
                    <Input
                      id="businessPostalCode"
                      name="businessPostalCode"
                      value={formData.businessPostalCode}
                      onChange={handleInputChange}
                      placeholder="75001"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Étape 3: Informations légales */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="legalForm">Forme juridique *</Label>
                  <select
                    id="legalForm"
                    name="legalForm"
                    value={formData.legalForm}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                    required
                  >
                    <option value="">Sélectionnez</option>
                    <option value="eurl">EURL</option>
                    <option value="sarl">SARL</option>
                    <option value="sas">SAS</option>
                    <option value="sasu">SASU</option>
                    <option value="ei">Entreprise individuelle</option>
                    <option value="micro">Micro-entreprise</option>
                    <option value="auto">Auto-entrepreneur</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vatNumber">Numéro de TVA (optionnel)</Label>
                  <Input
                    id="vatNumber"
                    name="vatNumber"
                    value={formData.vatNumber}
                    onChange={handleInputChange}
                    placeholder="FR12345678901"
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Adresse de facturation
                  </h4>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="sameBillingAddress"
                      name="sameBillingAddress"
                      checked={formData.sameBillingAddress}
                      onChange={handleInputChange}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="sameBillingAddress" className="text-sm">
                      Identique à l'adresse de l'établissement
                    </Label>
                  </div>

                  {!formData.sameBillingAddress && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="billingName">Nom pour facturation</Label>
                        <Input
                          id="billingName"
                          name="billingName"
                          value={formData.billingName}
                          onChange={handleInputChange}
                          placeholder="Nom ou raison sociale"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="billingAddress">Adresse de facturation</Label>
                        <Input
                          id="billingAddress"
                          name="billingAddress"
                          value={formData.billingAddress}
                          onChange={handleInputChange}
                          placeholder="Adresse complète"
                        />
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="billingCity">Ville</Label>
                          <Input
                            id="billingCity"
                            name="billingCity"
                            value={formData.billingCity}
                            onChange={handleInputChange}
                            placeholder="Paris"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billingPostalCode">Code postal</Label>
                          <Input
                            id="billingPostalCode"
                            name="billingPostalCode"
                            value={formData.billingPostalCode}
                            onChange={handleInputChange}
                            placeholder="75001"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

              {/* Boutons de navigation */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  disabled={step === 1}
                  className="h-11"
                >
                  Précédent
                </Button>
                
                <Button
                  onClick={handleNextStep}
                  disabled={!validateStep()}
                  className="bg-violet-600 hover:bg-violet-700 text-white h-11"
                >
                  {step === 3 ? "Créer mon compte" : "Suivant"}
                </Button>
              </div>

              {/* Conditions */}
              <div className="mt-6 text-center text-sm text-gray-600">
                <p>
                  En créant votre compte, vous acceptez nos{" "}
                  <a href="#" className="text-violet-600 hover:underline">
                    conditions d'utilisation
                  </a>{" "}
                  et notre{" "}
                  <a href="#" className="text-violet-600 hover:underline">
                    politique de confidentialité
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}