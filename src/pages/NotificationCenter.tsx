
import { useState, useEffect } from "react";
import { Notification } from "@/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Bell, CalendarCheck, CheckCircle, Clock, User } from "lucide-react";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function NotificationCenter() {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch notifications from Supabase
  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const data = await getNotifications();
      return data;
    }
  });

  // Calculate unread count whenever notifications change
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  // Mark notification as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      return await markNotificationAsRead(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
      console.error("Error marking notification as read:", error);
    }
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      return await markAllNotificationsAsRead();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "All Notifications Marked as Read",
        description: "All notifications have been marked as read.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      });
      console.error("Error marking all notifications as read:", error);
    }
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "Worker Verified":
        return <User className="text-green-500" />;
      case "New Booking":
        return <Bell className="text-primary" />;
      case "Booking Completed":
        return <CheckCircle className="text-blue-500" />;
      case "New Worker Application":
        return <User className="text-primary" />;
      case "Payment Received":
        return <CalendarCheck className="text-green-500" />;
      case "Booking Cancelled":
        return <Bell className="text-red-500" />;
      default:
        return <Bell className="text-gray-500" />;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
    } else if (diffHours < 24) {
      return `about ${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    } else {
      return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const allNotifications = notifications;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bell className="text-primary" size={22} />
          <h1 className="text-2xl font-bold">Notification Center</h1>
          {unreadCount > 0 && (
            <span className="bg-destructive text-white text-xs px-2 py-0.5 rounded-full">
              {unreadCount} unread
            </span>
          )}
        </div>
        <Button 
          variant="outline" 
          onClick={handleMarkAllAsRead}
          disabled={unreadCount === 0 || markAllAsReadMutation.isPending}
        >
          {markAllAsReadMutation.isPending ? "Marking..." : "Mark All as Read"}
        </Button>
      </div>

      <Tabs defaultValue="unread" className="space-y-4">
        <TabsList className="grid w-full max-w-xs grid-cols-2">
          <TabsTrigger value="unread" className="relative">
            Unread
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-xs text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="all">All Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="unread" className="space-y-4">
          {unreadNotifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
              No unread notifications
            </div>
          ) : (
            unreadNotifications.map(notification => (
              <div 
                key={notification.id} 
                className="bg-white rounded-lg shadow-sm p-4 flex border-l-4 border-primary cursor-pointer hover:bg-gray-50"
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{notification.type}</h3>
                  <p className="text-gray-600">{notification.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock size={14} className="text-gray-400" />
                    <span className="text-xs text-gray-400">
                      {getTimeAgo(notification.createdAt)}
                    </span>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="self-start"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsRead(notification.id);
                  }}
                  disabled={markAsReadMutation.isPending}
                >
                  <CheckCircle size={16} />
                </Button>
              </div>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4">
          {allNotifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
              No notifications
            </div>
          ) : (
            allNotifications.map(notification => (
              <div 
                key={notification.id} 
                className={`bg-white rounded-lg shadow-sm p-4 flex ${notification.read ? 'border-l' : 'border-l-4 border-primary'} hover:bg-gray-50`}
                onClick={() => !notification.read && handleMarkAsRead(notification.id)}
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{notification.type}</h3>
                  <p className="text-gray-600">{notification.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock size={14} className="text-gray-400" />
                    <span className="text-xs text-gray-400">
                      {getTimeAgo(notification.createdAt)}
                    </span>
                  </div>
                </div>
                {!notification.read && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="self-start"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(notification.id);
                    }}
                    disabled={markAsReadMutation.isPending}
                  >
                    <CheckCircle size={16} />
                  </Button>
                )}
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default NotificationCenter;
