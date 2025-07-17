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

  const handleSubmit = () => {
    console.log("Formulaire soumis:", formData);
    setStep(4); // Page de confirmation
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
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Background futuriste */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-emerald-950"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.4),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(59,130,246,0.2),transparent_50%)]"></div>
        
        {/* Grille futuriste */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
          <div className="w-full max-w-lg text-center">
            {/* Animation de succès */}
            <div className="mb-8">
              <div className="relative inline-flex items-center justify-center">
                <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full blur-xl opacity-40 animate-pulse"></div>
                {/* Particules de succès */}
                <div className="absolute inset-0 animate-ping">
                  <div className="w-6 h-6 bg-emerald-400 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 opacity-60"></div>
                  <div className="w-4 h-4 bg-green-400 rounded-full absolute bottom-0 right-0 transform translate-x-8 translate-y-8 opacity-40"></div>
                  <div className="w-3 h-3 bg-emerald-300 rounded-full absolute top-1/2 left-0 transform -translate-x-12 -translate-y-1/2 opacity-50"></div>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-emerald-100 to-green-200 bg-clip-text text-transparent mt-6 mb-3">
                COMPTE ACTIVÉ
              </h1>
              <div className="h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent mb-4"></div>
              <p className="text-gray-400 text-lg">
                Bienvenue dans l'écosystème beauté de demain
              </p>
            </div>

            <Card className="border border-emerald-500/20 bg-black/60 backdrop-blur-xl shadow-2xl">
              <CardContent className="p-8">
                <div className="space-y-6 mb-8">
                  <div className="flex items-center gap-4 text-gray-300">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-white">ESSAI 14 JOURS</div>
                      <div className="text-sm text-gray-400">Accès complet premium</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-gray-300">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-white">SUPPORT 24/7</div>
                      <div className="text-sm text-gray-400">Assistance prioritaire</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-gray-300">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-white">ACTIVATION INSTANT</div>
                      <div className="text-sm text-gray-400">Prêt à l'emploi maintenant</div>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => setLocation("/dashboard")}
                  className="w-full h-14 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/25"
                >
                  ACCÉDER À MON ESPACE PRO
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <p className="text-center text-xs text-gray-500 mt-6">
                  Email de confirmation envoyé • Activation immédiate
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background futuriste */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-violet-950"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.3),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.2),transparent_50%)]"></div>
      
      {/* Grille futuriste */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      {/* Header futuriste */}
      <div className="relative z-10 p-6">
        <Button
          variant="ghost"
          onClick={() => setLocation("/professional-plans")}
          className="text-gray-400 hover:text-white bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux plans
        </Button>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-6">
        <div className="w-full max-w-lg">
          {/* Logo/Titre futuriste */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-r from-violet-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Building className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-blue-500 rounded-2xl blur opacity-30 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Inscription Pro
                </h1>
                <div className="h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent mt-2"></div>
              </div>
            </div>
            <p className="text-gray-400 text-lg">
              Rejoignez l'écosystème beauté de demain
            </p>
          </div>

          {/* Progress futuriste */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-300">ÉTAPE {step} / 3</span>
              <span className="text-sm text-violet-400 font-mono">{Math.round((step / 3) * 100)}%</span>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-800 rounded-full h-1 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full transition-all duration-500 ease-out shadow-lg"
                  style={{ width: `${(step / 3) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
              <div className="absolute -top-2 left-0 w-full flex justify-between">
                {[1, 2, 3].map((stepNum) => (
                  <div key={stepNum} className="relative">
                    <div className={`w-1 h-5 rounded-full transition-all duration-300 ${
                      stepNum <= step 
                        ? 'bg-gradient-to-b from-violet-400 to-blue-400 shadow-lg' 
                        : 'bg-gray-700'
                    }`}>
                      {stepNum <= step && (
                        <div className="absolute inset-0 bg-gradient-to-b from-violet-400 to-blue-400 rounded-full blur-sm opacity-50"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Card className="border border-white/10 bg-black/50 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:bg-black/60 hover:border-violet-500/30">
            <CardHeader className="space-y-1 pb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="relative">
                  {step === 1 && <User className="w-6 h-6 text-violet-400" />}
                  {step === 2 && <Building className="w-6 h-6 text-violet-400" />}
                  {step === 3 && <FileText className="w-6 h-6 text-violet-400" />}
                  <div className="absolute inset-0 text-violet-400 blur-sm opacity-50">
                    {step === 1 && <User className="w-6 h-6" />}
                    {step === 2 && <Building className="w-6 h-6" />}
                    {step === 3 && <FileText className="w-6 h-6" />}
                  </div>
                </div>
                <CardTitle className="text-xl text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent font-semibold">
                  {step === 1 && 'PROFIL UTILISATEUR'}
                  {step === 2 && 'DONNÉES ÉTABLISSEMENT'}
                  {step === 3 && 'VALIDATION LÉGALE'}
                </CardTitle>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"></div>
            </CardHeader>
            <CardContent className="pt-0 pb-8">
              {/* Étape 1: Informations personnelles */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                        Prénom
                      </Label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-violet-400 group-focus-within:text-violet-300 transition-colors" />
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Jean"
                          className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-violet-500 transition-all duration-300"
                          required
                        />
                        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-blue-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                        Nom
                      </Label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-violet-400 group-focus-within:text-violet-300 transition-colors" />
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Dupont"
                          className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-violet-500 transition-all duration-300"
                          required
                        />
                        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-blue-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                      Email professionnel
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-violet-400 group-focus-within:text-violet-300 transition-colors" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="contact@monsalon.fr"
                        className={`pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 transition-all duration-300 ${
                          formData.email && !validateEmail(formData.email) 
                            ? 'border-red-500/50 focus:border-red-500' 
                            : 'focus:border-violet-500'
                        }`}
                        required
                      />
                      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-blue-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                      Téléphone
                    </Label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-violet-400 group-focus-within:text-violet-300 transition-colors" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="01 23 45 67 89"
                        className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-violet-500 transition-all duration-300"
                        required
                      />
                      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-blue-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
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
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      placeholder="Salon Beauté Élégance"
                      className="pl-10 h-11"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessType" className="text-sm font-medium text-gray-700">
                    Type d'établissement
                  </Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                    <select
                      id="businessType"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      className="w-full h-11 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 appearance-none bg-white"
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
                    <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="siret" className="text-sm font-medium text-gray-700">
                      SIRET
                    </Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="siret"
                        name="siret"
                        value={formData.siret}
                        onChange={handleInputChange}
                        placeholder="12345678901234"
                        className={`pl-10 h-11 ${formData.siret && !validateSiret(formData.siret) ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                        maxLength={14}
                        required
                      />
                    </div>
                    <p className={`text-xs ${formData.siret && !validateSiret(formData.siret) ? 'text-red-500' : 'text-gray-500'}`}>
                      {formData.siret && !validateSiret(formData.siret) ? 'Format invalide' : '14 chiffres sans espaces'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessPhone" className="text-sm font-medium text-gray-700">
                      Téléphone salon
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="businessPhone"
                        name="businessPhone"
                        type="tel"
                        value={formData.businessPhone || ''}
                        onChange={handleInputChange}
                        placeholder="01 23 45 67 89"
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessAddress" className="text-sm font-medium text-gray-700">
                    Adresse complète
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="businessAddress"
                      name="businessAddress"
                      value={formData.businessAddress}
                      onChange={handleInputChange}
                      placeholder="123 rue de la Beauté"
                      className="pl-10 h-11"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="businessCity" className="text-sm font-medium text-gray-700">
                      Ville
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="businessCity"
                        name="businessCity"
                        value={formData.businessCity}
                        onChange={handleInputChange}
                        placeholder="Paris"
                        className="pl-10 h-11"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessPostalCode" className="text-sm font-medium text-gray-700">
                      Code postal
                    </Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="businessPostalCode"
                        name="businessPostalCode"
                        value={formData.businessPostalCode}
                        onChange={handleInputChange}
                        placeholder="75001"
                        className="pl-10 h-11"
                        maxLength={5}
                        required
                      />
                    </div>
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
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                    <select
                      id="legalForm"
                      name="legalForm"
                      value={formData.legalForm}
                      onChange={handleInputChange}
                      className="w-full h-11 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 appearance-none bg-white"
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
                    <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vatNumber" className="text-sm font-medium text-gray-700">
                    Numéro de TVA (optionnel)
                  </Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="vatNumber"
                      name="vatNumber"
                      value={formData.vatNumber}
                      onChange={handleInputChange}
                      placeholder="FR12345678901"
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                {/* Section facturation */}
                <div className="bg-gray-50 rounded-lg p-4 mt-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Informations de facturation
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="billingName" className="text-sm font-medium text-gray-700">
                        Nom de facturation
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="billingName"
                          name="billingName"
                          value={formData.billingName}
                          onChange={handleInputChange}
                          placeholder="Nom ou raison sociale"
                          className="pl-10 h-11"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="billingAddress" className="text-sm font-medium text-gray-700">
                        Adresse de facturation
                      </Label>
                      <div className="relative">
                        <Home className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="billingAddress"
                          name="billingAddress"
                          value={formData.billingAddress}
                          onChange={handleInputChange}
                          placeholder="Adresse complète"
                          className="pl-10 h-11"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="billingCity" className="text-sm font-medium text-gray-700">
                          Ville
                        </Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="billingCity"
                            name="billingCity"
                            value={formData.billingCity}
                            onChange={handleInputChange}
                            placeholder="Paris"
                            className="pl-10 h-11"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billingPostalCode" className="text-sm font-medium text-gray-700">
                          Code postal
                        </Label>
                        <div className="relative">
                          <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="billingPostalCode"
                            name="billingPostalCode"
                            value={formData.billingPostalCode}
                            onChange={handleInputChange}
                            placeholder="75001"
                            className="pl-10 h-11"
                            maxLength={5}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

              {/* Boutons de navigation futuristes */}
              <div className="flex justify-between pt-8">
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  disabled={step === 1}
                  className="h-12 px-6 bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:border-violet-500/50 hover:text-white transition-all duration-300 disabled:opacity-30"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  PRÉCÉDENT
                </Button>
                
                <Button
                  onClick={handleNextStep}
                  disabled={!validateStep()}
                  className="h-12 px-8 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-violet-500/25"
                >
                  {step === 3 ? (
                    <>
                      CRÉER COMPTE
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      CONTINUER
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>

              {/* Conditions futuristes */}
              <div className="mt-8 text-center">
                <div className="flex items-center justify-center gap-4 mb-4 text-xs">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Shield className="w-3 h-3" />
                    <span>SÉCURISÉ SSL</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Lock className="w-3 h-3" />
                    <span>RGPD</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Zap className="w-3 h-3" />
                    <span>INSTANTANÉ</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  En continuant, vous acceptez nos{" "}
                  <a href="#" className="text-violet-400 hover:text-violet-300 transition-colors">
                    conditions
                  </a>{" "}
                  et{" "}
                  <a href="#" className="text-violet-400 hover:text-violet-300 transition-colors">
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