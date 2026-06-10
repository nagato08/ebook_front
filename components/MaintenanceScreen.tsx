/**
 * Écran plein affiché aux visiteurs quand le site est en maintenance.
 * Design éditorial cohérent (paper/ink/Fraunces). Illustrations responsives :
 * Maintenance.svg (desktop) / maintenance-mobile.svg (mobile).
 */
export default function MaintenanceScreen() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-paper px-6 py-12 text-ink">
      {/* Halo violet diffus derrière l'illustration */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--brand-100) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-xl flex-col items-center text-center">
        {/* Eyebrow : pastille + point ambre pulsant */}
        <span
          className="inline-flex items-center gap-2 rounded-full border border-line bg-paper-2 px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-ink-soft"
          style={{ animation: "rise .5s ease-out both" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          Maintenance en cours
        </span>

        {/* Illustration */}
        <picture style={{ animation: "rise .6s ease-out .05s both" }}>
          <source srcSet="/Maintenance.svg" media="(min-width: 640px)" />
          <img
            src="/maintenance-mobile.svg"
            alt="Illustration de maintenance"
            className="mt-8 h-auto w-full max-w-[16rem] sm:max-w-md"
          />
        </picture>

        {/* Titre */}
        <h1
          className="mt-8 font-display text-[2.25rem] font-semibold leading-[1.08] tracking-tight sm:text-5xl"
          style={{ animation: "rise .6s ease-out .12s both" }}
        >
          On revient
          <br />
          <span className="text-brand">très vite.</span>
        </h1>

        {/* Sous-texte */}
        <p
          className="mt-4 max-w-md text-balance text-ink-soft"
          style={{ animation: "rise .6s ease-out .18s both" }}
        >
          Le site est momentanément en maintenance — on peaufine quelques
          réglages. Reviens dans quelques minutes. Merci de ta patience.
        </p>

        {/* Wordmark discret */}
        <div
          className="mt-10 flex items-center gap-2 text-sm font-medium text-ink-soft"
          style={{ animation: "rise .6s ease-out .24s both" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          bookmarkerfast
        </div>
      </div>
    </main>
  );
}
