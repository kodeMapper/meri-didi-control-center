
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import WorkerManagement from "./pages/WorkerManagement";
import Bookings from "./pages/Bookings";
import PricingManagement from "./pages/PricingManagement";
import NotificationCenter from "./pages/NotificationCenter";
import Settings from "./pages/Settings";
import WorkerRegistration from "./pages/WorkerRegistration";
import WorkerProfilePage from "./pages/WorkerProfilePage";
import CompletedServices from "./pages/CompletedServices";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/worker-management" element={<WorkerManagement />} />
            <Route path="/pricing" element={<PricingManagement />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/completed-services" element={<CompletedServices />} />
            <Route path="/notifications" element={<NotificationCenter />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/worker-registration" element={<WorkerRegistration />} />
            <Route path="/worker-profile/:id" element={<WorkerProfilePage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
