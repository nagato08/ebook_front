import { ShieldCheck } from "lucide-react";

const operators = ["Wave", "Orange Money", "MTN MoMo", "Moov Money", "Visa"];

export function TrustBar() {
  return (
    <section className="border-y border-line bg-paper-2/60">
      <div className="gsap-fade mx-auto flex max-w-6xl flex-col items-center gap-5 px-5 py-7 sm:flex-row sm:justify-between">
        <p className="inline-flex items-center gap-2 text-sm text-ink-soft">
          <ShieldCheck className="h-4 w-4 text-money" />
          Paiement sécurisé par Mobile Money
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
          {operators.map((op) => (
            <li
              key={op}
              className="text-sm font-semibold tracking-tight text-ink-soft"
            >
              {op}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
