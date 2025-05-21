
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Bell, 
  Mail, 
  Shield, 
  Smartphone, 
  Tv, 
  User, 
  Clock, 
  Globe, 
  Palette,
  DollarSign,
  Lock,
  Loader2
} from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [profileForm, setProfileForm] = useState({
    name: "Admin User",
    email: "admin@example.com",
    phone: "+1 (555) 123-4567",
    avatar: ""
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    sms: false,
    bookingReminders: true,
    marketingEmails: false,
    adminAlerts: true
  });
  
  const [displaySettings, setDisplaySettings] = useState({
    theme: "light",
    language: "english",
    timeFormat: "12h",
    timezone: "UTC+0",
    currency: "USD"
  });
  
  const [systemSettings, setSystemSettings] = useState({
    bookingTimeSlots: 60,
    minimumBookingNotice: 2,
    bookingWindowDays: 30,
    allowRecurringBookings: true,
    requirePhoneVerification: true,
    autoApprovePendingWorkers: false,
    allowCustomerCancellations: true,
    mainColor: "#f59e0b",
    secondaryColor: "#FEF7CD",
    logoUrl: "/logo.png",
    maintenanceMode: false,
    autoAssignWorker: true,
    allowPaymentOverdue: false
  });
  
  const [appSettings, setAppSettings] = useState({
    appName: "Meri Didi Admin",
    appVersion: "1.0.0",
    androidAppLink: "https://play.google.com/store",
    iosAppLink: "https://apps.apple.com",
    smsApiKey: "********",
    paymentGateway: "stripe",
    commissionRate: 10,
    taxRate: 18,
    serviceRadius: 25,
    referralBonus: 100
  });
  
  const handleSaveProfile = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
    }, 1000);
  };

  const handleSaveNotifications = () => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Notification Settings Updated",
        description: "Your notification preferences have been updated.",
      });
    }, 800);
  };
  
  const handleSaveDisplay = () => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Display Settings Updated",
        description: "Your display preferences have been updated.",
      });
    }, 800);
  };
  
  const handleSaveSystem = () => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "System Settings Updated",
        description: "System settings have been updated successfully.",
      });
    }, 1200);
  };
  
  const handleSaveApp = () => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "App Settings Updated",
        description: "App settings have been updated successfully.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6 bg-[#FEF7CD]/10">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account settings and preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="display">
            <Palette className="h-4 w-4 mr-2" />
            Display
          </TabsTrigger>
          <TabsTrigger value="system">
            <Shield className="h-4 w-4 mr-2" />
            System
          </TabsTrigger>
          <TabsTrigger value="app">
            <Globe className="h-4 w-4 mr-2" />
            App Settings
          </TabsTrigger>
        </TabsList>
        
        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Update your account information and personal details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={profileForm.name} 
                  onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={profileForm.email} 
                  onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={profileForm.phone} 
                  onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar">Profile Picture</Label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-lg font-medium">
                    {profileForm.name.charAt(0)}
                  </div>
                  <Button variant="outline">
                    Change Avatar
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="flex gap-4">
                  <Input id="password" type="password" value="********" disabled />
                  <Button variant="outline">
                    Change Password
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you receive notifications and alerts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium">Notification Channels</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={notificationSettings.email} 
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, email: checked})} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4" />
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                  </div>
                  <Switch 
                    id="push-notifications" 
                    checked={notificationSettings.push} 
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, push: checked})} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-4 w-4" />
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                  </div>
                  <Switch 
                    id="sms-notifications" 
                    checked={notificationSettings.sms} 
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, sms: checked})} 
                  />
                </div>
              </div>
              
              <div className="border-t pt-4 mt-6">
                <h3 className="text-lg font-medium mb-4">Notification Types</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="booking-reminders" className="font-medium">Booking Reminders</Label>
                      <p className="text-sm text-gray-500">Receive reminders about upcoming bookings</p>
                    </div>
                    <Switch 
                      id="booking-reminders" 
                      checked={notificationSettings.bookingReminders} 
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, bookingReminders: checked})} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketing-emails" className="font-medium">Marketing Emails</Label>
                      <p className="text-sm text-gray-500">Receive promotional offers and updates</p>
                    </div>
                    <Switch 
                      id="marketing-emails" 
                      checked={notificationSettings.marketingEmails} 
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, marketingEmails: checked})} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="admin-alerts" className="font-medium">Admin Alerts</Label>
                      <p className="text-sm text-gray-500">Get alerts about system events and issues</p>
                    </div>
                    <Switch 
                      id="admin-alerts" 
                      checked={notificationSettings.adminAlerts} 
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, adminAlerts: checked})} 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : "Save Preferences"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Display Settings */}
        <TabsContent value="display">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>
                Customize the appearance and formatting preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select 
                    value={displaySettings.theme} 
                    onValueChange={(value) => setDisplaySettings({...displaySettings, theme: value})}
                  >
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System Default</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select 
                    value={displaySettings.language} 
                    onValueChange={(value) => setDisplaySettings({...displaySettings, language: value})}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">Hindi</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time-format">Time Format</Label>
                  <Select 
                    value={displaySettings.timeFormat} 
                    onValueChange={(value) => setDisplaySettings({...displaySettings, timeFormat: value})}
                  >
                    <SelectTrigger id="time-format">
                      <SelectValue placeholder="Select time format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                      <SelectItem value="24h">24-hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select 
                    value={displaySettings.timezone} 
                    onValueChange={(value) => setDisplaySettings({...displaySettings, timezone: value})}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC+0">UTC+0 (London)</SelectItem>
                      <SelectItem value="UTC+5:30">UTC+5:30 (India)</SelectItem>
                      <SelectItem value="UTC-5">UTC-5 (Eastern Time)</SelectItem>
                      <SelectItem value="UTC-8">UTC-8 (Pacific Time)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select 
                    value={displaySettings.currency} 
                    onValueChange={(value) => setDisplaySettings({...displaySettings, currency: value})}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveDisplay} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : "Save Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* System Settings */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure core system settings and behavior.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Booking Settings</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="booking-time-slots">Booking Time Slot Duration (minutes)</Label>
                    <Select 
                      value={systemSettings.bookingTimeSlots.toString()} 
                      onValueChange={(value) => setSystemSettings({...systemSettings, bookingTimeSlots: parseInt(value)})}
                    >
                      <SelectTrigger id="booking-time-slots">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                        <SelectItem value="120">120 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="minimum-notice">Minimum Booking Notice (hours)</Label>
                    <Select 
                      value={systemSettings.minimumBookingNotice.toString()} 
                      onValueChange={(value) => setSystemSettings({...systemSettings, minimumBookingNotice: parseInt(value)})}
                    >
                      <SelectTrigger id="minimum-notice">
                        <SelectValue placeholder="Select hours" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="2">2 hours</SelectItem>
                        <SelectItem value="4">4 hours</SelectItem>
                        <SelectItem value="24">24 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="booking-window">Booking Window (days)</Label>
                    <Select 
                      value={systemSettings.bookingWindowDays.toString()} 
                      onValueChange={(value) => setSystemSettings({...systemSettings, bookingWindowDays: parseInt(value)})}
                    >
                      <SelectTrigger id="booking-window">
                        <SelectValue placeholder="Select days" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <Label htmlFor="recurring-bookings" className="font-medium">Allow Recurring Bookings</Label>
                      <p className="text-sm text-gray-500">Let customers book recurring services</p>
                    </div>
                    <Switch 
                      id="recurring-bookings" 
                      checked={systemSettings.allowRecurringBookings} 
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, allowRecurringBookings: checked})} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <Label htmlFor="auto-assign" className="font-medium">Auto-Assign Workers</Label>
                      <p className="text-sm text-gray-500">Automatically assign workers to new bookings</p>
                    </div>
                    <Switch 
                      id="auto-assign" 
                      checked={systemSettings.autoAssignWorker} 
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, autoAssignWorker: checked})} 
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Security & Verification</h3>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <Label htmlFor="phone-verification" className="font-medium">Require Phone Verification</Label>
                      <p className="text-sm text-gray-500">Require phone verification for new users</p>
                    </div>
                    <Switch 
                      id="phone-verification" 
                      checked={systemSettings.requirePhoneVerification} 
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, requirePhoneVerification: checked})} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <Label htmlFor="auto-approve" className="font-medium">Auto-Approve Workers</Label>
                      <p className="text-sm text-gray-500">Automatically approve new worker applications</p>
                    </div>
                    <Switch 
                      id="auto-approve" 
                      checked={systemSettings.autoApprovePendingWorkers} 
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, autoApprovePendingWorkers: checked})} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <Label htmlFor="customer-cancel" className="font-medium">Allow Customer Cancellations</Label>
                      <p className="text-sm text-gray-500">Let customers cancel their bookings</p>
                    </div>
                    <Switch 
                      id="customer-cancel" 
                      checked={systemSettings.allowCustomerCancellations} 
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, allowCustomerCancellations: checked})} 
                    />
                  </div>
                  
                  <div className="space-y-2 pt-4">
                    <Label htmlFor="main-color">Main Color</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="main-color" 
                        type="text" 
                        value={systemSettings.mainColor} 
                        onChange={(e) => setSystemSettings({...systemSettings, mainColor: e.target.value})} 
                      />
                      <div className="h-10 w-10 border rounded" style={{ backgroundColor: systemSettings.mainColor }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="secondary-color" 
                        type="text" 
                        value={systemSettings.secondaryColor} 
                        onChange={(e) => setSystemSettings({...systemSettings, secondaryColor: e.target.value})} 
                      />
                      <div className="h-10 w-10 border rounded" style={{ backgroundColor: systemSettings.secondaryColor }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Maintenance & Advanced Settings</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance-mode" className="font-medium">Maintenance Mode</Label>
                    <p className="text-sm text-gray-500">Put the system in maintenance mode (users will see a maintenance page)</p>
                  </div>
                  <Switch 
                    id="maintenance-mode" 
                    checked={systemSettings.maintenanceMode} 
                    onCheckedChange={(checked) => setSystemSettings({...systemSettings, maintenanceMode: checked})} 
                  />
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <Label htmlFor="allow-overdue" className="font-medium">Allow Payment Overdue</Label>
                    <p className="text-sm text-gray-500">Allow services to be booked with payment due later</p>
                  </div>
                  <Switch 
                    id="allow-overdue" 
                    checked={systemSettings.allowPaymentOverdue} 
                    onCheckedChange={(checked) => setSystemSettings({...systemSettings, allowPaymentOverdue: checked})} 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSystem} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : "Save System Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* App Settings */}
        <TabsContent value="app">
          <Card>
            <CardHeader>
              <CardTitle>App Settings</CardTitle>
              <CardDescription>
                Configure mobile application and integration settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">App Configuration</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="app-name">App Name</Label>
                    <Input 
                      id="app-name" 
                      value={appSettings.appName} 
                      onChange={(e) => setAppSettings({...appSettings, appName: e.target.value})} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="app-version">App Version</Label>
                    <Input 
                      id="app-version" 
                      value={appSettings.appVersion}
                      readOnly
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="android-link">Android App Link</Label>
                    <Input 
                      id="android-link" 
                      value={appSettings.androidAppLink} 
                      onChange={(e) => setAppSettings({...appSettings, androidAppLink: e.target.value})} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ios-link">iOS App Link</Label>
                    <Input 
                      id="ios-link" 
                      value={appSettings.iosAppLink} 
                      onChange={(e) => setAppSettings({...appSettings, iosAppLink: e.target.value})} 
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Integration & Payment Settings</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sms-api">SMS API Key</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="sms-api" 
                        type="password" 
                        value={appSettings.smsApiKey} 
                        onChange={(e) => setAppSettings({...appSettings, smsApiKey: e.target.value})} 
                      />
                      <Button variant="outline" className="flex-shrink-0">
                        <Eye size={16} className="mr-2" />
                        Show
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="payment-gateway">Payment Gateway</Label>
                    <Select 
                      value={appSettings.paymentGateway} 
                      onValueChange={(value) => setAppSettings({...appSettings, paymentGateway: value})}
                    >
                      <SelectTrigger id="payment-gateway">
                        <SelectValue placeholder="Select payment gateway" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="razorpay">Razorpay</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="commission-rate">Commission Rate (%)</Label>
                    <Input 
                      id="commission-rate" 
                      type="number" 
                      value={appSettings.commissionRate} 
                      onChange={(e) => setAppSettings({...appSettings, commissionRate: parseInt(e.target.value)})} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                    <Input 
                      id="tax-rate" 
                      type="number" 
                      value={appSettings.taxRate} 
                      onChange={(e) => setAppSettings({...appSettings, taxRate: parseInt(e.target.value)})} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="service-radius">Service Radius (km)</Label>
                    <Input 
                      id="service-radius" 
                      type="number" 
                      value={appSettings.serviceRadius} 
                      onChange={(e) => setAppSettings({...appSettings, serviceRadius: parseInt(e.target.value)})} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="referral-bonus">Referral Bonus Amount</Label>
                    <Input 
                      id="referral-bonus" 
                      type="number" 
                      value={appSettings.referralBonus} 
                      onChange={(e) => setAppSettings({...appSettings, referralBonus: parseInt(e.target.value)})} 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveApp} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : "Save App Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Adding the missing Eye component
const Eye = ({ size, className }: { size: number, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
