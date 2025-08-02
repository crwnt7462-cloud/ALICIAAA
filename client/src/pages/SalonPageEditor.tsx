import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
 ArrowLeft, 
 Star, 
 MapPin, 
 Phone, 
 Clock, 
 User,
 Calendar,
 CheckCircle,
 Award,
 Edit3,
 Save,
 Upload,
 X,
 Plus,
 Trash2
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { getGenericGlassButton } from '@/lib/salonColors';

interface Service {
 id: number;
 name: string;
 price: number;
 duration: string;
 description?: string;
}

interface ServiceCategory {
 id: number;
 name: string;
 expanded: boolean;
 services: Service[];
}

interface Professional {
 id: string;
 name: string;
 specialty: string;
 avatar: string;
 rating: number;
 price: number;
 bio: string;
 experience: string;
}

interface SalonData {
 id: string;
 name: string;
 description: string;
 longDescription: string;
 address: string;
 phone: string;
 rating: number;
 reviews: number;
 coverImageUrl?: string;
 logoUrl?: string;
 photos: string[];
 serviceCategories: ServiceCategory[];
 professionals: Professional[];
 verified: boolean;
 certifications: string[];
 awards: string[];
 customColors?: {
  primary: string;
  accent: string;
  buttonText: string;
  priceColor: string;
  neonFrame: string;
 };
}

export default function SalonPageEditor() {
 const [, setLocation] = useLocation();
 const { toast } = useToast();
 const queryClient = useQueryClient();
 const [isEditing, setIsEditing] = useState(false);
 const [activeTab, setActiveTab] = useState('services');

 const [salonData, setSalonData] = useState<SalonData>({
  id: 'auto-generated', // ID sera récupéré automatiquement de l'API
  name: 'Excellence Paris',
  description: 'Salon de beauté moderne et professionnel au cœur de Paris',
  longDescription: `Notre salon Excellence Paris vous accueille depuis plus de 15 ans dans un cadre moderne et chaleureux. Spécialisés dans les coupes tendances et les soins personnalisés, notre équipe d'experts est formée aux dernières techniques et utilise exclusivement des produits de qualité professionnelle.

Situé au cœur du 8ème arrondissement, nous proposons une gamme complète de services pour sublimer votre beauté naturelle. De la coupe classique aux colorations les plus audacieuses, en passant par nos soins anti-âge révolutionnaires, chaque prestation est réalisée avec la plus grande attention.`,
  address: '15 Avenue des Champs-Élysées, 75008 Paris',
  phone: '01 42 25 76 89',
  rating: 4.8,
  reviews: 247,
  coverImageUrl: '',
  logoUrl: '',
  photos: [],
  verified: true,
  certifications: [
   'Salon labellisé L\'Oréal Professionnel',
   'Formation continue Kérastase',
   'Certification bio Shu Uemura'
  ],
  awards: [
   'Élu Meilleur Salon Paris 8ème 2023',
   'Prix de l\'Innovation Beauté 2022',
   'Certification Éco-responsable'
  ],
  customColors: {
   primary: '#7c3aed', // violet-600 par défaut
   accent: '#a855f7', // violet-500 par défaut
   buttonText: '#ffffff', // blanc par défaut
   priceColor: '#7c3aed', // violet-600 par défaut
   neonFrame: '#a855f7' // violet-500 par défaut
  },
  serviceCategories: [
   {
    id: 1,
    name: 'Cheveux',
    expanded: true,
    services: [
     { id: 1, name: 'Coupe & Brushing', price: 45, duration: '1h', description: 'Coupe personnalisée et brushing professionnel' },
     { id: 2, name: 'Coloration', price: 80, duration: '2h', description: 'Coloration complète avec soins' },
     { id: 3, name: 'Mèches', price: 120, duration: '2h30', description: 'Mèches naturelles ou colorées' },
     { id: 4, name: 'Coupe Enfant', price: 25, duration: '30min', description: 'Coupe adaptée aux enfants -12 ans' }
    ]
   },
   {
    id: 2,
    name: 'Soins Visage',
    expanded: false,
    services: [
     { id: 5, name: 'Soin du visage classique', price: 65, duration: '1h15', description: 'Nettoyage, gommage et hydratation' },
     { id: 6, name: 'Soin anti-âge', price: 95, duration: '1h30', description: 'Soin complet avec technologies avancées' },
     { id: 7, name: 'Épilation sourcils', price: 20, duration: '20min', description: 'Épilation et restructuration' }
    ]
   },
   {
    id: 3,
    name: 'Épilation',
    expanded: false,
    services: [
     { id: 8, name: 'Épilation jambes complètes', price: 40, duration: '45min', description: 'Épilation à la cire chaude' },
     { id: 9, name: 'Épilation maillot', price: 30, duration: '30min', description: 'Épilation zone sensible' },
     { id: 10, name: 'Épilation aisselles', price: 15, duration: '15min', description: 'Épilation rapide et efficace' }
    ]
   }
  ],
  professionals: [
   {
    id: '1',
    name: 'Sarah Martinez',
    specialty: 'Coiffure & Coloration',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=150&h=150&fit=crop&crop=face',
    rating: 4.9,
    price: 65,
    bio: 'Expert en coiffure moderne et coloration naturelle',
    experience: '8 ans d\'expérience'
   },
   {
    id: '2', 
    name: 'Marie Dubois',
    specialty: 'Soins Esthétiques',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    rating: 4.8,
    price: 80,
    bio: 'Spécialiste en soins anti-âge et bien-être',
    experience: '10 ans d\'expérience'
   },
   {
    id: '3',
    name: 'Emma Laurent',
    specialty: 'Massage & Bien-être',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    rating: 4.9,
    price: 75,
    bio: 'Thérapeute certifiée en massage relaxant',
    experience: '6 ans d\'expérience'
   }
  ]
 });

 // Récupérer les données du salon connecté (auto-détection)
 const { data: currentSalon, isLoading } = useQuery({
  queryKey: ['/api/salon/current'], // API qui retourne le salon du pro connecté
  retry: 1,
  refetchOnWindowFocus: false
 });

 useEffect(() => {
  if (currentSalon && typeof currentSalon === 'object') {
   const salon = currentSalon as any;
   console.log('📖 Données salon récupérées depuis l\'API:', salon.id || 'salon-demo');
   console.log('🔄 Mise à jour complète des données salon avec ID:', salon.id);
   setSalonData(prev => ({
    ...prev,
    ...salon,
    id: salon.id || 'salon-demo', // S'assurer que l'ID est bien défini
    customColors: salon.customColors || {
     primary: '#7c3aed',
     accent: '#a855f7',
     buttonText: '#ffffff',
     priceColor: '#7c3aed',
     neonFrame: '#a855f7'
    }
   }));
  }
 }, [currentSalon]);

 // Mutation pour sauvegarder (système universel)
 const saveMutation = useMutation({
  mutationFn: async (updatedData: Partial<SalonData>) => {
   // 🔧 CORRECTION : Toujours utiliser 'salon-demo' pour assurer la synchronisation
   const salonId = currentSalon?.id || 'salon-demo';
   console.log('💾 Sauvegarde salon ID:', salonId);
   
   const response = await apiRequest('PUT', `/api/salon/${salonId}`, {
    ...updatedData,
    id: salonId // S'assurer que l'ID est correct
   });
   return response.json();
  },
  onSuccess: (data) => {
   toast({
    title: "Salon publié avec succès !",
    description: "Votre salon est maintenant visible dans la recherche publique et accessible via votre lien partageable.",
   });
   
   // Afficher l'URL partageable
   if (data?.shareableUrl) {
    console.log('🔗 Lien partageable:', data.shareableUrl);
    
    // Afficher une notification supplémentaire avec le lien
    setTimeout(() => {
     toast({
      title: "Lien partageable créé",
      description: `Votre salon est accessible via: ${data.shareableUrl}`,
     });
    }, 2000);
   }
   
   // Invalider les caches (système universel)
   queryClient.invalidateQueries({ queryKey: ['/api/salon/current'] });
   queryClient.invalidateQueries({ queryKey: ['/api/booking-pages'] }); // Invalider tous les salons
   queryClient.invalidateQueries({ queryKey: ['/api/public/salons'] });
  },
  onError: (error: any) => {
   console.error('Erreur sauvegarde:', error);
   toast({
    title: "Erreur de sauvegarde",
    description: "Impossible de sauvegarder. Vérifiez votre connexion.",
    variant: "destructive",
   });
  }
 });

 const handleSave = () => {
  console.log('💾 Déclenchement sauvegarde salon:', salonData.id);
  console.log('🎨 Couleurs à sauvegarder:', salonData.customColors);
  saveMutation.mutate(salonData);
 };

 const updateField = (field: keyof SalonData, value: any) => {
  setSalonData(prev => ({
   ...prev,
   [field]: value
  }));
 };

 // Gestion des couleurs personnalisées avec forçage temps réel
 const updateCustomColor = (colorType: 'primary' | 'accent' | 'buttonText' | 'priceColor' | 'neonFrame', color: string) => {
  console.log('🎨 Mise à jour couleur:', colorType, '=', color);
  setSalonData(prev => ({
   ...prev,
   customColors: {
    primary: prev.customColors?.primary || '#7c3aed',
    accent: prev.customColors?.accent || '#a855f7',
    buttonText: prev.customColors?.buttonText || '#ffffff',
    priceColor: prev.customColors?.priceColor || '#7c3aed',
    neonFrame: prev.customColors?.neonFrame || '#a855f7',
    [colorType]: color
   }
  }));
 };

 // FORÇAGE TEMPS RÉEL des couleurs dans l'aperçu
 useEffect(() => {
  if (salonData.customColors) {
   const forcePreviewColors = () => {
    // Forcer les boutons
    const previewButtons = document.querySelectorAll('.reservation-preview-btn');
    previewButtons.forEach((btn: any) => {
     btn.style.backgroundColor = salonData.customColors?.primary || '#7c3aed';
     btn.style.color = salonData.customColors?.buttonText || '#ffffff';
    });

    // Forcer les prix
    const previewPrices = document.querySelectorAll('.price-preview');
    previewPrices.forEach((price: any) => {
     price.style.color = salonData.customColors?.priceColor || '#7c3aed';
    });

    // Forcer les cartes de catégories avec effet néon (seulement si expanded)
    const categoryCards = document.querySelectorAll('.category-card-preview');
    categoryCards.forEach((card: any, index: number) => {
     const category = salonData.serviceCategories[index];
     if (category?.expanded) {
      card.style.border = `2px solid ${salonData.customColors?.neonFrame || '#a855f7'}`;
      card.style.boxShadow = `0 0 12px ${salonData.customColors?.neonFrame || '#a855f7'}30`;
     } else {
      card.style.border = '1px solid #e5e7eb';
      card.style.boxShadow = 'none';
     }
    });
   };

   forcePreviewColors();
   setTimeout(forcePreviewColors, 50);
  }
 }, [salonData.customColors]);

 // Couleurs prédéfinies
 const predefinedColors = [
  '#7c3aed', // violet
  '#ef4444', // rouge
  '#22c55e', // vert 
  '#3b82f6', // bleu
  '#f59e0b', // orange
  '#ec4899', // rose
  '#06b6d4', // cyan
  '#8b5cf6', // purple
 ];

 // Gestion de l'upload de photo de couverture
 const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
   // Vérification de la taille (max 5MB)
   if (file.size > 5 * 1024 * 1024) {
    toast({
     title: "Fichier trop volumineux",
     description: "La photo ne doit pas dépasser 5MB",
     variant: "destructive",
    });
    return;
   }

   // Vérification du type
   if (!file.type.startsWith('image/')) {
    toast({
     title: "Format non supporté",
     description: "Veuillez sélectionner un fichier image",
     variant: "destructive",
    });
    return;
   }

   // Créer un aperçu avec FileReader
   const reader = new FileReader();
   reader.onload = (event) => {
    const imageUrl = event.target?.result as string;
    updateField('coverImageUrl', imageUrl);
    toast({
     title: "Photo mise à jour",
     description: "La photo de couverture a été modifiée",
    });
   };
   reader.readAsDataURL(file);
  }
 };

 // Supprimer la photo de couverture
 const removeCoverImage = () => {
  updateField('coverImageUrl', '');
  toast({
   title: "Photo supprimée",
   description: "La photo de couverture a été supprimée",
  });
 };

 const addService = (categoryId: number) => {
  setSalonData(prev => ({
   ...prev,
   serviceCategories: prev.serviceCategories.map(cat => 
    cat.id === categoryId ? {
     ...cat,
     services: [...cat.services, {
      id: Date.now(),
      name: 'Nouvelle prestation',
      price: 0,
      duration: '1h',
      description: 'Description de la prestation'
     }]
    } : cat
   )
  }));
 };

 const updateService = (categoryId: number, serviceId: number, updates: Partial<Service>) => {
  setSalonData(prev => ({
   ...prev,
   serviceCategories: prev.serviceCategories.map(cat => 
    cat.id === categoryId ? {
     ...cat,
     services: cat.services.map(service => 
      service.id === serviceId ? { ...service, ...updates } : service
     )
    } : cat
   )
  }));
 };

 const deleteService = (categoryId: number, serviceId: number) => {
  setSalonData(prev => ({
   ...prev,
   serviceCategories: prev.serviceCategories.map(cat => 
    cat.id === categoryId ? {
     ...cat,
     services: cat.services.filter(service => service.id !== serviceId)
    } : cat
   )
  }));
 };

 // 🔥 AJOUTER UNE NOUVELLE CATÉGORIE DE SERVICES
 const addCategory = () => {
  const newCategory = {
   id: Date.now(),
   name: 'Nouvelle catégorie',
   expanded: true,
   services: [{
    id: Date.now() + 1,
    name: 'Nouvelle prestation',
    price: 0,
    duration: '1h',
    description: ''
   }]
  };
  
  setSalonData(prev => ({
   ...prev,
   serviceCategories: [...prev.serviceCategories, newCategory]
  }));
  
  toast({
   title: "Catégorie ajoutée",
   description: "Nouvelle catégorie de services créée. Vous pouvez maintenant la personnaliser.",
  });
 };

 // 🔥 SUPPRIMER UNE CATÉGORIE COMPLÈTE
 const deleteCategory = (categoryId: number) => {
  setSalonData(prev => ({
   ...prev,
   serviceCategories: prev.serviceCategories.filter(cat => cat.id !== categoryId)
  }));
  
  toast({
   title: "Catégorie supprimée",
   description: "La catégorie et tous ses services ont été supprimés.",
  });
 };

 // 🔥 MODIFIER LE NOM D'UNE CATÉGORIE
 const updateCategoryName = (categoryId: number, newName: string) => {
  setSalonData(prev => ({
   ...prev,
   serviceCategories: prev.serviceCategories.map(cat => 
    cat.id === categoryId ? { ...cat, name: newName } : cat
   )
  }));
 };

 const toggleCategory = (categoryId: number) => {
  setSalonData(prev => ({
   ...prev,
   serviceCategories: prev.serviceCategories.map(cat => 
    cat.id === categoryId ? { ...cat, expanded: !cat.expanded } : cat
   )
  }));
 };

 if (isLoading) {
  return (
   <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full" />
   </div>
  );
 }

 return (
  <div className="min-h-screen bg-gray-50">
   <div className="max-w-lg mx-auto bg-white shadow-lg">
    {/* Header avec boutons d'action */}
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
     <div className="flex items-center justify-between p-4">
      <Button
       variant="ghost"
       size="sm"
       onClick={() => window.history.back()}
       className="text-gray-700 hover:bg-violet-500/30 backdrop-blur-md border border-violet-300/20"
      >
       <ArrowLeft className="w-4 h-4" />
      </Button>
      <div className="flex items-center gap-2">
       <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsEditing(!isEditing)}
        className={`text-gray-700 ${isEditing ? 'bg-violet-500/30 backdrop-blur-md border border-violet-300/20 text-pink-700' : 'hover:bg-violet-500/30 backdrop-blur-md border border-violet-300/20'}`}
       >
        <Edit3 className="w-4 h-4 mr-1" />
        {isEditing ? 'Mode Aperçu' : 'Modifier'}
       </Button>
       {isEditing && (
        <Button
         size="sm"
         onClick={handleSave}
         disabled={saveMutation.isPending}
         className={getGenericGlassButton(0)}
        >
         <Save className="w-4 h-4 mr-1" />
         {saveMutation.isPending ? 'Sauvegarde...' : 'Enregistrer'}
        </Button>
       )}
      </div>
     </div>
    </div>

    {/* Photo de couverture éditable */}
    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
     {salonData.coverImageUrl ? (
      <img 
       src={salonData.coverImageUrl} 
       alt="Photo de couverture" 
       className="w-full h-full object-cover" 
      />
     ) : (
      <div className="w-full h-full bg-gradient-to-br from-violet-50 to-purple-50 flex items-center justify-center border-2 border-dashed border-gray-300">
       <div className="text-center text-gray-500">
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm">Photo de couverture</p>
        <p className="text-xs">Cliquez pour ajouter</p>
       </div>
      </div>
     )}
     
     {isEditing && (
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
       <div className="flex gap-2">
        <label htmlFor="cover-upload" className="cursor-pointer">
         <div className="bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-white transition-colors">
          <Upload className="w-4 h-4" />
          Changer la photo
         </div>
         <input
          id="cover-upload"
          type="file"
          accept="image/*"
          onChange={handleCoverImageUpload}
          className="hidden"
         />
        </label>
        {salonData.coverImageUrl && (
         <button
          onClick={removeCoverImage}
          className="bg-violet-500/30 backdrop-blur-md border border-violet-300/20/90 backdrop-blur-sm text-black px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-violet-500/30 backdrop-blur-md border border-violet-300/20 transition-colors"
         >
          <Trash2 className="w-4 h-4" />
          Supprimer
         </button>
        )}
       </div>
      </div>
     )}
    </div>

    {/* Informations du salon */}
    <div className="p-4 space-y-4">
     {/* Nom du salon */}
     <div>
      {isEditing ? (
       <Input
        value={salonData.name}
        onChange={(e) => updateField('name', e.target.value)}
        className="text-xl font-bold bg-white border-gray-300 text-gray-900"
        placeholder="Nom du salon"
       />
      ) : (
       <h1 className="text-xl font-bold text-gray-900">{salonData.name}</h1>
      )}
      <div className="flex items-center gap-1 mt-1">
       <Star className="w-4 h-4 text-yellow-500 fill-current" />
       <span className="text-yellow-600 font-medium">{salonData.rating}</span>
       <span className="text-gray-500">({salonData.reviews} avis)</span>
       {salonData.verified && (
        <CheckCircle className="w-4 h-4 text-blue-500 ml-2" />
       )}
      </div>
     </div>

     {/* Description courte */}
     <div>
      {isEditing ? (
       <Textarea
        value={salonData.description}
        onChange={(e) => updateField('description', e.target.value)}
        className="bg-white border-gray-300 text-gray-900 text-sm"
        placeholder="Description courte du salon"
        rows={2}
       />
      ) : (
       <p className="text-gray-600 text-sm">{salonData.description}</p>
      )}
     </div>

     {/* Adresse et téléphone */}
     <div className="space-y-2 text-sm">
      <div className="flex items-center gap-2 text-gray-600">
       <MapPin className="w-4 h-4" />
       {isEditing ? (
        <Input
         value={salonData.address}
         onChange={(e) => updateField('address', e.target.value)}
         className="bg-white border-gray-300 text-gray-900 text-sm"
         placeholder="Adresse"
        />
       ) : (
        <span>{salonData.address}</span>
       )}
      </div>
      <div className="flex items-center gap-2 text-gray-600">
       <Phone className="w-4 h-4" />
       {isEditing ? (
        <Input
         value={salonData.phone}
         onChange={(e) => updateField('phone', e.target.value)}
         className="bg-white border-gray-300 text-gray-900 text-sm"
         placeholder="Téléphone"
        />
       ) : (
        <span>{salonData.phone}</span>
       )}
      </div>
     </div>
    </div>

    {/* Navigation par onglets */}
    <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
     <div className="flex overflow-x-auto">
      {['services', 'personnel', 'couleurs', 'infos', 'avis'].map((tab) => (
       <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`flex-1 py-3 px-3 text-sm font-medium transition-colors whitespace-nowrap ${
         activeTab === tab
          ? 'text-violet-600 border-b-2 border-violet-600'
          : 'text-gray-500 hover:text-gray-700'
        }`}
       >
        {tab === 'services' && 'Services'}
        {tab === 'personnel' && 'Personnel'}
        {tab === 'couleurs' && 'Couleurs'}
        {tab === 'infos' && 'Infos'}
        {tab === 'avis' && 'Avis'}
       </button>
      ))}
     </div>
    </div>

    {/* Contenu des onglets */}
    <div className="p-4">
     {activeTab === 'services' && (
      <div className="space-y-4">
       {/* Bouton pour ajouter une nouvelle catégorie */}
       {isEditing && (
        <div className="text-center">
         <Button
          onClick={addCategory}
          className="bg-violet-500/30 backdrop-blur-md border border-violet-300/20 text-violet-700 hover:bg-violet-500/30 backdrop-blur-md border border-violet-300/20 border-2 border-dashed border-violet-300 w-full py-6"
         >
          <Plus className="w-5 h-5 mr-2" />
          Ajouter une catégorie (ex: Cheveux, Visage, Ongles...)
         </Button>
        </div>
       )}
       
       {salonData.serviceCategories.map((category) => (
        <Card 
         key={category.id} 
         className="bg-white shadow-sm category-card-preview"
         style={category.expanded ? {
          border: `2px solid ${salonData.customColors?.neonFrame || '#a855f7'}`,
          boxShadow: `0 0 12px ${salonData.customColors?.neonFrame || '#a855f7'}30`
         } : {
          border: '1px solid #e5e7eb'
         }}
        >
         <CardContent className="p-4">
          <div 
           className="flex items-center justify-between cursor-pointer"
           onClick={() => toggleCategory(category.id)}
          >
           {/* Nom de la catégorie éditable */}
           {isEditing ? (
            <Input
             value={category.name}
             onChange={(e) => {
              e.stopPropagation();
              updateCategoryName(category.id, e.target.value);
             }}
             onClick={(e) => e.stopPropagation()}
             className="bg-white border-gray-300 text-gray-900 font-semibold text-base max-w-xs"
             placeholder="Nom de la catégorie (ex: Cheveux, Visage...)"
            />
           ) : (
            <h3 className="font-semibold text-gray-900">{category.name}</h3>
           )}
           
           <div className="flex items-center gap-2">
            {isEditing && (
             <>
              <Button
               size="sm"
               variant="ghost"
               onClick={(e) => {
                e.stopPropagation();
                addService(category.id);
               }}
               className="text-violet-600 hover:bg-violet-50"
               title="Ajouter un service"
              >
               <Plus className="w-4 h-4" />
              </Button>
              <Button
               size="sm"
               variant="ghost"
               onClick={(e) => {
                e.stopPropagation();
                deleteCategory(category.id);
               }}
               className="text-red-600 hover:bg-red-50"
               title="Supprimer cette catégorie"
              >
               <Trash2 className="w-4 h-4" />
              </Button>
             </>
            )}
            <span className="text-gray-500">
             {category.expanded ? '−' : '+'}
            </span>
           </div>
          </div>
          
          {category.expanded && (
           <div className="mt-3 space-y-3">
            {category.services.map((service) => (
             <div key={service.id} className="border-t border-gray-200 pt-3">
              {isEditing ? (
               <div className="space-y-2">
                <div className="flex items-center gap-2">
                 <Input
                  value={service.name}
                  onChange={(e) => updateService(category.id, service.id, { name: e.target.value })}
                  className="bg-white border-gray-300 text-gray-900 text-sm"
                  placeholder="Nom du service"
                 />
                 <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteService(category.id, service.id)}
                  className="text-red-600 hover:bg-red-50"
                 >
                  <Trash2 className="w-4 h-4" />
                 </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                 <Input
                  type="number"
                  value={service.price}
                  onChange={(e) => updateService(category.id, service.id, { price: parseInt(e.target.value) })}
                  className="bg-white border-gray-300 text-gray-900 text-sm"
                  placeholder="Prix"
                 />
                 <Input
                  value={service.duration}
                  onChange={(e) => updateService(category.id, service.id, { duration: e.target.value })}
                  className="bg-white border-gray-300 text-gray-900 text-sm"
                  placeholder="Durée"
                 />
                </div>
                <Textarea
                 value={service.description || ''}
                 onChange={(e) => updateService(category.id, service.id, { description: e.target.value })}
                 className="bg-white border-gray-300 text-gray-900 text-sm"
                 placeholder="Description"
                 rows={2}
                />
               </div>
              ) : (
               <div className="flex justify-between items-start">
                <div className="flex-1">
                 <h4 className="font-medium text-gray-900">{service.name}</h4>
                 {service.description && (
                  <p className="text-gray-600 text-xs mt-1">{service.description}</p>
                 )}
                 <div className="flex items-center gap-3 mt-2 text-sm">
                  <div className="flex items-center gap-1 text-gray-500">
                   <Clock className="w-3 h-3" />
                   <span>{service.duration}</span>
                  </div>
                 </div>
                </div>
                <div className="text-right">
                 <div 
                  className="text-lg font-bold price-preview"
                  style={{
                   color: salonData.customColors?.priceColor || '#7c3aed'
                  }}
                 >
                  {service.price}€
                 </div>
                 <button 
                  className="mt-2 px-4 py-2 text-sm font-medium rounded-md text-black transition-colors reservation-preview-btn"
                  style={{
                   backgroundColor: salonData.customColors?.primary || '#7c3aed',
                   color: salonData.customColors?.buttonText || '#ffffff'
                  }}
                 >
                  Réserver
                 </button>
                </div>
               </div>
              )}
             </div>
            ))}
           </div>
          )}
         </CardContent>
        </Card>
       ))}
      </div>
     )}

     {activeTab === 'personnel' && (
      <div className="space-y-4">
       <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-4">
         <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">👩‍💼 Votre équipe</h3>
          {isEditing && (
           <Button
            onClick={() => {
             const newPro = {
              id: Date.now().toString(),
              name: 'Nouveau professionnel',
              specialty: 'Spécialité',
              avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=150&h=150&fit=crop&crop=face',
              rating: 5.0,
              price: 50,
              bio: 'Description du professionnel',
              experience: '1 an d\'expérience'
             };
             setSalonData(prev => ({
              ...prev,
              professionals: [...(prev.professionals || []), newPro]
             }));
            }}
            className="bg-violet-500/30 backdrop-blur-md border border-violet-300/20 text-violet-700 hover:bg-violet-500/30 backdrop-blur-md border border-violet-300/20 border border-violet-300"
           >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un professionnel
           </Button>
          )}
         </div>
         
         <p className="text-gray-600 text-sm mb-6">
          Présentez votre équipe aux clients. Ils pourront choisir avec qui prendre rendez-vous.
         </p>

         <div className="space-y-4">
          {(salonData.professionals || []).map((professional, index) => (
           <div key={professional.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="flex items-start gap-4">
             {/* Photo de profil */}
             <div className="flex-shrink-0">
              <img
               src={professional.avatar}
               alt={professional.name}
               className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
              {isEditing && (
               <div className="mt-2">
                <label className="cursor-pointer">
                 <div className="text-xs text-violet-600 hover:text-violet-800 flex items-center gap-1">
                  <Upload className="w-3 h-3" />
                  Changer
                 </div>
                 <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                   const file = e.target.files?.[0];
                   if (file) {
                    const url = URL.createObjectURL(file);
                    setSalonData(prev => ({
                     ...prev,
                     professionals: prev.professionals?.map(p => 
                      p.id === professional.id ? { ...p, avatar: url } : p
                     ) || []
                    }));
                   }
                  }}
                  className="hidden"
                 />
                </label>
               </div>
              )}
             </div>
             
             <div className="flex-1 space-y-3">
              {/* Nom */}
              <div>
               {isEditing ? (
                <Input
                 value={professional.name}
                 onChange={(e) => {
                  setSalonData(prev => ({
                   ...prev,
                   professionals: prev.professionals?.map(p => 
                    p.id === professional.id ? { ...p, name: e.target.value } : p
                   ) || []
                  }));
                 }}
                 className="font-semibold text-gray-900"
                 placeholder="Nom du professionnel"
                />
               ) : (
                <h4 className="font-semibold text-gray-900">{professional.name}</h4>
               )}
              </div>

              {/* Spécialité */}
              <div>
               {isEditing ? (
                <Input
                 value={professional.specialty}
                 onChange={(e) => {
                  setSalonData(prev => ({
                   ...prev,
                   professionals: prev.professionals?.map(p => 
                    p.id === professional.id ? { ...p, specialty: e.target.value } : p
                   ) || []
                  }));
                 }}
                 className="text-sm text-gray-600"
                 placeholder="Spécialité (ex: Coiffure & Coloration)"
                />
               ) : (
                <p className="text-sm text-gray-600">{professional.specialty}</p>
               )}
              </div>

              {/* Prix et note */}
              <div className="flex items-center gap-4">
               <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                {isEditing ? (
                 <Input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={professional.rating}
                  onChange={(e) => {
                   setSalonData(prev => ({
                    ...prev,
                    professionals: prev.professionals?.map(p => 
                     p.id === professional.id ? { ...p, rating: parseFloat(e.target.value) } : p
                    ) || []
                   }));
                  }}
                  className="w-16 text-sm"
                 />
                ) : (
                 <span className="text-sm font-medium">{professional.rating}</span>
                )}
               </div>
               
               <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">À partir de</span>
                {isEditing ? (
                 <div className="flex items-center gap-1">
                  <Input
                   type="number"
                   min="0"
                   value={professional.price}
                   onChange={(e) => {
                    setSalonData(prev => ({
                     ...prev,
                     professionals: prev.professionals?.map(p => 
                      p.id === professional.id ? { ...p, price: parseInt(e.target.value) } : p
                     ) || []
                    }));
                   }}
                   className="w-20 text-sm"
                  />
                  <span className="text-sm">€</span>
                 </div>
                ) : (
                 <span className="font-semibold" style={{ color: salonData.customColors?.priceColor || '#7c3aed' }}>
                  {professional.price}€
                 </span>
                )}
               </div>
              </div>

              {/* Bio */}
              <div>
               {isEditing ? (
                <Textarea
                 value={professional.bio}
                 onChange={(e) => {
                  setSalonData(prev => ({
                   ...prev,
                   professionals: prev.professionals?.map(p => 
                    p.id === professional.id ? { ...p, bio: e.target.value } : p
                   ) || []
                  }));
                 }}
                 className="text-sm"
                 placeholder="Description courte du professionnel"
                 rows={2}
                />
               ) : (
                <p className="text-sm text-gray-700">{professional.bio}</p>
               )}
              </div>

              {/* Expérience */}
              <div>
               {isEditing ? (
                <Input
                 value={professional.experience}
                 onChange={(e) => {
                  setSalonData(prev => ({
                   ...prev,
                   professionals: prev.professionals?.map(p => 
                    p.id === professional.id ? { ...p, experience: e.target.value } : p
                   ) || []
                  }));
                 }}
                 className="text-xs text-gray-500"
                 placeholder="Expérience (ex: 5 ans d'expérience)"
                />
               ) : (
                <p className="text-xs text-gray-500">{professional.experience}</p>
               )}
              </div>
             </div>

             {/* Bouton supprimer */}
             {isEditing && (
              <Button
               variant="ghost"
               size="sm"
               onClick={() => {
                setSalonData(prev => ({
                 ...prev,
                 professionals: prev.professionals?.filter(p => p.id !== professional.id) || []
                }));
                toast({
                 title: "Professionnel supprimé",
                 description: `${professional.name} a été retiré de votre équipe.`,
                });
               }}
               className="text-red-600 hover:text-red-800 hover:bg-red-50"
              >
               <Trash2 className="w-4 h-4" />
              </Button>
             )}
            </div>
           </div>
          ))}

          {(salonData.professionals || []).length === 0 && (
           <div className="text-center py-8 text-gray-500">
            <p className="mb-4">Aucun professionnel ajouté</p>
            {isEditing && (
             <p className="text-sm">Cliquez sur "Ajouter un professionnel" pour commencer</p>
            )}
           </div>
          )}
         </div>
        </CardContent>
       </Card>
      </div>
     )}

     {activeTab === 'couleurs' && (
      <div className="space-y-6">
       <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-4">
         <h3 className="font-semibold text-gray-900 mb-4">🎨 Personnaliser les couleurs</h3>
         <p className="text-gray-600 text-sm mb-6">
          Personnalisez les couleurs de votre salon pour refléter votre identité visuelle.
         </p>

         <div className="space-y-6">
          {/* Couleur principale */}
          <div>
           <label className="block text-sm font-medium text-gray-700 mb-3">
            Couleur principale (boutons et liens)
           </label>
           <div className="flex items-center gap-3 mb-3">
            <input
             type="color"
             value={salonData.customColors?.primary || '#7c3aed'}
             onChange={(e) => updateCustomColor('primary', e.target.value)}
             className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
            />
            <input
             type="text"
             value={salonData.customColors?.primary || '#7c3aed'}
             onChange={(e) => updateCustomColor('primary', e.target.value)}
             className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
             placeholder="#7c3aed"
            />
           </div>
           <div className="grid grid-cols-4 gap-2">
            {predefinedColors.map((color, index) => (
             <button
              key={index}
              onClick={() => updateCustomColor('primary', color)}
              className="w-12 h-8 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors"
              style={{ backgroundColor: color }}
              title={color}
             />
            ))}
           </div>
          </div>

          {/* Couleur d'accent */}
          <div>
           <label className="block text-sm font-medium text-gray-700 mb-3">
            Couleur d'accent (hover et bordures)
           </label>
           <div className="flex items-center gap-3 mb-3">
            <input
             type="color"
             value={salonData.customColors?.accent || '#a855f7'}
             onChange={(e) => updateCustomColor('accent', e.target.value)}
             className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
            />
            <input
             type="text"
             value={salonData.customColors?.accent || '#a855f7'}
             onChange={(e) => updateCustomColor('accent', e.target.value)}
             className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
             placeholder="#a855f7"
            />
           </div>
           <div className="grid grid-cols-4 gap-2">
            {predefinedColors.map((color, index) => (
             <button
              key={index}
              onClick={() => updateCustomColor('accent', color)}
              className="w-12 h-8 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors"
              style={{ backgroundColor: color }}
              title={color}
             />
            ))}
           </div>
          </div>

          {/* Couleur du texte des boutons */}
          <div>
           <label className="block text-sm font-medium text-gray-700 mb-3">
            Couleur du texte des boutons
           </label>
           <div className="flex items-center gap-3 mb-3">
            <input
             type="color"
             value={salonData.customColors?.buttonText || '#ffffff'}
             onChange={(e) => updateCustomColor('buttonText', e.target.value)}
             className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
            />
            <input
             type="text"
             value={salonData.customColors?.buttonText || '#ffffff'}
             onChange={(e) => updateCustomColor('buttonText', e.target.value)}
             className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
             placeholder="#ffffff"
            />
           </div>
           <div className="grid grid-cols-2 gap-2">
            {['#ffffff', '#000000'].map((color, index) => (
             <button
              key={index}
              onClick={() => updateCustomColor('buttonText', color)}
              className="w-12 h-8 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors"
              style={{ backgroundColor: color }}
              title={color}
             />
            ))}
           </div>
          </div>

          {/* Couleur des prix */}
          <div>
           <label className="block text-sm font-medium text-gray-700 mb-3">
            Couleur des prix
           </label>
           <div className="flex items-center gap-3 mb-3">
            <input
             type="color"
             value={salonData.customColors?.priceColor || '#7c3aed'}
             onChange={(e) => updateCustomColor('priceColor', e.target.value)}
             className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
            />
            <input
             type="text"
             value={salonData.customColors?.priceColor || '#7c3aed'}
             onChange={(e) => updateCustomColor('priceColor', e.target.value)}
             className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
             placeholder="#7c3aed"
            />
           </div>
           <div className="grid grid-cols-4 gap-2">
            {predefinedColors.map((color, index) => (
             <button
              key={index}
              onClick={() => updateCustomColor('priceColor', color)}
              className="w-12 h-8 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors"
              style={{ backgroundColor: color }}
              title={color}
             />
            ))}
           </div>
          </div>

          {/* Couleur du cadre néon */}
          <div>
           <label className="block text-sm font-medium text-gray-700 mb-3">
            Couleur du cadre néon (effet lumineux)
           </label>
           <div className="flex items-center gap-3 mb-3">
            <input
             type="color"
             value={salonData.customColors?.neonFrame || '#a855f7'}
             onChange={(e) => updateCustomColor('neonFrame', e.target.value)}
             className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
            />
            <input
             type="text"
             value={salonData.customColors?.neonFrame || '#a855f7'}
             onChange={(e) => updateCustomColor('neonFrame', e.target.value)}
             className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
             placeholder="#a855f7"
            />
           </div>
           <div className="grid grid-cols-4 gap-2">
            {predefinedColors.map((color, index) => (
             <button
              key={index}
              onClick={() => updateCustomColor('neonFrame', color)}
              className="w-12 h-8 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors"
              style={{ backgroundColor: color }}
              title={color}
             />
            ))}
           </div>
          </div>

          {/* Aperçu complet */}
          <div className="pt-4 border-t border-gray-200">
           <h4 className="font-medium text-gray-900 mb-3">🔍 Aperçu des couleurs</h4>
           <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            {/* Bouton principal avec effet néon */}
            <button 
             className="w-full px-4 py-3 rounded-lg font-medium transition-all"
             style={{ 
              backgroundColor: salonData.customColors?.primary || '#7c3aed',
              color: salonData.customColors?.buttonText || '#ffffff',
              boxShadow: `0 0 15px ${salonData.customColors?.neonFrame || '#a855f7'}60`,
              border: `2px solid ${salonData.customColors?.neonFrame || '#a855f7'}`
             }}
            >
             🎯 Bouton "Réserver" avec effet néon
            </button>

            {/* Exemple de prix */}
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
             <div className="text-gray-700">Coupe + Brushing</div>
             <div 
              className="text-xl font-bold"
              style={{ color: salonData.customColors?.priceColor || '#7c3aed' }}
             >
              45€
             </div>
            </div>

            {/* Exemple de catégorie dépliée avec effet néon */}
            <div 
             className="bg-white p-4 rounded-lg space-y-2"
             style={{
              border: `2px solid ${salonData.customColors?.neonFrame || '#a855f7'}`,
              boxShadow: `0 0 12px ${salonData.customColors?.neonFrame || '#a855f7'}30`
             }}
            >
             <h4 className="font-semibold text-gray-900 mb-2">💇‍♀️ Cheveux (dépliée = cadre néon)</h4>
             <div className="flex justify-between items-start border-t border-gray-200 pt-2">
              <div>
               <h5 className="font-medium text-gray-900">Coloration complète</h5>
               <p className="text-sm text-gray-600">Avec soin professionnel</p>
              </div>
              <div className="text-right">
               <div 
                className="text-lg font-bold mb-2"
                style={{ color: salonData.customColors?.priceColor || '#7c3aed' }}
               >
                80€
               </div>
               <button 
                className="px-3 py-1.5 text-sm rounded-md font-medium"
                style={{ 
                 backgroundColor: salonData.customColors?.primary || '#7c3aed',
                 color: salonData.customColors?.buttonText || '#ffffff'
                }}
               >
                Réserver
               </button>
              </div>
             </div>
            </div>

            {/* Exemple de catégorie fermée */}
            <div 
             className="bg-white p-4 rounded-lg"
             style={{
              border: '1px solid #e5e7eb'
             }}
            >
             <h4 className="font-semibold text-gray-900">🧴 Soins Visage (fermée = pas de néon)</h4>
            </div>
           </div>
          </div>
         </div>
        </CardContent>
       </Card>
      </div>
     )}

     {activeTab === 'infos' && (
      <div className="space-y-4">
       {/* Histoire du salon */}
       <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-4">
         <h3 className="font-semibold text-gray-900 mb-3">À propos du salon</h3>
         {isEditing ? (
          <Textarea
           value={salonData.longDescription}
           onChange={(e) => updateField('longDescription', e.target.value)}
           className="bg-white border-gray-300 text-gray-900 text-sm min-h-[120px]"
           placeholder="Histoire et description détaillée du salon"
          />
         ) : (
          <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
           {salonData.longDescription}
          </div>
         )}
        </CardContent>
       </Card>

       {/* Certifications */}
       <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-4">
         <h3 className="font-semibold text-gray-900 mb-3">Certifications</h3>
         <div className="space-y-2">
          {salonData.certifications.map((cert, index) => (
           <div key={index} className="flex items-center gap-2">
            <Award className="w-4 h-4 text-yellow-500" />
            <span className="text-gray-700 text-sm">{cert}</span>
           </div>
          ))}
         </div>
        </CardContent>
       </Card>

       {/* Récompenses */}
       <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-4">
         <h3 className="font-semibold text-gray-900 mb-3">Récompenses</h3>
         <div className="space-y-2">
          {salonData.awards.map((award, index) => (
           <div key={index} className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-gray-700 text-sm">{award}</span>
           </div>
          ))}
         </div>
        </CardContent>
       </Card>
      </div>
     )}

     {activeTab === 'avis' && (
      <div className="space-y-4">
       <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-4">
         <h3 className="font-semibold text-gray-900 mb-3">Avis clients</h3>
         <div className="text-center text-gray-500">
          <p>Section en développement</p>
          <p className="text-sm mt-1">Les avis clients seront bientôt disponibles</p>
         </div>
        </CardContent>
       </Card>
      </div>
     )}
    </div>
   </div>
  </div>
 );
}