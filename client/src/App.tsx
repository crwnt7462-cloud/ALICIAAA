import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import { SessionProvider } from "@/components/SessionProvider";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import Landing from "@/pages/Landing";
import PublicLanding from "@/pages/PublicLanding";
import SearchResults from "@/pages/SearchResults";
import Dashboard from "@/pages/Dashboard";
import Planning from "@/pages/Planning";
import Clients from "@/pages/Clients";
import Booking from "@/pages/Booking";

import AIAutomation from "@/pages/AIAutomationNew";
import AIAssistant from "@/pages/ChatGPTInterface";
import NotificationTest from "@/pages/NotificationTest";
import ClientBooking from "@/pages/ClientBooking";
import ShareBooking from "@/pages/ShareBooking";
import BookingTest from "@/pages/BookingTest";
import NotFound from "@/pages/not-found";
import ProLogin from "@/pages/ProLogin";
import Register from "@/pages/Register";
import ModernSalonDetail from "@/pages/ModernSalonDetail";
import FullScreenMessage from "@/pages/FullScreenMessage";
import PerfectBookingCreator from "@/pages/PerfectBookingCreator";
import Services from "@/pages/Services";
import Staff from "@/pages/Staff";
import DownloadCode from "@/pages/DownloadCode";
import BusinessFeatures from "@/pages/BusinessFeatures";
import PageBuilder from "@/pages/PageBuilder";
import QuickBooking from "@/pages/QuickBooking";
import ModernBooking from "@/pages/ModernBooking";
import ProfessionalPlans from "@/pages/ProfessionalPlans";
import Subscribe from "@/pages/Subscribe";
import DirectMessaging from "@/pages/DirectMessaging";
import SalonSearch from "@/pages/SalonSearch";
import BookingPageSimple from "@/pages/BookingPageSimple";
import SubscriptionSignup from "@/pages/SubscriptionSignup";
import SubscriptionPayment from "@/pages/SubscriptionPayment";
import SubscriptionPlans from "@/pages/SubscriptionPlans";
import ModernSubscriptionPlans from "@/pages/ModernSubscriptionPlans";
import FreeTrialSignup from "@/pages/FreeTrialSignup";
import ClientDashboard from "@/pages/ClientDashboardSimple";
import ClientMessaging from "@/pages/ClientMessaging";
import AIAssistantSimple from "@/pages/AIAssistantSimple";
import MessagingHub from "@/pages/MessagingHub";
import MentionTest from "@/pages/MentionTest";
import SalonPage from "@/pages/SalonPage";
import Inventory from "@/pages/Inventory";
import BookingPages from "@/pages/BookingPages";
import MessagingSystem from "@/pages/MessagingSystem";
import AdminDashboard from "@/pages/AdminDashboard";
import AnalyticsDashboard from "@/pages/AnalyticsDashboard";
import StockAlerts from "@/pages/StockAlerts";
import Settings from "@/pages/Settings";
import Support from "@/pages/Support";
import Contact from "@/pages/Contact";
import ServiceCoiffure from "@/pages/ServiceCoiffure";
import ServiceEsthetique from "@/pages/ServiceEsthetique";
import ServiceMassage from "@/pages/ServiceMassage";
import ServiceOnglerie from "@/pages/ServiceOnglerie";
import PaymentStep from "@/pages/PaymentStep";
import ClientLogin from "@/pages/ClientLogin";


function Router() {
  const [location] = useLocation();
  
  // Page publique pour réservation client (sans header/nav)
  if (location.startsWith('/booking/') && location.includes('/payment')) {
    return (
      <div className="h-full">
        <PaymentStep />
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

  // Page d'accueil publique (sans header/nav mobile)
  if (location === '/' || location === '/home') {
    return (
      <div className="h-full">
        <PublicLanding />
      </div>
    );
  }

  // Page de résultats de recherche
  if (location.startsWith('/search')) {
    return (
      <div className="h-full">
        <SalonSearch />
      </div>
    );
  }

  // Page détail d'un salon
  if (location.startsWith('/salon/')) {
    return (
      <div className="h-full">
        <ModernSalonDetail />
      </div>
    );
  }

  // Page de message plein écran
  if (location.startsWith('/message/')) {
    return (
      <div className="h-full">
        <FullScreenMessage />
      </div>
    );
  }

  // Créateur de page de réservation parfaite
  if (location === '/perfect-booking-creator') {
    return (
      <div className="h-full">
        <PerfectBookingCreator />
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

  // Page de connexion professionnelle
  if (location === '/pro-login') {
    return (
      <div className="h-full">
        <ProLogin />
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
    const planType = location.split('/')[3] as "basic" | "premium" | undefined;
    return (
      <div className="h-full">
        <SubscriptionSignup selectedPlan={planType} />
      </div>
    );
  }

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
        <MentionTest />
      </div>
    );
  }

  // PageBuilder en plein écran (sans navigation)
  if (location === '/page-builder') {
    return (
      <div className="h-screen w-full">
        <PageBuilder />
      </div>
    );
  }

  // Pages de salon personnalisées (salon-xxx-xxxx)
  if (location.startsWith('/salon-')) {
    const pageUrl = location.substring(1); // Remove leading slash
    return (
      <div className="h-full">
        <SalonPage pageUrl={pageUrl} />
      </div>
    );
  }

  // Page de réservation client en plein écran (sans navigation)
  if (location === '/booking' || location === '/quick-booking') {
    return (
      <div className="h-full">
        <BookingPageSimple />
      </div>
    );
  }

  // Page IA simple en plein écran
  if (location === '/ai') {
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

  // Application principale avec navigation
  return (
    <div className="h-full flex flex-col max-w-md mx-auto bg-white/95 backdrop-blur-sm shadow-lg overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50/30 to-purple-50/20 smooth-scroll">
        <Switch>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/admin-dashboard" component={AdminDashboard} />
          <Route path="/planning" component={Planning} />
          <Route path="/clients" component={Clients} />
          <Route path="/business-features" component={BusinessFeatures} />
          <Route path="/messaging-system" component={MessagingSystem} />
          <Route path="/analytics-dashboard" component={AnalyticsDashboard} />
          <Route path="/stock-alerts" component={StockAlerts} />

          <Route path="/share-booking" component={ShareBooking} />
          <Route path="/services" component={Services} />
          <Route path="/staff" component={Staff} />
          <Route path="/inventory" component={Inventory} />
          <Route path="/booking-pages" component={BookingPages} />

          <Route path="/notifications" component={NotificationTest} />
          <Route path="/share" component={ShareBooking} />
          <Route path="/test-booking" component={BookingTest} />
          <Route path="/support" component={Support} />
          <Route path="/contact" component={Contact} />
          <Route path="/services/coiffure" component={ServiceCoiffure} />
          <Route path="/services/esthetique" component={ServiceEsthetique} />
          <Route path="/services/massage" component={ServiceMassage} />
          <Route path="/services/onglerie" component={ServiceOnglerie} />
          <Route path="/pro" component={Landing} />

          <Route component={NotFound} />
        </Switch>
      </main>
      <BottomNavigation />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ThemeProvider>
          <TooltipProvider>
            <div className="h-full animated-bg">
              <Toaster />
              <Router />
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}

export default App;
