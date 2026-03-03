"use client";

interface GradientOrbProps {
    className?: string;
    color?: "primary" | "accent" | "mixed";
    size?: "sm" | "md" | "lg" | "xl";
    animation?: "orb-1" | "orb-2" | "orb-3";
}

const colorMap = {
    primary: "from-primary/20 via-primary/5 to-transparent",
    accent: "from-accent/20 via-accent/5 to-transparent",
    mixed: "from-primary/15 via-accent/10 to-transparent",
};

const sizeMap = {
    sm: "w-48 h-48",
    md: "w-72 h-72",
    lg: "w-96 h-96",
    xl: "w-[500px] h-[500px]",
};

const animMap = {
    "orb-1": "animate-orb-1",
    "orb-2": "animate-orb-2",
    "orb-3": "animate-orb-3",
};

export function GradientOrb({
    className = "",
    color = "primary",
    size = "lg",
    animation = "orb-1",
}: GradientOrbProps) {
    return (
        <div
            className={`absolute rounded-full bg-gradient-radial ${colorMap[color]} ${sizeMap[size]} ${animMap[animation]} blur-3xl pointer-events-none ${className}`}
            aria-hidden="true"
        />
    );
}
