import type { Config } from "tailwindcss"
import plugin from "tailwindcss/plugin"

const config  = {

  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx,ts,tsx,css,,md,mdx}",
    "./components/**/*.{js,jsx,ts,tsx,md,mdx}",
    "./app/**/*.{js,jsx,ts,tsx,css,md,mdx}",
    "./src/**/*.{js,jsx,ts,tsx,md,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "15px",
        sm: "15px",
        lg: "15px",
        xl: "0",
        "2xl": "0",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1392px",
      },
    },
    extend: {
      fontFamily: {
        sans: [
          "var(--font-jakarta)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      // Design system landing page (LANDING_PAGE_REDESIGN_PLAN.md bagian 15).
      // Namespace `rs-` agar tidak bentrok dengan token template dashboard.
      colors: {
        rs: {
          primary: "rgb(var(--rs-primary) / <alpha-value>)",
          "primary-strong": "rgb(var(--rs-primary-strong) / <alpha-value>)",
          cyan: "rgb(var(--rs-cyan) / <alpha-value>)",
          amber: "rgb(var(--rs-amber) / <alpha-value>)",
          "amber-strong": "rgb(var(--rs-amber-strong) / <alpha-value>)",
          success: "rgb(var(--rs-success) / <alpha-value>)",
          danger: "rgb(var(--rs-danger) / <alpha-value>)",
          bg: "rgb(var(--rs-bg) / <alpha-value>)",
          surface: "rgb(var(--rs-surface) / <alpha-value>)",
          raised: "rgb(var(--rs-raised) / <alpha-value>)",
          text: "rgb(var(--rs-text) / <alpha-value>)",
          muted: "rgb(var(--rs-muted) / <alpha-value>)",
          border: "rgb(var(--rs-border) / <alpha-value>)",
          ink: "rgb(var(--rs-ink) / <alpha-value>)",
          night: "rgb(var(--rs-night) / <alpha-value>)",
          "night-2": "rgb(var(--rs-night-2) / <alpha-value>)",
          "night-raised": "rgb(var(--rs-night-raised) / <alpha-value>)",
          "night-text": "rgb(var(--rs-night-text) / <alpha-value>)",
          "night-muted": "rgb(var(--rs-night-muted) / <alpha-value>)",
          "night-border": "rgb(var(--rs-night-border) / <alpha-value>)",
        },
        border: "hsl(var(--border) / <alpha-value>)",
        default: {
          50: "hsl(var(--default-50) / <alpha-value>)",
          100: "hsl(var(--default-100) / <alpha-value>)",
          200: "hsl(var(--default-200) / <alpha-value>)",
          300: "hsl(var(--default-300) / <alpha-value>)",
          400: "hsl(var(--default-400) / <alpha-value>)",
          500: "hsl(var(--default-500) / <alpha-value>)",
          600: "hsl(var(--default-600) / <alpha-value>)",
          700: "hsl(var(--default-700) / <alpha-value>)",
          800: "hsl(var(--default-800) / <alpha-value>)",
          900: "hsl(var(--default-900) / <alpha-value>)",
          950: "hsl(var(--default-950) / <alpha-value>)",
        },

        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          50: "hsl(var(--primary-50) / <alpha-value>)",
          100: "hsl(var(--primary-100) / <alpha-value>)",
          200: "hsl(var(--primary-200) / <alpha-value>)",
          300: "hsl(var(--primary-300) / <alpha-value>)",
          400: "hsl(var(--primary-400) / <alpha-value>)",
          500: "hsl(var(--primary-500) / <alpha-value>)",
          600: "hsl(var(--primary-600) / <alpha-value>)",
          700: "hsl(var(--primary-700) / <alpha-value>)",
          800: "hsl(var(--primary-800) / <alpha-value>)",
          900: "hsl(var(--primary-900) / <alpha-value>)",
          950: "hsl(var(--primary-950) / <alpha-value>)",
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          700: "#be185d",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        success: {
          DEFAULT: "hsl(var(--success) / <alpha-value>)",
          700: "#15803d",
          foreground: "hsl(var(--success-foreground) / <alpha-value>)",
        },
        info: {
          DEFAULT: "hsl(var(--info) / <alpha-value>)",
          700: "#0f766e",
          foreground: "hsl(var(--info-foreground) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "hsl(var(--warning) / <alpha-value>)",
          700: "#a16207",
          foreground: "hsl(var(--warning-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        }
      },
      boxShadow: {
        sm: "0px 1px 2px 0px rgba(15, 22, 36, 0.06), 0px 1px 3px 0px rgba(15, 22, 36, 0.10)",
        e1: "0 1px 2px rgb(11 18 32 / .06), 0 2px 8px rgb(11 18 32 / .04)",
        e2: "0 8px 24px -6px rgb(11 18 32 / .12)",
        e3: "0 24px 64px -16px rgb(11 18 32 / .22)",
        glow: "0 12px 32px -8px rgb(37 99 235 / .45)",
        night: "0 0 0 1px rgb(255 255 255 / .06), 0 30px 80px -20px rgb(0 0 0 / .6)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "rs-sm": "8px",
        "rs-md": "14px",
        "rs-lg": "24px",
        "rs-xl": "40px",
      },
      transitionTimingFunction: {
        "rs-out": "cubic-bezier(0.16, 1, 0.3, 1)",
        "rs-in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
        "rs-standard": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      maxWidth: {
        "rs-content": "1200px",
        "rs-wide": "1360px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "flow-dash": {
          to: { strokeDashoffset: "-16" },
        },
        slideDownAndFade: {
          from: { opacity: "0", transform: "translateY(-2px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideLeftAndFade: {
          from: { opacity: "0", transform: "translateX(2px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideUpAndFade: {
          from: { opacity: "0", transform: "translateY(2px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideRightAndFade: {
          from: { opacity: "0", transform: "translateX(-2px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "flow-dash": "flow-dash 0.8s linear infinite",
        slideDownAndFade:
          "slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideLeftAndFade:
          "slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideUpAndFade: "slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideRightAndFade:
          "slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Gerak hanya bila sistem operasi tidak meminta reduced-motion.
    plugin(({ addVariant }) => {
      addVariant("motion-ok", "@media (prefers-reduced-motion: no-preference)");
      addVariant("motion-off", "@media (prefers-reduced-motion: reduce)");
    }),
  ],
} satisfies Config
export default config