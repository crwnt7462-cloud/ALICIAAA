type StaffMember = { id: string | number; isActive?: boolean; availableToday?: boolean; [k: string]: any };
type StaffStats = { totalRevenue?: number; totalAppointments?: number; averageRating?: number };
import { useState } from "react";
import { useLocation } from "wouter";
import { 
  ArrowLeft, 
  Plus, 
  Edit3, 
  Trash2, 
  Mail, 
  Phone, 
  Star,
  Users,
  Clock
} from "lucide-react";
import { useStaffManagement, type Professional } from "@/hooks/useStaffManagement";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge as UIBadge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MobileBottomNav } from "@/components/MobileBottomNav";



export default function StaffManagementModern() {
  const [, setLocation] = useLocation();
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Professional | null>(null);
  
  // Utiliser le hook synchronisé de gestion du staff
  const { professionals: staffMembers, addProfessional, updateProfessional, deleteProfessional } = useStaffManagement();

  const [newStaff, setNewStaff] = useState<Partial<Professional>>({
    name: "",
    role: "",
    email: "",
    phone: "",
    photo: "",
    bio: "",
    specialties: [],
    experience: "",
    rating: 5.0,
    reviewCount: 0,
    nextAvailable: "Disponible maintenant"
  });

  const handleAddStaff = () => {
    if (newStaff.name && newStaff.role && newStaff.email) {
      addProfessional({
        ...newStaff as Omit<Professional, 'id'>,
        photo: newStaff.photo || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&auto=format",
        specialties: newStaff.specialties || []
      });
      setNewStaff({
        name: "",
        role: "",
        email: "",
        phone: "",
        photo: "",
        bio: "",
        specialties: [],
        experience: "",
        rating: 5.0,
        reviewCount: 0,
        nextAvailable: "Disponible maintenant"
      });
      setIsAddingStaff(false);
    }
  };

  const handleDeleteStaff = (id: string) => {
    deleteProfessional(id);
  };

  const handleEditStaff = (staff: Professional) => {
    setEditingStaff(staff);
  };

  const handleUpdateStaff = () => {
    if (editingStaff) {
      updateProfessional(editingStaff.id, editingStaff);
      setEditingStaff(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Mobile */}
      <div className="lg:hidden">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/dashboard')}
              className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">Gestion de l'équipe</h1>
            <div className="w-10" />
          </div>
        </div>
      </div>

      {/* Desktop Layout avec Sidebar */}
      <div className="hidden lg:flex h-screen">
        {/* Sidebar */}
        <div className="w-60 bg-white shadow-lg border-r border-gray-200">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="px-6 py-8">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <span className="text-xl font-bold text-gray-800">Avyento</span>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1">
              <button 
                onClick={() => setLocation('/dashboard')}
                className="w-full flex items-center space-x-4 px-4 py-4 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-2xl transition-all duration-200"
              >
                <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <span className="font-medium">Dashboard</span>
              </button>
              
              <div className="flex items-center space-x-4 px-4 py-4 bg-blue-50 rounded-2xl text-blue-600 font-medium">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <span>Équipe</span>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Gestion de l'équipe</h1>
                <p className="text-gray-600 mt-2">Gérez les membres de votre équipe et leurs informations</p>
              </div>
              
              <Dialog open={isAddingStaff} onOpenChange={setIsAddingStaff}>
                <DialogTrigger asChild>
                  <Button className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg">
                    <Plus className="w-5 h-5 mr-2" />
                    Ajouter un membre
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Ajouter un nouveau membre de l'équipe</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet</Label>
                      <Input
                        id="name"
                        value={newStaff.name || ""}
                        onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                        placeholder="Ex: Sarah Delacroix"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Poste</Label>
                      <Input
                        id="role"
                        value={newStaff.role || ""}
                        onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                        placeholder="Ex: Coloriste Experte"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newStaff.email || ""}
                        onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                        placeholder="sarah@avyento.fr"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        value={newStaff.phone || ""}
                        onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                        placeholder="06 12 34 56 78"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="photo">URL Photo</Label>
                      <Input
                        id="photo"
                        value={newStaff.photo || ""}
                        onChange={(e) => setNewStaff({...newStaff, photo: e.target.value})}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Expérience</Label>
                      <Input
                        id="experience"
                        value={newStaff.experience || ""}
                        onChange={(e) => setNewStaff({...newStaff, experience: e.target.value})}
                        placeholder="Ex: 5 ans d'expérience"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="bio">Biographie</Label>
                      <Textarea
                        id="bio"
                        value={newStaff.bio || ""}
                        onChange={(e) => setNewStaff({...newStaff, bio: e.target.value})}
                        placeholder="Décrivez l'expérience et les spécialités..."
                        rows={3}
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="specialties">Spécialités (séparées par des virgules)</Label>
                      <Input
                        id="specialties"
                        value={newStaff.specialties?.join(", ") || ""}
                        onChange={(e) => setNewStaff({...newStaff, specialties: e.target.value.split(", ").filter(s => s.trim())})}
                        placeholder="Ex: Coloration, Balayage, Mèches"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddingStaff(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleAddStaff} className="bg-violet-600 hover:bg-violet-700">
                      Ajouter
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Liste des membres de l'équipe */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {staffMembers.map((member) => (
                <Card key={member.id} className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-16 h-16 rounded-2xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-gray-900 text-lg truncate">{member.name}</h3>
                          {member.nextAvailable.includes("Aujourd'hui") && (
                            <UIBadge variant="secondary" className="bg-green-50 text-green-700 text-xs">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                              Dispo
                            </UIBadge>
                          )}
                        </div>
                        <p className="text-violet-600 font-medium text-sm">{member.role}</p>
                        <p className="text-gray-500 text-xs">{member.experience}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{member.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{member.rating} ({member.reviewCount} avis)</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{member.nextAvailable}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 line-clamp-2">{member.bio}</p>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {member.specialties.slice(0, 3).map((specialty, index) => (
                        <UIBadge key={index} variant="secondary" className="text-xs bg-violet-50 text-violet-700">
                          {specialty}
                        </UIBadge>
                      ))}
                      {member.specialties.length > 3 && (
                        <UIBadge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                          +{member.specialties.length - 3}
                        </UIBadge>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditStaff(member)}
                        className="flex-1 hover:bg-violet-50 hover:border-violet-200"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Modifier
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteStaff(member.id)}
                        className="text-red-600 hover:bg-red-50 hover:border-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="lg:hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Votre équipe</h2>
              <p className="text-sm text-gray-600">{staffMembers.length} membres</p>
            </div>
            
            <Dialog open={isAddingStaff} onOpenChange={setIsAddingStaff}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
                  <Plus className="w-4 h-4 mr-1" />
                  Ajouter
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm mx-4">
                <DialogHeader>
                  <DialogTitle>Nouveau membre</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="mobile-name">Nom complet</Label>
                    <Input
                      id="mobile-name"
                      value={newStaff.name || ""}
                      onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                      placeholder="Sarah Delacroix"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile-role">Poste</Label>
                    <Input
                      id="mobile-role"
                      value={newStaff.role || ""}
                      onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                      placeholder="Coloriste Experte"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile-email">Email</Label>
                    <Input
                      id="mobile-email"
                      type="email"
                      value={newStaff.email || ""}
                      onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                      placeholder="sarah@avyento.fr"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setIsAddingStaff(false)} className="flex-1">
                    Annuler
                  </Button>
                  <Button onClick={handleAddStaff} className="flex-1 bg-violet-600 hover:bg-violet-700">
                    Ajouter
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {staffMembers.map((member) => (
              <Card key={member.id} className="bg-white rounded-xl shadow-sm border-0">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 text-sm">{member.name}</h3>
                        {member.availableToday && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-violet-600 text-xs font-medium">{member.role}</p>
                      <p className="text-gray-500 text-xs">{member.experience}</p>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {member.specialties.slice(0, 2).map((specialty, index) => (
                          <UIBadge key={index} variant="secondary" className="text-xs bg-violet-50 text-violet-700 px-1.5 py-0.5">
                            {specialty}
                          </UIBadge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditStaff(member)}
                      className="flex-1 text-xs"
                    >
                      <Edit3 className="w-3 h-3 mr-1" />
                      Modifier
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteStaff(member.id)}
                      className="text-red-600 hover:bg-red-50 text-xs"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Dialog d'édition */}
      {editingStaff && (
        <Dialog open={!!editingStaff} onOpenChange={() => setEditingStaff(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier {editingStaff.name}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Nom complet</Label>
                <Input
                  value={editingStaff.name}
                  onChange={(e) => setEditingStaff({...editingStaff, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Poste</Label>
                <Input
                  value={editingStaff.role}
                  onChange={(e) => setEditingStaff({...editingStaff, role: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={editingStaff.email}
                  onChange={(e) => setEditingStaff({...editingStaff, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input
                  value={editingStaff.phone}
                  onChange={(e) => setEditingStaff({...editingStaff, phone: e.target.value})}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Biographie</Label>
                <Textarea
                  value={editingStaff.bio}
                  onChange={(e) => setEditingStaff({...editingStaff, bio: e.target.value})}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingStaff(null)}>
                Annuler
              </Button>
              <Button onClick={handleUpdateStaff} className="bg-violet-600 hover:bg-violet-700">
                Sauvegarder
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Mobile Navigation */}
      <MobileBottomNav />
    </div>
  );
}