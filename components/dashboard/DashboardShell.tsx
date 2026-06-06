"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Sidebar, MobileSidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

const COLLAPSE_KEY = "ebookgen_sidebar_collapsed";

export function DashboardShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // restaure l'état replié (après mount → pas de mismatch d'hydratation)
  useEffect(() => {
    setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
  }, []);

  const toggleCollapse = () =>
    setCollapsed((v) => {
      const next = !v;
      localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      return next;
    });

  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar collapsed={collapsed} onToggleCollapse={toggleCollapse} />
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar onOpenMobile={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-paper-2/40 px-5 py-8 sm:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
