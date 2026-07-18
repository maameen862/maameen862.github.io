import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type MouseEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

export type LightboxImage = { src: string; alt?: string; caption?: string };

type LightboxContextValue = {
  open: (images: LightboxImage[], index?: number) => void;
};

const LightboxContext = createContext<LightboxContextValue | null>(null);

export const useLightbox = () => {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error("useLightbox must be used within LightboxProvider");
  return ctx;
};

export const LightboxProvider = ({ children }: { children: ReactNode }) => {
  const [images, setImages] = useState<LightboxImage[]>([]);
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragStart = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  const open = useCallback((imgs: LightboxImage[], i = 0) => {
    if (!imgs.length) return;
    setImages(imgs);
    setIndex(Math.max(0, Math.min(i, imgs.length - 1)));
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % images.length);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [images.length]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + images.length) % images.length);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [images.length]);

  const current = images[index];

  const download = useCallback(async () => {
    if (!current) return;
    try {
      const res = await fetch(current.src);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const ext = (blob.type.split("/")[1] || "png").split("+")[0];
      const safeName = (current.alt || `image-${index + 1}`)
        .replace(/[^a-z0-9-_]+/gi, "_")
        .slice(0, 60);
      a.download = `${safeName}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab
      window.open(current.src, "_blank", "noopener,noreferrer");
    }
  }, [current, index]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(z + 0.25, 4));
      else if (e.key === "-") setZoom((z) => Math.max(z - 0.25, 1));
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close, next, prev]);

  const onPointerDown = (e: MouseEvent<HTMLImageElement>) => {
    if (zoom <= 1) return;
    dragStart.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
  };
  const onPointerMove = (e: MouseEvent<HTMLImageElement>) => {
    if (!dragStart.current) return;
    setPan({
      x: dragStart.current.px + (e.clientX - dragStart.current.x),
      y: dragStart.current.py + (e.clientY - dragStart.current.y),
    });
  };
  const onPointerUp = () => {
    dragStart.current = null;
  };

  const value = useMemo(() => ({ open }), [open]);

  return (
    <LightboxContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {isOpen && current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="Image preview"
          >
            {/* Top toolbar */}
            <div
              className="absolute top-0 inset-x-0 z-10 flex items-center justify-between gap-2 p-4 md:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {index + 1} / {images.length}
                {current.caption && (
                  <span className="ml-3 text-foreground/80 normal-case tracking-normal">
                    {current.caption}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <ToolbarBtn
                  label="Zoom out"
                  onClick={() => setZoom((z) => Math.max(z - 0.25, 1))}
                  disabled={zoom <= 1}
                >
                  <ZoomOut className="h-4 w-4" />
                </ToolbarBtn>
                <span className="font-mono text-[10px] text-muted-foreground w-10 text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <ToolbarBtn
                  label="Zoom in"
                  onClick={() => setZoom((z) => Math.min(z + 0.25, 4))}
                  disabled={zoom >= 4}
                >
                  <ZoomIn className="h-4 w-4" />
                </ToolbarBtn>
                <ToolbarBtn
                  label="Reset zoom"
                  onClick={() => {
                    setZoom(1);
                    setPan({ x: 0, y: 0 });
                  }}
                  disabled={zoom === 1 && pan.x === 0 && pan.y === 0}
                >
                  <RotateCcw className="h-4 w-4" />
                </ToolbarBtn>
                <ToolbarBtn label="Download" onClick={download}>
                  <Download className="h-4 w-4" />
                </ToolbarBtn>
                <ToolbarBtn label="Close" onClick={close}>
                  <X className="h-4 w-4" />
                </ToolbarBtn>
              </div>
            </div>

            {/* Prev / Next */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 inline-flex h-12 w-12 items-center justify-center rounded-sm border border-hairline bg-card/70 backdrop-blur text-foreground hover:border-primary hover:text-primary transition"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 inline-flex h-12 w-12 items-center justify-center rounded-sm border border-hairline bg-card/70 backdrop-blur text-foreground hover:border-primary hover:text-primary transition"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Image */}
            <div
              className="absolute inset-0 flex items-center justify-center p-12 md:p-20 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={current.src}
                src={current.src}
                alt={current.alt ?? "Preview"}
                draggable={false}
                onMouseDown={onPointerDown}
                onMouseMove={onPointerMove}
                onMouseUp={onPointerUp}
                onMouseLeave={onPointerUp}
                onDoubleClick={() => {
                  setZoom((z) => (z === 1 ? 2 : 1));
                  setPan({ x: 0, y: 0 });
                }}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  cursor: zoom > 1 ? (dragStart.current ? "grabbing" : "grab") : "zoom-in",
                  transition: dragStart.current ? "none" : "transform 0.15s ease-out",
                }}
                className="max-h-full max-w-full object-contain select-none rounded-sm shadow-elevated"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </LightboxContext.Provider>
  );
};

const ToolbarBtn = ({
  children,
  onClick,
  label,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  label: string;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={label}
    className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-hairline bg-card/70 backdrop-blur text-foreground hover:border-primary hover:text-primary transition disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-hairline disabled:hover:text-foreground"
  >
    {children}
  </button>
);
