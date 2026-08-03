import { motion } from "framer-motion";
import { usePortfolio } from "@/lib/portfolioStore";

export const SectionLabel = ({
  index,
  label,
}: {
  index: string;
  label: string;
}) => (
  <div className="flex items-center gap-3">
    <span className="font-mono text-[10px] text-primary tracking-[0.25em]">
      {index}
    </span>

    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
      {label}
    </span>
  </div>
);

export const About = () => {
  const portfolio = usePortfolio();

  const certifications = portfolio.certifications ?? [];

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="py-24 md:py-32 border-t border-hairline"
    >
      <div className="container max-w-7xl">

        {/* ABOUT HEADER */}
        <div className="border-b border-hairline pb-6">
          <SectionLabel index="01" label="About" />

          <h2
            id="about-heading"
            className="mt-6 font-display text-5xl md:text-6xl italic leading-none text-foreground"
          >
            About
          </h2>
        </div>

        {/* CREDENTIALS */}
        {certifications.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center gap-6 border-b border-hairline pb-5">
              <SectionLabel index="02" label="Credentials" />

              <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                {String(certifications.length).padStart(2, "0")} ON FILE
              </span>
            </div>

            {/* 4 CERTIFICATES SIDE BY SIDE */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {certifications.map((cert, index) => (
                <motion.article
                  key={cert.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.45,
                    delay: (index % 4) * 0.05,
                  }}
                  className="border border-primary/20 bg-card/20 overflow-hidden"
                >
                  <div className="aspect-[4/3] bg-white overflow-hidden">
                    <img
                      src={cert.image}
                      alt={cert.name}
                      loading="lazy"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="p-5 border-t border-primary/20">
                    <div className="flex justify-between items-center gap-3 mb-4">
                      <span className="font-mono text-[10px] tracking-[0.2em] text-primary">
                        CERT {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground">
                        VERIFIED
                      </span>
                    </div>

                    <h3 className="text-lg font-medium leading-snug text-foreground">
                      {cert.name}
                    </h3>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
