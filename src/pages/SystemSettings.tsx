
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  BookOpen, 
  CreditCard, 
  Globe, 
  Lock, 
  Mail, 
  MessageSquare, 
  PanelLeft, 
  Save, 
  Server, 
  Settings, 
  Upload
} from "lucide-react";
import { UserType } from "@/types";

interface SettingsSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function SettingsSection({ title, description, icon, children }: SettingsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {icon}
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

interface SettingsItemProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingsItem({ title, description, children }: SettingsItemProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 py-4 border-b">
      <div className="md:w-1/3">
        <Label className="text-base font-medium">{title}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="md:w-2/3">{children}</div>
    </div>
  );
}

export default function SystemSettings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  // Form state for various settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Service Provider Dashboard",
    siteDescription: "Manage your service providers, workers, and bookings",
    logoUrl: "/placeholder.svg",
    faviconUrl: "/favicon.ico",
    primaryColor: "#9b87f5",
    secondaryColor: "#7E69AB",
    defaultLanguage: "en",
    timezone: "Asia/Kolkata",
    maintenanceMode: false,
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    adminEmail: "admin@example.com",
    customerNotifications: {
      newBooking: true,
      bookingConfirmation: true,
      bookingCancellation: true,
      bookingReminder: true,
      paymentReceived: true,
      promotionalEmails: false,
    },
    workerNotifications: {
      newAssignment: true,
      assignmentCancellation: true,
      reminderBeforeService: true,
      promotionalEmails: false,
    },
  });
  
  const [bookingSettings, setBookingSettings] = useState({
    advanceBookingDays: 30,
    minAdvanceBookingHours: 3,
    allowSameDayBooking: true,
    allowCancellation: true,
    cancellationWindow: 24,
    defaultServiceDuration: 60,
    timeSlotInterval: 30,
    workingHourStart: "08:00",
    workingHourEnd: "20:00",
    workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
  });
  
  const [paymentSettings, setPaymentSettings] = useState({
    currency: "INR",
    currencySymbol: "₹",
    enableOnlinePayments: true,
    enableCashPayments: true,
    paymentGateways: {
      stripe: true,
      paypal: false,
      razorpay: true,
    },
    taxRate: 18,
    invoicePrefix: "INV-",
  });
  
  const [apiSettings, setApiSettings] = useState({
    googleMapsApiKey: "",
    smsApiKey: "",
    emailServiceApiKey: "",
    enableApiAccess: false,
    ipWhitelist: "",
  });

  const handleSaveSettings = () => {
    // In a real application, this would save to the database
    toast({
      title: "Settings Saved",
      description: "Your settings have been successfully updated",
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle file upload logic
    const files = e.target.files;
    if (files && files.length > 0) {
      // In a real app, this would upload to a server/storage
      toast({
        title: "File Selected",
        description: `File "${files[0].name}" has been selected. In a production environment, this would be uploaded.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">System Settings</h1>
        <Button onClick={handleSaveSettings}>
          <Save size={16} className="mr-2" />
          Save Changes
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b">
          <div className="flex overflow-x-auto">
            <TabsList className="inline-flex h-10 bg-transparent p-0">
              <TabsTrigger 
                value="general" 
                className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
              >
                General
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
              >
                Notifications
              </TabsTrigger>
              <TabsTrigger 
                value="bookings" 
                className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
              >
                Bookings
              </TabsTrigger>
              <TabsTrigger 
                value="payments" 
                className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
              >
                Payments
              </TabsTrigger>
              <TabsTrigger 
                value="integrations" 
                className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
              >
                Integrations & API
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
              >
                Security
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure the basic settings for your application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SettingsSection
                title="Site Information"
                description="Basic information about your website"
                icon={<Globe className="h-5 w-5 text-primary" />}
              >
                <SettingsItem
                  title="Site Name"
                  description="The name of your website"
                >
                  <Input 
                    value={generalSettings.siteName} 
                    onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                  />
                </SettingsItem>
                
                <SettingsItem
                  title="Site Description"
                  description="A brief description of your service"
                >
                  <Textarea 
                    value={generalSettings.siteDescription} 
                    onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
                    rows={3}
                  />
                </SettingsItem>
                
                <SettingsItem
                  title="Logo"
                  description="Upload your company logo"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded overflow-hidden border">
                      <img 
                        src={generalSettings.logoUrl} 
                        alt="Logo" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <Button variant="outline" onClick={() => document.getElementById('logo-upload')?.click()}>
                        <Upload size={16} className="mr-2" />
                        Upload Logo
                      </Button>
                      <Input 
                        id="logo-upload" 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleLogoUpload}
                      />
                    </div>
                  </div>
                </SettingsItem>
                
                <SettingsItem
                  title="Favicon"
                  description="Upload your site favicon"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded overflow-hidden border">
                      <img 
                        src={generalSettings.faviconUrl} 
                        alt="Favicon" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <Button variant="outline" onClick={() => document.getElementById('favicon-upload')?.click()}>
                        <Upload size={16} className="mr-2" />
                        Upload Favicon
                      </Button>
                      <Input 
                        id="favicon-upload" 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleLogoUpload}
                      />
                    </div>
                  </div>
                </SettingsItem>
              </SettingsSection>
              
              <Separator />
              
              <SettingsSection
                title="Appearance"
                description="Customize the look and feel of your application"
                icon={<PanelLeft className="h-5 w-5 text-primary" />}
              >
                <SettingsItem
                  title="Primary Color"
                  description="Main color used throughout the application"
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="h-8 w-8 rounded-full border" 
                      style={{backgroundColor: generalSettings.primaryColor}}
                    />
                    <Input 
                      type="color" 
                      value={generalSettings.primaryColor} 
                      onChange={(e) => setGeneralSettings({...generalSettings, primaryColor: e.target.value})}
                      className="w-16 h-8 p-1"
                    />
                    <Input 
                      value={generalSettings.primaryColor} 
                      onChange={(e) => setGeneralSettings({...generalSettings, primaryColor: e.target.value})}
                      className="w-32"
                    />
                  </div>
                </SettingsItem>
                
                <SettingsItem
                  title="Secondary Color"
                  description="Secondary accent color"
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="h-8 w-8 rounded-full border" 
                      style={{backgroundColor: generalSettings.secondaryColor}}
                    />
                    <Input 
                      type="color" 
                      value={generalSettings.secondaryColor} 
                      onChange={(e) => setGeneralSettings({...generalSettings, secondaryColor: e.target.value})}
                      className="w-16 h-8 p-1"
                    />
                    <Input 
                      value={generalSettings.secondaryColor} 
                      onChange={(e) => setGeneralSettings({...generalSettings, secondaryColor: e.target.value})}
                      className="w-32"
                    />
                  </div>
                </SettingsItem>
              </SettingsSection>
              
              <Separator />
              
              <SettingsSection
                title="Regional Settings"
                description="Language and time settings"
                icon={<Settings className="h-5 w-5 text-primary" />}
              >
                <SettingsItem
                  title="Default Language"
                  description="Primary language for your application"
                >
                  <Select 
                    value={generalSettings.defaultLanguage} 
                    onValueChange={(value) => setGeneralSettings({...generalSettings, defaultLanguage: value})}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="mr">Marathi</SelectItem>
                      <SelectItem value="gu">Gujarati</SelectItem>
                      <SelectItem value="bn">Bengali</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingsItem>
                
                <SettingsItem
                  title="Timezone"
                  description="Default timezone for your application"
                >
                  <Select 
                    value={generalSettings.timezone} 
                    onValueChange={(value) => setGeneralSettings({...generalSettings, timezone: value})}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">India (GMT+5:30)</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time (GMT-4)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (GMT-5)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (GMT-6)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (GMT-7)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingsItem>
              </SettingsSection>
              
              <Separator />
              
              <SettingsSection
                title="Maintenance"
                description="Site availability settings"
                icon={<Server className="h-5 w-5 text-primary" />}
              >
                <SettingsItem
                  title="Maintenance Mode"
                  description="Enable when performing updates or maintenance"
                >
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={generalSettings.maintenanceMode} 
                      onCheckedChange={(checked) => setGeneralSettings({...generalSettings, maintenanceMode: checked})}
                      id="maintenance-mode"
                    />
                    <Label htmlFor="maintenance-mode">
                      {generalSettings.maintenanceMode ? "Enabled" : "Disabled"}
                    </Label>
                  </div>
                </SettingsItem>
              </SettingsSection>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how and when notifications are sent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SettingsSection
                title="Notification Channels"
                description="Enable or disable different notification methods"
                icon={<Mail className="h-5 w-5 text-primary" />}
              >
                <SettingsItem
                  title="Email Notifications"
                  description="Send notifications via email"
                >
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={notificationSettings.emailNotifications} 
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                      id="email-notifications"
                    />
                    <Label htmlFor="email-notifications">
                      {notificationSettings.emailNotifications ? "Enabled" : "Disabled"}
                    </Label>
                  </div>
                </SettingsItem>
                
                <SettingsItem
                  title="SMS Notifications"
                  description="Send notifications via SMS"
                >
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={notificationSettings.smsNotifications} 
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, smsNotifications: checked})}
                      id="sms-notifications"
                    />
                    <Label htmlFor="sms-notifications">
                      {notificationSettings.smsNotifications ? "Enabled" : "Disabled"}
                    </Label>
                  </div>
                </SettingsItem>
                
                <SettingsItem
                  title="Push Notifications"
                  description="Send in-app push notifications"
                >
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={notificationSettings.pushNotifications} 
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, pushNotifications: checked})}
                      id="push-notifications"
                    />
                    <Label htmlFor="push-notifications">
                      {notificationSettings.pushNotifications ? "Enabled" : "Disabled"}
                    </Label>
                  </div>
                </SettingsItem>
                
                <SettingsItem
                  title="Admin Email"
                  description="Email address for receiving administrative notifications"
                >
                  <Input 
                    value={notificationSettings.adminEmail} 
                    onChange={(e) => setNotificationSettings({...notificationSettings, adminEmail: e.target.value})}
                  />
                </SettingsItem>
              </SettingsSection>
              
              <Separator />
              
              <SettingsSection
                title="Customer Notifications"
                description="Notification preferences for customers"
                icon={<MessageSquare className="h-5 w-5 text-primary" />}
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="new-booking" 
                      checked={notificationSettings.customerNotifications.newBooking}
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings, 
                        customerNotifications: {
                          ...notificationSettings.customerNotifications,
                          newBooking: !!checked
                        }
                      })}
                    />
                    <Label htmlFor="new-booking">New Booking Confirmation</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="booking-confirmation" 
                      checked={notificationSettings.customerNotifications.bookingConfirmation}
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings, 
                        customerNotifications: {
                          ...notificationSettings.customerNotifications,
                          bookingConfirmation: !!checked
                        }
                      })}
                    />
                    <Label htmlFor="booking-confirmation">Booking Confirmation</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="booking-cancellation" 
                      checked={notificationSettings.customerNotifications.bookingCancellation}
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings, 
                        customerNotifications: {
                          ...notificationSettings.customerNotifications,
                          bookingCancellation: !!checked
                        }
                      })}
                    />
                    <Label htmlFor="booking-cancellation">Booking Cancellation</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="booking-reminder" 
                      checked={notificationSettings.customerNotifications.bookingReminder}
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings, 
                        customerNotifications: {
                          ...notificationSettings.customerNotifications,
                          bookingReminder: !!checked
                        }
                      })}
                    />
                    <Label htmlFor="booking-reminder">Booking Reminder</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="payment-received" 
                      checked={notificationSettings.customerNotifications.paymentReceived}
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings, 
                        customerNotifications: {
                          ...notificationSettings.customerNotifications,
                          paymentReceived: !!checked
                        }
                      })}
                    />
                    <Label htmlFor="payment-received">Payment Received</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="promotional-emails" 
                      checked={notificationSettings.customerNotifications.promotionalEmails}
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings, 
                        customerNotifications: {
                          ...notificationSettings.customerNotifications,
                          promotionalEmails: !!checked
                        }
                      })}
                    />
                    <Label htmlFor="promotional-emails">Promotional Emails</Label>
                  </div>
                </div>
              </SettingsSection>
              
              <Separator />
              
              <SettingsSection
                title="Worker Notifications"
                description="Notification preferences for service providers"
                icon={<MessageSquare className="h-5 w-5 text-primary" />}
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="new-assignment" 
                      checked={notificationSettings.workerNotifications.newAssignment}
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings, 
                        workerNotifications: {
                          ...notificationSettings.workerNotifications,
                          newAssignment: !!checked
                        }
                      })}
                    />
                    <Label htmlFor="new-assignment">New Service Assignment</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="assignment-cancellation" 
                      checked={notificationSettings.workerNotifications.assignmentCancellation}
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings, 
                        workerNotifications: {
                          ...notificationSettings.workerNotifications,
                          assignmentCancellation: !!checked
                        }
                      })}
                    />
                    <Label htmlFor="assignment-cancellation">Assignment Cancellation</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="reminder-before-service" 
                      checked={notificationSettings.workerNotifications.reminderBeforeService}
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings, 
                        workerNotifications: {
                          ...notificationSettings.workerNotifications,
                          reminderBeforeService: !!checked
                        }
                      })}
                    />
                    <Label htmlFor="reminder-before-service">Reminder Before Service</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="worker-promotional-emails" 
                      checked={notificationSettings.workerNotifications.promotionalEmails}
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings, 
                        workerNotifications: {
                          ...notificationSettings.workerNotifications,
                          promotionalEmails: !!checked
                        }
                      })}
                    />
                    <Label htmlFor="worker-promotional-emails">Promotional Emails</Label>
                  </div>
                </div>
              </SettingsSection>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Settings</CardTitle>
              <CardDescription>Configure how bookings are handled in your system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SettingsSection
                title="Booking Rules"
                description="Set constraints for booking creation"
                icon={<BookOpen className="h-5 w-5 text-primary" />}
              >
                <SettingsItem
                  title="Advance Booking Period"
                  description="How many days in advance can customers book"
                >
                  <div className="flex items-center w-40">
                    <Input 
                      type="number" 
                      value={bookingSettings.advanceBookingDays} 
                      onChange={(e) => setBookingSettings({...bookingSettings, advanceBookingDays: parseInt(e.target.value)})}
                      min={1}
                      className="mr-2"
                    />
                    <span>days</span>
                  </div>
                </SettingsItem>
                
                <SettingsItem
                  title="Minimum Advance Notice"
                  description="Minimum hours before service that booking is allowed"
                >
                  <div className="flex items-center w-40">
                    <Input 
                      type="number" 
                      value={bookingSettings.minAdvanceBookingHours} 
                      onChange={(e) => setBookingSettings({...bookingSettings, minAdvanceBookingHours: parseInt(e.target.value)})}
                      min={0}
                      className="mr-2"
                    />
                    <span>hours</span>
                  </div>
                </SettingsItem>
                
                <SettingsItem
                  title="Allow Same Day Booking"
                  description="Allow customers to book services for the current day"
                >
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={bookingSettings.allowSameDayBooking} 
                      onCheckedChange={(checked) => setBookingSettings({...bookingSettings, allowSameDayBooking: checked})}
                      id="same-day-booking"
                    />
                    <Label htmlFor="same-day-booking">
                      {bookingSettings.allowSameDayBooking ? "Allowed" : "Not Allowed"}
                    </Label>
                  </div>
                </SettingsItem>
                
                <SettingsItem
                  title="Allow Cancellation"
                  description="Allow customers to cancel their bookings"
                >
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={bookingSettings.allowCancellation} 
                      onCheckedChange={(checked) => setBookingSettings({...bookingSettings, allowCancellation: checked})}
                      id="allow-cancellation"
                    />
                    <Label htmlFor="allow-cancellation">
                      {bookingSettings.allowCancellation ? "Allowed" : "Not Allowed"}
                    </Label>
                  </div>
                </SettingsItem>
                
                <SettingsItem
                  title="Cancellation Window"
                  description="Hours before service when cancellation is allowed"
                >
                  <div className="flex items-center w-40">
                    <Input 
                      type="number" 
                      value={bookingSettings.cancellationWindow} 
                      onChange={(e) => setBookingSettings({...bookingSettings, cancellationWindow: parseInt(e.target.value)})}
                      min={0}
                      className="mr-2"
                      disabled={!bookingSettings.allowCancellation}
                    />
                    <span>hours</span>
                  </div>
                </SettingsItem>
              </SettingsSection>
              
              <Separator />
              
              <SettingsSection
                title="Service Timing"
                description="Configure default time settings for services"
                icon={<Settings className="h-5 w-5 text-primary" />}
              >
                <SettingsItem
                  title="Default Service Duration"
                  description="Default duration for new services"
                >
                  <div className="flex items-center w-40">
                    <Input 
                      type="number" 
                      value={bookingSettings.defaultServiceDuration} 
                      onChange={(e) => setBookingSettings({...bookingSettings, defaultServiceDuration: parseInt(e.target.value)})}
                      min={15}
                      step={15}
                      className="mr-2"
                    />
                    <span>minutes</span>
                  </div>
                </SettingsItem>
                
                <SettingsItem
                  title="Time Slot Interval"
                  description="Interval between available time slots"
                >
                  <Select 
                    value={String(bookingSettings.timeSlotInterval)} 
                    onValueChange={(value) => setBookingSettings({...bookingSettings, timeSlotInterval: parseInt(value)})}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingsItem>
                
                <SettingsItem
                  title="Working Hours"
                  description="Set business operating hours"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="start-time">Start:</Label>
                      <Input 
                        type="time" 
                        id="start-time"
                        value={bookingSettings.workingHourStart} 
                        onChange={(e) => setBookingSettings({...bookingSettings, workingHourStart: e.target.value})}
                        className="w-32"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="end-time">End:</Label>
                      <Input 
                        type="time" 
                        id="end-time"
                        value={bookingSettings.workingHourEnd} 
                        onChange={(e) => setBookingSettings({...bookingSettings, workingHourEnd: e.target.value})}
                        className="w-32"
                      />
                    </div>
                  </div>
                </SettingsItem>
                
                <SettingsItem
                  title="Working Days"
                  description="Days when services are available"
                >
                  <div className="flex flex-wrap gap-2">
                    {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`day-${day}`} 
                          checked={bookingSettings.workingDays.includes(day)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setBookingSettings({
                                ...bookingSettings, 
                                workingDays: [...bookingSettings.workingDays, day]
                              });
                            } else {
                              setBookingSettings({
                                ...bookingSettings, 
                                workingDays: bookingSettings.workingDays.filter(d => d !== day)
                              });
                            }
                          }}
                        />
                        <Label htmlFor={`day-${day}`} className="capitalize">{day}</Label>
                      </div>
                    ))}
                  </div>
                </SettingsItem>
              </SettingsSection>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Configure payment and currency options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SettingsSection
                title="Currency Settings"
                description="Configure your business currency"
                icon={<CreditCard className="h-5 w-5 text-primary" />}
              >
                <SettingsItem
                  title="Currency"
                  description="Primary currency for your business"
                >
                  <Select 
                    value={paymentSettings.currency} 
                    onValueChange={(value) => setPaymentSettings({...paymentSettings, currency: value})}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="GBP">British Pound (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingsItem>
                
                <SettingsItem
                  title="Currency Symbol"
                  description="Symbol displayed for prices"
                >
                  <Input 
                    value={paymentSettings.currencySymbol} 
                    onChange={(e) => setPaymentSettings({...paymentSettings, currencySymbol: e.target.value})}
                    className="w-20"
                  />
                </SettingsItem>
              </SettingsSection>
              
              <Separator />
              
              <SettingsSection
                title="Payment Methods"
                description="Configure available payment options"
                icon={<CreditCard className="h-5 w-5 text-primary" />}
              >
                <SettingsItem
                  title="Online Payments"
                  description="Allow customers to pay online"
                >
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={paymentSettings.enableOnlinePayments} 
                      onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, enableOnlinePayments: checked})}
                      id="online-payments"
                    />
                    <Label htmlFor="online-payments">
                      {paymentSettings.enableOnlinePayments ? "Enabled" : "Disabled"}
                    </Label>
                  </div>
                </SettingsItem>
                
                <SettingsItem
                  title="Cash Payments"
                  description="Allow cash payments after service"
                >
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={paymentSettings.enableCashPayments} 
                      onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, enableCashPayments: checked})}
                      id="cash-payments"
                    />
                    <Label htmlFor="cash-payments">
                      {paymentSettings.enableCashPayments ? "Enabled" : "Disabled"}
                    </Label>
                  </div>
                </SettingsItem>
                
                <SettingsItem
                  title="Payment Gateways"
                  description="Configure which payment processors to use"
                >
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="stripe" 
                        checked={paymentSettings.paymentGateways.stripe}
                        onCheckedChange={(checked) => setPaymentSettings({
                          ...paymentSettings, 
                          paymentGateways: {
                            ...paymentSettings.paymentGateways,
                            stripe: !!checked
                          }
                        })}
                        disabled={!paymentSettings.enableOnlinePayments}
                      />
                      <Label htmlFor="stripe">Stripe</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="paypal" 
                        checked={paymentSettings.paymentGateways.paypal}
                        onCheckedChange={(checked) => setPaymentSettings({
                          ...paymentSettings, 
                          paymentGateways: {
                            ...paymentSettings.paymentGateways,
                            paypal: !!checked
                          }
                        })}
                        disabled={!paymentSettings.enableOnlinePayments}
                      />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="razorpay" 
                        checked={paymentSettings.paymentGateways.razorpay}
                        onCheckedChange={(checked) => setPaymentSettings({
                          ...paymentSettings, 
                          paymentGateways: {
                            ...paymentSettings.paymentGateways,
                            razorpay: !!checked
                          }
                        })}
                        disabled={!paymentSettings.enableOnlinePayments}
                      />
                      <Label htmlFor="razorpay">Razorpay</Label>
                    </div>
                  </div>
                </SettingsItem>
              </SettingsSection>
              
              <Separator />
              
              <SettingsSection
                title="Tax & Invoice"
                description="Configure tax and invoice settings"
                icon={<BookOpen className="h-5 w-5 text-primary" />}
              >
                <SettingsItem
                  title="Tax Rate (%)"
                  description="Default tax rate applied to services"
                >
                  <div className="flex items-center w-40">
                    <Input 
                      type="number" 
                      value={paymentSettings.taxRate} 
                      onChange={(e) => setPaymentSettings({...paymentSettings, taxRate: parseFloat(e.target.value)})}
                      min={0}
                      step={0.1}
                      max={100}
                      className="mr-2"
                    />
                    <span>%</span>
                  </div>
                </SettingsItem>
                
                <SettingsItem
                  title="Invoice Prefix"
                  description="Text that appears before invoice numbers"
                >
                  <Input 
                    value={paymentSettings.invoicePrefix} 
                    onChange={(e) => setPaymentSettings({...paymentSettings, invoicePrefix: e.target.value})}
                    className="w-40"
                  />
                </SettingsItem>
              </SettingsSection>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integrations & API Settings</CardTitle>
              <CardDescription>Configure third-party integrations and API access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SettingsSection
                title="Map Integration"
                description="Configure Google Maps for location services"
                icon={<Globe className="h-5 w-5 text-primary" />}
              >
                <SettingsItem
                  title="Google Maps API Key"
                  description="API key for Google Maps integration"
                >
                  <div className="space-y-2">
                    <Input 
                      type="text" 
                      value={apiSettings.googleMapsApiKey} 
                      onChange={(e) => setApiSettings({...apiSettings, googleMapsApiKey: e.target.value})}
                      placeholder="Enter your Google Maps API key"
                    />
                    <p className="text-xs text-muted-foreground">
                      <a 
                        href="https://developers.google.com/maps/documentation/javascript/get-api-key" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        How to get a Google Maps API key
                      </a>
                    </p>
                  </div>
                </SettingsItem>
              </SettingsSection>
              
              <Separator />
              
              <SettingsSection
                title="Communication Services"
                description="Configure SMS and email service integrations"
                icon={<Mail className="h-5 w-5 text-primary" />}
              >
                <SettingsItem
                  title="SMS API Key"
                  description="API key for SMS service provider"
                >
                  <Input 
                    type="text" 
                    value={apiSettings.smsApiKey} 
                    onChange={(e) => setApiSettings({...apiSettings, smsApiKey: e.target.value})}
                    placeholder="Enter your SMS API key"
                  />
                </SettingsItem>
                
                <SettingsItem
                  title="Email Service API Key"
                  description="API key for email service provider"
                >
                  <Input 
                    type="text" 
                    value={apiSettings.emailServiceApiKey} 
                    onChange={(e) => setApiSettings({...apiSettings, emailServiceApiKey: e.target.value})}
                    placeholder="Enter your Email Service API key"
                  />
                </SettingsItem>
              </SettingsSection>
              
              <Separator />
              
              <SettingsSection
                title="API Access"
                description="Configure access to your system's API"
                icon={<Server className="h-5 w-5 text-primary" />}
              >
                <SettingsItem
                  title="Enable API Access"
                  description="Allow third-party applications to access your API"
                >
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={apiSettings.enableApiAccess} 
                      onCheckedChange={(checked) => setApiSettings({...apiSettings, enableApiAccess: checked})}
                      id="enable-api"
                    />
                    <Label htmlFor="enable-api">
                      {apiSettings.enableApiAccess ? "Enabled" : "Disabled"}
                    </Label>
                  </div>
                </SettingsItem>
                
                <SettingsItem
                  title="IP Whitelist"
                  description="Restrict API access to specific IP addresses (comma separated)"
                >
                  <Textarea 
                    value={apiSettings.ipWhitelist} 
                    onChange={(e) => setApiSettings({...apiSettings, ipWhitelist: e.target.value})}
                    placeholder="e.g. 192.168.1.1, 10.0.0.1"
                    disabled={!apiSettings.enableApiAccess}
                  />
                </SettingsItem>
              </SettingsSection>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security options for your application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SettingsSection
                title="Authentication Settings"
                description="Configure login and account security options"
                icon={<Lock className="h-5 w-5 text-primary" />}
              >
                <SettingsItem
                  title="Minimum Password Length"
                  description="Minimum number of characters required for passwords"
                >
                  <div className="flex items-center w-32">
                    <Input 
                      type="number" 
                      defaultValue={8} 
                      min={6}
                      max={32}
                      className="mr-2"
                    />
                    <span>chars</span>
                  </div>
                </SettingsItem>
                
                <SettingsItem
                  title="Password Complexity"
                  description="Require complex passwords with mixed characters"
                >
                  <div className="flex items-center space-x-2">
                    <Switch 
                      defaultChecked={true}
                      id="password-complexity"
                    />
                    <Label htmlFor="password-complexity">
                      Require complex passwords
                    </Label>
                  </div>
                </SettingsItem>
                
                <SettingsItem
                  title="Two-Factor Authentication"
                  description="Require 2FA for admin accounts"
                >
                  <div className="flex items-center space-x-2">
                    <Switch 
                      defaultChecked={true}
                      id="two-factor"
                    />
                    <Label htmlFor="two-factor">
                      Require 2FA for admins
                    </Label>
                  </div>
                </SettingsItem>
                
                <SettingsItem
                  title="Session Timeout"
                  description="Automatically log out inactive users after specified minutes"
                >
                  <div className="flex items-center w-32">
                    <Input 
                      type="number" 
                      defaultValue={30} 
                      min={5}
                      max={480}
                      className="mr-2"
                    />
                    <span>mins</span>
                  </div>
                </SettingsItem>
              </SettingsSection>
              
              <Separator />
              
              <SettingsSection
                title="Data Protection"
                description="Configure data security and privacy settings"
                icon={<Lock className="h-5 w-5 text-primary" />}
              >
                <SettingsItem
                  title="Data Encryption"
                  description="Encrypt sensitive data in the database"
                >
                  <div className="flex items-center space-x-2">
                    <Switch 
                      defaultChecked={true}
                      id="data-encryption"
                    />
                    <Label htmlFor="data-encryption">
                      Enable data encryption
                    </Label>
                  </div>
                </SettingsItem>
                
                <SettingsItem
                  title="Auto-Delete Inactive Accounts"
                  description="Automatically delete inactive customer accounts"
                >
                  <div className="flex items-center space-x-2">
                    <Switch 
                      defaultChecked={false}
                      id="auto-delete"
                    />
                    <Label htmlFor="auto-delete">
                      Enable auto-deletion
                    </Label>
                  </div>
                </SettingsItem>
                
                <SettingsItem
                  title="Privacy Policy URL"
                  description="Link to your privacy policy page"
                >
                  <Input 
                    type="url" 
                    defaultValue="https://example.com/privacy-policy" 
                    placeholder="Enter URL to privacy policy"
                  />
                </SettingsItem>
                
                <SettingsItem
                  title="Terms of Service URL"
                  description="Link to your terms of service page"
                >
                  <Input 
                    type="url" 
                    defaultValue="https://example.com/terms-of-service" 
                    placeholder="Enter URL to terms of service"
                  />
                </SettingsItem>
              </SettingsSection>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>
          <Save size={16} className="mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
}
