
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bell, 
  Clock,
  Database,
  Globe,
  Mail, 
  Palette, 
  Smartphone, 
  Upload, 
  User, 
  Wallet,
  AlertTriangle,
  BookOpen,
  Lock,
  FileText,
  Shield
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function Settings() {
  const [accountSettings, setAccountSettings] = useState({
    name: "Admin User",
    email: "admin@example.com",
    phone: "+91 9876543210",
    notifyEmail: true,
    notifySMS: true,
    notifyPush: true
  });
  
  const [appSettings, setAppSettings] = useState({
    appName: "Meri Didi Admin",
    logoUrl: "",
    favicon: "",
    primaryColor: "#6366f1",
    secondaryColor: "#10b981",
    accentColor: "#f43f5e",
  });
  
  const [companyInfo, setCompanyInfo] = useState({
    companyName: "Meri Didi Services Pvt Ltd",
    address: "123 Main Street, Mumbai, Maharashtra 400001",
    contactEmail: "contact@merididi.com",
    contactPhone: "+91 1234567890",
    supportEmail: "support@merididi.com",
    supportPhone: "+91 9876543210",
    taxId: "GSTIN: 23AABCU9603R1ZX",
  });
  
  // System Settings
  const [currencySettings, setCurrencySettings] = useState({
    defaultCurrency: "INR",
    symbolPosition: "before",
    decimalSeparator: ".",
    thousandSeparator: ",",
    decimalPlaces: "2",
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    customerBookingEmail: true,
    customerBookingSMS: true,
    workerAssignmentEmail: true,
    workerAssignmentSMS: true,
    bookingReminderEmail: true,
    bookingReminderSMS: true,
    feedbackRequestEmail: true,
    marketingNotifications: true,
  });
  
  const [platformSettings, setPlatformSettings] = useState({
    maintenanceMode: false,
    allowGuestBooking: true,
    requirePhoneVerification: true,
    enableReferralSystem: true,
    autoAssignWorkers: false,
    allowMultipleBookingSameTime: false,
    enableCancellationFee: true,
    cancellationFeePercentage: "25",
    taxPercentage: "18",
    platformFeePercentage: "10",
    minimumBookingTime: "1",
    maximumBookingDaysInAdvance: "30",
  });
  
  const [apiSettings, setApiSettings] = useState({
    googleMapsApiKey: "•••••••••••••••••••••••••••",
    smsProviderApiKey: "•••••••••••••••••••••••••••",
    emailServiceApiKey: "•••••••••••••••••••••••••••",
    paymentGatewayApiKey: "•••••••••••••••••••••••••••",
    firebaseApiKey: "•••••••••••••••••••••••••••",
  });
  
  const { toast } = useToast();
  
  const handleFormSubmit = (e: React.FormEvent, section: string) => {
    e.preventDefault();
    
    toast({
      title: "Settings Updated",
      description: `${section} settings have been saved successfully.`,
    });
  };
  
  function getSymbol(currency: string): string {
    const symbols: { [key: string]: string } = {
      USD: "$", 
      EUR: "€", 
      GBP: "£", 
      INR: "₹", 
      JPY: "¥", 
      CNY: "¥"
    };
    return symbols[currency] || currency;
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 text-primary" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          strokeWidth={2}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
          />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
          />
        </svg>
        Settings
      </h1>

      <Tabs defaultValue="account" className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b">
            <TabsList className="flex h-auto p-0 bg-transparent">
              <TabsTrigger 
                value="account" 
                className="flex-1 h-12 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Account
              </TabsTrigger>
              <TabsTrigger 
                value="appearance" 
                className="flex-1 h-12 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Appearance
              </TabsTrigger>
              <TabsTrigger 
                value="company" 
                className="flex-1 h-12 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Company
              </TabsTrigger>
              <TabsTrigger 
                value="system" 
                className="flex-1 h-12 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                System
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="flex-1 h-12 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Security
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="account" className="p-6">
            <form onSubmit={(e) => handleFormSubmit(e, "Account")} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User size={18} className="text-primary" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your account information and notification preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={accountSettings.name}
                      onChange={(e) => setAccountSettings({...accountSettings, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={accountSettings.email}
                      onChange={(e) => setAccountSettings({...accountSettings, email: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={accountSettings.phone}
                      onChange={(e) => setAccountSettings({...accountSettings, phone: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-3 pt-3">
                    <h3 className="text-sm font-medium">Notification Preferences</h3>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="email-notifications" 
                        checked={accountSettings.notifyEmail}
                        onCheckedChange={(checked) => setAccountSettings({...accountSettings, notifyEmail: checked})}
                      />
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="sms-notifications" 
                        checked={accountSettings.notifySMS}
                        onCheckedChange={(checked) => setAccountSettings({...accountSettings, notifySMS: checked})}
                      />
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="push-notifications" 
                        checked={accountSettings.notifyPush}
                        onCheckedChange={(checked) => setAccountSettings({...accountSettings, notifyPush: checked})}
                      />
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit">Save Account Settings</Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="appearance" className="p-6">
            <form onSubmit={(e) => handleFormSubmit(e, "Appearance")} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette size={18} className="text-primary" />
                    App Appearance
                  </CardTitle>
                  <CardDescription>
                    Customize the appearance of your admin dashboard and user app
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="app-name">App Name</Label>
                    <Input 
                      id="app-name" 
                      value={appSettings.appName}
                      onChange={(e) => setAppSettings({...appSettings, appName: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="logo">Logo</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded border flex items-center justify-center bg-gray-50">
                        {appSettings.logoUrl ? (
                          <img src={appSettings.logoUrl} alt="Logo" className="max-w-full max-h-full" />
                        ) : (
                          <Upload className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <Button variant="outline" type="button">
                        Upload Logo
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="favicon">Favicon</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded border flex items-center justify-center bg-gray-50">
                        {appSettings.favicon ? (
                          <img src={appSettings.favicon} alt="Favicon" className="max-w-full max-h-full" />
                        ) : (
                          <Upload className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <Button variant="outline" type="button">
                        Upload Favicon
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="primary-color">Primary Color</Label>
                      <div className="flex gap-2">
                        <input 
                          id="primary-color-picker" 
                          type="color" 
                          value={appSettings.primaryColor}
                          onChange={(e) => setAppSettings({...appSettings, primaryColor: e.target.value})}
                          className="w-10 h-10 rounded overflow-hidden cursor-pointer"
                        />
                        <Input 
                          id="primary-color" 
                          value={appSettings.primaryColor}
                          onChange={(e) => setAppSettings({...appSettings, primaryColor: e.target.value})}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="secondary-color">Secondary Color</Label>
                      <div className="flex gap-2">
                        <input 
                          id="secondary-color-picker" 
                          type="color" 
                          value={appSettings.secondaryColor}
                          onChange={(e) => setAppSettings({...appSettings, secondaryColor: e.target.value})}
                          className="w-10 h-10 rounded overflow-hidden cursor-pointer"
                        />
                        <Input 
                          id="secondary-color" 
                          value={appSettings.secondaryColor}
                          onChange={(e) => setAppSettings({...appSettings, secondaryColor: e.target.value})}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="accent-color">Accent Color</Label>
                      <div className="flex gap-2">
                        <input 
                          id="accent-color-picker" 
                          type="color" 
                          value={appSettings.accentColor}
                          onChange={(e) => setAppSettings({...appSettings, accentColor: e.target.value})}
                          className="w-10 h-10 rounded overflow-hidden cursor-pointer"
                        />
                        <Input 
                          id="accent-color" 
                          value={appSettings.accentColor}
                          onChange={(e) => setAppSettings({...appSettings, accentColor: e.target.value})}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit">Save Appearance Settings</Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="company" className="p-6">
            <form onSubmit={(e) => handleFormSubmit(e, "Company")} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe size={18} className="text-primary" /> 
                    Company Information
                  </CardTitle>
                  <CardDescription>
                    Update your company details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input 
                      id="company-name" 
                      value={companyInfo.companyName}
                      onChange={(e) => setCompanyInfo({...companyInfo, companyName: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea 
                      id="address" 
                      value={companyInfo.address}
                      onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-email">Contact Email</Label>
                      <Input 
                        id="contact-email" 
                        type="email"
                        value={companyInfo.contactEmail}
                        onChange={(e) => setCompanyInfo({...companyInfo, contactEmail: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contact-phone">Contact Phone</Label>
                      <Input 
                        id="contact-phone" 
                        value={companyInfo.contactPhone}
                        onChange={(e) => setCompanyInfo({...companyInfo, contactPhone: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="support-email">Support Email</Label>
                      <Input 
                        id="support-email" 
                        type="email"
                        value={companyInfo.supportEmail}
                        onChange={(e) => setCompanyInfo({...companyInfo, supportEmail: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="support-phone">Support Phone</Label>
                      <Input 
                        id="support-phone" 
                        value={companyInfo.supportPhone}
                        onChange={(e) => setCompanyInfo({...companyInfo, supportPhone: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tax-id">Tax ID</Label>
                    <Input 
                      id="tax-id" 
                      value={companyInfo.taxId}
                      onChange={(e) => setCompanyInfo({...companyInfo, taxId: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit">Save Company Settings</Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="system" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <form onSubmit={(e) => handleFormSubmit(e, "Platform")} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe size={18} className="text-primary" />
                      Platform Settings
                    </CardTitle>
                    <CardDescription>
                      Configure core platform behavior and settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Maintenance Mode</Label>
                        <p className="text-sm text-gray-500">
                          Put the entire platform in maintenance mode
                        </p>
                      </div>
                      <Switch
                        checked={platformSettings.maintenanceMode}
                        onCheckedChange={(checked) =>
                          setPlatformSettings({
                            ...platformSettings,
                            maintenanceMode: checked,
                          })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Allow Guest Booking</Label>
                        <p className="text-sm text-gray-500">
                          Allow users to book services without registration
                        </p>
                      </div>
                      <Switch
                        checked={platformSettings.allowGuestBooking}
                        onCheckedChange={(checked) =>
                          setPlatformSettings({
                            ...platformSettings,
                            allowGuestBooking: checked,
                          })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Require Phone Verification</Label>
                        <p className="text-sm text-gray-500">
                          Verify user phone numbers via OTP before booking
                        </p>
                      </div>
                      <Switch
                        checked={platformSettings.requirePhoneVerification}
                        onCheckedChange={(checked) =>
                          setPlatformSettings({
                            ...platformSettings,
                            requirePhoneVerification: checked,
                          })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Enable Referral System</Label>
                        <p className="text-sm text-gray-500">
                          Allow customers to earn rewards through referrals
                        </p>
                      </div>
                      <Switch
                        checked={platformSettings.enableReferralSystem}
                        onCheckedChange={(checked) =>
                          setPlatformSettings({
                            ...platformSettings,
                            enableReferralSystem: checked,
                          })
                        }
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="min-booking-time">Minimum Booking Time (hours)</Label>
                        <Input
                          id="min-booking-time"
                          type="number"
                          value={platformSettings.minimumBookingTime}
                          onChange={(e) =>
                            setPlatformSettings({
                              ...platformSettings,
                              minimumBookingTime: e.target.value,
                            })
                          }
                          min="0"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="max-booking-days">Max Booking Days in Advance</Label>
                        <Input
                          id="max-booking-days"
                          type="number"
                          value={platformSettings.maximumBookingDaysInAdvance}
                          onChange={(e) =>
                            setPlatformSettings({
                              ...platformSettings,
                              maximumBookingDaysInAdvance: e.target.value,
                            })
                          }
                          min="1"
                          max="365"
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full">Save Platform Settings</Button>
                  </CardContent>
                </Card>
              </form>

              <form onSubmit={(e) => handleFormSubmit(e, "Currency")} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet size={18} className="text-primary" />
                      Currency Settings
                    </CardTitle>
                    <CardDescription>
                      Configure currency display and formatting options
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="default-currency">Default Currency</Label>
                      <Select
                        value={currencySettings.defaultCurrency}
                        onValueChange={(value) =>
                          setCurrencySettings({
                            ...currencySettings,
                            defaultCurrency: value,
                          })
                        }
                      >
                        <SelectTrigger id="default-currency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">US Dollar ($)</SelectItem>
                          <SelectItem value="EUR">Euro (€)</SelectItem>
                          <SelectItem value="GBP">British Pound (£)</SelectItem>
                          <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                          <SelectItem value="JPY">Japanese Yen (¥)</SelectItem>
                          <SelectItem value="CNY">Chinese Yuan (¥)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="symbol-position">Symbol Position</Label>
                      <Select
                        value={currencySettings.symbolPosition}
                        onValueChange={(value) =>
                          setCurrencySettings({
                            ...currencySettings,
                            symbolPosition: value,
                          })
                        }
                      >
                        <SelectTrigger id="symbol-position">
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="before">Before amount ($100)</SelectItem>
                          <SelectItem value="after">After amount (100$)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="decimal-separator">Decimal Separator</Label>
                        <Select
                          value={currencySettings.decimalSeparator}
                          onValueChange={(value) =>
                            setCurrencySettings({
                              ...currencySettings,
                              decimalSeparator: value,
                            })
                          }
                        >
                          <SelectTrigger id="decimal-separator">
                            <SelectValue placeholder="Select separator" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value=".">Period (.)</SelectItem>
                            <SelectItem value=",">Comma (,)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="thousand-separator">Thousand Separator</Label>
                        <Select
                          value={currencySettings.thousandSeparator}
                          onValueChange={(value) =>
                            setCurrencySettings({
                              ...currencySettings,
                              thousandSeparator: value,
                            })
                          }
                        >
                          <SelectTrigger id="thousand-separator">
                            <SelectValue placeholder="Select separator" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value=",">Comma (,)</SelectItem>
                            <SelectItem value=".">Period (.)</SelectItem>
                            <SelectItem value=" ">Space</SelectItem>
                            <SelectItem value="">None</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-md mt-4">
                      <p className="text-sm font-medium">Preview:</p>
                      <p className="text-xl font-bold text-primary mt-1">
                        {currencySettings.symbolPosition === "before"
                          ? getSymbol(currencySettings.defaultCurrency)
                          : ""}
                        1{currencySettings.thousandSeparator}234
                        {currencySettings.decimalPlaces !== "0"
                          ? `${currencySettings.decimalSeparator}${
                              "0".repeat(parseInt(currencySettings.decimalPlaces))
                            }`
                          : ""}
                        {currencySettings.symbolPosition === "after"
                          ? getSymbol(currencySettings.defaultCurrency)
                          : ""}
                      </p>
                    </div>
                    
                    <Button type="submit" className="w-full mt-2">Save Currency Settings</Button>
                  </CardContent>
                </Card>
              </form>
            </div>

            <form onSubmit={(e) => handleFormSubmit(e, "Notification")} className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell size={18} className="text-primary" />
                    Notification Settings
                  </CardTitle>
                  <CardDescription>
                    Configure when and how notifications are sent to users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-6">
                      <h3 className="font-medium text-gray-800">Customer Notifications</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <Switch
                            id="customer-booking-email"
                            checked={notificationSettings.customerBookingEmail}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                customerBookingEmail: checked,
                              })
                            }
                          />
                          <div className="space-y-1">
                            <Label htmlFor="customer-booking-email" className="text-base">
                              Booking Confirmation (Email)
                            </Label>
                            <p className="text-sm text-gray-500">
                              Send email confirmation when customer makes a booking
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <Switch
                            id="customer-booking-sms"
                            checked={notificationSettings.customerBookingSMS}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                customerBookingSMS: checked,
                              })
                            }
                          />
                          <div className="space-y-1">
                            <Label htmlFor="customer-booking-sms" className="text-base">
                              Booking Confirmation (SMS)
                            </Label>
                            <p className="text-sm text-gray-500">
                              Send SMS confirmation when customer makes a booking
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <Switch
                            id="booking-reminder-email"
                            checked={notificationSettings.bookingReminderEmail}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                bookingReminderEmail: checked,
                              })
                            }
                          />
                          <div className="space-y-1">
                            <Label htmlFor="booking-reminder-email" className="text-base">
                              Booking Reminder (Email)
                            </Label>
                            <p className="text-sm text-gray-500">
                              Send reminder email 24 hours before scheduled service
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <Switch
                            id="feedback-request-email"
                            checked={notificationSettings.feedbackRequestEmail}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                feedbackRequestEmail: checked,
                              })
                            }
                          />
                          <div className="space-y-1">
                            <Label htmlFor="feedback-request-email" className="text-base">
                              Feedback Request (Email)
                            </Label>
                            <p className="text-sm text-gray-500">
                              Request feedback after service completion
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <h3 className="font-medium text-gray-800">Worker Notifications</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <Switch
                            id="worker-assignment-email"
                            checked={notificationSettings.workerAssignmentEmail}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                workerAssignmentEmail: checked,
                              })
                            }
                          />
                          <div className="space-y-1">
                            <Label htmlFor="worker-assignment-email" className="text-base">
                              Service Assignment (Email)
                            </Label>
                            <p className="text-sm text-gray-500">
                              Notify worker when assigned to a service
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <Switch
                            id="worker-assignment-sms"
                            checked={notificationSettings.workerAssignmentSMS}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                workerAssignmentSMS: checked,
                              })
                            }
                          />
                          <div className="space-y-1">
                            <Label htmlFor="worker-assignment-sms" className="text-base">
                              Service Assignment (SMS)
                            </Label>
                            <p className="text-sm text-gray-500">
                              Send SMS to worker when assigned to a service
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <Switch
                            id="booking-reminder-sms"
                            checked={notificationSettings.bookingReminderSMS}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                bookingReminderSMS: checked,
                              })
                            }
                          />
                          <div className="space-y-1">
                            <Label htmlFor="booking-reminder-sms" className="text-base">
                              Service Reminder (SMS)
                            </Label>
                            <p className="text-sm text-gray-500">
                              Send reminder SMS 24 hours before scheduled service
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <Switch
                            id="marketing-notifications"
                            checked={notificationSettings.marketingNotifications}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                marketingNotifications: checked,
                              })
                            }
                          />
                          <div className="space-y-1">
                            <Label htmlFor="marketing-notifications" className="text-base">
                              Marketing Notifications
                            </Label>
                            <p className="text-sm text-gray-500">
                              Send promotional offers and updates
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button type="submit">Save Notification Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </TabsContent>
          
          <TabsContent value="security" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <form onSubmit={(e) => handleFormSubmit(e, "Authentication")} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock size={18} className="text-primary" />
                      Authentication Settings
                    </CardTitle>
                    <CardDescription>
                      Configure authentication and password policy
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-500">
                          Require 2FA for admin users
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Force Password Reset</Label>
                        <p className="text-sm text-gray-500">
                          Force password reset every 90 days
                        </p>
                      </div>
                      <Switch defaultChecked={false} />
                    </div>
                    
                    <div className="space-y-2 pt-2">
                      <Label htmlFor="min-password-length">Minimum Password Length</Label>
                      <Select defaultValue="8">
                        <SelectTrigger id="min-password-length">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6 characters</SelectItem>
                          <SelectItem value="8">8 characters</SelectItem>
                          <SelectItem value="10">10 characters</SelectItem>
                          <SelectItem value="12">12 characters</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Require Special Characters</Label>
                        <p className="text-sm text-gray-500">
                          Passwords must contain special characters
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="space-y-2 pt-2">
                      <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                      <Input id="session-timeout" type="number" defaultValue="30" min="5" />
                    </div>
                    
                    <Button type="submit" className="w-full">Save Authentication Settings</Button>
                  </CardContent>
                </Card>
              </form>
              
              <form onSubmit={(e) => handleFormSubmit(e, "API")} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database size={18} className="text-primary" />
                      API Integration Keys
                    </CardTitle>
                    <CardDescription>
                      Manage API keys for third-party services
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="google-maps-api">Google Maps API Key</Label>
                        <Button variant="outline" size="sm">Reveal</Button>
                      </div>
                      <Input
                        id="google-maps-api"
                        value={apiSettings.googleMapsApiKey}
                        onChange={(e) => setApiSettings({...apiSettings, googleMapsApiKey: e.target.value})}
                        type="password"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="sms-api">SMS Provider API Key</Label>
                        <Button variant="outline" size="sm">Reveal</Button>
                      </div>
                      <Input
                        id="sms-api"
                        value={apiSettings.smsProviderApiKey}
                        onChange={(e) => setApiSettings({...apiSettings, smsProviderApiKey: e.target.value})}
                        type="password"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="email-api">Email Service API Key</Label>
                        <Button variant="outline" size="sm">Reveal</Button>
                      </div>
                      <Input
                        id="email-api"
                        value={apiSettings.emailServiceApiKey}
                        onChange={(e) => setApiSettings({...apiSettings, emailServiceApiKey: e.target.value})}
                        type="password"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="payment-api">Payment Gateway API Key</Label>
                        <Button variant="outline" size="sm">Reveal</Button>
                      </div>
                      <Input
                        id="payment-api"
                        value={apiSettings.paymentGatewayApiKey}
                        onChange={(e) => setApiSettings({...apiSettings, paymentGatewayApiKey: e.target.value})}
                        type="password"
                      />
                    </div>
                    
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-start mt-4">
                      <AlertTriangle size={18} className="text-yellow-600 mr-2 mt-0.5" />
                      <p className="text-sm text-yellow-800">
                        API keys are sensitive information. Never share your API keys with unauthorized persons or in public code repositories.
                      </p>
                    </div>
                    
                    <Button type="submit" className="w-full mt-2">Save API Settings</Button>
                  </CardContent>
                </Card>
              </form>
            </div>

            <form onSubmit={(e) => handleFormSubmit(e, "Privacy")} className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield size={18} className="text-primary" />
                    Privacy & Compliance
                  </CardTitle>
                  <CardDescription>
                    Manage privacy settings and legal compliance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Data Retention Policy</Label>
                          <p className="text-sm text-gray-500">
                            Auto-delete user data after inactivity
                          </p>
                        </div>
                        <Switch defaultChecked={false} />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="data-retention-period">Data Retention Period (months)</Label>
                        <Input id="data-retention-period" type="number" defaultValue="24" min="1" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Cookie Consent Banner</Label>
                          <p className="text-sm text-gray-500">
                            Display cookie consent banner to users
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="privacy-policy">Privacy Policy URL</Label>
                        <Input id="privacy-policy" type="url" defaultValue="https://merididi.com/privacy" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="terms-url">Terms of Service URL</Label>
                        <Input id="terms-url" type="url" defaultValue="https://merididi.com/terms" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">GDPR Compliance Mode</Label>
                          <p className="text-sm text-gray-500">
                            Enable additional GDPR compliance features
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="data-officer">Data Protection Officer Contact</Label>
                      <Input id="data-officer" defaultValue="dpo@merididi.com" />
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      <Label htmlFor="custom-consent-text">Custom Consent Text</Label>
                      <Textarea 
                        id="custom-consent-text" 
                        defaultValue="I agree to the privacy policy and consent to the collection and processing of my personal data as described therein."
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button type="submit">Save Privacy Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
