"use client";

import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import { useAuth } from "@clerk/nextjs";
import Loader from "@/components/global/loader";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCreateCheckoutSessionMutation } from "@/store/api/subscriptionApi";
import { useGetUserStatsQuery } from "@/store/api/userApi";
import { toast } from "sonner";
import ErrorDisplayer from "@/components/global/error-displayer";
import { useDispatch } from "react-redux";
import { setStats } from "@/store/features/statsSlice";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded: authLoaded, isSignedIn, sessionId, userId } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessingUpgrade, setIsProcessingUpgrade] = useState(false);
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
    error: stats_error,
  } = useGetUserStatsQuery(undefined, {
    skip: !authLoaded || !isSignedIn || !sessionId || !userId,
  });
  const [
    createCheckout,
    {
      isLoading: loadingCheckoutSession,
      error: checkout_error,
      isError: checkoutError,
    },
  ] = useCreateCheckoutSessionMutation();
  // For Plan Upgrade Trigger
  const hasTriggered = useRef(false);
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (stats) {
      dispatch(setStats(stats));
    }
  }, [stats,dispatch]);

  useEffect(() => {
    // Don't run until user is loaded and stats are available
    if (
      !authLoaded ||
      !isSignedIn ||
      statsLoading ||
      !stats ||
      hasTriggered.current
    ) {
      return;
    }

    // Check URL params first
    const urlUpgrade = searchParams.get("upgrade") === "true";
    const urlPlan = searchParams.get("plan");
    
    // Check localStorage for pending upgrade (survives Clerk's OTP flow)
    const pendingPlan = localStorage.getItem("pending_plan_upgrade");
    const pendingExpiry = localStorage.getItem("pending_plan_expiry");
    
    
    const isExpired = pendingExpiry && Date.now() > parseInt(pendingExpiry);
    if (isExpired && pendingPlan) {
      
      localStorage.removeItem("pending_plan_upgrade");
      localStorage.removeItem("pending_plan_expiry");
    }
    
    const planToUpgrade = urlPlan || (isExpired ? null : pendingPlan);

    if (!planToUpgrade) {
      console.log("No upgrade needed - no plan specified");
      return;
    }

    // Check if already on the plan
    if (stats?.plan === planToUpgrade) {
      toast.info(`You are already on the ${planToUpgrade} plan.`);

      if (urlUpgrade) {
        router.replace("/dashboard");
      }
      hasTriggered.current = true;
      return;
    }

    // Mark as triggered
    hasTriggered.current = true;
    setIsProcessingUpgrade(true);

    const initiateUpgrade = async () => {
      try {
        const result = await createCheckout({ planId: planToUpgrade }).unwrap();

        if (result) {
          // Force redirect
          window.location.href = result.url;
        } else {
          throw new Error("No checkout URL returned");
        }
      } catch (error: any) {
        console.error("❌ Auto-upgrade failed:", error);

        const errorMsg =
          error?.data?.detail || error?.message || "Unknown error";
        toast.error(`Failed to initiate upgrade: ${errorMsg}`);
        // Clean up URL
        router.replace("/dashboard");

        setIsProcessingUpgrade(false);
        // Reset trigger so user can try again
        hasTriggered.current = false;
      }
    };

    initiateUpgrade();
  }, [
    authLoaded,
    isSignedIn,
    statsLoading,
    stats,
    searchParams,
    createCheckout,
    router,
  ]);

  useEffect(() => {
    const payment = searchParams.get("payment");

    if (payment === "success") {
      toast.success("Plan successfully updated! 🎉");
      router.replace("/dashboard");
    } else if (payment === "cancelled") {
      toast.error("Checkout cancelled");
      router.replace("/dashboard");
    }
  }, [searchParams, router]);

  if (!authLoaded || !sessionId) {
    return <Loader text="Verifying session..." />;
  }

  if (!isSignedIn) {
    router.push("/sign-in");
    return <Loader text="Redirecting to sign in..." />;
  }

  if (loadingCheckoutSession || isProcessingUpgrade) {
    return <Loader text="Setting up your upgrade..." />;
  }

  if (statsLoading) {
    return <Loader text="Loading user data..." />;
  }

  // ERROR HANDLING
  if (checkoutError || statsError) {
    const errorMessage =
      (stats_error as any)?.data?.detail ||
      (checkout_error as any)?.data?.detail ||
      "Failed to load dashboard";

    return <ErrorDisplayer error={errorMessage} />;
  }

  return (
    <div className="flex h-screen bg-muted/20 overflow-hidden">
      {/* 1. Fixed Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-background z-20">
        <Sidebar />
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header (Mobile menu lives here) */}
        <Header />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">
          <div className="max-w-7xl mx-auto space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
