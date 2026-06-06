import Link from "next/link";
import { BookOpen } from "lucide-react";

const groups = [
  {
    title: "Produit",
    links: [
      { href: "#how", label: "Comment ça marche" },
      { href: "#features", label: "Fonctionnalités" },
      { href: "#pricing", label: "Tarifs" },
      { href: "#preview", label: "Aperçu gratuit" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { href: "#faq", label: "FAQ" },
      { href: "/blog", label: "Blog" },
      { href: "/guides", label: "Guides" },
    ],
  },
  {
    title: "Légal",
    links: [
      { href: "/cgu", label: "Conditions" },
      { href: "/confidentialite", label: "Confidentialité" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 font-display text-lg font-semibold"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-paper">
                <BookOpen className="h-4.5 w-4.5" />
              </span>
              EbookGen
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
              Créez, mettez en page et vendez vos ebooks avec l’IA.
              Paiement par Mobile Money.
            </p>
          </div>

          {groups.map((g) => (
            <div key={g.title}>
              <p className="text-sm font-semibold text-ink">{g.title}</p>
              <ul className="mt-4 space-y-2.5">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-ink-soft transition-colors hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-sm text-ink-soft sm:flex-row">
          <p>© {new Date().getFullYear()} EbookGen. Tous droits réservés.</p>
          <p>Fait pour les créateurs africains.</p>
        </div>
      </div>
    </footer>
  );
}
