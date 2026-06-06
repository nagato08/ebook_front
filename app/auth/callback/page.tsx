"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { setToken } from "@/lib/api";

// Point d'atterrissage après Google OAuth.
// Le backend doit rediriger vers: ${FRONT}/auth/callback?token=<jwt>
function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      setToken(token);
      router.replace("/dashboard");
    } else {
      router.replace("/login?error=oauth");
    }
  }, [params, router]);

  return (
    <div className="grid min-h-dvh place-items-center">
      <p className="flex items-center gap-3 text-ink-soft">
        <Loader2 className="h-5 w-5 animate-spin" />
        Connexion en cours…
      </p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <CallbackInner />
    </Suspense>
  );
}
