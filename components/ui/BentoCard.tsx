"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { type MouseEvent as ReactMouseEvent } from "react";

export function BentoCard({
    className,
    title,
    icon,
    children,
    href,
    index = 0,
}: {
    className?: string;
    title?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    href?: string;
    index?: number;
}) {
    const locale = useLocale();
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove(e: ReactMouseEvent<HTMLDivElement>) {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    }

    const background = useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, rgba(222, 20, 47, 0.08), transparent 80%)`;

    const CardContent = (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
            onMouseMove={handleMouseMove}
            className={`group relative overflow-hidden rounded-2xl bg-card p-6 md:p-8 shadow-lg border border-black/5 hover:border-primary/40 transition-all duration-500 ${className || ""} ${href ? "cursor-pointer" : ""}`}
            whileHover={{ y: -4, transition: { duration: 0.3 } }}
        >
            {/* Mouse tracking glow */}
            <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background }}
            />

            <div className="flex flex-col h-full z-10 relative">
                <div className="flex justify-between items-start mb-4">
                    {icon && (
                        <div className="text-primary group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(222,20,47,0.5)] transition-all duration-300">
                            {icon}
                        </div>
                    )}
                    {href && (
                        <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(222,20,47,0.4)] transition-all duration-300 text-textMuted group-hover:text-white">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 11L11 1M11 1H3.5M11 1V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                    )}
                </div>
                {title && (
                    <h3 className="text-2xl font-semibold text-textMain mb-2 group-hover:text-primary transition-colors duration-300">{title}</h3>
                )}
                <div className="text-textMuted text-sm md:text-base flex-grow">
                    {children}
                </div>
            </div>

            {/* Corner glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/0 group-hover:bg-primary/10 rounded-full blur-3xl pointer-events-none transition-all duration-700" />
            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/0 group-hover:via-primary/50 to-transparent transition-all duration-700" />
        </motion.div>
    );

    if (href) {
        return (
            <Link href={`/${locale}${href}`} className="block h-full" style={{ gridColumn: className?.includes('col-span-2') ? 'span 2 / span 2' : 'auto' }}>
                {CardContent}
            </Link>
        );
    }

    return CardContent;
}
