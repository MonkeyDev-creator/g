import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import Home from "@/pages/Home";
import Order from "@/pages/Order";
import Tracking from "@/pages/Tracking";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/not-found";
import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

function MaintenanceView() {
  return (
    <div className="min-h-screen bg-[#0a0c10] flex flex-col items-center justify-center p-4 text-center">
      <div className="p-6 bg-primary/10 rounded-full mb-8 border border-primary/20">
        <AlertTriangle className="w-16 h-16 text-primary" />
      </div>
      <h1 className="text-5xl font-black text-white mb-4 uppercase italic tracking-tighter">Under Maintenance</h1>
      <p className="text-zinc-500 max-w-md font-medium leading-relaxed">
        Monkey Studio is currently undergoing scheduled upgrades. We'll be back online shortly. 
        Thank you for your patience!
      </p>
    </div>
  );
}

function Router() {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check maintenance status
    fetch("/api/admin/maintenance")
      .then(res => res.json())
      .then(data => setIsMaintenance(data.enabled));
    
    // Check if user is admin
    fetch("/api/admin/me")
      .then(res => {
        if (res.ok) setIsAdmin(true);
      });
  }, []);

  if (isMaintenance && !isAdmin) {
    return <MaintenanceView />;
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/order" component={Order} />
      <Route path="/tracking" component={Tracking} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-[#0a0c10] font-sans antialiased selection:bg-primary selection:text-primary-foreground">
          <Navbar />
          <Router />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
