import { motion } from "framer-motion";
import { usePortfolio } from "@/hooks/usePortfolio";

const About = () => {
  const { data } = usePortfolio();

  if (!data) return null;

  const certifications = data.certifications || [];

  return (
    <section id="about" className="relative py-24">
      <div className="container mx-auto px-6">

        {/* ABOUT */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-primary font-mono text-xs tracking-[0.3em] uppercase">
              About
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="max-w-4xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Data Analyst
            </h2>

            {data.about && (
              <p className="text-muted-foreground leading-relaxed text-lg">
                {typeof data.about === "string"
                  ? data.about
                  : data.about.description}
              </p>
            )}
          </div>
        </div>

        {/* CREDENTIALS */}
        <div>
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4 flex-1">
              <span className="text-primary font-mono text-xs tracking-[0.3em] uppercase">
                Credentials
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <span className="text-muted-foreground font-mono text-xs tracking-[0.2em]">
              {String(certifications.length).padStart(2, "0")} ON FILE
            </span>
          </div>

          {/* 4 CERTIFICATES PER ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert: any, index: number) => (
              <motion.div
                key={cert.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.08,
                }}
                className="border border-border bg-card overflow-hidden group"
              >
                {/* CERTIFICATE IMAGE */}
                <div className="aspect-[4/3] bg-white overflow-hidden">
                  <img
                    src={cert.image}
                    alt={cert.name}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>

                {/* CERTIFICATE DETAILS */}
                <div className="p-5 border-t border-border">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-xs tracking-[0.2em] text-primary">
                      CERT {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="font-mono text-xs tracking-[0.15em] text-muted-foreground">
                      VERIFIED
                    </span>
                  </div>

                  <h3 className="text-lg xl:text-xl font-medium leading-snug">
                    {cert.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
