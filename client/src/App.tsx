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
import AIAssistant from "@/pages/AIAssistant";
import NotificationTest from "@/pages/NotificationTest";
import ClientBooking from "@/pages/ClientBooking";
import ShareBooking from "@/pages/ShareBooking";
import BookingTest from "@/pages/BookingTest";
import NotFound from "@/pages/not-found";
import ProLogin from "@/pages/ProLogin";
import Register from "@/pages/Register";
import SalonDetail from "@/pages/SalonDetail";
import Services from "@/pages/Services";
import Staff from "@/pages/Staff";
import DownloadCode from "@/pages/DownloadCode";
import BusinessFeatures from "@/pages/BusinessFeatures";
import PageBuilder from "@/pages/PageBuilder";
import QuickBooking from "@/pages/QuickBooking";
import ProfessionalPlans from "@/pages/ProfessionalPlans";
import Subscribe from "@/pages/Subscribe";
import DirectMessaging from "@/pages/DirectMessaging";
import SalonSearch from "@/pages/SalonSearch";
import BookingPage from "@/pages/BookingPage";
import SubscriptionSignup from "@/pages/SubscriptionSignup";
import SubscriptionPayment from "@/pages/SubscriptionPayment";
import SubscriptionPlans from "@/pages/SubscriptionPlans";
import ModernSubscriptionPlans from "@/pages/ModernSubscriptionPlans";
import FreeTrialSignup from "@/pages/FreeTrialSignup";
import ClientDashboard from "@/pages/ClientDashboard";
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


function Router() {
  const [location] = useLocation();
  
  // Page publique pour réservation client (sans header/nav)
  if (location.startsWith('/book/')) {
    return (
      <div className="h-full">
        <BookingPage />
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
        <SalonDetail />
      </div>
    );
  }

  // Page de connexion client
  if (location === '/client-login') {
    return (
      <div className="h-full">
        <ProLogin />
      </div>
    );
  }

  // Page tableau de bord client
  if (location === '/client-dashboard') {
    return (
      <div className="h-full">
        <ClientDashboard />
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

  // QuickBooking en plein écran (sans navigation)
  if (location === '/quick-booking') {
    return (
      <div className="h-full">
        <QuickBooking />
      </div>
    );
  }

  // Page IA avec navigation en bas mais sans header
  if (location === '/ai') {
    return (
      <div className="h-full flex flex-col max-w-md mx-auto bg-white/95 backdrop-blur-sm shadow-lg overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <AIAssistant />
        </main>
        <BottomNavigation />
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

          <Route path="/booking" component={Booking} />
          <Route path="/share-booking" component={ShareBooking} />
          <Route path="/services" component={Services} />
          <Route path="/staff" component={Staff} />
          <Route path="/inventory" component={Inventory} />
          <Route path="/booking-pages" component={BookingPages} />

          <Route path="/notifications" component={NotificationTest} />
          <Route path="/share" component={ShareBooking} />
          <Route path="/test-booking" component={BookingTest} />
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
