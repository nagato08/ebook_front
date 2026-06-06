import { Button } from "@/components/ui/Button";

export function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24">
      <div className="relative overflow-hidden rounded-card bg-ink px-8 py-16 text-center sm:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-brand/40 blur-3xl"
        />
        <div className="gsap-fade relative">
          <h2 className="mx-auto max-w-2xl font-display text-4xl font-semibold tracking-tight text-paper sm:text-5xl">
            Votre premier ebook est à quelques clics
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-paper/70">
            Inscrivez-vous, recevez 10 crédits offerts et générez votre aperçu
            gratuit dès maintenant.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              href="/signup"
              className="bg-accent text-ink hover:bg-accent-600"
            >
              Commencer gratuitement
            </Button>
            <Button
              href="#pricing"
              className="border border-paper/20 bg-transparent text-paper hover:border-paper/50"
            >
              Voir les tarifs
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
