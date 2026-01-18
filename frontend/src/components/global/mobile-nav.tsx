"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/ui/logo";
import { useState } from "react";
import { MobileNavProps } from "@/lib/types";

const MobileNav = ({
  navItems,
  type,
}: {
  navItems: MobileNavProps[];
  type: string;
}) => {
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
        <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>{" "}
        {/* Accessibility Fix */}
       
          <div className="flex flex-col justify-center items-center gap-2 px-2 mb-8 mt-3">
            <Logo className="w-10 h-10 text-primary" />
            <span className="font-bold text-lg tracking-tight">
              Insight<span className="text-primary">Stream</span>
            </span>
          </div>
      
        {/* Vertical Links */}
        <div className="flex flex-col gap-4 pl-2 pr-6">
          {navItems.map((item) => (
            <MobileLink
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </MobileLink>
          ))}

          <div className="h-px bg-border my-4" />

          <Link href={`${type==="landing"?"/dashboard":"/"}`} onClick={() => setOpen(false)}>
            <Button className="w-full font-semibold">{type==="landing"?"Sign In":"Sign Out"}</Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};

interface MobileLinkProps extends React.ComponentProps<typeof Link> {
  children: React.ReactNode;
  onClick: () => void;
}

function MobileLink({ href, onClick, children, ...props }: MobileLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="px-3 text-foreground/70 hover:text-primary transition-colors text-lg font-medium py-2 block border-b-2"
      {...props}
    >
      {children}
    </Link>
  );
}

export default MobileNav;
