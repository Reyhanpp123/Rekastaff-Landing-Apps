import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";
import { SITE_NAME, SOCIAL_TITLE } from "@/lib/seo";

export const alt = SOCIAL_TITLE;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const chips = ["Absensi GPS", "Cuti & Shift", "Payroll PPh 21 & BPJS"];

/**
 * OG image 1200x630 yang di-generate saat build.
 *
 * Sengaja tidak memuat font eksternal: satori hanya punya Noto Sans (weight
 * 400), dan mengambil font dari jaringan akan membuat build Docker gagal bila
 * tidak ada akses internet. Kontras dibangun lewat ukuran & warna, bukan bold.
 */
export default function OpengraphImage() {
  const logoBase64 = readFileSync(
    join(process.cwd(), "public", "logo.svg")
  ).toString("base64");
  const logoSrc = `data:image/svg+xml;base64,${logoBase64}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 80px",
          backgroundColor: "#0B3A6C",
          backgroundImage:
            "linear-gradient(135deg, #082A4F 0%, #0B3A6C 45%, #137EE9 100%)",
          position: "relative",
        }}
      >
        {/* Ornamen background */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -140,
            width: 540,
            height: 540,
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.07)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -220,
            left: -160,
            width: 480,
            height: 480,
            borderRadius: 999,
            backgroundColor: "rgba(19,126,233,0.22)",
            display: "flex",
          }}
        />

        {/* Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 44,
          }}
        >
          <img src={logoSrc} width={76} height={76} alt="" />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: 22,
            }}
          >
            <div style={{ fontSize: 40, color: "#FFFFFF", letterSpacing: -1 }}>
              {SITE_NAME}
            </div>
            <div
              style={{
                fontSize: 17,
                color: "#8FC5F5",
                letterSpacing: 6,
                marginTop: 2,
              }}
            >
              HRIS
            </div>
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            fontSize: 64,
            color: "#FFFFFF",
            lineHeight: 1.18,
            maxWidth: 940,
            letterSpacing: -1.5,
          }}
        >
          {SOCIAL_TITLE}
        </div>

        {/* Chips fitur */}
        <div style={{ display: "flex", marginTop: 46 }}>
          {chips.map((chip) => (
            <div
              key={chip}
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: 25,
                color: "#FFFFFF",
                backgroundColor: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.28)",
                borderRadius: 999,
                padding: "13px 28px",
                marginRight: 16,
              }}
            >
              {chip}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 52,
          }}
        >
          <div style={{ display: "flex", fontSize: 26, color: "#BBD9F7" }}>
            rekastaff.com
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 25,
              color: "#0B3A6C",
              backgroundColor: "#FFFFFF",
              borderRadius: 999,
              padding: "14px 32px",
            }}
          >
            Gratis untuk tim kecil
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
