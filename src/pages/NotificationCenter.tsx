
import { useState, useEffect } from 'react';
import { Notification } from '@/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Check, CheckCheck, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { NotificationService } from '@/services/mockDatabase';
import { SendNotification } from '@/components/notifications/SendNotification';
import { Input } from '@/components/ui/input';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'send' | 'view'>('view');

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

  const handleNotificationSent = () => {
    // Refresh notifications after sending a new one
    const notifs = NotificationService.getAll();
    setNotifications(notifs);
    setViewMode('view');
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = notifications.filter(notification => 
    notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notification.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notification.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6 text-amber-500" />
          <h1 className="text-2xl font-bold">Notification Center</h1>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount} unread
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => setViewMode(viewMode === 'send' ? 'view' : 'send')} 
            variant={viewMode === 'send' ? "default" : "outline"}
          >
            {viewMode === 'send' ? 'View Notifications' : 'Send Notification'}
          </Button>
          
          {viewMode === 'view' && unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="outline">
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark All as Read
            </Button>
          )}
        </div>
      </div>

      {viewMode === 'send' ? (
        <div className="mb-8">
          <SendNotification onNotificationSent={handleNotificationSent} />
        </div>
      ) : (
        <>
          <Tabs defaultValue="all">
            <div className="flex justify-between mb-6">
              <TabsList>
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
                    <span className="ml-2 bg-amber-200 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <div className="relative">
                  <Input 
                    placeholder="Search notifications..." 
                    className="w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <TabsContent value="all" className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="mx-auto h-12 w-12 text-gray-300" />
                  {searchQuery ? (
                    <p className="mt-2 text-gray-500">No matching notifications found</p>
                  ) : (
                    <p className="mt-2 text-gray-500">No notifications to display</p>
                  )}
                </div>
              ) : (
                filteredNotifications.map((notification) => (
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
                filteredNotifications
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
        </>
      )}
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
      case 'Profile Activated':
        return 'bg-green-100 text-green-800';
      case 'Profile Deactivated':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getRecipientInfo = () => {
    if (notification.userType) {
      return `Recipient: ${notification.userType}${notification.userIdentifier ? ` #${notification.userIdentifier.substring(0, 8)}` : ''}`;
    }
    return '';
  };

  return (
    <Card className={`p-4 ${notification.read ? 'bg-white' : 'bg-amber-50'}`}>
      <div className="flex justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded ${getTypeColor(notification.type)}`}>
              {notification.type}
            </span>
            {!notification.read && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
          </div>
          <h3 className="font-medium mt-2">{notification.title || notification.type}</h3>
          <p className="text-gray-600 mt-1">{notification.message}</p>
          <div className="flex items-center text-xs text-gray-400 mt-2 space-x-2">
            <p>{formatDate(notification.createdAt)}</p>
            {getRecipientInfo() && (
              <>
                <span>•</span>
                <p>{getRecipientInfo()}</p>
              </>
            )}
          </div>
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
