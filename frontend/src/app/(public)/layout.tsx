"use client";

import Footer from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { MobileNavProps } from "@/lib/types";


const Layout = ({ children }: { children: React.ReactNode }) => {
  
  const navItems: MobileNavProps[] = [
    { label: "Home", href: "/" },
    { label: "Features", href: "#" },
    { label: "How it Works", href: "#" },
    { label: "Pricing", href: "/pricing" },
    { label: "Docs", href: "#" },
  ];
  return (
    <div className="flex min-h-screen flex-col bg-background">
     <Navbar navItems={navItems} />

      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
