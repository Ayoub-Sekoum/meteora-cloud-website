"use client";

import { motion } from "framer-motion";

interface AnimatedTextProps {
    text: string;
    className?: string;
    delay?: number;
}

export function AnimatedText({ text, className = "", delay = 0 }: AnimatedTextProps) {
    const words = text.split(" ");

    return (
        <motion.span
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={className}
        >
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    className="inline-block mr-[0.3em]"
                    variants={{
                        hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
                        visible: {
                            opacity: 1,
                            y: 0,
                            filter: "blur(0px)",
                            transition: {
                                duration: 0.5,
                                delay: delay + i * 0.08,
                                ease: [0.25, 0.4, 0.25, 1],
                            },
                        },
                    }}
                >
                    {word}
                </motion.span>
            ))}
        </motion.span>
    );
}
