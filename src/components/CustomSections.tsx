import { motion } from "framer-motion";
import { Expand } from "lucide-react";
import { usePortfolio } from "@/lib/portfolioStore";
import { SectionLabel } from "./About";
import { useLightbox } from "./Lightbox";

export const CustomSections = () => {
  const portfolio = usePortfolio();
  const { open } = useLightbox();
  const visible = portfolio.visibility?.customSections !== false;
  const items = portfolio.customSections ?? [];
  if (!visible || items.length === 0) return null;

  const images = items
    .filter((s) => s.image)
    .map((s) => ({ src: s.image as string, alt: s.title, caption: s.title }));

  return (
    <section
      id="more"
      aria-labelledby="more-heading"
      className="py-24 md:py-32 border-t border-hairline"
    >
      <div className="container max-w-6xl">
        <div className="flex items-end justify-between gap-6 border-b border-hairline pb-6 flex-wrap">
          <div>
            <SectionLabel index="06" label="More" />
            <h2
              id="more-heading"
              className="mt-6 font-display text-5xl md:text-6xl italic leading-none text-foreground"
            >
              More
            </h2>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary-glow pb-2">
            Selected Long-form
          </span>
        </div>

        <div className="mt-24 space-y-32 md:space-y-40">
          {items.map((s, i) => {
            const reverse = i % 2 === 1;
            const hasImage = Boolean(s.image);
            return (
              <motion.article
                key={s.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: 0.05 }}
                className={`grid grid-cols-1 md:grid-cols-12 gap-8 items-center group ${
                  hasImage ? "" : "md:grid-cols-1"
                }`}
              >
                {hasImage && (
                  <div
                    className={`md:col-span-5 ${
                      reverse ? "md:order-1" : "md:order-2"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        const idx = images.findIndex((im) => im.src === s.image);
                        open(images, idx >= 0 ? idx : 0);
                      }}
                      aria-label={`Open ${s.title} image preview`}
                      className="block w-full aspect-[4/5] bg-card/40 border border-primary/10 group-hover:border-primary/40 transition-colors overflow-hidden relative cursor-zoom-in"
                    >
                      <img
                        src={s.image!}
                        alt={s.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-sm border border-hairline bg-background/70 backdrop-blur opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition text-foreground"
                      >
                        <Expand className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  </div>
                )}

                <div
                  className={`relative z-10 ${
                    hasImage
                      ? `md:col-span-7 ${reverse ? "md:order-2 md:-ml-24" : "md:order-1 md:-mr-24"}`
                      : "md:col-span-12"
                  }`}
                >
                  <div className="bg-background/80 backdrop-blur-sm border border-primary/20 p-8 md:p-12">
                    <span className="block font-mono text-xs uppercase tracking-[0.2em] text-primary mb-6">
                      {String(i + 1).padStart(2, "0")} {" // "} Entry
                    </span>
                    <h3 className="font-display text-3xl md:text-5xl text-foreground leading-tight mb-8 text-balance">
                      {s.title}
                    </h3>
                    <p className="text-base md:text-lg leading-relaxed text-muted-foreground font-light whitespace-pre-line">
                      {s.body}
                    </p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
