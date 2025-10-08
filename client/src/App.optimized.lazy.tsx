import React, { Suspense } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { createLazyComponent } from "@/components/LazyPage";

// Core components that should be loaded immediately
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { MobileBottomNav } from "@/components/MobileBottomNav";

// Lazy load all pages
const PublicLanding = createLazyComponent(() => import("@/pages/PublicLanding"));
const Dashboard = createLazyComponent(() => import("@/pages/Dashboard"));
const PlanningResponsive = createLazyComponent(() => import("@/pages/PlanningResponsive"));
const ClientsModern = createLazyComponent(() => import("@/pages/ClientsModern"));
const ServicesManagement = createLazyComponent(() => import("@/pages/ServicesManagement"));
const BusinessFeaturesWithBottomSheets = createLazyComponent(() => import("@/pages/BusinessFeaturesWithBottomSheets"));
const SalonSettingsModern = createLazyComponent(() => import("@/pages/SalonSettingsModern"));
const ProMessagingModern = createLazyComponent(() => import("@/pages/ProMessagingModern"));
const InventoryModern = createLazyComponent(() => import("@/pages/InventoryModern"));
const QuickBooking = createLazyComponent(() => import("@/pages/QuickBooking"));
const AdvancedBookingManager = createLazyComponent(() => import("@/pages/AdvancedBookingManager"));
const ProfessionalPlans = createLazyComponent(() => import("@/pages/ProfessionalPlans"));
const Subscribe = createLazyComponent(() => import("@/pages/Subscribe"));
const DirectMessaging = createLazyComponent(() => import("@/pages/DirectMessaging"));
const StaffManagement = createLazyComponent(() => import("@/pages/StaffManagement"));
const StaffManagementModern = createLazyComponent(() => import("@/pages/StaffManagementModern"));
const ProfessionalSettingsDemo = createLazyComponent(() => import("@/pages/ProfessionalSettingsDemo"));
const ModernSalonCompact = createLazyComponent(() => import("@/pages/ModernSalonCompact"));
const TestSalon = createLazyComponent(() => import("@/pages/TestSalon"));
const ClientAnalytics = createLazyComponent(() => import("@/pages/ClientAnalytics"));
// Temporarily disabled due to missing assets
// const SalonSearchComplete = createLazyComponent(() => import("@/pages/SalonSearchComplete"));
const BookingPageSimple = createLazyComponent(() => import("@/pages/BookingPageSimple"));
const SubscriptionSignup = createLazyComponent(() => import("@/pages/SubscriptionSignup"));
const MultiStepSubscription = createLazyComponent(() => import("@/pages/MultiStepSubscription"));
const SubscriptionPlans = createLazyComponent(() => import("@/pages/SubscriptionPlans"));
const ModernSubscriptionPlans = createLazyComponent(() => import("@/pages/ModernSubscriptionPlans"));
const FreeTrialSignup = createLazyComponent(() => import("@/pages/FreeTrialSignup"));
const ClientDashboardSimple = createLazyComponent(() => import("@/pages/ClientDashboardSimple"));
const AIAssistantFixed = createLazyComponent(() => import("@/pages/AIAssistantFixed"));
const MessagingHub = createLazyComponent(() => import("@/pages/MessagingHub"));
const PlanityStyleBookingRenamed = createLazyComponent(() => import("@/pages/PlanityStyleBooking"));
const PlanityStyleBookingFixed = createLazyComponent(() => import("@/pages/PlanityStyleBookingFixed"));
const ProfessionalSelection = createLazyComponent(() => import("@/pages/ProfessionalSelection"));
const BookingDateTime = createLazyComponent(() => import("@/pages/BookingDateTime"));
const SalonDynamicPage = createLazyComponent(() => import("@/pages/SalonDynamicPage"));
const SalonPageFixed = createLazyComponent(() => import("@/pages/SalonPageFixed"));
const SalonPage = createLazyComponent(() => import("@/pages/SalonPage"));
const DevProLogin = createLazyComponent(() => import("@/pages/DevProLogin"));
const Inventory = createLazyComponent(() => import("@/pages/Inventory"));
const BookingPages = createLazyComponent(() => import("@/pages/BookingPages"));
const MessagingSystem = createLazyComponent(() => import("@/pages/MessagingSystem"));
const SalonPolicies = createLazyComponent(() => import("@/pages/SalonPolicies"));
const PromoCodeManagement = createLazyComponent(() => import("@/pages/PromoCodeManagement"));
const ClientReliabilityDashboard = createLazyComponent(() => import("@/pages/ClientReliabilityDashboard"));
const AdminDashboard = createLazyComponent(() => import("@/pages/AdminDashboard"));
const AnalyticsDashboard = createLazyComponent(() => import("@/pages/AnalyticsDashboard"));
const StockAlerts = createLazyComponent(() => import("@/pages/StockAlerts"));
const Settings = createLazyComponent(() => import("@/pages/Settings"));
const Support = createLazyComponent(() => import("@/pages/Support"));
const Contact = createLazyComponent(() => import("@/pages/Contact"));
const CentreAide = createLazyComponent(() => import("@/pages/CentreAide"));
const CGU = createLazyComponent(() => import("@/pages/CGU"));
const Confidentialite = createLazyComponent(() => import("@/pages/Confidentialite"));
const ServiceCoiffure = createLazyComponent(() => import("@/pages/ServiceCoiffure"));
const ServiceEsthetique = createLazyComponent(() => import("@/pages/ServiceEsthetique"));
const ServiceMassage = createLazyComponent(() => import("@/pages/ServiceMassage"));
const ServiceOnglerie = createLazyComponent(() => import("@/pages/ServiceOnglerie"));
const BusinessRegistration = createLazyComponent(() => import("@/pages/BusinessRegistration"));
const BusinessSuccess = createLazyComponent(() => import("@/pages/BusinessSuccess"));
const ClientLogin = createLazyComponent(() => import("@/pages/ClientLogin"));
const ClientRegister = createLazyComponent(() => import("@/pages/ClientRegister"));
const ClientAccueil = createLazyComponent(() => import("@/pages/ClientAccueil"));
const ClientRdv = createLazyComponent(() => import("@/pages/ClientRdv"));
const ClientParametres = createLazyComponent(() => import("@/pages/ClientParametres"));
const ForgotPassword = createLazyComponent(() => import("@/pages/ForgotPassword"));
const FuturisticClientLogin = createLazyComponent(() => import("@/pages/FuturisticClientLogin"));
const ClientLoginModern = createLazyComponent(() => import("@/pages/ClientLoginModern"));
const ClientDashboard = createLazyComponent(() => import("@/pages/ClientDashboard"));
const ProLogin = createLazyComponent(() => import("@/pages/ProLogin"));
const Register = createLazyComponent(() => import("@/pages/Register"));
const NotFoundPage = createLazyComponent(() => import("@/pages/not-found"));

// Salon pages
const SalonExcellenceParis = createLazyComponent(() => import("@/pages/salons/SalonExcellenceParis"));
const BarbierGentlemanMarais = createLazyComponent(() => import("@/pages/salons/BarbierGentlemanMarais"));
const SalonModerneRepublique = createLazyComponent(() => import("@/pages/salons/SalonModerneRepublique"));
const InstitutBeauteSaintGermain = createLazyComponent(() => import("@/pages/salons/InstitutBeauteSaintGermain"));
const BeautyLoungeMontparnasse = createLazyComponent(() => import("@/pages/salons/BeautyLoungeMontparnasse"));
const BeautyLashStudio = createLazyComponent(() => import("@/pages/salons/BeautyLashStudio"));

function Router() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  
  // Protected pages list
  const protectedPages = [
    '/dashboard',
    '/dashboard-peymen', 
    '/planning',
    '/planning-responsive',
    '/clients',
    '/staff',
    '/services',
    '/inventory',
    '/ai',
    '/ai-chat',
    '/ai-assistant-fixed',
    '/ai-pro-complete',
    '/ai-pro',
    '/salon-settings',
    '/staff-management',
    '/services-management',
    '/analytics-dashboard',
    '/client-management',
    '/pro-messaging',
    '/pro-messaging-search',
    '/messaging-test',
    '/admin-dashboard',
    '/salon-page-editor',
    '/business-features',
    '/messaging-system',
    '/booking-pages',
    '/stock-alerts',
    '/salon-policies',
    '/promo-codes',
    '/client-reliability',
    '/professional-settings-demo',
    '/pro-pages',
    '/direct-messaging',
    '/client-analytics',
    '/client-dashboard',
    '/client-parametres',
    '/client-rdv',
    '/avyento-account',
    '/notifications',
  ];
  
  const isProtectedPage = protectedPages.some(page => location.startsWith(page));

  // Loading state for protected pages
  if (isProtectedPage && isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Pages that don't need bottom navigation
  const hideBottomNavPages = [
    '/salon-page-editor',
    '/dashboard',
    '/ai',
    '/ai-assistant-fixed',
    '/planning-responsive',
    '/planning',
    '/salon-booking-editor',
    '/direct-messaging',
    '/client-register',
    '/pro-pages',
    '/salon-settings',
    '/business-features',
    '/staff-management',
    '/services-management',
    '/messaging-system',
    '/analytics-dashboard',
    '/stock-alerts',
    '/booking-pages',
    '/promo-codes',
    '/client-reliability',
    '/ai-pro',
    '/ai-pro-complete',
    '/pro-messaging-search',
    '/client-management',
    '/admin-dashboard',
    '/dashboard-old',
    '/pro-messaging',
    '/services',
    '/staff',
    '/inventory',
    '/professional-settings-demo'
  ];

  // Route handlers with lazy loading
  if (location === '/') {
    return (
      <div className="h-full">
        <PublicLanding />
      </div>
    );
  }

  if (location === '/dashboard') {
    if (!isAuthenticated && !isLoading) {
      window.location.href = '/pro-login';
      return null;
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <Dashboard />
      </div>
    );
  }

  // Professional pages with sidebar
  const proPages = ['/planning', '/clients', '/clients-modern', '/services-management', '/messaging-hub', '/ai-assistant-fixed', '/client-analytics', '/business-features', '/ai'];
  if (proPages.includes(location)) {
    if (!isAuthenticated && !isLoading) {
      window.location.href = '/pro-login';
      return null;
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 w-full">
        <div className="w-full pb-20">
          {location === '/planning' && <PlanningResponsive />}
          {(location === '/clients' || location === '/clients-modern') && <ClientsModern />}
          {location === '/services-management' && <ServicesManagement />}
          {location === '/messaging-hub' && <MessagingHub />}
          {location === '/ai-assistant-fixed' && <AIAssistantFixed />}
          {location === '/client-analytics' && <ClientAnalytics />}
          {location === '/business-features' && <BusinessFeaturesWithBottomSheets />}
          {location === '/ai' && <AIAssistantFixed />}
        </div>
        <MobileBottomNav userType="pro" />
      </div>
    );
  }

  // Main application with navigation
  return (
    <div className="h-full flex flex-col lg:max-w-none lg:w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm lg:shadow-none shadow-lg overflow-hidden">
      <div className="lg:hidden">
        <Header />
      </div>
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50/30 to-purple-50/20 smooth-scroll">
        <Switch>
          {/* Core routes */}
          <Route path="/register" component={Register} />
          <Route path="/pro-login" component={ProLogin} />
          <Route path="/client-login" component={FuturisticClientLogin} />
          <Route path="/client-register" component={ClientRegister} />
          <Route path="/forgot-password" component={ForgotPassword} />
          
          {/* Booking routes */}
          <Route path="/booking" component={QuickBooking} />
          <Route path="/quick-booking" component={QuickBooking} />
          <Route path="/advanced-booking" component={AdvancedBookingManager} />
          
          {/* Salon routes */}
          <Route path="/salon" component={SalonPage} />
          <Route path="/salon/excellence-paris" component={SalonExcellenceParis} />
          <Route path="/salon/barbier-gentleman-marais" component={BarbierGentlemanMarais} />
          <Route path="/salon/salon-moderne-republique" component={SalonModerneRepublique} />
          <Route path="/salon/institut-beaute-saint-germain" component={InstitutBeauteSaintGermain} />
          <Route path="/salon/beauty-lounge-montparnasse" component={BeautyLoungeMontparnasse} />
          <Route path="/salon/beauty-lash-studio" component={BeautyLashStudio} />
          
          {/* Support pages */}
          <Route path="/support" component={Support} />
          <Route path="/contact" component={Contact} />
          <Route path="/centre-aide" component={CentreAide} />
          <Route path="/cgu" component={CGU} />
          <Route path="/confidentialite" component={Confidentialite} />
          
          {/* Service pages */}
          <Route path="/services/coiffure" component={ServiceCoiffure} />
          <Route path="/services/esthetique" component={ServiceEsthetique} />
          <Route path="/services/massage" component={ServiceMassage} />
          <Route path="/services/onglerie" component={ServiceOnglerie} />
          
          {/* Business routes */}
          <Route path="/business-registration" component={BusinessRegistration} />
          <Route path="/business-success" component={BusinessSuccess} />
          <Route path="/professional-plans" component={ProfessionalPlans} />
          <Route path="/subscribe" component={Subscribe} />
          <Route path="/subscription-plans" component={ModernSubscriptionPlans} />
          <Route path="/free-trial" component={FreeTrialSignup} />
          
          {/* Fallback */}
          <Route component={NotFoundPage} />
        </Switch>
      </main>
      {!hideBottomNavPages.includes(location) && <BottomNavigation />}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <div className="h-full animated-bg">
              <Toaster />
              <Router />
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;