import type { Metadata } from "next";
import {  Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/layouts/theme-provider";
import { Toaster } from "sonner";
import StoreProvider from "@/layouts/store-provider";

import ClerkAuthProvider from "@/components/global/clerk-auth-provider";
import { cn } from "@/lib/utils";
import BackendWaker from "@/components/global/backend-waker";
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });
//
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vystra",
  description: "AI-Powered Video Search Engine & SaaS Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className,"custom-scrollbar")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkAuthProvider>
            <StoreProvider >
              <BackendWaker/>
              {children}
              <Toaster position="top-center" />
            </StoreProvider>
          </ClerkAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
