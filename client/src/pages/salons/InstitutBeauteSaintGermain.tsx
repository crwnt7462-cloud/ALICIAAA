import SalonPageTemplateFixed from "@/components/SalonPageTemplateFixed";
import { instituteSaintGermainSalon } from "@/utils/salonTemplateData";

export default function InstitutBeauteSaintGermain() {
  return (
    <SalonPageTemplateFixed 
      salonSlug="institut-beaute-saint-germain"
      salonData={instituteSaintGermainSalon}
      customColors={instituteSaintGermainSalon.customColors}
    />
  );
}