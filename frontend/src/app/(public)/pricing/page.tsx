"use client";

import { useState } from "react";
import {
  Check,
  Search,
  Zap,
  FileText,
  Sparkles,
  X,
  ArrowDown,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PLANS } from "@/constants/plans";
import { type PlanId } from "@/lib/types";
import { FeatureCard } from "@/components/landing/feature-card";
import { useUser } from "@clerk/nextjs";
import {
  useGetUserDetailsQuery,
 
} from "@/store/api/userApi";
import { useRouter } from "next/navigation";
import { useCreateCheckoutSessionMutation } from "@/store/api/subscriptionApi";


export default function PricingPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded: userLoaded, user } = useUser();
  const {
    data: userData,
    isLoading: userDetailsLoading,
    isError: userDetailsError,
    error: detailsError,
  } = useGetUserDetailsQuery(user?.id, {
    skip: !isSignedIn || !user || !userLoaded,
  });
  const [
    createCheckoutSession,
    { data: checkoutSession, isLoading:isCreatingCheckout, error: checkoutSessionError },
  ] = useCreateCheckoutSessionMutation();
  // 1. STATE: Default to 'pro' so users see the best value first
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>("pro");
  const [loadingPlanId, setLoadingPlanId] = useState<PlanId | null>(null);
  // Helper to find the active plan object
  const activePlan = PLANS.find((p) => p.id === selectedPlanId) || PLANS[1];
  const isSearchLocked = activePlan.limits.semanticSearch === false;

  const handlePlanAction = async (plan: (typeof PLANS)[0]) => {
    if (!isSignedIn) {
      return router.push(`/sign-up?plan=${plan.id}`);
    }
    if (plan.id === "enterprise") {
      return router.push("/contact-us");
    }
    if (userData.plan === plan.id) {
      return;
    }

    // UPGRADE FLOW (Free -> Pro)
    try {
      setLoadingPlanId(plan.id as PlanId);
      await createCheckoutSession({planId: plan.id}).unwrap();

      if (checkoutSession) {
        window.location.href = checkoutSession.url;
      } else {
        console.log("Failed to upgrade user plan");
      }
    } catch (error) {
      const err = error as { data?: { detail?: string } };
      console.error("Error:", err?.data?.detail);
    }
    finally {
      setLoadingPlanId(null);
    }
  };

  // --- HELPER FOR BUTTON TEXT ---
  const getButtonText = (plan: (typeof PLANS)[0]) => {
    if (isCreatingCheckout && loadingPlanId === plan.id) return "Processing...";
    if (!isSignedIn) return "Get Started";
    if (plan.id === "enterprise") return "Contact Sales";
    if (userData?.plan === plan.id) return "Current Plan";
    if (userData?.plan === "pro" && plan.id === "free")
      return "Manage Subscription"; // Or "Downgrade"
    return "Upgrade";
  };
  return (
    <div className="min-h-screen bg-card">
      {/* --- SECTION 1: PRICING CARDS --- */}
      <section className="py-32 container mx-auto px-4 relative" id="pricing">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-5xl font-bold pb-1  bg-clip-text bg-linear-to-r  text-transparent from-primary to-purple-500 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Click a plan below to see how it powers up your workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PLANS.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const isCurrentPlan = isSignedIn && userData?.plan === plan.id;
            return (
              <div
                key={plan.id}
                // 2. INTERACTION: Clicking/Hovering updates the state
                onClick={() => setSelectedPlanId(plan.id as PlanId)}
                className={cn(
                  "cursor-pointer relative p-8 rounded-2xl border transition-all duration-300 group",
                  isSelected
                    ? "border-primary bg-accent/50 dark:bg-accent/60  shadow-xl scale-105 z-10 ring-1 ring-ring"
                    : "border-border bg-card  hover:border-primary/40 opacity-80 hover:opacity-100",
                )}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                    Most Popular
                  </Badge>
                )}

                <h3
                  className={cn(
                    "font-bold text-lg",
                    isSelected ? "text-primary" : "text-secondary-foreground",
                  )}
                >
                  {plan.name}
                </h3>
                <div className="my-4">
                  <span
                    className={cn(
                      "text-4xl font-bold",
                      isSelected ? "text-primary" : "text-secondary-foreground",
                    )}
                  >
                    {plan.price.monthly}
                  </span>
                  <span className="text-sm text-secondary-foreground/90">
                    /mo
                  </span>
                </div>

                {/* Simple List for the card */}
                <ul className="space-y-3 mb-8">
                  {plan.features.slice(0, 3).map((feat) => (
                    <li
                      key={feat}
                      className="flex gap-2 text-sm text-secondary-foreground/70"
                    >
                      <Check className="w-4 h-4 text-green-500" /> {feat}
                    </li>
                  ))}
                  {/* Missing Features (The FOMO Trigger) */}
                  {plan.missing?.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-3 text-sm text-muted-foreground/50"
                    >
                      <div className="mt-0.5 p-0.5 rounded-full bg-slate-100 dark:bg-slate-800 shrink-0">
                        <X className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <span className="line-through">{feat}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  size="lg"
                  disabled={isCreatingCheckout || isCurrentPlan || !isSelected} // Disable if loading or if it's their current plan
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent clicking the button from selecting the card (optional)
                    handlePlanAction(plan);
                  }}
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "w-full font-semibold transition-all cursor-pointer",
                    isSelected
                      ? "shadow-lg shadow-primary/25"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {isCreatingCheckout && loadingPlanId === plan.id && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {getButtonText(plan)}
                </Button>
              </div>
            );
          })}
        </div>
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 outline-0 max-auto my-2
          bg-transparent border-none max-w-fit animate-pulse cursor-pointer
          flex max-sm:flex-col items-center justify-center gap-2 text-sm font-light text-secondary-foreground text-center"
        >
          <span>
            {`Scroll Down To See Details of ${selectedPlanId.replace(selectedPlanId.charAt(0), selectedPlanId.charAt(0).toUpperCase())} Plan`}
          </span>
          <ArrowDown size={15} />
        </div>
      </section>

      {/* --- SECTION 2: DYNAMIC FEATURE GRID --- */}
      {/* This section updates automatically based on 'activePlan' state */}
      {/* --- SECTION 2: DYNAMIC FEATURE GRID --- */}
      <section className="py-20 bg-accent/30 border-t border-border">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground">
              What you get with{" "}
              <span className="text-primary">{activePlan.name}</span>:
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. SEMANTIC SEARCH CARD (With Locking Logic) */}
            <div
              className={cn(
                "p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden",
                isSearchLocked
                  ? "bg-muted/50 border-border border-dashed opacity-80" // Locked Style
                  : "bg-purple-500/10 border-purple-500/20 hover:shadow-lg hover:border-purple-500/40", // Unlocked Style
              )}
            >
              {isSearchLocked && (
                <div className="absolute top-4 right-4 bg-background p-2 rounded-full shadow-sm border border-border">
                  <X className="w-4 h-4 text-muted-foreground" />
                </div>
              )}

              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-6",
                  isSearchLocked
                    ? "bg-muted text-muted-foreground"
                    : "bg-purple-500/20 text-purple-600 dark:text-purple-400",
                )}
              >
                <Search className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3">
                Semantic Video Search
              </h3>

              <div className="text-muted-foreground leading-relaxed">
                {isSearchLocked ? (
                  <p>
                    Find exact moments by describing them. <br />
                    <span
                      onClick={() => setSelectedPlanId("pro")}
                      className="font-semibold text-primary cursor-pointer hover:underline"
                    >
                      Select Pro Plan
                    </span>{" "}
                    to unlock this capability.
                  </p>
                ) : (
                  <p>
                    Find exact moments instantly. You have{" "}
                    <strong>unlimited access</strong> to deep semantic search
                    across all your video archives.
                  </p>
                )}
              </div>
            </div>

            {/* 2. INFRASTRUCTURE CARD */}
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-blue-500" />}
              title="Lightning Infrastructure"
              color="bg-blue-500/20"
            >
              <p>
                Powered by Celery & Redis. Your storage limit is{" "}
                <strong className="text-blue-600 dark:text-blue-400 text-lg">
                  {activePlan.limits.storage}
                </strong>
                .{" "}
                {activePlan.id === "free"
                  ? "Great for short clips and testing."
                  : "Enough for serious content archives."}
              </p>
            </FeatureCard>

            {/* 3. TRANSCRIPT CARD */}
            <FeatureCard
              icon={<FileText className="w-6 h-6 text-green-500" />}
              title="Full Transcripts"
              color="bg-green-500/20"
            >
              <p>
                Speaker-diarized export. You can process up to{" "}
                <strong className="text-green-600 dark:text-green-400 text-lg">
                  {typeof activePlan.limits.minutes === "number"
                    ? `${activePlan.limits.minutes / 60} hours`
                    : activePlan.limits.minutes}
                </strong>{" "}
                of video monthly.
              </p>
            </FeatureCard>

            {/* 4. AI ACTIONS (With Free Plan Warning) */}
            <FeatureCard
              icon={<Sparkles className="w-6 h-6 text-pink-500" />}
              title="AI Intelligence"
              color="bg-pink-500/20"
            >
              <p className="mb-3">
                Includes{" "}
                <strong className="text-pink-600 dark:text-pink-400">
                  {activePlan.limits.aiActions} AI Actions
                </strong>{" "}
                for summarization and Q&A.
              </p>

              {/* WARNING BOX FOR FREE USERS */}
              {activePlan.id === "free" && (
                <div className="flex gap-2 p-3 rounded-lg bg-background/50 border border-pink-500/20 text-xs text-muted-foreground">
                  <span className="shrink-0">⚠️</span>
                  <span>
                    After 3 actions, AI features pause until next month.
                  </span>
                </div>
              )}
            </FeatureCard>
          </div>
        </div>
      </section>
    </div>
  );
}
