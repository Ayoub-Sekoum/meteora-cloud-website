"use client";

import { useLocale, useTranslations } from "next-intl";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { AnimateIn } from "@/components/AnimateIn";
import { AnimatedText } from "@/components/AnimatedText";

export default function SecurityAudit() {
    const locale = useLocale();
    const t = useTranslations();

    return (
        <main className="min-h-screen flex flex-col items-center pt-32 pb-24 px-4 md:px-8 overflow-hidden bg-white text-gray-900">
            <div className="w-full max-w-4xl mx-auto space-y-12 relative z-10">

                <AnimateIn delay={0.1}>
                    <Link href={`/${locale}`} className="text-indigo-500 hover:underline text-sm flex items-center gap-2 w-fit">
                        &larr; {t("Common.backHome")}
                    </Link>
                </AnimateIn>

                <div className="space-y-6">
                    <AnimateIn delay={0.2} direction="right">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-indigo-500 font-medium">
                            <Shield className="w-5 h-5" /> {t("SecurityPage.badge")}
                        </div>
                    </AnimateIn>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                        <div className="flex flex-col">
                            <AnimatedText text={t("SecurityPage.title")} delay={0.3} stagger={0.03} />
                        </div>
                    </h1>

                    <AnimateIn delay={0.8}>
                        <p className="text-xl text-gray-500 max-w-2xl leading-relaxed font-light">
                            {t("SecurityPage.intro")}
                        </p>
                    </AnimateIn>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                    <AnimateIn delay={1.0}>
                        <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-8 md:p-12 space-y-6 relative overflow-hidden transition-shadow hover:shadow-xl hover:border-red-500/20 h-full group">
                            <div className="relative z-10 space-y-4">
                                <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-red-500 transition-colors">{t("SecurityPage.vaTitle")}</h3>
                                <p className="text-gray-500 font-light leading-relaxed">{t("SecurityPage.vaDesc")}</p>
                            </div>
                        </div>
                    </AnimateIn>

                    <AnimateIn delay={1.2}>
                        <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-8 md:p-12 space-y-6 relative overflow-hidden transition-shadow hover:shadow-xl hover:border-indigo-500/20 h-full group">
                            <div className="relative z-10 space-y-4">
                                <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-indigo-500 transition-colors">{t("SecurityPage.complianceTitle")}</h3>
                                <p className="text-gray-500 font-light leading-relaxed">{t("SecurityPage.complianceDesc")}</p>
                            </div>
                        </div>
                    </AnimateIn>
                </div>

                <AnimateIn delay={1.4} scale>
                    <div className="mt-16 bg-gradient-to-br from-indigo-50 to-gray-50 border border-indigo-100 rounded-[2.5rem] p-8 md:p-12 text-center space-y-6 shadow-sm">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t("SecurityPage.ctaTitle")}</h2>
                        <p className="text-gray-500 max-w-xl mx-auto font-light text-lg">{t("SecurityPage.ctaDesc")}</p>
                        <Link href={`/${locale}#contatti`} className="inline-block">
                            <Button variant="primary" size="lg" className="mt-6 rounded-full px-8 hover:scale-105 transition-transform shadow-lg shadow-indigo-500/20">{t("SecurityPage.ctaButton")}</Button>
                        </Link>
                    </div>
                </AnimateIn>
            </div>
        </main>
    );
}
