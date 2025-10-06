import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ProRegister() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    salonName: "",
    siret: "",
    phone: "",
    city: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
  console.log('Payload envoyé à /api/register:', payload);
    e.preventDefault();
    setIsLoading(true);
    try {
      // Vérification des champs obligatoires
      if (!formData.firstName || !formData.lastName || !formData.salonName || !formData.email || !formData.password) {
        toast({
          title: "Erreur d'inscription",
          description: "Veuillez remplir tous les champs obligatoires.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Erreur d'inscription",
          description: "Les mots de passe ne correspondent pas.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        businessName: formData.salonName, // Mapped to businessName for backend
        siret: formData.siret,
        phone: formData.phone,
        city: formData.city,
        address: formData.address,
        email: formData.email.trim().toLowerCase(),
        password: String(formData.password ?? "")
      };
  console.log('Payload envoyé à /api/register/professional:', payload);
  await apiRequest("POST", "/api/register/professional", payload);
      toast({
        title: "Inscription réussie !",
        description: "Votre compte professionnel a été créé.",
      });
      // Redirige ou connecte automatiquement si besoin
    } catch (err: any) {
      toast({
        title: "Erreur d'inscription",
        description: err?.message || "Impossible de créer le compte.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <Label>Prénom</Label>
      <Input name="firstName" value={formData.firstName} onChange={handleChange} required />
      <Label>Nom</Label>
      <Input name="lastName" value={formData.lastName} onChange={handleChange} required />
      <Label>Nom du salon</Label>
      <Input name="salonName" value={formData.salonName} onChange={handleChange} required />
      <Label>Numéro SIRET</Label>
      <Input name="siret" value={formData.siret} onChange={handleChange} required />
      <Label>Téléphone professionnel</Label>
      <Input name="phone" value={formData.phone} onChange={handleChange} required />
      <Label>Ville</Label>
      <Input name="city" value={formData.city} onChange={handleChange} required />
      <Label>Adresse complète</Label>
      <Input name="address" value={formData.address} onChange={handleChange} required />
      <Label>Email professionnel</Label>
      <Input name="email" type="email" value={formData.email} onChange={handleChange} required />
      <Label>Mot de passe</Label>
      <Input name="password" type="password" value={formData.password} onChange={handleChange} required />
      <Label>Confirmer le mot de passe</Label>
      <Input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
      <Button type="submit" disabled={isLoading}>Créer mon compte pro</Button>
    </form>
  );
}
