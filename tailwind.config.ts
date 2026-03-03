import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#ffffff",
                card: "#f8fafc",
                primary: "#D51B2E",  // Exact red from logo
                secondary: "#f1f5f9",
                accent: "#6366f1",
                textMain: "#162235", // Exact navy from logo text
                textMuted: "#64748b",
            },
            fontFamily: {
                inter: ["var(--font-inter)", "sans-serif"],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-mesh": "radial-gradient(at 40% 20%, hsla(228, 60%, 12%, 1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(350, 80%, 30%, 0.15) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(231, 60%, 15%, 1) 0px, transparent 50%)",
            },
            animation: {
                "float": "float 8s ease-in-out infinite",
                "float-slow": "float 12s ease-in-out infinite",
                "float-slower": "float 16s ease-in-out infinite",
                "pulse-glow": "pulse-glow 3s ease-in-out infinite",
                "shimmer": "shimmer 3s ease-in-out infinite",
                "gradient-shift": "gradient-shift 6s ease infinite",
                "orb-1": "orb-float-1 20s ease-in-out infinite",
                "orb-2": "orb-float-2 25s ease-in-out infinite",
                "orb-3": "orb-float-3 22s ease-in-out infinite",
            },
        },
    },
    plugins: [],
};
export default config;
