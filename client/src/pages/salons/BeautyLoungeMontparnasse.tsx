import SalonPageTemplateFixed from "@/components/SalonPageTemplateFixed";
import { beautyLoungeMontparnasseSalon } from "@/utils/salonTemplateData";

export default function BeautyLoungeMontparnasse() {
  return (
    <SalonPageTemplateFixed 
      salonSlug="beauty-lounge-montparnasse"
      salonData={beautyLoungeMontparnasseSalon}
      customColors={beautyLoungeMontparnasseSalon.customColors}
    />
  );
}