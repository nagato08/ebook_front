"use client";

import { useEffect, useState, type ComponentType } from "react";
import Link from "next/link";
import type { LucideProps } from "lucide-react";
import {
  Sparkles,
  BookOpen,
  ShoppingCart,
  History,
  Plus,
  ArrowRight,
  ChevronRight,
  Eye,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import type { Book } from "@/lib/types";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

/* ---------- petites briques ---------- */

function ActionRow({
  icon: Icon,
  title,
  desc,
  href,
}: {
  icon: ComponentType<LucideProps>;
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-paper-2"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-100 text-brand">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-ink">
          {title}
        </span>
        <span className="block truncate text-xs text-ink-soft">{desc}</span>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-ink-soft transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

function ProgressRow({
  label,
  value,
  ratio,
  unit,
}: {
  label: string;
  value: number;
  ratio?: number;
  unit?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-ink-soft">{label}</span>
        <span className="font-medium text-ink">
          {value}
          {unit ? ` ${unit}` : ""}
        </span>
      </div>
      {ratio !== undefined && (
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-paper-2">
          <div
            className="h-full rounded-full bg-brand transition-all"
            style={{ width: `${Math.round(ratio * 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}

/* ---------- page ---------- */

export default function DashboardPage() {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[] | null>(null);
  const [error, setError] = useState<string | null>(null);

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
  const total = books?.length ?? 0;
  const ready = books?.filter((b) => b.status === "READY").length ?? 0;
  const generating =
    books?.filter((b) => b.status === "GENERATING").length ?? 0;
  const recent = books?.slice(0, 3) ?? [];
  const firstName = user.name ?? user.email.split("@")[0];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* HERO sombre */}
      <section className="relative overflow-hidden rounded-card bg-ink p-6 text-paper sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand/30 blur-3xl"
        />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm text-paper/60">Bonjour,</p>
            <h1 className="mt-1 font-display text-3xl font-semibold sm:text-4xl">
              Bienvenue {firstName}
            </h1>
            <p className="mt-2 max-w-lg text-paper/70">
              Décrivez un sujet, générez un livre complet et mis en page, puis
              encaissez par Mobile Money.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard/books/new"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-paper px-5 font-medium text-ink transition-colors hover:bg-brand hover:text-paper"
              >
                <Sparkles className="h-4.5 w-4.5" />
                Générer un ebook
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard/books"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-paper/20 px-5 font-medium text-paper transition-colors hover:border-paper/50"
              >
                <BookOpen className="h-4.5 w-4.5" />
                Mes livres
              </Link>
            </div>
          </div>

          {/* panneau crédits */}
          <div className="rounded-2xl border border-paper/10 bg-paper/5 p-5 lg:w-72">
            <p className="text-xs font-semibold uppercase tracking-wider text-paper/50">
              Crédits disponibles
            </p>
            <p className="mt-3 font-display text-4xl font-semibold">
              {user.credits}
              <span className="ml-2 text-base font-normal text-paper/60">
                crédits
              </span>
            </p>
            <div className="mt-5 flex gap-2">
              <Link
                href="/dashboard/billing"
                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-brand font-medium text-paper transition-colors hover:bg-brand-600"
              >
                <Plus className="h-4 w-4" />
                Acheter
              </Link>
              <Link
                href="/dashboard/credits"
                aria-label="Historique des crédits"
                className="grid h-10 w-10 place-items-center rounded-lg border border-paper/20 text-paper transition-colors hover:bg-paper/10"
              >
                <History className="h-4.5 w-4.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CARTES D'ACTIONS */}
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-card border border-line bg-paper p-5">
          <h2 className="font-display text-lg font-semibold">Créer ton ebook</h2>
          <p className="text-sm text-ink-soft">De l’idée au livre fini</p>
          <div className="mt-4 space-y-1">
            <ActionRow
              icon={Sparkles}
              title="Générer un ebook"
              desc="Création complète par IA"
              href="/dashboard/books/new"
            />
            <ActionRow
              icon={BookOpen}
              title="Mes livres"
              desc="Gérer et exporter tes livres"
              href="/dashboard/books"
            />
          </div>
        </div>

        <div className="rounded-card border border-line bg-paper p-5">
          <h2 className="font-display text-lg font-semibold">
            Crédits & paiement
          </h2>
          <p className="text-sm text-ink-soft">Recharge via Mobile Money</p>
          <div className="mt-4 space-y-1">
            <ActionRow
              icon={ShoppingCart}
              title="Recharger des crédits"
              desc="Orange Money, Wave, MTN, Moov"
              href="/dashboard/billing"
            />
            <ActionRow
              icon={History}
              title="Historique des crédits"
              desc="Tes mouvements de crédits"
              href="/dashboard/credits"
            />
          </div>
        </div>
      </div>

      {/* ACTIVITÉ + PARCOURS */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Activité récente */}
        <section className="rounded-card border border-line bg-paper p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold">
                Activité récente
              </h2>
              <p className="text-sm text-ink-soft">
                {total} livre{total > 1 ? "s" : ""} créé{total > 1 ? "s" : ""}{" "}
                au total
              </p>
            </div>
            {total > 0 && (
              <Link
                href="/dashboard/books"
                className="inline-flex items-center gap-1 text-sm font-medium text-brand"
              >
                Voir tout <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>

          {error ? (
            <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
              <AlertCircle className="h-4.5 w-4.5 shrink-0" />
              {error}
            </div>
          ) : loading ? (
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-paper-2" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <p className="py-10 text-center text-sm text-ink-soft">
              Aucun livre pour l’instant.
            </p>
          ) : (
            <ul className="space-y-2">
              {recent.map((b) => (
                <li
                  key={b.id}
                  className="flex items-center gap-3 rounded-xl border border-line px-3 py-3"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-paper-2 text-ink-soft">
                    <BookOpen className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ink">
                      {b.title}
                    </span>
                    <span className="mt-0.5 flex items-center gap-2">
                      <StatusBadge status={b.status} />
                      <span className="text-xs text-ink-soft">
                        {dateFmt.format(new Date(b.createdAt))}
                      </span>
                    </span>
                  </span>
                  <Link
                    href={`/dashboard/books/${b.id}`}
                    className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-line px-3 text-sm font-medium text-ink transition-colors hover:bg-paper-2"
                  >
                    <Eye className="h-4 w-4" />
                    Détails
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Colonne droite : parcours + prochaine étape */}
        <div className="space-y-5">
          <section className="rounded-card border border-line bg-paper p-5">
            <h2 className="font-display text-lg font-semibold">Ton parcours</h2>
            <div className="mt-4 space-y-4">
              <ProgressRow
                label="Livres créés"
                value={total}
                ratio={total > 0 ? 1 : 0}
              />
              <ProgressRow
                label="Prêts"
                value={ready}
                ratio={total ? ready / total : 0}
              />
              <ProgressRow
                label="En génération"
                value={generating}
                ratio={total ? generating / total : 0}
              />
              <ProgressRow
                label="Crédits restants"
                value={user.credits}
                unit="cr."
              />
            </div>
          </section>

          {total === 0 && (
            <section className="relative overflow-hidden rounded-card bg-ink p-5 text-paper">
              <h2 className="font-display text-lg font-semibold">
                Prochaine étape
              </h2>
              <p className="mt-1 text-sm text-paper/70">
                Tu n’as pas encore créé de livre. Lance ton premier ebook en
                moins de 2 minutes.
              </p>
              <Link
                href="/dashboard/books/new"
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand font-medium text-paper transition-colors hover:bg-brand-600"
              >
                <Sparkles className="h-4.5 w-4.5" />
                Créer mon premier ebook
              </Link>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
