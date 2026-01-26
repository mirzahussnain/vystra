"use client";

import { UserProfile } from "@clerk/nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Key, User } from "lucide-react";

import BillingSettings from "@/components/dashboard/billing-settings"; 

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full pb-10">
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

        {/* --- GENERAL TAB (Powered by Clerk) --- */}
        <TabsContent value="general" className="space-y-4">
           {/* 
              Clerk's UserProfile handles Avatar, Name, Email, Password, and 2FA automatically.
           */}
           <div className="flex justify-center sm:justify-start">
            <UserProfile 
              routing="hash"
              appearance={{
                elements: {
                  rootBox: "w-full shadow-none",
                  card: "shadow-sm border border-border bg-card w-full max-w-none",
                  // Hides the internal sidebar on mobile for better fit
                  navbar: "hidden md:flex", 
                }
              }}
            />
          </div>
        </TabsContent>

        {/* --- BILLING TAB (Powered by Stripe) --- */}
        <TabsContent value="billing" className="space-y-4">
            {/* 
               This component fetches real plan data and redirects to Stripe Portal.
            */}
            <BillingSettings />
        </TabsContent>

        {/* --- API KEYS TAB (Your Custom UI) --- */}
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