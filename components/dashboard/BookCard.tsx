"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Eye, Trash2, Loader2, Lock } from "lucide-react";
import { api } from "@/lib/api";
import type { Book } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

// Dégradé de couverture selon le style choisi
const COVER: Record<string, string> = {
  Moderne: "from-brand to-brand-600",
  Luxe: "from-[#2a2440] to-[#0f0d1a]",
  Éducatif: "from-emerald-500 to-teal-700",
  Énergique: "from-orange-500 to-red-600",
  Minimal: "from-zinc-700 to-zinc-900",
  Créatif: "from-fuchsia-500 to-rose-600",
  Tech: "from-sky-600 to-indigo-800",
  Nature: "from-green-600 to-emerald-800",
};

export function BookCard({
  book,
  onDeleted,
}: {
  book: Book;
  onDeleted: (id: string) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const gradient = COVER[book.style] ?? "from-ink to-zinc-800";

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.deleteBook(book.id);
      onDeleted(book.id);
    } catch {
      setDeleting(false);
      setConfirming(false);
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-card border border-line bg-paper transition-shadow hover:shadow-[0_12px_40px_-24px_rgba(21,19,15,0.45)]">
      {/* couverture */}
      <Link
        href={`/dashboard/books/${book.id}`}
        className={`relative flex aspect-[16/10] flex-col justify-between bg-gradient-to-br p-4 text-paper ${gradient}`}
      >
        <BookOpen className="h-5 w-5 text-paper/80" />
        <p className="line-clamp-2 font-display text-lg font-semibold leading-tight">
          {book.title}
        </p>
        <div className="absolute right-3 top-3 flex items-center gap-2">
          {!book.unlocked && book.status === "READY" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-paper/20 px-2 py-1 text-xs font-medium text-paper backdrop-blur-sm">
              <Lock className="h-3 w-3" />
              Verrouillé
            </span>
          )}
          <StatusBadge status={book.status} />
        </div>
      </Link>

      {/* infos */}
      <div className="flex flex-1 flex-col p-4">
        <p className="truncate text-sm text-ink-soft">{book.topic}</p>
        <p className="mt-1 text-xs text-ink-soft/80">
          {dateFmt.format(new Date(book.createdAt))} · {book.language.toUpperCase()}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <Link
            href={`/dashboard/books/${book.id}`}
            className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-line text-sm font-medium text-ink transition-colors hover:bg-paper-2"
          >
            <Eye className="h-4 w-4" />
            Détails
          </Link>
          <button
            type="button"
            onClick={() => setConfirming(true)}
            aria-label={`Supprimer ${book.title}`}
            className="grid h-9 w-9 place-items-center rounded-lg border border-line text-ink-soft transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* confirmation suppression */}
      {confirming && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-paper/95 p-5 text-center backdrop-blur-sm">
          <p className="text-sm text-ink">
            Supprimer <span className="font-medium">« {book.title} »</span> ?
            <br />
            Cette action est irréversible.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={deleting}
              className="h-9 rounded-lg border border-line px-4 text-sm font-medium text-ink transition-colors hover:bg-paper-2"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-60"
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
              Supprimer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
