import { PencilLine, Sparkles, Download } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  {
    icon: PencilLine,
    title: "Décrivez votre sujet",
    text: "Titre, thème, audience et ton. En une phrase, l’IA comprend ce que vous voulez écrire.",
  },
  {
    icon: Sparkles,
    title: "L’IA génère le livre",
    text: "Plan, chapitres cohérents, mise en page professionnelle et couverture — en quelques minutes.",
  },
  {
    icon: Download,
    title: "Exportez & vendez",
    text: "Téléchargez en PDF ou EPUB, encaissez par Mobile Money et gardez 100 % de vos revenus.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-5 py-24">
      <SectionHeading
        eyebrow="Comment ça marche"
        title="De l’idée au livre, en 3 étapes"
        subtitle="Aucune compétence en écriture ou en design requise."
      />

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <div
            key={s.title}
            className="gsap-fade relative rounded-card border border-line bg-paper p-7"
          >
            <span className="absolute right-6 top-6 font-display text-5xl font-semibold text-paper-2">
              {i + 1}
            </span>
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-100 text-brand">
              <s.icon className="h-6 w-6" strokeWidth={2} />
            </span>
            <h3 className="mt-5 font-display text-xl font-semibold text-ink">
              {s.title}
            </h3>
            <p className="mt-2 leading-relaxed text-ink-soft">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
