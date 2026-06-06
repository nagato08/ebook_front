"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  CreditCard,
  ShoppingCart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Coins,
  Compass,
  LogOut,
  X,
} from "lucide-react";
import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

type Item = {
  href: string;
  label: string;
  icon: ComponentType<LucideProps>;
  exact?: boolean;
};

const groups: { label: string | null; items: Item[] }[] = [
  {
    label: "Pilotage",
    items: [
      {
        href: "/dashboard",
        label: "Vue d’ensemble",
        icon: LayoutDashboard,
        exact: true,
      },
    ],
  },
  {
    label: "Bibliothèque",
    items: [
      { href: "/dashboard/books", label: "Mes livres", icon: BookOpen },
    ],
  },
  {
    label: "Outils de recherche",
    items: [
      { href: "/dashboard/niche", label: "Niche Hunter", icon: Compass },
    ],
  },
  {
    label: "Facturation",
    items: [
      { href: "/dashboard/credits", label: "Crédits", icon: CreditCard },
      { href: "/dashboard/billing", label: "Recharger", icon: ShoppingCart },
    ],
  },
  {
    label: "Compte",
    items: [{ href: "/dashboard/settings", label: "Paramètres", icon: Settings }],
  },
];

function NavItem({
  item,
  collapsed,
  onNavigate,
}: {
  item: Item;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = item.exact
    ? pathname === item.href
    : pathname.startsWith(item.href);
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      title={collapsed ? item.label : undefined}
      className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
        collapsed ? "justify-center" : ""
      } ${
        active
          ? "bg-brand-100 font-medium text-brand"
          : "text-ink-soft hover:bg-paper-2 hover:text-ink"
      }`}
    >
      {active && !collapsed && (
        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand" />
      )}
      <item.icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
}

function Content({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  return (
    <>
      {/* CTA primaire */}
      <div className="p-3">
        <Link
          href="/dashboard/books/new"
          onClick={onNavigate}
          title={collapsed ? "Créer un livre" : undefined}
          className={`flex h-11 items-center justify-center gap-2 rounded-xl bg-brand font-medium text-paper shadow-sm transition-colors hover:bg-brand-600 ${
            collapsed ? "px-0" : "px-4"
          }`}
        >
          <Sparkles className="h-5 w-5 shrink-0" />
          {!collapsed && "Créer un livre"}
        </Link>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-3">
        {groups.map((group, gi) => (
          <div key={group.label ?? gi} className="space-y-1">
            {group.label && !collapsed && (
              <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-ink-soft/70">
                {group.label}
              </p>
            )}
            {group.items.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ))}
      </nav>

      <SidebarFooter collapsed={collapsed} />
    </>
  );
}

function SidebarFooter({ collapsed }: { collapsed: boolean }) {
  const { user, logout } = useAuth();
  return (
    <div className="space-y-1 border-t border-line p-3">
      <Link
        href="/dashboard/billing"
        title={collapsed ? `${user.credits} crédits` : undefined}
        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-paper-2 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        <span className="flex items-center gap-3 text-ink-soft">
          <Coins className="h-5 w-5 shrink-0 text-accent-600" />
          {!collapsed && "Mes crédits"}
        </span>
        {!collapsed && (
          <span className="font-mono text-sm font-medium text-accent-600">
            {user.credits}
          </span>
        )}
      </Link>
      <button
        type="button"
        onClick={logout}
        title={collapsed ? "Se déconnecter" : undefined}
        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-soft transition-colors hover:bg-paper-2 hover:text-ink ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <LogOut className="h-5 w-5 shrink-0" />
        {!collapsed && "Se déconnecter"}
      </button>
    </div>
  );
}

/** Sidebar desktop repliable. Le bouton de repli est dans l'en-tête. */
export function Sidebar({
  collapsed,
  onToggleCollapse,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  return (
    <aside
      className={`hidden shrink-0 flex-col border-r border-line bg-paper transition-[width] duration-300 md:flex ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* En-tête : logo + bouton replier (chevron) */}
      <div
        className={`border-b border-line ${
          collapsed
            ? "flex flex-col items-center gap-2 px-2 py-3"
            : "flex h-16 items-center gap-2 px-3"
        }`}
      >
        {collapsed ? (
          <>
            <Link
              href="/dashboard"
              aria-label="EbookGen"
              className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-paper"
            >
              <BookOpen className="h-5 w-5" />
            </Link>
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label="Déplier le menu"
              className="grid h-8 w-8 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-paper-2 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : (
          <>
            <Link
              href="/dashboard"
              className="flex min-w-0 flex-1 items-center gap-2.5 font-display text-xl font-semibold tracking-tight"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ink text-paper">
                <BookOpen className="h-5 w-5" />
              </span>
              <span className="truncate">EbookGen</span>
            </Link>
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label="Replier le menu"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-paper-2 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      <Content collapsed={collapsed} />
    </aside>
  );
}

/** Drawer mobile (toujours déplié). */
export function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        type="button"
        aria-label="Fermer le menu"
        onClick={onClose}
        className="absolute inset-0 bg-ink/50"
      />
      <div className="absolute left-0 top-0 flex h-full w-72 flex-col bg-paper shadow-2xl">
        <div className="flex h-16 items-center justify-between border-b border-line px-4">
          <span className="flex items-center gap-2.5 font-display text-xl font-semibold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-paper">
              <BookOpen className="h-5 w-5" />
            </span>
            EbookGen
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le menu"
            className="grid h-9 w-9 place-items-center rounded-lg text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <Content collapsed={false} onNavigate={onClose} />
      </div>
    </div>
  );
}
