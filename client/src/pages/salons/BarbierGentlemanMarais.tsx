import SalonPageTemplateFixed from "@/components/SalonPageTemplateFixed";
import { barbierGentlemanMaraisSalon } from "@/utils/salonTemplateData";

export default function BarbierGentlemanMarais() {
  return (
    <SalonPageTemplateFixed 
      salonSlug="barbier-gentleman-marais"
      salonData={barbierGentlemanMaraisSalon}
      customColors={barbierGentlemanMaraisSalon.customColors}
    />
  );
}