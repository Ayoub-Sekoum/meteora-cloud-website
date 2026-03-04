"use client";

import { useLocale, useTranslations } from "next-intl";
import { Code2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { AnimateIn } from "@/components/AnimateIn";
import { AnimatedText } from "@/components/AnimatedText";

export default function DevOps() {
    const locale = useLocale();
    const t = useTranslations();

    return (
        <main className="min-h-screen flex flex-col items-center pt-32 pb-24 px-4 md:px-8 overflow-hidden bg-white text-gray-900">
            <div className="w-full max-w-4xl mx-auto space-y-12 relative z-10">

                <AnimateIn delay={0.1}>
                    <Link href={`/${locale}`} className="text-orange-500 hover:underline text-sm flex items-center gap-2 w-fit">
                        &larr; {t("Common.backHome")}
                    </Link>
                </AnimateIn>

                <div className="space-y-6">
                    <AnimateIn delay={0.2} direction="right">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-orange-500 font-medium">
                            <Code2 className="w-5 h-5" /> {t("DevOpsPage.badge")}
                        </div>
                    </AnimateIn>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                        <div className="flex flex-col">
                            <AnimatedText text={t("DevOpsPage.title")} delay={0.3} stagger={0.03} />
                        </div>
                    </h1>

                    <AnimateIn delay={0.8}>
                        <p className="text-xl text-gray-500 max-w-2xl leading-relaxed font-light">
                            {t("DevOpsPage.intro")}
                        </p>
                    </AnimateIn>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                    <AnimateIn delay={1.0}>
                        <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-8 md:p-12 space-y-6 relative overflow-hidden transition-shadow hover:shadow-xl hover:border-indigo-500/20 h-full group">
                            <div className="relative z-10 space-y-4">
                                <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-indigo-500 transition-colors">{t("DevOpsPage.cicdTitle")}</h3>
                                <p className="text-gray-500 font-light leading-relaxed">{t("DevOpsPage.cicdDesc")}</p>
                            </div>
                        </div>
                    </AnimateIn>

                    <AnimateIn delay={1.2}>
                        <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-8 md:p-12 space-y-6 relative overflow-hidden transition-shadow hover:shadow-xl hover:border-orange-500/20 h-full group">
                            <div className="relative z-10 space-y-4">
                                <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-orange-500 transition-colors">{t("DevOpsPage.serverlessTitle")}</h3>
                                <p className="text-gray-500 font-light leading-relaxed">{t("DevOpsPage.serverlessDesc")}</p>
                            </div>
                        </div>
                    </AnimateIn>
                </div>

                <AnimateIn delay={1.4} scale>
                    <div className="mt-16 bg-gradient-to-br from-orange-50 to-gray-50 border border-orange-100 rounded-[2.5rem] p-8 md:p-12 text-center space-y-6 shadow-sm">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t("DevOpsPage.ctaTitle")}</h2>
                        <p className="text-gray-500 max-w-xl mx-auto font-light text-lg">{t("DevOpsPage.ctaDesc")}</p>
                        <Link href={`/${locale}#contatti`} className="inline-block">
                            <Button variant="primary" size="lg" className="mt-6 rounded-full px-8 hover:scale-105 transition-transform shadow-lg shadow-orange-500/20">{t("DevOpsPage.ctaButton")}</Button>
                        </Link>
                    </div>
                </AnimateIn>
            </div>
        </main>
    );
}
