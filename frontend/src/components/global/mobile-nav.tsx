"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Home, Menu } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MobileNavProps } from "@/lib/types";
import { LogoV } from "../ui/logo-vystra";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // 1. Import class merger

const MobileNav = ({
  navItems,
  type,
}: {
  navItems: MobileNavProps[];
  type: string;
}) => {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<MobileNavProps | null>(
    navItems[0] || null
  );
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  const isActivePath = (href: string) => pathname === href;

  useEffect(() => {
    if (type === "landing") {
      const handleScroll = () => {
        for (const navItem of navItems) {
          // 2. Safety: Handle if ID is missing or implied from href
          const elementId = navItem.id || navItem.href.replace("/#", "").replace("#", "");
          const element = document.getElementById(elementId);

          if (element) {
            const rect = element.getBoundingClientRect();
            // If section is roughly in the middle of viewport
            if (rect.top >= 0 && rect.top <= 300) {
              setActiveSection(navItem);
              break;
            }
          }
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [type, navItems]); // 3. Added dependencies

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-8 w-8" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[300px] sm:w-[400px] pr-0">
        <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>

        {/* Logo Section */}
        <div className="flex flex-col justify-center items-center gap-2  mb-8 mt-3 relative">
          <LogoV className="max-w-24"  />
          <span className="font-bold text-lg tracking-tight absolute translate-y-10 translate-x-2">
            Vy<span className="text-primary">stra</span>
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-4">
          {navItems.map((item) => {
             // 4.  Compare values, don't check object truthiness
             const isActive = 
                (type === 'landing' && activeSection?.href === item.href) || 
                (type !== 'landing' && isActivePath(item.href));

             return (
              <MobileLink
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                   // Base classes are handled in MobileLink, we only pass overrides here
                   isActive && "text-primary bg-border rounded-lg font-bold border-l-4 border-primary border-b-0"
                )}
              >
                {item.label}
              </MobileLink>
            )
          })}

          {/*<div className="h-px bg-border my-4" />*/}

            <div className="flex items-center justify-center px-3">
          {type === "landing" ? (
              <Link
                href={isSignedIn ? "/dashboard" : "/sign-in"}
                onClick={() => setOpen(false)}
                className="w-full"
              >
                <Button className="w-full font-semibold">
                  {isSignedIn ? "Go to Dashboard" : "Sign In"}
                </Button>
              </Link>
            ) : (
              <Link
                href={ "/"}
                onClick={() => setOpen(false)}
                className="w-full flex items-center justify-center bg-primary text-white px-3 py-1 text-sm font-semibold rounded-lg my-10 "
                >
                <Home size={20}/>
                 <span className="ml-2">Home</span>
                </Link>

              
          )}
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

interface MobileLinkProps extends React.ComponentProps<typeof Link> {
  children: React.ReactNode;
  onClick: () => void;
  className?: string; // Explicitly type className
}

function MobileLink({ href, onClick, children, className, ...props }: MobileLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
     
      className={cn(
        "px-4 py-3 text-foreground/70 hover:text-primary transition-all text-lg font-medium block border-b border-border/50 hover:bg-accent/20 rounded-md", 
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

export default MobileNav;