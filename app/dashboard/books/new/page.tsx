"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  AlertCircle,
  Check,
  Download,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Book } from "@/lib/types";

/* ----------------------------------------------------------------
   Constantes — miroir du backend (generation.service.ts)
   ---------------------------------------------------------------- */
const PAGE_PRESETS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];
const CHAPTER_PRESETS = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const TONES = ["Professionnel", "Simple", "Expert", "Inspirant"] as const;
const AUDIENCES = [
  "Débutants",
  "Étudiants",
  "Freelances",
  "Entrepreneurs",
  "Grand Public",
] as const;

// Templates de couverture. `value` est enregistré dans book.style.
type Template = {
  value: string;
  label: string;
  tag: string;
  gradient: string;
  light?: boolean;
};
const TEMPLATES: Template[] = [
  { value: "Moderne", label: "Moderne", tag: "PREMIUM", gradient: "from-brand to-brand-600" },
  { value: "Luxe", label: "Luxe", tag: "LUXE", gradient: "from-[#2a2440] to-[#0f0d1a]" },
  { value: "Éducatif", label: "Éducatif", tag: "FORMATION", gradient: "from-emerald-500 to-teal-700" },
  { value: "Énergique", label: "Énergique", tag: "BOOST", gradient: "from-orange-500 to-red-600" },
  { value: "Minimal", label: "Minimal", tag: "GUIDE", gradient: "from-zinc-100 to-zinc-300", light: true },
  { value: "Créatif", label: "Créatif", tag: "CRÉATIF", gradient: "from-fuchsia-500 to-rose-600" },
  { value: "Tech", label: "Tech", tag: "TECH", gradient: "from-sky-600 to-indigo-800" },
  { value: "Nature", label: "Nature", tag: "NATURE", gradient: "from-green-600 to-emerald-800" },
];


/* ----------------------------------------------------------------
   Page
   ---------------------------------------------------------------- */
export default function NewBookPage() {
  return (
    <Suspense fallback={null}>
      <NewBookForm />
    </Suspense>
  );
}

function NewBookForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { refresh } = useAuth();

  // Prefill depuis le Niche Hunter (/books/new?title=...&topic=...)
  const [title, setTitle] = useState(params.get("title") ?? "");
  const [topic, setTopic] = useState(params.get("topic") ?? "");
  const [language, setLanguage] = useState("fr");
  const [template, setTemplate] = useState<Template>(TEMPLATES[0]);
  const [pages, setPages] = useState(40);
  const [chapters, setChapters] = useState(6);
  const [tone, setTone] = useState<string>(TONES[0]);
  const [audience, setAudience] = useState<string>(AUDIENCES[0]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([]);

  const lockedCount = books.filter(
    (b) =>
      !b.unlocked &&
      (b.status === "READY" || b.status === "GENERATING")
  ).length;
  const limitReached = lockedCount >= 2;

  const canSubmit =
    title.trim() !== "" && topic.trim() !== "" && !submitting && !limitReached;

  useEffect(() => {
    api
      .listBooks()
      .then((d) => setBooks(d))
      .catch(() => {
        // Silently fail — not critical for page function
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const book = await api.createBook({
        title: title.trim(),
        topic: topic.trim(),
        audience,
        tone,
        language,
        style: template.value,
      });
      await api.generate(book.id, { chapters, pages });
      await refresh();
      // Redirige vers le livre : la page détail affiche l'écran de génération
      // (barre de progression + polling) tant que le statut est GENERATING.
      router.push(`/dashboard/books/${book.id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Échec du lancement. Veuillez réessayer.",
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl pb-16">
      {/* Retour + en-tête */}
      <div style={{ animation: "rise .5s ease-out both" }}>
        <Link
          href="/dashboard/books"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Mes livres
        </Link>
        <h1 className="mt-4 font-display text-[2.5rem] font-semibold leading-tight tracking-tight">
          Ton prochain ebook pret en quelques minutes
        </h1>
        <p className="mt-2 max-w-xl text-ink-soft">
          Donne le sujet. On s’occupe du reste : rédaction, mise en page, PDF
          prêt à vendre.
        </p>
      </div>

      {limitReached && (
        <div className="mt-6 flex items-start gap-3 rounded-lg border border-accent/40 bg-accent/10 px-4 py-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent-600" />
          <div>
            <p className="text-sm font-medium text-accent-600">
              Limite de génération atteinte
            </p>
            <p className="text-sm text-accent-600/80 mt-1">
              Vous avez {lockedCount} livre{lockedCount > 1 ? "s" : ""} verrouillé{lockedCount > 1 ? "s" : ""}. Débloquez-en un pour générer un nouveau livre.
            </p>
            <Link
              href="/dashboard/books"
              className="inline-flex text-sm font-medium text-accent-600 hover:underline mt-2"
            >
              Voir mes livres →
            </Link>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_360px]"
      >
        {/* ============ Colonne gauche : le formulaire ============ */}
        <div className="space-y-6">
          {/* CONTENU */}
          <Section title="Contenu" delay={0.05}>
            <FieldLabel htmlFor="title" required>
              Titre
            </FieldLabel>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              placeholder="Ex : Guide complet du marketing digital"
              className={inputClass}
            />

            <div className="mt-5">
              <FieldLabel htmlFor="topic" required>
                Description
              </FieldLabel>
              <textarea
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Décrivez ce que les lecteurs vont apprendre…"
                className={`${inputClass} resize-y`}
              />
            </div>

            <div className="mt-5">
              <FieldLabel>Langue de l’ebook</FieldLabel>
              <p className="-mt-1 mb-2 text-xs text-ink-soft">
                Dans quelle langue votre ebook sera rédigé
              </p>
              <div className="grid grid-cols-2 gap-3 sm:max-w-sm">
                <Toggle
                  active={language === "fr"}
                  onClick={() => setLanguage("fr")}
                >
                  Français
                </Toggle>
                <Toggle
                  active={language === "en"}
                  onClick={() => setLanguage("en")}
                >
                  English
                </Toggle>
              </div>
            </div>
          </Section>

          {/* STRUCTURE */}
          <Section title="Structure" delay={0.1}>
            <Stepper
              label="Pages"
              value={pages}
              presets={PAGE_PRESETS}
              onChange={setPages}
            />
            <div className="mt-6">
              <Stepper
                label="Chapitres"
                value={chapters}
                presets={CHAPTER_PRESETS}
                onChange={setChapters}
              />
            </div>
          </Section>

          {/* STYLE */}
          <Section title="Style" delay={0.15}>
            <FieldLabel>Template de couverture</FieldLabel>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {TEMPLATES.map((t) => {
                const active = template.value === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTemplate(t)}
                    aria-pressed={active}
                    className={`group relative overflow-hidden rounded-xl border text-left transition-all ${
                      active
                        ? "border-brand ring-2 ring-brand/30"
                        : "border-line hover:border-ink/30"
                    }`}
                  >
                    <div
                      className={`flex aspect-[3/4] flex-col justify-between bg-gradient-to-br p-2.5 ${t.gradient} ${
                        t.light ? "text-ink" : "text-paper"
                      }`}
                    >
                      <span
                        className={`inline-flex w-fit rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wide ${
                          t.light
                            ? "bg-ink/10 text-ink/70"
                            : "bg-paper/20 text-paper/90"
                        }`}
                      >
                        {t.tag}
                      </span>
                      <span className="space-y-1">
                        <span className="block h-1 w-3/4 rounded-full bg-current opacity-50" />
                        <span className="block h-1 w-1/2 rounded-full bg-current opacity-30" />
                      </span>
                    </div>
                    {active && (
                      <span className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-brand text-paper">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                    )}
                    <span className="block py-1.5 text-center text-xs font-medium">
                      {t.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6">
              <FieldLabel>Ton</FieldLabel>
              <ChipGroup
                options={TONES}
                value={tone}
                onChange={setTone}
              />
            </div>

            <div className="mt-5">
              <FieldLabel>Audience</FieldLabel>
              <ChipGroup
                options={AUDIENCES}
                value={audience}
                onChange={setAudience}
              />
            </div>
          </Section>
        </div>

        {/* ============ Colonne droite : preview sticky ============ */}
        <aside
          className="lg:sticky lg:top-6"
          style={{ animation: "rise .5s ease-out .2s both" }}
        >
          <div className="overflow-hidden rounded-card border border-line bg-ink p-5 text-paper">
            {/* Couverture preview */}
            <div
              className={`relative flex aspect-[3/4] flex-col gap-4 rounded-xl bg-gradient-to-br p-5 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.7)] ${template.gradient} ${
                template.light ? "text-ink" : "text-paper"
              }`}
            >
              <span
                className={`inline-flex w-fit rounded px-2 py-0.5 text-[10px] font-semibold tracking-widest ${
                  template.light
                    ? "bg-ink/10 text-ink/70"
                    : "bg-paper/20 text-paper/90"
                }`}
              >
                {template.tag}
              </span>
              <p className="line-clamp-5 wrap-break-word text-balance font-display text-2xl font-semibold leading-tight">
                {title.trim() || "Votre titre ici"}
              </p>
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Tile value={pages} label="Pages" />
              <Tile value={chapters} label="Chapitres" />
            </div>

            {/* Checklist */}
            <ul className="mt-4 space-y-2 text-sm">
              {["PDF professionnel", "Couverture incluse", "Kit marketing"].map(
                (f) => (
                  <li key={f} className="flex items-center gap-2 text-paper/90">
                    <Check className="h-4 w-4 text-money" strokeWidth={3} />
                    {f}
                  </li>
                ),
              )}
            </ul>

            <button
              type="button"
              disabled
              className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-paper/15 text-sm font-medium text-paper/50"
            >
              <Download className="h-4 w-4" />
              Télécharger la cover
            </button>
          </div>

          {/* Soumission */}
          <div className="mt-4 space-y-3">

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-card border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink font-medium text-paper transition-colors hover:bg-brand disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Sparkles className="h-5 w-5" />
              )}
              {submitting ? "Génération en cours…" : "Générer le livre"}
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
}

/* ----------------------------------------------------------------
   Sous-composants
   ---------------------------------------------------------------- */
const inputClass =
  "w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/70 focus:border-brand focus:ring-2 focus:ring-brand/25";

function Section({
  title,
  delay,
  children,
}: {
  title: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-card border border-line bg-paper p-6"
      style={{ animation: `rise .5s ease-out ${delay}s both` }}
    >
      <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
        {title}
      </h2>
      {children}
    </section>
  );
}

function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-sm font-medium text-ink"
    >
      {children}
      {required && <span className="ml-0.5 text-brand">*</span>}
    </label>
  );
}

function Toggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`h-11 rounded-xl border text-sm font-medium transition-colors ${
        active
          ? "border-brand bg-brand-100 text-brand"
          : "border-line text-ink-soft hover:border-ink/30 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function Stepper({
  label,
  value,
  presets,
  onChange,
}: {
  label: string;
  value: number;
  presets: number[];
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-ink">{label}</span>
        <span className="font-display text-2xl font-semibold tabular-nums">
          {value}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {presets.map((p) => {
          const active = value === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              aria-pressed={active}
              className={`h-10 min-w-12 rounded-lg border px-4 text-sm font-medium tabular-nums transition-colors ${
                active
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-ink-soft hover:border-ink/30 hover:text-ink"
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChipGroup({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value === o;
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            aria-pressed={active}
            className={`h-10 rounded-full border px-4 text-sm font-medium transition-colors ${
              active
                ? "border-ink bg-ink text-paper"
                : "border-line text-ink-soft hover:border-ink/30 hover:text-ink"
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

function Tile({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl bg-paper/5 py-3 text-center ring-1 ring-inset ring-paper/10">
      <div className="font-display text-3xl font-semibold tabular-nums">
        {value}
      </div>
      <div className="mt-0.5 text-[11px] uppercase tracking-widest text-paper/50">
        {label}
      </div>
    </div>
  );
}
