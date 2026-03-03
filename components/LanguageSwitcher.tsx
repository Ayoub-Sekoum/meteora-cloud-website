"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

const languages = [
    { code: "it", label: "Italiano", flag: "🇮🇹" },
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "de", label: "Deutsch", flag: "🇩🇪" },
];

export function LanguageSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();
    const currentLang = languages.find(l => l.code === locale) || languages[0];
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function selectLanguage(code: string) {
        setIsOpen(false);
        if (code === locale) return;

        startTransition(() => {
            const newPath = pathname.replace(`/${locale}`, `/${code}`);
            router.replace(newPath);
        });
    }

    return (
        <div className="relative inline-block text-left z-50" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                disabled={isPending}
                className={`inline-flex items-center justify-between gap-2 w-32 px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full border bg-white text-textMain shadow-sm hover:shadow-md ${isOpen ? 'border-primary shadow-primary/10' : 'border-gray-200 hover:border-gray-300'}`}
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-2">
                    <span>{currentLang.flag}</span>
                    <span className="uppercase tracking-wider text-xs font-bold">{currentLang.code}</span>
                </div>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-2 w-40 origin-top-right rounded-2xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden"
                    >
                        <div className="py-1">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => selectLanguage(lang.code)}
                                    className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between transition-colors ${locale === lang.code ? "bg-primary/5 text-primary font-semibold" : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-base">{lang.flag}</span>
                                        <span>{lang.label}</span>
                                    </div>
                                    {locale === lang.code && <Check className="w-4 h-4 text-primary" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
