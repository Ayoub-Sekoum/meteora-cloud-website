"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedTextProps {
    text: string;
    className?: string;
    el?: keyof JSX.IntrinsicElements;
    delay?: number;
    stagger?: number;
}

export function AnimatedText({
    text,
    className = "",
    el: Wrapper = "p",
    delay = 0,
    stagger = 0.03,
}: AnimatedTextProps) {
    const shouldReduceMotion = useReducedMotion();
    const Component = Wrapper as any;
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const defaultAnimations = {
        hidden: {
            opacity: shouldReduceMotion ? 1 : 0,
            y: shouldReduceMotion ? 0 : 20,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: shouldReduceMotion ? 0 : 0.5,
                ease: [0.25, 0.1, 0.25, 1]
            },
        },
    };

    if (!isMounted) {
        return (
            <Component className={className}>
                <span className="sr-only">{text}</span>
            </Component>
        );
    }

    return (
        <Component className={className}>
            <span className="sr-only">{text}</span>
            <motion.span
                initial="hidden"
                animate="visible"
                aria-hidden
                variants={{
                    visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : stagger, delayChildren: shouldReduceMotion ? 0 : delay } },
                    hidden: {},
                }}
            >
                {text.split(" ").map((word, wordIndex) => (
                    <span className="inline-block" key={`${word}-${wordIndex}`}>
                        {word.split("").map((char, charIndex) => (
                            <motion.span
                                key={`${char}-${charIndex}`}
                                className="inline-block"
                                variants={defaultAnimations}
                            >
                                {char}
                            </motion.span>
                        ))}
                        <span className="inline-block">&nbsp;</span>
                    </span>
                ))}
            </motion.span>
        </Component>
    );
}
