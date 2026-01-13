"use client";

const UseCaseMarquee = () => {
  const items = [
    "Podcasters", "Legal Teams", "Students", "YouTubers", "Journalists", "Researchers", 
    "Podcasters", "Legal Teams", "Students", "YouTubers", "Journalists", "Researchers"
  ];

  return (
    <section className="py-24 border-t border-border bg-background overflow-hidden select-none">
      
      {/* 1. TYPOGRAPHY: The "Eyebrow" Label */}
      {/* Small, Uppercase, Tracking Widest = Premium Feel */}
      <div className="container mx-auto px-6 text-center mb-12">
         <p className="text-sm font-bold text-primary uppercase tracking-[0.3em] opacity-80">
            Built for Everyone
         </p>
      </div>
      
      {/* 2. TYPOGRAPHY: The Scrolling Texture */}
      {/* Massive size, "Black" weight, Outline effect or Faint Opacity */}
      <div className="relative flex overflow-hidden group">
        
        {/* Gradient Masks to fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="animate-marquee whitespace-nowrap flex gap-16 items-center">
          {items.map((item, i) => (
            <span 
                key={i} 
                className="text-6xl md:text-8xl  leading-none font-black text-muted-foreground/10 hover:text-primary/20 transition-colors duration-500 cursor-default"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default UseCaseMarquee;
