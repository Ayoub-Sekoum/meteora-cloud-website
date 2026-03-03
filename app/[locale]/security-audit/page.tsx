"use client";

import { Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { AnimatedText } from "@/components/ui/AnimatedText";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function SecurityAudit() {
    const locale = useLocale();
    const t = useTranslations();

    return (
        <main className="min-h-screen flex flex-col items-center pt-32 pb-24 px-4 md:px-8 overflow-hidden bg-white text-gray-900">
            <div className="w-full max-w-4xl mx-auto space-y-12 relative">

                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                    <Link href={`/${locale}`} className="text-red-600 hover:underline text-sm flex items-center gap-2">
                        &larr; {t("Common.backHome")}
                    </Link>
                </motion.div>

                <div className="space-y-6">
                    <AnimatedSection>
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-red-600 font-medium">
                            <Shield className="w-5 h-5" /> {t("SecurityPage.badge")}
                        </div>
                    </AnimatedSection>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                        <AnimatedText text={t("SecurityPage.title")} delay={0.1} />
                    </h1>

                    <AnimatedSection delay={0.3}>
                        <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
                            {t("SecurityPage.intro")}
                        </p>
                    </AnimatedSection>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                    <AnimatedSection delay={0.1}>
                        <div className="bg-white border border-gray-100 rounded-2xl p-8 space-y-4 h-full group hover:border-red-500/20 transition-all duration-500 relative overflow-hidden shadow-sm">
                            <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-red-600 transition-colors">{t("SecurityPage.vaTitle")}</h3>
                            <p className="text-gray-500">{t("SecurityPage.vaDesc")}</p>
                            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-red-500/0 group-hover:bg-red-500/5 rounded-full blur-2xl transition-all duration-700" />
                        </div>
                    </AnimatedSection>
                    <AnimatedSection delay={0.2}>
                        <div className="bg-white border border-gray-100 rounded-2xl p-8 space-y-4 h-full group hover:border-indigo-500/20 transition-all duration-500 relative overflow-hidden shadow-sm">
                            <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-indigo-500 transition-colors">{t("SecurityPage.complianceTitle")}</h3>
                            <p className="text-gray-500">{t("SecurityPage.complianceDesc")}</p>
                            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-indigo-500/0 group-hover:bg-indigo-500/5 rounded-full blur-2xl transition-all duration-700" />
                        </div>
                    </AnimatedSection>
                </div>

                <AnimatedSection delay={0.1}>
                    <div className="mt-16 bg-gradient-to-br from-red-50 to-gray-50 border border-red-200/50 rounded-3xl p-8 text-center space-y-6 relative overflow-hidden shadow-sm">
                        <h2 className="text-3xl font-bold text-gray-900 relative z-10">{t("SecurityPage.ctaTitle")}</h2>
                        <p className="text-gray-500 max-w-xl mx-auto relative z-10">{t("SecurityPage.ctaDesc")}</p>
                        <Link href={`/${locale}#contatti`} className="relative z-10 inline-block">
                            <Button variant="primary" size="lg" className="mt-4">{t("SecurityPage.ctaButton")}</Button>
                        </Link>
                    </div>
                </AnimatedSection>
            </div>
        </main>
    );
}
