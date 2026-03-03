"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

interface AnimatedSectionProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "down" | "left" | "right";
}

export function AnimatedSection({
    children,
    className = "",
    delay = 0,
    direction = "up",
}: AnimatedSectionProps) {
    const directionOffset = {
        up: { x: 0, y: 40 },
        down: { x: 0, y: -40 },
        left: { x: 40, y: 0 },
        right: { x: -40, y: 0 },
    };

    const variants: Variants = {
        hidden: {
            opacity: 0,
            x: directionOffset[direction].x,
            y: directionOffset[direction].y,
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                duration: 0.7,
                delay,
                ease: [0.25, 0.4, 0.25, 1],
            },
        },
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
}
