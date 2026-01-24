import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/layouts/theme-provider";
import { Toaster } from "sonner";
import StoreProvider from "@/layouts/store-provider";
import {ClerkProvider} from "@clerk/nextjs"
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
  title: "InsightStream",
  description: "AI-Powered Video Search Engine & SaaS Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
            {children}
            <Toaster position="top-center" />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
