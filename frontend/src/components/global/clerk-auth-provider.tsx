"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ClerkAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();
   const [mounted, setMounted] = useState(false);
 
   useEffect(() => {
     setMounted(true);
   }, []);
 
   // Don't apply dark theme until mounted to avoid hydration mismatch
   const isDark = mounted && resolvedTheme === "dark";

  return (
    <ClerkProvider
      
        // If the theme is dark, apply the 'dark' base theme. 
        // If light, undefined (which defaults to Clerk's light theme).
        appearance={{
          baseTheme: isDark ? dark : undefined,
          variables: {
            colorBackground: isDark ? "#1f2937" : "#ffffff",
            colorText: isDark ? "#f9fafb" : "#111827",
            colorPrimary: "#7949de",
            colorInputBackground: isDark ? "#374151" : "#ffffff",
            colorInputText: isDark ? "#f9fafb" : "#111827",
          },
          elements: {
            formButtonPrimary: "bg-green-600 hover:bg-green-700 text-white",
            card: "shadow-xl",
            socialButtonsBlockButton: isDark 
              ? "bg-gray-800 border-gray-700 hover:bg-gray-700" 
              : "bg-white border-gray-300 hover:bg-gray-50",
            formFieldInput: isDark
              ? "bg-gray-800 border-gray-700 text-gray-100"
              : "bg-white border-gray-300 text-gray-900",
          },
        }}
      
    >
      {children}
    </ClerkProvider>
  );
}