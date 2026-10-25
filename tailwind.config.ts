import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        neon: { DEFAULT: "#00D9FF", soft: "#7DEBFF", deep: "#0090AA" },
        esmeralda: { DEFAULT: "#10B981", soft: "#6EE7B7" },
        alerta: "#FACC15",
        perigo: "#F43F5E",
      },
      fontFamily: {
        sans: ["var(--font-grotesk)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        neon: "0 0 0 1px rgba(0,217,255,.35), 0 0 32px -6px rgba(0,217,255,.55)",
        "neon-lg": "0 0 0 1px rgba(0,217,255,.45), 0 0 60px -10px rgba(0,217,255,.7)",
        esmeralda: "0 0 0 1px rgba(16,185,129,.4), 0 0 32px -6px rgba(16,185,129,.55)",
        vidro: "inset 0 1px 0 0 rgba(255,255,255,.06), 0 20px 40px -24px rgba(0,0,0,.8)",
      },
      transitionTimingFunction: {
        saida: "cubic-bezier(0.23, 1, 0.32, 1)",
        gaveta: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
      keyframes: {
        varredura: { "0%": { transform: "translateY(-100%)" }, "100%": { transform: "translateY(260%)" } },
        pulso: { "0%,100%": { opacity: "0.55" }, "50%": { opacity: "1" } },
      },
      animation: {
        varredura: "varredura 4.5s cubic-bezier(0.77,0,0.175,1) infinite",
        pulso: "pulso 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
