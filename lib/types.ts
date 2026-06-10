// Types partagés, alignés sur les réponses du backend NestJS (localhost:3001)

export type BookStatus = "DRAFT" | "GENERATING" | "READY" | "FAILED";
export type ChapterStatus = "PENDING" | "GENERATING" | "DONE" | "FAILED";

export interface User {
  id: string;
  email: string;
  name: string | null;
  credits: number;
  avatarUrl?: string | null;
  emailVerified?: boolean;
}

// État global du site (mode maintenance). `admin` = le porteur du token est l'admin.
export interface AppStatus {
  maintenance: boolean;
  admin: boolean;
}

export interface Chapter {
  id: string;
  bookId: string;
  order: number;
  title: string;
  content: string | null;
  status: ChapterStatus;
}

export interface Book {
  id: string;
  userId: string;
  title: string;
  topic: string;
  audience: string | null;
  tone: string | null;
  language: string;
  style: string;
  status: BookStatus;
  coverUrl: string | null;
  unlocked: boolean;
  createdAt: string;
  updatedAt: string;
  chapters?: Chapter[];
}

export interface Ledger {
  id: string;
  delta: number;
  reason: string;
  label: string;
  balanceAfter: number;
  createdAt: string;
}

export interface CreditPack {
  id: string;
  label: string;
  credits: number;
  amount: string;
  currency: string;
}

export type NicheLevel = "low" | "medium" | "high";
export type NicheTrend = "rising" | "stable" | "declining";

export interface NicheAnalysis {
  keyword: string;
  geo: string;
  score: number; // 0-100
  trend: NicheTrend;
  demand: NicheLevel;
  competition: NicheLevel;
  summary: string;
  subNiches: { name: string; angle: string }[];
  titles: string[];
  audience: string;
  monetization: string;
  source: "ai-estimate" | "trends";
  generatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
