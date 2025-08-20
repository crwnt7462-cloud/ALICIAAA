import SalonPageTemplateFixed from "@/components/SalonPageTemplateFixed";
import { beautyLashStudioSalon } from "@/utils/salonTemplateData";

export default function BeautyLashStudio() {
  return (
    <SalonPageTemplateFixed 
      salonSlug="beauty-lash-studio"
      salonData={beautyLashStudioSalon}
      customColors={beautyLashStudioSalon.customColors}
    />
  );
}