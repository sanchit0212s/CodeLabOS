import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx,mdx,md}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        bg: {
          DEFAULT: "#0a0d12",
          panel: "#10141b",
          raised: "#161b24",
          inset: "#0d1117",
        },
        edge: {
          DEFAULT: "#1f2733",
          strong: "#2a3441",
          glow: "#3b4a5e",
        },
        ink: {
          DEFAULT: "#e7ecf3",
          dim: "#9aa6b8",
          mute: "#6a7689",
          faint: "#46505f",
        },
        accent: {
          DEFAULT: "#7ee7d0",
          glow: "#a8f0de",
          deep: "#3aa68e",
        },
        signal: {
          ok: "#7ee7d0",
          warn: "#f5c879",
          err: "#f08a8a",
          info: "#8ab4f8",
          phase: "#c79bf5",
        },
      },
      boxShadow: {
        panel: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 0 0 1px rgba(255,255,255,0.02)",
        glow: "0 0 0 1px rgba(126,231,208,0.35), 0 0 30px rgba(126,231,208,0.15)",
      },
      keyframes: {
        blink: { "0%,49%": { opacity: "1" }, "50%,100%": { opacity: "0" } },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
      animation: {
        blink: "blink 1s steps(1) infinite",
        scan: "scan 8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
