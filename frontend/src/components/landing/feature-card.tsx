import { cn } from "@/lib/utils";

export const FeatureCard=({
  icon,
  title,
  color,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
  children: React.ReactNode;
}) =>{
  return (
    <div className="p-8 rounded-3xl border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all bg-white dark:bg-slate-950">
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center mb-6",
          color,
        )}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
        {title}
      </h3>
      <div className="text-slate-600 dark:text-slate-400 leading-relaxed">
        {children}
      </div>
    </div>
  );
}
