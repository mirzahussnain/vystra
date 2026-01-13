"use client";

import Sidebar  from "@/components/dashboard/sidebar";
import Header  from "@/components/dashboard/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-muted/20 overflow-hidden">
      {/* 1. Fixed Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-background z-20">
        <Sidebar />
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header (Mobile menu lives here) */}
        <Header />
        
        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}