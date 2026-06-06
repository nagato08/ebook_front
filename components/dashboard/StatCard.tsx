import type { ComponentType, ReactNode } from "react";
import type { LucideProps } from "lucide-react";

export function StatCard({
  icon: Icon,
  label,
  value,
  accent = false,
  children,
}: {
  icon: ComponentType<LucideProps>;
  label: string;
  value: ReactNode;
  accent?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-card border border-line bg-paper p-5">
      <div className="flex items-center gap-2 text-ink-soft">
        <Icon className="h-4.5 w-4.5" />
        <span className="text-sm">{label}</span>
      </div>
      <p
        className={`mt-3 font-display text-3xl font-semibold ${
          accent ? "text-accent-600" : "text-ink"
        }`}
      >
        {value}
      </p>
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
