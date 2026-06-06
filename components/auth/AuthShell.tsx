import Link from "next/link";
import type { ReactNode } from "react";
import { BookOpen, Check } from "lucide-react";

// Layout auth split-screen : panneau marque (gauche) + formulaire (droite).
// Composant serveur — purement présentationnel, reçoit le form en children.
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Panneau marque (caché sur mobile) */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-ink p-12 text-paper lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-brand/40 blur-3xl"
        />
        <Link
          href="/"
          className="relative flex items-center gap-2 font-display text-xl font-semibold"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-paper text-ink">
            <BookOpen className="h-4.5 w-4.5" />
          </span>
          EbookGen
        </Link>

        <div className="relative">
          <h2 className="max-w-md font-display text-4xl font-semibold leading-tight">
            Transformez une idée en ebook prêt à vendre.
          </h2>
          <ul className="mt-8 space-y-3 text-paper/80">
            {[
              "10 crédits offerts à l’inscription",
              "Génération IA + mise en page PDF & EPUB",
              "Paiement par Mobile Money",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-money/20 text-money">
                  <Check className="h-3 w-3" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-paper/50">
          © {new Date().getFullYear()} EbookGen
        </p>
      </aside>

      {/* Colonne formulaire */}
      <main className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-8 flex items-center gap-2 font-display text-lg font-semibold lg:hidden"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-paper">
              <BookOpen className="h-4.5 w-4.5" />
            </span>
            EbookGen
          </Link>

          <h1 className="font-display text-3xl font-semibold tracking-tight">
            {title}
          </h1>
          <p className="mt-2 text-ink-soft">{subtitle}</p>

          <div className="mt-8">{children}</div>

          <p className="mt-8 text-center text-sm text-ink-soft">{footer}</p>
        </div>
      </main>
    </div>
  );
}
