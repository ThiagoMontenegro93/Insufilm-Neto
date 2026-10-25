import type { Config } from "tailwindcss";

/**
 * Identidade JR Filmes: preto profundo, metal escovado prata e acento dourado.
 * `neon` continua como nome do acento por compatibilidade com os componentes; hoje é o dourado.
 */
const ouro = { DEFAULT: "#D4AF6A", soft: "#F0DBA8", deep: "#9C7A3C" };

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ouro,
        neon: ouro,
        prata: { DEFAULT: "#C9CBCF", claro: "#F2F3F5", escuro: "#7B7F86" },
        esmeralda: { DEFAULT: "#34C38F", soft: "#86E3BD" },
        alerta: "#E8B04A",
        perigo: "#E5484D",
      },
      fontFamily: {
        sans: ["var(--font-corpo)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-corpo)", "ui-sans-serif", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
        serif: ["var(--font-serifa)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        "3xl": "0.625rem",
      },
      boxShadow: {
        neon: "0 0 0 1px rgba(212,175,106,.55), 0 12px 32px -18px rgba(212,175,106,.35)",
        "neon-lg": "0 0 0 1px rgba(212,175,106,.7), 0 16px 40px -18px rgba(212,175,106,.45)",
        esmeralda: "0 0 0 1px rgba(52,195,143,.4), 0 10px 30px -14px rgba(52,195,143,.5)",
        vidro: "inset 0 1px 0 0 rgba(255,255,255,.07), 0 24px 48px -28px rgba(0,0,0,.9)",
      },
      transitionTimingFunction: {
        saida: "cubic-bezier(0.23, 1, 0.32, 1)",
        gaveta: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
      keyframes: {
        varredura: { "0%": { transform: "translateY(-100%)" }, "100%": { transform: "translateY(260%)" } },
        pulso: { "0%,100%": { opacity: "0.6" }, "50%": { opacity: "1" } },
        reflexo: { "0%": { transform: "translateX(-120%) skewX(-20deg)" }, "60%,100%": { transform: "translateX(320%) skewX(-20deg)" } },
      },
      animation: {
        varredura: "varredura 4.5s cubic-bezier(0.77,0,0.175,1) infinite",
        pulso: "pulso 2.4s ease-in-out infinite",
        reflexo: "reflexo 6s cubic-bezier(0.77,0,0.175,1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
