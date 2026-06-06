import type { BookStatus } from "@/lib/types";

const MAP: Record<
  BookStatus,
  { label: string; className: string; dot: string }
> = {
  DRAFT: {
    label: "Brouillon",
    className: "bg-paper-2 text-ink-soft",
    dot: "bg-ink-soft",
  },
  GENERATING: {
    label: "Génération…",
    className: "bg-accent/15 text-accent-600",
    dot: "bg-accent animate-pulse",
  },
  READY: {
    label: "Prêt",
    className: "bg-money/15 text-money",
    dot: "bg-money",
  },
  FAILED: {
    label: "Échec",
    className: "bg-red-500/15 text-red-600 dark:text-red-400",
    dot: "bg-red-500",
  },
};

export function StatusBadge({ status }: { status: BookStatus }) {
  const s = MAP[status] ?? MAP.DRAFT;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
