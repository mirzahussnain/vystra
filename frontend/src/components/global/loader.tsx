import { LogoV } from "@/components/ui/logo-vystra"; 
import { cn } from "@/lib/utils";

interface LoaderProps {
  text?: string;
  className?: string; 
}

const Loader = ({ text, className }: LoaderProps) => (
  <div className={cn("flex flex-col items-center justify-center h-screen w-full", className)}>
    
    {/* The Animated Wrapper */}
    <div className="animate-flip">
      {/* 
         - fill-primary ensures it matches  branding
      */}
      <LogoV className="max-w-24 text-primary fill-current" />
    </div>

    {/* Refined Text Typography */}
    <p className="mt-6 text-sm font-medium text-muted-foreground animate-pulse tracking-widest uppercase">
      {text || "Loading..."}
    </p>
  </div>
);

export default Loader;