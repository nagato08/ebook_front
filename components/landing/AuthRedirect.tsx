"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/api";

/**
 * Si un token JWT est déjà présent (session active), redirige vers le dashboard.
 * Évite que l'utilisateur connecté retombe sur la landing au relancement.
 */
export function AuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (getToken()) {
      router.replace("/dashboard");
    }
  }, [router]);

  return null;
}
