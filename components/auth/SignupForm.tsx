"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { api, setToken } from "@/lib/api";
import { AuthField } from "./AuthField";
import { GoogleButton } from "./GoogleButton";
import { AuthDivider, AuthError, SubmitButton } from "./parts";

export function SignupForm() {
  const router = useRouter();

  const [error, action, pending] = useActionState<string | null, FormData>(
    async (_prev, formData) => {
      const name = String(formData.get("name") ?? "").trim();
      const email = String(formData.get("email") ?? "");
      const password = String(formData.get("password") ?? "");

      // Validation côté client alignée sur le RegisterDto (password >= 6)
      if (password.length < 6) {
        return "Le mot de passe doit contenir au moins 6 caractères.";
      }

      try {
        const res = await api.register({
          email,
          password,
          name: name || undefined,
        });
        setToken(res.token);
        router.push("/dashboard");
        return null;
      } catch (e) {
        return e instanceof Error ? e.message : "Inscription impossible";
      }
    },
    null,
  );

  return (
    <form action={action} className="space-y-4">
      <GoogleButton label="S’inscrire avec Google" />
      <AuthDivider />

      {error && <AuthError>{error}</AuthError>}

      <AuthField
        label="Nom (optionnel)"
        id="name"
        name="name"
        type="text"
        autoComplete="name"
        placeholder="Votre nom"
      />
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
        autoComplete="new-password"
        required
        minLength={6}
        placeholder="6 caractères minimum"
        hint="Au moins 6 caractères."
      />

      <SubmitButton pending={pending}>Créer mon compte</SubmitButton>
    </form>
  );
}
