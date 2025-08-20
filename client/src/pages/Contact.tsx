import { motion } from "framer-motion";
import { ArrowLeft, Mail, Phone, MessageCircle, MapPin, Clock } from "lucide-react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const [, setLocation] = useLocation();

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      description: "support@avyento.com",
      subtitle: "Réponse sous 24h",
      color: "from-blue-100 to-cyan-100"
    },
    {
      icon: MessageCircle,
      title: "Chat en direct",
      description: "Support instantané",
      subtitle: "Disponible 9h-18h",
      color: "from-purple-100 to-violet-100"
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
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Votre nom"
                    className="bg-white/50 border-white/50"
                  />
                  <Input
                    placeholder="Votre email"
                    type="email"
                    className="bg-white/50 border-white/50"
                  />
                </div>
                <Input
                  placeholder="Sujet de votre message"
                  className="bg-white/50 border-white/50"
                />
                <Textarea
                  placeholder="Votre message..."
                  rows={4}
                  className="bg-white/50 border-white/50"
                />
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button className="glass-button text-black w-full py-3 rounded-xl">
                    Envoyer le message
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}