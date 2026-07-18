import { useEffect, useSyncExternalStore } from "react";
import { z } from "zod";
import seed from "@/data/portfolio.json";
import type { Portfolio } from "@/lib/portfolio";

const STORAGE_KEY = "portfolio:data:v1";
const EVENT = "portfolio:updated";

// Allow only safe URL protocols (http/https/mailto/tel) and relative URLs.
// Blocks javascript:, data:, vbscript:, etc. to prevent stored XSS via imports.
const safeUrlCheck = (val: string) => {
  if (!val) return true;
  if (val.startsWith("/") || val.startsWith("#") || val.startsWith("?")) return true;
  if (val.startsWith("data:image/")) return true;
  if (val.startsWith("data:application/pdf")) return true;
  try {
    const u = new URL(val);
    return ["http:", "https:", "mailto:", "tel:"].includes(u.protocol);
  } catch {
    return !val.includes(":");
  }
};
const safeUrl = (max: number) =>
  z.string().max(max).refine(safeUrlCheck, {
    message: "URL must use http(s), mailto, or tel protocol",
  });


const SocialSchema = z.object({
  id: z.string(),
  label: z.string().max(100),
  url: safeUrl(2048),
  icon: z.string().max(50),
});

const StatSchema = z.object({
  label: z.string().max(100),
  value: z.string().max(100),
});

const SkillSchema = z.object({
  id: z.string(),
  name: z.string().max(100),
  level: z.number().min(0).max(100),
});

const ExperienceSchema = z.object({
  id: z.string(),
  role: z.string().max(200),
  company: z.string().max(200),
  period: z.string().max(100),
  location: z.string().max(200),
  bullets: z.array(z.string().max(1000)),
});

const ProjectSchema = z.object({
  id: z.string(),
  title: z.string().max(200),
  subtitle: z.string().max(300),
  period: z.string().max(100),
  description: z.string().max(2000),
  highlights: z.array(z.string().max(500)),
  tools: z.array(z.string().max(100)),
  link: safeUrl(2048),
  category: z.string().max(100),
  featured: z.boolean(),
  image: safeUrl(3_000_000).optional().or(z.literal("")),
  images: z.array(safeUrl(3_000_000)).optional(),
});

const CertificationSchema = z.object({
  id: z.string(),
  name: z.string().max(300),
  image: safeUrl(3_000_000).optional().or(z.literal("")),
});

const CustomSectionSchema = z.object({
  id: z.string(),
  title: z.string().max(200),
  body: z.string().max(5000),
  image: safeUrl(3_000_000).optional().or(z.literal("")),
});

const GalleryImageSchema = z.object({
  id: z.string(),
  url: safeUrl(3_000_000),
  caption: z.string().max(300).optional().or(z.literal("")),
});

const PostSchema = z.object({
  id: z.string(),
  title: z.string().max(300),
  date: z.string().max(50),
  body: z.string().max(5000),
});

const VisibilitySchema = z.object({
  customSections: z.boolean(),
  gallery: z.boolean(),
  posts: z.boolean(),
});

const PortfolioSchema = z.object({
  hero: z.object({
    name: z.string().max(200),
    role: z.string().max(200),
    tagline: z.string().max(500),
    location: z.string().max(200),
    availability: z.string().max(300),
  }),
  about: z.string().max(5000),
  resumeFile: z.string().max(10_000_000),
  contact: z.object({
    email: z.string().email().max(255),
    phone: z.string().max(50),
  }),
  socials: z.array(SocialSchema),
  stats: z.array(StatSchema),
  skills: z.array(SkillSchema),
  experience: z.array(ExperienceSchema),
  projects: z.array(ProjectSchema),
  certifications: z.array(CertificationSchema),
  customSections: z.array(CustomSectionSchema).optional(),
  gallery: z.array(GalleryImageSchema).optional(),
  galleryLayout: z.enum(["masonry", "grid", "stack"]).optional(),
  posts: z.array(PostSchema).optional(),
  visibility: VisibilitySchema.optional(),
});

const DB_NAME = "portfolio-db";
const STORE_NAME = "kv";
const DB_KEY = "data";

const openDB = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

const idbGet = async (): Promise<unknown> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get(DB_KEY);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

const idbSet = async (value: unknown): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(value, DB_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

const idbDel = async (): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(DB_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

const parseStored = (parsed: unknown): Portfolio | null => {
  const result = PortfolioSchema.safeParse(parsed);
  return result.success ? (result.data as Portfolio) : null;
};

const readFromLocalStorageSync = (): Portfolio => {
  if (typeof window === "undefined") return seed as Portfolio;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed as Portfolio;
    return parseStored(JSON.parse(raw)) ?? (seed as Portfolio);
  } catch {
    return seed as Portfolio;
  }
};

let cache: Portfolio = readFromLocalStorageSync();

// Async hydrate from IndexedDB (primary store) and migrate legacy localStorage.
if (typeof window !== "undefined") {
  idbGet()
    .then((val) => {
      if (val) {
        const parsed = parseStored(val);
        if (parsed) {
          cache = parsed;
          window.dispatchEvent(new Event(EVENT));
        }
      } else {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const parsed = parseStored(JSON.parse(raw));
            if (parsed) {
              idbSet(parsed).catch(() => {});
              localStorage.removeItem(STORAGE_KEY);
            }
          }
        } catch {
          /* ignore */
        }
      }
    })
    .catch(() => {});
}

const subscribe = (cb: () => void) => {
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
};

const getSnapshot = () => cache;
const getServerSnapshot = () => seed as Portfolio;

export const usePortfolio = (): Portfolio =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

export const savePortfolio = async (next: Portfolio) => {
  cache = next;
  window.dispatchEvent(new Event(EVENT));
  try {
    await idbSet(next);
  } catch (err) {
    console.error("Failed to persist portfolio to IndexedDB", err);
    throw err;
  }
};

export const resetPortfolio = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  idbDel().catch(() => {});
  cache = seed as Portfolio;
  window.dispatchEvent(new Event(EVENT));
};

export const exportPortfolio = () => {
  const blob = new Blob([JSON.stringify(cache, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "portfolio.json";
  a.click();
  URL.revokeObjectURL(url);
};

export const importPortfolio = async (file: File) => {
  const text = await file.text();
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON file. Please check the file contents.");
  }
  const result = PortfolioSchema.safeParse(raw);
  if (!result.success) {
    const first = result.error.issues[0];
    const path = first?.path.join(".") || "(root)";
    throw new Error(`Invalid portfolio data at "${path}": ${first?.message ?? "schema mismatch"}`);
  }
  await savePortfolio(result.data as Portfolio);
};

export const usePortfolioEffect = (cb: (p: Portfolio) => void) => {
  const p = usePortfolio();
  useEffect(() => cb(p), [p, cb]);
};
