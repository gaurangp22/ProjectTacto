import type { Config } from "tailwindcss";

const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./client/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: v("paper"),
        "paper-2": v("paper-2"),
        card: v("card"),
        ink: v("ink"),
        "ink-2": v("ink-2"),
        "ink-3": v("ink-3"),
        line: v("line"),
        coral: v("coral"),
        teal: v("teal"),
        plum: v("plum"),
        ochre: v("ochre"),
        sky: v("sky"),
        rose: v("rose"),
        leaf: v("leaf"),
        oat: v("oat"),
      },
      fontFamily: {
        display: ['"Cabinet Grotesk"', "system-ui", "sans-serif"],
        sans: ["Satoshi", "system-ui", "-apple-system", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      borderRadius: { "4xl": "2rem", "5xl": "2.5rem" },
      boxShadow: {
        tile: "0 1px 0 rgb(255 255 255 / .35) inset, 0 -3px 0 rgb(0 0 0 / .18) inset, 0 6px 14px -6px rgb(22 21 15 / .35)",
        lift: "0 30px 60px -30px rgb(22 21 15 / .35), 0 12px 24px -12px rgb(22 21 15 / .18)",
        soft: "0 1px 2px rgb(22 21 15 / .06), 0 8px 24px -12px rgb(22 21 15 / .18)",
      },
      keyframes: {
        marquee: { to: { transform: "translateX(-50%)" } },
        floaty: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        ping2: { "0%": { transform: "scale(.6)", opacity: ".7" }, "100%": { transform: "scale(2.4)", opacity: "0" } },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        floaty: "floaty 6s ease-in-out infinite",
        ping2: "ping2 2.4s cubic-bezier(.2,.6,.3,1) infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
