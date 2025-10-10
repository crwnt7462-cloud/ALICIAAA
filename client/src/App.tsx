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
import PublicLanding from "@/pages/PublicLanding";
import SearchResults from "@/pages/SearchResults";
import DashboardPro from "@/pages/DashboardPro";








import Register from "@/pages/Register";




import Inventory from "@/pages/Inventory";

import ClientManagement from "@/pages/ClientManagement";

// QuickBooking supprimé

import ProfessionalPlans from "@/pages/ProfessionalPlans";
import Subscribe from "@/pages/Subscribe";
import StaffManagementModern from "@/pages/StaffManagementModern";
import Planning from "@/pages/Planning";
import ServicesManagement from "@/pages/ServicesManagement";
import TestSalon from "@/pages/TestSalon";
import IAClientAnalytics from "@/pages/IAClientAnalytics";
import BookingPageSimple from "@/pages/BookingPageSimple";
import SubscriptionSignup from "@/pages/SubscriptionSignup";

import SubscriptionPlans from "@/pages/SubscriptionPlans";

import ProfessionalSelection from "@/pages/ProfessionalSelection";
import BookingDateTime from "@/pages/BookingDateTime";
import BookingFix from "@/pages/BookingFix";
// ServiceSelection supprimé - service déjà sélectionné à l'étape précédente
// BookingPayment supprimé - remplacé par BookingDateTime dans le flux
// import SalonDynamicPage from "@/pages/SalonDynamicPage"; // removed


import TemplatePage from "@/pages/SalonPage";
import BookingPages from "@/pages/BookingPages";
import SalonPolicies from "@/pages/SalonPolicies";
import SettingsClient from "@/pages/SettingsClient";
import Support from "@/pages/Support";
import Contact from "@/pages/Contact";
import CentreAide from "@/pages/CentreAide";
import CGU from "@/pages/CGU";
import Confidentialite from "@/pages/Confidentialite";
import MentionsLegales from "@/pages/MentionsLegales";
import CookiesPolicy from "@/pages/CookiesPolicy";

import ForgotPassword from "@/pages/ForgotPassword";

import ClientLogin from "@/pages/ClientLogin";
import ClientDashboard from "@/pages/ClientDashboard";
import ProLogin from "@/pages/ProLogin";

import IAAvyento from "@/pages/IAAvyento";


import PageCreator from "@/pages/PageCreator";

// import SalonPayment from "@/pages/SalonPayment"; // removed
import StripeSuccess from "@/pages/StripeSuccess";
import StripeCancel from "@/pages/StripeCancel";
// RealTimeMessaging supprimé
import TestLogin from "@/pages/TestLogin";

import BookingFlow from "@/pages/BookingFlow";
import BookingConfirmation from "@/pages/BookingConfirmation";
// import SalonBookingFixed from "@/pages/SalonBookingFixed"; // removed (legacy)
import AuthTest from "@/pages/AuthTest";
import DirectMessaging from "@/pages/DirectMessaging";

// StripePayment supprimé - remplacé par BookingFix dans le flux

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
    '/ai-pro-complete',
    '/salon-settings',
    '/staff-management',
    '/services-management',
    '/pro-messaging',
    '/pro-messaging-search',
    '/messaging-test',
    '/salon-page-editor',
    '/messaging-system',
    '/booking-pages',
    '/salon-policies',
    '/promo-codes',
    '/professional-settings-demo',
    '/direct-messaging',
    '/client-analytics',
    // Pages clients protégées (comptes personnels)
    '/client-dashboard',
    '/client-messaging',
    '/client-parametres',
    '/client-rdv',
    '/avyento-account',
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
    '/planning-responsive',
    '/planning',
    '/salon-booking-editor',
  '/direct-messaging',
  '/client-register',
  '/salon-settings',
  '/staff-management',
  '/services-management',
  '/messaging-system',
  '/booking-pages',
  '/promo-codes',
  '/client-reliability',
  '/ai-pro',
  '/ai-pro-complete',
  '/pro-messaging-search',
  '/pro-messaging',
  '/services',
  '/staff',
    '/inventory',
    '/professional-settings-demo'
  ];
  // StripePayment supprimé - remplacé par BookingFix
  if (location.startsWith('/booking/') && location !== '/booking') {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-600 p-8 text-center">Réservation indisponible.</div>
      </div>
    );
  }
  // Page de confirmation de réservation
  if (location === '/booking-confirmation') {
    return (
      <div className="h-full">
        <BookingConfirmation />
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
  // Page de réservation principale - redirection vers booking-datetime
  if (location === '/booking') {
    return (
      <div className="h-full">
        <BookingDateTime />
      </div>
    );
  }

  // Page de paiement BookingFix
  if (location === '/booking-fix') {
    return (
      <div className="h-full">
        <BookingFix />
      </div>
    );
  }

  // Messagerie professionnelle
  
  // Messagerie professionnelle simplifiée
  // Politiques du salon
  if (location === '/salon-policies') {
    return (
      <div className="h-full">
        <SalonPolicies />
      </div>
    );
  }
  // Analytics client avec IA
  if (location === '/client-analytics') {
    return (
      <div className="h-full">
        <IAClientAnalytics />
      </div>
    );
  }
  // Messages IA pour clients
  // Messages IA pour clients



  // Page de réservation publique
  if (location.startsWith('/booking/') && location !== '/booking') {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-600 p-8 text-center">Réservation indisponible.</div>
      </div>
    );
  }
  // Pages client spécifiques
  if (location === '/client-login') {
    return <div className="h-full"><ClientLogin /></div>;
  }
  if (location === '/client-dashboard') {
    return <div className="h-full"><ClientDashboard /></div>;
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
  
  
  if (location === '/client-parametres') {
  return <div className="h-full"><SettingsClient /></div>;
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
  if (location === '/mentions-legales') {
    return (
      <div className="h-full">
        <MentionsLegales />
      </div>
    );
  }
  if (location === '/politique-cookies') {
    return (
      <div className="h-full">
        <CookiesPolicy />
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


  // Page de réservation salon avec slug obligatoire
  // route /salon-booking/:slug désactivée
  // ✅ ROUTE SPÉCIFIQUE POUR BARBIER GENTLEMAN MARAIS - GARDE LA MISE EN PAGE ORIGINALE
  if (location === '/salon/barbier-gentleman-marais') {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-600 p-8 text-center">Page salon indisponible.</div>
      </div>
    );
  }
  // ✅ ROUTE DYNAMIQUE POUR TOUS LES AUTRES NOUVEAUX SALONS - UTILISE LE TEMPLATE OFFICIEL
  if (location.startsWith('/salon/') && location !== '/salon') {
    return (
      <div className="h-full">
        <TemplatePage />
      </div>
    );
  }
  // Redirections legacy supprimées pour laisser passer la route /salon/<slug>


  // Pro Pages Manager


  // Page messages client - Rediriger vers DirectMessaging
  if (location === '/client/messages') {
    return (
      <div className="h-full">
        <DirectMessaging />
      </div>
    );
  }
  // Page paramètres client
  if (location === '/settings') {
    return (
      <div className="h-full">
        <SettingsClient />
      </div>
    );
  }
  // PAGE SUPPRIMÉE - Redondance avec la route dynamique principale - ROUTE SALON SUPPRIMÉE POUR ÉVITER CONFLIT
  // PAGE SUPPRIMÉE - Redondance avec la route dynamique principale - ROUTE SALON SUPPRIMÉE POUR ÉVITER CONFLIT
  // Tests système
  if (location === '/system-test') {
    return (
      <div className="h-full">
        <SettingsClient />
      </div>
    );
  }
  // Gestion des codes promotionnels


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
  // Page de paiement Stripe (supprimé - incompatible)
  // Page de paiement Stripe (supprimé - incompatible)
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
        <div className="p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Page non disponible</h2>
          <p className="text-gray-600">Cette fonctionnalité a été supprimée.</p>
        </div>
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
        <div className="p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Page non disponible</h2>
          <p className="text-gray-600">Cette fonctionnalité a été supprimée.</p>
        </div>
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
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-600 p-8 text-center">Réservation indisponible.</div>
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
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-600 p-8 text-center">Réservation indisponible.</div>
      </div>
    );
  }
  
  // Page de sélection des services supprimée - service déjà sélectionné à l'étape précédente

  // Page de paiement pour la réservation
  // BookingPayment supprimé - remplacé par BookingDateTime dans le flux
  
  // Page de sélection des professionnels
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
  // Page de confirmation de réservation
  if (location === '/booking-confirmation') {
    return (
      <div className="h-full">
        <BookingConfirmation />
      </div>
    );
  }
  // Page salon mobile moderne - Route spéciale "/salon" - SEULE ROUTE ACTIVE
  // Page salon mobile moderne - Route spéciale "/salon" - SEULE ROUTE ACTIVE
  // Page salon mobile moderne - Route spéciale "/salon"
  if (location === '/salon') {
    return (
      <div className="h-full">
        <TemplatePage />
      </div>
    );
  }

  // Pages personnalisées /salon-* désactivées (version fixe supprimée)
  // Pages de salon dynamiques (/salon/:slug) - APRÈS /salon
  if (location.startsWith('/salon/')) {
  	return (
		<div className="h-full">
			<TemplatePage />
		</div>
	);
  }
  // Page de réservation client en plein écran (sans navigation)
  if (location === '/quick-booking') {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-600 p-8 text-center">Réservation désactivée.</div>
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




  // Page IA en plein écran SANS menu navigation (comme dans l'image)
  // VÉRIFICATION D'AUTHENTIFICATION POUR TOUTES LES PAGES SUIVANTES
  // Si l'utilisateur n'est pas authentifié ET qu'il essaie d'accéder à une page protégée,
  // alors rediriger vers la page de connexion qu'il essaie d'accéder à une page protégée,
  // alors rediriger vers la page de connexion
  // Note: /planning est maintenant géré dans la section "Pages professionnelles avec sidebar persistant"
  // Note: /planning est maintenant géré dans la section "Pages professionnelles avec sidebar persistant"
  

  // Page Dashboard - PROTÉGÉE - Plein écran sans contraintes avec glassmorphism
  if (location === '/dashboard') {
    // Redirection vers login professionnel si pas authentifié
    if (!isAuthenticated && !isLoading) {
      window.location.href = '/pro-login';
      return null;
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <DashboardPro />
      </div>
    );
  }


  // Pages professionnelles PROTÉGÉES avec sidebar persistant
  const proPages = ['/planning', '/clients', '/clients-modern', '/services-management', '/client-analytics', '/business-features', '/ai'];
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
          {location === '/planning' && <Planning />}
          {(location === '/clients' || location === '/clients-modern') && <ClientManagement />}
          {location === '/services-management' && <ServicesManagement />}
          {location === '/client-analytics' && <IAClientAnalytics />}
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
          <ClientManagement />
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
          <Route path="/staff-management" component={() => <ProtectedRoute><StaffManagementModern /></ProtectedRoute>} />
          <Route path="/services-management" component={() => <ProtectedRoute><ServicesManagement /></ProtectedRoute>} />
          
          <Route path="/messaging-system" component={() => <ProtectedRoute><DirectMessaging /></ProtectedRoute>} />
          <Route path="/staff" component={() => <ProtectedRoute><StaffManagementModern /></ProtectedRoute>} />
          <Route path="/inventory" component={() => <ProtectedRoute><Inventory /></ProtectedRoute>} />
          <Route path="/booking-pages" component={() => <ProtectedRoute><BookingPages /></ProtectedRoute>} />
          <Route path="/ai-pro-complete" component={() => <ProtectedRoute><IAAvyento /></ProtectedRoute>} />
          {/* /salon-photos removed */}
          <Route path="/messaging-test" component={() => <ProtectedRoute><NotFoundPage /></ProtectedRoute>} />
          
          {/* ROUTES PROFESSIONNELLES PROTÉGÉES - SUITE */}
          {/* Route salon-page-editor supprimée */}
          {/* ROUTES CLIENTS - SEULES LES PAGES COMPTES PERSONNELS PROTÉGÉES */}
          <Route path="/avyento-account" component={() => <ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
          <Route path="/client-dashboard" component={() => <ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
          <Route path="/client-messaging" component={() => <ProtectedRoute><DirectMessaging /></ProtectedRoute>} />
          {/* ROUTES DE RÉSERVATION - PUBLIQUES */}
          <Route path="/original-booking" component={NotFoundPage} />
          <Route path="/booking-confirmation" component={BookingConfirmation} />
          <Route path="/salon-booking" component={NotFoundPage} />
          {/* QuickBooking supprimé */}
          <Route path="/book/:public_slug/reserver" component={NotFoundPage} />
          <Route path="/professional-selection" component={ProfessionalSelection} />
          {/* ROUTES PUBLIQUES - PAS DE PROTECTION */}
          <Route path="/support" component={Support} />
          <Route path="/contact" component={Contact} />
          <Route path="/centre-aide" component={CentreAide} />
          <Route path="/cgu" component={CGU} />
          <Route path="/confidentialite" component={Confidentialite} />
          <Route path="/stripe/success" component={StripeSuccess} />
          <Route path="/stripe/cancel" component={StripeCancel} />
          {/* Pages style Avyento - PUBLIQUES */}
          <Route path="/avyento-beauty-institute" component={() => <SearchResults />} />
          {/* CONNEXION PROFESSIONNELLE CLASSIQUE */}
          <Route path="/test-login" component={TestLogin} />
          {/* Page 404 spécifique */}
          <Route path="/404" component={NotFoundPage} />
          <Route path="/page-not-found" component={NotFoundPage} />
          {/* Routes Salons Template - Nouvelle génération standardisée */}
          <Route component={NotFoundPage} />
        </Switch>
      </main>
      {!hideBottomNavPages.includes(location) && !location.includes('404') && !location.includes('page-not-found') && <BottomNavigation />}
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