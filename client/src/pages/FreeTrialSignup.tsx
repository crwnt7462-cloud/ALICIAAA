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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center">
        {/* Background luxueux */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/30 via-slate-900 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 via-transparent to-purple-600/20"></div>
        
        {/* Confettis d'or */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-amber-400 rounded-full animate-bounce delay-100"></div>
        <div className="absolute top-32 right-32 w-3 h-3 bg-purple-400 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-20 left-32 w-2 h-2 bg-amber-400 rounded-full animate-bounce delay-500"></div>
        
        <Card className="max-w-2xl w-full mx-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl relative z-10">
          <CardContent className="p-12 text-center">
            {/* Logo de succès animé */}
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Crown className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-amber-200 to-purple-200 bg-clip-text text-transparent mb-6">
              Bienvenue dans l'Élite !
            </h2>
            
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Félicitations ! Votre compte professionnel premium a été créé avec succès. 
              Vous rejoignez maintenant l'élite des professionnels de la beauté.
            </p>
            
            {/* Avantages premium */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold">14 jours gratuits</div>
                    <div className="text-white/60 text-sm">Accès complet illimité</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold">Support VIP</div>
                    <div className="text-white/60 text-sm">Assistance prioritaire 24/7</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold">Sans engagement</div>
                    <div className="text-white/60 text-sm">Aucune carte bancaire</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold">IA Premium</div>
                    <div className="text-white/60 text-sm">Assistant intelligent</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Prochaines étapes */}
            <div className="bg-gradient-to-r from-purple-600/20 to-amber-600/20 rounded-xl p-6 mb-8 border border-white/10">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Prochaines étapes recommandées
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div className="text-white/80">Configurer votre salon</div>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div className="text-white/80">Ajouter vos services</div>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div className="text-white/80">Recevoir vos clients</div>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => setLocation("/dashboard")}
              className="w-full h-14 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold text-lg shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Crown className="w-6 h-6 mr-3" />
              Accéder à mon espace VIP
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
            
            <p className="text-white/50 text-sm mt-6">
              Un email de bienvenue vous a été envoyé avec tous les détails de votre compte premium.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background luxueux */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900 to-black"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-amber-600/10"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Header Premium */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={() => setLocation("/professional-plans")}
              className="text-white/70 hover:text-white hover:bg-white/10 border border-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux plans
            </Button>
            
            <div className="flex items-center gap-2 text-white/60">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Sécurisé SSL</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600/20 to-amber-600/20 backdrop-blur-lg border border-white/10 rounded-2xl px-6 py-3 mb-6">
              <Crown className="w-6 h-6 text-amber-400" />
              <span className="text-white font-medium">Inscription Exclusive</span>
              <Badge className="bg-amber-500 text-black font-bold px-3">14 jours gratuits</Badge>
            </div>
            
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-amber-200 bg-clip-text text-transparent mb-6">
              Rejoignez l'Élite Beauté
            </h1>
            
            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Accédez à la plateforme premium utilisée par les professionnels de la beauté les plus prestigieux
            </p>
            
            {/* Stats premium */}
            <div className="flex items-center justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">10,000+</div>
                <div className="text-white/60 text-sm">Professionnels</div>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-white/60 text-sm">Uptime</div>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">4.9/5</div>
                <div className="text-white/60 text-sm">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar Premium */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-lg font-semibold text-white">Étape {step} sur 3</span>
              <Badge className="bg-gradient-to-r from-purple-600 to-amber-600 text-white font-bold">
                {Math.round((step / 3) * 100)}% Complété
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <Lock className="w-4 h-4" />
              <span className="text-sm">Données cryptées</span>
            </div>
          </div>
          
          {/* Progress steps */}
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold transition-all duration-500 ${
                  stepNum < step 
                    ? 'bg-gradient-to-r from-purple-600 to-amber-600 border-amber-400 text-white' 
                    : stepNum === step
                    ? 'bg-gradient-to-r from-purple-600 to-amber-600 border-amber-400 text-white animate-pulse'
                    : 'border-white/30 text-white/50'
                }`}>
                  {stepNum < step ? <Check className="w-6 h-6" /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-24 h-1 mx-4 rounded-full transition-all duration-500 ${
                    stepNum < step ? 'bg-gradient-to-r from-purple-600 to-amber-600' : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          {/* Step labels */}
          <div className="flex justify-between text-sm text-white/70">
            <span className={step >= 1 ? 'text-white font-medium' : ''}>Profil</span>
            <span className={step >= 2 ? 'text-white font-medium' : ''}>Établissement</span>
            <span className={step >= 3 ? 'text-white font-medium' : ''}>Légal</span>
          </div>
        </div>

        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="flex items-center gap-3 text-white text-xl">
              {step === 1 && (
                <>
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-amber-600 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  Votre Profil Professionnel
                </>
              )}
              {step === 2 && (
                <>
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-amber-600 rounded-lg flex items-center justify-center">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  Votre Établissement
                </>
              )}
              {step === 3 && (
                <>
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-amber-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  Informations Légales
                </>
              )}
              <Badge className="ml-auto bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Confidentiel
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {/* Étape 1: Informations personnelles */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="firstName" className="text-white/90 font-medium text-sm uppercase tracking-wide">
                      Prénom *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Jean"
                        className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/15 focus:border-amber-400 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="lastName" className="text-white/90 font-medium text-sm uppercase tracking-wide">
                      Nom de famille *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Dupont"
                        className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/15 focus:border-amber-400 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email" className="text-white/90 font-medium text-sm uppercase tracking-wide">
                    Email professionnel *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="jean.dupont@monsalon.fr"
                      className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/15 focus:border-amber-400 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-white/90 font-medium text-sm uppercase tracking-wide">
                    Téléphone professionnel *
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+33 1 23 45 67 89"
                      className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/15 focus:border-amber-400 transition-all duration-300"
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

            {/* Boutons de navigation Premium */}
            <div className="flex justify-between items-center pt-8 border-t border-white/10">
              <Button
                variant="ghost"
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
                className="h-12 px-6 text-white/70 hover:text-white hover:bg-white/10 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Précédent
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="text-white/60 text-sm">
                  {validateStep() ? (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400" />
                      Étape validée
                    </div>
                  ) : (
                    "Veuillez remplir tous les champs"
                  )}
                </div>
                
                <Button
                  onClick={handleNextStep}
                  disabled={!validateStep()}
                  className="h-12 px-8 bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {step === 3 ? (
                    <>
                      <Crown className="w-5 h-5 mr-2" />
                      Rejoindre l'Élite
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

            {/* Garanties et conditions premium */}
            <div className="mt-8 space-y-4">
              {/* Garanties de sécurité */}
              <div className="flex items-center justify-center gap-6 text-white/60 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Chiffrement SSL</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>RGPD Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>Certification ISO</span>
                </div>
              </div>
              
              {/* Conditions */}
              <div className="text-center text-sm text-white/50">
                <p>
                  En rejoignant notre plateforme, vous acceptez nos{" "}
                  <a href="#" className="text-amber-400 hover:text-amber-300 hover:underline font-medium">
                    conditions d'utilisation premium
                  </a>{" "}
                  et notre{" "}
                  <a href="#" className="text-amber-400 hover:text-amber-300 hover:underline font-medium">
                    politique de confidentialité renforcée
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}