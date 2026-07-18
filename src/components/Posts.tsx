import { motion } from "framer-motion";
import { usePortfolio } from "@/lib/portfolioStore";
import { SectionLabel } from "./About";

export const Posts = () => {
  const portfolio = usePortfolio();
  const visible = portfolio.visibility?.posts !== false;
  const items = portfolio.posts ?? [];
  if (!visible || items.length === 0) return null;

  const sorted = [...items].sort((a, b) => {
    const da = Date.parse(a.date);
    const db = Date.parse(b.date);
    if (isNaN(da) || isNaN(db)) return 0;
    return db - da;
  });

  return (
    <section
      id="posts"
      aria-labelledby="posts-heading"
      className="py-24 md:py-32 border-t border-hairline"
    >
      <div className="container">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <SectionLabel index="08" label="Posts" />
            <h2
              id="posts-heading"
              className="mt-10 font-display text-4xl md:text-5xl font-bold leading-tight max-w-2xl text-balance"
            >
              Notes & <span className="text-gradient-primary">recent entries.</span>
            </h2>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground pb-2">
            Archive / {String(sorted.length).padStart(2, "0")}
          </span>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 border-t border-l border-hairline">
          {sorted.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
              className="group relative border-r border-b border-hairline p-6 md:p-8 flex flex-col gap-4 min-h-[200px] hover:bg-card/40 transition-colors duration-500"
            >
              <header className="flex items-center justify-between">
                <time className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary-glow">
                  {p.date}
                </time>
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-primary group-hover:shadow-glow transition-shadow"
                />
              </header>
              <h3 className="font-display text-2xl md:text-3xl leading-[1.1] text-foreground">
                {p.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line line-clamp-4">
                {p.body}
              </p>
              <span
                aria-hidden="true"
                className="mt-auto h-px w-8 bg-primary/40 group-hover:w-16 transition-all duration-500"
              />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
