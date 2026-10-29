import type { Metadata, Viewport } from "next";
import { Saira, Montserrat, Kaushan_Script, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ConfigProvider } from "@/lib/store";
import { NavInferior, NavTopo, Rodape } from "@/components/layout/navegacao";

const display = Saira({ subsets: ["latin"], style: ["normal", "italic"], axes: ["wdth"], variable: "--font-display", display: "swap" });
const corpo = Montserrat({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-corpo", display: "swap" });
// pincelada da assinatura "Seu ambiente do seu jeito!"
const script = Kaushan_Script({ subsets: ["latin"], weight: "400", variable: "--font-script", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: "JR Filmes · Insulfilm, envelopamento e películas", template: "%s · JR Filmes" },
  description: "Proteção, conforto, estilo e valorização. Insulfilm automotivo, envelopamento automotivo e de superfícies, películas residenciais e comerciais.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${corpo.variable} ${script.variable} ${mono.variable}`}>
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
