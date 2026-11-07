import type { Config } from "tailwindcss";

/**
 * Identidade Aplik Films: preto com vermelho e cromado do logotipo.
 * `ouro`, `neon` e `azul` continuam como nomes do acento por compatibilidade com os componentes; hoje o acento é o vermelho.
 */
const ouro = { DEFAULT: "rgb(var(--ouro) / <alpha-value>)", soft: "#FF6B6B", deep: "#A3070E" };
/** Tons que mudam com o tema: escuro por padrão, claro dentro de `.tema-claro`. */
const tom = (v: string) => `rgb(var(--${v}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ouro,
        neon: ouro,
        prata: { DEFAULT: "#C9CBCF", claro: "#F2F3F5", escuro: "#7B7F86" },
        esmeralda: { DEFAULT: "#34C38F", soft: "#86E3BD" },
        tx: tom("tx"),
        tx2: tom("tx2"),
        tx3: tom("tx3"),
        tx4: tom("tx4"),
        linha: tom("linha"),
        sup: tom("sup"),
        mar: "#0E6BA8",
        azul: { DEFAULT: "#E10914", claro: "#FF3B3B", escuro: "#8E060C" },
        noite: { DEFAULT: "#111113", fundo: "#070708" },
        alerta: "#E8B04A",
        perigo: "#E5484D",
      },
      fontFamily: {
        sans: ["var(--font-corpo)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-corpo)", "ui-sans-serif", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
        serif: ["var(--font-corpo)", "ui-sans-serif", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        "3xl": "0.625rem",
      },
      boxShadow: {
        neon: "0 0 0 1px rgba(225,9,20,.45), 0 12px 32px -18px rgba(225,9,20,.45)",
        "neon-lg": "0 0 0 1px rgba(225,9,20,.6), 0 16px 40px -18px rgba(225,9,20,.55)",
        esmeralda: "0 0 0 1px rgba(52,195,143,.4), 0 10px 30px -14px rgba(52,195,143,.5)",
        vidro: "inset 0 1px 0 0 rgb(var(--linha) / .07), 0 24px 48px -30px rgb(var(--sombra) / .55)",
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
