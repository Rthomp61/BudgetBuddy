import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import FutureExpenses from "@/pages/FutureExpenses";
import Settings from "@/pages/Settings";
import Profile from "@/pages/Profile";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function Router() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/future" component={FutureExpenses} />
          <Route path="/settings" component={Settings} />
          <Route path="/profile" component={Profile} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
