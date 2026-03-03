"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Cloud, Shield, LineChart, Code2, Mail } from "lucide-react";

export function Footer() {
    const locale = useLocale();
    const t = useTranslations();
    const year = new Date().getFullYear();

    return (
        <footer className="relative w-full border-t border-gray-200 bg-white">
            {/* Top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />

            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <img src="/logo.png" alt="Meteora Logo" className="h-6 w-auto object-contain opacity-80" />
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            {t("Footer.description")}
                        </p>
                    </div>

                    {/* Services */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">{t("Footer.servicesTitle")}</h4>
                        <nav className="flex flex-col gap-2">
                            <Link href={`/${locale}/architettura-cloud`} className="text-gray-500 hover:text-red-600 transition-colors text-sm flex items-center gap-2">
                                <Cloud className="w-3.5 h-3.5" /> Cloud Architecture
                            </Link>
                            <Link href={`/${locale}/security-audit`} className="text-gray-500 hover:text-red-600 transition-colors text-sm flex items-center gap-2">
                                <Shield className="w-3.5 h-3.5" /> Security Audit
                            </Link>
                            <Link href={`/${locale}/finops`} className="text-gray-500 hover:text-red-600 transition-colors text-sm flex items-center gap-2">
                                <LineChart className="w-3.5 h-3.5" /> FinOps
                            </Link>
                            <Link href={`/${locale}/devops`} className="text-gray-500 hover:text-red-600 transition-colors text-sm flex items-center gap-2">
                                <Code2 className="w-3.5 h-3.5" /> DevOps & Serverless
                            </Link>
                        </nav>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">{t("Footer.contactTitle")}</h4>
                        <Link
                            href={`/${locale}#contatti`}
                            className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                        >
                            <Mail className="w-3.5 h-3.5" /> {t("Footer.requestConsultation")}
                        </Link>
                        <a
                            href="https://github.com/Ayoub-Sekoum"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                            GitHub
                        </a>
                        <a
                            href="https://www.linkedin.com/in/ayoub-sekoum-023302200/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                            LinkedIn
                        </a>
                        <p className="text-gray-400 text-xs">
                            {t("Footer.responseTime")}
                        </p>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-xs">
                        © {year} Meteora Cloud. {t("Footer.rights")}
                    </p>
                    <div className="flex items-center gap-4 text-gray-400 text-xs">
                        <span>P.IVA: XXXXXXXXXXX</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span>{t("Footer.privacy")}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
