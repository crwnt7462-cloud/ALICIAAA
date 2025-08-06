import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmailVerificationFormProps {
  email: string;
  userType: 'professional' | 'client';
  userData: any;
  onSuccess: (result: any) => void;
  onBack: () => void;
}

export function EmailVerificationForm({ 
  email, 
  userType, 
  userData, 
  onSuccess, 
  onBack 
}: EmailVerificationFormProps) {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes en secondes

  // Timer pour l'expiration du code
  useEffect(() => {
    if (isCodeSent && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isCodeSent, timeLeft]);

  // Envoyer le code de vérification
  const sendVerificationCode = async () => {
    setIsSending(true);
    setError('');

    try {
      const response = await fetch('/api/email/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          userData,
          userType
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsCodeSent(true);
        setTimeLeft(600); // Reset timer
      } else {
        setError(data.error || 'Erreur lors de l\'envoi du code');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
    } finally {
      setIsSending(false);
    }
  };

  // Vérifier le code
  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/email/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          verificationCode: verificationCode.trim()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess(data);
      } else {
        setError(data.error || 'Code de vérification invalide');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  // Renvoyer le code
  const resendCode = async () => {
    await sendVerificationCode();
  };

  // Formatage du temps restant
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Auto-envoi du code au chargement
  useEffect(() => {
    sendVerificationCode();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-violet-50 to-amber-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-violet-500 to-amber-500 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-violet-600 to-amber-600 bg-clip-text text-transparent">
              Vérification Email
            </CardTitle>
            <CardDescription className="text-gray-600">
              Un code de vérification a été envoyé à
              <br />
              <strong>{email}</strong>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {isCodeSent && !error && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Code de vérification envoyé avec succès !
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={verifyCode} className="space-y-4">
              <div>
                <Label htmlFor="code" className="text-sm font-medium text-gray-700">
                  Code de vérification (6 chiffres)
                </Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="mt-1 text-center text-lg tracking-widest"
                  maxLength={6}
                  required
                  disabled={isLoading}
                />
              </div>

              {timeLeft > 0 && (
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  Code expire dans {formatTime(timeLeft)}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-violet-600 to-amber-600 hover:from-violet-700 hover:to-amber-700"
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Vérification...
                  </>
                ) : (
                  'Vérifier le code'
                )}
              </Button>
            </form>

            <div className="text-center space-y-3">
              <p className="text-sm text-gray-500">
                Vous n'avez pas reçu le code ?
              </p>
              <Button
                variant="ghost"
                onClick={resendCode}
                disabled={isSending || timeLeft > 540} // Permettre le renvoi après 1 minute
                className="text-violet-600 hover:text-violet-700 hover:bg-violet-50"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  'Renvoyer le code'
                )}
              </Button>
              
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-50 block w-full"
              >
                ← Retour à l'inscription
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}