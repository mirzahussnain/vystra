"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch"; // npm install @radix-ui/react-switch or npx shadcn@latest add switch
import { CreditCard, Key, User, Bell } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  
  const handleSave = () => {
    toast.success("Settings saved successfully.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general" className="gap-2"><User className="w-4 h-4"/> General</TabsTrigger>
          <TabsTrigger value="billing" className="gap-2"><CreditCard className="w-4 h-4"/> Billing</TabsTrigger>
          <TabsTrigger value="api" className="gap-2"><Key className="w-4 h-4"/> API Keys</TabsTrigger>
        </TabsList>

        {/* --- GENERAL TAB --- */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your public profile and email settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                
                {/* Avatar Section */}
                <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20 border">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <Button variant="outline" size="sm">Change Avatar</Button>
                        <p className="text-xs text-muted-foreground">JPG or PNG. Max 1MB.</p>
                    </div>
                </div>

                <Separator />

                {/* Form */}
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Display Name</Label>
                        <Input id="name" defaultValue="John Developer" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" defaultValue="john@example.com" />
                    </div>
                </div>

                {/* Notifications */}
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Bell className="w-4 h-4" /> Email Notifications
                        </label>
                        <p className="text-xs text-muted-foreground">
                            Receive emails when your video processing is complete.
                        </p>
                    </div>
                    <Switch defaultChecked />
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* --- BILLING TAB --- */}
        <TabsContent value="billing" className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Subscription Plan</CardTitle>
                    <CardDescription>
                        You are currently on the <strong className="text-primary">Pro Plan</strong>.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-full">
                                <CreditCard className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium">Visa ending in 4242</p>
                                <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                            </div>
                        </div>
                        <Badge variant="outline">Default</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Next billing date: <strong>January 1, 2025</strong>. Amount: <strong>$29.00</strong>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="ghost" className="text-red-500 hover:text-red-600">Cancel Subscription</Button>
                    <Button variant="outline">Update Payment Method</Button>
                </CardFooter>
            </Card>
        </TabsContent>

        {/* --- API KEYS TAB --- */}
        <TabsContent value="api" className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>API Access</CardTitle>
                    <CardDescription>
                        Manage your API keys for external integrations.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Standard Key</Label>
                        <div className="flex gap-2">
                            <Input value="sk_live_51J9z...x8q2" readOnly className="font-mono bg-muted" />
                            <Button variant="outline" size="icon">
                                <Key className="w-4 h-4" />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Do not share your secret key with anyone.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}