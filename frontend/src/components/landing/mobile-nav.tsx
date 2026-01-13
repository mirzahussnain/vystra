"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import Logo  from "@/components/ui/logo";
import { useState } from "react";

const MobileNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      
      {/* The Trigger (Hamburger Icon) */}
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-8 w-8" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>

      {/* The Side Drawer Content */}
      <SheetContent side="left" className="w-[300px] sm:w-[400px] pr-0">
        
        {/* Header inside the menu */}
        <SheetTitle className="sr-only">Mobile Navigation</SheetTitle> {/* Accessibility Fix */}
        <div className="flex items-center gap-2 px-2 mb-8 mt-3">
          <Logo className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg tracking-tight">
            Insight<span className="text-primary">Stream</span>
          </span>
        </div>

        {/* Vertical Links */}
        <div className="flex flex-col gap-4 pl-2 pr-6">
          <MobileLink href="#" onClick={() => setOpen(false)}>
            Features
          </MobileLink>
          <MobileLink href="#" onClick={() => setOpen(false)}>
            How it Works
          </MobileLink>
          <MobileLink href="#" onClick={() => setOpen(false)}>
            Pricing
          </MobileLink>
          <MobileLink href="#" onClick={() => setOpen(false)}>
            Docs
          </MobileLink>

          <div className="h-px bg-border my-4" />

          <Link href="/dashboard" onClick={() => setOpen(false)}>
             <Button className="w-full font-semibold">Sign In</Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface MobileLinkProps extends React.ComponentProps<typeof Link> {
  children: React.ReactNode;
  onClick: () => void;
}

function MobileLink({ href, onClick, children, ...props }: MobileLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-foreground/70 hover:text-primary transition-colors text-lg font-medium py-2 block"
      {...props}
    >
      {children}
    </Link>
  );
}

export default MobileNav;