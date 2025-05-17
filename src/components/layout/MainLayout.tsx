
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useIsMobile } from "@/hooks/use-mobile";

export function MainLayout() {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex w-full">
      <Sidebar />
      <div className={`flex-1 flex flex-col ${isMobile ? 'ml-12' : ''}`}>
        <Header />
        <main className="flex-1 bg-gray-50 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
