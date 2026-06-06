"use client";

import { Suspense, useEffect, useState, type ComponentType } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { LucideProps } from "lucide-react";
import {
  ShoppingCart,
  Sparkles,
  Gift,
  RotateCcw,
  Coins,
  ArrowDownLeft,
  ArrowUpRight,
  Infinity as InfinityIcon,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import type { Ledger } from "@/lib/types";

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function reasonInfo(reason: string): {
  label: string;
  icon: ComponentType<LucideProps>;
} {
  if (reason === "signup_bonus")
    return { label: "Bonus de bienvenue", icon: Gift };
  if (reason.startsWith("purchase"))
    return { label: "Achat de crédits", icon: ShoppingCart };
  if (reason.startsWith("generation"))
    return { label: "Génération d’un livre", icon: Sparkles };
  if (reason.startsWith("unlock"))
    return { label: "Déverrouillage d’un livre", icon: Sparkles };
  if (reason.startsWith("refund"))
    return { label: "Remboursement", icon: RotateCcw };
  return { label: reason, icon: Coins };
}

const ACTIONS = [
  { icon: Sparkles, label: "Générer un ebook complet", cost: 20 },
];

export default function CreditsPage() {
  return (
    <Suspense fallback={null}>
      <CreditsContent />
    </Suspense>
  );
}

function CreditsContent() {
  const { user, refresh } = useAuth();
  const params = useSearchParams();
  const payStatus = params.get("status"); // ok | ko apres retour paiement
  const [ledger, setLedger] = useState<Ledger[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api
      .ledger()
      .then((d) => active && setLedger(d))
      .catch(
        (e: unknown) =>
          active &&
          setError(e instanceof Error ? e.message : "Erreur de chargement"),
      );
    return () => {
      active = false;
    };
  }, []);

  // Retour de paiement: rafraichit le solde + l'historique si succes.
  useEffect(() => {
    if (payStatus === "ok") {
      void refresh();
      api.ledger().then(setLedger).catch(() => {});
    }
  }, [payStatus, refresh]);

  const loading = ledger === null && !error;
  const received =
    ledger?.filter((l) => l.delta > 0).reduce((s, l) => s + l.delta, 0) ?? 0;
  const spent =
    ledger?.filter((l) => l.delta < 0).reduce((s, l) => s - l.delta, 0) ?? 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* En-tête */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">Mes crédits</h1>
          <p className="mt-1 text-ink-soft">
            Suivez votre solde et vos mouvements.
          </p>
        </div>
        <Link
          href="/dashboard/billing"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 font-medium text-paper transition-colors hover:bg-brand"
        >
          <ShoppingCart className="h-4.5 w-4.5" />
          Acheter des crédits
        </Link>
      </header>

      {/* Retour de paiement */}
      {payStatus === "ok" && (
        <div className="flex items-start gap-3 rounded-card border border-money/30 bg-money/10 px-4 py-3 text-sm text-money">
          <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0" />
          <span>
            Paiement confirmé. Vos crédits seront ajoutés dès validation par
            l’opérateur (quelques instants).
          </span>
        </div>
      )}
      {payStatus === "ko" && (
        <div className="flex items-start gap-3 rounded-card border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          <AlertCircle className="mt-0.5 h-4.5 w-4.5 shrink-0" />
          Le paiement a échoué ou a été annulé. Aucun crédit n’a été débité.
        </div>
      )}

      {/* Solde + totaux + coûts */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Solde (carte sombre) */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-card bg-ink p-6 text-paper">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand/30 blur-3xl"
          />
          <div className="relative flex items-center gap-2 text-paper/70">
            <Coins className="h-5 w-5" />
            <span className="text-sm">Solde actuel</span>
          </div>
          <div className="relative mt-6">
            <p className="font-display text-5xl font-semibold">
              {user.credits}
            </p>
            <p className="mt-1 text-paper/60">crédits disponibles</p>
          </div>
          <p className="relative mt-6 inline-flex w-fit items-center gap-1.5 rounded-full bg-paper/10 px-3 py-1 text-xs text-paper/80">
            <InfinityIcon className="h-3.5 w-3.5" />
            N’expirent jamais
          </p>
        </div>

        {/* Colonne droite */}
        <div className="space-y-5 lg:col-span-2">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-card border border-line bg-paper p-5">
              <div className="flex items-center gap-2 text-ink-soft">
                <ArrowDownLeft className="h-4.5 w-4.5 text-money" />
                <span className="text-sm">Total reçu</span>
              </div>
              <p className="mt-3 font-display text-3xl font-semibold">
                {loading ? "—" : received}
              </p>
              <p className="mt-1 text-xs text-ink-soft">achats + bonus</p>
            </div>
            <div className="rounded-card border border-line bg-paper p-5">
              <div className="flex items-center gap-2 text-ink-soft">
                <ArrowUpRight className="h-4.5 w-4.5 text-accent-600" />
                <span className="text-sm">Total dépensé</span>
              </div>
              <p className="mt-3 font-display text-3xl font-semibold">
                {loading ? "—" : spent}
              </p>
              <p className="mt-1 text-xs text-ink-soft">générations</p>
            </div>
          </div>

          {/* Coût des actions */}
          <div className="rounded-card border border-line bg-paper p-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
              Coût des actions
            </h2>
            <ul className="mt-4 space-y-1">
              {ACTIONS.map((a) => (
                <li
                  key={a.label}
                  className="flex items-center justify-between gap-3 rounded-xl px-2 py-2.5"
                >
                  <span className="flex items-center gap-3 text-sm text-ink">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-100 text-brand">
                      <a.icon className="h-4.5 w-4.5" />
                    </span>
                    {a.label}
                  </span>
                  <span className="font-medium text-ink">
                    {a.cost} crédits
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Historique */}
      <section className="rounded-card border border-line bg-paper">
        <div className="border-b border-line px-5 py-4">
          <h2 className="font-display text-lg font-semibold">Historique</h2>
        </div>

        {error ? (
          <div className="flex items-center gap-3 px-5 py-6 text-sm text-red-700 dark:text-red-300">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            {error}
          </div>
        ) : loading ? (
          <div className="space-y-2 p-5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-paper-2" />
            ))}
          </div>
        ) : (ledger?.length ?? 0) === 0 ? (
          <div className="px-5 py-14 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-paper-2 text-ink-soft">
              <Coins className="h-6 w-6" />
            </span>
            <p className="mt-3 font-medium">Aucun mouvement pour l’instant</p>
            <p className="mt-1 text-sm text-ink-soft">
              Achetez votre premier pack de crédits.
            </p>
            <Link
              href="/dashboard/billing"
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-paper transition-colors hover:bg-brand"
            >
              Voir les packs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {ledger!.map((l) => {
              const { icon: Icon } = reasonInfo(l.reason);
              const positive = l.delta > 0;
              return (
                <li
                  key={l.id}
                  className="flex items-center gap-4 px-5 py-3.5"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-paper-2 text-ink-soft">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ink">
                      {l.label}
                    </span>
                    <span className="block text-xs text-ink-soft">
                      {dateFmt.format(new Date(l.createdAt))}
                    </span>
                  </span>
                  <span
                    className={`font-medium tabular-nums ${
                      positive ? "text-money" : "text-ink"
                    }`}
                  >
                    {positive ? "+" : ""}
                    {l.delta}
                  </span>
                  <span className="hidden w-20 text-right text-xs text-ink-soft tabular-nums sm:block">
                    solde {l.balanceAfter}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* CTA bas */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-card bg-ink px-6 py-5 text-paper">
        <div>
          <p className="font-display text-lg font-semibold">
            Besoin de plus de crédits ?
          </p>
          <p className="text-sm text-paper/60">
            Les crédits n’expirent jamais. Ce que vous achetez vous appartient.
          </p>
        </div>
        <Link
          href="/dashboard/billing"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-paper px-5 font-medium text-ink transition-colors hover:bg-brand hover:text-paper"
        >
          Voir les packs
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
