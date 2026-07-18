import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { usePortfolio } from "@/lib/portfolioStore";
import { SectionLabel } from "./About";
import { ArrowUpRight, Calendar, Expand } from "lucide-react";
import { useLightbox } from "./Lightbox";

export const Projects = () => {
  const portfolio = usePortfolio();
  const { open } = useLightbox();
  const [filter, setFilter] = useState("All");
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(portfolio.projects.map((p) => p.category)))],
    [portfolio.projects]
  );
  const projects = portfolio.projects.filter(
    (p) => filter === "All" || p.category === filter
  );
  const getProjectImages = (p: (typeof projects)[number]) => {
    const all = [p.image, ...(p.images ?? [])].filter((x): x is string => !!x);
    return Array.from(new Set(all));
  };

  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-24 md:py-32 border-t border-hairline">
      <div className="container">
        <SectionLabel index="05" label="Selected work" />

        <div className="mt-12 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.04] max-w-3xl text-balance">
            Dashboards & analyses that{" "}
            <span className="italic text-primary">moved the needle.</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-3.5 py-1.5 rounded-sm font-mono text-[10px] uppercase tracking-[0.2em] transition border ${
                  filter === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-hairline text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Featured projects — magazine spread */}
        {featured.length > 0 && (
          <div className="mt-14 space-y-8">
            {featured.map((p, i) => {
              const imgs = getProjectImages(p);
              const cover = imgs[0];
              const lightboxItems = imgs.map((src) => ({
                src,
                alt: p.title,
                caption: p.title,
              }));
              const flip = i % 2 === 1;
              return (
                <motion.article
                  key={p.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6 }}
                  className="group grid lg:grid-cols-12 gap-0 border border-hairline rounded-sm overflow-hidden bg-card/40 backdrop-blur hover:border-primary/40 transition-colors"
                >
                  {cover && (
                    <button
                      type="button"
                      onClick={() => open(lightboxItems, 0)}
                      aria-label={`Open ${p.title} preview`}
                      className={`group/img relative block lg:col-span-7 cursor-zoom-in overflow-hidden border-b lg:border-b-0 ${
                        flip ? "lg:order-2 lg:border-l lg:border-hairline" : "lg:border-r lg:border-hairline"
                      } border-hairline aspect-[16/10] lg:aspect-auto lg:min-h-[24rem]`}
                    >
                      <img
                        src={cover}
                        alt={`${p.title} preview`}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card/40 to-transparent pointer-events-none opacity-0 group-hover/img:opacity-100 transition-opacity" />
                      <span className="absolute top-4 left-4 font-mono text-[9px] uppercase tracking-[0.3em] text-primary border border-primary/40 bg-primary/10 px-2 py-1 rounded-sm">
                        ★ Featured
                      </span>
                      {imgs.length > 1 && (
                        <span className="absolute bottom-4 left-4 inline-flex items-center gap-1 rounded-sm border border-hairline bg-background/70 backdrop-blur px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-foreground">
                          +{imgs.length - 1} more
                        </span>
                      )}
                      <span className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-sm border border-hairline bg-background/70 backdrop-blur opacity-0 group-hover/img:opacity-100 transition text-foreground">
                        <Expand className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  )}

                  <div className={`lg:col-span-5 p-7 md:p-10 flex flex-col ${flip ? "lg:order-1" : ""}`}>
                    <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-4">
                      <span className="text-primary">{p.category}</span>
                      <span className="h-px w-6 bg-border" />
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" /> {p.period}
                      </span>
                    </div>

                    <h3 className="font-display text-3xl md:text-4xl leading-tight text-foreground">
                      {p.title}
                    </h3>
                    <p className="mt-2 font-display italic text-lg text-primary">
                      {p.subtitle}
                    </p>

                    <p className="mt-5 text-sm md:text-base text-foreground/80 leading-relaxed">
                      {p.description}
                    </p>

                    <div className="mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                      {p.highlights.map((h, j) => (
                        <div
                          key={j}
                          className="flex gap-2.5 text-xs text-muted-foreground border-l border-primary/40 pl-3 py-1"
                        >
                          <span className="font-mono text-primary">
                            {String(j + 1).padStart(2, "0")}
                          </span>
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto pt-7 flex flex-wrap items-center gap-2 border-t border-hairline mt-7">
                      <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
                        {p.tools.map((t) => (
                          <span
                            key={t}
                            className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm bg-secondary/60 text-foreground/80 border border-hairline"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      {p.link && (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Open ${p.title}`}
                          className="shrink-0 inline-flex items-center gap-2 rounded-sm border border-primary/40 bg-primary/10 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition"
                        >
                          View case
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        {/* Secondary projects grid */}
        {rest.length > 0 && (
          <div className="mt-10 grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {rest.map((p, i) => {
              const imgs = getProjectImages(p);
              const cover = imgs[0];
              const lightboxItems = imgs.map((src) => ({
                src,
                alt: p.title,
                caption: p.title,
              }));
              return (
                <motion.article
                  key={p.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="group flex flex-col border border-hairline bg-card/40 backdrop-blur rounded-sm overflow-hidden hover:border-primary/40 hover:bg-card transition-all duration-500"
                >
                  {cover && (
                    <button
                      type="button"
                      onClick={() => open(lightboxItems, 0)}
                      aria-label={`Open ${p.title} preview`}
                      className="group/img relative block w-full overflow-hidden border-b border-hairline cursor-zoom-in aspect-[16/9]"
                    >
                      <img
                        src={cover}
                        alt={`${p.title} preview`}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      
                    </button>
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
                      <span className="text-primary">{p.category}</span>
                      <span className="h-px w-6 bg-border" />
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" /> {p.period}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl leading-tight text-foreground group-hover:text-primary transition-colors">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground italic">
                      {p.subtitle}
                    </p>

                    <p className="mt-4 text-sm text-foreground/75 leading-relaxed line-clamp-3">
                      {p.description}
                    </p>

                    <div className="mt-auto pt-5 flex flex-wrap items-center gap-2 border-t border-hairline mt-5">
                      <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
                        {p.tools.slice(0, 4).map((t) => (
                          <span
                            key={t}
                            className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-secondary/60 text-foreground/70 border border-hairline"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      {p.link && (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Open ${p.title}`}
                          className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-sm border border-hairline text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/10 transition"
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
