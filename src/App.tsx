
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { MainLayout } from "./components/layout/MainLayout";
import { WorkerAPI } from "./services/api-service";
import Dashboard from "./pages/Dashboard";
import WorkerManagement from "./pages/WorkerManagement";
import Bookings from "./pages/Bookings";
import PricingManagement from "./pages/PricingManagement";
import NotificationCenter from "./pages/NotificationCenter";
import Settings from "./pages/Settings";
import WorkerRegistration from "./pages/WorkerRegistration";
import WorkerProfilePage from "./pages/WorkerProfilePage";
import EditWorkerPage from "./pages/EditWorkerPage";
import CompletedServices from "./pages/CompletedServices";
import NotFound from "./pages/NotFound";
import SliderManagement from "./pages/SliderManagement";
import PromoCodes from "./pages/PromoCodes";
import CustomerManagement from "./pages/CustomerManagement";
import Subscriptions from "./pages/Subscriptions";
import Gallery from "./pages/Gallery";
import FAQManagement from "./pages/FAQManagement";
import SystemSettings from "./pages/SystemSettings";

const queryClient = new QueryClient();

// Initialize worker ID mappings when the app loads
const initializeWorkerMappings = async () => {
  console.log("Initializing worker ID mappings...");
  try {
    await WorkerAPI.syncWorkerMappings();
    console.log("Worker ID mappings initialized successfully");
  } catch (error) {
    console.error("Failed to initialize worker ID mappings:", error);
  }
};

// Call the initialization function
initializeWorkerMappings();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ProtectedRoute>
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
                <Route path="/edit-worker/:id" element={<EditWorkerPage />} />
                <Route path="/slider-management" element={<SliderManagement />} />
                <Route path="/promo-codes" element={<PromoCodes />} />
                <Route path="/customer-management" element={<CustomerManagement />} />
                <Route path="/subscriptions" element={<Subscriptions />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/faq-management" element={<FAQManagement />} />
                <Route path="/system-settings" element={<SystemSettings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ProtectedRoute>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
