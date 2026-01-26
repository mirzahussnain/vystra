"use client";

import Logo from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  PlaySquare,
  Settings,
  PlusCircle,
  Home,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Router from "next/router";
import { LogoV } from "../ui/logo-vystra";

const navItems = [
  { icon: LayoutGrid, label: "Overview", href: "/dashboard" },
  { icon: PlaySquare, label: "My Library", href: "/dashboard/library" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="h-16 flex items-center px-6 border-b border-border/50">
        <Link href="/" className="flex items-center ">
          <LogoV className="max-w-12" />
          <span className="font-bold text-xl tracking-tight text-foreground">
            ystra
            {/*Insight<span className="text-primary">Stream</span>*/}
          </span>
        </Link>
      </div>

      {/* Main Nav */}
      <div className="flex-1 py-6 px-4 space-y-2">
        {/* Upload Button (Primary Action) */}
        <Link href="/dashboard/upload">
          <Button
            className="w-full justify-start gap-2 mb-6 shadow-md"
            size="lg"
          >
            <PlusCircle className="w-5 h-5" />
            New Upload
          </Button>
        </Link>

        <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Menu
        </p>

        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 h-12 text-base font-normal",
                pathname === item.href
                  ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Button>
          </Link>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-border/50 ">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-red-500 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Home className="w-4 h-4" />
          Home
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
