import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Phone, Clock, Shield, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const captchaInputRef = useRef<HTMLInputElement>(null);
  
  // Variables d'environnement sécurisées
  const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL || 'support@avyento.com';
  const COMPANY_NAME = import.meta.env.VITE_COMPANY_NAME || 'Avyento';
  
  // États pour le formulaire
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  // États pour le reCAPTCHA
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaChallenge, setCaptchaChallenge] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  
  // États pour la sécurité
  const [submitAttempts, setSubmitAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);
  
  // Rate limiting (max 3 tentatives par 5 minutes)
  useEffect(() => {
    if (submitAttempts >= 3) {
      setIsBlocked(true);
      const timer = setTimeout(() => {
        setIsBlocked(false);
        setSubmitAttempts(0);
      }, 5 * 60 * 1000); // 5 minutes
      return () => clearTimeout(timer);
    }
  }, [submitAttempts]);

  // Générer un défi mathématique simple
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operators = ['+', '-', '×'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    let result;
    let challenge;
    
    switch(operator) {
      case '+':
        result = num1 + num2;
        challenge = `${num1} + ${num2}`;
        break;
      case '-':
        result = Math.abs(num1 - num2);
        challenge = `${Math.max(num1, num2)} - ${Math.min(num1, num2)}`;
        break;
      case '×':
        result = num1 * num2;
        challenge = `${num1} × ${num2}`;
        break;
      default:
        result = num1 + num2;
        challenge = `${num1} + ${num2}`;
    }
    
    setCaptchaChallenge(challenge);
    return result.toString();
  };

  // Validation email sécurisée
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Sanitisation des entrées
  const sanitizeInput = (input: string): string => {
    if (!input) return '';
    return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  };

  // Valider les champs du formulaire
  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Nom manquant",
        description: "Veuillez renseigner votre nom",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.email.trim()) {
      toast({
        title: "Email manquant",
        description: "Veuillez renseigner votre email",
        variant: "destructive"
      });
      return false;
    }
    if (!validateEmail(formData.email)) {
      toast({
        title: "Email invalide",
        description: "Veuillez renseigner un email valide",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.subject.trim()) {
      toast({
        title: "Sujet manquant",
        description: "Veuillez renseigner le sujet",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.message.trim()) {
      toast({
        title: "Message manquant",
        description: "Veuillez renseigner votre message",
        variant: "destructive"
      });
      return false;
    }
    if (!gdprConsent) {
      toast({
        title: "Consentement requis",
        description: "Veuillez accepter le traitement de vos données",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  // Initier l'envoi (afficher le reCAPTCHA)
  const handleInitiateSubmit = () => {
    if (isBlocked) {
      toast({
        title: "Trop de tentatives",
        description: "Veuillez attendre 5 minutes avant de réessayer",
        variant: "destructive"
      });
      return;
    }
    
    if (!validateForm()) return;
    
    const correctAnswer = generateCaptcha();
    setCaptchaAnswer(correctAnswer);
    setShowCaptcha(true);
    setCaptchaVerified(false);
  };

  // Vérifier le reCAPTCHA et envoyer
  const handleSubmitWithCaptcha = () => {
    const userAnswer = captchaInputRef.current?.value;
    
    if (userAnswer === captchaAnswer) {
      setCaptchaVerified(true);
      setShowCaptcha(false);
      setSubmitAttempts(0); // Reset en cas de succès
      
      // Simuler l'envoi du message
      toast({
        title: "Message envoyé !",
        description: "Votre message a été transmis à notre équipe support.",
        variant: "default"
      });
      
      // Réinitialiser le formulaire
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      setGdprConsent(false);
      
      // Rediriger vers mailto en backup
      setTimeout(() => {
        window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(formData.message)}`;
      }, 1000);
      
    } else {
      setSubmitAttempts(prev => prev + 1);
      toast({
        title: "Erreur reCAPTCHA",
        description: "Réponse incorrecte. Veuillez réessayer.",
        variant: "destructive"
      });
      const correctAnswer = generateCaptcha();
      setCaptchaAnswer(correctAnswer);
    }
  };

  // Annuler le reCAPTCHA
  const handleCancelCaptcha = () => {
    setShowCaptcha(false);
    setCaptchaVerified(false);
  };

  // Gérer les changements de formulaire avec sanitisation
  const handleInputChange = (field: string, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    setFormData(prev => ({
      ...prev,
      [field]: sanitizedValue
    }));
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      description: SUPPORT_EMAIL,
      subtitle: "Réponse sous 24h",
      color: "from-blue-100 to-cyan-100"
    },
    {
      icon: Phone,
      title: "Téléphone",
      description: "01 23 45 67 89",
      subtitle: "Lundi-Vendredi 9h-18h",
      color: "from-green-100 to-emerald-100"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-gray-50/50 to-purple-50/30"
    >
      {/* Header */}
      <div className="bg-white/40 backdrop-blur-md border-b border-white/30 px-4 py-4">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLocation('/')}
            className="glass-button-secondary w-10 h-10 rounded-2xl flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Contact</h1>
            <p className="text-sm text-gray-600">Nous sommes là pour vous aider</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Méthodes de contact */}
          <div className="grid md:grid-cols-2 gap-4">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-white/30 backdrop-blur-md border-white/40">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-gray-700" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{method.title}</h3>
                      <p className="text-gray-700 mb-1">{method.description}</p>
                      <p className="text-xs text-gray-500">{method.subtitle}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Horaires */}
          <Card className="bg-white/30 backdrop-blur-md border-white/40">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Horaires d'ouverture</h3>
                  <p className="text-sm text-gray-600">Support client disponible</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Lundi - Vendredi</span>
                  <span className="text-gray-900 font-medium">9h00 - 18h00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Samedi</span>
                  <span className="text-gray-900 font-medium">10h00 - 16h00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dimanche</span>
                  <span className="text-gray-500">Fermé</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulaire de contact */}
          <Card className="bg-white/30 backdrop-blur-md border-white/40">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Envoyer un message</h3>
              {!showCaptcha ? (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Votre nom"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="bg-white/50 border-white/50"
                    />
                    <Input
                      placeholder="Votre email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-white/50 border-white/50"
                    />
                  </div>
                  <Input
                    placeholder="Sujet de votre message"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="bg-white/50 border-white/50"
                  />
                  <Textarea
                    placeholder="Votre message..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={4}
                    className="bg-white/50 border-white/50"
                    maxLength={1000}
                  />
                  
                  {/* Checkbox RGPD */}
                  <div className="flex items-start gap-3 p-4 bg-white/20 rounded-xl">
                    <input
                      type="checkbox"
                      id="gdpr-consent"
                      checked={gdprConsent}
                      onChange={(e) => setGdprConsent(e.target.checked)}
                      className="mt-1 w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                    />
                    <label htmlFor="gdpr-consent" className="text-sm text-gray-600">
                      J'accepte que {COMPANY_NAME} traite mes données personnelles pour répondre à ma demande. 
                      <a href="/confidentialite" className="text-violet-600 hover:underline ml-1">
                        Politique de confidentialité
                      </a>
                    </label>
                  </div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      onClick={handleInitiateSubmit}
                      disabled={isBlocked}
                      className="glass-button text-black w-full py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isBlocked ? "Trop de tentatives" : "Envoyer le message"}
                    </Button>
                  </motion.div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Vérification de sécurité</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Pour lutter contre le spam, veuillez résoudre cette simple opération :
                    </p>
                    
                    <div className="bg-gray-100 rounded-lg p-4 mb-4">
                      <p className="text-lg font-bold text-gray-900">
                        {captchaChallenge} = ?
                      </p>
                    </div>
                    
                    <Input
                      ref={captchaInputRef}
                      placeholder="Votre réponse"
                      type="number"
                      className="bg-white/50 border-white/50 text-center mb-4"
                    />
                    
                    <div className="flex gap-3">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1"
                      >
                        <Button 
                          onClick={handleCancelCaptcha}
                          variant="outline"
                          className="w-full py-3 rounded-xl"
                        >
                          Annuler
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1"
                      >
                        <Button 
                          onClick={handleSubmitWithCaptcha}
                          className="glass-button text-black w-full py-3 rounded-xl"
                        >
                          Vérifier et envoyer
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}