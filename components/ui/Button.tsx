import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
}

export function Button({
    className = "",
    variant = "primary",
    size = "md",
    ...props
}: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-primary text-background hover:bg-primary/90 shadow-[0_0_20px_rgba(0,240,255,0.3)]",
        secondary: "bg-secondary text-background hover:bg-secondary/90 shadow-[0_0_20px_rgba(0,255,157,0.3)]",
        outline: "border border-primary text-primary hover:bg-primary/10",
        ghost: "hover:bg-white/5 text-textMain",
    };

    const sizes = {
        sm: "h-9 px-4 text-sm",
        md: "h-12 px-6 text-base",
        lg: "h-14 px-8 text-lg",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        />
    );
}
