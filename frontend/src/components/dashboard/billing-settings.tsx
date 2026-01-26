"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, CreditCard, CheckCircle, Zap } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useGetUserDetailsQuery } from "@/store/api/userApi";
import { useCreateCustomerPortalSessionMutation } from "@/store/api/subscriptionApi";
import { toast } from "sonner";

export default function BillingSettings() {
  const { user } = useUser();
  const { data: userData, isLoading: isUserLoading } = useGetUserDetailsQuery(user?.id);
  const [createPortal, { isLoading: isPortalLoading }] = useCreateCustomerPortalSessionMutation();

  const handleManageSubscription = async () => {
    try {
      const { url } = await createPortal().unwrap();
      window.location.href = url;
    } catch (error) {
      toast.error("Failed to load billing portal");
    }
  };

  if (isUserLoading) return <div className="h-48 flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  const isFree = userData?.plan === "free";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" /> 
          Current Plan
        </CardTitle>
        <CardDescription>
          Manage your subscription and billing details.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4 p-4 border rounded-lg bg-secondary/20">
          <div className="p-2 bg-primary/10 rounded-full">
            <CheckCircle className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-lg">
              {isFree ? "Free Tier" : "Pro Plan Active"}
            </p>
            <p className="text-sm text-muted-foreground">
              {isFree 
                ? "You are currently limited to standard processing speeds." 
                : "Your next billing cycle is handled securely via Stripe."}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t px-6 py-4 bg-muted/20">
        <div className="text-sm text-muted-foreground hidden sm:block">
          {isFree ? "Unlock full potential." : "Need to change cards?"}
        </div>
        
        {isFree ? (
          <Button onClick={() => window.location.href = "/pricing"} className="w-full sm:w-auto">
            Upgrade Now
          </Button>
        ) : (
          <Button 
            variant="outline" 
            onClick={handleManageSubscription}
            disabled={isPortalLoading}
            className="w-full sm:w-auto"
          >
            {isPortalLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!isPortalLoading && <CreditCard className="mr-2 h-4 w-4" />}
            Manage Subscription
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}