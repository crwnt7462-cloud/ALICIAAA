import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User, Crown, Mail } from "lucide-react";

interface ProAccount {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  salonName: string;
}

export default function DevProLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // Comptes pro disponibles (récupérés de la base de données)
  const availableAccounts: ProAccount[] = [
    {
      id: "47b38fc8-a9d5-4253-9618-08e81963af42",
      email: "correct@gmail.com",
      firstName: "MELO",
      lastName: "MELOP",
      salonName: "MILOP"
    },
    {
      id: "a4929568-36e3-4930-ad34-0a1dfe628da2",
      email: "test@demo.com",
      firstName: "Test",
      lastName: "Demo",
      salonName: "Salon Demo"
    },
    {
      id: "fa9f218c-4969-4b29-b095-8ce6251c114f",
      email: "nouveau@demo.com",
      firstName: "Nouveau",
      lastName: "Compte",
      salonName: "Nouveau Salon"
    },
    {
      id: "004fc506-878c-4c6a-96da-b772b9710de1",
      email: "alu@gmail.com",
      firstName: "Alu",
      lastName: "User",
      salonName: "Salon Alu"
    }
  ];

  const handleDirectLogin = async (account: ProAccount) => {
    setIsLoading(account.id);
    
    try {
      // Connexion directe sans mot de passe via une route spéciale
      const response = await fetch('/api/dev-login-direct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: account.id,
          email: account.email,
          firstName: account.firstName,
          lastName: account.lastName,
          salonName: account.salonName
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Connexion réussie !",
          description: `Bienvenue ${account.firstName} de ${account.salonName}`,
        });
        
        // Redirection vers le dashboard
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 100);
      } else {
        throw new Error(data.error || "Erreur de connexion");
      }
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <div className="glass-card rounded-3xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-violet-100 rounded-full">
                <Crown className="w-8 h-8 text-violet-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Connexion Développement
            </h1>
            <p className="text-gray-600">
              Choisissez un compte professionnel pour vous connecter directement
            </p>
          </div>

          {/* Accounts Grid */}
          <div className="grid gap-4">
            {availableAccounts.map((account) => (
              <motion.div
                key={account.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="border border-gray-200 rounded-2xl p-6 hover:border-violet-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => handleDirectLogin(account)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-violet-100 to-blue-100 rounded-xl">
                      <User className="w-6 h-6 text-violet-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {account.firstName} {account.lastName}
                      </h3>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{account.email}</span>
                      </div>
                      <p className="text-violet-600 font-medium text-sm mt-1">
                        {account.salonName}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    disabled={isLoading === account.id}
                    className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white px-6 py-2 rounded-xl transition-all duration-300"
                  >
                    {isLoading === account.id ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Se connecter"
                    )}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              Mode développement - Connexion directe sans mot de passe
            </p>
            <button
              onClick={() => setLocation("/pro-login")}
              className="text-violet-600 hover:text-violet-700 text-sm font-medium mt-2 transition-colors"
            >
              Utiliser la connexion classique
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
