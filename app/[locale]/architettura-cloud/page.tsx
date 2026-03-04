"use client";

import { useLocale } from "next-intl";
import { Server } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { AnimateIn } from "@/components/AnimateIn";
import { AnimatedText } from "@/components/AnimatedText";
import { useTranslations } from "next-intl"; // Added this import as it was in the original and used in the new code

export default function ArchitetturaCloud() {
    const locale = useLocale();
    const t = useTranslations(); // Added this line as it was in the original and used in the new code

    return (
        <main className="min-h-screen flex flex-col items-center pt-32 pb-24 px-4 md:px-8 overflow-hidden bg-white text-gray-900">
            <div className="w-full max-w-4xl mx-auto space-y-12 relative z-10">

                <AnimateIn delay={0.1}>
                    <Link href={`/${locale}`} className="text-red-600 hover:underline text-sm flex items-center gap-2 w-fit">
                        &larr; {t("Common.backHome")}
                    </Link>
                </AnimateIn>

                <div className="space-y-6">
                    <AnimateIn delay={0.2} direction="right">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-red-600 font-medium">
                            <Server className="w-5 h-5" /> {t("CloudPage.badge")}
                        </div>
                    </AnimateIn>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                        <div className="flex flex-col">
                            <AnimatedText text={t("CloudPage.titlePart1")} delay={0.3} stagger={0.03} />
                            <AnimatedText text={t("CloudPage.titlePart2")} delay={0.6} stagger={0.03} className="text-red-600" />
                        </div>
                    </h1>
                    <AnimateIn delay={1.0}>
                        <p className="text-xl text-gray-500 max-w-2xl leading-relaxed font-light">
                            {t("CloudPage.intro")}
                        </p>
                    </AnimateIn>
                </div>

                <div className="grid grid-cols-1 gap-8 pt-8">
                    <AnimateIn delay={1.2}>
                        <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-8 md:p-12 space-y-6 relative overflow-hidden transition-shadow hover:shadow-xl">
                            <div className="relative z-10 w-full md:w-2/3 space-y-4">
                                <h3 className="text-3xl font-semibold text-gray-900">{t("CloudPage.awsTitle")}</h3>
                                <p className="text-gray-500 font-light leading-relaxed">{t("CloudPage.awsDesc")}</p>
                            </div>
                        </div>
                    </AnimateIn>

                    <AnimateIn delay={1.4}>
                        <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-8 md:p-12 space-y-6 relative overflow-hidden transition-shadow hover:shadow-xl">
                            <div className="relative z-10 w-full md:w-2/3 space-y-4">
                                <h3 className="text-3xl font-semibold text-gray-900">{t("CloudPage.azureTitle")}</h3>
                                <p className="text-gray-500 font-light leading-relaxed">{t("CloudPage.azureDesc")}</p>
                            </div>
                        </div>
                    </AnimateIn>
                </div>

                <AnimateIn delay={1.6}>
                    <div className="bg-gradient-to-r from-gray-50 to-white border border-red-500/20 rounded-3xl p-8 md:p-12 space-y-6 relative overflow-hidden shadow-sm">
                        <div className="relative z-10 w-full space-y-4 items-center">
                            <h3 className="text-3xl font-semibold text-gray-900 flex items-center gap-3">
                                <Server className="text-red-500 w-8 h-8" /> {t("CloudPage.migrationTitle")}
                            </h3>
                            <p className="text-gray-500 text-lg leading-relaxed font-light">{t("CloudPage.migrationDesc")}</p>
                        </div>
                    </div>
                </AnimateIn>

                <AnimateIn delay={1.8} scale>
                    <div className="mt-16 bg-gradient-to-br from-red-50 to-gray-50 border border-red-100 rounded-[2.5rem] p-8 md:p-12 text-center space-y-6 shadow-sm">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t("CloudPage.ctaTitle")}</h2>
                        <p className="text-gray-500 max-w-xl mx-auto font-light text-lg">{t("CloudPage.ctaDesc")}</p>
                        <Link href={`/${locale}#contatti`} className="inline-block">
                            <Button variant="primary" size="lg" className="mt-6 rounded-full px-8 hover:scale-105 transition-transform shadow-lg shadow-red-500/20">{t("CloudPage.ctaButton")}</Button>
                        </Link>
                    </div>
                </AnimateIn>

            </div>
        </main>
    );
}
