import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-purple-600",
        sizeClasses[size]
      )} />
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-luxury animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}

export function LoadingDashboard() {
  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50/50 to-purple-50/30 min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="flex space-x-3">
          <div className="h-10 bg-gray-200 rounded-xl w-24 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded-xl w-32 animate-pulse"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <LoadingCard key={i} />
        ))}
      </div>
      
      <LoadingCard />
    </div>
  );
}