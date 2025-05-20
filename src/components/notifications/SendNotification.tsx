
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { addNotification } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { NotificationType, UserType } from "@/types";
import { Calendar, Clock, Upload, AlertCircle, Bell, Mail, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

export interface SendNotificationProps {
  onNotificationSent?: () => void;
}

export function SendNotification({ onNotificationSent }: SendNotificationProps) {
  const [recipient, setRecipient] = useState<string>("all");
  const [specificRecipient, setSpecificRecipient] = useState<string>("");
  const [notificationType, setNotificationType] = useState<NotificationType>("General Announcement");
  const [title, setTitle] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationMethod, setNotificationMethod] = useState<string>("all");
  const [scheduledDate, setScheduledDate] = useState<string>("");
  const [scheduledTime, setScheduledTime] = useState<string>("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<string>("recipients");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [includeEmailParams, setIncludeEmailParams] = useState({
    userId: false,
    userName: false,
    companyName: false,
    siteUrl: false,
    companyContact: false,
    companyLogo: false,
    unsubscribeLink: false
  });
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let user_type: UserType | undefined;
      let recipients: string | undefined;
      
      switch (recipient) {
        case "all":
          recipients = "all";
          break;
        case "workers":
          recipients = "workers";
          user_type = "worker";
          break;
        case "customers":
          recipients = "customers";
          user_type = "customer";
          break;
        case "specific":
          recipients = specificRecipient;
          break;
      }
      
      await addNotification({
        type: notificationType,
        title,
        message,
        read: false,
        user_type,
        recipients,
        method: notificationMethod,
        scheduled: scheduledDate && scheduledTime ? `${scheduledDate}T${scheduledTime}` : undefined,
      });
      
      toast({
        title: "Success",
        description: "Notification has been sent successfully"
      });
      
      // Reset form
      setTitle("");
      setMessage("");
      setAttachment(null);
      
      // Call callback if provided
      if (onNotificationSent) {
        onNotificationSent();
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleEmailParamChange = (param: keyof typeof includeEmailParams) => {
    setIncludeEmailParams(prev => ({
      ...prev,
      [param]: !prev[param]
    }));
  };

  const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad"];
  const statuses = ["Active", "Inactive", "Pending", "Suspended"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Notification</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="recipients" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recipients">Recipients</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recipients" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Send To <span className="text-red-500">*</span></Label>
              <Select
                value={recipient}
                onValueChange={setRecipient}
              >
                <SelectTrigger id="recipient">
                  <SelectValue placeholder="Select recipients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="workers">All Workers</SelectItem>
                  <SelectItem value="customers">All Customers</SelectItem>
                  <SelectItem value="specific">Specific User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {recipient === "specific" && (
              <div className="space-y-2">
                <Label htmlFor="specificRecipient">User ID/Email/Phone <span className="text-red-500">*</span></Label>
                <Input
                  id="specificRecipient"
                  placeholder="Enter user ID, email or phone"
                  value={specificRecipient}
                  onChange={(e) => setSpecificRecipient(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">Enter a specific user ID, email address or phone number</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Filter by City</Label>
                <Select
                  value={selectedCity}
                  onValueChange={setSelectedCity}
                >
                  <SelectTrigger id="city">
                    <SelectValue placeholder="All Cities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Cities</SelectItem>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Filter by Status</Label>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="content" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                placeholder="Enter notification title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Notification Type <span className="text-red-500">*</span></Label>
              <Select
                value={notificationType}
                onValueChange={(value) => setNotificationType(value as NotificationType)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General Announcement">General Announcement</SelectItem>
                  <SelectItem value="Special Offer">Special Offer</SelectItem>
                  <SelectItem value="New Booking">New Booking</SelectItem>
                  <SelectItem value="Booking Completed">Booking Completed</SelectItem>
                  <SelectItem value="Payment Received">Payment Received</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message <span className="text-red-500">*</span></Label>
              <Textarea
                id="message"
                placeholder="Enter your notification message here"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                required
              />
            </div>

            {notificationMethod === "email" && (
              <div className="space-y-2">
                <Label>Email Parameters</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="userId" 
                      checked={includeEmailParams.userId}
                      onCheckedChange={() => handleEmailParamChange('userId')}
                    />
                    <Label htmlFor="userId" className="text-sm font-normal">User id</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="userName" 
                      checked={includeEmailParams.userName}
                      onCheckedChange={() => handleEmailParamChange('userName')}
                    />
                    <Label htmlFor="userName" className="text-sm font-normal">User Name</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="companyName" 
                      checked={includeEmailParams.companyName}
                      onCheckedChange={() => handleEmailParamChange('companyName')}
                    />
                    <Label htmlFor="companyName" className="text-sm font-normal">Company Name</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="siteUrl" 
                      checked={includeEmailParams.siteUrl}
                      onCheckedChange={() => handleEmailParamChange('siteUrl')}
                    />
                    <Label htmlFor="siteUrl" className="text-sm font-normal">Site URL</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="companyContact" 
                      checked={includeEmailParams.companyContact}
                      onCheckedChange={() => handleEmailParamChange('companyContact')}
                    />
                    <Label htmlFor="companyContact" className="text-sm font-normal">Company Contact Info</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="companyLogo" 
                      checked={includeEmailParams.companyLogo}
                      onCheckedChange={() => handleEmailParamChange('companyLogo')}
                    />
                    <Label htmlFor="companyLogo" className="text-sm font-normal">Company Logo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="unsubscribeLink" 
                      checked={includeEmailParams.unsubscribeLink}
                      onCheckedChange={() => handleEmailParamChange('unsubscribeLink')}
                    />
                    <Label htmlFor="unsubscribeLink" className="text-sm font-normal">Unsubscribe Link</Label>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="attachment">Attachment</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  id="attachment"
                  onChange={handleAttachmentChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('attachment')?.click()}
                  className="w-full"
                >
                  <Upload size={18} className="mr-2" />
                  {attachment ? attachment.name : "Upload Attachment"}
                </Button>
                {attachment && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => setAttachment(null)}
                  >
                    &times;
                  </Button>
                )}
              </div>
              {attachment && (
                <p className="text-xs text-gray-500">{attachment.name} ({Math.round(attachment.size / 1024)} KB)</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="method">Notification Method <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div 
                  className={`p-3 border rounded-md cursor-pointer flex flex-col items-center ${notificationMethod === 'all' ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'}`}
                  onClick={() => setNotificationMethod('all')}
                >
                  <Bell size={24} className="mb-1" />
                  <span className="text-sm">All Methods</span>
                </div>
                <div 
                  className={`p-3 border rounded-md cursor-pointer flex flex-col items-center ${notificationMethod === 'in-app' ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'}`}
                  onClick={() => setNotificationMethod('in-app')}
                >
                  <Bell size={24} className="mb-1" />
                  <span className="text-sm">In-App</span>
                </div>
                <div 
                  className={`p-3 border rounded-md cursor-pointer flex flex-col items-center ${notificationMethod === 'email' ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'}`}
                  onClick={() => setNotificationMethod('email')}
                >
                  <Mail size={24} className="mb-1" />
                  <span className="text-sm">Email</span>
                </div>
                <div 
                  className={`p-3 border rounded-md cursor-pointer flex flex-col items-center ${notificationMethod === 'sms' ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'}`}
                  onClick={() => setNotificationMethod('sms')}
                >
                  <MessageSquare size={24} className="mb-1" />
                  <span className="text-sm">SMS</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="schedule">Schedule for later</Label>
                <Switch id="schedule" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="scheduleDate" className="text-xs">Date</Label>
                  <div className="flex items-center">
                    <Calendar size={16} className="absolute ml-3 pointer-events-none text-gray-500" />
                    <Input
                      id="scheduleDate"
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="scheduleTime" className="text-xs">Time</Label>
                  <div className="flex items-center">
                    <Clock size={16} className="absolute ml-3 pointer-events-none text-gray-500" />
                    <Input
                      id="scheduleTime"
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Send Test Notification</Label>
                <Button variant="outline" size="sm">
                  Send Test
                </Button>
              </div>
              <p className="text-xs text-gray-500">Send a test notification to verify how it will look</p>
            </div>
            
            <div className="border rounded-md p-3 bg-yellow-50 border-yellow-200 flex items-start gap-2">
              <AlertCircle size={18} className="text-yellow-500 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Important Note</p>
                <p>Scheduled notifications will be sent at the specified time if the server is running. Make sure your system is operational at the scheduled time.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-3 mt-6">
          <Button 
            variant="outline" 
            type="button" 
            onClick={() => {
              setTitle("");
              setMessage("");
              setAttachment(null);
              setRecipient("all");
              setSpecificRecipient("");
              setNotificationType("General Announcement");
              setNotificationMethod("all");
              setScheduledDate("");
              setScheduledTime("");
              setActiveTab("recipients");
            }}
          >
            Reset
          </Button>
          <Button 
            type="submit" 
            className="bg-primary" 
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? "Sending..." : "Send Notification"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
