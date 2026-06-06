import type { ComponentProps } from "react";

// Champ de formulaire labellisé. Présentationnel : pas d'état interne.
// (React 19 : pas de forwardRef nécessaire, `ref` est une prop normale.)
export function AuthField({
  label,
  id,
  hint,
  ...inputProps
}: {
  label: string;
  id: string;
  hint?: string;
} & ComponentProps<"input">) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        className="h-11 w-full rounded-lg border border-line bg-paper px-3.5 text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-brand focus:ring-2 focus:ring-brand/30"
        {...inputProps}
      />
      {hint && <p className="mt-1.5 text-xs text-ink-soft">{hint}</p>}
    </div>
  );
}
