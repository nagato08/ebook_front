import { Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";

const unlocked = ["Couverture", "Sommaire complet", "Introduction", "Chapitre 1"];
const locked = ["Chapitres 2 à 7", "Export PDF & EPUB", "Kit marketing"];

export function Preview() {
  return (
    <section id="preview" className="mx-auto max-w-6xl px-5 py-24">
      <div className="grid items-center gap-12 rounded-card border border-line bg-paper p-8 lg:grid-cols-2 lg:p-12">
        <div className="gsap-fade">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">
            Aperçu gratuit
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">
            Voyez le livre avant de payer
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            Générez gratuitement la couverture, le sommaire, l’introduction
            et le premier chapitre. Vous ne dépensez vos crédits que pour
            débloquer le livre complet.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-medium text-money">
                Gratuit, tout de suite
              </p>
              <ul className="space-y-2.5">
                {unlocked.map((u) => (
                  <li
                    key={u}
                    className="flex items-center gap-2.5 text-ink"
                  >
                    <Check className="h-4.5 w-4.5 shrink-0 text-money" />
                    {u}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-3 text-sm font-medium text-ink-soft">
                Après déblocage
              </p>
              <ul className="space-y-2.5">
                {locked.map((l) => (
                  <li
                    key={l}
                    className="flex items-center gap-2.5 text-ink-soft"
                  >
                    <Lock className="h-4 w-4 shrink-0 text-ink-soft/60" />
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Button href="/signup" className="mt-9">
            Essayer gratuitement
          </Button>
        </div>

        {/* maquette aperçu */}
        <div className="gsap-fade relative">
          <div className="mx-auto max-w-sm rounded-2xl border border-line bg-paper-2 p-6">
            <div className="rounded-xl bg-paper p-6 shadow-sm">
              <p className="font-mono text-xs uppercase tracking-wide text-ink-soft">
                Sommaire
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-ink">
                Marketing Digital
              </h3>
              <ol className="mt-5 space-y-3 text-sm">
                {[
                  "Les fondamentaux",
                  "Trouver son audience",
                  "Construire un tunnel de vente",
                  "Publicité rentable",
                ].map((t, i) => (
                  <li
                    key={t}
                    className={`flex items-center justify-between gap-3 border-b border-line pb-3 ${
                      i > 0 ? "opacity-45" : ""
                    }`}
                  >
                    <span className="flex items-center gap-3 text-ink">
                      <span className="font-mono text-ink-soft">
                        0{i + 1}
                      </span>
                      {t}
                    </span>
                    {i === 0 ? (
                      <Check className="h-4 w-4 text-money" />
                    ) : (
                      <Lock className="h-3.5 w-3.5 text-ink-soft/50" />
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
