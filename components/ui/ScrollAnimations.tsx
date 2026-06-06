"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Révélation au scroll de tous les éléments `.gsap-fade`, par lots staggered.
 * Monté une seule fois (retourne null). Respecte prefers-reduced-motion.
 */
export function ScrollAnimations() {
  useGSAP(() => {
    const items = gsap.utils.toArray<HTMLElement>(".gsap-fade");
    if (!items.length) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduce) {
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(items, { opacity: 0, y: 24 });

    // Filet de sécurité : si on recharge en plein milieu de page,
    // les éléments déjà au-dessus du viewport restent visibles.
    items.forEach((el) => {
      if (el.getBoundingClientRect().top < 0) {
        gsap.set(el, { opacity: 1, y: 0 });
      }
    });

    ScrollTrigger.batch(".gsap-fade", {
      start: "top 88%",
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.08,
          overwrite: true,
        }),
    });

    // Recalcule après chargement des polices (décale les positions)
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
  });

  return null;
}
