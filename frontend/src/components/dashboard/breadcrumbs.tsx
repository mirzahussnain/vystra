"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import React from "react";

export function Breadcrumbs() {
  const pathname = usePathname();
  
  // 1. Split path into segments (e.g., /dashboard/videos -> ['dashboard', 'videos'])
  const segments = pathname.split("/").filter((item) => item !== "");

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-muted-foreground">
      
      {/* Home Icon (Dashboard Root) */}
      <Link 
        href="/dashboard" 
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>

      {segments.map((segment, index) => {
        // 2. Build the URL for this specific crumb
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        
        // 3. Format the label (Capitalize first letter, remove dashes)
        const isLast = index === segments.length - 1;
        let label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

        // Optional: Shorten long UUIDs if they appear in URL
        if (segment.length > 20) {
            label = "Details"; // Or segment.substring(0, 8) + "..."
        }

        return (
          <React.Fragment key={href}>
            <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            
            {isLast ? (
              // Last item: Text only (not clickable)
              <span className="font-semibold text-foreground">
                {label}
              </span>
            ) : (
              // Middle items: Links
              <Link 
                href={href} 
                className="hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}