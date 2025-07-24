import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { 
  ArrowLeft, 
  CreditCard, 
  Plus,
  Trash2,
  Check
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface PaymentMethod {
  id: number;
  name: string;
  type: string;
  isActive: boolean;
  description?: string;
  fees?: number;
}

export default function PaymentMethodsManager() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMethod, setNewMethod] = useState({
    name: '',
    type: 'card',
    description: '',
    fees: 0
  });

  // Récupérer les méthodes de paiement actuelles
  const { data: paymentMethods = [], isLoading } = useQuery({
    queryKey: ['/api/professional/payment-methods'],
  });

  // Mutation pour ajouter une méthode
  const addMethodMutation = useMutation({
    mutationFn: async (methodData: typeof newMethod) => {
      const response = await apiRequest('POST', '/api/professional/payment-methods', methodData);
      if (!response.ok) throw new Error('Erreur lors de l\'ajout');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Méthode ajoutée",
        description: "La nouvelle méthode de paiement a été ajoutée"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/professional/payment-methods'] });
      setIsAddDialogOpen(false);
      setNewMethod({ name: '', type: 'card', description: '', fees: 0 });
    }
  });

  // Mutation pour activer/désactiver une méthode
  const toggleMethodMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const response = await apiRequest('PATCH', `/api/professional/payment-methods/${id}`, { isActive });
      if (!response.ok) throw new Error('Erreur lors de la modification');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/professional/payment-methods'] });
    }
  });

  // Mutation pour supprimer une méthode
  const deleteMethodMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/professional/payment-methods/${id}`, {});
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Méthode supprimée",
        description: "La méthode de paiement a été supprimée"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/professional/payment-methods'] });
    }
  });

  const handleAddMethod = () => {
    if (!newMethod.name.trim()) {
      toast({
        title: "Nom requis",
        description: "Veuillez saisir un nom pour la méthode de paiement",
        variant: "destructive"
      });
      return;
    }

    addMethodMutation.mutate(newMethod);
  };

  const handleToggleMethod = (id: number, currentStatus: boolean) => {
    toggleMethodMutation.mutate({ id, isActive: !currentStatus });
  };

  const handleDeleteMethod = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette méthode de paiement ?')) {
      deleteMethodMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/business-features')}
              className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Méthodes de Paiement</h1>
              <p className="text-gray-600">Gérez les moyens de paiement acceptés dans votre salon</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Bouton d'ajout */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Ajouter une méthode</h2>
                <p className="text-gray-600 text-sm">Les méthodes actives seront affichées sur votre page de réservation</p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-violet-600 hover:bg-violet-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une méthode
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Nouvelle méthode de paiement</DialogTitle>
                    <DialogDescription>
                      Ajoutez une nouvelle méthode de paiement acceptée dans votre salon
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom de la méthode *
                      </label>
                      <Input
                        value={newMethod.name}
                        onChange={(e) => setNewMethod(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex: Carte bancaire, Espèces, Chèques..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type
                      </label>
                      <select
                        value={newMethod.type}
                        onChange={(e) => setNewMethod(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                      >
                        <option value="card">Carte bancaire</option>
                        <option value="cash">Espèces</option>
                        <option value="check">Chèque</option>
                        <option value="transfer">Virement</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description (optionnel)
                      </label>
                      <Input
                        value={newMethod.description}
                        onChange={(e) => setNewMethod(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Ex: CB sans contact acceptée"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frais (%)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={newMethod.fees}
                        onChange={(e) => setNewMethod(prev => ({ ...prev, fees: parseFloat(e.target.value) || 0 }))}
                        placeholder="0"
                      />
                    </div>

                    <Button
                      onClick={handleAddMethod}
                      disabled={addMethodMutation.isPending}
                      className="w-full bg-violet-600 hover:bg-violet-700"
                    >
                      {addMethodMutation.isPending ? 'Ajout...' : 'Ajouter la méthode'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Liste des méthodes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-violet-600" />
              Méthodes configurées
            </CardTitle>
          </CardHeader>
          <CardContent>
            {paymentMethods.length > 0 ? (
              <div className="space-y-4">
                {paymentMethods.map((method: PaymentMethod) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        method.isActive ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {method.isActive ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : (
                          <CreditCard className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{method.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Type: {method.type}</span>
                          {method.fees > 0 && <span>Frais: {method.fees}%</span>}
                        </div>
                        {method.description && (
                          <p className="text-xs text-gray-500 mt-1">{method.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {method.isActive ? 'Actif' : 'Inactif'}
                        </span>
                        <Switch
                          checked={method.isActive}
                          onCheckedChange={() => handleToggleMethod(method.id, method.isActive)}
                          disabled={toggleMethodMutation.isPending}
                        />
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMethod(method.id)}
                        disabled={deleteMethodMutation.isPending}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune méthode configurée</h3>
                <p className="text-gray-600 mb-4">Ajoutez vos méthodes de paiement pour que les clients puissent réserver</p>
                <Button 
                  onClick={() => setIsAddDialogOpen(true)}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  Ajouter ma première méthode
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info supplémentaire */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Informations importantes</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Les méthodes actives sont affichées sur votre page de réservation publique</li>
              <li>• Les clients verront ces options lors du processus de paiement</li>
              <li>• Vous pouvez activer/désactiver les méthodes à tout moment</li>
              <li>• Les frais sont indicatifs et peuvent être affichés aux clients</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}