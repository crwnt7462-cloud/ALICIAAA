import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, Clock, MapPin, Phone, Mail, Camera, 
  Save, User, Star, Globe, Settings 
} from 'lucide-react';

export default function SalonSettingsModern() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('info');

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    openingHours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '17:00', closed: false },
      sunday: { open: '10:00', close: '16:00', closed: true }
    }
  });

  // Récupérer les données actuelles
  const { data: salonData, isLoading } = useQuery({
    queryKey: ['/api/salon-settings'],
    enabled: true
  });

  useEffect(() => {
    if (salonData) {
      setFormData({
        name: salonData.name || '',
        address: salonData.address || '',
        phone: salonData.phone || '',
        email: salonData.email || '',
        description: salonData.description || '',
        openingHours: salonData.openingHours || formData.openingHours
      });
    }
  }, [salonData, formData.openingHours]);

  // Mutation pour sauvegarder
  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/salon-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Erreur de sauvegarde');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Paramètres sauvegardés",
        description: "Les informations du salon ont été mises à jour",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/salon-settings'] });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive"
      });
    }
  });

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  const tabs = [
    { id: 'info', label: 'Infos', icon: Settings },
    { id: 'hours', label: 'Horaires', icon: Clock },
    { id: 'contact', label: 'Contact', icon: Phone }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      
      {/* Header - même style que page recherche */}
      <div className="relative">
        
        {/* Bouton retour */}
        <button
          onClick={() => window.history.back()}
          className="absolute left-4 top-4 z-10 glass-button text-black px-3 py-2 rounded-2xl shadow-xl hover:shadow-2xl"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {/* Container principal */}
        <div className="px-6 pt-16 pb-6">
          <div className="max-w-sm mx-auto">
            
            {/* Logo salon - même style que "Design" */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-violet-600">Settings</h1>
            </div>

            {/* Titre */}
            <div className="text-center mb-8">
              <h2 className="text-xl text-gray-500 font-normal">Configure your salon</h2>
            </div>

            {/* Navigation par onglets - style glassmorphism */}
            <div className="flex glass-button rounded-2xl p-1 mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-semibold transition-all ${
                    activeTab === tab.id 
                      ? 'glass-button text-black shadow-xl hover:shadow-2xl' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Contenu des onglets */}
            <div className="space-y-6">
              
              {/* Onglet Infos */}
              {activeTab === 'info' && (
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nom du salon"
                      className="w-full h-12 px-4 glass-input rounded-2xl text-base text-gray-900 placeholder:text-gray-500"
                    />
                  </div>
                  
                  <div>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Adresse complète"
                      className="w-full h-12 px-4 glass-input rounded-2xl text-base text-gray-900 placeholder:text-gray-500"
                    />
                  </div>
                  
                  <div>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Description du salon"
                      rows={4}
                      className="w-full px-4 py-3 glass-input rounded-2xl text-base text-gray-900 placeholder:text-gray-500 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Onglet Contact */}
              {activeTab === 'contact' && (
                <div className="space-y-4">
                  <div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Numéro de téléphone"
                      className="w-full h-12 px-4 glass-input rounded-2xl text-base text-gray-900 placeholder:text-gray-500"
                    />
                  </div>
                  
                  <div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Email professionnel"
                      className="w-full h-12 px-4 glass-input rounded-2xl text-base text-gray-900 placeholder:text-gray-500"
                    />
                  </div>

                  <div className="glass-button rounded-2xl p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Réseaux sociaux</h3>
                    <div className="space-y-3">
                      <input
                        type="url"
                        placeholder="Instagram"
                        className="w-full h-10 px-3 glass-input rounded-xl text-sm"
                      />
                      <input
                        type="url"
                        placeholder="Facebook"
                        className="w-full h-10 px-3 glass-input rounded-xl text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Horaires */}
              {activeTab === 'hours' && (
                <div className="space-y-4">
                  {Object.entries(formData.openingHours).map(([day, hours]) => (
                    <div key={day} className="glass-button rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 capitalize">{day}</span>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={!(hours as any).closed}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              openingHours: {
                                ...prev.openingHours,
                                [day]: { ...hours, closed: !e.target.checked }
                              }
                            }))}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-600">Ouvert</span>
                        </label>
                      </div>
                      
                      {!(hours as any).closed && (
                        <div className="flex gap-2">
                          <input
                            type="time"
                            value={(hours as any).open}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              openingHours: {
                                ...prev.openingHours,
                                [day]: { ...hours, open: e.target.value }
                              }
                            }))}
                            className="flex-1 h-10 px-3 glass-input rounded-xl text-sm"
                          />
                          <input
                            type="time"
                            value={(hours as any).close}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              openingHours: {
                                ...prev.openingHours,
                                [day]: { ...hours, close: e.target.value }
                              }
                            }))}
                            className="flex-1 h-10 px-3 glass-input rounded-xl text-sm"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Bouton de sauvegarde */}
              <button
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="glass-button text-black px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl w-full disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saveMutation.isPending ? "Sauvegarde..." : "Sauvegarder"}
              </button>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}