import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  usePortfolio,
  savePortfolio,
  resetPortfolio,
  exportPortfolio,
  importPortfolio,
} from "@/lib/portfolioStore";

import type {
  Portfolio,
  Skill,
  Experience,
  Project,
  Certification,
  Social,
  Stat,
  CustomSection,
  GalleryImage,
  Post,
  SectionVisibility,
} from "@/lib/portfolio";
import { toast } from "@/hooks/use-toast";
import { ImageField } from "@/components/admin/ImageField";
import {
  ArrowLeft,
  Download,
  Upload,
  RotateCcw,
  LogOut,
  Plus,
  Trash2,
  Save,
  
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const inputClass =
  "w-full bg-secondary/40 border border-hairline rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition";
const labelClass =
  "font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 block";

const uid = () => Math.random().toString(36).slice(2, 9);




const Section = ({
  title,
  index,
  children,
}: {
  title: string;
  index: string;
  children: React.ReactNode;
}) => (
  <section className="border border-hairline bg-card/50 backdrop-blur rounded-sm p-6 md:p-8">
    <div className="flex items-center gap-3 mb-6">
      <span className="font-mono text-xs text-primary">{index}</span>
      <h2 className="font-display text-xl font-bold">{title}</h2>
      <span className="h-px flex-1 bg-border" />
    </div>
    <div className="space-y-4">{children}</div>
  </section>
);

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className={labelClass}>{label}</label>
    {children}
  </div>
);

const ListCard = ({
  children,
  onRemove,
  badge,
}: {
  children: React.ReactNode;
  onRemove: () => void;
  badge: string;
}) => (
  <div className="border border-hairline bg-secondary/30 rounded-sm p-4 space-y-3 relative">
    <div className="flex items-center justify-between">
      <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
        {badge}
      </span>
      <button
        type="button"
        onClick={onRemove}
        className="text-muted-foreground hover:text-destructive transition"
        aria-label="Remove"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
    {children}
  </div>
);

const AddBtn = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-2 border border-dashed border-border hover:border-primary text-muted-foreground hover:text-primary rounded-sm px-3 py-2 font-mono text-[10px] uppercase tracking-widest transition"
  >
    <Plus className="h-3.5 w-3.5" /> {label}
  </button>
);

const AdminEditor = ({ onLogout }: { onLogout: () => void }) => {
  const live = usePortfolio();
  const [draft, setDraft] = useState<Portfolio>(live);
  const [dirty, setDirty] = useState(false);
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  // Sync draft when live data changes externally (e.g. reset)
  useEffect(() => {
    if (!dirty) setDraft(live);
  }, [live, dirty]);

  const update = <K extends keyof Portfolio>(key: K, value: Portfolio[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setDirty(true);
  };

  const save = async () => {
    try {
      await savePortfolio(draft);
      setDirty(false);
      toast({ title: "Saved", description: "Portfolio updated. Changes are live." });
    } catch (err) {
      toast({
        title: "Save failed",
        description: err instanceof Error ? err.message : "Could not save portfolio.",
        variant: "destructive",
      });
    }
  };

  const onImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await importPortfolio(file);
      setDirty(false);
      toast({ title: "Imported", description: "Portfolio loaded from file." });
    } catch (err) {
      toast({ title: "Import failed", description: String(err), variant: "destructive" });
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Top bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-hairline">
        <div className="container flex h-16 items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate("/")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-hairline text-muted-foreground hover:text-primary hover:border-primary transition"
              aria-label="Back to site"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <div className="font-display text-base font-bold truncate">Portfolio Admin</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {dirty ? "● Unsaved changes" : "All changes saved"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              onChange={onImport}
              className="hidden"
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-sm border border-hairline px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary transition"
              title="Import JSON"
            >
              <Upload className="h-3.5 w-3.5" /> Import
            </button>
            <button
              onClick={exportPortfolio}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-sm border border-hairline px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary transition"
              title="Export JSON"
            >
              <Download className="h-3.5 w-3.5" /> Export
            </button>
            <button
              onClick={() => {
                if (confirm("Reset portfolio to default seed data? Your edits will be lost.")) {
                  resetPortfolio();
                  setDirty(false);
                  toast({ title: "Reset", description: "Restored seed data." });
                }
              }}
              className="hidden md:inline-flex items-center gap-1.5 rounded-sm border border-hairline px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:border-destructive hover:text-destructive transition"
              title="Reset to defaults"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
            <button
              onClick={save}
              disabled={!dirty}
              className="inline-flex items-center gap-1.5 rounded-sm bg-gradient-primary px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-primary-foreground shadow-glow disabled:opacity-40 disabled:shadow-none transition"
            >
              <Save className="h-3.5 w-3.5" /> Save
            </button>
            <button
              onClick={onLogout}
              className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-hairline text-muted-foreground hover:text-destructive hover:border-destructive transition"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="container max-w-5xl py-10 space-y-6">
        {/* Hero */}
        <Section index="01" title="Hero">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Name">
              <input
                className={inputClass}
                value={draft.hero.name}
                onChange={(e) => update("hero", { ...draft.hero, name: e.target.value })}
              />
            </Field>
            <Field label="Role">
              <input
                className={inputClass}
                value={draft.hero.role}
                onChange={(e) => update("hero", { ...draft.hero, role: e.target.value })}
              />
            </Field>
            <Field label="Location">
              <input
                className={inputClass}
                value={draft.hero.location}
                onChange={(e) => update("hero", { ...draft.hero, location: e.target.value })}
              />
            </Field>
            <Field label="Availability">
              <input
                className={inputClass}
                value={draft.hero.availability}
                onChange={(e) =>
                  update("hero", { ...draft.hero, availability: e.target.value })
                }
              />
            </Field>
          </div>
          <Field label="Tagline">
            <textarea
              rows={3}
              className={inputClass}
              value={draft.hero.tagline}
              onChange={(e) => update("hero", { ...draft.hero, tagline: e.target.value })}
            />
          </Field>
        </Section>

        {/* About + Resume */}
        <Section index="02" title="About & Resume">
          <Field label="About paragraph">
            <textarea
              rows={6}
              className={inputClass}
              value={draft.about}
              onChange={(e) => update("about", e.target.value)}
            />
          </Field>
          <Field label="Resume (PDF)">
            <div className="space-y-2">
              <input
                type="file"
                accept="application/pdf"
                className={inputClass}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 4 * 1024 * 1024) {
                    toast({
                      title: "PDF too large",
                      description:
                        "Please keep the resume under 4 MB. Larger files can't be saved to local storage.",
                      variant: "destructive",
                    });
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = () => update("resumeFile", String(reader.result));
                  reader.onerror = () =>
                    toast({
                      title: "Couldn't read PDF",
                      description: "Try a different file.",
                      variant: "destructive",
                    });
                  reader.readAsDataURL(file);
                }}
              />
              {draft.resumeFile?.startsWith("data:") ? (
                <div className="flex items-center justify-between gap-2 rounded-sm border border-hairline px-3 py-2 text-xs text-muted-foreground">
                  <span className="truncate">
                    PDF uploaded ({Math.round((draft.resumeFile.length * 0.75) / 1024)} KB)
                  </span>
                  <button
                    type="button"
                    className="text-destructive hover:underline"
                    onClick={() => update("resumeFile", "")}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <input
                  className={inputClass}
                  value={draft.resumeFile}
                  onChange={(e) => update("resumeFile", e.target.value)}
                  placeholder="/MA_AMEEN_DA_Resume.pdf"
                />
              )}
              {draft.resumeFile && (
                <a
                  href={draft.resumeFile}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-primary underline"
                >
                  Preview current resume
                </a>
              )}
            </div>
          </Field>
        </Section>

        {/* Contact + Socials */}
        <Section index="03" title="Contact & Socials">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Email">
              <input
                type="email"
                className={inputClass}
                value={draft.contact.email}
                onChange={(e) =>
                  update("contact", { ...draft.contact, email: e.target.value })
                }
              />
            </Field>
            <Field label="Phone">
              <input
                className={inputClass}
                value={draft.contact.phone}
                onChange={(e) =>
                  update("contact", { ...draft.contact, phone: e.target.value })
                }
              />
            </Field>
          </div>

          <div className="space-y-3 pt-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Social links
            </div>
            {draft.socials.map((s, i) => (
              <ListCard
                key={s.id}
                badge={`Link 0${i + 1}`}
                onRemove={() =>
                  update(
                    "socials",
                    draft.socials.filter((x) => x.id !== s.id)
                  )
                }
              >
                <div className="grid md:grid-cols-3 gap-3">
                  <Field label="Label">
                    <input
                      className={inputClass}
                      value={s.label}
                      onChange={(e) => {
                        const next = [...draft.socials];
                        next[i] = { ...s, label: e.target.value };
                        update("socials", next);
                      }}
                    />
                  </Field>
                  <Field label="URL">
                    <input
                      className={inputClass}
                      value={s.url}
                      onChange={(e) => {
                        const next = [...draft.socials];
                        next[i] = { ...s, url: e.target.value };
                        update("socials", next);
                      }}
                    />
                  </Field>
                  <Field label="Icon (mail, phone, linkedin, github)">
                    <input
                      className={inputClass}
                      value={s.icon}
                      onChange={(e) => {
                        const next = [...draft.socials];
                        next[i] = { ...s, icon: e.target.value };
                        update("socials", next);
                      }}
                    />
                  </Field>
                </div>
              </ListCard>
            ))}
            <AddBtn
              label="Add social"
              onClick={() => {
                const newSocial: Social = { id: uid(), label: "", url: "", icon: "mail" };
                update("socials", [...draft.socials, newSocial]);
              }}
            />
          </div>
        </Section>

        {/* Stats */}
        <Section index="04" title="Stats strip">
          <div className="grid md:grid-cols-2 gap-3">
            {draft.stats.map((s, i) => (
              <ListCard
                key={i}
                badge={`Stat 0${i + 1}`}
                onRemove={() =>
                  update(
                    "stats",
                    draft.stats.filter((_, j) => j !== i)
                  )
                }
              >
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Value">
                    <input
                      className={inputClass}
                      value={s.value}
                      onChange={(e) => {
                        const next = [...draft.stats];
                        next[i] = { ...s, value: e.target.value };
                        update("stats", next);
                      }}
                    />
                  </Field>
                  <Field label="Label">
                    <input
                      className={inputClass}
                      value={s.label}
                      onChange={(e) => {
                        const next = [...draft.stats];
                        next[i] = { ...s, label: e.target.value };
                        update("stats", next);
                      }}
                    />
                  </Field>
                </div>
              </ListCard>
            ))}
          </div>
          <AddBtn
            label="Add stat"
            onClick={() => {
              const newStat: Stat = { value: "0", label: "New stat" };
              update("stats", [...draft.stats, newStat]);
            }}
          />
        </Section>

        {/* Skills */}
        <Section index="05" title="Skills">
          <div className="space-y-3">
            {draft.skills.map((s, i) => (
              <ListCard
                key={s.id}
                badge={`Skill 0${i + 1}`}
                onRemove={() =>
                  update(
                    "skills",
                    draft.skills.filter((x) => x.id !== s.id)
                  )
                }
              >
                <div className="grid md:grid-cols-[1fr_140px] gap-3 items-end">
                  <Field label="Name">
                    <input
                      className={inputClass}
                      value={s.name}
                      onChange={(e) => {
                        const next = [...draft.skills];
                        next[i] = { ...s, name: e.target.value };
                        update("skills", next);
                      }}
                    />
                  </Field>
                  <Field label={`Level (${s.level}/100)`}>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={s.level}
                      onChange={(e) => {
                        const next = [...draft.skills];
                        next[i] = { ...s, level: Number(e.target.value) };
                        update("skills", next);
                      }}
                      className="w-full accent-primary"
                    />
                  </Field>
                </div>
              </ListCard>
            ))}
            <AddBtn
              label="Add skill"
              onClick={() => {
                const newSkill: Skill = { id: uid(), name: "New skill", level: 70 };
                update("skills", [...draft.skills, newSkill]);
              }}
            />
          </div>
        </Section>

        {/* Experience */}
        <Section index="06" title="Experience">
          <div className="space-y-3">
            {draft.experience.map((exp, i) => (
              <ListCard
                key={exp.id}
                badge={`Role 0${i + 1}`}
                onRemove={() =>
                  update(
                    "experience",
                    draft.experience.filter((x) => x.id !== exp.id)
                  )
                }
              >
                <div className="grid md:grid-cols-2 gap-3">
                  <Field label="Role">
                    <input
                      className={inputClass}
                      value={exp.role}
                      onChange={(e) => {
                        const next = [...draft.experience];
                        next[i] = { ...exp, role: e.target.value };
                        update("experience", next);
                      }}
                    />
                  </Field>
                  <Field label="Company">
                    <input
                      className={inputClass}
                      value={exp.company}
                      onChange={(e) => {
                        const next = [...draft.experience];
                        next[i] = { ...exp, company: e.target.value };
                        update("experience", next);
                      }}
                    />
                  </Field>
                  <Field label="Period">
                    <input
                      className={inputClass}
                      value={exp.period}
                      onChange={(e) => {
                        const next = [...draft.experience];
                        next[i] = { ...exp, period: e.target.value };
                        update("experience", next);
                      }}
                    />
                  </Field>
                  <Field label="Location">
                    <input
                      className={inputClass}
                      value={exp.location}
                      onChange={(e) => {
                        const next = [...draft.experience];
                        next[i] = { ...exp, location: e.target.value };
                        update("experience", next);
                      }}
                    />
                  </Field>
                </div>
                <Field label="Bullets (one per line)">
                  <textarea
                    rows={Math.max(3, exp.bullets.length)}
                    className={inputClass}
                    value={exp.bullets.join("\n")}
                    onChange={(e) => {
                      const next = [...draft.experience];
                      next[i] = {
                        ...exp,
                        bullets: e.target.value.split("\n").filter((l) => l.length > 0),
                      };
                      update("experience", next);
                    }}
                  />
                </Field>
              </ListCard>
            ))}
            <AddBtn
              label="Add role"
              onClick={() => {
                const newExp: Experience = {
                  id: uid(),
                  role: "New role",
                  company: "Company",
                  period: "2024 — Present",
                  location: "Remote",
                  bullets: ["Achievement"],
                };
                update("experience", [...draft.experience, newExp]);
              }}
            />
          </div>
        </Section>

        {/* Projects */}
        <Section index="07" title="Projects">
          <div className="space-y-3">
            {draft.projects.map((p, i) => {
              const move = (dir: -1 | 1) => {
                const j = i + dir;
                if (j < 0 || j >= draft.projects.length) return;
                const next = [...draft.projects];
                [next[i], next[j]] = [next[j], next[i]];
                update("projects", next);
              };
              return (
              <ListCard
                key={p.id}
                badge={`Project 0${i + 1}${p.featured ? " · ★" : ""}`}
                onRemove={() =>
                  update(
                    "projects",
                    draft.projects.filter((x) => x.id !== p.id)
                  )
                }
              >
                <div className="flex items-center gap-2 -mt-1">
                  <button
                    type="button"
                    onClick={() => move(-1)}
                    disabled={i === 0}
                    aria-label="Move up"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-sm border border-hairline text-muted-foreground hover:text-primary hover:border-primary transition disabled:opacity-30 disabled:hover:text-muted-foreground disabled:hover:border-hairline"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(1)}
                    disabled={i === draft.projects.length - 1}
                    aria-label="Move down"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-sm border border-hairline text-muted-foreground hover:text-primary hover:border-primary transition disabled:opacity-30 disabled:hover:text-muted-foreground disabled:hover:border-hairline"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Reorder
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <Field label="Title">
                    <input
                      className={inputClass}
                      value={p.title}
                      onChange={(e) => {
                        const next = [...draft.projects];
                        next[i] = { ...p, title: e.target.value };
                        update("projects", next);
                      }}
                    />
                  </Field>
                  <Field label="Subtitle">
                    <input
                      className={inputClass}
                      value={p.subtitle}
                      onChange={(e) => {
                        const next = [...draft.projects];
                        next[i] = { ...p, subtitle: e.target.value };
                        update("projects", next);
                      }}
                    />
                  </Field>
                  <Field label="Period">
                    <input
                      className={inputClass}
                      value={p.period}
                      onChange={(e) => {
                        const next = [...draft.projects];
                        next[i] = { ...p, period: e.target.value };
                        update("projects", next);
                      }}
                    />
                  </Field>
                  <Field label="Category">
                    <input
                      className={inputClass}
                      value={p.category}
                      onChange={(e) => {
                        const next = [...draft.projects];
                        next[i] = { ...p, category: e.target.value };
                        update("projects", next);
                      }}
                    />
                  </Field>
                  <Field label="Link (optional)">
                    <input
                      className={inputClass}
                      value={p.link}
                      onChange={(e) => {
                        const next = [...draft.projects];
                        next[i] = { ...p, link: e.target.value };
                        update("projects", next);
                      }}
                    />
                  </Field>
                  <Field label="Featured">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={p.featured}
                        onChange={(e) => {
                          const next = [...draft.projects];
                          next[i] = { ...p, featured: e.target.checked };
                          update("projects", next);
                        }}
                        className="h-4 w-4 accent-primary"
                      />
                      <span className="text-muted-foreground">Show as wide card</span>
                    </label>
                  </Field>
                </div>
                <Field label="Description">
                  <textarea
                    rows={3}
                    className={inputClass}
                    value={p.description}
                    onChange={(e) => {
                      const next = [...draft.projects];
                      next[i] = { ...p, description: e.target.value };
                      update("projects", next);
                    }}
                  />
                </Field>
                <Field label="Highlights (one per line)">
                  <textarea
                    rows={Math.max(3, p.highlights.length)}
                    className={inputClass}
                    value={p.highlights.join("\n")}
                    onChange={(e) => {
                      const next = [...draft.projects];
                      next[i] = {
                        ...p,
                        highlights: e.target.value.split("\n").filter((l) => l.length > 0),
                      };
                      update("projects", next);
                    }}
                  />
                </Field>
                <Field label="Tools (comma-separated)">
                  <input
                    className={inputClass}
                    value={p.tools.join(", ")}
                    onChange={(e) => {
                      const next = [...draft.projects];
                      next[i] = {
                        ...p,
                        tools: e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean),
                      };
                      update("projects", next);
                    }}
                  />
                </Field>
                <Field label="Cover image (optional — shown at top of card)">
                  <ImageField
                    value={p.image ?? ""}
                    onChange={(val) => {
                      const next = [...draft.projects];
                      next[i] = { ...p, image: val };
                      update("projects", next);
                    }}
                  />
                </Field>
                <Field label="Additional images (click cover on site to browse all)">
                  <div className="space-y-3">
                    {(p.images ?? []).map((img, k) => (
                      <div key={k} className="border border-hairline rounded-sm p-3 bg-background/40 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                            Image {String(k + 2).padStart(2, "0")}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={k === 0}
                              onClick={() => {
                                const arr = [...(p.images ?? [])];
                                [arr[k - 1], arr[k]] = [arr[k], arr[k - 1]];
                                const next = [...draft.projects];
                                next[i] = { ...p, images: arr };
                                update("projects", next);
                              }}
                              className="text-muted-foreground hover:text-primary disabled:opacity-30"
                              aria-label="Move up"
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={k === (p.images?.length ?? 0) - 1}
                              onClick={() => {
                                const arr = [...(p.images ?? [])];
                                [arr[k], arr[k + 1]] = [arr[k + 1], arr[k]];
                                const next = [...draft.projects];
                                next[i] = { ...p, images: arr };
                                update("projects", next);
                              }}
                              className="text-muted-foreground hover:text-primary disabled:opacity-30"
                              aria-label="Move down"
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const arr = (p.images ?? []).filter((_, j) => j !== k);
                                const next = [...draft.projects];
                                next[i] = { ...p, images: arr };
                                update("projects", next);
                              }}
                              className="text-muted-foreground hover:text-destructive"
                              aria-label="Remove"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <ImageField
                          value={img}
                          onChange={(val) => {
                            const arr = [...(p.images ?? [])];
                            arr[k] = val;
                            const next = [...draft.projects];
                            next[i] = { ...p, images: arr };
                            update("projects", next);
                          }}
                        />
                      </div>
                    ))}
                    <AddBtn
                      label="Add image"
                      onClick={() => {
                        const arr = [...(p.images ?? []), ""];
                        const next = [...draft.projects];
                        next[i] = { ...p, images: arr };
                        update("projects", next);
                      }}
                    />
                  </div>
                </Field>
              </ListCard>
            );
          })}
            <AddBtn
              label="Add project"
              onClick={() => {
                const newProj: Project = {
                  id: uid(),
                  title: "New project",
                  subtitle: "",
                  period: "",
                  description: "",
                  highlights: [],
                  tools: [],
                  link: "",
                  category: "General",
                  featured: false,
                };
                update("projects", [...draft.projects, newProj]);
              }}
            />
          </div>
        </Section>

        {/* Certifications */}
        <Section index="08" title="Certifications">
          <div className="space-y-3">
            {draft.certifications.map((c, i) => (
              <ListCard
                key={c.id}
                badge={`Cert 0${i + 1}`}
                onRemove={() =>
                  update(
                    "certifications",
                    draft.certifications.filter((x) => x.id !== c.id)
                  )
                }
              >
                <Field label="Name">
                  <input
                    className={inputClass}
                    value={c.name}
                    onChange={(e) => {
                      const next = [...draft.certifications];
                      next[i] = { ...c, name: e.target.value };
                      update("certifications", next);
                    }}
                  />
                </Field>
                <Field label="Image (optional — certificate badge or screenshot)">
                  <ImageField
                    value={c.image ?? ""}
                    previewClassName="mt-2 h-20 w-auto rounded-sm border border-hairline object-cover"
                    onChange={(val) => {
                      const next = [...draft.certifications];
                      next[i] = { ...c, image: val };
                      update("certifications", next);
                    }}
                  />
                </Field>
              </ListCard>
            ))}
            <AddBtn
              label="Add certification"
              onClick={() => {
                const newCert: Certification = { id: uid(), name: "New certification" };
                update("certifications", [...draft.certifications, newCert]);
              }}
            />
          </div>
        </Section>

        {/* Visibility toggles */}
        <Section index="09" title="Optional sections — visibility">
          <p className="text-xs text-muted-foreground -mt-2">
            Toggle off to hide a section site-wide. Sections also auto-hide when they have no items.
          </p>
          {(() => {
            const v: SectionVisibility = {
              customSections: draft.visibility?.customSections !== false,
              gallery: draft.visibility?.gallery !== false,
              posts: draft.visibility?.posts !== false,
            };
            const setV = (key: keyof SectionVisibility, value: boolean) => {
              update("visibility", { ...v, [key]: value });
            };
            const Row = ({
              label,
              hint,
              checked,
              onChange,
            }: {
              label: string;
              hint: string;
              checked: boolean;
              onChange: (b: boolean) => void;
            }) => (
              <label className="flex items-start justify-between gap-4 border border-hairline rounded-sm bg-secondary/30 p-4 cursor-pointer">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-widest text-foreground">
                    {label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{hint}</div>
                </div>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => onChange(e.target.checked)}
                  className="h-4 w-4 mt-1 accent-primary"
                />
              </label>
            );
            return (
              <div className="grid md:grid-cols-3 gap-3">
                <Row
                  label="Custom sections"
                  hint="Title + text + optional image blocks."
                  checked={v.customSections}
                  onChange={(b) => setV("customSections", b)}
                />
                <Row
                  label="Gallery"
                  hint="Masonry image grid."
                  checked={v.gallery}
                  onChange={(b) => setV("gallery", b)}
                />
                <Row
                  label="Posts"
                  hint="Title + date + body entries."
                  checked={v.posts}
                  onChange={(b) => setV("posts", b)}
                />
              </div>
            );
          })()}
        </Section>

        {/* Custom Sections */}
        <Section index="10" title="Custom sections (optional)">
          <p className="text-xs text-muted-foreground -mt-2">
            Free-form blocks shown on the site. Each has a title, body, and optional image.
          </p>
          <div className="space-y-3">
            {(draft.customSections ?? []).map((s, i) => (
              <ListCard
                key={s.id}
                badge={`Section 0${i + 1}`}
                onRemove={() =>
                  update(
                    "customSections",
                    (draft.customSections ?? []).filter((x) => x.id !== s.id)
                  )
                }
              >
                <Field label="Title">
                  <input
                    className={inputClass}
                    value={s.title}
                    onChange={(e) => {
                      const next = [...(draft.customSections ?? [])];
                      next[i] = { ...s, title: e.target.value };
                      update("customSections", next);
                    }}
                  />
                </Field>
                <Field label="Body (line breaks preserved)">
                  <textarea
                    rows={5}
                    className={inputClass}
                    value={s.body}
                    onChange={(e) => {
                      const next = [...(draft.customSections ?? [])];
                      next[i] = { ...s, body: e.target.value };
                      update("customSections", next);
                    }}
                  />
                </Field>
                <Field label="Image (optional)">
                  <ImageField
                    value={s.image ?? ""}
                    onChange={(val) => {
                      const next = [...(draft.customSections ?? [])];
                      next[i] = { ...s, image: val };
                      update("customSections", next);
                    }}
                  />
                </Field>
              </ListCard>
            ))}
            <AddBtn
              label="Add custom section"
              onClick={() => {
                const newSection: CustomSection = {
                  id: uid(),
                  title: "New section",
                  body: "",
                };
                update("customSections", [...(draft.customSections ?? []), newSection]);
              }}
            />
          </div>
        </Section>

        {/* Gallery */}
        <Section index="11" title="Gallery (optional)">
          <p className="text-xs text-muted-foreground -mt-2">
            Upload images, choose a layout, and use the arrow buttons to reorder. Visitors can click any image to zoom and download.
          </p>

          <Field label="Layout">
            <div className="flex flex-wrap gap-2">
              {(["masonry", "grid", "stack"] as const).map((opt) => {
                const current = draft.galleryLayout ?? "masonry";
                const active = current === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => update("galleryLayout", opt)}
                    className={`px-3 py-1.5 rounded-sm font-mono text-[10px] uppercase tracking-widest transition border ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-hairline text-muted-foreground hover:border-primary hover:text-primary"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </Field>

          <div className="space-y-3">
            {(draft.gallery ?? []).map((g, i) => {
              const list = draft.gallery ?? [];
              const move = (dir: -1 | 1) => {
                const j = i + dir;
                if (j < 0 || j >= list.length) return;
                const next = [...list];
                [next[i], next[j]] = [next[j], next[i]];
                update("gallery", next);
              };
              return (
                <ListCard
                  key={g.id}
                  badge={`Image ${String(i + 1).padStart(2, "0")}`}
                  onRemove={() =>
                    update(
                      "gallery",
                      list.filter((x) => x.id !== g.id)
                    )
                  }
                >
                  <div className="flex items-center gap-2 -mt-1">
                    <button
                      type="button"
                      onClick={() => move(-1)}
                      disabled={i === 0}
                      aria-label="Move up"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-sm border border-hairline text-muted-foreground hover:text-primary hover:border-primary transition disabled:opacity-30 disabled:hover:text-muted-foreground disabled:hover:border-hairline"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(1)}
                      disabled={i === list.length - 1}
                      aria-label="Move down"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-sm border border-hairline text-muted-foreground hover:text-primary hover:border-primary transition disabled:opacity-30 disabled:hover:text-muted-foreground disabled:hover:border-hairline"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Reorder
                    </span>
                  </div>
                  <Field label="Image">
                    <ImageField
                      value={g.url}
                      onChange={(val) => {
                        const next = [...list];
                        next[i] = { ...g, url: val };
                        update("gallery", next);
                      }}
                    />
                  </Field>
                  <Field label="Caption (optional)">
                    <input
                      className={inputClass}
                      value={g.caption ?? ""}
                      onChange={(e) => {
                        const next = [...list];
                        next[i] = { ...g, caption: e.target.value };
                        update("gallery", next);
                      }}
                    />
                  </Field>
                </ListCard>
              );
            })}
            <AddBtn
              label="Add gallery image"
              onClick={() => {
                const newImg: GalleryImage = { id: uid(), url: "" };
                update("gallery", [...(draft.gallery ?? []), newImg]);
              }}
            />
          </div>
        </Section>

        {/* Posts */}
        <Section index="12" title="Posts (optional)">
          <p className="text-xs text-muted-foreground -mt-2">
            Short notes or updates with a date. Sorted newest first when dates are valid.
          </p>
          <div className="space-y-3">
            {(draft.posts ?? []).map((p, i) => (
              <ListCard
                key={p.id}
                badge={`Post 0${i + 1}`}
                onRemove={() =>
                  update(
                    "posts",
                    (draft.posts ?? []).filter((x) => x.id !== p.id)
                  )
                }
              >
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <Field label="Title">
                      <input
                        className={inputClass}
                        value={p.title}
                        onChange={(e) => {
                          const next = [...(draft.posts ?? [])];
                          next[i] = { ...p, title: e.target.value };
                          update("posts", next);
                        }}
                      />
                    </Field>
                  </div>
                  <Field label="Date (e.g. Apr 2026)">
                    <input
                      className={inputClass}
                      value={p.date}
                      onChange={(e) => {
                        const next = [...(draft.posts ?? [])];
                        next[i] = { ...p, date: e.target.value };
                        update("posts", next);
                      }}
                    />
                  </Field>
                </div>
                <Field label="Body">
                  <textarea
                    rows={5}
                    className={inputClass}
                    value={p.body}
                    onChange={(e) => {
                      const next = [...(draft.posts ?? [])];
                      next[i] = { ...p, body: e.target.value };
                      update("posts", next);
                    }}
                  />
                </Field>
              </ListCard>
            ))}
            <AddBtn
              label="Add post"
              onClick={() => {
                const newPost: Post = {
                  id: uid(),
                  title: "New post",
                  date: new Date().toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  }),
                  body: "",
                };
                update("posts", [...(draft.posts ?? []), newPost]);
              }}
            />
          </div>
        </Section>

        {/* Bottom save bar */}
        <div className="sticky bottom-4 flex justify-end">
          <button
            onClick={save}
            disabled={!dirty}
            className="inline-flex items-center gap-2 rounded-sm bg-gradient-primary px-5 py-3 font-mono text-xs uppercase tracking-wider text-primary-foreground shadow-glow disabled:opacity-40 disabled:shadow-none transition"
          >
            <Save className="h-4 w-4" />
            {dirty ? "Save changes" : "All saved"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Admin · Portfolio Editor";
  }, []);

  return <AdminEditor onLogout={() => navigate("/")} />;
};

export default Admin;
