import { motion } from "framer-motion";
import { usePortfolio } from "@/lib/portfolioStore";
import { ArrowDown, MapPin } from "lucide-react";

export const Hero = () => {
  const { hero, stats } = usePortfolio();
  const year = new Date().getFullYear();

  return (
    <section
      id="top"
      className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24"
    >
      {/* atmospheric layers */}
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />
      <div className="absolute top-1/3 -left-40 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-40 h-[28rem] w-[28rem] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="container relative">
        {/* Masthead strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-y border-hairline py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
        >
          <span className="text-primary">Portfolio</span>
          <span className="hidden sm:block h-px w-full bg-border" />
          <span className="text-right">
            &nbsp;DATA ANALYTICS
          </span>
        </motion.div>

        {/* Status + meta */}
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-primary">
              {hero.availability}
            </span>
          </motion.div>
          <span className="hidden md:inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> {hero.location}
          </span>
        </div>

        {/* Editorial overline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-12 font-mono text-xs uppercase tracking-[0.4em] text-primary"
        >
          HELLO, I'M
        </motion.p>

        {/* Massive editorial name */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="font-display mt-4 text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[11.5rem] leading-[0.86] tracking-tight text-balance text-foreground"
        >
          {hero.name.split(" ")[0]}
          <br />
          <span className="italic text-primary pl-[0.05em] md:pl-[0.08em]">
            {hero.name.split(" ").slice(1).join(" ")}
          </span>
        </motion.h1>

        {/* Role + tagline band */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-14 grid gap-8 md:gap-12 md:grid-cols-12 items-start border-t border-hairline pt-10"
        >
          <div className="md:col-span-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
              — Discipline
            </div>
            <div className="mt-3 font-display text-3xl md:text-4xl italic text-foreground leading-tight">
              {hero.role}
            </div>
          </div>

          <div className="md:col-span-7 md:border-l md:border-hairline md:pl-10">
            <p className="font-about-display text-2xl md:text-3xl leading-snug text-foreground/90 italic text-balance">
              “{hero.tagline}”
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground shadow-glow transition hover:bg-primary/90"
              >
                See work
                <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-sm border border-hairline px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-foreground hover:border-primary hover:text-primary transition"
              >
                Get in touch
              </a>
            </div>
          </div>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px border border-hairline rounded-sm overflow-hidden bg-border"
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="bg-card/80 backdrop-blur p-6 md:p-8 group hover:bg-card transition-colors"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary mb-3">
                0{i + 1}
              </div>
              <div className="font-display text-5xl md:text-6xl text-foreground leading-none">
                {s.value}
              </div>
              <div className="mt-3 text-xs text-muted-foreground font-mono uppercase tracking-widest">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
