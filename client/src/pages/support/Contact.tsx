import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";

export default function Contact() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: "support@rendly.fr",
      description: "Réponse sous 24h"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Téléphone",
      details: "01 23 45 67 89",
      description: "Lun-Ven 9h-18h"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Adresse",
      details: "123 Rue de la Beauté",
      description: "75001 Paris, France"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Horaires",
      details: "9h - 18h",
      description: "Du lundi au vendredi"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simuler l'envoi du message
    alert("Votre message a été envoyé ! Nous vous répondrons dans les plus brefs délais.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
                onClick={() => setLocation("/support/centre-aide")}
                className="glass-button p-2 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5 text-black" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">Nous contacter</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-md border-white/40 border rounded-full px-4 py-2 mb-6">
            <MessageCircle className="w-5 h-5 text-violet-600" />
            <span className="text-sm font-medium text-black">Support Client</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Contactez notre équipe
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Une question, un problème ou une suggestion ? Nous sommes là pour vous aider !
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Formulaire de contact */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/30 backdrop-blur-md border-white/40">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet *
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="h-12 bg-white/50 backdrop-blur-sm border-gray-300 focus:border-violet-500"
                        placeholder="Votre nom"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="h-12 bg-white/50 backdrop-blur-sm border-gray-300 focus:border-violet-500"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sujet *
                    </label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="h-12 bg-white/50 backdrop-blur-sm border-gray-300 focus:border-violet-500"
                      placeholder="De quoi souhaitez-vous parler ?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="bg-white/50 backdrop-blur-sm border-gray-300 focus:border-violet-500 resize-none"
                      placeholder="Décrivez votre demande en détail..."
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    className="w-full h-12 glass-button text-black font-medium rounded-xl"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer le message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Informations de contact */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Autres moyens de nous joindre</h2>
            
            {contactInfo.map((info, index) => (
              <Card key={index} className="bg-white/30 backdrop-blur-md border-white/40 hover:bg-white/40 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 flex-shrink-0">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
                      <p className="text-gray-900 font-medium">{info.details}</p>
                      <p className="text-sm text-gray-600">{info.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Chat en direct */}
            <Card className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 backdrop-blur-md border-violet-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-violet-500 rounded-full flex items-center justify-center text-white">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Chat en direct</h3>
                    <p className="text-sm text-gray-600">Support instantané disponible</p>
                  </div>
                  <Button 
                    className="glass-button text-black px-4 py-2 rounded-lg"
                    onClick={() => setLocation("/support/chat")}
                  >
                    Démarrer
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card className="bg-white/30 backdrop-blur-md border-white/40">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Questions fréquentes</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Trouvez peut-être votre réponse dans notre FAQ
                </p>
                <Button 
                  className="glass-button text-black px-4 py-2 rounded-lg"
                  onClick={() => setLocation("/support/centre-aide")}
                >
                  Consulter la FAQ
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

      </div>
    </div>
  );
}