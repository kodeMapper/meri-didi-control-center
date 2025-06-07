
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useIsMobile } from "@/hooks/use-mobile";
import { WorkerIdMappingDebugTool } from "@/components/debug/WorkerIdMappingDebugTool";
import { WorkerAPI } from "@/services/api-service";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function MainLayout() {
  const isMobile = useIsMobile();
  const [isApiOffline, setIsApiOffline] = useState(false);
  
  // Check API connectivity on mount
  useEffect(() => {
    const checkApiStatus = async () => {
      const isConnected = await WorkerAPI.testConnection();
      const wasOffline = isApiOffline;
      setIsApiOffline(!isConnected);
      
      // If we were offline and now we're back online, sync pending changes
      if (wasOffline && isConnected) {
        console.log("API is back online. Syncing pending changes...");
        try {
          const result = await WorkerAPI.syncPendingWorkerChanges();
          if (result.success > 0) {
            console.log(`Successfully synced ${result.success} pending worker changes`);
            // Force a refresh of worker mappings
            await WorkerAPI.syncWorkerMappings();
          }
          if (result.failed > 0) {
            console.warn(`Failed to sync ${result.failed} pending worker changes. They'll be retried later.`);
          }
        } catch (syncError) {
          console.error("Error syncing pending changes:", syncError);
        }
      }
    };
    
    checkApiStatus();
    
    // Also check API status every 60 seconds
    const interval = setInterval(checkApiStatus, 60000);
    
    return () => clearInterval(interval);
  }, [isApiOffline]);
  
  return (
    <div className="min-h-screen flex w-full bg-[#FEF7CD]/10">
      <Sidebar />
      <div className={`flex-1 flex flex-col ${isMobile ? 'ml-12' : ''}`}>
        <Header />
        {isApiOffline && (
          <Alert variant="destructive" className="mx-4 mt-4 mb-0">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>API Connection Issue</AlertTitle>
            <AlertDescription>
              The backend API is currently unavailable. Some features may not work properly.
              Worker status changes and profile updates will be stored locally and synchronized when the API is back online.
            </AlertDescription>
          </Alert>
        )}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
          {/* Add debug tool in the corner of the screen */}
          <div className="fixed bottom-4 right-4 z-50">
            <WorkerIdMappingDebugTool />
          </div>
        </main>
      </div>
    </div>
  );
}
