import { motion } from "framer-motion";
import { Expand } from "lucide-react";
import { usePortfolio } from "@/lib/portfolioStore";
import { SectionLabel } from "./About";
import { useLightbox, type LightboxImage } from "./Lightbox";

export const Gallery = () => {
  const portfolio = usePortfolio();
  const { open } = useLightbox();

  const visible = portfolio.visibility?.gallery !== false;
  const items = portfolio.gallery ?? [];

  if (!visible || items.length === 0) return null;

  const lightboxItems: LightboxImage[] = items.map((img, i) => ({
    src: img.url,
    alt: img.caption ?? `Gallery image ${i + 1}`,
    caption: img.caption,
  }));

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="py-24 md:py-32 border-t border-hairline"
    >
      <div className="container max-w-7xl">

        {/* HEADER */}
        <div className="flex items-end gap-6 border-b border-hairline pb-6 flex-wrap">
          <div>
            <SectionLabel index="07" label="Gallery" />

            <h2
              id="gallery-heading"
              className="mt-6 font-display text-5xl md:text-6xl italic leading-none text-foreground"
            >
              Gallery
            </h2>
          </div>

          <p className="text-sm text-muted-foreground pb-2 max-w-xs">
            Archives of certification, visual research, and interface fragments.
          </p>

          <span className="ml-auto pb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {String(items.length).padStart(2, "0")} ON FILE
          </span>
        </div>

        {/* 4-COLUMN GALLERY */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((img, i) => {
            const caption = img.caption ?? `Gallery image ${i + 1}`;

            return (
              <motion.figure
                key={img.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.5,
                  delay: (i % 4) * 0.05,
                }}
                className="group relative overflow-hidden border border-primary/20 bg-card/20"
              >
                <button
                  type="button"
                  onClick={() => open(lightboxItems, i)}
                  aria-label={`Open ${caption} in preview`}
                  className="block w-full text-left"
                >
                  {/* IMAGE */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-background">
                    <img
                      src={img.url}
                      alt={caption}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />

                    {/* IMAGE NUMBER */}
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 border border-primary/30 text-[9px] font-mono text-foreground bg-background/70 backdrop-blur uppercase tracking-widest">
                        {`IMG_${String(i + 1).padStart(3, "0")}`}
                      </span>
                    </div>

                    {/* EXPAND ICON */}
                    <span
                      aria-hidden="true"
                      className="absolute bottom-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-sm border border-hairline bg-background/70 backdrop-blur opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition text-foreground"
                    >
                      <Expand className="h-3.5 w-3.5" />
                    </span>
                  </div>

                  {/* CAPTION */}
                  <div className="border-t border-primary/20 p-4 min-h-[78px]">
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-primary-glow">
                      Gallery / {String(i + 1).padStart(2, "0")}
                    </span>

                    <p className="mt-2 text-sm text-foreground leading-snug line-clamp-2">
                      {caption}
                    </p>
                  </div>
                </button>
              </motion.figure>
            );
          })}
        </div>
      </div>
    </section>
  );
};
