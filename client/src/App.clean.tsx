import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";

// Authentication Pages
import ProLoginModern from "@/pages/ProLoginModern";
import MultiStepSubscription from "@/pages/MultiStepSubscription";
import ModernSubscriptionPlans from "@/pages/ModernSubscriptionPlans";
import ForgotPassword from "@/pages/ForgotPassword";

// Professional Dashboard
import DashboardModern from "@/pages/DashboardModern";
import PlanningModern from "@/pages/PlanningModern";
import ClientsModern from "@/pages/ClientsModern";
import InventoryModern from "@/pages/InventoryModern";
import SalonSettingsModern from "@/pages/SalonSettingsModern";
import ProMessagingModern from "@/pages/ProMessagingModern";
import AIAssistantFixed from "@/pages/AIAssistantFixed";
import AnalyticsDashboard from "@/pages/AnalyticsDashboard";

// Client Interface
import ClientBooking from "@/pages/ClientBooking";
import ClientDashboard from "@/pages/ClientDashboard";
import ClientLogin from "@/pages/ClientLogin";
import ClientRegister from "@/pages/ClientRegister";
import SalonSearchComplete from "@/pages/SalonSearchComplete";

// Salon Pages
import SalonExcellenceParis from "@/pages/salons/SalonExcellenceParis";
import BarbierGentlemanMarais from "@/pages/salons/BarbierGentlemanMarais";
import SalonModerneRepublique from "@/pages/salons/SalonModerneRepublique";
import InstitutBeauteSaintGermain from "@/pages/salons/InstitutBeauteSaintGermain";
import NailArtOpera from "@/pages/salons/NailArtOpera";
import SpaWellnessBastille from "@/pages/salons/SpaWellnessBastille";
import BeautyLoungeMontparnasse from "@/pages/salons/BeautyLoungeMontparnasse";

// Business & Subscription
import SubscriptionPayment from "@/pages/SubscriptionPaymentPage";
import BusinessSuccess from "@/pages/BusinessSuccess";
import Support from "@/pages/Support";

// Legal & Info Pages
import CGU from "@/pages/CGU";
import Confidentialite from "@/pages/Confidentialite";
import Contact from "@/pages/Contact";
import CentreAide from "@/pages/CentreAide";

// Landing & Public
import PublicLanding from "@/pages/PublicLanding";
import NotFound from "@/pages/not-found";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
            <Switch>
              {/* Authentication Routes */}
              <Route path="/login" component={ProLoginModern} />
              <Route path="/subscription-plans" component={ModernSubscriptionPlans} />
              <Route path="/multi-step-subscription" component={MultiStepSubscription} />
              <Route path="/forgot-password" component={ForgotPassword} />
              
              {/* Professional Dashboard */}
              <Route path="/dashboard" component={DashboardModern} />
              <Route path="/planning" component={PlanningModern} />
              <Route path="/clients" component={ClientsModern} />
              <Route path="/inventory" component={InventoryModern} />
              <Route path="/settings" component={SalonSettingsModern} />
              <Route path="/messaging" component={ProMessagingModern} />
              <Route path="/ai-assistant" component={AIAssistantFixed} />
              <Route path="/analytics" component={AnalyticsDashboard} />
              
              {/* Client Interface */}
              <Route path="/client/login" component={ClientLogin} />
              <Route path="/client/register" component={ClientRegister} />
              <Route path="/client/dashboard" component={ClientDashboard} />
              <Route path="/client/booking" component={ClientBooking} />
              <Route path="/search" component={SalonSearchComplete} />
              
              {/* Salon Public Pages */}
              <Route path="/salon/excellence-hair-paris" component={SalonExcellenceParis} />
              <Route path="/salon/barbier-gentleman-marais" component={BarbierGentlemanMarais} />
              <Route path="/salon/salon-moderne-republique" component={SalonModerneRepublique} />
              <Route path="/salon/institut-beaute-saint-germain" component={InstitutBeauteSaintGermain} />
              <Route path="/salon/nail-art-opera" component={NailArtOpera} />
              <Route path="/salon/spa-wellness-bastille" component={SpaWellnessBastille} />
              <Route path="/salon/beauty-lounge-montparnasse" component={BeautyLoungeMontparnasse} />
              
              {/* Business Routes */}
              <Route path="/subscription-payment" component={SubscriptionPayment} />
              <Route path="/business-success" component={BusinessSuccess} />
              <Route path="/support" component={Support} />
              
              {/* Legal & Info */}
              <Route path="/cgu" component={CGU} />
              <Route path="/confidentialite" component={Confidentialite} />
              <Route path="/contact" component={Contact} />
              <Route path="/aide" component={CentreAide} />
              
              {/* Landing */}
              <Route path="/" component={PublicLanding} />
              
              {/* 404 */}
              <Route component={NotFound} />
            </Switch>
          </div>
          <Toaster />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}