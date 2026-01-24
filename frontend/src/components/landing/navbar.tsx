import Link from "next/link";
import MobileNav from "../global/mobile-nav";
import Logo from "../ui/logo";
import { LogoV } from "../ui/logo-vystra";
import ModeToggle from "../ui/theme-toggler";
import { Button } from "../ui/button";
import { MobileNavProps } from "@/lib/types";
import { UserButton, useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export const Navbar = ({ navItems }: { navItems: MobileNavProps[] }) => {
  const { isSignedIn, isLoaded, user } = useUser();

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
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
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
            <UserButton />
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
