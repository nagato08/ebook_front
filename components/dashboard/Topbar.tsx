"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Coins, Bell, Menu } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ProfileMenu } from "./ProfileMenu";

function Notifications() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        aria-expanded={open}
        className="relative grid h-10 w-10 place-items-center rounded-full text-ink-soft transition-colors hover:bg-paper-2 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-accent ring-2 ring-paper" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-line bg-paper shadow-xl">
          <p className="border-b border-line px-4 py-3 text-sm font-medium">
            Notifications
          </p>
          <p className="px-4 py-8 text-center text-sm text-ink-soft">
            Aucune notification pour l’instant.
          </p>
        </div>
      )}
    </div>
  );
}

export function Topbar({ onOpenMobile }: { onOpenMobile: () => void }) {
  const { user } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    router.push(q ? `/dashboard/books?q=${encodeURIComponent(q)}` : "/dashboard/books");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-line bg-paper/85 px-4 backdrop-blur-md sm:px-6">
      {/* burger mobile */}
      <button
        type="button"
        onClick={onOpenMobile}
        aria-label="Ouvrir le menu"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-ink transition-colors hover:bg-paper-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand md:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* recherche — centrée dans l'espace disponible */}
      <form onSubmit={handleSearch} className="hidden flex-1 justify-center sm:flex">
        <div className="relative w-full max-w-xl">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un livre…"
            aria-label="Rechercher"
            className="h-10 w-full rounded-full border border-line bg-paper-2/60 pl-10 pr-16 text-sm outline-none transition-colors placeholder:text-ink-soft/70 focus:border-brand focus:bg-paper focus:ring-2 focus:ring-brand/25"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-line bg-paper px-1.5 py-0.5 font-mono text-[10px] text-ink-soft lg:block">
            ↵
          </kbd>
        </div>
      </form>

      <div className="flex-1 sm:hidden" />

      {/* actions droite */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Link
          href="/dashboard/billing"
          title="Vos crédits"
          className="flex items-center gap-1.5 rounded-full border border-line bg-accent/10 px-3 py-1.5 text-sm font-medium text-accent-600 transition-colors hover:bg-accent/20"
        >
          <Coins className="h-4 w-4" />
          {user.credits}
          <span className="hidden sm:inline">crédits</span>
        </Link>

        <Notifications />
        <ThemeToggle />

        <span className="mx-1 hidden h-6 w-px bg-line sm:block" />

        <ProfileMenu />
      </div>
    </header>
  );
}
