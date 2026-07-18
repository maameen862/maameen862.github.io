import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const inputClass =
  "w-full bg-secondary/40 border border-hairline rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition";

const MAX_DIMENSION = 1600; // downscale large photos
const JPEG_QUALITY = 0.82;
const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8MB upload cap

const fileToDownscaledDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not decode image"));
      img.onload = () => {
        let { width, height } = img;
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          const scale = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas unavailable"));
        ctx.drawImage(img, 0, 0, width, height);
        // PNGs with transparency stay PNG; everything else becomes JPEG for size.
        const isPng = file.type === "image/png";
        const out = isPng
          ? canvas.toDataURL("image/png")
          : canvas.toDataURL("image/jpeg", JPEG_QUALITY);
        resolve(out);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });

type Props = {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  previewClassName?: string;
};

export const ImageField = ({
  value,
  onChange,
  placeholder = "https://… or upload from device",
  previewClassName = "mt-2 h-24 w-auto rounded-sm border border-hairline object-cover",
}: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Not an image", description: "Pick a PNG, JPG, GIF or WebP." });
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      toast({
        title: "File too large",
        description: "Max 8MB. Try a smaller image.",
      });
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await fileToDownscaledDataUrl(file);
      onChange(dataUrl);
      toast({ title: "Image added", description: "Saved into this field." });
    } catch (err) {
      toast({
        title: "Could not process image",
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <input
        className={inputClass}
        placeholder={placeholder}
        value={value.startsWith("data:") ? "" : value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-sm border border-hairline bg-secondary/40 hover:bg-secondary/70 px-2.5 py-1.5 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition disabled:opacity-50"
        >
          <Upload className="h-3 w-3" />
          {busy ? "Processing…" : "Upload from device"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex items-center gap-1.5 rounded-sm border border-hairline px-2.5 py-1.5 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-destructive transition"
          >
            <X className="h-3 w-3" />
            Remove
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </div>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className={previewClassName} />
      )}
    </div>
  );
};
