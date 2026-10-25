import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ConfigProvider } from "@/lib/store";
import { NavInferior, NavTopo, Rodape } from "@/components/layout/navegacao";

const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: "FilmProtect HUB // NEXUS", template: "%s · FilmProtect HUB" },
  description: "Proteção invisível. Design visível. Película de segurança, envelopamento automotivo e arquitetônico com indicação remunerada.",
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${grotesk.variable} ${mono.variable}`}>
      <body className="min-h-dvh font-sans">
        <ConfigProvider>
          <NavTopo />
          <main>{children}</main>
          <Rodape />
          <NavInferior />
        </ConfigProvider>
      </body>
    </html>
  );
}
