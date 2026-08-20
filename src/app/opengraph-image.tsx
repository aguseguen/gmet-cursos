import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "GMET — Cursos y Oportunidades";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1A0A14",
        }}
      >
        <div style={{ fontSize: 120, fontWeight: 600, color: "#E8157A" }}>
          GMET
        </div>
        <div style={{ fontSize: 40, color: "#DFA0C0", marginTop: 12 }}>
          Cursos y Oportunidades
        </div>
      </div>
    ),
    { ...size }
  );
}
