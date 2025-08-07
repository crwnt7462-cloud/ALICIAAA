import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";

// =============================================================================
// IMPORTS ORGANISÉS - ARCHITECTURE SAAS PROFESSIONNELLE
// =============================================================================

// 🔐 AUTHENTICATION & ONBOARDING
import ProLoginModern from "@/pages/ProLoginModern";
import MultiStepSubscription from "@/pages/MultiStepSubscription";
import ModernSubscriptionPlans from "@/pages/ModernSubscriptionPlans";
import ForgotPassword from "@/pages/ForgotPassword";

// 💼 PROFESSIONAL CORE DASHBOARD  
import DashboardModern from "@/pages/DashboardModern";
import PlanningModern from "@/pages/PlanningModern";
import ClientsModern from "@/pages/ClientsModern";
import InventoryModern from "@/pages/InventoryModern";
import SalonSettingsModern from "@/pages/SalonSettingsModern";
import ProMessagingModern from "@/pages/ProMessagingModern";
import AIAssistantFixed from "@/pages/AIAssistantFixed";
import AnalyticsDashboard from "@/pages/AnalyticsDashboard";

// 👥 CLIENT INTERFACE
import ClientBooking from "@/pages/ClientBooking";
import ClientDashboard from "@/pages/ClientDashboard";
import ClientLogin from "@/pages/ClientLogin";
import ClientRegister from "@/pages/ClientRegister";
import SalonSearchComplete from "@/pages/SalonSearchComplete";

// 🏪 SALON SHOWCASE PAGES
import SalonExcellenceParis from "@/pages/salons/SalonExcellenceParis";
import BarbierGentlemanMarais from "@/pages/salons/BarbierGentlemanMarais";
import SalonModerneRepublique from "@/pages/salons/SalonModerneRepublique";
import InstitutBeauteSaintGermain from "@/pages/salons/InstitutBeauteSaintGermain";
import NailArtOpera from "@/pages/salons/NailArtOpera";
import SpaWellnessBastille from "@/pages/salons/SpaWellnessBastille";
import BeautyLoungeMontparnasse from "@/pages/salons/BeautyLoungeMontparnasse";

// 💰 BUSINESS & PAYMENTS
import SubscriptionPaymentPage from "@/pages/SubscriptionPaymentPage";
import BusinessSuccess from "@/pages/BusinessSuccess";
import Support from "@/pages/Support";

// 📄 LEGAL & INFO
import CGU from "@/pages/CGU";
import Confidentialite from "@/pages/Confidentialite";
import Contact from "@/pages/Contact";
import CentreAide from "@/pages/CentreAide";

// 🏠 PUBLIC PAGES
import PublicLanding from "@/pages/PublicLanding";
import NotFound from "@/pages/not-found";

// =============================================================================
// APPLICATION SAAS PRINCIPALE
// =============================================================================

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider defaultTheme="light" storageKey="beauty-saas-theme">
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/20">
            
            <Switch>
              {/* 🔐 AUTHENTICATION FLOW */}
              <Route path="/login" component={ProLoginModern} />
              <Route path="/pro-login" component={ProLoginModern} />
              <Route path="/subscription-plans" component={ModernSubscriptionPlans} />
              <Route path="/modern-subscription-plans" component={ModernSubscriptionPlans} />
              <Route path="/multi-step-subscription" component={MultiStepSubscription} />
              <Route path="/forgot-password" component={ForgotPassword} />
              
              {/* 💼 PROFESSIONAL DASHBOARD CORE */}
              <Route path="/dashboard" component={DashboardModern} />
              <Route path="/business-features" component={DashboardModern} />
              <Route path="/business-features-modern" component={DashboardModern} />
              <Route path="/planning" component={PlanningModern} />
              <Route path="/clients" component={ClientsModern} />
              <Route path="/inventory" component={InventoryModern} />
              <Route path="/services" component={InventoryModern} />
              <Route path="/staff" component={InventoryModern} />
              <Route path="/settings" component={SalonSettingsModern} />
              <Route path="/salon-settings" component={SalonSettingsModern} />
              <Route path="/salon-settings-modern" component={SalonSettingsModern} />
              <Route path="/messaging" component={ProMessagingModern} />
              <Route path="/pro-messaging" component={ProMessagingModern} />
              <Route path="/pro-messaging-modern" component={ProMessagingModern} />
              <Route path="/ai-assistant" component={AIAssistantFixed} />
              <Route path="/ai" component={AIAssistantFixed} />
              <Route path="/analytics" component={AnalyticsDashboard} />
              <Route path="/booking" component={ClientBooking} />
              <Route path="/share-booking" component={ClientBooking} />
              
              {/* 👥 CLIENT EXPERIENCE */}
              <Route path="/client/login" component={ClientLogin} />
              <Route path="/client-login" component={ClientLogin} />
              <Route path="/client/register" component={ClientRegister} />
              <Route path="/client-register" component={ClientRegister} />
              <Route path="/client/dashboard" component={ClientDashboard} />
              <Route path="/client-dashboard" component={ClientDashboard} />
              <Route path="/client/booking" component={ClientBooking} />
              <Route path="/client-booking" component={ClientBooking} />
              <Route path="/search" component={SalonSearchComplete} />
              <Route path="/salon-search" component={SalonSearchComplete} />
              <Route path="/salon-search-complete" component={SalonSearchComplete} />
              
              {/* 🏪 SALON SHOWCASE - SEO OPTIMIZED */}
              <Route path="/salon/excellence-hair-paris" component={SalonExcellenceParis} />
              <Route path="/salon/salon-excellence-paris" component={SalonExcellenceParis} />
              <Route path="/salon/barbier-gentleman-marais" component={BarbierGentlemanMarais} />
              <Route path="/salon/gentleman-barbier" component={BarbierGentlemanMarais} />
              <Route path="/salon/salon-moderne-republique" component={SalonModerneRepublique} />
              <Route path="/salon/institut-beaute-saint-germain" component={InstitutBeauteSaintGermain} />
              <Route path="/salon/nail-art-opera" component={NailArtOpera} />
              <Route path="/salon/spa-wellness-bastille" component={SpaWellnessBastille} />
              <Route path="/salon/beauty-lounge-montparnasse" component={BeautyLoungeMontparnasse} />
              
              {/* 💰 BUSINESS OPERATIONS */}
              <Route path="/subscription-payment" component={SubscriptionPaymentPage} />
              <Route path="/business-success" component={BusinessSuccess} />
              <Route path="/support" component={Support} />
              
              {/* 📄 LEGAL & COMPLIANCE */}
              <Route path="/cgu" component={CGU} />
              <Route path="/confidentialite" component={Confidentialite} />
              <Route path="/contact" component={Contact} />
              <Route path="/aide" component={CentreAide} />
              <Route path="/centre-aide" component={CentreAide} />
              
              {/* 🏠 HOME & LANDING */}
              <Route path="/" component={DashboardModern} />
              <Route path="/home" component={PublicLanding} />
              <Route path="/landing" component={PublicLanding} />
              
              {/* 🚫 404 ERROR HANDLING */}
              <Route component={NotFound} />
            </Switch>
            
          </div>
          
          {/* GLOBAL NOTIFICATIONS */}
          <Toaster />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}