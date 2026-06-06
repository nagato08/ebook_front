import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
}) {
  const isCenter = align === "center";
  return (
    <div
      className={`gsap-fade ${
        isCenter ? "mx-auto max-w-2xl text-center" : "max-w-2xl"
      }`}
    >
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 text-balance font-display text-4xl font-semibold tracking-tight text-ink sm:text-[2.75rem]">
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-lg leading-relaxed text-ink-soft ${
            isCenter ? "mx-auto" : ""
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
