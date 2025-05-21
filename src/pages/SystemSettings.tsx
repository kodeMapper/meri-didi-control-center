
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Settings, Shield, Database, Smartphone, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SystemSettings() {
  const [username, setUsername] = useState("admin");
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords if they are provided
    if (password && password !== confirmPassword) {
      toast({
        title: "Password Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate API call
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings Updated",
        description: "Your account settings have been successfully saved.",
      });
      // Clear password fields after successful save
      setPassword("");
      setConfirmPassword("");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">System Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Configure your application settings and preferences</p>
      </div>

      <Tabs defaultValue="account">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64">
            <Card>
              <CardContent className="p-0">
                <TabsList className="flex flex-col w-full rounded-md h-auto bg-transparent">
                  <TabsTrigger value="account" className="justify-start w-full data-[state=active]:bg-gray-100 p-3 rounded-md">
                    <div className="flex items-center gap-2">
                      <Settings size={18} />
                      <span>Account Settings</span>
                    </div>
                  </TabsTrigger>
                  
                  <TabsTrigger value="database" className="justify-start w-full data-[state=active]:bg-gray-100 p-3 rounded-md">
                    <div className="flex items-center gap-2">
                      <Database size={18} />
                      <span>Database Connection</span>
                    </div>
                  </TabsTrigger>
                  
                  <TabsTrigger value="mobile" className="justify-start w-full data-[state=active]:bg-gray-100 p-3 rounded-md">
                    <div className="flex items-center gap-2">
                      <Smartphone size={18} />
                      <span>Mobile App Integration</span>
                    </div>
                  </TabsTrigger>
                  
                  <TabsTrigger value="help" className="justify-start w-full data-[state=active]:bg-gray-100 p-3 rounded-md">
                    <div className="flex items-center gap-2">
                      <HelpCircle size={18} />
                      <span>Help & Documentation</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex-1">
            <TabsContent value="account" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account settings and preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveChanges} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="username" className="text-sm font-medium">Username</label>
                        <Input 
                          id="username" 
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                        <p className="text-sm text-gray-500">This is your admin username.</p>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <p className="text-sm text-gray-500">Email for notifications and account recovery.</p>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="space-y-2">
                        <label htmlFor="new-password" className="text-sm font-medium">New Password</label>
                        <Input 
                          id="new-password" 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                        />
                        <p className="text-sm text-gray-500">Leave blank to keep current password.</p>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</label>
                        <Input 
                          id="confirm-password" 
                          type="password" 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black" disabled={isSaving}>
                      {isSaving ? "Saving Changes..." : "Save Changes"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="database" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Database Connection</CardTitle>
                  <CardDescription>
                    Configure your database connection settings.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="host" className="text-sm font-medium">Database Host</label>
                      <Input id="host" defaultValue="localhost" />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="port" className="text-sm font-medium">Database Port</label>
                      <Input id="port" defaultValue="5432" />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Database Name</label>
                      <Input id="name" defaultValue="admin_panel" />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="username" className="text-sm font-medium">Database Username</label>
                      <Input id="username" defaultValue="postgres" />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium">Database Password</label>
                      <Input id="password" type="password" value="••••••••" />
                    </div>
                    
                    <div className="pt-4">
                      <Button className="mr-2">Test Connection</Button>
                      <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">Save Connection</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="mobile" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Mobile App Integration</CardTitle>
                  <CardDescription>
                    Configure settings for mobile app integration.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="api-key" className="text-sm font-medium">API Key</label>
                      <div className="flex">
                        <Input id="api-key" defaultValue="sk_test_51JDq3AGHms73jfJK92MsZNIS9Hfd7d" className="flex-1" readOnly />
                        <Button className="ml-2">Copy</Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="webhook" className="text-sm font-medium">Webhook URL</label>
                      <Input id="webhook" defaultValue="https://api.example.com/webhook" />
                    </div>
                    
                    <div className="pt-4">
                      <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">Save Settings</Button>
                      <Button variant="outline" className="ml-2">Regenerate API Key</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="help" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Help & Documentation</CardTitle>
                  <CardDescription>
                    Access documentation and support resources.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-md font-medium">Documentation</h3>
                      <p className="text-sm text-gray-500 mt-1">Access comprehensive documentation for the admin panel.</p>
                      <Button variant="outline" className="mt-2">View Documentation</Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-md font-medium">Support</h3>
                      <p className="text-sm text-gray-500 mt-1">Contact our support team for assistance.</p>
                      <Button variant="outline" className="mt-2">Contact Support</Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-md font-medium">FAQs</h3>
                      <p className="text-sm text-gray-500 mt-1">Browse frequently asked questions.</p>
                      <Button variant="outline" className="mt-2">View FAQs</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
