"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface CounterAnimationProps {
    target: number;
    suffix?: string;
    prefix?: string;
    label: string;
    duration?: number;
}

export function CounterAnimation({
    target,
    suffix = "",
    prefix = "",
    label,
    duration = 2,
}: CounterAnimationProps) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!isInView || hasAnimated.current) return;
        hasAnimated.current = true;

        const startTime = Date.now();
        const durationMs = duration * 1000;

        const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / durationMs, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                setCount(target);
            }
        };
        requestAnimationFrame(tick);
    }, [isInView, target, duration]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-2"
        >
            <div className="text-4xl md:text-5xl font-bold text-textMain">
                {prefix}
                <span className="text-gradient-brand">{count}</span>
                {suffix}
            </div>
            <div className="text-sm text-textMuted uppercase tracking-wider">{label}</div>
        </motion.div>
    );
}
