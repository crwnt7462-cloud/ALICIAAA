import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, ArrowLeft, Eye, EyeOff, User, Smartphone, Shield, AlertTriangle } from "lucide-react";
import avyentoLogo from "@assets/3_1753714421825.png";

// Types pour le système de limitation
interface LoginAttempt {
  email: string;
  attempts: number;
  lastAttempt: number;
  blockedUntil?: number;
}

export default function ClientLoginModern() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeLeft, setBlockTimeLeft] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: ""
  });

  // Gestion du système de limitation des tentatives
  const getStoredAttempts = (email: string): LoginAttempt | null => {
    try {
      const stored = localStorage.getItem(`login_attempts_${email}`);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const updateStoredAttempts = (email: string, attempts: LoginAttempt) => {
    localStorage.setItem(`login_attempts_${email}`, JSON.stringify(attempts));
  };

  const calculateBlockDuration = (attemptCount: number): number => {
    // Blocage progressif : 1min, 5min, 15min, 30min, 1h, 2h, etc.
    const baseDuration = 60000; // 1 minute en ms
    const multipliers = [1, 5, 15, 30, 60, 120, 240]; // minutes
    const index = Math.min(attemptCount - 3, multipliers.length - 1);
    const multiplier = multipliers[Math.max(0, index)] || 1;
    return baseDuration * multiplier;
  };

  const checkIfBlocked = (email: string) => {
    if (!email) return;
    
    const attempts = getStoredAttempts(email);
    if (!attempts || attempts.attempts < 3) {
      setIsBlocked(false);
      setAttemptCount(attempts?.attempts || 0);
      return;
    }

    const now = Date.now();
    if (attempts.blockedUntil && now < attempts.blockedUntil) {
      setIsBlocked(true);
      setBlockTimeLeft(Math.ceil((attempts.blockedUntil - now) / 1000));
      setAttemptCount(attempts.attempts);
    } else {
      setIsBlocked(false);
      setAttemptCount(attempts.attempts);
    }
  };

  // Vérifier le blocage quand l'email change
  useEffect(() => {
    if (formData.email) {
      checkIfBlocked(formData.email);
    }
  }, [formData.email]);

  // Timer pour le décompte du blocage
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBlocked && blockTimeLeft > 0) {
      timer = setInterval(() => {
        setBlockTimeLeft(prev => {
          if (prev <= 1) {
            setIsBlocked(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBlocked, blockTimeLeft]);

  const handleFailedLogin = (email: string) => {
    const now = Date.now();
    const stored = getStoredAttempts(email) || { email, attempts: 0, lastAttempt: now };
    
    stored.attempts += 1;
    stored.lastAttempt = now;
    
    console.log(`[DEBUG] Tentative échouée #${stored.attempts} pour ${email}`);
    
    if (stored.attempts >= 3) {
      const blockDuration = calculateBlockDuration(stored.attempts);
      stored.blockedUntil = now + blockDuration;
      setIsBlocked(true);
      setBlockTimeLeft(Math.ceil(blockDuration / 1000));
      console.log(`[DEBUG] Compte bloqué pour ${Math.ceil(blockDuration / 1000)}s`);
    }
    
    setAttemptCount(stored.attempts);
    updateStoredAttempts(email, stored);
  };

  const handleSuccessfulLogin = (email: string) => {
    localStorage.removeItem(`login_attempts_${email}`);
    setAttemptCount(0);
    setIsBlocked(false);
    setBlockTimeLeft(0);
  };

  const formatBlockTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds} secondes`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}min ${remainingSeconds}s`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier si l'utilisateur est bloqué
    if (isLogin && isBlocked) {
      toast({
        title: "Compte temporairement bloqué",
        description: `Trop de tentatives. Réessayez dans ${formatBlockTime(blockTimeLeft)}`,
        variant: "destructive"
      });
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }

    if (!formData.email || !formData.password) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/api/client/login' : '/api/client/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : {
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      if (!response.ok) {
        // Ne pas throw une erreur, traiter comme échec de connexion
        const data = await response.json().catch(() => ({ success: false, message: "Invalid credentials" }));
        
        if (isLogin) {
          // Récupérer le nombre actuel d'tentatives avant d'incrémenter
          const currentAttempts = getStoredAttempts(formData.email)?.attempts || 0;
          const nextAttemptCount = currentAttempts + 1;
          
          // Appeler handleFailedLogin pour incrémenter et potentiellement bloquer
          handleFailedLogin(formData.email);
          
          if (nextAttemptCount >= 3) {
            const blockDuration = calculateBlockDuration(nextAttemptCount);
            toast({
              title: "Email ou mot de passe incorrect",
              description: `Compte bloqué après ${nextAttemptCount} tentatives. Réessayez dans ${formatBlockTime(Math.ceil(blockDuration / 1000))}.`,
              variant: "destructive"
            });
          } else {
            toast({
              title: "Email ou mot de passe incorrect", 
              description: `Tentative ${nextAttemptCount}/3. Après 3 échecs, votre compte sera temporairement bloqué.`,
              variant: "destructive"
            });
          }
        } else {
          toast({
            title: "Erreur de création",
            description: data.message || "Une erreur est survenue",
            variant: "destructive"
          });
        }
        return; // Sortir de la fonction ici
      }

      const data = await response.json();
      
      if (data.success && data.client) {
        // Réinitialiser les tentatives en cas de succès
        if (isLogin) {
          handleSuccessfulLogin(formData.email);
        }
        
        localStorage.setItem('clientToken', data.client.token);
        localStorage.setItem('clientData', JSON.stringify(data.client));
        
        toast({
          title: isLogin ? "Connexion réussie" : "Compte créé",
          description: isLogin 
            ? `Bienvenue ${data.client.firstName}!` 
            : "Votre compte a été créé avec succès",
        });
        
        // Vérifier s'il y a une réservation en cours
        const hasBookingInProgress = sessionStorage.getItem('currentBooking');
        if (hasBookingInProgress) {
          setLocation('/salon-booking');
        } else {
          setLocation('/client-dashboard');
        }
      } else {
        // Incrémenter les tentatives échouées uniquement pour la connexion
        if (isLogin) {
          // Récupérer le nombre actuel d'tentatives avant d'incrémenter
          const currentAttempts = getStoredAttempts(formData.email)?.attempts || 0;
          const nextAttemptCount = currentAttempts + 1;
          
          // Appeler handleFailedLogin pour incrémenter et potentiellement bloquer
          handleFailedLogin(formData.email);
          
          if (nextAttemptCount >= 3) {
            const blockDuration = calculateBlockDuration(nextAttemptCount);
            toast({
              title: "Email ou mot de passe incorrect",
              description: `Compte bloqué après ${nextAttemptCount} tentatives. Réessayez dans ${formatBlockTime(Math.ceil(blockDuration / 1000))}.`,
              variant: "destructive"
            });
          } else {
            toast({
              title: "Email ou mot de passe incorrect", 
              description: `Tentative ${nextAttemptCount}/3. Après 3 échecs, votre compte sera temporairement bloqué.`,
              variant: "destructive"
            });
          }
        } else {
          toast({
            title: "Erreur de création",
            description: data.error || "Une erreur est survenue",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Erreur authentification:', error);
      
      // En cas d'erreur réseau/serveur, comptabiliser comme tentative échouée pour la connexion
      if (isLogin) {
        // Récupérer le nombre actuel d'tentatives avant d'incrémenter
        const currentAttempts = getStoredAttempts(formData.email)?.attempts || 0;
        const nextAttemptCount = currentAttempts + 1;
        
        // Appeler handleFailedLogin pour incrémenter et potentiellement bloquer
        handleFailedLogin(formData.email);
        
        if (nextAttemptCount >= 3) {
          const blockDuration = calculateBlockDuration(nextAttemptCount);
          toast({
            title: "Email ou mot de passe incorrect",
            description: `Compte bloqué après ${nextAttemptCount} tentatives. Réessayez dans ${formatBlockTime(Math.ceil(blockDuration / 1000))}.`,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Email ou mot de passe incorrect",
            description: `Tentative ${nextAttemptCount}/3. Après 3 échecs, votre compte sera temporairement bloqué.`,
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Erreur de création",
          description: "Impossible de créer le compte. Vérifiez votre connexion internet.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Bouton retour */}
      <button
        onClick={() => setLocation('/')}
        className="absolute left-6 top-6 z-10 glass-button p-3 rounded-xl transition-all duration-200 hover:scale-105"
      >
        <ArrowLeft className="h-5 w-5 text-gray-700" />
      </button>

      {/* Logo centré */}
      <div className="text-center pt-6 pb-3">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img 
            src={avyentoLogo} 
            alt="Avyento" 
            className="mx-auto"
            style={{ height: '130px' }}
          />
        </motion.div>
      </div>

      {/* Contenu principal */}
      <div className="flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="glass-card rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2 text-gray-900">
                {isLogin ? "Connexion Client" : "Créer un compte"}
              </h1>
              <p className="text-gray-600">
                {isLogin ? "Accédez à votre espace personnel" : "Rejoignez Avyento"}
              </p>
              
              {/* Indicateur de sécurité */}
              {isLogin && (
                <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-gray-600">Connexion sécurisée</span>
                </div>
              )}
            </div>

            {/* Alerte de blocage */}
            {isBlocked && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
              >
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-800 mb-1">
                    Compte temporairement bloqué
                  </h3>
                  <p className="text-sm text-red-700">
                    Trop de tentatives de connexion. Réessayez dans <strong>{formatBlockTime(blockTimeLeft)}</strong>
                  </p>
                </div>
              </motion.div>
            )}

            {/* Avertissement tentatives */}
            {isLogin && attemptCount > 0 && attemptCount < 3 && !isBlocked && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3"
              >
                <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-amber-800">
                    <strong>Attention :</strong> {attemptCount}/3 tentatives. Après 3 échecs, votre compte sera bloqué temporairement.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Toggle Login/Register */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                  isLogin 
                    ? 'bg-white text-violet-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Connexion
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                  !isLogin 
                    ? 'bg-white text-violet-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Inscription
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Champs d'inscription uniquement */}
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-900">
                      Prénom
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Votre prénom"
                        value={formData.firstName}
                        onChange={(e) => updateField("firstName", e.target.value)}
                        className="pl-10 glass-input"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-900">
                      Nom
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Votre nom"
                        value={formData.lastName}
                        onChange={(e) => updateField("lastName", e.target.value)}
                        className="pl-10 glass-input"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-900">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="pl-10 glass-input"
                    required
                  />
                </div>
              </div>

              {/* Téléphone pour inscription */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-900">
                    Téléphone (optionnel)
                  </Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="06 12 34 56 78"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="pl-10 glass-input"
                    />
                  </div>
                </div>
              )}

              {/* Mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-900">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    className="pl-10 pr-10 glass-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* Confirmation mot de passe pour inscription */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-900">
                    Confirmer le mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => updateField("confirmPassword", e.target.value)}
                      className="pl-10 glass-input"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              {/* Bouton de connexion */}
              <Button
                type="submit"
                disabled={isLoading || (isLogin && isBlocked)}
                className="w-full glass-button-purple text-white font-medium py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  isLogin ? "Connexion..." : "Création du compte..."
                ) : isBlocked ? (
                  `Bloqué ${formatBlockTime(blockTimeLeft)}`
                ) : (
                  isLogin ? "Se connecter" : "Créer mon compte"
                )}
              </Button>

              {/* Liens */}
              <div className="text-center space-y-2">
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => setLocation("/forgot-password")}
                    className="text-sm text-violet-600 hover:text-violet-700 transition-colors"
                  >
                    Mot de passe oublié ?
                  </button>
                )}
                <div className="text-sm text-gray-600">
                  {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-violet-600 hover:text-violet-700 transition-colors font-medium"
                  >
                    {isLogin ? "S'inscrire" : "Se connecter"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}