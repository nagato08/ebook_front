"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Mail,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Camera,
  Eye,
  EyeOff,
  BookOpen,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";

type Tab = "profile" | "analytics" | "security";

export default function SettingsPage() {
  const { user, logout, refresh } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Avatar
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  // Profile
  const [editName, setEditName] = useState(user.name || "");
  const [nameLoading, setNameLoading] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSuccess, setNameSuccess] = useState(false);

  // Password
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Email verification
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifySuccess, setVerifySuccess] = useState(false);

  // Analytics
  const [books, setBooks] = useState<any[]>([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [chartRange, setChartRange] = useState<"all" | "month" | "year">(
    "month",
  );

  const avatarUrl = user.avatarUrl && process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}${user.avatarUrl}`
    : null;

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  const totalBooks = books.length;
  const completedBooks = books.filter((b) => b.status === "READY").length;
  const generatingBooks = books.filter((b) => b.status === "GENERATING").length;

  useEffect(() => {
    api
      .listBooks()
      .then((d) => setBooks(d))
      .catch(() => {})
      .finally(() => setBooksLoading(false));
  }, []);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setAvatarError("JPEG, PNG ou WebP uniquement");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError("Max 2 Mo");
      return;
    }

    setAvatarLoading(true);
    setAvatarError(null);
    try {
      await api.uploadAvatar(file);
      await refresh();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : "Erreur upload");
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || editName === user.name) return;

    setNameLoading(true);
    setNameError(null);
    setNameSuccess(false);
    try {
      await api.updateProfile(editName.trim());
      await refresh();
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 5000);
    } catch (err) {
      setNameError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setNameLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Min 6 caractères");
      return;
    }

    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(false);
    try {
      await api.changePassword(oldPassword, newPassword);
      setPasswordSuccess(true);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 5000);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSendVerification = async () => {
    setVerifying(true);
    setVerifyError(null);
    setVerifySuccess(false);
    try {
      await api.sendVerification(user.email);
      setVerifySuccess(true);
      setTimeout(() => setVerifySuccess(false), 5000);
    } catch (err) {
      setVerifyError(
        err instanceof Error ? err.message : "Erreur lors de l'envoi",
      );
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink">
          Paramètres
        </h1>
        <p className="mt-1 text-ink-soft">Gérez votre compte et vos préférences.</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-line mb-8">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === "profile"
              ? "border-brand text-brand"
              : "border-transparent text-ink-soft hover:text-ink"
          }`}
        >
          Général & Profil
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === "analytics"
              ? "border-brand text-brand"
              : "border-transparent text-ink-soft hover:text-ink"
          }`}
        >
          Analytiques
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === "security"
              ? "border-brand text-brand"
              : "border-transparent text-ink-soft hover:text-ink"
          }`}
        >
          Connexion
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <>
            {/* Identité Publique */}
            <section className="rounded-card border border-line bg-paper p-8">
              <h2 className="font-display text-lg font-semibold text-ink mb-6">
                Identité publique
              </h2>

              <div className="space-y-6">
                {/* Avatar */}
                <div>
                  <label className="block text-sm font-medium text-ink-soft mb-3">
                    Photo de profil
                  </label>
                  <button
                    type="button"
                    onClick={handleAvatarClick}
                    disabled={avatarLoading}
                    className="group relative h-28 w-28 rounded-full overflow-hidden border-2 border-line transition-colors hover:border-brand disabled:opacity-50"
                  >
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt="Avatar"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-paper-2 text-3xl font-semibold text-ink-soft">
                        {initials}
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      {avatarLoading ? (
                        <Loader2 className="h-7 w-7 animate-spin text-paper" />
                      ) : (
                        <Camera className="h-7 w-7 text-paper" />
                      )}
                    </div>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  {avatarError && (
                    <p className="mt-2 text-sm text-red-600">
                      {avatarError}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-ink-soft">
                    JPEG, PNG ou WebP · Max 2 Mo
                  </p>
                </div>

                {/* Email (read-only) */}
                <div>
                  <label className="block text-sm font-medium text-ink-soft mb-2">
                    Email
                  </label>
                  <p className="px-3.5 py-2.5 rounded-lg border border-line bg-paper-2 text-sm text-ink">
                    {user.email}
                  </p>
                </div>

                {/* Nom */}
                <form onSubmit={handleNameSubmit}>
                  <label className="block text-sm font-medium text-ink-soft mb-2">
                    Nom complet
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => {
                        setEditName(e.target.value);
                        setNameSuccess(false);
                      }}
                      disabled={nameLoading}
                      className="flex-1 h-11 rounded-lg border border-line bg-paper px-3.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-brand focus:ring-2 focus:ring-brand/25 disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={!editName.trim() || editName === user.name || nameLoading}
                      className="h-11 px-4 rounded-lg bg-ink font-medium text-paper transition-colors hover:bg-brand disabled:opacity-50 cursor-pointer"
                    >
                      {nameLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Sauver"
                      )}
                    </button>
                  </div>
                  {nameError && (
                    <p className="mt-2 text-sm text-red-600">{nameError}</p>
                  )}
                  {nameSuccess && (
                    <p className="mt-2 text-sm text-money">Nom mis à jour.</p>
                  )}
                </form>

                {/* Crédits */}
                <div>
                  <label className="block text-sm font-medium text-ink-soft mb-2">
                    Crédits disponibles
                  </label>
                  <p className="px-3.5 py-2.5 rounded-lg border border-line bg-paper-2 font-display text-lg font-semibold text-ink">
                    {user.credits}
                  </p>
                </div>
              </div>
            </section>

            {/* Vérification Email */}
            <section className="rounded-card border border-line bg-paper p-8">
              <h2 className="font-display text-lg font-semibold text-ink mb-6">
                Vérification email
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-lg border border-line bg-paper-2 px-4 py-3">
                  {user.emailVerified ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-money" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-ink">
                          Email vérifié
                        </p>
                        <p className="text-xs text-ink-soft">
                          Vous pouvez générer des livres.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-accent-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-ink">
                          Email non vérifié
                        </p>
                        <p className="text-xs text-ink-soft">
                          Vérifiez votre email pour débloquer la génération.
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {verifySuccess && (
                  <div className="flex items-start gap-2.5 rounded-lg border border-money/20 bg-money/10 px-4 py-3 text-sm text-money">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    Email de vérification envoyé. Vérifiez votre boîte de réception.
                  </div>
                )}

                {verifyError && (
                  <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    {verifyError}
                  </div>
                )}

                {!user.emailVerified && (
                  <button
                    onClick={handleSendVerification}
                    disabled={verifying}
                    className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-paper px-5 font-medium text-ink transition-colors hover:bg-paper-2 disabled:opacity-50 cursor-pointer"
                  >
                    {verifying && (
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    )}
                    {verifying
                      ? "Envoi en cours…"
                      : "Renvoyer le lien de vérification"}
                  </button>
                )}
              </div>
            </section>
          </>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <section className="rounded-card border border-line bg-paper p-8">
            <h2 className="font-display text-lg font-semibold text-ink mb-6">
              Performance
            </h2>

            {booksLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-brand mx-auto mb-2" />
                <p className="text-ink-soft">Chargement…</p>
              </div>
            ) : (
              <>
                <div className="grid gap-5 sm:grid-cols-3">
                <div className="rounded-lg border border-line bg-paper-2 p-5">
                  <div className="flex items-center gap-2 text-ink-soft mb-2">
                    <BookOpen className="h-4.5 w-4.5" />
                    <span className="text-xs font-semibold uppercase">Total</span>
                  </div>
                  <p className="font-display text-3xl font-semibold text-ink">
                    {totalBooks}
                  </p>
                  <p className="text-xs text-ink-soft mt-1">Projets créés</p>
                </div>

                <div className="rounded-lg border border-line bg-paper-2 p-5">
                  <div className="flex items-center gap-2 text-money mb-2">
                    <CheckCircle2 className="h-4.5 w-4.5" />
                    <span className="text-xs font-semibold uppercase">Finis</span>
                  </div>
                  <p className="font-display text-3xl font-semibold text-ink">
                    {completedBooks}
                  </p>
                  <p className="text-xs text-ink-soft mt-1">Ebooks terminés</p>
                </div>

                <div className="rounded-lg border border-line bg-paper-2 p-5">
                  <div className="flex items-center gap-2 text-accent-600 mb-2">
                    <Clock className="h-4.5 w-4.5" />
                    <span className="text-xs font-semibold uppercase">En cours</span>
                  </div>
                  <p className="font-display text-3xl font-semibold text-ink">
                    {generatingBooks}
                  </p>
                  <p className="text-xs text-ink-soft mt-1">En génération</p>
                </div>
              </div>

              {/* Activité de création */}
              <div className="mt-8 rounded-lg border border-line bg-paper-2 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-semibold text-ink">
                    Activité de création (Globale)
                  </h3>
                  <div className="flex gap-1 rounded-full bg-paper p-1 border border-line">
                    {(
                      [
                        { id: "all", label: "Tout" },
                        { id: "month", label: "Mois" },
                        { id: "year", label: "Année" },
                      ] as const
                    ).map((r) => (
                      <button
                        key={r.id}
                        onClick={() => setChartRange(r.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          chartRange === r.id
                            ? "bg-ink text-paper"
                            : "text-ink-soft hover:text-ink"
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
                <ActivityChart books={books} range={chartRange} />
              </div>
            </>
            )}
          </section>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <>
            {/* Connexion */}
            <section className="rounded-card border border-line bg-paper p-8">
              <h2 className="font-display text-lg font-semibold text-ink mb-6">
                Adresse email
              </h2>

              <div className="flex items-center gap-3 rounded-lg border border-line bg-paper-2 px-4 py-3">
                <Mail className="h-5 w-5 text-ink-soft" />
                <div>
                  <p className="text-sm font-medium text-ink">{user.email}</p>
                  <p className="text-xs text-ink-soft">Adresse principale</p>
                </div>
              </div>
            </section>

            {/* Mot de passe */}
            <section className="rounded-card border border-line bg-paper p-8">
              <h2 className="font-display text-lg font-semibold text-ink mb-6">
                Mot de passe
              </h2>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {/* Ancien mdp */}
                <div>
                  <label className="block text-sm font-medium text-ink-soft mb-2">
                    Ancien mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showOld ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => {
                        setOldPassword(e.target.value);
                        setPasswordSuccess(false);
                      }}
                      disabled={passwordLoading}
                      className="w-full h-11 rounded-lg border border-line bg-paper px-3.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-brand focus:ring-2 focus:ring-brand/25 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOld(!showOld)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
                    >
                      {showOld ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Nouveau mdp */}
                <div>
                  <label className="block text-sm font-medium text-ink-soft mb-2">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setPasswordSuccess(false);
                      }}
                      disabled={passwordLoading}
                      className="w-full h-11 rounded-lg border border-line bg-paper px-3.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-brand focus:ring-2 focus:ring-brand/25 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
                    >
                      {showNew ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirmation */}
                <div>
                  <label className="block text-sm font-medium text-ink-soft mb-2">
                    Confirmer mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setPasswordSuccess(false);
                      }}
                      disabled={passwordLoading}
                      className="w-full h-11 rounded-lg border border-line bg-paper px-3.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-brand focus:ring-2 focus:ring-brand/25 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
                    >
                      {showConfirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {passwordError && (
                  <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div className="flex items-start gap-2.5 rounded-lg border border-money/20 bg-money/10 px-4 py-3 text-sm text-money">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    Mot de passe modifié avec succès.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    !oldPassword ||
                    !newPassword ||
                    !confirmPassword ||
                    passwordLoading
                  }
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 font-medium text-paper transition-colors hover:bg-brand disabled:opacity-50 cursor-pointer"
                >
                  {passwordLoading && (
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  )}
                  {passwordLoading ? "Changement…" : "Mettre à jour"}
                </button>
              </form>
            </section>

            {/* Déconnexion */}
            <section className="rounded-card border border-line bg-paper p-8">
              <p className="text-sm text-ink-soft mb-4">
                Vous pouvez vous déconnecter à tout moment. Vos données et vos
                crédits resteront sauvegardés.
              </p>
              <button
                onClick={logout}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 font-medium text-paper transition-colors hover:bg-brand cursor-pointer"
              >
                <LogOut className="h-4.5 w-4.5" />
                Se déconnecter
              </button>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
   Graphe d'activité — area chart dynamique (ebooks créés par date)
   ---------------------------------------------------------------- */
const MONTHS = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Août",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

function ActivityChart({
  books,
  range,
}: {
  books: { createdAt: string }[];
  range: "all" | "month" | "year";
}) {
  const now = new Date();
  const [hover, setHover] = useState<number | null>(null);

  // Construit les buckets (label + valeur) selon la plage choisie
  let buckets: { label: string; value: number }[] = [];

  if (range === "month") {
    // 30 derniers jours, regroupés par jour
    const map = new Map<string, number>();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      map.set(d.toISOString().split("T")[0], 0);
    }
    books.forEach((b) => {
      const key = new Date(b.createdAt).toISOString().split("T")[0];
      if (map.has(key)) map.set(key, (map.get(key) || 0) + 1);
    });
    buckets = Array.from(map.entries()).map(([key, value]) => {
      const d = new Date(key);
      return { label: `${d.getDate()} ${MONTHS[d.getMonth()]}`, value };
    });
  } else if (range === "year") {
    // 12 derniers mois, regroupés par mois
    const map = new Map<string, number>();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      map.set(`${d.getFullYear()}-${d.getMonth()}`, 0);
    }
    books.forEach((b) => {
      const d = new Date(b.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (map.has(key)) map.set(key, (map.get(key) || 0) + 1);
    });
    buckets = Array.from(map.entries()).map(([key, value]) => {
      const month = Number(key.split("-")[1]);
      return { label: MONTHS[month], value };
    });
  } else {
    // Tout : regroupé par mois depuis le premier livre
    if (books.length === 0) {
      buckets = [{ label: MONTHS[now.getMonth()], value: 0 }];
    } else {
      const sorted = [...books].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
      const first = new Date(sorted[0].createdAt);
      const map = new Map<string, number>();
      const cursor = new Date(first.getFullYear(), first.getMonth(), 1);
      while (cursor <= now) {
        map.set(`${cursor.getFullYear()}-${cursor.getMonth()}`, 0);
        cursor.setMonth(cursor.getMonth() + 1);
      }
      books.forEach((b) => {
        const d = new Date(b.createdAt);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (map.has(key)) map.set(key, (map.get(key) || 0) + 1);
      });
      buckets = Array.from(map.entries()).map(([key, value]) => {
        const month = Number(key.split("-")[1]);
        return { label: MONTHS[month], value };
      });
    }
  }

  const W = 600;
  const H = 180;
  const PAD = 16;
  const maxVal = Math.max(...buckets.map((b) => b.value), 1);
  const n = buckets.length;

  const x = (i: number) =>
    n <= 1 ? W / 2 : PAD + (i / (n - 1)) * (W - PAD * 2);
  const y = (val: number) => H - PAD - (val / maxVal) * (H - PAD * 2);

  const linePath = buckets
    .map((b, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(b.value)}`)
    .join(" ");
  const areaPath =
    `M${x(0)},${H - PAD} ` +
    buckets.map((b, i) => `L${x(i)},${y(b.value)}`).join(" ") +
    ` L${x(n - 1)},${H - PAD} Z`;

  // Labels axe X : on n'en montre que quelques-uns pour éviter l'encombrement
  const labelStep = Math.max(1, Math.ceil(n / 6));

  return (
    <div className="text-brand">
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-48"
          xmlns="http://www.w3.org/2000/svg"
          onMouseLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Lignes de grille horizontales */}
          {[0.25, 0.5, 0.75].map((f) => (
            <line
              key={f}
              x1={PAD}
              y1={PAD + f * (H - PAD * 2)}
              x2={W - PAD}
              y2={PAD + f * (H - PAD * 2)}
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.1"
            />
          ))}

          {/* Aire + courbe */}
          <path d={areaPath} fill="url(#areaFill)" />
          <path
            d={linePath}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Ligne guide verticale au survol */}
          {hover !== null && (
            <line
              x1={x(hover)}
              y1={PAD}
              x2={x(hover)}
              y2={H - PAD}
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.4"
            />
          )}

          {/* Points */}
          {buckets.map((b, i) => (
            <circle
              key={i}
              cx={x(i)}
              cy={y(b.value)}
              r={hover === i ? 5 : b.value > 0 ? 3.5 : 2}
              fill="currentColor"
              stroke={hover === i ? "var(--paper)" : "none"}
              strokeWidth={hover === i ? 2 : 0}
            />
          ))}

          {/* Zones de survol invisibles */}
          {buckets.map((b, i) => {
            const bandW = n <= 1 ? W : (W - PAD * 2) / (n - 1);
            return (
              <rect
                key={i}
                x={x(i) - bandW / 2}
                y={0}
                width={bandW}
                height={H}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
              />
            );
          })}
        </svg>

        {/* Tooltip */}
        {hover !== null && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-line bg-ink px-3 py-2 text-paper shadow-lg"
            style={{
              left: `${(x(hover) / W) * 100}%`,
              top: `${(y(buckets[hover].value) / H) * 100}%`,
              marginTop: "-8px",
            }}
          >
            <p className="text-xs font-medium whitespace-nowrap">
              {buckets[hover].label}
            </p>
            <p className="font-display text-sm font-semibold whitespace-nowrap">
              {buckets[hover].value} livre{buckets[hover].value > 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>

      {/* Labels X */}
      <div className="flex justify-between mt-3 text-xs text-ink-soft">
        {buckets
          .filter((_, i) => i % labelStep === 0 || i === n - 1)
          .map((b, i) => (
            <span key={i}>{b.label}</span>
          ))}
      </div>
    </div>
  );
}
