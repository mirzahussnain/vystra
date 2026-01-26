import Link from "next/link";
import MobileNav from "../global/mobile-nav";

import { LogoV } from "../ui/logo-vystra";
import ModeToggle from "../ui/theme-toggler";
import { Button } from "../ui/button";
import { MobileNavProps } from "@/lib/types";
import {  useUser } from "@clerk/nextjs";
import UserProfileButton from "../global/user-profile-button";
import { useEffect, useState } from "react";


export const Navbar = ({ navItems }: { navItems: MobileNavProps[] }) => {
  const { isSignedIn, isLoaded } = useUser();
  const [activeSection, setActiveSection] = useState(null);
  useEffect(() => {
      
  
      const handleScroll = () => { 
        // Add ids to your other sections too!
        
        for (const navItem of navItems) {
          const element = document.getElementById(navItem.id);
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
    });
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Left: Logo (Desktop) OR Mobile Menu (Mobile) */}
        <div className="flex items-center  gap-0">
          {/* MOBILE NAV */}
          <MobileNav navItems={navItems} type="landing" />

          {/* Logo Link */}
          <Link href="/" className="flex items-center ">
            <LogoV className="max-w-12" />
            <span className="font-bold text-xl tracking-tight text-foreground">
              ystra
              {/*Insight<span className="text-primary">Stream</span>*/}
            </span>
          </Link>
        </div>

        {/* Middle: Navigation Links (Hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`${activeSection === item ? "text-primary border-b-2 border-primary" : "text-sm font-medium text-muted-foreground transition-colors hover:text-primary"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <ModeToggle />

          {!isLoaded ? (
            <div className="hidden sm:block w-20 h-9 rounded-md bg-muted/70 animate-pulse"></div>
          ) : isSignedIn ? (
            <UserProfileButton/>
          ) : (
            <Link href="/dashboard">
              <Button
                size="sm"
                className="hidden sm:flex font-semibold shadow-lg shadow-primary/20 cursor-pointer"
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
