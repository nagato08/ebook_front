"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Loader2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Target,
  Coins,
  Users,
  Compass,
  ArrowRight,
  Lightbulb,
} from "lucide-react";
import { api } from "@/lib/api";
import type { NicheAnalysis, NicheLevel, NicheTrend } from "@/lib/types";

const EXAMPLES = [
  "productivité étudiants",
  "marketing digital",
  "développement personnel",
  "finance personnelle",
  "cuisine africaine",
];

export default function NichePage() {
  const [keyword, setKeyword] = useState("");
  const [result, setResult] = useState<NicheAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (kw: string) => {
    const q = kw.trim();
    if (q.length < 2 || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.analyzeNiche(q);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec de l’analyse.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl pb-16">
      {/* En-tête + recherche */}
      <div style={{ animation: "rise .5s ease-out both" }}>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand">
          <Compass className="h-3.5 w-3.5" />
          Niche Hunter
        </span>
        <h1 className="mt-4 font-display text-[2.5rem] font-semibold leading-tight tracking-tight">
          Trouvez une niche qui vend
        </h1>
        <p className="mt-2 max-w-xl text-ink-soft">
          Analysez un sujet avant d’écrire : demande, concurrence, sous-niches
          et titres prêts à générer.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void run(keyword);
          }}
          className="mt-6 flex flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-soft" />
            <input
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Ex : productivité pour étudiants…"
              aria-label="Sujet à analyser"
              className="h-13 w-full rounded-full border border-line bg-paper py-3.5 pl-12 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-brand focus:ring-2 focus:ring-brand/25"
            />
          </div>
          <button
            type="submit"
            disabled={keyword.trim().length < 2 || loading}
            className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 font-medium text-paper transition-colors hover:bg-brand disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
            Analyser
          </button>
        </form>

        {/* Exemples cliquables */}
        {!result && !loading && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-ink-soft">Essayez :</span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => {
                  setKeyword(ex);
                  void run(ex);
                }}
                className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-ink/30 hover:text-ink"
              >
                {ex}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Erreur */}
      {error && (
        <div
          role="alert"
          className="mt-8 flex items-start gap-3 rounded-card border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
        >
          <AlertCircle className="mt-0.5 h-4.5 w-4.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Chargement */}
      {loading && <SkeletonResult />}

      {/* Résultats */}
      {result && !loading && <Result data={result} />}

      {/* Empty state (avant recherche) */}
      {!result && !loading && !error && <EmptyState />}
    </div>
  );
}

/* ----------------------------------------------------------------
   Résultats
   ---------------------------------------------------------------- */
function Result({ data }: { data: NicheAnalysis }) {
  return (
    <div className="mt-8 space-y-6">
      {/* Carte score (sombre) */}
      <section
        className="grid gap-6 rounded-card border border-line bg-ink p-6 text-paper sm:grid-cols-[auto_1fr] sm:items-center sm:p-8"
        style={{ animation: "rise .5s ease-out both" }}
      >
        <ScoreRing score={data.score} />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-2xl font-semibold capitalize">
              {data.keyword}
            </h2>
            <SourceBadge source={data.source} />
          </div>
          <p className="mt-2 text-paper/70">{data.summary}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <TrendPill trend={data.trend} />
            <MetricPill
              label="Demande"
              level={data.demand}
              goodIsHigh
              icon={<Target className="h-3.5 w-3.5" />}
            />
            <MetricPill
              label="Concurrence"
              level={data.competition}
              goodIsHigh={false}
              icon={<Users className="h-3.5 w-3.5" />}
            />
          </div>
        </div>
      </section>

      {/* Audience + monétisation */}
      <div
        className="grid gap-5 sm:grid-cols-2"
        style={{ animation: "rise .5s ease-out .05s both" }}
      >
        <InfoCard
          icon={<Users className="h-4.5 w-4.5" />}
          title="Audience cible"
          body={data.audience}
        />
        <InfoCard
          icon={<Coins className="h-4.5 w-4.5" />}
          title="Potentiel de monétisation"
          body={data.monetization}
        />
      </div>

      {/* Sous-niches */}
      {data.subNiches.length > 0 && (
        <section style={{ animation: "rise .5s ease-out .1s both" }}>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
            Sous-niches à exploiter
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.subNiches.map((s) => (
              <div
                key={s.name}
                className="rounded-card border border-line bg-paper p-4"
              >
                <p className="flex items-start gap-2 font-medium text-ink">
                  <Compass className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  {s.name}
                </p>
                <p className="mt-1.5 pl-6 text-sm text-ink-soft">{s.angle}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Titres -> générer */}
      {data.titles.length > 0 && (
        <section style={{ animation: "rise .5s ease-out .15s both" }}>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
            Titres prêts à générer
          </h3>
          <ul className="overflow-hidden rounded-card border border-line bg-paper">
            {data.titles.map((title, i) => (
              <li
                key={title}
                className={`flex items-center gap-3 px-4 py-3 sm:px-5 ${
                  i > 0 ? "border-t border-line" : ""
                }`}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-100 font-display text-sm font-semibold text-brand tabular-nums">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 truncate font-medium text-ink">
                  {title}
                </span>
                <Link
                  href={`/dashboard/books/new?title=${encodeURIComponent(
                    title,
                  )}&topic=${encodeURIComponent(data.keyword)}`}
                  className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-ink px-4 text-sm font-medium text-paper transition-colors hover:bg-brand"
                >
                  <Sparkles className="h-4 w-4" />
                  <span className="hidden sm:inline">Générer</span>
                  <ArrowRight className="h-4 w-4 sm:hidden" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------
   Sous-composants
   ---------------------------------------------------------------- */
function ScoreRing({ score }: { score: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.max(0, Math.min(100, score)) / 100);
  const color =
    score >= 70 ? "var(--money)" : score >= 50 ? "var(--brand)" : "var(--accent)";
  return (
    <div className="relative mx-auto h-32 w-32 sm:mx-0">
      <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset .8s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-semibold tabular-nums">
          {score}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-paper/50">
          score
        </span>
      </div>
    </div>
  );
}

const TREND_META: Record<
  NicheTrend,
  { label: string; icon: typeof TrendingUp; cls: string }
> = {
  rising: { label: "En hausse", icon: TrendingUp, cls: "text-money" },
  stable: { label: "Stable", icon: Minus, cls: "text-paper/70" },
  declining: { label: "En baisse", icon: TrendingDown, cls: "text-red-400" },
};

function TrendPill({ trend }: { trend: NicheTrend }) {
  const m = TREND_META[trend];
  const Icon = m.icon;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-paper/10 px-3 py-1 text-xs font-medium">
      <Icon className={`h-3.5 w-3.5 ${m.cls}`} />
      <span className="text-paper/90">Tendance : {m.label}</span>
    </span>
  );
}

const LEVEL_LABEL: Record<NicheLevel, string> = {
  low: "faible",
  medium: "moyenne",
  high: "forte",
};

function MetricPill({
  label,
  level,
  goodIsHigh,
  icon,
}: {
  label: string;
  level: NicheLevel;
  goodIsHigh: boolean;
  icon: React.ReactNode;
}) {
  // Vert si "bon", rouge si "mauvais", neutre si medium.
  const good = goodIsHigh ? level === "high" : level === "low";
  const bad = goodIsHigh ? level === "low" : level === "high";
  const dot = good
    ? "bg-money"
    : bad
      ? "bg-red-400"
      : "bg-accent";
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-paper/10 px-3 py-1 text-xs font-medium text-paper/90">
      {icon}
      {label} : {LEVEL_LABEL[level]}
      <span className={`ml-0.5 h-2 w-2 rounded-full ${dot}`} />
    </span>
  );
}

function SourceBadge({ source }: { source: NicheAnalysis["source"] }) {
  const isTrends = source === "trends";
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border border-paper/20 px-2 py-0.5 text-[11px] font-medium text-paper/70"
      title={
        isTrends
          ? "Données Google Trends"
          : "Estimation générée par IA (pas de données marché réelles)"
      }
    >
      <Lightbulb className="h-3 w-3" />
      {isTrends ? "Google Trends" : "Estimation IA"}
    </span>
  );
}

function InfoCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-card border border-line bg-paper p-5">
      <div className="flex items-center gap-2 text-ink-soft">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-100 text-brand">
          {icon}
        </span>
        <span className="text-xs font-semibold uppercase tracking-[0.14em]">
          {title}
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink">{body}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="mt-10 rounded-card border border-dashed border-line bg-paper px-6 py-16 text-center"
      style={{ animation: "rise .5s ease-out .1s both" }}
    >
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-100 text-brand">
        <Compass className="h-7 w-7" />
      </span>
      <p className="mt-4 font-display text-lg font-medium">
        Quelle niche allez-vous explorer ?
      </p>
      <p className="mx-auto mt-1 max-w-md text-sm text-ink-soft">
        Tapez un sujet pour découvrir son potentiel : demande, concurrence,
        angles à exploiter et titres prêts à écrire.
      </p>
    </div>
  );
}

function SkeletonResult() {
  return (
    <div className="mt-8 space-y-6">
      <div className="h-44 animate-pulse rounded-card bg-paper-2" />
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="h-28 animate-pulse rounded-card bg-paper-2" />
        <div className="h-28 animate-pulse rounded-card bg-paper-2" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-card bg-paper-2" />
        ))}
      </div>
    </div>
  );
}
