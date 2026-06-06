"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { api, setToken } from "@/lib/api";
import { AuthField } from "./AuthField";
import { GoogleButton } from "./GoogleButton";
import { AuthDivider, AuthError, SubmitButton } from "./parts";

export function LoginForm() {
  const router = useRouter();

  const [error, action, pending] = useActionState<string | null, FormData>(
    async (_prev, formData) => {
      const email = String(formData.get("email") ?? "");
      const password = String(formData.get("password") ?? "");
      try {
        const res = await api.login({ email, password });
        setToken(res.token);
        router.push("/dashboard");
        return null;
      } catch (e) {
        return e instanceof Error ? e.message : "Identifiants invalides";
      }
    },
    null,
  );

  return (
    <form action={action} className="space-y-4">
      <GoogleButton label="Continuer avec Google" />
      <AuthDivider />

      {error && <AuthError>{error}</AuthError>}

      <AuthField
        label="Email"
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        spellCheck={false}
        required
        placeholder="vous@exemple.com"
      />
      <AuthField
        label="Mot de passe"
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        placeholder="••••••••"
      />

      <SubmitButton pending={pending}>Se connecter</SubmitButton>
    </form>
  );
}
