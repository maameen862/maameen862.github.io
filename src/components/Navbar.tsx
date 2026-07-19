import { useEffect, useMemo, useState } from "react";
import { usePortfolio } from "@/lib/portfolioStore";
import { toast } from "@/hooks/use-toast";

const baseSections = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export const Navbar = () => {
  const portfolio = usePortfolio();

  const [active, setActive] = useState("about");
  const [scrolled, setScrolled] = useState(false);

  const sections = useMemo(() => {
    const list = [...baseSections];

    const addBeforeContact = (item: { id: string; label: string }) => {
      const index = list.findIndex((x) => x.id === "contact");
      list.splice(index, 0, item);
    };

    if (
      portfolio.visibility?.customSections !== false &&
      (portfolio.customSections?.length ?? 0) > 0
    ) {
      addBeforeContact({
        id: "more",
        label: "More",
      });
    }

    if (
      portfolio.visibility?.gallery !== false &&
      (portfolio.gallery?.length ?? 0) > 0
    ) {
      addBeforeContact({
        id: "gallery",
        label: "Gallery",
      });
    }

    if (
      portfolio.visibility?.posts !== false &&
      (portfolio.posts?.length ?? 0) > 0
    ) {
      addBeforeContact({
        id: "posts",
        label: "Posts",
      });
    }

    return list;
  }, [portfolio]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      let current = "about";

      sections.forEach((section) => {
        const el = document.getElementById(section.id);

        if (!el) return;

        const top = el.offsetTop - 120;

        if (window.scrollY >= top) {
          current = section.id;
        }
      });

      setActive(current);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);

    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const initials = portfolio.hero.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-background/80 border-b border-hairline"
          : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">

        {/* Logo */}

        <button
          type="button"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          className="flex items-center gap-2"
        >
          <span className="font-display text-lg font-bold tracking-tight">
            <span className="text-gradient-primary">{initials}</span>
            <span>.</span>
          </span>

          <span className="hidden sm:block font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {portfolio.hero.role}
          </span>
        </button>

        {/* Navigation */}

        <nav className="hidden md:flex items-center gap-1">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollToSection(section.id)}
              className={`relative px-4 py-2 text-xs font-mono uppercase tracking-widest transition-colors ${
                active === section.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {section.label}

              {active === section.id && (
                <span className="absolute left-3 right-3 bottom-1 h-[2px] bg-primary rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Resume */}

        <button
          type="button"
          onClick={async () => {
            const src = portfolio.resumeFile?.trim();

            if (!src) {
              toast({
                title: "Resume not available",
                description:
                  "Please upload your resume from the Admin panel.",
                variant: "destructive",
              });
              return;
            }

            try {
              const response = await fetch(src);

              if (!response.ok) throw new Error();

              const blob = await response.blob();

              const url = URL.createObjectURL(blob);

              const link = document.createElement("a");

              link.href = url;

              link.download =
                portfolio.hero.name.replace(/\s+/g, "_") + ".pdf";

              document.body.appendChild(link);

              link.click();

              link.remove();

              URL.revokeObjectURL(url);
            } catch {
              toast({
                title: "Download failed",
                description:
                  "Resume file could not be found.",
                variant: "destructive",
              });
            }
          }}
          className="group inline-flex items-center gap-2 rounded-sm border border-primary/40 bg-primary/10 px-3 py-2 text-xs font-mono uppercase tracking-widest text-primary transition hover:bg-primary hover:text-primary-foreground"
        >
          Resume

          <span className="transition-transform group-hover:translate-y-0.5">
            ↓
          </span>
        </button>
      </div>
    </header>
  );
};
