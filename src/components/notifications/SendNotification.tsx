
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

export interface SendNotificationProps {
  onNotificationSent?: () => void;
}

export function SendNotification({ onNotificationSent }: SendNotificationProps) {
  const [recipient, setRecipient] = useState<string>("all");
  const [notificationType, setNotificationType] = useState<NotificationType>("General Announcement");
  const [title, setTitle] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      }
      
      await addNotification({
        type: notificationType,
        title,
        message,
        read: false,
        user_type,
        recipients,
      });
      
      toast({
        title: "Success",
        description: "Notification has been sent successfully"
      });
      
      // Reset form
      setTitle("");
      setMessage("");
      
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Notification</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              </SelectContent>
            </Select>
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
              </SelectContent>
            </Select>
          </div>
          
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
          
          <Button 
            type="submit" 
            className="w-full bg-primary" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Notification"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
