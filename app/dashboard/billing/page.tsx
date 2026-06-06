"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Smartphone,
  Infinity as InfinityIcon,
  Check,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { api } from "@/lib/api";
import type { CreditPack } from "@/lib/types";

const POPULAR_ID = "creator";
const UNLOCK_COST = 20; // 1 ebook = 20 credits

const nf = new Intl.NumberFormat("fr-FR");

export default function BillingPage() {
  const [packs, setPacks] = useState<CreditPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api
      .packs()
      .then((d) => {
        if (!active) return;
        setPacks(d);
        setSelectedId(d.find((p) => p.id === POPULAR_ID)?.id ?? d[0]?.id ?? null);
      })
      .catch(
        (e: unknown) =>
          active && setError(e instanceof Error ? e.message : "Erreur de chargement"),
      )
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const selected = useMemo(
    () => packs.find((p) => p.id === selectedId) ?? null,
    [packs, selectedId],
  );

  const phoneDigits = phone.replace(/[^0-9]/g, "");
  // Numero optionnel: GeniusPay le demande sur sa page de paiement.
  const canPay = !!selected && !submitting;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canPay || !selected) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await api.deposit({
        packId: selected.id,
        // Envoye seulement si saisi (pre-remplissage GeniusPay).
        ...(phoneDigits.length >= 8 ? { phoneNumber: phoneDigits } : {}),
      });
      if (res.checkoutUrl) {
        // Redirection vers la page de paiement hebergee GeniusPay.
        window.location.href = res.checkoutUrl;
        return;
      }
      // Pas d'URL (cas inattendu) -> on remonte le message backend.
      setError(res.message || "Paiement indisponible. Reessayez.");
      setSubmitting(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur du paiement");
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl pb-16">
      {/* En-tete */}
      <div style={{ animation: "rise .5s ease-out both" }}>
        <Link
          href="/dashboard/credits"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Mes crédits
        </Link>
        <h1 className="mt-4 font-display text-[2.5rem] font-semibold leading-tight tracking-tight">
          Recharger vos crédits
        </h1>
        <p className="mt-2 max-w-xl text-ink-soft">
          Choisissez un pack et payez en Mobile Money. Les crédits sont ajoutés
          dès la confirmation du paiement.
        </p>
      </div>

      <form
        onSubmit={handlePay}
        className="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_360px]"
      >
        {/* Colonne gauche : packs */}
        <div style={{ animation: "rise .5s ease-out .05s both" }}>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
            Choisir un pack
          </h2>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-40 animate-pulse rounded-card bg-paper-2" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {packs.map((p) => {
                const active = selectedId === p.id;
                const popular = p.id === POPULAR_ID;
                const ebooks = Math.floor(p.credits / UNLOCK_COST);
                const perCredit = Math.round(Number(p.amount) / p.credits);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedId(p.id)}
                    aria-pressed={active}
                    className={`relative flex flex-col rounded-card border bg-paper p-5 text-left transition-all ${
                      active
                        ? "border-brand ring-2 ring-brand/25"
                        : "border-line hover:border-ink/30"
                    }`}
                  >
                    {popular && (
                      <span className="absolute -top-2.5 left-5 inline-flex items-center gap-1 rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-semibold text-paper">
                        <Sparkles className="h-3 w-3" />
                        Populaire
                      </span>
                    )}
                    <span
                      className={`absolute right-4 top-4 grid h-5 w-5 place-items-center rounded-full border transition-colors ${
                        active
                          ? "border-brand bg-brand text-paper"
                          : "border-line text-transparent"
                      }`}
                    >
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>

                    <h3 className="font-display text-lg font-semibold text-ink">
                      {p.label}
                    </h3>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="font-display text-3xl font-semibold tabular-nums">
                        {nf.format(p.credits)}
                      </span>
                      <span className="text-sm text-ink-soft">crédits</span>
                    </div>

                    <div className="mt-3 border-t border-line pt-3">
                      <div className="flex items-baseline gap-1">
                        <span className="font-display text-xl font-semibold tabular-nums">
                          {nf.format(Number(p.amount))}
                        </span>
                        <span className="text-sm text-ink-soft">FCFA</span>
                      </div>
                      <p className="mt-1 text-xs text-ink-soft">
                        ≈ {ebooks} ebooks · {perCredit} FCFA/crédit
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Réassurance */}
          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            <Reassure icon={<ShieldCheck className="h-4 w-4" />} text="Paiement sécurisé" />
            <Reassure icon={<Smartphone className="h-4 w-4" />} text="MTN & Orange Money" />
            <Reassure icon={<InfinityIcon className="h-4 w-4" />} text="Crédits sans expiration" />
          </ul>
        </div>

        {/* Colonne droite : récap + paiement (sticky) */}
        <aside
          className="lg:sticky lg:top-6"
          style={{ animation: "rise .5s ease-out .1s both" }}
        >
          <div className="overflow-hidden rounded-card border border-line bg-ink p-6 text-paper">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/50">
              Récapitulatif
            </p>

            {selected ? (
              <>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-paper/70">Pack</span>
                  <span className="font-medium">{selected.label}</span>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-paper/70">Crédits</span>
                  <span className="font-display text-lg font-semibold tabular-nums">
                    +{nf.format(selected.credits)}
                  </span>
                </div>
                <div className="mt-4 flex items-end justify-between border-t border-paper/15 pt-4">
                  <span className="text-paper/70">À payer</span>
                  <span className="font-display text-3xl font-semibold tabular-nums">
                    {nf.format(Number(selected.amount))}
                    <span className="ml-1 text-base font-normal text-paper/60">
                      FCFA
                    </span>
                  </span>
                </div>
              </>
            ) : (
              <p className="mt-4 text-sm text-paper/60">
                Sélectionnez un pack pour continuer.
              </p>
            )}
          </div>

          {/* Téléphone + paiement */}
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-ink">
                Numéro Mobile Money{" "}
                <span className="font-normal text-ink-soft">(optionnel)</span>
              </label>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="237 6XX XXX XXX"
                className="h-12 w-full rounded-xl border border-line bg-paper px-4 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-brand focus:ring-2 focus:ring-brand/25"
              />
              <p className="mt-1.5 text-xs text-ink-soft">
                Optionnel — vous pourrez aussi le saisir sur la page de
                paiement. L’opérateur est détecté automatiquement.
              </p>
            </div>

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
              disabled={!canPay}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink font-medium text-paper transition-colors hover:bg-brand disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Redirection…
                </>
              ) : (
                <>
                  Payer par Mobile Money
                  <ArrowRight className="h-4.5 w-4.5" />
                </>
              )}
            </button>

            <p className="text-center text-xs text-ink-soft/80">
              Vous serez redirigé vers la page de paiement sécurisée pour
              valider.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Reassure({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <li className="flex items-center gap-2.5 rounded-xl border border-line bg-paper px-3.5 py-3 text-sm text-ink">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-100 text-brand">
        {icon}
      </span>
      {text}
    </li>
  );
}
