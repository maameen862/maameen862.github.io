import { motion } from "framer-motion";
import { usePortfolio } from "@/lib/portfolioStore";
import { SectionLabel } from "./About";

export const Skills = () => {
  const portfolio = usePortfolio();
  return (
    <section
      id="skills"
      className="py-24 md:py-32 border-t border-hairline relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-radial opacity-40 pointer-events-none" />
      <div className="container relative">
        <SectionLabel index="03" label="Toolkit" />

        <div className="mt-12 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.04] text-balance">
              The stack I use to{" "}
              <span className="italic text-primary">ship insights.</span>
            </h2>
            <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-md">
              Every tool below is rated by hands-on production use — not
              tutorials. Bars represent fluency across recent dashboards &
              analyses.
            </p>
          </div>

          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-x-10 gap-y-8 lg:pl-8 lg:border-l lg:border-hairline">
            {portfolio.skills.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                className="group"
              >
                <div className="flex items-baseline justify-between mb-3">
                  <div className="flex items-baseline gap-3 min-w-0">
                    <span className="font-mono text-[10px] text-primary shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-xl md:text-2xl text-foreground truncate">
                      {s.name}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-primary shrink-0">
                    {s.level}
                    <span className="text-muted-foreground">/100</span>
                  </span>
                </div>
                <div className="h-px w-full bg-border overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.level}%` }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1.2,
                      delay: 0.2 + i * 0.04,
                      ease: [0.65, 0, 0.35, 1],
                    }}
                    className="h-px bg-primary shadow-glow"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
