
import { useState, useEffect } from 'react';
import { Notification } from '@/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { NotificationService } from '@/services/mockDatabase';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load notifications
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const notifs = NotificationService.getAll();
        setNotifications(notifs);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAllAsRead = () => {
    NotificationService.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleMarkAsRead = (id: string) => {
    NotificationService.markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notification Center</h1>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead} variant="outline">
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark All as Read
          </Button>
        )}
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">
            All
            {notifications.length > 0 && (
              <span className="ml-2 bg-gray-200 text-gray-800 text-xs px-2 py-0.5 rounded-full">
                {notifications.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            {unreadCount > 0 && (
              <span className="ml-2 bg-yellow-200 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2 text-gray-500">No notifications to display</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={() => handleMarkAsRead(notification.id)}
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="unread" className="space-y-4">
          {unreadCount === 0 ? (
            <div className="text-center py-12">
              <Check className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2 text-gray-500">No unread notifications</p>
            </div>
          ) : (
            notifications
              .filter(notification => !notification.read)
              .map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={() => handleMarkAsRead(notification.id)}
                />
              ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: () => void;
}

function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'New Worker Application':
        return 'bg-blue-100 text-blue-800';
      case 'Worker Verified':
        return 'bg-green-100 text-green-800';
      case 'New Booking':
        return 'bg-purple-100 text-purple-800';
      case 'Booking Completed':
        return 'bg-yellow-100 text-yellow-800';
      case 'Payment Received':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className={`p-4 ${notification.read ? 'bg-white' : 'bg-yellow-50'}`}>
      <div className="flex justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded ${getTypeColor(notification.type)}`}>
              {notification.type}
            </span>
            {!notification.read && <span className="w-2 h-2 rounded-full bg-yellow-500"></span>}
          </div>
          <h3 className="font-medium mt-2">{notification.title || notification.type}</h3>
          <p className="text-gray-600 mt-1">{notification.message}</p>
          <p className="text-xs text-gray-400 mt-2">{formatDate(notification.createdAt)}</p>
        </div>
        
        {!notification.read && (
          <Button variant="ghost" size="sm" onClick={onMarkAsRead} className="shrink-0">
            <Check className="mr-2 h-4 w-4" />
            Mark as Read
          </Button>
        )}
      </div>
    </Card>
  );
}
