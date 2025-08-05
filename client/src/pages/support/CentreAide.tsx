import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowLeft, HelpCircle, MessageCircle, Phone, Mail, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";

export default function CentreAide() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqCategories = [
    {
      title: "Réservation & Annulation",
      icon: <HelpCircle className="w-5 h-5" />,
      questions: [
        {
          id: 1,
          question: "Comment réserver un rendez-vous ?",
          answer: "Recherchez un salon ou service, sélectionnez un créneau disponible, remplissez vos informations et confirmez. Vous recevrez immédiatement une confirmation par email et SMS."
        },
        {
          id: 2,
          question: "Puis-je annuler ou modifier mon rendez-vous ?",
          answer: "Oui, vous pouvez annuler ou modifier gratuitement jusqu'à 24h avant votre rendez-vous directement depuis votre email de confirmation ou en contactant le salon."
        },
        {
          id: 3,
          question: "Que se passe-t-il si je suis en retard ?",
          answer: "Contactez directement le salon dès que possible. La plupart acceptent un retard de 15-20 minutes, mais au-delà, le rendez-vous peut être annulé."
        }
      ]
    },
    {
      title: "Paiement & Facturation",
      icon: <MessageCircle className="w-5 h-5" />,
      questions: [
        {
          id: 4,
          question: "Comment fonctionne le paiement ?",
          answer: "Le paiement se fait généralement sur place. Certains salons proposent un acompte en ligne sécurisé. Tous les modes de paiement sont acceptés."
        },
        {
          id: 5,
          question: "Puis-je obtenir un remboursement ?",
          answer: "En cas d'annulation respectant les conditions du salon (généralement 24h avant), l'acompte est remboursé sous 3-5 jours ouvrés."
        }
      ]
    },
    {
      title: "Salons & Services",
      icon: <Phone className="w-5 h-5" />,
      questions: [
        {
          id: 6,
          question: "Les salons sont-ils vérifiés ?",
          answer: "Tous nos partenaires sont rigoureusement sélectionnés et vérifiés. Nous contrôlons leurs certifications, équipements et respectons les normes d'hygiène et de qualité."
        },
        {
          id: 7,
          question: "Comment noter un salon ?",
          answer: "Après votre rendez-vous, vous recevrez un email pour laisser votre avis. Votre retour nous aide à maintenir la qualité de notre plateforme."
        }
      ]
    }
  ];

  const contactOptions = [
    {
      title: "Chat en direct",
      description: "Support instantané 9h-18h",
      icon: <MessageCircle className="w-6 h-6" />,
      action: () => setLocation("/support/chat")
    },
    {
      title: "Email",
      description: "Réponse sous 24h",
      icon: <Mail className="w-6 h-6" />,
      action: () => setLocation("/support/contact")
    },
    {
      title: "Téléphone",
      description: "01 23 45 67 89",
      icon: <Phone className="w-6 h-6" />,
      action: () => window.open("tel:0123456789")
    }
  ];

  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      searchQuery === "" || 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen" 
         style={{
           background: '#f8f9fa',
           backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(168, 85, 247, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.06) 0%, transparent 50%)',
         }}>
      
      {/* Header */}
      <header className="bg-white/40 backdrop-blur-md border-white/30 border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => setLocation("/")}
                className="glass-button p-2 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5 text-black" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">Centre d'aide</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-md border-white/40 border rounded-full px-4 py-2 mb-6">
            <HelpCircle className="w-5 h-5 text-violet-600" />
            <span className="text-sm font-medium text-black">Support Client</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comment pouvons-nous vous aider ?
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Trouvez rapidement les réponses à vos questions
          </p>

          {/* Barre de recherche */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Input
                placeholder="Rechercher dans l'aide..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-4 pr-12 text-sm rounded-xl border border-gray-300 focus:border-violet-500 bg-white/50 backdrop-blur-sm"
              />
              <Search className="absolute right-4 top-3 w-6 h-6 text-gray-400" />
            </div>
          </div>
        </motion.div>

        {/* Options de contact rapide */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Besoin d'aide immédiate ?</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {contactOptions.map((option, index) => (
              <Card key={index} className="bg-white/30 backdrop-blur-md border-white/40 hover:bg-white/40 transition-all duration-300 cursor-pointer" onClick={option.action}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4 text-violet-600">
                    {option.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{option.title}</h3>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* FAQ */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Questions fréquentes</h2>
          
          {filteredFaqs.length === 0 ? (
            <Card className="bg-white/30 backdrop-blur-md border-white/40">
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">Aucun résultat trouvé pour "{searchQuery}"</p>
                <Button 
                  className="glass-button text-black mt-4"
                  onClick={() => setSearchQuery("")}
                >
                  Effacer la recherche
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredFaqs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                </div>
                
                <div className="space-y-3">
                  {category.questions.map((faq) => (
                    <Card key={faq.id} className="bg-white/30 backdrop-blur-md border-white/40">
                      <CardContent className="p-0">
                        <button
                          onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                          className="w-full p-4 text-left flex justify-between items-center hover:bg-white/20 transition-colors"
                        >
                          <span className="font-medium text-gray-900">{faq.question}</span>
                          {expandedFaq === faq.id ? (
                            <ChevronUp className="w-5 h-5 text-gray-600" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                          )}
                        </button>
                        {expandedFaq === faq.id && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="px-4 pb-4"
                          >
                            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </motion.section>

        {/* Contact final */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <Card className="bg-white/30 backdrop-blur-md border-white/40">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Toujours besoin d'aide ?</h3>
              <p className="text-gray-600 mb-6">Notre équipe est là pour vous accompagner</p>
              <Button 
                className="glass-button text-black px-6 py-3 rounded-xl"
                onClick={() => setLocation("/support/contact")}
              >
                Nous contacter
              </Button>
            </CardContent>
          </Card>
        </motion.section>

      </div>
    </div>
  );
}