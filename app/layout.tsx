import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Serif éditorial pour les titres (évoque le livre, chaleureux)
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const title = "EbookGen — Créez et vendez vos ebooks avec l’IA";
const description =
  "Décrivez un sujet, l’IA rédige un ebook complet et mis en page (PDF/EPUB). Payez par Mobile Money. 10 crédits offerts, sans carte bancaire.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "EbookGen",
    locale: "fr_FR",
    type: "website",
    // l'image est fournie par app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

// Script exécuté avant le premier paint : applique le thème (anti-FOUC)
// et active l'état initial des animations de révélation.
const themeScript = `
try {
  var t = localStorage.getItem('theme');
  var d = t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  var e = document.documentElement;
  if (d) e.classList.add('dark');
  e.classList.add('js-anim');
} catch (_) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full bg-paper text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Passer au contenu
        </a>
        {children}
      </body>
    </html>
  );
}
