import { motion } from "framer-motion";
import { usePortfolio } from "@/lib/portfolioStore";
import { SectionLabel } from "./About";

export const Experience = () => {
  const portfolio = usePortfolio();
  return (
    <section
      id="experience"
      className="py-24 md:py-32 border-t border-hairline"
    >
      <div className="container">
        <SectionLabel index="04" label="Trajectory" />

        <h2 className="mt-12 font-display text-4xl sm:text-5xl md:text-6xl leading-[1.04] max-w-4xl text-balance">
          From frontline operations to{" "}
          <span className="italic text-primary">analytical impact.</span>
        </h2>

        {/* Editorial single-rail timeline */}
        <div className="mt-16 relative">
          <div className="absolute left-[7px] sm:left-2 top-1 bottom-1 w-px bg-border" />

          <div className="space-y-14 md:space-y-20">
            {portfolio.experience.map((exp, i) => (
              <motion.article
                key={exp.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.04 }}
                className="relative pl-8 sm:pl-10 grid md:grid-cols-12 gap-6 md:gap-10"
              >
                {/* Dot */}
                <span className="absolute left-0 top-2 grid place-items-center h-4 w-4 rounded-full bg-background ring-1 ring-border">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-glow" />
                </span>

                {/* Left meta column */}
                <div className="md:col-span-4">
                  <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
                    {exp.period}
                  </div>
                  <div className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {exp.location}
                  </div>
                </div>

                {/* Right content column */}
                <div className="md:col-span-8 md:border-l md:border-hairline md:pl-10">
                  <h3 className="font-display text-3xl md:text-4xl leading-tight text-foreground">
                    {exp.role}
                  </h3>
                  <div className="mt-2 font-display italic text-lg md:text-xl text-primary">
                    {exp.company}
                  </div>

                  <ul className="mt-6 space-y-3 text-sm md:text-base text-foreground/80">
                    {exp.bullets.map((b, j) => (
                      <li key={j} className="flex gap-3 leading-relaxed">
                        <span className="font-mono text-[10px] text-primary mt-2 shrink-0">
                          {String(j + 1).padStart(2, "0")}
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
