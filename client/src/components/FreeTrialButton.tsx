import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

interface FreeTrialButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function FreeTrialButton({ className = "", children }: FreeTrialButtonProps) {
  return (
    <a href="/free-trial" className={`block ${className}`}>
      <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
        <Gift className="w-4 h-4 mr-2" />
        {children || "Commencer l'essai gratuit"}
      </Button>
    </a>
  );
}