"use client";

import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react"; // 1. Import Suspense

// 2. Create the internal component that uses search params
function SignUpContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const { resolvedTheme } = useTheme();

  const redirectUrl = plan
    ? `/dashboard?upgrade=true&plan=${plan}`
    : "/dashboard";

  useEffect(() => {
    if (plan) {
      localStorage.setItem("pending_plan_upgrade", plan);

      // Also store timestamp to auto-expire after 1 hour
      const expiryTime = Date.now() + 60 * 60 * 1000; // 1 hour from now
      localStorage.setItem("pending_plan_expiry", expiryTime.toString());
    }
  }, [plan]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="p-4">
        <SignUp
          
          fallbackRedirectUrl={redirectUrl}
          forceRedirectUrl={redirectUrl}
        />
      </div>
    </div>
  );
}

// 3. Default export wraps the content in Suspense
export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          Loading...
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  );
}
