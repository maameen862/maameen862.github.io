import type { CSSProperties } from "react";
import { motion, type Variants } from "framer-motion";
import { usePortfolio } from "@/lib/portfolioStore";
import { SectionLabel } from "./About";
import { ArrowUpRight, Mail } from "lucide-react";

interface ContactLink {
  name: string;
  subtitle: string;
  href: string;
  logo: string;
  glow: string; // brand accent used for hover border/shadow tint
}

const links: ContactLink[] = [
  {
    name: "LinkedIn",
    subtitle: "Connect with me",
    href: "https://www.linkedin.com/in/mohammadameenuddin",
    logo: "/logos/linkedin.svg",
    glow: "#0A66C2",
  },
  {
    name: "GitHub",
    subtitle: "Explore my projects",
    href: "https://github.com/maameen862",
    logo: "/logos/github.svg",
    glow: "#8B8FA3",
  },
  {
    name: "Teams",
    subtitle: "Start a Teams chat",
    href: "https://teams.microsoft.com/l/chat/0/0?users=maameen862@gmail.com",
    logo: "/logos/teams.svg",
    glow: "#6264A7",
  },
  {
    name: "Discord",
    subtitle: "Let's chat",
    href: "https://discord.com",
    logo: "/logos/discord.svg",
    glow: "#5865F2",
  },
  {
    name: "Instagram",
    subtitle: "Follow my journey",
    href: "https://www.instagram.com/ma_ameen_862/",
    logo: "/logos/instagram.svg",
    glow: "#DD2A7B",
  },
];

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export const Contact = () => {
  const { contact, hero } = usePortfolio();

  return (
    <section id="contact" className="relative py-24 border-t border-hairline overflow-hidden">
      {/* background: grid + radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 20%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 20%, black 40%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]"
      />

      <div className="container relative">
        <SectionLabel index="06" label="Let's Connect" />

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-6xl font-display"
        >
          Have data that needs <span className="italic text-primary">a story?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          {hero.availability}. I&apos;m always open to discussing analytics, dashboards,
          SQL and Power BI opportunities.
        </motion.p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-12"
        >
          {/* Premium Email Card (replace your existing email card only) */}
<motion.div
  variants={itemVariants}
  className="group relative overflow-hidden rounded-3xl border border-primary/20 bg-card/60 p-8 backdrop-blur-xl hover:border-primary/40"
>
  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
  <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
    <div>
      <span className="text-xs uppercase tracking-[0.35em] text-primary font-semibold">EMAIL</span>
      <h3 className="mt-3 text-3xl md:text-4xl font-display break-all">
        {contact.email}
      </h3>
      <p className="mt-3 text-muted-foreground">
        Open to opportunities, collaborations and Data Analyst roles.
      </p>
    </div>

    <motion.a
      href={`mailto:${contact.email}`}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      className="rounded-xl bg-primary px-7 py-4 text-primary-foreground font-medium shadow-lg shadow-primary/20 transition"
    >
      Send Email →
    </motion.a>
  </div>
</motion.div>
          {/* Five link cards */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {links.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                variants={itemVariants}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={
                  {
                    ["--glow" as string]: link.glow,
                  } as CSSProperties
                }
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-card/50 p-6 backdrop-blur-xl transition-colors duration-300 hover:border-[color:var(--glow)]/50"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-30"
                  style={{ backgroundColor: "var(--glow)" }}
                />

                <div className="relative flex items-start justify-between">
                  <img
                    src={link.logo}
                    alt={`${link.name} logo`}
                    className="h-11 w-11 shrink-0 transition-transform duration-300 group-hover:scale-110"
                  />
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-[color:var(--glow)]/50 group-hover:text-foreground">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>

                <div className="relative mt-6">
                  <h4 className="text-lg font-semibold">{link.name}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{link.subtitle}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
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
          © {new Date().getFullYear()} {hero.name}
        </p>

        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          HYDERABAD, TELANGANA → INDIA
        </p>
      </div>
    </footer>
  );
};
