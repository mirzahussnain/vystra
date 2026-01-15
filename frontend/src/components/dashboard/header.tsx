"use client";

import ModeToggle  from "@/components/ui/theme-toggler";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Ensure you have Avatar installed via Shadcn
import { Bell } from "lucide-react";
import { Breadcrumbs } from "./breadcrumbs";

const Header = () => {
  return (
    <header className="h-16 border-b border-border bg-background/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-10">
      
      {/* Left: Breadcrumbs or Page Title (Placeholder) */}
      <div className="font-semibold text-sm text-muted-foreground">
        <Breadcrumbs/>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <ModeToggle />
        
        <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Bell className="w-5 h-5" />
        </Button>
        
        <div className="h-8 w-px bg-border mx-1" />

        <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
                <p className="text-sm font-medium leading-none">John Developer</p>
                <p className="text-xs text-muted-foreground">Pro Plan</p>
            </div>
            <Avatar className="h-9 w-9 border border-border">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>JD</AvatarFallback>
            </Avatar>
        </div>
      </div>
    </header>
  );
}

export default Header;