import SalonPageTemplateFixed from "@/components/SalonPageTemplateFixed";
import { salonModerneRepubliqueSalon } from "@/utils/salonTemplateData";

export default function SalonModerneRepublique() {
  return (
    <SalonPageTemplateFixed 
      salonSlug="salon-moderne-republique"
      salonData={salonModerneRepubliqueSalon}
      customColors={salonModerneRepubliqueSalon.customColors}
    />
  );
}