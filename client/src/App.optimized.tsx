import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";

import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";

// Pages essentielles seulement (suppression des 150+ imports inutilisés)
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Planning from "@/pages/Planning";
import Clients from "@/pages/Clients";
import Services from "@/pages/Services";
import Staff from "@/pages/Staff";
import NotFound from "@/pages/not-found";
import ProLoginModern from "@/pages/ProLoginModern";
import Register from "@/pages/Register";
import AIAssistantFixed from "@/pages/AIAssistantFixed";
import QuickBooking from "@/pages/QuickBooking";
import SubscriptionPlans from "@/pages/SubscriptionPlans";
import ClientDashboard from "@/pages/ClientDashboard";

// Salons individuels (les 7 principaux)
import SalonExcellenceParis from "@/pages/salons/SalonExcellenceParis";
import BarbierGentlemanMarais from "@/pages/salons/BarbierGentlemanMarais";
import SalonModerneRepublique from "@/pages/salons/SalonModerneRepublique";
import InstitutBeauteSaintGermain from "@/pages/salons/InstitutBeauteSaintGermain";
import NailArtOpera from "@/pages/salons/NailArtOpera";
import SpaWellnessBastille from "@/pages/salons/SpaWellnessBastille";
import BeautyLoungeMontparnasse from "@/pages/salons/BeautyLoungeMontparnasse";

function Router() {
  // Route publique : /book/:public_slug
  const bookMatch = location.match(/^\/book\/([a-zA-Z0-9_-]+)$/);
  if (bookMatch) {
    const public_slug = bookMatch[1];
    const BookPublicSalonPage = require("@/pages/SalonPagePublic").default;
    return <BookPublicSalonPage public_slug={public_slug} />;
  }

  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();

  // Routage public /book/:public_slug (doit être avant les autres routes)
  const bookMatch = location.match(/^\/book\/([a-zA-Z0-9_-]+)$/);
  if (bookMatch) {
    const public_slug = bookMatch[1];
    const BookPublicSalonPage = require("@/pages/SalonPagePublic").default;
    return <BookPublicSalonPage public_slug={public_slug} />;
  }

  // Gestion des redirections critiques avec validation
  if (location === '/salon/excellence-hair-paris') {
    return <SalonExcellenceParis />;
  }
  
  if (location === '/salon/barbier-gentleman-marais') {
    return <BarbierGentlemanMarais />;
  }

  if (location === '/salon/salon-moderne-republique') {
    return <SalonModerneRepublique />;
  }

  if (location === '/salon/institut-beaute-saint-germain') {
    return <InstitutBeauteSaintGermain />;
  }

  if (location === '/salon/nail-art-opera') {
    return <NailArtOpera />;
  }

  if (location === '/salon/spa-wellness-bastille') {
    return <SpaWellnessBastille />;
  }

  if (location === '/salon/beauty-lounge-montparnasse') {
    return <BeautyLoungeMontparnasse />;
  }

  // Routes de réservation avec validation
  if (location.startsWith('/booking/') && location !== '/booking') {
    return <QuickBooking />;
  }

  if (location === '/pro-login') {
    return <ProLoginModern />;
  }

  if (location === '/register') {
    return <Register />;
  }

  if (location === '/plans') {
    return <SubscriptionPlans />;
  }

  if (location === '/client-dashboard') {
    return <ClientDashboard />;
  }

  if (location === '/ai-assistant') {
    return <AIAssistantFixed />;
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {isAuthenticated && <Header />}
      <main className="flex-1 overflow-auto">
        <Switch>
          {isLoading ? (
            <Route path="/" component={Landing} />
          ) : isAuthenticated ? (
            <>
              <Route path="/client-dashboard" component={ClientDashboard} />
              <Route path="/" component={Dashboard} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/planning" component={Planning} />
              <Route path="/clients" component={Clients} />
              <Route path="/services" component={Services} />
              <Route path="/staff" component={Staff} />
            </>
          ) : (
            <Route path="/" component={Landing} />
          )}
          <Route component={NotFound} />
        </Switch>
      </main>
      {isAuthenticated && <BottomNavigation />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;