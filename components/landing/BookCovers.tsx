import { SectionHeading } from "@/components/ui/SectionHeading";

// 4 couvertures-exemple, chacune dans un style de template différent.
// Démo CSS (pas d'images) — illustre la variété de mise en page.
const covers = [
  {
    style: "Moderne",
    title: "Marketing Digital",
    subtitle: "Le guide pratique 2026",
    author: "A. Koné",
    className: "bg-ink text-paper",
    accent: "text-accent",
    badge: "7 chapitres",
  },
  {
    style: "Luxe",
    title: "Investir en Bourse",
    subtitle: "Stratégies patrimoniales",
    author: "M. Diop",
    className:
      "bg-gradient-to-br from-[#2a2440] to-[#0f0d1a] text-paper",
    accent: "text-accent",
    badge: "12 chapitres",
  },
  {
    style: "Tech",
    title: "Coder avec l’IA",
    subtitle: "Du prompt au produit",
    author: "S. Traoré",
    className: "bg-brand text-paper",
    accent: "text-paper",
    badge: "9 chapitres",
  },
  {
    style: "Wellness",
    title: "Cuisine Saine",
    subtitle: "50 recettes africaines",
    author: "F. Mensah",
    className: "bg-[#0e3b2e] text-paper",
    accent: "text-money",
    badge: "6 chapitres",
  },
];

export function BookCovers() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24">
      <SectionHeading
        eyebrow="Réalisations"
        title="Des livres prêts à vendre, pas des brouillons"
        subtitle="Un aperçu de couvertures et de mises en page générées par EbookGen."
      />

      <div className="mt-14 grid grid-cols-2 gap-5 sm:gap-7 lg:grid-cols-4">
        {covers.map((c) => (
          <figure key={c.title} className="gsap-fade group">
            <div
              className={`flex aspect-[2/3] flex-col justify-between rounded-xl p-5 ring-1 ring-black/5 transition-transform duration-300 group-hover:-translate-y-1.5 dark:ring-white/12 shadow-[0_18px_40px_-24px_rgba(21,19,15,0.5)] dark:shadow-[0_18px_50px_-20px_rgba(0,0,0,0.8)] ${c.className}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.65rem] uppercase tracking-widest opacity-70">
                  Ebook
                </span>
                <span
                  className={`rounded-full bg-white/10 px-2 py-0.5 text-[0.65rem] font-medium ${c.accent}`}
                >
                  {c.badge}
                </span>
              </div>

              <div>
                <p
                  className={`font-mono text-[0.65rem] uppercase tracking-widest ${c.accent}`}
                >
                  {c.subtitle}
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold leading-tight">
                  {c.title}
                </h3>
                <p className="mt-4 text-xs opacity-70">par {c.author}</p>
              </div>
            </div>
            <figcaption className="mt-3 text-center text-sm text-ink-soft">
              Style&nbsp;{c.style}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
