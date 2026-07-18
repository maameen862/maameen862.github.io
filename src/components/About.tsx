import { motion } from "framer-motion";
import { usePortfolio } from "@/lib/portfolioStore";
import { useLightbox } from "./Lightbox";

export const About = () => {
  const portfolio = usePortfolio();
  const { open } = useLightbox();
  const certImages = portfolio.certifications
    .filter((c) => c.image)
    .map((c) => ({ src: c.image as string, alt: c.name, caption: c.name }));

  return (
    <section id="about" className="py-24 md:py-32 border-t border-hairline">
      <div className="container">
        <SectionLabel index="02" label="About" />

        {/* Lede — oversized editorial pull quote */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="font-about-display mt-12 text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.02] text-balance max-w-5xl"
        >
          I don't just visualize data —{" "}
          <span className="italic text-primary">I interrogate it.</span>
        </motion.h2>

        {/* Two-column editorial split */}
        <div className="mt-16 grid lg:grid-cols-12 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7"
          >
            {/* Drop-cap paragraph */}
            <p className="font-about-sans text-lg md:text-xl text-foreground/85 leading-relaxed [&::first-letter]:font-about-display [&::first-letter]:text-7xl [&::first-letter]:leading-[0.85] [&::first-letter]:float-left [&::first-letter]:mr-3 [&::first-letter]:mt-1 [&::first-letter]:text-primary">
              {portfolio.about}
            </p>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="border border-hairline bg-card/40 backdrop-blur p-7 rounded-sm">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary mb-5">
                — What I do
              </div>
              <ul className="divide-y divide-border/60">
                {[
                  "Build executive Power BI / Tableau / Looker dashboards",
                  "Write performant SQL across multi-table joins",
                  "Translate raw business questions into measurable KPIs",
                  "Surface risks & opportunities — not just charts",
                ].map((item, i) => (
                  <li
                    key={item}
                    className="flex gap-4 py-3 first:pt-0 last:pb-0 items-start"
                  >
                    <span className="font-mono text-[10px] text-primary mt-1 shrink-0">
                      0{i + 1}
                    </span>
                    <span className="font-about-sans text-sm md:text-base text-foreground/90 leading-snug">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.aside>
        </div>

        {/* Certifications gallery — larger, editorial */}
        {portfolio.certifications.length > 0 && (
          <div className="mt-20">
            <div className="flex items-baseline justify-between gap-4 border-b border-hairline pb-3 mb-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-primary">
                — Credentials
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {portfolio.certifications.length.toString().padStart(2, "0")} on file
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.certifications.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group border border-hairline bg-card/50 backdrop-blur rounded-sm overflow-hidden hover:border-primary/40 transition-colors"
                >
                  {c.image && (
                    <button
                      type="button"
                      onClick={() => {
                        const idx = certImages.findIndex((im) => im.src === c.image);
                        open(certImages, idx >= 0 ? idx : 0);
                      }}
                      aria-label={`Open ${c.name} certificate preview`}
                      className="block w-full aspect-[4/3] overflow-hidden bg-secondary/40 cursor-zoom-in border-b border-hairline"
                    >
                      <img
                        src={c.image}
                        alt={`${c.name} certificate`}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </button>
                  )}
                  <div className="p-5">
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
                      <span className="text-primary">Cert 0{i + 1}</span>
                      <span>Verified</span>
                    </div>
                    <h4 className="font-about-display text-xl md:text-2xl leading-snug text-foreground">
                      {c.name.split("—")[0].trim()}
                    </h4>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export const SectionLabel = ({ index, label }: { index: string; label: string }) => (
  <div className="flex items-center gap-4">
    <span className="font-mono text-xs text-primary">{index}</span>
    <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
      {label}
    </span>
    <span className="h-px flex-1 bg-border" />
  </div>
);
