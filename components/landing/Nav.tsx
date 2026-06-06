"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const links = [
  { href: "#how", label: "Comment ça marche" },
  { href: "#features", label: "Fonctionnalités" },
  { href: "#pricing", label: "Tarifs" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-paper">
            <BookOpen className="h-4.5 w-4.5" strokeWidth={2} />
          </span>
          EbookGen
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-ink-soft transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Button href="/login" variant="ghost" className="h-10 px-4 text-sm">
            Connexion
          </Button>
          <Button href="/signup" className="h-10 px-5 text-sm">
            Commencer
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          className="grid h-11 w-11 place-items-center rounded-lg text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-line bg-paper md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base text-ink-soft hover:bg-paper-2 hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <div className="flex items-center justify-between rounded-lg bg-paper-2 px-3 py-2">
                <span className="text-sm text-ink-soft">Thème</span>
                <ThemeToggle />
              </div>
              <Button href="/login" variant="secondary">
                Connexion
              </Button>
              <Button href="/signup">Commencer — 10 crédits offerts</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
