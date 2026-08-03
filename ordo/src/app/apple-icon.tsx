import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0F1A",
        }}
      >
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: 999,
            border: "6px solid #3B82F6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 40px rgba(59,130,246,0.45)",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 999,
              border: "6px solid #8B5CF6",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
