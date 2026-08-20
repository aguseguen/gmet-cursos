import type { Metadata } from "next";
import { Fredoka, DM_Sans } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-fredoka",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dmsans",
});

// VERCEL_URL lo inyecta Vercel automáticamente en cada deploy; sin esto,
// las URLs absolutas (como og:image) resolverían a localhost en producción.
const siteUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "GMET — Cursos y Oportunidades",
  description:
    "Recursos de formación en tecnología para mujeres de GIDAS, UTN La Plata",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${fredoka.variable} ${dmSans.variable} font-dmsans antialiased bg-brand-dark text-white`}
      >
        {children}
      </body>
    </html>
  );
}
