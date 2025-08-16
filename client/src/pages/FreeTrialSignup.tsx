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
  Lock,
  Hash,
  ChevronDown,
  Building2,
  Home
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
    businessPhone: '',
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

  const handleSubmit = async () => {
    try {
      console.log("Formulaire soumis:", formData);
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 500));
      setStep(4); // Page de confirmation
    } catch (error) {
      console.error("Erreur lors de la création du compte:", error);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateSiret = (siret: string) => {
    return siret.length === 14 && /^\d+$/.test(siret);
  };

  const validatePostalCode = (postalCode: string) => {
    return /^\d{5}$/.test(postalCode);
  };

  const validatePhone = (phone: string) => {
    const cleanPhone = phone.replace(/[\s\-\.]/g, '');
    return /^(\+33|0)[1-9](\d{8})$/.test(cleanPhone);
  };

  const validateStep = () => {
    if (step === 1) {
      return formData.firstName && 
             formData.lastName && 
             formData.email && validateEmail(formData.email) &&
             formData.phone && validatePhone(formData.phone);
    } else if (step === 2) {
      return formData.businessName && 
             formData.siret && validateSiret(formData.siret) &&
             formData.businessType && 
             formData.businessAddress && 
             formData.businessCity && 
             formData.businessPostalCode && validatePostalCode(formData.businessPostalCode);
    } else if (step === 3) {
      return formData.legalForm && 
             formData.billingName && 
             formData.billingAddress && 
             formData.billingCity && 
             formData.billingPostalCode && validatePostalCode(formData.billingPostalCode);
    }
    return true;
  };

  if (step === 4) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="w-full max-w-md text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Compte créé avec succès !
              </h1>
              <p className="text-gray-600">
                Votre essai gratuit 7 jours - sans engagement a commencé
              </p>
            </div>

            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Essai gratuit 7 jours - sans engagement</div>
                      <div className="text-gray-500">Accès complet à toutes les fonctionnalités</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Support client inclus</div>
                      <div className="text-gray-500">Aide prioritaire pendant votre essai</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Aucun engagement</div>
                      <div className="text-gray-500">Annulation libre à tout moment</div>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => setLocation("/dashboard")}
                  className="w-full h-11 bg-violet-600 hover:bg-violet-700 text-white"
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
    <div className="min-h-screen bg-gray-50">
      {/* Header simple */}
      <div className="p-4 border-b bg-white">
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
        <div className="w-full max-w-md">
          {/* Header simple comme Avyento */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Créer un compte professionnel
            </h1>
            <p className="text-gray-600">
              Essai gratuit 7 jours - sans engagement
            </p>
          </div>

          {/* Progress simple comme Avyento */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
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

          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium text-gray-900 text-center">
                {step === 1 && 'Vos informations'}
                {step === 2 && 'Votre établissement'}
                {step === 3 && 'Informations légales'}
              </CardTitle>
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
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Jean"
                        className="h-10 border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        Nom
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Dupont"
                        className="h-10 border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email professionnel
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="contact@monsalon.fr"
                      className={`h-10 border-gray-300 focus:ring-violet-500 ${
                        formData.email && !validateEmail(formData.email) 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'focus:border-violet-500'
                      }`}
                      required
                    />
                    {formData.email && !validateEmail(formData.email) && (
                      <p className="text-xs text-red-500">Format d'email invalide</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Téléphone
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="01 23 45 67 89"
                      className={`h-10 border-gray-300 focus:ring-violet-500 ${
                        formData.phone && !validatePhone(formData.phone) 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'focus:border-violet-500'
                      }`}
                      required
                    />
                    {formData.phone && !validatePhone(formData.phone) && (
                      <p className="text-xs text-red-500">Format de téléphone invalide</p>
                    )}
                  </div>
                </div>
              )}

            {/* Étape 2: Informations business */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="text-sm font-medium text-gray-700">
                    Nom de l'établissement
                  </Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Salon Beauté Élégance"
                    className="h-10 border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessType" className="text-sm font-medium text-gray-700">
                    Type d'établissement
                  </Label>
                  <select
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white"
                    required
                  >
                    <option value="">Sélectionnez votre activité</option>
                    <option value="salon">Salon de coiffure</option>
                    <option value="spa">Spa / Institut</option>
                    <option value="barbershop">Barbershop</option>
                    <option value="institute">Institut de beauté</option>
                    <option value="nails">Salon d'onglerie</option>
                    <option value="wellness">Centre de bien-être</option>
                    <option value="freelance">Freelance beauté</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="siret" className="text-sm font-medium text-gray-700">
                      SIRET
                    </Label>
                    <Input
                      id="siret"
                      name="siret"
                      value={formData.siret}
                      onChange={handleInputChange}
                      placeholder="12345678901234"
                      className={`h-10 border-gray-300 focus:ring-violet-500 ${
                        formData.siret && !validateSiret(formData.siret) 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'focus:border-violet-500'
                      }`}
                      maxLength={14}
                      required
                    />
                    {formData.siret && !validateSiret(formData.siret) && (
                      <p className="text-xs text-red-500">Format invalide (14 chiffres)</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessPhone" className="text-sm font-medium text-gray-700">
                      Téléphone salon
                    </Label>
                    <Input
                      id="businessPhone"
                      name="businessPhone"
                      type="tel"
                      value={formData.businessPhone || ''}
                      onChange={handleInputChange}
                      placeholder="01 23 45 67 89"
                      className="h-10 border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessAddress" className="text-sm font-medium text-gray-700">
                    Adresse complète
                  </Label>
                  <Input
                    id="businessAddress"
                    name="businessAddress"
                    value={formData.businessAddress}
                    onChange={handleInputChange}
                    placeholder="123 rue de la Beauté"
                    className="h-10 border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="businessCity" className="text-sm font-medium text-gray-700">
                      Ville
                    </Label>
                    <Input
                      id="businessCity"
                      name="businessCity"
                      value={formData.businessCity}
                      onChange={handleInputChange}
                      placeholder="Paris"
                      className="h-10 border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessPostalCode" className="text-sm font-medium text-gray-700">
                      Code postal
                    </Label>
                    <Input
                      id="businessPostalCode"
                      name="businessPostalCode"
                      value={formData.businessPostalCode}
                      onChange={handleInputChange}
                      placeholder="75001"
                      className={`h-10 border-gray-300 focus:ring-violet-500 ${
                        formData.businessPostalCode && !validatePostalCode(formData.businessPostalCode) 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'focus:border-violet-500'
                      }`}
                      maxLength={5}
                      required
                    />
                    {formData.businessPostalCode && !validatePostalCode(formData.businessPostalCode) && (
                      <p className="text-xs text-red-500">Code postal invalide</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Étape 3: Informations légales */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="legalForm" className="text-sm font-medium text-gray-700">
                    Forme juridique
                  </Label>
                  <select
                    id="legalForm"
                    name="legalForm"
                    value={formData.legalForm}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white"
                    required
                  >
                    <option value="">Sélectionnez votre statut</option>
                    <option value="auto">Auto-entrepreneur</option>
                    <option value="micro">Micro-entreprise</option>
                    <option value="ei">Entreprise individuelle</option>
                    <option value="eurl">EURL</option>
                    <option value="sarl">SARL</option>
                    <option value="sas">SAS</option>
                    <option value="sasu">SASU</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vatNumber" className="text-sm font-medium text-gray-700">
                    Numéro de TVA (optionnel)
                  </Label>
                  <Input
                    id="vatNumber"
                    name="vatNumber"
                    value={formData.vatNumber}
                    onChange={handleInputChange}
                    placeholder="FR12345678901"
                    className="h-10 border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                  />
                </div>

                {/* Section facturation */}
                <div className="bg-gray-50 rounded-lg p-4 mt-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Informations de facturation
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="billingName" className="text-sm font-medium text-gray-700">
                        Nom de facturation
                      </Label>
                      <Input
                        id="billingName"
                        name="billingName"
                        value={formData.billingName}
                        onChange={handleInputChange}
                        placeholder="Nom ou raison sociale"
                        className="h-10 border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="billingAddress" className="text-sm font-medium text-gray-700">
                        Adresse de facturation
                      </Label>
                      <Input
                        id="billingAddress"
                        name="billingAddress"
                        value={formData.billingAddress}
                        onChange={handleInputChange}
                        placeholder="Adresse complète"
                        className="h-10 border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="billingCity" className="text-sm font-medium text-gray-700">
                          Ville
                        </Label>
                        <Input
                          id="billingCity"
                          name="billingCity"
                          value={formData.billingCity}
                          onChange={handleInputChange}
                          placeholder="Paris"
                          className="h-10 border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billingPostalCode" className="text-sm font-medium text-gray-700">
                          Code postal
                        </Label>
                        <Input
                          id="billingPostalCode"
                          name="billingPostalCode"
                          value={formData.billingPostalCode}
                          onChange={handleInputChange}
                          placeholder="75001"
                          className={`h-10 border-gray-300 focus:ring-violet-500 ${
                            formData.billingPostalCode && !validatePostalCode(formData.billingPostalCode) 
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                              : 'focus:border-violet-500'
                          }`}
                          maxLength={5}
                          required
                        />
                        {formData.billingPostalCode && !validatePostalCode(formData.billingPostalCode) && (
                          <p className="text-xs text-red-500">Code postal invalide</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

              {/* Boutons navigation simple */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  disabled={step === 1}
                  className="h-10 px-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Précédent
                </Button>
                
                <Button
                  onClick={handleNextStep}
                  disabled={!validateStep()}
                  className="h-10 px-6 bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50"
                >
                  {step === 3 ? "Créer mon compte" : "Suivant"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {/* Conditions simples */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
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