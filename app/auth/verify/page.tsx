"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, XCircle, BookOpen } from "lucide-react";
import { api } from "@/lib/api";

type Status = "loading" | "success" | "error";

function VerifyInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Lien invalide : token manquant.");
      return;
    }
    let active = true;
    api
      .verifyEmail(token)
      .then((res) => {
        if (!active) return;
        setStatus("success");
        setMessage(res.message);
        setTimeout(() => router.replace("/dashboard"), 2000);
      })
      .catch((e: unknown) => {
        if (!active) return;
        setStatus("error");
        setMessage(
          e instanceof Error ? e.message : "Lien invalide ou expiré.",
        );
      });
    return () => {
      active = false;
    };
  }, [params, router]);

  return (
    <div className="grid min-h-dvh place-items-center bg-paper px-5">
      <div className="w-full max-w-sm text-center">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 font-display text-lg font-semibold"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-paper">
            <BookOpen className="h-4.5 w-4.5" />
          </span>
          EbookGen
        </Link>

        {status === "loading" && (
          <div className="rounded-card border border-line bg-paper p-8">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand" />
            <h1 className="mt-4 font-display text-xl font-semibold">
              Vérification en cours…
            </h1>
            <p className="mt-1 text-ink-soft">Un instant.</p>
          </div>
        )}

        {status === "success" && (
          <div className="rounded-card border border-line bg-paper p-8">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-money/15 text-money">
              <CheckCircle2 className="h-7 w-7" />
            </span>
            <h1 className="mt-4 font-display text-xl font-semibold">
              Email vérifié
            </h1>
            <p className="mt-1 text-ink-soft">{message}</p>
            <p className="mt-4 text-sm text-ink-soft">
              Redirection vers le tableau de bord…
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="rounded-card border border-line bg-paper p-8">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-red-500/15 text-red-600 dark:text-red-400">
              <XCircle className="h-7 w-7" />
            </span>
            <h1 className="mt-4 font-display text-xl font-semibold">
              Vérification échouée
            </h1>
            <p className="mt-1 text-ink-soft">{message}</p>
            <div className="mt-6 flex justify-center gap-2">
              <Link
                href="/login"
                className="inline-flex h-11 items-center rounded-full border border-line px-5 font-medium text-ink transition-colors hover:bg-paper-2"
              >
                Connexion
              </Link>
              <Link
                href="/dashboard/settings"
                className="inline-flex h-11 items-center rounded-full bg-ink px-5 font-medium text-paper transition-colors hover:bg-brand"
              >
                Renvoyer le lien
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyInner />
    </Suspense>
  );
}
