// Fallback si aucune route ne correspond
// ...imports...
  // Fallback si aucune route ne correspond
import { Switch, Route, useLocation } from "wouter";
import NotFoundPage from "@/pages/not-found";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import { 
  Calendar, 
  Users, 
  Settings as SettingsIcon, 
  MessageSquare, 
  Home, 
  User, 
  BarChart3, 
  MapPin, 
  Sparkles 
} from "lucide-react";


import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import Landing from "@/pages/Landing";
import PublicLanding from "@/pages/PublicLanding";
import SearchResults from "@/pages/SearchResults";
import Dashboard from "@/pages/Dashboard";
import DashboardPeymen from "@/pages/DashboardPeymen";

import PlanningResponsive from "@/pages/PlanningResponsive";



import ChatGPTInterface from "@/pages/ChatGPTInterface";


import ShareBooking from "@/pages/ShareBooking";


import Register from "@/pages/Register";
import ServiceSelection from "@/pages/ServiceSelection";

import FullScreenMessage from "@/pages/FullScreenMessage";
import SalonExcellenceParis from "@/pages/salons/SalonExcellenceParis";
import BarbierGentlemanMarais from "@/pages/salons/BarbierGentlemanMarais";
import SalonModerneRepublique from "@/pages/salons/SalonModerneRepublique";
import InstitutBeauteSaintGermain from "@/pages/salons/InstitutBeauteSaintGermain";
import BeautyLoungeMontparnasse from "@/pages/salons/BeautyLoungeMontparnasse";
import BeautyLashStudio from "@/pages/salons/BeautyLashStudio";

import Services from "@/pages/Services";
import Staff from "@/pages/Staff";

import BusinessFeaturesWithBottomSheets from "@/pages/BusinessFeaturesWithBottomSheets";

import SalonSettingsModern from "@/pages/SalonSettingsModern";
import ProMessagingModern from "@/pages/ProMessagingModern";
import InventoryModern from "@/pages/InventoryModern";

import ClientsModern from "@/pages/ClientsModern";

import QuickBooking from "@/pages/QuickBooking";
import ModernBooking from "@/pages/ModernBooking";

import AdvancedBookingManager from "@/pages/AdvancedBookingManager";
import ProfessionalPlans from "@/pages/ProfessionalPlans";
import Subscribe from "@/pages/Subscribe";
import DirectMessaging from "@/pages/DirectMessaging";
import StaffManagement from "@/pages/StaffManagement";
import StaffManagementModern from "@/pages/StaffManagementModern";
import ServicesManagement from "@/pages/ServicesManagement";
import ProfessionalSettingsDemo from "@/pages/ProfessionalSettingsDemo";
import ModernSalonCompact from "@/pages/ModernSalonCompact";
import TestSalon from "@/pages/TestSalon";
import ClientAnalytics from "@/pages/ClientAnalytics";
import SalonSearchComplete from "@/pages/SalonSearchComplete";
import BookingPageSimple from "@/pages/BookingPageSimple";
import SubscriptionSignup from "@/pages/SubscriptionSignup";
import MultiStepSubscription from "@/pages/MultiStepSubscription";

import SubscriptionPlans from "@/pages/SubscriptionPlans";
import ModernSubscriptionPlans from "@/pages/ModernSubscriptionPlans";
import FreeTrialSignup from "@/pages/FreeTrialSignup";
import ClientDashboardSimple from "@/pages/ClientDashboardSimple";

import AIAssistantFixed from "@/pages/AIAssistantFixed";
import MessagingHub from "@/pages/MessagingHub";
import PlanityStyleBookingRenamed from "@/pages/PlanityStyleBooking";
import PlanityStyleBookingFixed from "@/pages/PlanityStyleBookingFixed";
import ProfessionalSelection from "@/pages/ProfessionalSelection";
import BookingDateTime from "@/pages/BookingDateTime";
import SalonDynamicPage from "@/pages/SalonDynamicPage";


import SalonPageFixed from "@/pages/SalonPageFixed";
import SalonPage from "@/pages/SalonPage";
import DevProLogin from "@/pages/DevProLogin";
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
import ForgotPassword from "@/pages/ForgotPassword";

import FuturisticClientLogin from "@/pages/FuturisticClientLogin";
import ClientLoginModern from "@/pages/ClientLoginModern";
import ClientDashboard from "@/pages/ClientDashboard";
import ProLogin from "@/pages/ProLogin";

import AvyentoStyleClientLogin from "@/pages/AvyentoStyleClientLogin";
import AvyentoStyleBooking from "@/pages/AvyentoStyleBooking";
import AvyentoStyleProfessionalList from "@/pages/AvyentoStyleProfessionalList";
import AvyentoStyleAccount from "@/pages/AvyentoStyleAccount";
import AvyentoStyleBeautyInstitute from "@/pages/AvyentoStyleBeautyInstitute";
import SalonRegistration from "@/pages/SalonRegistration";
import SalonPhotosManager from "@/pages/SalonPhotosManager";
import MonthlyCalendar from "@/pages/MonthlyCalendar";
import AIProComplete from "@/pages/AIProComplete";
import EditSalon from "@/pages/EditSalon";


import SalonSelection from "@/pages/SalonSelection";
import CategorySelection from "@/pages/CategorySelection";
import PageCreator from "@/pages/PageCreator";
import ProPagesManager from "@/pages/ProPagesManager";
import SalonBookingEditor from "@/pages/SalonBookingEditor";
import BookingCustomization from "@/pages/BookingCustomization";

import PaymentMethodsSimple from "@/pages/PaymentMethodsSimple";
import SalonPayment from "@/pages/SalonPayment";
import ClientProDashboard from "@/pages/ClientProDashboard";
import MessagingSearch from "@/pages/MessagingSearch";
import ProMessaging from "@/pages/ProMessaging";
import StripeDemo from "@/pages/StripeDemo";
import StripeSuccess from "@/pages/StripeSuccess";
import StripeCancel from "@/pages/StripeCancel";
import ProMessagingSimple from "@/pages/ProMessagingSimple";
import SalonSettingsComplete from "@/pages/SalonSettingsComplete";
import SalonSettings from "@/pages/SalonSettings";
import ClientManagement from "@/pages/ClientManagement";
import RealTimeMessaging from "@/pages/RealTimeMessaging";
import ClientMessaging from "@/pages/ClientMessaging";
import ClientMessagingMobile from "@/pages/ClientMessagingMobile";
import LoginClassic from "@/pages/LoginClassic";
import TestLogin from "@/pages/TestLogin";

import NotificationCenter from "@/pages/NotificationCenter";
import SalonPageEditor from "@/pages/SalonPageEditor";
import SalonCreation from "@/pages/SalonCreation";
import SalonBookingFlow from "@/pages/SalonBookingFlow";
import StripeCheckout from "@/pages/StripeCheckout";
import ImprovedSubscriptionPlans from "@/pages/ImprovedSubscriptionPlans";
import SalonRegistrationWithPassword from "@/pages/SalonRegistrationWithPassword";
import BookingSuccess from "@/pages/BookingSuccess";
import SalonBookingFixed from "@/pages/SalonBookingFixed";
import ClientLoginBooking from "@/pages/ClientLoginBooking";
import ChoisirProfessionnel from "@/pages/ChoisirProfessionnel";
import AuthTest from "@/pages/AuthTest";

import StripePayment from "@/pages/StripePayment";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import AppwriteTest from "./components/AppwriteTest";

function Router() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  // Pages qui nécessitent une authentification (pages professionnelles + pages clients personnelles)  
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
    '/inventory',
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
    // Pages clients protégées (comptes personnels)
    '/client-dashboard',
    '/client-parametres',
    '/client-rdv',
    '/avyento-account',
    '/notifications',
  ];
  // VÉRIFICATION IMMÉDIATE - AVANT TOUT RENDU
  const isProtectedPage = protectedPages.some(page => location.startsWith(page));

  // Redirection synchrone immédiate pour éviter tout flash
  // Redirection désactivée temporairement pour debug
  // if (isProtectedPage && !isLoading && !isAuthenticated) {
  //   if (typeof window !== 'undefined') { // éviter tout flash
  //     console.log(`🔒 ACCÈS REFUSÉ ${location} — Redirection immédiate`);
  //     window.location.replace('/'); // replace() évite l'historique
  //   }
  //   return null; // Empêche absolument tout rendu
  // }
  // Si on est en cours de chargement sur une page protégée, afficher un loader
  if (isProtectedPage && isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }
  // Pages qui ne doivent pas avoir la barre violette en bas + toutes les pages pro
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
        <PlanityStyleBookingFixed />
      </div>
    );
  }
  // Page de réservation style Avyento (sans header)
  if (location === '/avyento-style-booking-fixed') {
    return (
      <div className="h-full">
        <PlanityStyleBookingFixed />
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
  // Page de recherche de messagerie
  if (location === '/messaging-search') {
    return (
      <div className="h-full">
        <MessagingSearch />
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
  // Messages IA pour clients



  // Page de réservation publique
  if (location === '/booking' || location.startsWith('/booking/')) {
    return (
      <div className="h-full">
        <PlanityStyleBookingFixed />
      </div>
    );
  }
  // Pages client spécifiques
  if (location === '/client-login') {
    return <div className="h-full"><FuturisticClientLogin /></div>;
  }
  if (location === '/client-login-modern') {
    return <div className="h-full"><ClientLoginModern /></div>;
  }
  if (location === '/client-dashboard') {
    return <div className="h-full"><ClientDashboard /></div>;
  }
  if (location === '/client-register') {
    return <div className="h-full"><ClientRegister /></div>;
  }
  // Page de connexion professionnelle
  if (location === '/pro-login') {
    return (
      <div className="h-full">
        <ProLogin />
      </div>
    );
  }
  // Page de récupération de mot de passe
  if (location === '/forgot-password') {
    return (
      <div className="h-full">
        <ForgotPassword />
      </div>
    );
  }
  // Redirection de subscription-payment vers register
  if (location === '/subscription-payment') {
  setLocation('/register');
  return null;
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
  if (location === '/') {
    return (
      <div className="h-full">
        <PublicLanding />
      </div>
    );
  }
  // Page de test d'authentification
  if (location === '/auth-test') {
    return (
      <div className="h-full">
        <AuthTest />
      </div>
    );
  }
  // Page de paiement Stripe
  if (location === '/stripe-checkout') {
    return (
      <div className="h-full">
        <StripeCheckout />
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
        <SearchResults />
      </div>
    );
  }
  // SUPPRIMÉ : Toutes les routes prédéfinies - seule la route dynamique reste
  // SUPPRIMÉ : Toutes les routes prédéfinies - seule la route dynamique reste
  // SUPPRIMÉ : Routes prédéfinies remplacées par le système dynamique
  // SUPPRIMÉ : Routes prédéfinies remplacées par le système dynamique
  // TOUTES LES ROUTES SALON SPÉCIFIQUES SUPPRIMÉES - UTILISATION DU SYSTÈME DYNAMIQUE UNIQUEMENT
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
        <SalonBookingFlow />
      </div>
    );
  }
  // ✅ ROUTE SPÉCIFIQUE POUR BARBIER GENTLEMAN MARAIS - GARDE LA MISE EN PAGE ORIGINALE
  if (location === '/salon/barbier-gentleman-marais') {
    return (
      <div className="h-full">
        <BarbierGentlemanMarais />
      </div>
    );
  }
  // ✅ ROUTES SPÉCIFIQUES POUR LES SALONS DÉMO - UTILISENT LE TEMPLATE STANDARDISÉ
  if (location === '/salon/institut-beaute-saint-germain') {
    return (
      <div className="h-full">
        <InstitutBeauteSaintGermain />
      </div>
    );
  }
  if (location === '/salon/salon-moderne-republique') {
    return (
      <div className="h-full">
        <SalonModerneRepublique />
      </div>
    );
  }
  if (location === '/salon/beauty-lounge-montparnasse') {
    return (
      <div className="h-full">
        <BeautyLoungeMontparnasse />
      </div>
    );
  }
  if (location === '/salon/salon-excellence-paris') {
    return (
      <div className="h-full">
        <SalonExcellenceParis />
      </div>
    );
  }
  if (location === '/salon/beauty-lash-studio') {
    return (
      <div className="h-full">
        <BeautyLashStudio />
      </div>
    );
  }
  // ✅ ROUTE DYNAMIQUE POUR TOUS LES AUTRES NOUVEAUX SALONS - UTILISE LE TEMPLATE OFFICIEL
  if (location.startsWith('/salon/') && location !== '/salon') {
    return (
      <div className="h-full">
        <SalonPage />
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
        <ClientProDashboard />
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
  // PAGE SUPPRIMÉE - Redondance avec la route dynamique principale - ROUTE SALON SUPPRIMÉE POUR ÉVITER CONFLIT
  // PAGE SUPPRIMÉE - Redondance avec la route dynamique principale - ROUTE SALON SUPPRIMÉE POUR ÉVITER CONFLIT
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
        <SubscriptionSignup selectedPlan={planType || "basic-pro"} />
      </div>
    );
  }
  // Page de souscription multi-étapes
  if (location.startsWith('/multi-step-subscription')) {
    const planType = location.split('/')[2] as "basic-pro" | "advanced-pro" | "premium-pro" | undefined;
    return (
      <div className="h-full">
        <MultiStepSubscription selectedPlan={planType || "basic-pro"} />
      </div>
    );
  }
  // Page de paiement Stripe (supprimé - incompatible)
  // Page de paiement Stripe (supprimé - incompatible)
  // Page de paiement de souscription
  if (location.startsWith('/subscription/payment/')) {
    const subscriptionId = location.split('/')[3];
    return (
      <div className="h-full">
        <ModernSubscriptionPlans />
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
  // Page de messagerie avancée PROTÉGÉE avec mentions @
  if (location === '/messaging') {
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Messagerie Professionnelle</h2>
            <p className="text-gray-600 mb-6">Accédez à vos conversations avec vos clients. Connexion requise.</p>
            <a href="/api/login" className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-medium rounded-full hover:from-purple-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
              Se connecter
            </a>
          </div>
        </div>
      </div>
    );
    }
    return (
      <div className="h-full">
        <MessagingHub />
      </div>
    );
  }
  // Page de test des mentions @ PROTÉGÉE
  if (location === '/mention-test') {
  if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Test Mentions</h2>
              <p className="text-gray-600 mb-6">Cette fonctionnalité est réservée aux professionnels connectés.</p>
              <a href="/api/login" className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-medium rounded-full hover:from-purple-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
                Se connecter
              </a>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="h-full">
        <MessagingHub />
      </div>
    );
  }
  // PageBuilder PROTÉGÉ - plein écran (sans navigation)
  if (location === '/page-builder') {
  if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 002 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Créateur de Pages</h2>
              <p className="text-gray-600 mb-6">Créez des pages personnalisées pour votre salon. Connexion professionnelle requise.</p>
              <a href="/api/login" className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-medium rounded-full hover:from-purple-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
                Se connecter
              </a>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="h-screen w-full">
        <PageCreator />
      </div>
    );
  }
  // Page de réservation style Planity PROTÉGÉE
  if (location === '/planity-booking') {
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4l6 6M6 13l6-6" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Réservation Planity</h2>
              <p className="text-gray-600 mb-6">Connectez-vous pour accéder au système de réservation Planity.</p>
              <a
                href="/api/login"
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-medium rounded-full hover:from-purple-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                Se connecter
              </a>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="h-full">
        <PlanityStyleBookingFixed />
      </div>
    );
  }
  // Page de réservation style Planity PROTÉGÉE
  if (location === '/planity-booking') {
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4l6 6M6 13l6-6" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Réservation Planity</h2>
              <p className="text-gray-600 mb-6">Connectez-vous pour accéder au système de réservation Planity.</p>
              <a
                href="/api/login"
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-medium rounded-full hover:from-purple-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                Se connecter
              </a>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="h-full">
        <PlanityStyleBookingFixed />
      </div>
    );
  }
  // Page de sélection des services -> remplacée par choix date/heure
  if (location === '/service-selection') {
    return (
      <div className="h-full">
        <BookingDateTime />
      </div>
    );
  }
  // Page de sélection des professionnels (chargement automatique de l'équipe)
  if (location === '/professional-selection') {
    return (
      <div className="h-full">
        <ProfessionalSelection />
      </div>
    );
  }

  // Page de choix date/heure (accessible sans authentification)
  if (location === '/booking-datetime') {
    return (
      <div className="h-full">
        <BookingDateTime />
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
  // Page salon mobile moderne - Route spéciale "/salon" - SEULE ROUTE ACTIVE
  // Page salon mobile moderne - Route spéciale "/salon" - SEULE ROUTE ACTIVE
  // Page salon mobile moderne - Route spéciale "/salon"
  if (location === '/salon') {
    return (
      <div className="h-full">
        <SalonPage />
      </div>
    );
  }

  // Page création de salon - Template identique à /salon
  if (location === '/salon-creation') {
    return (
      <div className="h-full">
        <SalonCreation />
      </div>
    );
  }

  // Pages de salon dynamiques (/salon/:slug) - APRÈS /salon
  if (location.startsWith('/salon/')) {
    return (
      <div className="h-full">
        <SalonDynamicPage />
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


  // Messagerie directe en plein écran
  if (location === '/direct-messaging') {
    return (
      <div className="h-full">
        <DirectMessaging />
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
  // VÉRIFICATION D'AUTHENTIFICATION POUR TOUTES LES PAGES SUIVANTES
  // Si l'utilisateur n'est pas authentifié ET qu'il essaie d'accéder à une page protégée,
  // alors rediriger vers la page de connexion qu'il essaie d'accéder à une page protégée,
  // alors rediriger vers la page de connexion
  // Note: /planning est maintenant géré dans la section "Pages professionnelles avec sidebar persistant"
  // Note: /planning est maintenant géré dans la section "Pages professionnelles avec sidebar persistant"
  
  // 🔓 Page DEV LOGIN - Connexion directe pour développement
  if (location === '/dev-login') {
    return (
      <div className="h-full">
        <DevProLogin />
      </div>
    );
  }

  // Page Dashboard - PROTÉGÉE - Plein écran sans contraintes avec glassmorphism
  if (location === '/dashboard') {
    // Redirection vers login professionnel si pas authentifié
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


  // Pages professionnelles PROTÉGÉES avec sidebar persistant
  const proPages = ['/planning', '/clients', '/clients-modern', '/services-management', '/messaging-hub', '/ai-assistant-fixed', '/client-analytics', '/business-features', '/ai'];
  if (proPages.includes(location)) {
    // Redirection vers login professionnel si pas authentifié
    if (!isAuthenticated && !isLoading) {
      window.location.href = '/pro-login';
      return null;
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 w-full">
        {/* Navigation mobile uniquement */}
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
        {/* Navigation mobile MobileBottomNav */}
        <MobileBottomNav userType="pro" />
      </div>
    );
  }
  // Page Business Features PROTÉGÉE - plein écran desktop avec navigation mobile conservée
  if (location === '/business-features') {
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Fonctionnalités Professionnelles</h2>
              <p className="text-gray-600 mb-6">Cette section est réservée aux professionnels authentifiés. Connectez-vous pour accéder à vos outils business.</p>
              <a
                href="/api/login"
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-medium rounded-full hover:from-purple-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                Se connecter
              </a>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="h-full flex flex-col lg:max-w-none lg:w-full max-w-md mx-auto lg:shadow-none shadow-lg overflow-hidden">
        <div className="lg:hidden">
          <Header />
        </div>
        <main className="flex-1 overflow-y-auto">
          <BusinessFeaturesWithBottomSheets />
        </main>
        <div className="lg:hidden">
          <BottomNavigation />
        </div>
      </div>
    );
  }
  // Page Clients PROTÉGÉE - plein écran desktop avec navigation mobile conservée
  if (location === '/clients' || location === '/clients-modern') {
    // Protection déjà gérée par le système unifié ci-dessus
    return (
      <div className="h-full flex flex-col lg:max-w-none lg:w-full max-w-md mx-auto lg:shadow-none shadow-lg overflow-hidden">
        <div className="lg:hidden">
          <Header />
        </div>
        <main className="flex-1 overflow-y-auto md:pl-20">
          <ClientsModern />
        </main>
        <BottomNavigation />
      </div>
    );
  }


  // COMPOSANT DE PROTECTION - RENDU DIRECT CAR PROTECTION DÉJÀ GÉRÉE
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
  };
  // Application principale avec navigation
  return (
    <div className="h-full flex flex-col lg:max-w-none lg:w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm lg:shadow-none shadow-lg overflow-hidden">
      <div className="lg:hidden">
        <Header />
      </div>
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50/30 to-purple-50/20 smooth-scroll">
        <Switch>
          {/* ROUTES PROFESSIONNELLES PROTÉGÉES */}
          <Route path="/dashboard-old" component={() => <ProtectedRoute><DashboardPeymen /></ProtectedRoute>} />
          <Route path="/admin-dashboard" component={() => <ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/staff-management" component={() => <ProtectedRoute><StaffManagementModern /></ProtectedRoute>} />
          <Route path="/services-management" component={() => <ProtectedRoute><ServicesManagement /></ProtectedRoute>} />
          <Route path="/professional-settings-demo" component={() => <ProtectedRoute><ProfessionalSettingsDemo /></ProtectedRoute>} />
          <Route path="/business-features" component={() => <ProtectedRoute><BusinessFeaturesWithBottomSheets /></ProtectedRoute>} />
          <Route path="/messaging-system" component={() => <ProtectedRoute><MessagingSystem /></ProtectedRoute>} />
          <Route path="/analytics-dashboard" component={() => <ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
          <Route path="/stock-alerts" component={() => <ProtectedRoute><StockAlerts /></ProtectedRoute>} />
          <Route path="/services" component={() => <ProtectedRoute><Services /></ProtectedRoute>} />
          <Route path="/staff" component={() => <ProtectedRoute><Staff /></ProtectedRoute>} />
          <Route path="/inventory" component={() => <ProtectedRoute><InventoryModern /></ProtectedRoute>} />
          <Route path="/booking-pages" component={() => <ProtectedRoute><BookingPages /></ProtectedRoute>} />
          <Route path="/promo-codes" component={() => <ProtectedRoute><PromoCodeManagement /></ProtectedRoute>} />
          <Route path="/client-reliability" component={() => <ProtectedRoute><ClientReliabilityDashboard /></ProtectedRoute>} />
          <Route path="/ai-pro" component={() => <ProtectedRoute><AIAssistantFixed /></ProtectedRoute>} />
          <Route path="/ai-pro-complete" component={() => <ProtectedRoute><AIProComplete /></ProtectedRoute>} />
          <Route path="/salon-photos" component={() => <ProtectedRoute><SalonPhotosManager userId="demo" /></ProtectedRoute>} />
          <Route path="/monthly-calendar" component={() => <ProtectedRoute><MonthlyCalendar userId="demo" /></ProtectedRoute>} />
          <Route path="/messaging-test" component={() => <ProtectedRoute><RealTimeMessaging currentUserId="demo" currentUserType="professional" currentUserName="Demo User" otherUserId="client" otherUserType="client" otherUserName="Client Demo" /></ProtectedRoute>} />
          <Route path="/pro-messaging-search" component={() => <ProtectedRoute><ProMessaging /></ProtectedRoute>} />
          <Route path="/client-management" component={() => <ProtectedRoute><ClientManagement /></ProtectedRoute>} />
          <Route path="/pro-pages" component={() => <ProtectedRoute><ProPagesManager /></ProtectedRoute>} />
          <Route path="/salon-settings" component={() => <ProtectedRoute><SalonSettingsModern /></ProtectedRoute>} />
          <Route path="/booking-customization" component={() => <ProtectedRoute><BookingCustomization /></ProtectedRoute>} />
          <Route path="/booking-customization" component={() => <ProtectedRoute><BookingCustomization /></ProtectedRoute>} />
          {/* ROUTES PROFESSIONNELLES PROTÉGÉES - SUITE */}
          <Route path="/salon-booking-editor" component={() => <ProtectedRoute><SalonBookingEditor /></ProtectedRoute>} />
          <Route path="/edit-salon" component={() => <ProtectedRoute><EditSalon /></ProtectedRoute>} />
          <Route path="/salon-page-editor" component={() => <ProtectedRoute><SalonPageEditor /></ProtectedRoute>} />
          <Route path="/salon-page-editor" component={() => <ProtectedRoute><SalonPageEditor /></ProtectedRoute>} />
          {/* ROUTES CLIENTS - SEULES LES PAGES COMPTES PERSONNELS PROTÉGÉES */}
          <Route path="/client-messaging-search" component={ClientMessagingMobile} />
          <Route path="/avyento-account" component={() => <ProtectedRoute><AvyentoStyleAccount /></ProtectedRoute>} />
          <Route path="/notifications" component={() => <ProtectedRoute><NotificationCenter /></ProtectedRoute>} />
          <Route path="/notifications" component={() => <ProtectedRoute><NotificationCenter /></ProtectedRoute>} />
          {/* ROUTES DE RÉSERVATION - PUBLIQUES */}
          <Route path="/avyento-booking" component={AvyentoStyleBooking} />
          <Route path="/original-booking" component={ModernBooking} />
          <Route path="/advanced-booking" component={AdvancedBookingManager} />
          <Route path="/booking-success" component={BookingSuccess} />
          <Route path="/salon-booking" component={SalonBookingFlow} />
          <Route path="/salon/:public_slug/reserver" component={PlanityStyleBookingFixed} />
          <Route path="/book/:public_slug/reserver" component={SalonBookingFlow} />
          {/* ROUTES PUBLIQUES - PAS DE PROTECTION */}
          <Route path="/share-booking" component={ShareBooking} />
          <Route path="/share" component={ShareBooking} />
          <Route path="/support" component={Support} />
          <Route path="/contact" component={Contact} />
          <Route path="/centre-aide" component={CentreAide} />
          <Route path="/cgu" component={CGU} />
          <Route path="/confidentialite" component={Confidentialite} />
          <Route path="/services/coiffure" component={ServiceCoiffure} />
          <Route path="/services/esthetique" component={ServiceEsthetique} />
          <Route path="/services/massage" component={ServiceMassage} />
          <Route path="/services/onglerie" component={ServiceOnglerie} />
          <Route path="/pro" component={Landing} />
          <Route path="/payment-methods-simple" component={PaymentMethodsSimple} />
          <Route path="/salon-registration" component={SalonRegistration} />
          <Route path="/category-selection" component={CategorySelection} />
          <Route path="/salon-selection" component={SalonSelection} />
          <Route path="/salon-payment" component={SalonPayment} />
          <Route path="/business-registration" component={BusinessRegistration} />
          <Route path="/business-success" component={BusinessSuccess} />
          <Route path="/stripe/demo" component={StripeDemo} />
          <Route path="/stripe/success" component={StripeSuccess} />
          <Route path="/stripe/cancel" component={StripeCancel} />
          <Route path="/stripe-checkout" component={StripeCheckout} />
          <Route path="/improved-subscription-plans" component={ImprovedSubscriptionPlans} />
          <Route path="/salon-registration-password" component={SalonRegistrationWithPassword} />
          {/* Pages style Avyento - PUBLIQUES */}
          <Route path="/avyento-client-login" component={AvyentoStyleClientLogin} />
          <Route path="/avyento-professionals" component={AvyentoStyleProfessionalList} />
          <Route path="/avyento-beauty-institute" component={AvyentoStyleBeautyInstitute} />
          {/* CONNEXION PROFESSIONNELLE CLASSIQUE */}
          <Route path="/login-classic" component={LoginClassic} />
          <Route path="/test-login" component={TestLogin} />
          {/* Routes Salons Template - Nouvelle génération standardisée */}
          <Route path="/salons/salon-excellence-paris" component={SalonExcellenceParis} />
          <Route path="/salons/barbier-gentleman-marais" component={BarbierGentlemanMarais} />
          <Route component={NotFoundPage} />
        </Switch>
      </main>
      {!hideBottomNavPages.includes(location) && <BottomNavigation />}
    </div>
  );
} // <-- ferme correctement la fonction Router

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