
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Mail, CreditCard, Database, Globe, Key, Phone, FileText, Languages } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings Saved",
        description: "Your settings have been saved successfully.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">System Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-3">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            orientation="vertical"
            className="space-y-4"
          >
            <div className="space-y-4">
              <div 
                className={`flex items-center gap-3 p-3 rounded-md cursor-pointer ${
                  activeTab === "general" ? "bg-primary/10" : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("general")}
              >
                <div className="bg-blue-100 p-2 rounded-md">
                  <Settings size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">General Setting</h3>
                  <p className="text-xs text-gray-500">Includes company settings, logos, support hours etc.</p>
                </div>
              </div>
              
              <div 
                className={`flex items-center gap-3 p-3 rounded-md cursor-pointer ${
                  activeTab === "app" ? "bg-primary/10" : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("app")}
              >
                <div className="bg-green-100 p-2 rounded-md">
                  <Phone size={20} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">App Settings</h3>
                  <p className="text-xs text-gray-500">Includes Country Currency, Version Settings, Maintenance Mode Settings.</p>
                </div>
              </div>
              
              <div 
                className={`flex items-center gap-3 p-3 rounded-md cursor-pointer ${
                  activeTab === "web" ? "bg-primary/10" : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("web")}
              >
                <div className="bg-purple-100 p-2 rounded-md">
                  <Globe size={20} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">Web Setting</h3>
                  <p className="text-xs text-gray-500">Includes web logos, other settings.</p>
                </div>
              </div>
              
              <div 
                className={`flex items-center gap-3 p-3 rounded-md cursor-pointer ${
                  activeTab === "smtp" ? "bg-primary/10" : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("smtp")}
              >
                <div className="bg-red-100 p-2 rounded-md">
                  <Mail size={20} className="text-red-600" />
                </div>
                <div>
                  <h3 className="font-medium">SMTP (Email)</h3>
                  <p className="text-xs text-gray-500">Includes Email Settings.</p>
                </div>
              </div>
              
              <div 
                className={`flex items-center gap-3 p-3 rounded-md cursor-pointer ${
                  activeTab === "payment" ? "bg-primary/10" : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("payment")}
              >
                <div className="bg-yellow-100 p-2 rounded-md">
                  <CreditCard size={20} className="text-yellow-700" />
                </div>
                <div>
                  <h3 className="font-medium">Payment Gateways</h3>
                  <p className="text-xs text-gray-500">Includes Paypal, RazorPay, Paystack, Stripe Settings.</p>
                </div>
              </div>
              
              <div 
                className={`flex items-center gap-3 p-3 rounded-md cursor-pointer ${
                  activeTab === "api" ? "bg-primary/10" : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("api")}
              >
                <div className="bg-sky-100 p-2 rounded-md">
                  <Key size={20} className="text-sky-600" />
                </div>
                <div>
                  <h3 className="font-medium">Api Key Settings</h3>
                  <p className="text-xs text-gray-500">Includes Client API Keys, Google API key for map, FCM Server Key.</p>
                </div>
              </div>
              
              <div 
                className={`flex items-center gap-3 p-3 rounded-md cursor-pointer ${
                  activeTab === "firebase" ? "bg-primary/10" : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("firebase")}
              >
                <div className="bg-orange-100 p-2 rounded-md">
                  <Database size={20} className="text-orange-600" />
                </div>
                <div>
                  <h3 className="font-medium">Firebase settings</h3>
                  <p className="text-xs text-gray-500">Includes apiKey, authDomain, projectId, storageBucket, appId etc.</p>
                </div>
              </div>
              
              <div 
                className={`flex items-center gap-3 p-3 rounded-md cursor-pointer ${
                  activeTab === "terms" ? "bg-primary/10" : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("terms")}
              >
                <div className="bg-teal-100 p-2 rounded-md">
                  <FileText size={20} className="text-teal-600" />
                </div>
                <div>
                  <h3 className="font-medium">Terms & Privacy Settings</h3>
                  <p className="text-xs text-gray-500">Includes Terms and Conditions, Privacy Policies etc.</p>
                </div>
              </div>
              
              <div 
                className={`flex items-center gap-3 p-3 rounded-md cursor-pointer ${
                  activeTab === "language" ? "bg-primary/10" : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("language")}
              >
                <div className="bg-indigo-100 p-2 rounded-md">
                  <Languages size={20} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium">Language Setting</h3>
                  <p className="text-xs text-gray-500">Includes Language Settings.</p>
                </div>
              </div>
            </div>
          </Tabs>
        </div>

        <div className="md:col-span-9">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === "general" && "General Settings"}
                {activeTab === "app" && "App Settings"}
                {activeTab === "web" && "Web Settings"}
                {activeTab === "smtp" && "SMTP Configuration"}
                {activeTab === "payment" && "Payment Gateway Settings"}
                {activeTab === "api" && "API Key Settings"}
                {activeTab === "firebase" && "Firebase Configuration"}
                {activeTab === "terms" && "Terms & Privacy Settings"}
                {activeTab === "language" && "Language Settings"}
              </CardTitle>
              <CardDescription>
                {activeTab === "general" && "Manage company information and general platform settings"}
                {activeTab === "app" && "Configure mobile application settings"}
                {activeTab === "web" && "Configure website settings"}
                {activeTab === "smtp" && "Configure email server settings"}
                {activeTab === "payment" && "Configure payment gateway integrations"}
                {activeTab === "api" && "Manage API keys for various services"}
                {activeTab === "firebase" && "Configure Firebase connection settings"}
                {activeTab === "terms" && "Manage legal documentation"}
                {activeTab === "language" && "Configure language and localization settings"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* General Settings Content */}
              {activeTab === "general" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input id="companyName" defaultValue="Meri Didi Services" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="companyEmail">Company Email</Label>
                      <Input id="companyEmail" type="email" defaultValue="contact@merididi.com" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="companyPhone">Company Phone</Label>
                      <Input id="companyPhone" defaultValue="+91 9876543210" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="companyAddress">Company Address</Label>
                      <Input id="companyAddress" defaultValue="123 Main Street, Mumbai, India" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="supportEmail">Support Email</Label>
                      <Input id="supportEmail" type="email" defaultValue="support@merididi.com" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="supportPhone">Support Phone</Label>
                      <Input id="supportPhone" defaultValue="+91 9876543211" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Company Logo</Label>
                    <div className="flex items-center gap-4">
                      <img 
                        src="/placeholder.svg" 
                        alt="Company Logo" 
                        className="h-16 w-16 object-cover rounded border"
                      />
                      <Button variant="outline">Change Logo</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Favicon</Label>
                    <div className="flex items-center gap-4">
                      <img 
                        src="/favicon.ico" 
                        alt="Favicon" 
                        className="h-8 w-8 object-cover rounded border"
                      />
                      <Button variant="outline">Change Favicon</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Maintenance Mode</Label>
                        <p className="text-sm text-gray-500">Enable to put the site in maintenance mode</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Enable Notifications</Label>
                        <p className="text-sm text-gray-500">Allow system to send notifications to users</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              )}
              
              {/* SMTP Settings Content */}
              {activeTab === "smtp" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="smtpHost">SMTP Host</Label>
                      <Input id="smtpHost" placeholder="smtp.example.com" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">SMTP Port</Label>
                      <Input id="smtpPort" placeholder="587" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtpUser">SMTP Username</Label>
                      <Input id="smtpUser" placeholder="username@example.com" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtpPassword">SMTP Password</Label>
                      <Input id="smtpPassword" type="password" placeholder="••••••••" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="emailFrom">From Email</Label>
                      <Input id="emailFrom" type="email" placeholder="noreply@example.com" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="emailFromName">From Name</Label>
                      <Input id="emailFromName" placeholder="Company Name" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="encryption">Encryption</Label>
                    <Select defaultValue="tls">
                      <SelectTrigger id="encryption">
                        <SelectValue placeholder="Select encryption type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="ssl">SSL</SelectItem>
                        <SelectItem value="tls">TLS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Enable Email</Label>
                        <p className="text-sm text-gray-500">Allow system to send emails</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button variant="outline">Test Email Configuration</Button>
                  </div>
                </div>
              )}
              
              {/* Payment Gateway Settings Content */}
              {activeTab === "payment" && (
                <div className="space-y-6">
                  <div className="border rounded-md p-4">
                    <h3 className="text-lg font-medium mb-4">Stripe Configuration</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="stripeKey">Publishable Key</Label>
                          <Input id="stripeKey" placeholder="pk_test_..." />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="stripeSecret">Secret Key</Label>
                          <Input id="stripeSecret" type="password" placeholder="sk_test_..." />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">Enable Stripe</Label>
                            <p className="text-sm text-gray-500">Allow payments via Stripe</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="text-lg font-medium mb-4">PayPal Configuration</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="paypalClientId">Client ID</Label>
                          <Input id="paypalClientId" placeholder="Client ID" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="paypalSecret">Secret</Label>
                          <Input id="paypalSecret" type="password" placeholder="Secret" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="paypalMode">Mode</Label>
                        <Select defaultValue="sandbox">
                          <SelectTrigger id="paypalMode">
                            <SelectValue placeholder="Select mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sandbox">Sandbox</SelectItem>
                            <SelectItem value="live">Live</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">Enable PayPal</Label>
                            <p className="text-sm text-gray-500">Allow payments via PayPal</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="text-lg font-medium mb-4">RazorPay Configuration</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="razorpayKey">Key ID</Label>
                          <Input id="razorpayKey" placeholder="Key ID" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="razorpaySecret">Secret Key</Label>
                          <Input id="razorpaySecret" type="password" placeholder="Secret Key" />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">Enable RazorPay</Label>
                            <p className="text-sm text-gray-500">Allow payments via RazorPay</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* API Settings Content */}
              {activeTab === "api" && (
                <div className="space-y-6">
                  <div className="border rounded-md p-4">
                    <h3 className="text-lg font-medium mb-4">Google Maps API</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="googleMapsKey">API Key</Label>
                        <Input id="googleMapsKey" placeholder="Enter Google Maps API Key" />
                        <p className="text-xs text-gray-500 mt-1">Used for displaying maps on the platform</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">Enable Maps</Label>
                            <p className="text-sm text-gray-500">Show maps on booking details</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="text-lg font-medium mb-4">Firebase Cloud Messaging</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fcmServerKey">FCM Server Key</Label>
                        <Input id="fcmServerKey" placeholder="Enter FCM Server Key" />
                        <p className="text-xs text-gray-500 mt-1">Used for sending push notifications</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">Enable Push Notifications</Label>
                            <p className="text-sm text-gray-500">Send push notifications to mobile devices</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="text-lg font-medium mb-4">SMS Gateway</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="smsApiKey">API Key</Label>
                          <Input id="smsApiKey" placeholder="Enter SMS API Key" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="smsSecret">Secret Key</Label>
                          <Input id="smsSecret" type="password" placeholder="Enter SMS Secret Key" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="smsProvider">Provider</Label>
                          <Select defaultValue="twilio">
                            <SelectTrigger id="smsProvider">
                              <SelectValue placeholder="Select SMS Provider" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="twilio">Twilio</SelectItem>
                              <SelectItem value="msg91">MSG91</SelectItem>
                              <SelectItem value="nexmo">Nexmo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">Enable SMS</Label>
                            <p className="text-sm text-gray-500">Send SMS notifications</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab !== "general" && activeTab !== "smtp" && activeTab !== "payment" && activeTab !== "api" && (
                <div className="py-12 text-center">
                  <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50">
                    <Settings className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-medium">Settings Module</h3>
                  <p className="text-gray-500 mt-2">This settings module is under construction. Check back soon for more configuration options.</p>
                </div>
              )}
              
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={() => toast({ description: "Changes were discarded" })}>
                  Cancel
                </Button>
                <Button onClick={handleSaveSettings} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
