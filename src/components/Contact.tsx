import { motion } from "framer-motion";
import { usePortfolio } from "@/lib/portfolioStore";
import { SectionLabel } from "./About";
import { Mail, Phone, Linkedin, Github, ArrowUpRight } from "lucide-react";

const iconMap: Record<string, typeof Mail> = {
  mail: Mail,
  phone: Phone,
  linkedin: Linkedin,
  github: Github,
};

export const Contact = () => {
  const { contact, socials, hero } = usePortfolio();

  return (
    <section id="contact" className="py-24 md:py-32 border-t border-hairline relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[600px] bg-primary/10 blur-3xl pointer-events-none" />

      <div className="container relative">
        <SectionLabel index="06" label="Let's talk" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-10 max-w-4xl"
        >
          <h2 className="font-display text-5xl sm:text-6xl md:text-8xl leading-[0.95] text-balance">
            Have data that needs{" "}
            <span className="italic text-primary">a story?</span>
          </h2>
          <p className="mt-8 font-display italic text-xl md:text-2xl text-foreground/80 max-w-2xl leading-snug">
            {hero.availability}. Drop a line — happy to chat about dashboards,
            SQL, or your next BI build.
          </p>
        </motion.div>

        <div className="mt-12 grid md:grid-cols-2 gap-4">
          <a
            href={`mailto:${contact.email}`}
            className="group border border-hairline bg-card/50 backdrop-blur rounded-sm p-6 hover:border-primary/40 hover:bg-card transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2">
                  Email
                </div>
                <div className="font-display text-xl md:text-2xl font-semibold group-hover:text-primary transition-colors break-all">
                  {contact.email}
                </div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>
          <a
            href={`tel:${contact.phone.replace(/\s/g, "")}`}
            className="group border border-hairline bg-card/50 backdrop-blur rounded-sm p-6 hover:border-primary/40 hover:bg-card transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2">
                  Phone
                </div>
                <div className="font-display text-xl md:text-2xl font-semibold group-hover:text-primary transition-colors">
                  {contact.phone}
                </div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {socials.map((s) => {
            const Icon = iconMap[s.icon] ?? Mail;
            return (
              <a
                key={s.id}
                href={s.url}
                target={s.url.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-hairline px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground transition"
              >
                <Icon className="h-4 w-4" />
                {s.label}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const Footer = () => {
  const { hero } = usePortfolio();
  return (
    <footer className="border-t border-hairline py-10">
      <div className="container flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          © {new Date().getFullYear()} {hero.name} · Built with data & care
        </p>
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          HYDERABAD, TELANGANA → INDIA
        </p>
      </div>
    </footer>
  );
};
