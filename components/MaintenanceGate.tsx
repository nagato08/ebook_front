"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { api } from "@/lib/api";
import type { AppStatus } from "@/lib/types";
import MaintenanceScreen from "./MaintenanceScreen";

/**
 * Barrière globale de maintenance. Interroge GET /status (+ polling 30s).
 * - maintenance OFF -> rend l'app normalement.
 * - maintenance ON + admin -> rend l'app (bypass), + pastille de contrôle.
 * - maintenance ON + non-admin -> écran maintenance, SAUF sur /login
 *   (pour que l'admin puisse se connecter et obtenir son token).
 */
export default function MaintenanceGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [status, setStatus] = useState<AppStatus | null>(null);

  // Utilisé par la pastille admin (event handler) pour rafraîchir après toggle.
  const refresh = useCallback(async () => {
    try {
      setStatus(await api.getStatus());
    } catch {
      setStatus({ maintenance: false, admin: false });
    }
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const s = await api.getStatus();
        if (active) setStatus(s);
      } catch {
        // backend injoignable -> on ne bloque pas l'app
        if (active) setStatus({ maintenance: false, admin: false });
      }
    };
    void load();
    const id = setInterval(() => void load(), 30_000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  // Avant la 1re réponse : rendu optimiste (pas de blocage du chargement).
  const maintenance = status?.maintenance ?? false;
  const admin = status?.admin ?? false;

  // Pendant la maintenance, le visiteur reste sur la page maintenance PARTOUT
  // (même si l'app le redirige vers /login). Échappatoire admin pour se
  // reconnecter sur un nouvel appareil : /login?admin=1
  const adminEscape =
    pathname === "/login" &&
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("admin") === "1";
  const blocked = maintenance && !admin && !adminEscape;

  if (blocked) return <MaintenanceScreen />;

  return (
    <>
      {children}
      {admin && (
        <AdminMaintenanceToggle maintenance={maintenance} onChange={refresh} />
      )}
    </>
  );
}

/** Pastille flottante (admin only) : bascule le mode maintenance. */
function AdminMaintenanceToggle({
  maintenance,
  onChange,
}: {
  maintenance: boolean;
  onChange: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await api.setMaintenance(!maintenance);
      await onChange();
    } catch {
      // silencieux : la pastille reflète l'état réel au prochain refresh
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2.5 rounded-full border border-line bg-paper/90 px-3 py-2 text-xs shadow-lg backdrop-blur">
      <span className="flex items-center gap-1.5 font-medium text-ink-soft">
        <span
          className={`h-2 w-2 rounded-full ${
            maintenance ? "bg-accent" : "bg-money"
          }`}
        />
        {maintenance ? "Maintenance" : "En ligne"}
      </span>
      <button
        type="button"
        onClick={() => void toggle()}
        disabled={busy}
        className={`rounded-full px-3 py-1 font-semibold text-paper transition-colors disabled:opacity-50 ${
          maintenance ? "bg-money hover:bg-money/90" : "bg-ink hover:bg-brand"
        }`}
      >
        {busy ? "…" : maintenance ? "Réactiver le site" : "Couper le site"}
      </button>
    </div>
  );
}
