"use client";

import { motion } from "framer-motion";
import { Upload, Cpu, Database, Search, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "1. Secure Upload",
    desc: "Videos are streamed directly to Cloudflare R2 (S3-Compatible) with global edge delivery.",
    tech: "FastAPI + Cloudflare R2",
  },
  {
    icon: Cpu,
    title: "2. AI Inference",
    desc: "Distributed Celery workers process audio through Groq LPUs for lightning-fast transcription.",
    tech: "RabbitMQ + Celery + Groq AI",
  },
  {
    icon: Database,
    title: "3. Vector Indexing",
    desc: "Semantic text vectors and metadata are stored in Neon for instant, high-concurrency retrieval.",
    tech: "Postgres + pgvector + Neon",
  },
  {
    icon: Search,
    title: "4. Semantic Search",
    desc: "Query your library using natural language with a high-performance Next.js interface.",
    tech: "Next.js + Framer Motion",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-muted/50 dark:bg-background border-t border-border relative overflow-hidden" id="how-it-works">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
        
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            Under the <span className="text-primary">Hood</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built with a robust, event-driven microservices architecture.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector Line (Desktop Only) */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -z-10" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="relative flex flex-col items-center text-center group"
            >
              <div className="w-24 h-24 rounded-2xl bg-background border border-border shadow-sm flex items-center justify-center mb-6 relative z-10 group-hover:border-primary/50 group-hover:shadow-lg transition-all">
                <step.icon className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />

                {/* Number Badge */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-bold font-mono">
                  0{i + 1}
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed max-w-[200px]">
                {step.desc}
              </p>

              {/* Tech Badge */}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {step.tech}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
