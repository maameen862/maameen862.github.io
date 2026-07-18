import { motion } from "framer-motion";
import { Expand } from "lucide-react";
import { usePortfolio } from "@/lib/portfolioStore";
import { SectionLabel } from "./About";
import { useLightbox, type LightboxImage } from "./Lightbox";

// Kinetic Brutalist Editorial — 7-cell repeating tile pattern
// 0: 2x2 featured (overlay text)  | 1: 1x2 tall  | 2,3: 1x1 small
// 4: 2x1 wide (centered tracked caption)  | 5,6: 1x1 small
const TILE_PATTERN = [
  { span: "col-span-2 row-span-2", kind: "featured" as const },
  { span: "col-span-1 row-span-2", kind: "tall" as const },
  { span: "col-span-1 row-span-1", kind: "small" as const },
  { span: "col-span-1 row-span-1", kind: "small" as const },
  { span: "col-span-2 row-span-1", kind: "wide" as const },
  { span: "col-span-1 row-span-1", kind: "small" as const },
  { span: "col-span-1 row-span-1", kind: "small" as const },
];

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
      <div className="container max-w-6xl">
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
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 auto-rows-[140px] md:auto-rows-[220px] gap-3 md:gap-4">
          {items.map((img, i) => {
            const tile = TILE_PATTERN[i % TILE_PATTERN.length];
            const caption = img.caption ?? `Gallery image ${i + 1}`;
            const isFeatured = tile.kind === "featured";
            const isWide = tile.kind === "wide";

            return (
              <motion.figure
                key={img.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (i % 7) * 0.04 }}
                className={`${tile.span} group relative overflow-hidden border border-primary/20 bg-card/20`}
              >
                <button
                  type="button"
                  onClick={() => open(lightboxItems, i)}
                  aria-label={`Open ${caption} in preview`}
                  className="block w-full h-full text-left"
                >
                  <img
                    src={img.url}
                    alt={caption}
                    loading="lazy"
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]`}
                  />

                  {/* Featured: gradient + overlay caption */}
                  {isFeatured && (
                    <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end bg-gradient-to-t from-background/90 via-background/30 to-transparent">
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary-glow mb-2">
                        Featured / 01
                      </span>
                      <p className="font-display text-2xl md:text-3xl text-foreground leading-tight text-balance">
                        {caption}
                      </p>
                    </div>
                  )}

                  {/* Wide: centered tracked caption that brightens on hover */}
                  {isWide && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-foreground/40 group-hover:text-foreground transition-colors text-center px-4">
                        {caption}
                      </p>
                    </div>
                  )}

                  {/* Small / tall: top-right index badge */}
                  {!isFeatured && !isWide && (
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 border border-primary/30 text-[9px] font-mono text-foreground bg-background/60 backdrop-blur uppercase tracking-widest">
                        {`IMG_${String(i + 1).padStart(3, "0")}`}
                      </span>
                    </div>
                  )}

                  {/* Hover expand icon */}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-sm border border-hairline bg-background/70 backdrop-blur opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition text-foreground"
                  >
                    <Expand className="h-3.5 w-3.5" />
                  </span>
                </button>
              </motion.figure>
            );
          })}
        </div>
      </div>
    </section>
  );
};
