import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[color,background-color,transform] duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand focus-visible:ring-offset-paper disabled:opacity-50 cursor-pointer";

const sizes = "h-12 px-6 text-base";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-brand",
  secondary: "border border-line bg-paper text-ink hover:border-ink",
  ghost: "text-ink hover:text-brand",
};

type Props = {
  href: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

export function Button({
  href,
  variant = "primary",
  children,
  className = "",
  ...rest
}: Props) {
  return (
    <Link
      href={href}
      className={`${base} ${sizes} ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}
