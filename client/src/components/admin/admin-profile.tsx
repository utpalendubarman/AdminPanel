import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  Settings,
  User,
  Lock,
  Mail,
  Bell,
  Shield,
  Key,
  Save,
} from "lucide-react";

interface AdminSettings {
  notifications: boolean;
  twoFactor: boolean;
  emailAlerts: boolean;
}

export function AdminProfile() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AdminSettings>({
    notifications: true,
    twoFactor: false,
    emailAlerts: true,
  });

  // Dummy admin data
  const admin = {
    name: "Admin User",
    email: "admin@example.com",
    role: "Super Admin",
    avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=admin",
  };

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Manage your account details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={admin.avatar} alt={admin.name} />
              <AvatarFallback>{admin.name[0]}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">{admin.name}</h3>
              <p className="text-sm text-muted-foreground">{admin.role}</p>
              <p className="text-sm text-muted-foreground">{admin.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Manage your security preferences and authentication methods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
              <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="current-password"
                type="password"
                className="pl-8"
                placeholder="Enter current password"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Key className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="new-password"
                type="password"
                className="pl-8"
                placeholder="Enter new password"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Customize how you receive notifications and alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications about important updates
              </p>
            </div>
            <Button
              variant={settings.notifications ? "default" : "outline"}
              onClick={() =>
                setSettings(prev => ({
                  ...prev,
                  notifications: !prev.notifications
                }))
              }
            >
              {settings.notifications ? "Enabled" : "Disabled"}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Button
              variant={settings.twoFactor ? "default" : "outline"}
              onClick={() =>
                setSettings(prev => ({
                  ...prev,
                  twoFactor: !prev.twoFactor
                }))
              }
            >
              {settings.twoFactor ? "Enabled" : "Disabled"}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Receive important updates via email
              </p>
            </div>
            <Button
              variant={settings.emailAlerts ? "default" : "outline"}
              onClick={() =>
                setSettings(prev => ({
                  ...prev,
                  emailAlerts: !prev.emailAlerts
                }))
              }
            >
              {settings.emailAlerts ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
