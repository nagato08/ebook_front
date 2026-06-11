// Client API minimal vers le backend NestJS.
// Le token JWT est stocké côté client (localStorage) après login/signup.

import type {
  AppStatus,
  AuthResponse,
  Book,
  Chapter,
  CreditPack,
  Ledger,
  NicheAnalysis,
  User,
} from "./types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

const BASE_URL = API_URL;

const TOKEN_KEY = "ebookgen_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    // Backend format: { error: string, code: string, statusCode: number }
    // Fallback si message ou erreur simple
    let message = "Une erreur est survenue. Veuillez réessayer plus tard.";
    if (body.error) {
      if (Array.isArray(body.error)) {
        message = body.error.join(", ");
      } else {
        message = body.error;
      }
    } else if (body.message) {
      message = body.message;
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export const api = {
  // --- statut / maintenance ---
  // Public. Renvoie { maintenance, admin } (admin = le token porte l'email admin).
  getStatus: () => request<AppStatus>("/status"),
  // Admin only. Bascule le mode maintenance.
  setMaintenance: (on: boolean) =>
    request<{ maintenance: boolean }>("/maintenance", {
      method: "POST",
      body: JSON.stringify({ on }),
    }),

  // --- auth ---
  register: (data: { email: string; password: string; name?: string }) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  login: (data: { email: string; password: string }) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  me: () => request<User>("/users/me"),
  verifyEmail: (token: string) =>
    request<{ message: string }>(
      `/auth/verify-email?token=${encodeURIComponent(token)}`,
    ),
  sendVerification: (email: string) =>
    request<{ message: string }>("/auth/send-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  // --- books ---
  listBooks: () => request<Book[]>("/books"),
  getBook: (id: string) => request<Book>(`/books/${id}`),
  createBook: (data: {
    title: string;
    topic: string;
    audience?: string;
    tone?: string;
    language?: string;
    style?: string;
  }) =>
    request<Book>("/books", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteBook: (id: string) =>
    request<{ deleted: boolean }>(`/books/${id}`, { method: "DELETE" }),
  updateChapter: (
    bookId: string,
    chapterId: string,
    data: { title?: string; content?: string },
  ) =>
    request<Chapter>(`/books/${bookId}/chapters/${chapterId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // --- generation ---
  generate: (
    bookId: string,
    opts?: { chapters?: number; pages?: number },
  ) =>
    request<{ bookId: string; status: string; creditsSpent: number }>(
      `/books/${bookId}/generate`,
      { method: "POST", body: JSON.stringify(opts ?? {}) },
    ),
  bookStatus: (bookId: string) =>
    request<{
      status: string;
      progress: number;
      chapters: number;
      coverUrl: string | null;
    }>(`/books/${bookId}/status`),
  unlock: (bookId: string) =>
    request<{ bookId: string; unlocked: boolean; creditsSpent: number }>(
      `/books/${bookId}/unlock`,
      { method: "POST" },
    ),

  // --- export ---
  // Telecharge le fichier (PDF/EPUB) et declenche le download navigateur.
  exportBook: async (bookId: string, format: "pdf" | "epub") => {
    const token = getToken();
    const res = await fetch(`${BASE_URL}/books/${bookId}/export/${format}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? "Echec de l'export. Reessayez.");
    }
    const blob = await res.blob();
    const disposition = res.headers.get("Content-Disposition") ?? "";
    const match = disposition.match(/filename="?([^"]+)"?/);
    const filename = match?.[1] ?? `ebook.${format}`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },

  // --- niche ---
  analyzeNiche: (keyword: string, geo?: string) =>
    request<NicheAnalysis>("/niches/analyze", {
      method: "POST",
      body: JSON.stringify({ keyword, geo }),
    }),

  // --- credits ---
  balance: () => request<{ credits: number }>("/credits/balance"),
  ledger: () =>
    request<Ledger[]>("/credits/ledger"),

  // --- payments ---
  packs: () => request<CreditPack[]>("/payments/packs"),
  deposit: (data: { packId: string; phoneNumber?: string }) =>
    request<{
      depositId: string;
      status: string;
      checkoutUrl?: string;
      operator?: string;
      message: string;
    }>("/payments/deposit", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  depositStatus: (depositId: string) =>
    request<{ depositId: string; status: string; credited: boolean }>(
      `/payments/deposit/${depositId}/status`,
    ),

  // Infos paiement manuel (numero MoMo de l'admin a afficher).
  manualInfo: () =>
    request<{
      enabled: boolean;
      number: string;
      name: string;
      operators: { code: string; displayName: string }[];
    }>("/payments/manual-info"),
  // Soumet un paiement manuel (preuve: numero payeur + ID transaction).
  payManual: (data: { packId: string; senderPhone: string; txId: string }) =>
    request<{ depositId: string; status: string; message: string }>(
      "/payments/manual",
      { method: "POST", body: JSON.stringify(data) },
    ),

  // --- profile ---
  updateProfile: (name: string) =>
    request<User>("/users/me", {
      method: "PATCH",
      body: JSON.stringify({ name }),
    }),
  changePassword: (oldPassword: string, newPassword: string) =>
    request<{ message: string }>("/users/me/password", {
      method: "POST",
      body: JSON.stringify({ oldPassword, newPassword }),
    }),
  uploadAvatar: async (file: File) => {
    const token = getToken();
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await fetch(`${API_URL}/users/me/avatar`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || `Upload failed: ${res.status}`);
    }

    return res.json() as Promise<User>;
  },
};
