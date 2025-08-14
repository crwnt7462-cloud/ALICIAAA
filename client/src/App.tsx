import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";

import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import Landing from "@/pages/Landing";
import PublicLanding from "@/pages/PublicLanding";
import SearchResults from "@/pages/SearchResults";
import Dashboard from "@/pages/Dashboard";
import Planning from "@/pages/Planning";
import Clients from "@/pages/Clients";
import Booking from "@/pages/Booking";

import AIAutomationNew from "@/pages/AIAutomationNew";

import ChatGPTInterface from "@/pages/ChatGPTInterface";

import ClientBooking from "@/pages/ClientBooking";
import ShareBooking from "@/pages/ShareBooking";

import NotFound from "@/pages/not-found";
import ProLoginModern from "@/pages/ProLoginModern";
import Register from "@/pages/Register";
import ModernSalonDetailNew from "@/pages/ModernSalonDetailNew";
import FullScreenMessage from "@/pages/FullScreenMessage";
import SalonExcellenceParis from "@/pages/salons/SalonExcellenceParis";
import SalonExcellenceDemoMobile from "@/pages/salons/SalonExcellenceDemoMobile";
import BarbierGentlemanMarais from "@/pages/salons/BarbierGentlemanMarais";
import SalonModerneRepublique from "@/pages/salons/SalonModerneRepublique";
import InstitutBeauteSaintGermain from "@/pages/salons/InstitutBeauteSaintGermain";
import NailArtOpera from "@/pages/salons/NailArtOpera";
import SpaWellnessBastille from "@/pages/salons/SpaWellnessBastille";
import BeautyLoungeMontparnasse from "@/pages/salons/BeautyLoungeMontparnasse";

import Services from "@/pages/Services";
import Staff from "@/pages/Staff";
import DownloadCode from "@/pages/DownloadCode";
import BusinessFeaturesModern from "@/pages/BusinessFeaturesModern";
import BusinessFeaturesFixed from "@/pages/BusinessFeaturesFixed";
import DashboardModern from "@/pages/DashboardModern";
import SalonSettingsModern from "@/pages/SalonSettingsModern";
import ProMessagingModern from "@/pages/ProMessagingModern";
import InventoryModern from "@/pages/InventoryModern";
import PlanningModern from "@/pages/PlanningModern";
import ClientsModern from "@/pages/ClientsModern";

import QuickBooking from "@/pages/QuickBooking";
import ModernBooking from "@/pages/ModernBooking";

import AdvancedBookingManager from "@/pages/AdvancedBookingManager";
import ProfessionalPlans from "@/pages/ProfessionalPlans";
import Subscribe from "@/pages/Subscribe";
import DirectMessaging from "@/pages/DirectMessaging";
import StaffManagement from "@/pages/StaffManagement";
import ServicesManagement from "@/pages/ServicesManagement";
import ProfessionalSettingsDemo from "@/pages/ProfessionalSettingsDemo";
import ClientAnalytics from "@/pages/ClientAnalytics";
import SalonSearchComplete from "@/pages/SalonSearchComplete";
import BookingPageSimple from "@/pages/BookingPageSimple";
import SubscriptionSignup from "@/pages/SubscriptionSignup";
import MultiStepSubscription from "@/pages/MultiStepSubscription";
import SubscriptionPayment from "@/pages/SubscriptionPayment";
import SubscriptionPlans from "@/pages/SubscriptionPlans";
import ModernSubscriptionPlans from "@/pages/ModernSubscriptionPlans";
import FreeTrialSignup from "@/pages/FreeTrialSignup";
import ClientDashboard from "@/pages/ClientDashboard";
import ClientDashboardSimple from "@/pages/ClientDashboardSimple";
import ClientDashboardNew from "@/pages/ClientDashboardNew";
import AIAssistantSimple from "@/pages/AIAssistantSimple";
import AIAssistantFixed from "@/pages/AIAssistantFixed";
import MessagingHub from "@/pages/MessagingHub";
import SalonBooking from "@/pages/SalonBooking";

import SalonPageFixed from "@/pages/SalonPageFixed";
import Inventory from "@/pages/Inventory";
import BookingPages from "@/pages/BookingPages";
import MessagingSystem from "@/pages/MessagingSystem";
import SalonPolicies from "@/pages/SalonPolicies";
import PromoCodeManagement from "@/pages/PromoCodeManagement";
import ClientReliabilityDashboard from "@/pages/ClientReliabilityDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import AnalyticsDashboard from "@/pages/AnalyticsDashboard";
import StockAlerts from "@/pages/StockAlerts";
import Settings from "@/pages/Settings";
import Support from "@/pages/Support";
import Contact from "@/pages/Contact";
import CentreAide from "@/pages/CentreAide";
import CGU from "@/pages/CGU";
import Confidentialite from "@/pages/Confidentialite";
import ServiceCoiffure from "@/pages/ServiceCoiffure";
import ServiceEsthetique from "@/pages/ServiceEsthetique";
import ServiceMassage from "@/pages/ServiceMassage";
import ServiceOnglerie from "@/pages/ServiceOnglerie";
import BusinessRegistration from "@/pages/BusinessRegistration";
import BusinessSuccess from "@/pages/BusinessSuccess";

import ClientLogin from "@/pages/ClientLogin";
import ClientRegister from "@/pages/ClientRegister";
import ClientAccueil from "@/pages/ClientAccueil";
import ClientRdv from "@/pages/ClientRdv";
import ClientParametres from "@/pages/ClientParametres";
import ClientLoginWhite from "@/pages/ClientLoginWhite";
import ClientLoginModern from "@/pages/ClientLoginModern";
import FuturisticClientLogin from "@/pages/FuturisticClientLogin";

import PlanityStyleClientLogin from "@/pages/PlanityStyleClientLogin";
import PlanityStyleBooking from "@/pages/PlanityStyleBooking";
import PlanityStyleProfessionalList from "@/pages/PlanityStyleProfessionalList";
import PlanityStyleAccount from "@/pages/PlanityStyleAccount";
import PlanityStyleBeautyInstitute from "@/pages/PlanityStyleBeautyInstitute";
import SalonRegistration from "@/pages/SalonRegistration";
import SalonPhotosManager from "@/pages/SalonPhotosManager";
import MonthlyCalendar from "@/pages/MonthlyCalendar";
import AIProComplete from "@/pages/AIProComplete";
import EditSalon from "@/pages/EditSalon";
import ClientAIMessages from "@/pages/ClientAIMessages";
import AIAlertsDrops from "@/pages/AIAlertsDrops";
import SalonSelection from "@/pages/SalonSelection";
import CategorySelection from "@/pages/CategorySelection";
import PageCreator from "@/pages/PageCreator";
import ProPagesManager from "@/pages/ProPagesManager";
import SalonBookingEditor from "@/pages/SalonBookingEditor";
import BookingCustomization from "@/pages/BookingCustomization";
import ForgotPassword from "@/pages/ForgotPassword";
import PaymentMethodsManager from "@/pages/PaymentMethodsManager";
import PaymentMethodsSimple from "@/pages/PaymentMethodsSimple";
import SalonPayment from "@/pages/SalonPayment";
import ClientProDashboard from "@/pages/ClientProDashboard";
import MessagingSearch from "@/pages/MessagingSearch";
import ProDashboard from "@/pages/ProDashboard";
import ProMessaging from "@/pages/ProMessaging";
import StripeDemo from "@/pages/StripeDemo";
import StripeSuccess from "@/pages/StripeSuccess";
import StripeCancel from "@/pages/StripeCancel";
import ProMessagingSimple from "@/pages/ProMessagingSimple";
import SalonSettingsComplete from "@/pages/SalonSettingsComplete";
import SalonSettings from "@/pages/SalonSettings";
import BookingPage from "@/pages/BookingPage";
import ClientManagement from "@/pages/ClientManagement";
import RealTimeMessaging from "@/pages/RealTimeMessaging";
import ClientMessaging from "@/pages/ClientMessaging";
import ClientMessagingMobile from "@/pages/ClientMessagingMobile";

import NotificationCenter from "@/pages/NotificationCenter";
import SalonPageEditor from "@/pages/SalonPageEditor";
import SalonBookingFlow from "@/pages/SalonBookingFlow";
import StripeCheckout from "@/pages/StripeCheckout";
import ImprovedSubscriptionPlans from "@/pages/ImprovedSubscriptionPlans";
import SalonRegistrationWithPassword from "@/pages/SalonRegistrationWithPassword";
import BookingSuccess from "@/pages/BookingSuccess";
import SalonBookingFixed from "@/pages/SalonBookingFixed";
import ClientLoginBooking from "@/pages/ClientLoginBooking";

import StripePayment from "@/pages/StripePayment";

import { ErrorBoundary } from "@/components/ErrorBoundary";


function Router() {
  const [location, setLocation] = useLocation();
  
  // Pages qui ne doivent pas avoir la barre violette en bas
  const hideBottomNavPages = ['/salon-page-editor'];
  
  // Page de paiement Stripe
  if (location === '/stripe-payment') {
    return (
      <div className="h-full">
        <StripePayment />
      </div>
    );
  }
  
  if (location.startsWith('/booking/') && location !== '/booking') {
    return (
      <div className="h-full">
        <QuickBooking />
      </div>
    );
  }

  // Page de succès de réservation
  if (location === '/booking-success') {
    return (
      <div className="h-full">
        <BookingSuccess />
      </div>
    );
  }

  // Pages Stripe
  if (location === '/stripe-success' || location.startsWith('/stripe-success?')) {
    return (
      <div className="h-full">
        <StripeSuccess />
      </div>
    );
  }

  if (location === '/stripe-cancel' || location.startsWith('/stripe-cancel?')) {
    return (
      <div className="h-full">
        <StripeCancel />
      </div>
    );
  }

  // Page de réservation principale
  if (location === '/booking') {
    return (
      <div className="h-full">
        <BookingPage />
      </div>
    );
  }

  // Page de test des comptes d'abonnement
  if (location === '/test-subscription-accounts') {
    return (
      <div className="h-full">
        <ModernSubscriptionPlans />
      </div>
    );
  }

  // Page de connexion professionnelle
  if (location === '/pro-login') {
    return (
      <div className="h-full">
        <ProLoginModern />
      </div>
    );
  }

  // Page de recherche de messagerie
  if (location === '/messaging-search') {
    return (
      <div className="h-full">
        <MessagingSearch />
      </div>
    );
  }

  // Tableau de bord professionnel
  if (location === '/pro-dashboard') {
    return (
      <div className="h-full">
        <ProDashboard />
      </div>
    );
  }

  // Messagerie professionnelle
  if (location === '/pro-messaging') {
    return (
      <div className="h-full">
        <ProMessagingModern />
      </div>
    );
  }

  // Messagerie professionnelle simplifiée
  if (location === '/pro-messaging-simple') {
    return (
      <div className="h-full">
        <ProMessagingSimple />
      </div>
    );
  }

  // Paramètres du salon
  if (location === '/salon-settings') {
    return (
      <div className="h-full">
        <SalonSettings />
      </div>
    );
  }

  // Politiques du salon
  if (location === '/salon-policies') {
    return (
      <div className="h-full">
        <SalonPolicies />
      </div>
    );
  }

  // Centre de notifications
  if (location === '/notifications') {
    return (
      <div className="h-full">
        <NotificationCenter />
      </div>
    );
  }

  // Gestion clientèle professionnelle
  if (location === '/client-management') {
    return (
      <div className="h-full">
        <ClientManagement />
      </div>
    );
  }

  // Analytics client avec IA
  if (location === '/client-analytics') {
    return (
      <div className="h-full">
        <ClientAnalytics />
      </div>
    );
  }

  // Messages IA pour clients
  if (location === '/client-ai-messages') {
    return (
      <div className="h-full">
        <ClientAIMessages />
      </div>
    );
  }

  // Centre d'alertes IA avec style gouttes d'eau
  if (location === '/ai-alerts-drops') {
    return (
      <div className="h-full">
        <AIAlertsDrops />
      </div>
    );
  }

  // Page de réservation publique
  if (location === '/booking' || location.startsWith('/booking/')) {
    return (
      <div className="h-full">
        <BookingPage />
      </div>
    );
  }

  // Pages client spécifiques
  if (location === '/client-login') {
    return <div className="h-full"><ClientLogin /></div>;
  }
  
  if (location === '/client-login-modern') {
    return <div className="h-full"><ClientLoginModern /></div>;
  }
  
  if (location === '/client-register') {
    return <div className="h-full"><ClientRegister /></div>;
  }
  
  if (location === '/client-dashboard') {
    return <div className="h-full"><ClientDashboard /></div>;
  }
  
  if (location === '/client-dashboard-new') {
    return <div className="h-full"><ClientDashboardNew /></div>;
  }
  
  if (location === '/client-accueil') {
    return <div className="h-full"><ClientAccueil /></div>;
  }
  
  if (location === '/client-rdv') {
    return <div className="h-full"><ClientRdv /></div>;
  }
  
  if (location === '/client-parametres') {
    return <div className="h-full"><ClientParametres /></div>;
  }

  // Page d'accueil publique (sans header/nav mobile)
  if (location === '/' || location === '/home') {
    return (
      <div className="h-full">
        <PublicLanding />
      </div>
    );
  }

  // Pages de support publiques
  if (location === '/centre-aide') {
    return (
      <div className="h-full">
        <CentreAide />
      </div>
    );
  }

  if (location === '/contact') {
    return (
      <div className="h-full">
        <Contact />
      </div>
    );
  }

  if (location === '/cgu') {
    return (
      <div className="h-full">
        <CGU />
      </div>
    );
  }

  if (location === '/confidentialite') {
    return (
      <div className="h-full">
        <Confidentialite />
      </div>
    );
  }

  // Page de résultats de recherche
  if (location.startsWith('/search')) {
    return (
      <div className="h-full">
        <SalonSearchComplete />
      </div>
    );
  }

  // SUPPRIMÉ : Toutes les routes prédéfinies - seule la route dynamique reste
  
  // SUPPRIMÉ : Routes prédéfinies remplacées par le système dynamique
  
  // TOUTES LES ROUTES SALON SPÉCIFIQUES SUPPRIMÉES - UTILISATION DU SYSTÈME DYNAMIQUE UNIQUEMENT

  // Page de message plein écran
  if (location.startsWith('/message/')) {
    return (
      <div className="h-full">
        <FullScreenMessage />
      </div>
    );
  }



  // Page de réservation salon avec slug obligatoire
  if (location.startsWith('/salon-booking/')) {
    return (
      <div className="h-full">
        <SalonBooking />
      </div>
    );
  }

  // ✅ SUPPRIMÉ: Redirection parasite vers /search - cause du bug critique

  // ✅ ROUTE SPÉCIFIQUE POUR BARBIER GENTLEMAN MARAIS
  if (location === '/salon/barbier-gentleman-marais') {
    return (
      <div className="h-full">
        <BarbierGentlemanMarais />
      </div>
    );
  }

  // ✅ ROUTE DYNAMIQUE POUR TOUS LES AUTRES SALONS - /salon/:id
  if (location.startsWith('/salon/') && location !== '/salon') {
    return (
      <div className="h-full">
        <ModernSalonDetailNew />
      </div>
    );
  }

  // Routes spécifiques pour chaque salon - détection automatique
  if (location.includes('/excellence-hair-paris/') || location.includes('/salon-moderne-republique/') || location.includes('/gentleman-barbier/')) {
    return (
      <div className="h-full">
        <SalonBookingFixed />
      </div>
    );
  }

  // Page de connexion pour réservation
  if (location === '/client-login-booking') {
    return (
      <div className="h-full">
        <ClientLoginBooking />
      </div>
    );
  }



  // Pro Pages Manager
  if (location === '/pro-pages') {
    return (
      <div className="h-full">
        <ProPagesManager />
      </div>
    );
  }



  // Page IA simplifiée (ancienne)
  if (location === '/ai-chat') {
    return (
      <div className="h-full">
        <ChatGPTInterface />
      </div>
    );
  }

  // Page de connexion client
  if (location === '/client/login') {
    return (
      <div className="h-full">
        <ClientLogin />
      </div>
    );
  }

  // Page d'inscription client
  if (location === '/client-register') {
    return (
      <div className="h-full">
        <ClientRegister />
      </div>
    );
  }

  // Page tableau de bord client
  if (location === '/client/dashboard') {
    return (
      <div className="h-full">
        <ClientDashboard />
      </div>
    );
  }

  // Page messages client
  if (location === '/client/messages') {
    return (
      <div className="h-full">
        <ClientMessaging />
      </div>
    );
  }

  // Page messagerie client
  if (location === '/client/messages') {
    return (
      <div className="h-full">
        <MessagingSystem />
      </div>
    );
  }

  // Page paramètres client
  if (location === '/settings') {
    return (
      <div className="h-full">
        <Settings />
      </div>
    );
  }

  // PAGE SUPPRIMÉE - Redondance avec la route dynamique principale

  // Page salon professionnelle - modification existante
  if (location === '/salon') {
    return (
      <div className="h-full">
        <SalonPageFixed pageUrl="salon-demo" />
      </div>
    );
  }

  // Tests système
  if (location === '/system-test') {
    return (
      <div className="h-full">
        <Settings />
      </div>
    );
  }

  // Gestion des codes promotionnels
  if (location === '/promo-codes') {
    return (
      <div className="h-full">
        <PromoCodeManagement />
      </div>
    );
  }

  // Tableau de bord de fiabilité client
  if (location === '/client-reliability') {
    return (
      <div className="h-full">
        <ClientReliabilityDashboard />
      </div>
    );
  }

  // Page de connexion professionnelle
  if (location === '/pro-login') {
    return (
      <div className="h-full">
        <ProLoginModern />
      </div>
    );
  }

  // Page d'inscription
  if (location === '/register') {
    return (
      <div className="h-full">
        <Register />
      </div>
    );
  }

  // Page des plans professionnels
  if (location === '/professional-plans') {
    return (
      <div className="h-full">
        <ProfessionalPlans />
      </div>
    );
  }

  // Inscription d'entreprise
  if (location.startsWith('/business-registration')) {
    return (
      <div className="h-full">
        <BusinessRegistration />
      </div>
    );
  }

  // Succès d'inscription d'entreprise
  if (location === '/business-success') {
    return (
      <div className="h-full">
        <BusinessSuccess />
      </div>
    );
  }

  // Page d'inscription/abonnement
  if (location.startsWith('/subscribe')) {
    return (
      <div className="h-full">
        <Subscribe />
      </div>
    );
  }

  // Page de souscription avec informations d'entreprise
  if (location.startsWith('/subscription/signup')) {
    const planType = location.split('/')[3] as "basic-pro" | "advanced-pro" | "premium-pro" | undefined;
    return (
      <div className="h-full">
        <SubscriptionSignup selectedPlan={planType} />
      </div>
    );
  }

  // Page de souscription multi-étapes
  if (location.startsWith('/multi-step-subscription')) {
    const planType = location.split('/')[2] as "basic-pro" | "advanced-pro" | "premium-pro" | undefined;
    return (
      <div className="h-full">
        <MultiStepSubscription selectedPlan={planType} />
      </div>
    );
  }

  // Page de paiement Stripe (supprimé - incompatible)

  // Page de paiement de souscription
  if (location.startsWith('/subscription/payment/')) {
    const subscriptionId = location.split('/')[3];
    return (
      <div className="h-full">
        <SubscriptionPayment subscriptionId={subscriptionId} />
      </div>
    );
  }

  // Page des plans de souscription
  if (location === '/subscription/plans' || location === '/subscription-plans') {
    return (
      <div className="h-full">
        <ModernSubscriptionPlans />
      </div>
    );
  }

  // Page d'essai gratuit
  if (location === '/free-trial') {
    return (
      <div className="h-full">
        <FreeTrialSignup />
      </div>
    );
  }

  // Page de messagerie avancée avec mentions @
  if (location === '/messaging') {
    return (
      <div className="h-full">
        <MessagingHub />
      </div>
    );
  }

  // Page de test des mentions @
  if (location === '/mention-test') {
    return (
      <div className="h-full">
        <MessagingHub />
      </div>
    );
  }

  // PageBuilder en plein écran (sans navigation)
  if (location === '/page-builder') {
    return (
      <div className="h-screen w-full">
        <PageCreator />
      </div>
    );
  }

  // Page de réservation salon
  if (location === '/salon-booking-flow') {
    return (
      <div className="h-full">
        <SalonBookingFlow />
      </div>
    );
  }

  // Pages de salon personnalisées (salon-xxx-xxxx) - MAIS PAS salon-page-editor
  if (location.startsWith('/salon-') && !location.startsWith('/salon-page-editor') && !location.startsWith('/salon-booking') && !location.startsWith('/salon-settings')) {
    const pageUrl = location.substring(1); // Remove leading slash
    return (
      <div className="h-full">
        <SalonPageFixed pageUrl={pageUrl} />
      </div>
    );
  }

  // Page de réservation client en plein écran (sans navigation)
  if (location === '/booking' || location === '/quick-booking') {
    return (
      <div className="h-full">
        <QuickBooking />
      </div>
    );
  }

  // Page IA moderne en plein écran
  if (location === '/ai-simple') {
    return (
      <div className="h-full">
        <AIAssistantSimple />
      </div>
    );
  }

  // Messagerie directe en plein écran
  if (location === '/direct-messaging') {
    return (
      <div className="h-full">
        <DirectMessaging />
      </div>
    );
  }

  // Pages de connexion sans navigation
  if (location === '/pro-login') {
    return (
      <div className="h-full">
        <ProLoginModern />
      </div>
    );
  }

  if (location === '/client-login') {
    return (
      <div className="h-full">
        <ClientLogin />
      </div>
    );
  }

  if (location === '/client-register') {
    return (
      <div className="h-full">
        <ClientRegister />
      </div>
    );
  }

  // Page IA en plein écran SANS menu navigation (comme dans l'image)
  if (location === '/ai') {
    return (
      <div className="h-full">
        <AIAssistantFixed />
      </div>
    );
  }

  // Application principale avec navigation
  return (
    <div className="h-full flex flex-col max-w-md mx-auto bg-white/95 backdrop-blur-sm shadow-lg overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50/30 to-purple-50/20 smooth-scroll">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/admin-dashboard" component={AdminDashboard} />
          <Route path="/planning" component={PlanningModern} />
          <Route path="/clients" component={ClientsModern} />
          <Route path="/staff-management" component={StaffManagement} />
          <Route path="/services-management" component={ServicesManagement} />
          <Route path="/professional-settings-demo" component={ProfessionalSettingsDemo} />
          <Route path="/business-features" component={BusinessFeaturesFixed} />
          <Route path="/messaging-system" component={MessagingSystem} />
          <Route path="/analytics-dashboard" component={AnalyticsDashboard} />
          <Route path="/stock-alerts" component={StockAlerts} />

          <Route path="/share-booking" component={ShareBooking} />
          <Route path="/services" component={Services} />
          <Route path="/staff" component={Staff} />
          <Route path="/inventory" component={InventoryModern} />
          <Route path="/booking-pages" component={BookingPages} />
          <Route path="/promo-codes" component={PromoCodeManagement} />
          <Route path="/client-reliability" component={ClientReliabilityDashboard} />

          <Route path="/notifications" component={NotificationCenter} />
          <Route path="/share" component={ShareBooking} />
          {/* <Route path="/test-booking" component={SimpleBooking} /> */}
          <Route path="/support" component={Support} />
          <Route path="/contact" component={Contact} />
          <Route path="/centre-aide" component={CentreAide} />
          <Route path="/cgu" component={CGU} />
          <Route path="/confidentialite" component={Confidentialite} />
          <Route path="/ai-pro" component={AIAssistantFixed} />
          <Route path="/ai-pro-complete" component={AIProComplete} />
          <Route path="/salon-photos" component={() => <SalonPhotosManager userId="demo" />} />
          <Route path="/monthly-calendar" component={() => <MonthlyCalendar userId="demo" />} />
          <Route path="/messaging-test" component={RealTimeMessaging} />
          <Route path="/pro-messaging-search" component={ProMessaging} />
          <Route path="/client-messaging-search" component={ClientMessagingMobile} />
          <Route path="/notifications" component={NotificationCenter} />
          <Route path="/client-management" component={ClientManagement} />
          <Route path="/services/coiffure" component={ServiceCoiffure} />
          <Route path="/services/esthetique" component={ServiceEsthetique} />
          <Route path="/services/massage" component={ServiceMassage} />
          <Route path="/services/onglerie" component={ServiceOnglerie} />
          <Route path="/pro" component={Landing} />
          <Route path="/pro-pages" component={ProPagesManager} />
          <Route path="/salon-settings" component={SalonSettingsModern} />
          <Route path="/booking-customization" component={BookingCustomization} />
          <Route path="/salon-booking-editor" component={SalonBookingEditor} />
          <Route path="/payment-methods-simple" component={PaymentMethodsSimple} />
          <Route path="/salon-registration" component={SalonRegistration} />
          <Route path="/edit-salon" component={EditSalon} />
          <Route path="/category-selection" component={CategorySelection} />
          <Route path="/salon-selection" component={SalonSelection} />
          <Route path="/salon-payment" component={SalonPayment} />
          <Route path="/business-registration" component={BusinessRegistration} />
          <Route path="/business-success" component={BusinessSuccess} />
          <Route path="/stripe/demo" component={StripeDemo} />
          <Route path="/stripe/success" component={StripeSuccess} />
          <Route path="/stripe/cancel" component={StripeCancel} />
          <Route path="/salon-page-editor" component={SalonPageEditor} />
          <Route path="/salon-booking" component={SalonBookingFlow} />
          <Route path="/stripe-checkout" component={StripeCheckout} />
          <Route path="/improved-subscription-plans" component={ImprovedSubscriptionPlans} />
          <Route path="/salon-registration-password" component={SalonRegistrationWithPassword} />
          <Route path="/original-booking" component={ModernBooking} />
          <Route path="/advanced-booking" component={AdvancedBookingManager} />
          <Route path="/booking-success" component={BookingSuccess} />
          
          {/* Pages style Planity */}
          <Route path="/planity-client-login" component={PlanityStyleClientLogin} />
          <Route path="/planity-booking" component={PlanityStyleBooking} />
          <Route path="/planity-professionals" component={PlanityStyleProfessionalList} />
          <Route path="/planity-account" component={PlanityStyleAccount} />
          <Route path="/planity-beauty-institute" component={PlanityStyleBeautyInstitute} />

          {/* Routes Salon Mobile */}
          <Route path="/salon/salon-excellence-demo" component={SalonExcellenceDemoMobile} />

          <Route component={NotFound} />
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
