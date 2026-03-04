"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

interface AnimateInProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
    scale?: boolean;
}

export function AnimateIn({
    children,
    className = "",
    delay = 0,
    duration = 0.6,
    direction = "up",
    scale = false,
}: AnimateInProps) {
    const shouldReduceMotion = useReducedMotion();

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const directions = {
        up: { y: 40, x: 0 },
        down: { y: -40, x: 0 },
        left: { x: 40, y: 0 },
        right: { x: -40, y: 0 },
        none: { x: 0, y: 0 },
    };

    const initial = {
        opacity: shouldReduceMotion ? 1 : 0,
        ...(shouldReduceMotion ? { y: 0, x: 0 } : directions[direction]),
        ...((scale && !shouldReduceMotion) && { scale: 0.95 }),
        ...((scale && shouldReduceMotion) && { scale: 1 }),
    };

    const animate = {
        opacity: 1,
        y: 0,
        x: 0,
        ...(scale && { scale: 1 }),
    };

    interface TransitionProps {
        duration: number;
        delay: number;
        ease: number[];
        scale?: {
            type: string;
            stiffness: number;
            damping: number;
        };
    }

    const transition: TransitionProps = {
        duration: shouldReduceMotion ? 0 : duration,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.25, 0.1, 0.25, 1], // Custom ease-out
    };

    // Add extra spring to scale
    if (scale) {
        transition.scale = {
            type: "spring",
            stiffness: 100,
            damping: 15,
        };
    }

    if (!isMounted) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            initial={initial}
            whileInView={animate}
            viewport={{ once: true, margin: "-100px" }}
            transition={transition}
            className={className}
        >
            {children}
        </motion.div>
    );
}
