import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Users, Building, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface EmailVerificationSuccessProps {
  userType: 'professional' | 'client';
  account: any;
  onContinue: () => void;
}

export function EmailVerificationSuccess({ 
  userType, 
  account, 
  onContinue 
}: EmailVerificationSuccessProps) {
  const isProfessional = userType === 'professional';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-violet-50 to-amber-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>
            
            <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Compte créé avec succès !
            </CardTitle>
            
            <CardDescription className="text-gray-600 mt-2">
              {isProfessional ? (
                <>
                  Félicitations ! Votre compte professionnel est maintenant actif.
                  <br />
                  Vous pouvez commencer à gérer votre salon.
                </>
              ) : (
                <>
                  Bienvenue ! Votre compte client est maintenant actif.
                  <br />
                  Vous pouvez maintenant réserver vos rendez-vous.
                </>
              )}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Informations du compte */}
            <div className="bg-gradient-to-r from-violet-50 to-amber-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                {isProfessional ? (
                  <Building className="w-5 h-5 text-violet-600 mr-2" />
                ) : (
                  <Users className="w-5 h-5 text-violet-600 mr-2" />
                )}
                <h3 className="font-semibold text-gray-800">
                  {isProfessional ? 'Compte Professionnel' : 'Compte Client'}
                </h3>
              </div>
              
              <div className="space-y-2 text-sm text-gray-700">
                {isProfessional ? (
                  <>
                    <p><strong>Salon :</strong> {account?.businessName || 'Non défini'}</p>
                    <p><strong>Propriétaire :</strong> {account?.ownerName || account?.firstName} {account?.lastName || ''}</p>
                    <p><strong>Email :</strong> {account?.email}</p>
                    <p><strong>Plan :</strong> 
                      <span className="ml-1 px-2 py-1 bg-violet-100 text-violet-700 rounded text-xs">
                        {account?.subscriptionPlan === 'basic-pro' && 'Basic Pro (€29)'}
                        {account?.subscriptionPlan === 'advanced-pro' && 'Advanced Pro (€79)'}
                        {account?.subscriptionPlan === 'premium-pro' && 'Premium Pro (€149)'}
                      </span>
                    </p>
                  </>
                ) : (
                  <>
                    <p><strong>Nom :</strong> {account?.firstName} {account?.lastName}</p>
                    <p><strong>Email :</strong> {account?.email}</p>
                    <p><strong>Statut :</strong> 
                      <span className="ml-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        Client actif
                      </span>
                    </p>
                    <p><strong>Points fidélité :</strong> {account?.loyaltyPoints || 0} points</p>
                  </>
                )}
              </div>
            </div>

            {/* Prochaines étapes */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Prochaines étapes :</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                {isProfessional ? (
                  <>
                    <li>• Personnaliser votre page salon</li>
                    <li>• Ajouter vos services et tarifs</li>
                    <li>• Configurer votre planning</li>
                    <li>• Inviter votre équipe</li>
                  </>
                ) : (
                  <>
                    <li>• Explorer les salons disponibles</li>
                    <li>• Réserver votre premier rendez-vous</li>
                    <li>• Compléter votre profil</li>
                    <li>• Gagner des points fidélité</li>
                  </>
                )}
              </ul>
            </div>

            <Button
              onClick={onContinue}
              className="w-full bg-gradient-to-r from-violet-600 to-amber-600 hover:from-violet-700 hover:to-amber-700 text-white"
              size="lg"
            >
              {isProfessional ? 'Accéder à mon salon' : 'Découvrir les salons'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <p className="text-xs text-center text-gray-500">
              Un email de confirmation vous a été envoyé avec tous les détails de votre compte.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}