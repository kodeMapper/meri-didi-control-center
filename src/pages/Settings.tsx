
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

function Settings() {
  const [username, setUsername] = useState("admin");
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();

  const handleSaveChanges = () => {
    if (password && password !== confirmPassword) {
      toast({
        title: "Password Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    // In a real app, you would save these settings to the database
    toast({
      title: "Settings Saved",
      description: "Your settings have been saved successfully",
    });
  };

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
        System Settings
      </h1>

      <Tabs defaultValue="account" className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b">
            <TabsList className="flex h-auto p-0">
              <TabsTrigger
                value="account"
                className="flex-1 h-12 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Account Settings
              </TabsTrigger>
              <TabsTrigger
                value="database"
                className="flex-1 h-12 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Database Connection
              </TabsTrigger>
              <TabsTrigger
                value="mobile"
                className="flex-1 h-12 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Mobile App Integration
              </TabsTrigger>
              <TabsTrigger
                value="help"
                className="flex-1 h-12 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Help & Documentation
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="account" className="p-6 pt-8">
            <div className="max-w-2xl">
              <h2 className="text-xl font-semibold mb-2">Account Settings</h2>
              <p className="text-gray-500 mb-8">Manage your account settings and preferences.</p>

              <div className="space-y-6">
                <div className="space-y-1">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <p className="text-sm text-gray-500">This is your admin username.</p>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-500 ml-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">Email for notifications and account recovery.</p>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <p className="text-sm text-gray-500">Leave blank to keep current password.</p>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleSaveChanges}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="database" className="p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-2">Database Connection</h2>
            <p className="text-gray-500 mb-6">Configure your Supabase database connection settings.</p>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <Label>Supabase URL</Label>
                <Input value="https://xxxxxxxxxxxx.supabase.co" readOnly />
              </div>
              
              <div className="space-y-1">
                <Label>Supabase Key</Label>
                <Input value="•••••••••••••••••••••••••••••••••••••••••" type="password" readOnly />
              </div>
              
              <div className="flex items-center gap-4">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Test Connection
                </Button>
                <Button variant="outline">
                  Reset Connection
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mobile" className="p-6">
            <h2 className="text-xl font-semibold mb-2">Mobile App Integration</h2>
            <p className="text-gray-500 mb-6">Configure your Flutter mobile app integration settings.</p>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <Label>API Endpoint</Label>
                <Input value="https://api.merididi.com/v1" readOnly />
              </div>
              
              <div className="space-y-1">
                <Label>Mobile App Version</Label>
                <div className="flex items-center gap-2">
                  <Input value="1.2.0" />
                  <Button variant="outline">Update</Button>
                </div>
              </div>
              
              <div className="space-y-1">
                <Label>Force Update</Label>
                <div className="flex items-center gap-2">
                  <Input placeholder="Minimum required version" />
                  <Button variant="outline">Set</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="help" className="p-6">
            <h2 className="text-xl font-semibold mb-2">Help & Documentation</h2>
            <p className="text-gray-500 mb-6">Access helpful resources and documentation.</p>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 hover:border-primary hover:shadow-md transition-all">
                  <h3 className="font-medium text-lg mb-2">Admin Panel Guide</h3>
                  <p className="text-gray-500 mb-4">Learn how to use all features of the admin panel.</p>
                  <Button variant="outline" size="sm">View Guide</Button>
                </div>
                
                <div className="border rounded-lg p-4 hover:border-primary hover:shadow-md transition-all">
                  <h3 className="font-medium text-lg mb-2">API Documentation</h3>
                  <p className="text-gray-500 mb-4">Technical documentation for developers.</p>
                  <Button variant="outline" size="sm">View Docs</Button>
                </div>
                
                <div className="border rounded-lg p-4 hover:border-primary hover:shadow-md transition-all">
                  <h3 className="font-medium text-lg mb-2">FAQ</h3>
                  <p className="text-gray-500 mb-4">Frequently asked questions about the platform.</p>
                  <Button variant="outline" size="sm">View FAQ</Button>
                </div>
                
                <div className="border rounded-lg p-4 hover:border-primary hover:shadow-md transition-all">
                  <h3 className="font-medium text-lg mb-2">Contact Support</h3>
                  <p className="text-gray-500 mb-4">Get help from our technical support team.</p>
                  <Button variant="outline" size="sm">Contact</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export default Settings;
