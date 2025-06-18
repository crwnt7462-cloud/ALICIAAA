import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Planning from "@/pages/Planning";
import Clients from "@/pages/Clients";
import Booking from "@/pages/Booking";

import AIAutomation from "@/pages/AIAutomation";
import NotFound from "@/pages/not-found";

function Router() {
  // Bypass authentication completely - go directly to main app
  return (
    <div className="h-full flex flex-col max-w-md mx-auto bg-white shadow-sm">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/planning" component={Planning} />
          <Route path="/clients" component={Clients} />
          <Route path="/booking" component={Booking} />
          <Route path="/ai" component={AIAutomation} />

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
          <div className="h-full bg-gray-50 dark:bg-dark-900">
            <Toaster />
            <Router />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
