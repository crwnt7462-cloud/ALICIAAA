import SalonPageTemplateFixed from "@/components/SalonPageTemplateFixed";
import { getDemoSalonData } from "@/utils/salonTemplateData";
import { useLocation } from "wouter";

export default function SalonPage() {
  const [location] = useLocation();
  
  // Extraire le slug du salon depuis l'URL /salon/[slug]
  const salonSlug = location.split('/').pop() || '';
  
  // Récupérer les données du salon démo si disponible
  const salonData = getDemoSalonData(salonSlug);
  
  return (
    <SalonPageTemplateFixed 
      salonSlug={salonSlug}
      salonData={salonData}
      customColors={salonData?.customColors}
    />
  );
}