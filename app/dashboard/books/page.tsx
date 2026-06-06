"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Sparkles, Search, AlertCircle, BookOpen } from "lucide-react";
import { api } from "@/lib/api";
import type { Book, BookStatus } from "@/lib/types";
import { BookCard } from "@/components/dashboard/BookCard";

type Filter = "ALL" | BookStatus;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "ALL", label: "Tous" },
  { value: "READY", label: "Prêts" },
  { value: "GENERATING", label: "En génération" },
  { value: "DRAFT", label: "Brouillons" },
  { value: "FAILED", label: "Échecs" },
];

export default function BooksPage() {
  return (
    <Suspense fallback={null}>
      <BooksContent />
    </Suspense>
  );
}

function BooksContent() {
  const searchParams = useSearchParams();
  const [books, setBooks] = useState<Book[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  // Sync depuis la recherche du Topbar (?q=)
  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    api
      .listBooks()
      .then((d) => active && setBooks(d))
      .catch(
        (e: unknown) =>
          active &&
          setError(e instanceof Error ? e.message : "Erreur de chargement"),
      );
    return () => {
      active = false;
    };
  }, []);

  const loading = books === null && !error;

  const filtered = useMemo(() => {
    if (!books) return [];
    const q = query.trim().toLowerCase();
    return books.filter(
      (b) =>
        (filter === "ALL" || b.status === filter) &&
        (q === "" ||
          b.title.toLowerCase().includes(q) ||
          b.topic.toLowerCase().includes(q)),
    );
  }, [books, filter, query]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { ALL: books?.length ?? 0 };
    books?.forEach((b) => (c[b.status] = (c[b.status] ?? 0) + 1));
    return c;
  }, [books]);

  const removeBook = (id: string) =>
    setBooks((prev) => prev?.filter((b) => b.id !== id) ?? null);

  return (
    <div className="mx-auto max-w-6xl">
      {/* En-tête */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">Mes livres</h1>
          <p className="mt-1 text-ink-soft">
            {books?.length ?? 0} livre{(books?.length ?? 0) > 1 ? "s" : ""} au
            total
          </p>
        </div>
        <Link
          href="/dashboard/books/new"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 font-medium text-paper transition-colors hover:bg-brand"
        >
          <Sparkles className="h-4.5 w-4.5" />
          Créer un livre
        </Link>
      </header>

      {/* Filtres + recherche */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = filter === f.value;
            const n = counts[f.value] ?? 0;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "border-ink bg-ink text-paper"
                    : "border-line text-ink-soft hover:bg-paper-2 hover:text-ink"
                }`}
              >
                {f.label}
                <span
                  className={active ? "text-paper/60" : "text-ink-soft/60"}
                >
                  {n}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher…"
            aria-label="Rechercher un livre"
            className="h-10 w-full rounded-full border border-line bg-paper pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-ink-soft/70 focus:border-brand focus:ring-2 focus:ring-brand/25"
          />
        </div>
      </div>

      {/* Contenu */}
      <div className="mt-6">
        {error ? (
          <div className="flex items-center gap-3 rounded-card border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            {error}
          </div>
        ) : loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-72 animate-pulse rounded-card bg-paper-2"
              />
            ))}
          </div>
        ) : (books?.length ?? 0) === 0 ? (
          <div className="rounded-card border border-dashed border-line bg-paper px-6 py-16 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-paper-2 text-ink-soft">
              <BookOpen className="h-7 w-7" />
            </span>
            <p className="mt-4 font-display text-lg font-medium">
              Aucun livre pour l’instant
            </p>
            <p className="mt-1 text-ink-soft">
              Lancez votre premier livre en quelques clics.
            </p>
            <Link
              href="/dashboard/books/new"
              className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 font-medium text-paper transition-colors hover:bg-brand"
            >
              <Sparkles className="h-4.5 w-4.5" />
              Créer un livre
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-ink-soft">
            Aucun livre ne correspond à ce filtre.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((b) => (
              <BookCard key={b.id} book={b} onDeleted={removeBook} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
