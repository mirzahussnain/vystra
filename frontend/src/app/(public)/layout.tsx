"use client";

import Footer from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { MobileNavProps } from "@/lib/types";

  const navItems: MobileNavProps[] = [
    { label: "Home", href: "/",id:"home" },
    { label: "Features", href: "#features", id: "features" },
    {label:"Demo",href:"#demo-section",id:"demo-section"},
    { label: "Pricing", href: "#pricing",id:"pricing" },
    { label: "Working", href: "#how-it-works",id:"how-it-works" },
    // { label: "Docs", href: "#docs",id:"docs" },
  ];

const Layout = ({ children }: { children: React.ReactNode }) => {
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
     <Navbar navItems={navItems} />

      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
