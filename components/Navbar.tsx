"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Cloud, Shield, LineChart, Code2, Mail, Menu, X } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";

const navItems = [
    { href: "/architettura-cloud", label: "Cloud", icon: Cloud },
    { href: "/security-audit", label: "Security", icon: Shield },
    { href: "/finops", label: "FinOps", icon: LineChart },
    { href: "/devops", label: "DevOps", icon: Code2 },
];

export function Navbar() {
    const locale = useLocale();
    const t = useTranslations();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 30);
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    return (
        <>
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled
                    ? "bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm"
                    : "bg-transparent"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center h-16 md:h-20">
                    {/* Logo */}
                    <Link href={`/${locale}`} className="flex items-center gap-2 group">
                        <img
                            src="/logo.png"
                            alt="Meteora Logo"
                            className="h-8 md:h-10 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300"
                        />
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = pathname.includes(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={`/${locale}${item.href}`}
                                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 flex items-center gap-2 ${isActive ? "text-primary bg-primary/5" : "text-gray-600 hover:text-textMain hover:bg-gray-50"
                                        }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-active"
                                            className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/20"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                        <div className="ml-6 flex items-center gap-4 border-l border-gray-200 pl-6">
                            <LanguageSwitcher />
                            <Link
                                href={`/${locale}#contatti`}
                                className="px-6 py-2.5 bg-textMain text-white text-sm font-medium rounded-full hover:bg-black hover:scale-105 transition-all duration-300 shadow-md flex items-center gap-2"
                            >
                                <Mail className="w-4 h-4" />
                                {t("Nav.contact")}
                            </Link>
                        </div>
                    </nav>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 text-textMain"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </motion.header>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 top-16 z-40 bg-white/95 backdrop-blur-xl md:hidden"
                    >
                        <nav className="flex flex-col p-6 gap-2">
                            {navItems.map((item) => {
                                const isActive = pathname.includes(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={`/${locale}${item.href}`}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium transition-colors ${isActive ? "text-primary bg-primary/10" : "text-textMuted hover:text-textMain hover:bg-black/5"
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                            <div className="mt-4 flex flex-col gap-4">
                                <LanguageSwitcher />
                                <Link
                                    href={`/${locale}#contatti`}
                                    className="w-full px-4 py-3 bg-primary text-white text-lg font-medium rounded-xl text-center flex items-center justify-center gap-2"
                                >
                                    <Mail className="w-5 h-5" />
                                    {t("Nav.contact")}
                                </Link>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
