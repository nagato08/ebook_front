import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const alt = "EbookGen — Créez et vendez vos ebooks avec l'IA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Polices bundlées (évite tout fetch réseau au build → déterministe + offline-safe)
const fontDir = join(process.cwd(), "assets", "fonts");
const fontRegular = readFileSync(join(fontDir, "DejaVuSans.ttf"));
const fontBold = readFileSync(join(fontDir, "DejaVuSans-Bold.ttf"));

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fbf9f4",
          padding: "72px",
          fontFamily: "DejaVu",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#15130f",
              color: "#fbf9f4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            E
          </div>
          <div style={{ fontSize: 34, fontWeight: 700, color: "#15130f" }}>
            EbookGen
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 700,
              color: "#15130f",
              lineHeight: 1.1,
            }}
          >
            Transformez une idée en
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 700,
              color: "#5b21b6",
              lineHeight: 1.1,
            }}
          >
            ebook prêt à vendre.
          </div>
          <div style={{ fontSize: 30, color: "#4b463d", marginTop: 24 }}>
            Génération IA · Mise en page PDF & EPUB · Paiement Mobile Money
          </div>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {["10 crédits offerts", "Sans carte bancaire"].map((t) => (
            <div
              key={t}
              style={{
                fontSize: 24,
                color: "#15130f",
                background: "#ede9fe",
                borderRadius: 999,
                padding: "10px 22px",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "DejaVu", data: fontRegular, weight: 400, style: "normal" },
        { name: "DejaVu", data: fontBold, weight: 700, style: "normal" },
      ],
    },
  );
}
