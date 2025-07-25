import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Schéma de validation
const formSchema = z.object({
  businessName: z.string().min(2, "Le nom de l'entreprise est requis"),
  businessType: z.string().min(1, "Le type d'établissement est requis"),
  siret: z.string().min(14, "Le numéro SIRET est requis"),
  legalForm: z.string().min(1, "La forme juridique est requise"),
  address: z.string().min(5, "L'adresse est requise"),
  city: z.string().min(2, "La ville est requise"),
  postalCode: z.string().min(5, "Le code postal est requis"),
  phone: z.string().min(10, "Le téléphone est requis"),
  email: z.string().email("Email invalide"),
  ownerFirstName: z.string().min(2, "Le prénom est requis"),
  ownerLastName: z.string().min(2, "Le nom est requis"),
  vatNumber: z.string().optional(),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const businessTypes = [
  { value: "salon_coiffure", label: "Salon de coiffure" },
  { value: "institut_beaute", label: "Institut de beauté" },
  { value: "barbier", label: "Barbier" },
  { value: "spa", label: "Spa" },
  { value: "onglerie", label: "Onglerie" },
  { value: "centre_esthetique", label: "Centre esthétique" },
];

const legalForms = [
  { value: "auto_entrepreneur", label: "Auto-entrepreneur" },
  { value: "sarl", label: "SARL" },
  { value: "sas", label: "SAS" },
  { value: "eirl", label: "EIRL" },
  { value: "autre", label: "Autre" },
];

const plans = [
  { id: 'essentiel', name: 'ESSENTIEL', price: 29, color: 'from-green-500 to-emerald-600' },
  { id: 'professionnel', name: 'PROFESSIONNEL', price: 79, color: 'from-blue-500 to-purple-600' },
  { id: 'premium', name: 'PREMIUM', price: 149, color: 'from-purple-500 to-pink-600' }
];

export default function BusinessRegistration() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Récupérer le plan sélectionné
  const searchParams = new URLSearchParams(window.location.search);
  const planId = searchParams.get('plan') || 'professionnel';
  const currentPlan = plans.find(p => p.id === planId) || plans[1];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      businessType: "",
      siret: "",
      legalForm: "",
      address: "",
      city: "",
      postalCode: "",
      phone: "",
      email: "",
      ownerFirstName: "",
      ownerLastName: "",
      vatNumber: "",
      description: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/business-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, planId }),
      });

      if (response.ok) {
        setLocation("/business-success");
      } else {
        throw new Error("Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur s'est produite lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4">
          <div className="flex justify-between items-center h-14">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Rendly</h1>
              <p className="text-xs text-gray-500">Inscription</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/professional-plans")}
              className="text-gray-600 hover:text-gray-900"
            >
              Retour
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Formulaire */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Informations entreprise
              </h2>
              <p className="text-sm text-gray-600">
                Complétez votre inscription
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 space-y-6">
                {/* Établissement */}
                <div className="space-y-4">
                  <h3 className="text-base font-medium text-gray-900">Établissement</h3>
                  
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Nom de l'entreprise *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Salon Excellence" className="h-10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Type d'établissement *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Sélectionnez..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {businessTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="siret"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Numéro SIRET *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="12345678901234" className="h-10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="legalForm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Forme juridique *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Sélectionnez..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {legalForms.map((form) => (
                              <SelectItem key={form.value} value={form.value}>
                                {form.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Adresse */}
                <div className="space-y-4">
                  <h3 className="text-base font-medium text-gray-900">Adresse</h3>
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Adresse *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="15 rue de la Paix" className="h-10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Ville *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Paris" className="h-10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">CP *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="75001" className="h-10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-4">
                  <h3 className="text-base font-medium text-gray-900">Contact</h3>
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Téléphone *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="01 23 45 67 89" className="h-10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Email *</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="contact@salon.fr" className="h-10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Responsable */}
                <div className="space-y-4">
                  <h3 className="text-base font-medium text-gray-900">Responsable</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="ownerFirstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Prénom *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Marie" className="h-10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ownerLastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Nom *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Dubois" className="h-10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="vatNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">TVA (optionnel)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="FR12345678901" className="h-10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Description (optionnel)</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Décrivez votre salon..."
                            className="min-h-[80px] resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Bouton soumission */}
                <div className="pt-4 border-t border-gray-100">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-10 bg-violet-600 hover:bg-violet-700 text-white font-medium"
                  >
                    {isLoading ? "Traitement..." : "Finaliser l'inscription"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Plan sélectionné */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-base font-medium text-gray-900 mb-3">Plan sélectionné</h3>
            <div className={`p-3 rounded-lg bg-gradient-to-r ${currentPlan.color} text-white text-center`}>
              <div className="font-semibold">{currentPlan.name}</div>
              <div className="text-2xl font-bold">{currentPlan.price}€</div>
              <div className="text-sm opacity-90">par mois</div>
            </div>
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation("/professional-plans")}
                className="w-full text-violet-600 border-violet-200 hover:bg-violet-50"
              >
                Changer de plan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}