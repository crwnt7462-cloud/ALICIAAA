import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PasswordField } from './PasswordField';
import { SocialLoginButtons } from './SocialLoginButtons';
import { useClientLogin } from '@/hooks/useClientLogin';

interface LoginFormProps {
  redirectTo?: string;
  showSocialLogin?: boolean;
  showSignupLink?: boolean;
  signupLinkText?: string;
  signupLinkPath?: string;
  className?: string;
}

export const LoginForm = ({
  redirectTo = '/client-dashboard',
  showSocialLogin = true,
  showSignupLink = true,
  signupLinkText = "Pas encore de compte ?",
  signupLinkPath = '/client-login',
  className = "space-y-6"
}: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleSubmit, isLoading } = useClientLogin(redirectTo);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit({ email, password });
  };

  return (
    <form onSubmit={onSubmit} className={className}>
      {/* Champ Email */}
      <div>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="h-14 glass-input rounded-2xl text-base placeholder:text-gray-400"
          required
        />
      </div>

      {/* Champ Password */}
      <PasswordField
        value={password}
        onChange={setPassword}
        placeholder="Mot de passe"
      />

      {/* Bouton de connexion */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-14 glass-button text-base font-semibold rounded-2xl"
      >
        {isLoading ? "Connexion..." : "Se connecter"}
      </Button>

      {/* Séparateur */}
      {showSocialLogin && (
        <div className="my-8 text-center">
          <span className="text-gray-400 text-sm">ou Connexion avec</span>
        </div>
      )}

      {/* Boutons sociaux */}
      {showSocialLogin && <SocialLoginButtons />}

      {/* Lien inscription */}
      {showSignupLink && (
        <div className="text-center">
          <span className="text-gray-500 text-sm">
            {signupLinkText}{' '}
            <button
              type="button"
              className="text-violet-600 font-semibold hover:text-violet-700"
              onClick={() => window.location.href = signupLinkPath}
            >
              S'inscrire
            </button>
          </span>
        </div>
      )}
    </form>
  );
};
