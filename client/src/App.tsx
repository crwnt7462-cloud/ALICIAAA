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

import AIAutomation from "@/pages/AIAutomation";
import NotificationTest from "@/pages/NotificationTest";
import ClientBooking from "@/pages/ClientBooking";
import ShareBooking from "@/pages/ShareBooking";
import BookingTest from "@/pages/BookingTest";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();
  
  // Page publique pour réservation client (sans header/nav)
  if (location.startsWith('/book/')) {
    return (
      <div className="h-full">
        <ClientBooking />
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
        <SearchResults />
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
          <Route path="/planning" component={Planning} />
          <Route path="/clients" component={Clients} />
          <Route path="/booking" component={Booking} />
          <Route path="/ai" component={AIAutomation} />
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
      <ThemeProvider>
        <TooltipProvider>
          <div className="h-full animated-bg">
            <Toaster />
            <Router />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
