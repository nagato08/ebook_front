import { Sparkles, FileText, BookOpen, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-grain">
      {/* halo violet décoratif */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-136 w-136 -translate-x-1/2 rounded-full bg-brand-100 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
        {/* Colonne texte */}
        <div>
          <span className="gsap-fade inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1.5 text-sm text-ink-soft">
            <Sparkles className="h-4 w-4 text-brand" />
            Génération d’ebooks par IA
          </span>

          <h1 className="gsap-fade mt-6 text-balance font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
            Transformez une idée en{" "}
            <span className="text-brand">ebook prêt à vendre</span>.
          </h1>

          <p className="gsap-fade mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            Décrivez votre sujet. L’IA rédige, structure et met en page un
            livre complet — exportable en PDF & EPUB. Encaissez vos ventes par
            Mobile Money.
          </p>

          <div className="gsap-fade mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/signup" className="px-7">
              Commencer — 10 crédits offerts
            </Button>
            <Button href="#preview" variant="secondary">
              Voir un exemple
            </Button>
          </div>

          <ul className="gsap-fade mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
            {["Sans carte bancaire", "PDF & EPUB", "Paiement Mobile Money"].map(
              (item) => (
                <li key={item} className="inline-flex items-center gap-2">
                  <Check className="h-4 w-4 text-money" />
                  {item}
                </li>
              ),
            )}
          </ul>
        </div>

        {/* Colonne visuel — maquette de livre généré */}
        <div className="gsap-fade relative mx-auto w-full max-w-md">
          <div className="absolute -inset-4 -z-10 rounded-4xl bg-paper-2" />
          <div className="rounded-card border border-line bg-paper p-5 shadow-[0_24px_60px_-30px_rgba(21,19,15,0.4)]">
            {/* barre fenêtre */}
            <div className="mb-4 flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-line" />
              <span className="h-2.5 w-2.5 rounded-full bg-line" />
              <span className="h-2.5 w-2.5 rounded-full bg-line" />
              <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-2.5 py-1 text-xs font-medium text-brand">
                <Sparkles className="h-3 w-3" /> Génération
              </span>
            </div>

            {/* couverture mock */}
            <div className="flex gap-4">
              <div className="flex h-44 w-32 shrink-0 flex-col justify-between rounded-xl bg-ink p-4 text-paper">
                <BookOpen className="h-6 w-6 text-accent" />
                <div>
                  <p className="font-display text-lg font-semibold leading-tight">
                    Marketing Digital
                  </p>
                  <p className="mt-1 text-xs text-paper/60">en 7 chapitres</p>
                </div>
              </div>

              {/* lignes de contenu en cours */}
              <div className="flex-1 space-y-2.5 pt-1">
                {[
                  "Chapitre 1 — Les fondamentaux",
                  "Chapitre 2 — Trouver son audience",
                  "Chapitre 3 — Tunnel de vente",
                ].map((c, i) => (
                  <div key={c}>
                    <div className="flex items-center gap-2 text-xs font-medium text-ink">
                      <FileText className="h-3.5 w-3.5 text-brand" />
                      {c}
                    </div>
                    <div className="mt-1.5 space-y-1">
                      <div className="h-1.5 w-full rounded-full bg-paper-2" />
                      <div
                        className="h-1.5 rounded-full bg-paper-2"
                        style={{ width: `${90 - i * 18}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* footer maquette */}
            <div className="mt-4 flex items-center justify-between rounded-xl bg-paper-2 px-4 py-3">
              <span className="text-xs text-ink-soft">Progression</span>
              <span className="font-mono text-xs font-medium text-money">
                Prêt à exporter
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
