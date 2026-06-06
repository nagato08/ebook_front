import {
  Layers,
  LayoutTemplate,
  ImageIcon,
  FileDown,
  PenSquare,
  Megaphone,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const features = [
  {
    icon: Layers,
    title: "Génération par chapitres",
    text: "Le livre est écrit chapitre par chapitre avec un fil conducteur cohérent du début à la fin.",
  },
  {
    icon: LayoutTemplate,
    title: "Mise en page professionnelle",
    text: "12 templates (Moderne, Luxe, Tech…) avec sommaire, en-têtes et numérotation propres.",
  },
  {
    icon: ImageIcon,
    title: "Couverture & mockup",
    text: "Une couverture générée automatiquement et un mockup 3D prêt pour vos publicités.",
  },
  {
    icon: FileDown,
    title: "Export PDF & EPUB",
    text: "Deux formats standards, prêts pour la vente, l’impression ou les liseuses.",
  },
  {
    icon: PenSquare,
    title: "Éditeur intégré",
    text: "Relisez et ajustez chaque chapitre avant l’export. Vous gardez le contrôle.",
  },
  {
    icon: Megaphone,
    title: "Kit marketing",
    text: "Posts réseaux sociaux et scripts WhatsApp générés pour vendre dès le premier jour.",
  },
];

export function Features() {
  return (
    <section id="features" className="border-y border-line bg-paper-2/50">
      <div className="mx-auto max-w-6xl px-5 py-24">
        <SectionHeading
          eyebrow="Fonctionnalités"
          title="Tout pour créer un livre qui se vend"
          subtitle="Du premier mot à la première vente, sans quitter l’application."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="gsap-fade rounded-card border border-line bg-paper p-7 transition-colors hover:border-ink/30 hover:-translate-y-1 duration-300"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink text-paper">
                <f.icon className="h-5.5 w-5.5" strokeWidth={2} />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-ink">
                {f.title}
              </h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
