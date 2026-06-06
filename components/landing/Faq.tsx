"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const faqs = [
  {
    q: "Combien coûte la création d’un ebook ?",
    a: "Un ebook complet consomme environ 20 crédits. Avec le pack Créateur (400 crédits), vous produisez une vingtaine de livres. Les crédits n’expirent jamais.",
  },
  {
    q: "Quels formats puis-je exporter ?",
    a: "PDF (prêt pour la vente et l’impression) et EPUB (pour les liseuses et applications de lecture). Les deux sont inclus, sans surcoût.",
  },
  {
    q: "Comment se passe le paiement ?",
    a: "Par Mobile Money (Wave, Orange Money, MTN MoMo, Moov Money) ou carte bancaire. Vous validez le paiement directement depuis votre téléphone.",
  },
  {
    q: "La qualité du texte est-elle suffisante pour vendre ?",
    a: "L’IA génère un contenu structuré et cohérent que vous pouvez relire et ajuster dans l’éditeur intégré avant l’export. Vous gardez le contrôle final.",
  },
  {
    q: "Suis-je propriétaire des livres générés ?",
    a: "Oui. Vous possédez les ebooks que vous créez et conservez 100 % des revenus de leur revente.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="border-t border-line bg-paper-2/50">
      <div className="mx-auto max-w-3xl px-5 py-24">
        <SectionHeading eyebrow="FAQ" title="Questions fréquentes" />

        <div className="mt-12 divide-y divide-line border-y border-line">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="gsap-fade">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 rounded-lg py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <span className="font-display text-lg font-medium text-ink">
                    {f.q}
                  </span>
                  <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full bg-paper text-ink transition-colors">
                    {/* +/- animé : la barre verticale pivote et disparaît à l'ouverture */}
                    <span className="absolute h-0.5 w-3.5 rounded-full bg-current" />
                    <span
                      className={`absolute h-0.5 w-3.5 rounded-full bg-current transition-transform duration-300 ease-out ${
                        isOpen ? "rotate-0 scale-x-0" : "rotate-90 scale-x-100"
                      }`}
                    />
                  </span>
                </button>

                {/* ouverture fluide en hauteur (grid 0fr -> 1fr) */}
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 pr-12 leading-relaxed text-ink-soft">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
