"use client";

import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import { useAuth } from "@clerk/nextjs";
import Loader from "@/components/global/loader";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, Suspense } from "react"; // 🟢 Added Suspense
import { useCreateCheckoutSessionMutation } from "@/store/api/subscriptionApi";
import { useGetUserStatsQuery } from "@/store/api/userApi";
import { toast } from "sonner";
import ErrorDisplayer from "@/components/global/error-displayer";
import { useDispatch } from "react-redux";
import { setStats } from "@/store/features/statsSlice";
import { RTQApiError, UserStats } from "@/lib/types";

//  1.  Handles Upgrade & URL Logic
const DashboardLogic = ({ stats, authLoaded, isSignedIn }: { stats: UserStats; authLoaded: boolean; isSignedIn: boolean }) => {
  const searchParams = useSearchParams(); 
  const router = useRouter();
  const [isProcessingUpgrade, setIsProcessingUpgrade] = useState(false);
  
  const [
    createCheckout,
    { isLoading: loadingCheckoutSession },
  ] = useCreateCheckoutSessionMutation();

  const hasTriggered = useRef(false);

  // Logic: Handle Auto-Upgrade from URL or LocalStorage
  useEffect(() => {
    if (!authLoaded || !isSignedIn || !stats || hasTriggered.current) {
      return;
    }

    const urlUpgrade = searchParams.get("upgrade") === "true";
    const urlPlan = searchParams.get("plan");
    
    const pendingPlan = localStorage.getItem("pending_plan_upgrade");
    const pendingExpiry = localStorage.getItem("pending_plan_expiry");
    
    const isExpired = pendingExpiry && Date.now() > parseInt(pendingExpiry);
    if (isExpired && pendingPlan) {
      localStorage.removeItem("pending_plan_upgrade");
      localStorage.removeItem("pending_plan_expiry");
    }
    
    const planToUpgrade = urlPlan || (isExpired ? null : pendingPlan);

    if (!planToUpgrade) {
      return;
    }

    if (stats?.plan === planToUpgrade) {
      toast.info(`You are already on the ${planToUpgrade} plan.`);
      if (urlUpgrade) router.replace("/dashboard");
      hasTriggered.current = true;
      return;
    }

    hasTriggered.current = true;
    setIsProcessingUpgrade(true);

    const initiateUpgrade = async () => {
      try {
        const result = await createCheckout({ planId: planToUpgrade }).unwrap();
        if (result) {
          window.location.href = result.url;
        }
      } catch (error: unknown) {
        console.error(" Auto-upgrade failed:", error);
        // Define ApiError type locally or use 'any'
        const err = error as RTQApiError; 
        const errorMsg = err?.data?.detail || err?.message || "Unknown error";
        toast.error(`Failed to initiate upgrade: ${errorMsg}`);
        router.replace("/dashboard");
        setIsProcessingUpgrade(false);
        hasTriggered.current = false;
      }
    };

    initiateUpgrade();
  }, [authLoaded, isSignedIn, stats, searchParams, createCheckout, router]);

  // Logic: Handle Payment Success/Cancel Toasts
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

  if (loadingCheckoutSession || isProcessingUpgrade) {
    return <Loader text="Setting up your upgrade..." />;
  }

  return null; // This component is invisible, it just handles logic
}

// 🟢 2. MAIN LAYOUT: Now clean and wraps logic in Suspense
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded: authLoaded, isSignedIn, sessionId, userId } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
    error: stats_error,
  } = useGetUserStatsQuery(undefined, {
    skip: !authLoaded || !isSignedIn || !sessionId || !userId,
  });

  // Sync Stats to Redux
  useEffect(() => {
    if (stats) {
      dispatch(setStats(stats));
    }
  }, [stats, dispatch]);

  if (!authLoaded || !sessionId) {
    return <Loader text="Verifying session..." />;
  }

  if (!isSignedIn) {
    router.push("/sign-in");
    return <Loader text="Redirecting to sign in..." />;
  }

  if (statsLoading) {
    return <Loader text="Loading user data..." />;
  }

  if (statsError) {
    const errorMessage = (stats_error as RTQApiError)?.data?.detail || "Failed to load dashboard";
    return <ErrorDisplayer error={errorMessage} />;
  }

  return (
    <div className="flex h-screen bg-muted/20 overflow-hidden">
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-background z-20">
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">
          
          {/*Auth and Plan Logic */}
          <Suspense fallback={<Loader text="Loading user data..." />}>
            <DashboardLogic 
              stats={stats} 
              authLoaded={authLoaded} 
              isSignedIn={isSignedIn} 
            />
          </Suspense>

          <div className="max-w-7xl mx-auto space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
}