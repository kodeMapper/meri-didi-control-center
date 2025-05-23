
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Bell, 
  Settings,
  FileText,
  ImageIcon,
  Ticket,
  CreditCard,
  HelpCircle,
  SlidersHorizontal,
  User,
  Book
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { NotificationService } from "@/services/mockDatabase";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  isActive: boolean;
  onClick?: () => void;
}

const NavItem = ({ to, icon, label, badge, isActive, onClick }: NavItemProps) => {
  const showLabel = label !== "";
  
  return (
    <div className="relative group">
      <Link
        to={to}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors sidebar-item",
          isActive ? "bg-yellow-500 text-black" : "hover:bg-yellow-500/10",
          !showLabel && "justify-center"
        )}
        onClick={onClick}
      >
        <div className={cn("sidebar-icon", !showLabel && "flex justify-center items-center")}>
          {icon}
        </div>
        {showLabel && <span>{label}</span>}
        {badge && showLabel ? (
          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs">
            {badge}
          </span>
        ) : badge && !showLabel ? (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs">
            {badge}
          </span>
        ) : null}
      </Link>
      {!showLabel && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-50 whitespace-nowrap sidebar-tooltip">
          {label}
          {badge ? ` (${badge})` : ""}
        </div>
      )}
    </div>
  );
};

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const unreadNotifications = NotificationService.getUnread().length;

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const navItems = [
    {
      to: "/",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
    },
    {
      to: "/worker-management",
      icon: <Users size={20} />,
      label: "Worker Management",
    },
    {
      to: "/pricing",
      icon: <FileText size={20} />,
      label: "Service Pricing",
    },
    {
      to: "/bookings",
      icon: <Calendar size={20} />,
      label: "Bookings",
    },
    {
      to: "/customer-management",
      icon: <User size={20} />,
      label: "Customers",
    },
    {
      to: "/slider-management",
      icon: <SlidersHorizontal size={20} />,
      label: "Sliders",
    },
    {
      to: "/promo-codes",
      icon: <Ticket size={20} />,
      label: "Promo Codes",
    },
    {
      to: "/subscriptions",
      icon: <CreditCard size={20} />,
      label: "Subscriptions",
    },
    {
      to: "/gallery",
      icon: <ImageIcon size={20} />,
      label: "Gallery & Testimonials",
    },
    {
      to: "/faq-management",
      icon: <HelpCircle size={20} />,
      label: "FAQ Management",
    },
    {
      to: "/notifications",
      icon: <Bell size={20} />,
      label: "Notifications",
      badge: unreadNotifications,
    },
    {
      to: "/settings",
      icon: <Settings size={20} />,
      label: "Settings",
    },
  ];

  if (isMobile && collapsed) {
    return (
      <div
        className="fixed left-0 top-0 z-40 h-screen w-12 bg-white shadow-md cursor-pointer flex items-center justify-center"
        onClick={toggleSidebar}
      >
        <div className="bg-yellow-500 rounded-full p-2 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "h-screen bg-white z-40 transition-all duration-300 border-r",
        collapsed ? "w-16 shadow-md" : "w-64",
        isMobile ? "fixed left-0 top-0" : "sticky top-0"
      )}
      style={{
        backgroundImage: collapsed ? "radial-gradient(#fef3c7 1px, transparent 1px)" : "none",
        backgroundSize: "20px 20px"
      }}
    >
      <div className="flex h-16 items-center border-b px-4 shadow-sm">
        <Link to="/" className={cn("flex items-center", collapsed ? "justify-center w-full" : "gap-2")}>
          <div className="h-9 w-9 rounded-md bg-yellow-500 flex items-center justify-center text-black font-bold shadow-sm transition-transform hover:scale-105">
            MD
          </div>
          {!collapsed && (
            <span className="font-semibold text-xl bg-gradient-to-r from-yellow-600 to-yellow-400 text-transparent bg-clip-text">
              Meri Didi
            </span>
          )}
        </Link>
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="ml-auto h-8 w-8 rounded-md hover:bg-yellow-100 flex items-center justify-center transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="13 17 18 12 13 7"></polyline>
                <polyline points="6 17 11 12 6 7"></polyline>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="11 17 6 12 11 7"></polyline>
                <polyline points="18 17 13 12 18 7"></polyline>
              </svg>
            )}
          </button>
        )}
      </div>
      <div className="overflow-y-auto h-[calc(100vh-64px)] p-3 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={collapsed ? "" : item.label}
            badge={item.badge}
            isActive={location.pathname === item.to}
            onClick={isMobile ? toggleSidebar : undefined}
          />
        ))}
        <div className={cn("mt-auto text-center text-xs text-gray-500 py-2", 
                          collapsed && "flex justify-center items-center")}>
          {!collapsed ? (
            <span>Version 1.0</span>
          ) : (
            <span className="px-2 py-1 bg-yellow-100 rounded-full text-yellow-800">1.0</span>
          )}
        </div>
      </div>
    </div>
  );
}
