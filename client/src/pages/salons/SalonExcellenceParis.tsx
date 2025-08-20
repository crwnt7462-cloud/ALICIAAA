import SalonPageTemplateFixed from "@/components/SalonPageTemplateFixed";
import { excellenceParisSalon } from "@/utils/salonTemplateData";

export default function SalonExcellenceParis() {
  return (
    <SalonPageTemplateFixed 
      salonSlug="salon-excellence-paris"
      salonData={excellenceParisSalon}
      customColors={excellenceParisSalon.customColors}
    />
  );
}