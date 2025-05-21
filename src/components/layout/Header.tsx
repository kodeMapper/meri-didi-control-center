
import { useState } from "react";
import { Bell, RefreshCw, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NotificationService } from "@/services/mockDatabase";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function Header() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const unreadNotifications = NotificationService.getUnread().length;
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRefresh = () => {
    // In a real app this would refresh data from the server
    toast({
      title: "Refreshed",
      description: "Data has been refreshed",
    });
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Search initiated",
        description: `Searching for "${searchQuery}"`,
      });
      // In a real app, this would trigger a search action
      // For now just clear the search
      setSearchQuery("");
    }
  };

  return (
    <header className="h-16 border-b bg-white flex items-center px-4 sticky top-0 z-30 w-full">
      <div className="flex items-center flex-1">
        <form
          className={cn(
            "transition-all duration-200 ease-in-out",
            isSearching ? "w-full md:w-[400px]" : "w-full md:w-[280px]"
          )}
          onSubmit={handleSearch}
        >
          <div className="relative">
            <Search 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" 
            />
            <Input
              placeholder="Search..."
              className="pl-10 pr-4 py-2 h-10 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearching(true)}
              onBlur={() => setIsSearching(false)}
            />
          </div>
        </form>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={handleRefresh}
        >
          <RefreshCw size={20} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full relative"
          onClick={() => navigate("/notifications")}
        >
          <Bell size={20} />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive flex items-center justify-center text-white text-xs">
              {unreadNotifications}
            </span>
          )}
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full" 
          onClick={() => navigate("/settings")}
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-yellow-100 text-yellow-800">
              A
            </AvatarFallback>
          </Avatar>
        </Button>
        <span className="font-medium text-sm hidden md:block">Admin</span>
      </div>
    </header>
  );
}
