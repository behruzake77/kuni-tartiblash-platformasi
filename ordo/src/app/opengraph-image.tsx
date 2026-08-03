import { ImageResponse } from "next/og";

export const alt = "Ordo — Take control of every day";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background:
            "linear-gradient(135deg, #070A12 0%, #0B0F1A 45%, #121A2B 100%)",
          color: "#F8FAFC",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 80,
            top: 120,
            width: 280,
            height: 280,
            borderRadius: 999,
            background:
              "radial-gradient(circle, rgba(59,130,246,0.45) 0%, rgba(139,92,246,0.2) 45%, transparent 70%)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "-0.03em",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 999,
              border: "3px solid #3B82F6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 999,
                border: "3px solid #8B5CF6",
              }}
            />
          </div>
          Ordo
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 64,
            fontWeight: 800,
            letterSpacing: "-0.045em",
            lineHeight: 1.05,
            maxWidth: 720,
          }}
        >
          Take control of every day
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 26,
            color: "#B2BED0",
            maxWidth: 640,
            lineHeight: 1.4,
          }}
        >
          Plan priorities · Protect focus · Close with clarity
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 18,
            color: "#8B5CF6",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          Plan · Focus · Close
        </div>
      </div>
    ),
    { ...size }
  );
}
