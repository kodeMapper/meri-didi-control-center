
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
  User
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
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"
      )}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
      {badge ? (
        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white text-xs">
          {badge}
        </span>
      ) : null}
    </Link>
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
      label: "Pricing",
    },
    {
      to: "/bookings",
      icon: <Calendar size={20} />,
      label: "Bookings",
    },
    {
      to: "/customer-management",
      icon: <User size={20} />,
      label: "Customer Management",
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
      label: "Gallery",
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
        <span className="transform rotate-90 text-gray-500">Menu</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "h-screen bg-white z-40 transition-all duration-300 border-r",
        collapsed ? "w-16" : "w-64",
        isMobile ? "fixed left-0 top-0" : "sticky top-0"
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <div className={cn("flex items-center", collapsed ? "justify-center w-full" : "gap-2")}>
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold">
            M
          </div>
          {!collapsed && <span className="font-semibold text-xl">Admin Panel</span>}
        </div>
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="ml-auto h-8 w-8 rounded-md hover:bg-gray-100 flex items-center justify-center"
          >
            {collapsed ? "→" : "←"}
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
            badge={collapsed ? undefined : item.badge}
            isActive={location.pathname === item.to}
            onClick={isMobile ? toggleSidebar : undefined}
          />
        ))}
        <div className="mt-auto text-center text-xs text-gray-500 py-2">
          {!collapsed && <span>Version 1.0</span>}
        </div>
      </div>
    </div>
  );
}
