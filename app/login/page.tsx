import Link from "next/link";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Connexion — EbookGen",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Bon retour"
      subtitle="Connectez-vous pour accéder à vos livres."
      footer={
        <>
          Pas encore de compte ?{" "}
          <Link href="/signup" className="font-medium text-brand">
            Créer un compte
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
