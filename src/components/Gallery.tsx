import { motion } from "framer-motion";
import { usePortfolio } from "@/hooks/usePortfolio";

const Gallery = () => {
  const { data } = usePortfolio();

  if (!data) return null;

  const gallery = data.gallery || [];

  return (
    <section id="gallery" className="relative py-24">
      <div className="container mx-auto px-6">

        {/* SECTION HEADER */}
        <div className="flex items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4 flex-1">
            <span className="text-primary font-mono text-xs tracking-[0.3em] uppercase">
              Gallery
            </span>

            <div className="h-px flex-1 bg-border" />
          </div>

          <span className="text-muted-foreground font-mono text-xs tracking-[0.2em]">
            {String(gallery.length).padStart(2, "0")} ON FILE
          </span>
        </div>

        {/* GALLERY GRID
            Mobile  = 1
            Tablet  = 2
            Desktop = 4
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gallery.map((item: any, index: number) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: (index % 4) * 0.08,
              }}
              className="group border border-border bg-card overflow-hidden"
            >
              {/* IMAGE */}
              <div className="aspect-[4/3] bg-white overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title || `Gallery image ${index + 1}`}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>

              {/* IMAGE INFORMATION */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="font-mono text-xs tracking-[0.2em] text-primary">
                    IMAGE {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="font-mono text-xs tracking-[0.15em] text-muted-foreground">
                    GALLERY
                  </span>
                </div>

                {item.title && (
                  <h3 className="text-base xl:text-lg font-medium leading-snug">
                    {item.title}
                  </h3>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Gallery;
