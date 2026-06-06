import { Check, Infinity as InfinityIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

const packs = [
  {
    id: "discovery",
    name: "Découverte",
    price: "10 500",
    credits: 140,
    tagline: "Pour démarrer",
    perks: ["≈ 7 ebooks complets", "Tous les templates", "Export PDF & EPUB"],
    popular: false,
  },
  {
    id: "creator",
    name: "Créateur",
    price: "22 500",
    credits: 320,
    tagline: "Le plus choisi",
    perks: [
      "≈ 16 ebooks complets",
      "Kit marketing inclus",
      "Couverture & mockup 3D",
      "Support prioritaire",
    ],
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "45 000",
    credits: 700,
    tagline: "Pour produire en volume",
    perks: ["≈ 35 ebooks complets", "Tout du plan Créateur", "Génération en lot"],
    popular: false,
  },
  {
    id: "business",
    name: "Business",
    price: "116 000",
    credits: 2000,
    tagline: "Agences & revendeurs",
    perks: [
      "≈ 100 ebooks complets",
      "Meilleur prix par livre",
      "Tout du plan Pro",
    ],
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-5 py-24">
      <SectionHeading
        eyebrow="Tarifs"
        title="Des crédits, pas d’abonnement"
        subtitle="Un ebook complet coûte environ 20 crédits. Payez par Mobile Money, à votre rythme."
      />

      <p className="mx-auto mt-5 flex max-w-fit items-center gap-2 rounded-full bg-brand-100 px-4 py-2 text-sm font-medium text-brand">
        <InfinityIcon className="h-4 w-4" />
        Vos crédits n’expirent jamais
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {packs.map((p) => (
          <div
            key={p.id}
            className={`gsap-fade relative flex flex-col rounded-card border bg-paper p-6 ${
              p.popular
                ? "border-brand shadow-[0_24px_60px_-30px_rgba(91,33,182,0.45)]"
                : "border-line"
            }`}
          >
            {p.popular && (
              <span className="absolute -top-3 left-6 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-paper">
                Populaire
              </span>
            )}

            <p className="font-display text-xl font-semibold text-ink">
              {p.name}
            </p>
            <p className="mt-1 text-sm text-ink-soft">{p.tagline}</p>

            <div className="mt-6 flex items-baseline gap-1.5">
              <span className="font-display text-3xl font-semibold text-ink">
                {p.price}
              </span>
              <span className="text-sm text-ink-soft">FCFA</span>
            </div>
            <p className="mt-1 text-sm font-medium text-accent-600">
              {p.credits} crédits
            </p>

            <ul className="mt-6 flex-1 space-y-2.5 text-sm">
              {p.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-2 text-ink">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-money" />
                  {perk}
                </li>
              ))}
            </ul>

            <Button
              href={`/signup?pack=${p.id}`}
              variant={p.popular ? "primary" : "secondary"}
              className="mt-7 w-full"
            >
              Choisir
            </Button>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-ink-soft">
        Nouveau ?{" "}
        <span className="font-medium text-ink">10 crédits offerts</span> à
        l’inscription, sans carte bancaire.
      </p>
    </section>
  );
}
