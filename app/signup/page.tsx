import Link from "next/link";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Inscription — EbookGen",
};

export default function SignupPage() {
  return (
    <AuthShell
      title="Créez votre compte"
      subtitle="10 crédits offerts, sans carte bancaire."
      footer={
        <>
          Déjà inscrit ?{" "}
          <Link href="/login" className="font-medium text-brand">
            Se connecter
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}
