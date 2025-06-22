import { useState } from "react";
import { useLocation } from "wouter";
import { X, User, Building2, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function Auth() {
  const [, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<'client' | 'professional' | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    businessName: '',
    phone: '',
    acceptTerms: false
  });

  const professionTypes = [
    { id: 'coiffeur', name: 'Coiffeur', icon: '✂️' },
    { id: 'barbier', name: 'Barbier', icon: '🪒' },
    { id: 'manucure', name: 'Manucure', icon: '💅' },
    { id: 'institut', name: 'Institut de beauté', icon: '✨' },
    { id: 'massage', name: 'Massage', icon: '💆' },
    { id: 'esthétique', name: 'Esthétique', icon: '🧖' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simuler la connexion/inscription
    if (userType === 'professional' || (isLogin && formData.email)) {
      setLocation('/dashboard');
    } else {
      setLocation('/');
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Page de sélection du type d'utilisateur
  if (!userType) {
    return (
      <div className="min-h-screen bg-white relative">
        {/* Background blur overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=1200&fit=crop)',
            filter: 'blur(8px) brightness(0.7)'
          }}
        />
        
        {/* Content overlay */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/')}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/')}
              className="text-white hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col justify-center px-6 pb-20">
            <div className="space-y-6">
              {/* Login button */}
              <Button
                onClick={() => {
                  setUserType('client');
                  setIsLogin(true);
                }}
                className="w-full bg-gray-800/90 hover:bg-gray-700 text-white py-4 text-lg font-semibold rounded-2xl backdrop-blur-sm"
              >
                Se connecter
              </Button>

              {/* Professional signup */}
              <Button
                variant="outline"
                onClick={() => {
                  setUserType('professional');
                  setIsLogin(false);
                }}
                className="w-full bg-white/95 hover:bg-white text-gray-900 py-4 text-lg font-semibold rounded-2xl border-2 backdrop-blur-sm"
              >
                Je suis un professionnel de beauté
              </Button>

              {/* Service categories */}
              <div className="space-y-3 mt-8">
                {professionTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant="ghost"
                    onClick={() => {
                      setUserType('professional');
                      setIsLogin(false);
                    }}
                    className="w-full justify-start text-white hover:bg-white/20 py-4 text-left rounded-xl"
                  >
                    <span className="mr-3 text-xl">{type.icon}</span>
                    <span className="text-lg">{type.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Footer link */}
            <div className="mt-12 text-center">
              <button 
                className="text-white/80 underline text-sm"
                onClick={() => setLocation('/')}
              >
                Plus de fonctionnalités dans l'application.
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Formulaire de connexion/inscription
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setUserType(null)}
          className="text-gray-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-gray-900">
          {isLogin ? 'Connexion' : userType === 'professional' ? 'Inscription Pro' : 'Inscription'}
        </h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation('/')}
          className="text-gray-600"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Form content */}
      <div className="flex-1 px-4 py-6">
        <div className="max-w-md mx-auto">
          {/* User type indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                userType === 'professional' ? 'bg-purple-100' : 'bg-blue-100'
              }`}>
                {userType === 'professional' ? (
                  <Building2 className={`w-8 h-8 text-purple-600`} />
                ) : (
                  <User className={`w-8 h-8 text-blue-600`} />
                )}
              </div>
            </div>
            <p className="text-center text-gray-600 text-sm">
              {userType === 'professional' 
                ? 'Espace professionnel BeautyBook'
                : 'Espace client BeautyBook'
              }
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Adresse email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10 h-12 border-gray-200 focus:border-purple-500"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-12 h-12 border-gray-200 focus:border-purple-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Signup additional fields */}
                {!isLogin && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                          Prénom
                        </Label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="Prénom"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="h-12 border-gray-200 focus:border-purple-500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                          Nom
                        </Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Nom"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="h-12 border-gray-200 focus:border-purple-500"
                          required
                        />
                      </div>
                    </div>

                    {userType === 'professional' && (
                      <div className="space-y-2">
                        <Label htmlFor="businessName" className="text-sm font-medium text-gray-700">
                          Nom de l'établissement
                        </Label>
                        <Input
                          id="businessName"
                          type="text"
                          placeholder="Mon Salon de Beauté"
                          value={formData.businessName}
                          onChange={(e) => handleInputChange('businessName', e.target.value)}
                          className="h-12 border-gray-200 focus:border-purple-500"
                          required
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Téléphone
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="06 12 34 56 78"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="h-12 border-gray-200 focus:border-purple-500"
                        required
                      />
                    </div>

                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={formData.acceptTerms}
                        onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                        className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        required
                      />
                      <Label htmlFor="terms" className="text-xs text-gray-600 leading-relaxed">
                        J'accepte les{' '}
                        <a href="#" className="text-purple-600 underline">conditions d'utilisation</a>
                        {' '}et la{' '}
                        <a href="#" className="text-purple-600 underline">politique de confidentialité</a>
                      </Label>
                    </div>
                  </>
                )}

                {/* Submit button */}
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 text-lg font-semibold rounded-xl"
                >
                  {isLogin ? 'Se connecter' : 'Créer mon compte'}
                </Button>

                {/* Forgot password */}
                {isLogin && (
                  <div className="text-center">
                    <button
                      type="button"
                      className="text-sm text-purple-600 hover:text-purple-700 underline"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                )}

                {/* Social login */}
                {isLogin && (
                  <>
                    <div className="relative">
                      <Separator className="my-6" />
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm text-gray-500">
                        ou
                      </span>
                    </div>

                    <div className="space-y-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full py-3 border-gray-200 hover:bg-gray-50"
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continuer avec Google
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full py-3 border-gray-200 hover:bg-gray-50"
                      >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                        </svg>
                        Continuer avec Apple
                      </Button>
                    </div>
                  </>
                )}

                {/* Switch between login/signup */}
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600">
                    {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
                    {' '}
                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-purple-600 hover:text-purple-700 font-semibold underline"
                    >
                      {isLogin ? "S'inscrire" : "Se connecter"}
                    </button>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Professional benefits */}
          {userType === 'professional' && !isLogin && (
            <div className="mt-6 p-4 bg-purple-50 rounded-xl">
              <h3 className="font-semibold text-purple-900 mb-2">
                Avantages BeautyBook Pro
              </h3>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Gestion complète de vos rendez-vous</li>
                <li>• Paiements en ligne sécurisés</li>
                <li>• Analytics et statistiques avancées</li>
                <li>• Support client dédié</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}