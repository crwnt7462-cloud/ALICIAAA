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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50/30 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Inscription professionnelle validée !
            </h2>
            
            <p className="text-gray-600 mb-6">
              Votre compte professionnel a été créé avec succès. Vous avez maintenant accès à toutes les fonctionnalités pendant 14 jours gratuitement.
            </p>
            
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
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Accéder à mon espace professionnel
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50/30">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header simple */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/professional-plans")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux plans
          </Button>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Building className="w-8 h-8 text-violet-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Inscription Professionnelle
              </h1>
            </div>
            
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Créez votre compte professionnel et testez toutes nos fonctionnalités gratuitement pendant 14 jours.
            </p>
          </div>
        </div>

        {/* Progress Bar simple */}
        <div className="mb-8">
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {step === 1 && (
                <>
                  <User className="w-5 h-5 text-violet-600" />
                  Informations personnelles
                </>
              )}
              {step === 2 && (
                <>
                  <Building className="w-5 h-5 text-violet-600" />
                  Informations de l'établissement
                </>
              )}
              {step === 3 && (
                <>
                  <FileText className="w-5 h-5 text-violet-600" />
                  Informations légales et facturation
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Étape 1: Informations personnelles */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Jean"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Dupont"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email professionnel *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="jean.dupont@monsalon.fr"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="01 23 45 67 89"
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

            {/* Boutons de navigation */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
              >
                Précédent
              </Button>
              
              <Button
                onClick={handleNextStep}
                disabled={!validateStep()}
                className="bg-violet-600 hover:bg-violet-700"
              >
                {step === 3 ? (
                  <>
                    <Gift className="w-4 h-4 mr-2" />
                    Créer mon compte
                  </>
                ) : (
                  "Suivant"
                )}
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
  );
}