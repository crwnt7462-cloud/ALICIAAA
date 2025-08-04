import React, { useState } from 'react';
import { Plus, Tag, Calendar, Percent, Euro, Settings, Trash2, Edit, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PromoCode {
  id: number;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  validFrom: Date;
  validUntil: Date;
  maxUses?: number;
  currentUses: number;
  weekendPremium: boolean;
  isActive: boolean;
  applicableServices?: number[];
}

interface PromoCodeManagerProps {
  promoCodes: PromoCode[];
  onCreatePromoCode?: (promoCode: Omit<PromoCode, 'id' | 'currentUses'>) => void;
  onUpdatePromoCode?: (id: number, promoCode: Partial<PromoCode>) => void;
  onDeletePromoCode?: (id: number) => void;
  services?: Array<{ id: number; name: string; }>;
}

const promoCodeSchema = z.object({
  code: z.string().min(3, 'Le code doit contenir au moins 3 caractères').max(20),
  description: z.string().min(5, 'Description obligatoire'),
  discountType: z.enum(['percentage', 'fixed_amount']),
  discountValue: z.number().min(1, 'La valeur doit être supérieure à 0'),
  validFrom: z.string(),
  validUntil: z.string(),
  maxUses: z.number().optional(),
  weekendPremium: z.boolean().default(false),
  isActive: z.boolean().default(true),
  applicableServices: z.array(z.number()).optional(),
});

export default function PromoCodeManager({
  promoCodes,
  onCreatePromoCode,
  onUpdatePromoCode,
  onDeletePromoCode,
  services = []
}: PromoCodeManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromoCode, setEditingPromoCode] = useState<PromoCode | null>(null);
  const [showInactive, setShowInactive] = useState(false);

  const form = useForm<z.infer<typeof promoCodeSchema>>({
    resolver: zodResolver(promoCodeSchema),
    defaultValues: {
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: 10,
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      weekendPremium: false,
      isActive: true,
      applicableServices: [],
    },
  });

  const handleSubmit = (values: z.infer<typeof promoCodeSchema>) => {
    const promoCodeData = {
      ...values,
      validFrom: new Date(values.validFrom),
      validUntil: new Date(values.validUntil),
    };

    if (editingPromoCode) {
      onUpdatePromoCode?.(editingPromoCode.id, promoCodeData);
    } else {
      onCreatePromoCode?.(promoCodeData);
    }

    setIsDialogOpen(false);
    setEditingPromoCode(null);
    form.reset();
  };

  const openEditDialog = (promoCode: PromoCode) => {
    setEditingPromoCode(promoCode);
    form.reset({
      code: promoCode.code,
      description: promoCode.description,
      discountType: promoCode.discountType,
      discountValue: promoCode.discountValue,
      validFrom: format(promoCode.validFrom, 'yyyy-MM-dd'),
      validUntil: format(promoCode.validUntil, 'yyyy-MM-dd'),
      maxUses: promoCode.maxUses,
      weekendPremium: promoCode.weekendPremium,
      isActive: promoCode.isActive,
      applicableServices: promoCode.applicableServices || [],
    });
    setIsDialogOpen(true);
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    form.setValue('code', result);
  };

  const togglePromoCodeStatus = (id: number, isActive: boolean) => {
    onUpdatePromoCode?.(id, { isActive });
  };

  const filteredPromoCodes = showInactive 
    ? promoCodes 
    : promoCodes.filter(pc => pc.isActive);

  const isExpired = (promoCode: PromoCode) => {
    return new Date() > promoCode.validUntil;
  };

  const isMaxUsesReached = (promoCode: PromoCode) => {
    return promoCode.maxUses ? promoCode.currentUses >= promoCode.maxUses : false;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black">Codes Promotionnels</h2>
          <p className="text-gray-600">Gérez vos remises et offres spéciales</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch
              checked={showInactive}
              onCheckedChange={setShowInactive}
            />
            <span className="text-sm text-gray-600">Voir inactifs</span>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="glass-button hover:glass-effect text-black">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau code promo
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPromoCode ? 'Modifier le code promo' : 'Créer un code promo'}
                </DialogTitle>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  {/* Code */}
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code promotionnel</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input {...field} placeholder="PROMO2025" className="uppercase" />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={generateRandomCode}
                            className="glass-button hover:glass-effect text-black"
                          >
                            Générer
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Description de l'offre promotionnelle"
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Discount Type & Value */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="discountType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type de remise</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="percentage">Pourcentage</SelectItem>
                              <SelectItem value="fixed_amount">Montant fixe</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="discountValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Valeur {form.watch('discountType') === 'percentage' ? '(%)' : '(€)'}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="1"
                              onChange={e => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Validity Period */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="validFrom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valide à partir du</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="validUntil"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valide jusqu'au</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Max Uses */}
                  <FormField
                    control={form.control}
                    name="maxUses"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre d'utilisations maximum (optionnel)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="1"
                            placeholder="Illimité"
                            onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Options */}
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="weekendPremium"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <FormLabel>Applicable aux tarifs weekend majorés</FormLabel>
                            <p className="text-sm text-gray-500">
                              Ce code peut être utilisé même sur les créneaux à tarif majoré
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <FormLabel>Code actif</FormLabel>
                            <p className="text-sm text-gray-500">
                              Les codes inactifs ne peuvent pas être utilisés
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Services applicables */}
                  {services.length > 0 && (
                    <FormField
                      control={form.control}
                      name="applicableServices"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Services applicables (optionnel)</FormLabel>
                          <div className="border rounded-lg p-3 max-h-32 overflow-y-auto">
                            {services.map((service) => (
                              <div key={service.id} className="flex items-center space-x-2 py-1">
                                <input
                                  type="checkbox"
                                  id={`service-${service.id}`}
                                  checked={field.value?.includes(service.id)}
                                  onChange={(e) => {
                                    const current = field.value || [];
                                    if (e.target.checked) {
                                      field.onChange([...current, service.id]);
                                    } else {
                                      field.onChange(current.filter(id => id !== service.id));
                                    }
                                  }}
                                />
                                <label
                                  htmlFor={`service-${service.id}`}
                                  className="text-sm"
                                >
                                  {service.name}
                                </label>
                              </div>
                            ))}
                          </div>
                          <p className="text-sm text-gray-500">
                            Si aucun service n'est sélectionné, le code sera valable pour tous les services
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Submit Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        setEditingPromoCode(null);
                        form.reset();
                      }}
                      className="flex-1 glass-button hover:glass-effect text-black"
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 glass-button hover:glass-effect text-white bg-violet-600 hover:bg-violet-700"
                    >
                      {editingPromoCode ? 'Mettre à jour' : 'Créer'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Promo Codes List */}
      <div className="grid gap-4">
        {filteredPromoCodes.length === 0 ? (
          <Card className="glass-card border-white/40">
            <CardContent className="p-8 text-center">
              <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun code promotionnel
              </h3>
              <p className="text-gray-500 mb-4">
                Créez votre premier code promo pour attirer de nouveaux clients
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPromoCodes.map((promoCode) => (
            <Card key={promoCode.id} className="glass-card border-white/40">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <code className="bg-gray-100 px-3 py-1 rounded-lg text-lg font-mono font-bold">
                        {promoCode.code}
                      </code>
                      
                      <div className="flex items-center gap-2">
                        {promoCode.discountType === 'percentage' ? (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Percent className="h-3 w-3" />
                            {promoCode.discountValue}%
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Euro className="h-3 w-3" />
                            {promoCode.discountValue}€
                          </Badge>
                        )}
                        
                        {promoCode.weekendPremium && (
                          <Badge variant="outline">Weekend</Badge>
                        )}
                        
                        {!promoCode.isActive && (
                          <Badge variant="destructive">Inactif</Badge>
                        )}
                        
                        {isExpired(promoCode) && (
                          <Badge variant="destructive">Expiré</Badge>
                        )}
                        
                        {isMaxUsesReached(promoCode) && (
                          <Badge variant="destructive">Épuisé</Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{promoCode.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Valide du</div>
                        <div className="font-medium">
                          {format(promoCode.validFrom, 'dd/MM/yyyy', { locale: fr })}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Jusqu'au</div>
                        <div className="font-medium">
                          {format(promoCode.validUntil, 'dd/MM/yyyy', { locale: fr })}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Utilisations</div>
                        <div className="font-medium">
                          {promoCode.currentUses} / {promoCode.maxUses || '∞'}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Services</div>
                        <div className="font-medium">
                          {promoCode.applicableServices?.length 
                            ? `${promoCode.applicableServices.length} spécifiques`
                            : 'Tous'
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePromoCodeStatus(promoCode.id, !promoCode.isActive)}
                      className="glass-button hover:glass-effect"
                    >
                      {promoCode.isActive ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(promoCode)}
                      className="glass-button hover:glass-effect"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeletePromoCode?.(promoCode.id)}
                      className="glass-button hover:glass-effect text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}