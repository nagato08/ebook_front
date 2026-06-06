"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Lock,
  Download,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import type { Book, Chapter } from "@/lib/types";

type PageState = "loading" | "generating" | "ready" | "error";

export default function BookDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, refresh } = useAuth();
  const bookId = params.id as string;

  // Data
  const [book, setBook] = useState<Book | null>(null);
  const [pageState, setPageState] = useState<PageState>("loading");
  const [error, setError] = useState<string | null>(null);

  // Generation polling
  const [progress, setProgress] = useState(0);
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);

  // Chapter nav
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Unlock
  const [unlocking, setUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);

  // Export
  const [exporting, setExporting] = useState<"pdf" | "epub" | null>(null);

  const currentChapter = book?.chapters?.[currentChapterIndex];
  const isLocked = currentChapterIndex > 0 && !book?.unlocked;

  const startPolling = (id: string) => {
    const interval = setInterval(async () => {
      try {
        const status = await api.bookStatus(id);

        if (status.status === "READY") {
          clearInterval(interval);
          setPollInterval(null);
          const updated = await api.getBook(id);
          setBook(updated);
          setPageState("ready");
        } else {
          setProgress(Math.min(progress + Math.random() * 20, 90));
        }
      } catch {
        // Continue polling
      }
    }, 2000);

    setPollInterval(interval);
  };

  // Charge le livre
  useEffect(() => {
    if (!bookId) return;

    const fetchBook = async () => {
      try {
        const data = await api.getBook(bookId);
        setBook(data);

        if (data.status === "GENERATING") {
          setPageState("generating");
          setProgress(0);
          startPolling(bookId);
        } else if (data.status === "READY") {
          setPageState("ready");
        } else {
          setPageState("error");
          setError(`Statut: ${data.status}`);
        }
      } catch (err) {
        setPageState("error");
        setError(err instanceof Error ? err.message : "Erreur");
      }
    };

    fetchBook();
  }, [bookId]);

  useEffect(() => {
    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [pollInterval]);

  const handleUnlock = async () => {
    if (!book) return;

    setUnlocking(true);
    setUnlockError(null);
    try {
      await api.unlock(book.id);
      await refresh();
      const updated = await api.getBook(book.id);
      setBook(updated);
    } catch (err) {
      setUnlockError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setUnlocking(false);
    }
  };

  const handleExport = async (format: "pdf" | "epub") => {
    if (!book) return;
    setExporting(format);
    try {
      await api.exportBook(book.id, format);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur export");
    } finally {
      setExporting(null);
    }
  };

  if (pageState === "error") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-accent-600" />
        <h1 className="font-display text-2xl font-semibold">Erreur</h1>
        <p className="text-ink-soft">{error}</p>
        <Link
          href="/dashboard/books"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 font-medium text-paper transition-colors hover:bg-brand"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Link>
      </div>
    );
  }

  if (pageState === "loading" || !book) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-brand" />
        <p className="text-ink-soft">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="flex h-dvh gap-0 overflow-hidden bg-paper">
      {/* Sidebar Chapitres (Desktop) */}
      <aside className="hidden w-72 flex-col overflow-y-auto border-r border-line bg-paper-2 sm:flex">
        <div className="sticky top-0 border-b border-line bg-paper-2 px-6 py-5">
          <Link
            href="/dashboard/books"
            className="flex items-center gap-2 text-sm font-medium text-brand transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            Bibliothèque
          </Link>
        </div>

        <div className="flex-1 space-y-6 px-6 py-6">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-soft mb-4">
              {book.chapters?.length ?? 0} Chapitres
            </h3>

            <nav className="space-y-1">
              {book.chapters?.map((ch, idx) => {
                const isActive = idx === currentChapterIndex;
                const isChapterLocked = idx > 0 && !book.unlocked;
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setCurrentChapterIndex(idx);
                      setMobileDrawerOpen(false);
                    }}
                    className={`group relative w-full text-left rounded-lg px-3 py-2.5 text-sm transition-all ${
                      isActive
                        ? "bg-brand-100 font-semibold text-brand"
                        : "text-ink-soft hover:bg-paper hover:text-ink"
                    } ${isChapterLocked ? "opacity-60" : ""}`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-lg bg-brand" />
                    )}
                    <span className="flex items-center gap-2 pl-2">
                      {isChapterLocked && <Lock className="h-3.5 w-3.5 shrink-0" />}
                      <span className="truncate">
                        {ch.title || `Chapitre ${ch.order}`}
                      </span>
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-line bg-paper px-6 py-5 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-2xl sm:text-3xl font-semibold truncate text-ink">
                {book.title}
              </h1>
              <p className="mt-2 text-sm text-ink-soft">
                Chapitre {currentChapter?.order ?? "?"} •{" "}
                {book.unlocked ? "Déverrouillé" : "Verrouillé"}
              </p>
            </div>

            {/* Mobile drawer toggle */}
            <button
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="sm:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-line hover:bg-paper-2 transition-colors"
            >
              {mobileDrawerOpen ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>
        </header>

        {/* Mobile Drawer */}
        {mobileDrawerOpen && (
          <div className="border-b border-line bg-paper-2 px-6 py-4 sm:hidden max-h-64 overflow-y-auto">
            <nav className="space-y-1">
              {book.chapters?.map((ch, idx) => {
                const isActive = idx === currentChapterIndex;
                const isChapterLocked = idx > 0 && !book.unlocked;
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setCurrentChapterIndex(idx);
                      setMobileDrawerOpen(false);
                    }}
                    className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? "bg-brand-100 font-medium text-brand"
                        : "text-ink-soft hover:bg-paper hover:text-ink"
                    } ${isChapterLocked ? "opacity-60" : ""}`}
                  >
                    <span className="flex items-center gap-2">
                      {isChapterLocked && <Lock className="h-3.5 w-3.5" />}
                      {ch.title || `Chapitre ${ch.order}`}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {pageState === "generating" ? (
            <div className="flex flex-col items-center justify-center h-full gap-8 px-6 sm:px-8 py-12">
              {/* Livre animé */}
              <div className="relative h-40 w-32">
                {/* Couverture du livre */}
                <div className="absolute inset-0 rounded-r-lg rounded-l-sm bg-gradient-to-br from-brand to-brand-600 shadow-2xl">
                  {/* Tranche */}
                  <div className="absolute left-0 top-0 bottom-0 w-2 rounded-l-sm bg-black/20" />
                  {/* Pages qui se tournent */}
                  <div className="absolute right-2 top-3 bottom-3 left-5 overflow-hidden rounded-sm bg-paper/95">
                    <div className="book-line-loader space-y-2 p-2.5">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="h-1.5 rounded-full bg-ink/15"
                          style={{
                            width: `${[90, 70, 85, 60, 80, 50][i]}%`,
                            animation: `book-pulse 1.4s ease-in-out ${i * 0.15}s infinite`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {/* Étincelle */}
                <Sparkles className="absolute -right-3 -top-3 h-7 w-7 text-brand animate-pulse" />
              </div>

              <div className="max-w-md text-center">
                <h2 className="font-display text-2xl font-semibold text-ink">
                  Création de votre ebook…
                </h2>
                <p className="mt-2 text-sm text-ink-soft">
                  Notre IA rédige les chapitres, structure le contenu et prépare
                  la mise en page. Cela peut prendre quelques minutes.
                </p>
                <div className="mt-6 w-full h-2 rounded-full bg-paper-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand transition-all duration-500"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <p className="mt-3 text-xs text-ink-soft tabular-nums">
                  {Math.round(Math.min(progress, 100))}%
                </p>
              </div>
            </div>
          ) : (
            <article className="mx-auto max-w-2xl px-6 py-12 sm:px-8 sm:py-16">
              {/* Titre du chapitre */}
              <header className="mb-12">
                <h2 className="font-display text-4xl sm:text-5xl font-semibold text-ink leading-tight tracking-tight">
                  {currentChapter?.title || `Chapitre ${currentChapter?.order ?? "?"}`}
                </h2>
              </header>

              {/* Contenu ou Teaser verrouillé */}
              {isLocked ? (
                <div className="space-y-8">
                  {/* Locked State Premium */}
                  <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-ink/5 to-brand/5 p-12 sm:p-16 text-center min-h-96 flex flex-col items-center justify-center gap-6 border border-line">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-paper/50 to-paper/80 pointer-events-none" />

                    <div className="relative z-10 flex flex-col items-center gap-4">
                      <div className="p-4 rounded-full bg-paper border-2 border-brand/20">
                        <Lock className="h-8 w-8 text-brand" />
                      </div>

                      <div>
                        <h3 className="font-display text-2xl font-semibold text-ink mb-2">
                          Déverrouillage requis
                        </h3>
                        <p className="text-ink-soft text-sm max-w-xs">
                          Ce chapitre est réservé aux lecteurs premium.
                          Déverrouillez l&apos;ebook pour accéder à son intégralité.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Unlock CTA */}
                  <div className="rounded-lg border border-line bg-paper-2 p-8">
                    <div className="max-w-sm mx-auto text-center">
                      <h3 className="font-display text-xl font-semibold text-ink mb-2">
                        Débloquer maintenant
                      </h3>
                      <p className="text-sm text-ink-soft mb-6">
                        Accédez à tous les chapitres, téléchargez en PDF ou EPUB.
                      </p>

                      {unlockError && (
                        <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                          {unlockError}
                        </div>
                      )}

                      <button
                        onClick={handleUnlock}
                        disabled={unlocking || user.credits < 20}
                        className="w-full inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 font-semibold text-paper transition-all hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {unlocking && (
                          <Loader2 className="h-4.5 w-4.5 animate-spin" />
                        )}
                        {unlocking
                          ? "Déverrouillage…"
                          : user.credits < 20
                            ? `Crédits insuffisants (${user.credits})`
                            : `Débloquer — 20 crédits`}
                      </button>

                      {user.credits < 20 && (
                        <p className="mt-4 text-xs">
                          <Link
                            href="/dashboard/billing"
                            className="text-brand hover:underline font-medium"
                          >
                            Recharger des crédits
                          </Link>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="prose prose-lg max-w-none">
                  <div className="text-ink leading-relaxed space-y-6">
                    {currentChapter?.content ? (
                      <div className="whitespace-pre-wrap text-base sm:text-lg [line-height:1.8] [letter-spacing:0.25px]">
                        {currentChapter.content}
                      </div>
                    ) : (
                      <p className="text-ink-soft italic py-12 text-center">
                        Pas de contenu.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Chapitres Footer */}
              {!isLocked && pageState === "ready" && (
                <div className="mt-16 pt-8 border-t border-line flex items-center justify-between">
                  <button
                    onClick={() =>
                      setCurrentChapterIndex(Math.max(0, currentChapterIndex - 1))
                    }
                    disabled={currentChapterIndex === 0}
                    className="text-sm font-medium text-brand hover:text-ink disabled:opacity-30 transition-colors"
                  >
                    ← Chapitre précédent
                  </button>
                  <span className="text-xs text-ink-soft">
                    {currentChapterIndex + 1} / {book.chapters?.length}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentChapterIndex(
                        Math.min(
                          (book.chapters?.length ?? 1) - 1,
                          currentChapterIndex + 1
                        )
                      )
                    }
                    disabled={
                      currentChapterIndex === (book.chapters?.length ?? 1) - 1
                    }
                    className="text-sm font-medium text-brand hover:text-ink disabled:opacity-30 transition-colors"
                  >
                    Chapitre suivant →
                  </button>
                </div>
              )}
            </article>
          )}
        </div>

        {/* Export Footer (si unlocked ou ch.1) */}
        {!isLocked && pageState === "ready" && (
          <footer className="sticky bottom-0 border-t border-line bg-paper px-6 py-4 sm:px-8 backdrop-blur-sm bg-paper/95">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
                  Exporter votre ebook
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleExport("pdf")}
                  disabled={exporting !== null}
                  className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-ink bg-paper px-5 text-sm font-semibold text-ink transition-all hover:bg-paper-2 hover:border-brand disabled:opacity-50 cursor-pointer"
                >
                  {exporting === "pdf" && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  <Download className="h-4 w-4" />
                  PDF
                </button>
                <button
                  onClick={() => handleExport("epub")}
                  disabled={exporting !== null}
                  className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-ink bg-paper px-5 text-sm font-semibold text-ink transition-all hover:bg-paper-2 hover:border-brand disabled:opacity-50 cursor-pointer"
                >
                  {exporting === "epub" && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  <Download className="h-4 w-4" />
                  EPUB
                </button>
              </div>
            </div>
          </footer>
        )}
      </main>
    </div>
  );
}
