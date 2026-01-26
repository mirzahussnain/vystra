"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const Particles = ({ className = "" }: { className?: string }) => {
  const [mounted, setMounted] = useState(false);

  // Randomize particles only on client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Create 20 random particles
  const particles = Array.from({ length: 70 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100, // Random % position
    y: Math.random() * 100,
    size: Math.random() * 8 + 1, // Random size 1px-5px
    duration: Math.random() * 15 + 10, // Random speed 10s-30s
    delay: Math.random() * 5,
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/20 dark:bg-primary/40 blur-[1px]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -100, 0], // Float up and down
            x: [0, Math.random() * 50 - 25, 0], // Drift sideways
            opacity: [0, 1, 0], // Fade in and out
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};