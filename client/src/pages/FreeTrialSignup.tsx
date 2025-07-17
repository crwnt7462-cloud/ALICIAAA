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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-2xl w-full mx-6">
          <Card className="border-0 shadow-sm bg-gray-50/50">
            <CardContent className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-2xl mb-8">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              
              <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                Bienvenue dans notre communauté !
              </h2>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Votre compte professionnel a été créé avec succès. 
                Vous rejoignez maintenant des milliers de professionnels qui nous font confiance.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                  <Clock className="w-8 h-8 text-violet-600 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">14 jours d'essai</h3>
                  <p className="text-sm text-gray-600">Accès complet à toutes les fonctionnalités</p>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                  <Users className="w-8 h-8 text-violet-600 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">Support prioritaire</h3>
                  <p className="text-sm text-gray-600">Assistance dédiée pour votre réussite</p>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                  <Shield className="w-8 h-8 text-violet-600 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">Sans engagement</h3>
                  <p className="text-sm text-gray-600">Aucune carte bancaire requise</p>
                </div>
              </div>
              
              <div className="bg-violet-50 rounded-xl p-6 mb-8">
                <h3 className="font-medium text-gray-900 mb-4">Prochaines étapes</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-violet-600 text-white rounded-full flex items-center justify-center text-xs font-medium">1</div>
                    <span className="text-gray-700">Configurez votre salon</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-violet-600 text-white rounded-full flex items-center justify-center text-xs font-medium">2</div>
                    <span className="text-gray-700">Ajoutez vos services</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-violet-600 text-white rounded-full flex items-center justify-center text-xs font-medium">3</div>
                    <span className="text-gray-700">Recevez vos premiers clients</span>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => setLocation("/dashboard")}
                className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-medium shadow-sm"
              >
                Accéder à mon espace professionnel
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              <p className="text-sm text-gray-500 mt-6">
                Un email de confirmation vous a été envoyé avec tous les détails de votre compte.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header moderne */}
        <div className="mb-12">
          <Button
            variant="ghost"
            onClick={() => setLocation("/professional-plans")}
            className="mb-8 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux plans
          </Button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-violet-100 rounded-2xl mb-6">
              <Building className="w-8 h-8 text-violet-600" />
            </div>
            
            <h1 className="text-4xl font-semibold text-gray-900 mb-4">
              Créer votre compte professionnel
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Rejoignez des milliers de professionnels qui font confiance à notre plateforme
            </p>
          </div>
        </div>

        {/* Progress moderne */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-lg font-medium text-gray-900">Étape {step}</span>
              <span className="text-gray-400">/</span>
              <span className="text-lg text-gray-500">3</span>
            </div>
            <span className="text-sm font-medium text-violet-600 bg-violet-50 px-3 py-1 rounded-full">
              {Math.round((step / 3) * 100)}% terminé
            </span>
          </div>
          
          {/* Stepper moderne */}
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-8 right-8 h-px bg-gray-200"></div>
            <div 
              className="absolute top-5 left-8 h-px bg-violet-600 transition-all duration-500"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
            
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex flex-col items-center relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all duration-300 ${
                  stepNum < step 
                    ? 'bg-violet-600 text-white' 
                    : stepNum === step
                    ? 'bg-violet-600 text-white'
                    : 'bg-white border-2 border-gray-200 text-gray-400'
                }`}>
                  {stepNum < step ? <Check className="w-5 h-5" /> : stepNum}
                </div>
                <span className={`mt-3 text-sm font-medium ${
                  stepNum <= step ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {stepNum === 1 && 'Profil'}
                  {stepNum === 2 && 'Établissement'}
                  {stepNum === 3 && 'Informations légales'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Card className="border-0 shadow-sm bg-gray-50/50">
          <CardHeader className="pb-8">
            <CardTitle className="text-2xl font-medium text-gray-900">
              {step === 1 && 'Votre profil'}
              {step === 2 && 'Votre établissement'}
              {step === 3 && 'Informations légales'}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {step === 1 && 'Commençons par vos informations de base'}
              {step === 2 && 'Parlez-nous de votre établissement'}
              {step === 3 && 'Finalisez votre inscription'}
            </p>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            {/* Étape 1: Informations personnelles */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-900">
                      Prénom *
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Jean"
                      className="h-12 bg-white border-gray-200 focus:border-violet-600 focus:ring-violet-600"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-900">
                      Nom de famille *
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Dupont"
                      className="h-12 bg-white border-gray-200 focus:border-violet-600 focus:ring-violet-600"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-900">
                    Adresse email professionnelle *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="jean.dupont@monsalon.fr"
                    className="h-12 bg-white border-gray-200 focus:border-violet-600 focus:ring-violet-600"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-900">
                    Numéro de téléphone *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="01 23 45 67 89"
                    className="h-12 bg-white border-gray-200 focus:border-violet-600 focus:ring-violet-600"
                    required
                  />
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

            {/* Navigation moderne */}
            <div className="flex items-center justify-between pt-8 border-t border-gray-100">
              <Button
                variant="ghost"
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
                className="h-12 px-6 text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Précédent
              </Button>
              
              <div className="flex items-center gap-4">
                {!validateStep() && (
                  <span className="text-sm text-gray-500">
                    Veuillez remplir tous les champs obligatoires
                  </span>
                )}
                
                <Button
                  onClick={handleNextStep}
                  disabled={!validateStep()}
                  className="h-12 px-8 bg-violet-600 hover:bg-violet-700 text-white font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {step === 3 ? (
                    <>
                      Créer mon compte
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Continuer
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Footer moderne */}
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Sécurisé SSL</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>RGPD</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>14 jours gratuits</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600">
                En créant votre compte, vous acceptez nos{" "}
                <a href="#" className="text-violet-600 hover:text-violet-700 font-medium">
                  conditions d'utilisation
                </a>{" "}
                et notre{" "}
                <a href="#" className="text-violet-600 hover:text-violet-700 font-medium">
                  politique de confidentialité
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}