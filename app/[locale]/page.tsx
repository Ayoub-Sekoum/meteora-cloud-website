"use client";

import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Server, Shield, LineChart, Code2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRef } from "react";

/* ── Mask‑reveal line ─────────────────────────────── */
function RevealText({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    return (
        <span className="relative inline-block overflow-hidden pb-2">
            <motion.span
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay, ease: [0.25, 1, 0.5, 1] }}
                className="inline-block origin-bottom"
            >
                {children}
            </motion.span>
        </span>
    );
}

/* ── Scroll‑aware fade‑in ─────────────────────────── */
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay, ease: [0.25, 1, 0.5, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/* ═════════════════════════════════════════════════════
   HOME PAGE
   ═════════════════════════════════════════════════════ */
export default function Home() {
    const t = useTranslations();
    const locale = useLocale();

    /* Parallax refs */
    const heroRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const logoOpacity = useTransform(scrollYProgress, [0, 0.5], [0.06, 0]); // dissolve
    const logoScale = useTransform(scrollYProgress, [0, 0.6], [1, 1.15]);

    /* Service cards – titles stay in English, descriptions are translated */
    const services = [
        { titleKey: "Services.cloud_title", descKey: "Services.cloud_desc", icon: Server, href: "/architettura-cloud", color: "text-red-600 hover:bg-red-600", bgHover: "hover:border-red-500/40" },
        { titleKey: "Services.security_title", descKey: "Services.security_desc", icon: Shield, href: "/security-audit", color: "text-indigo-500 hover:bg-indigo-500", bgHover: "hover:border-indigo-500/40" },
        { titleKey: "Services.finops_title", descKey: "Services.finops_desc", icon: LineChart, href: "/finops", color: "text-emerald-500 hover:bg-emerald-500", bgHover: "hover:border-emerald-500/40" },
        { titleKey: "Services.devops_title", descKey: "Services.devops_desc", icon: Code2, href: "/devops", color: "text-orange-500 hover:bg-orange-500", bgHover: "hover:border-orange-500/40" },
    ];

    return (
        <main className="flex flex-col items-center bg-white min-h-screen text-gray-900 selection:bg-red-500/20 selection:text-red-600 overflow-hidden">

            {/* ═══ HERO ═══════════════════════════════════ */}
            <section ref={heroRef} className="relative w-full min-h-[95vh] flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-24 pb-12 border-b border-gray-200 overflow-hidden">

                {/* Triangle logo – large, centered, translucent, dissolves on scroll */}
                <motion.div
                    style={{ opacity: logoOpacity, scale: logoScale }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
                >
                    <Image
                        src="/logo-triangolo.png"
                        alt=""
                        width={700}
                        height={700}
                        className="w-[50vw] max-w-[700px] h-auto object-contain select-none"
                        priority
                    />
                </motion.div>

                {/* Content (sits above the logo) */}
                <motion.div style={{ y: heroY, opacity: heroOpacity }} className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full z-10">

                    {/* Badge */}
                    <FadeIn delay={0.1}>
                        <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-sm font-medium text-gray-600 uppercase tracking-widest shadow-sm w-fit">
                            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                            {t("Hero.badge")}
                        </div>
                    </FadeIn>

                    {/* Big title */}
                    <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[7rem] font-bold tracking-tight leading-[0.95] text-gray-900 max-w-6xl mt-4">
                        <div className="flex flex-col overflow-hidden">
                            <RevealText delay={0.2}>{t("Hero.title1")}</RevealText>
                            <RevealText delay={0.3}>{t("Hero.title2")} <span className="text-gray-300">{t("Hero.title2b")}</span></RevealText>
                            <RevealText delay={0.4}><span className="text-red-600 tracking-tighter">{t("Hero.title3")}</span></RevealText>
                        </div>
                    </h1>

                    <FadeIn delay={0.5} className="mt-6">
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-500 max-w-3xl font-light leading-snug">
                            {t("Hero.subtitle")}
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.6} className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <Link href={`/${locale}#contatti`}>
                            <Button variant="primary" size="lg" className="rounded-full px-8 py-6 text-base sm:text-lg group shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-out">
                                {t("Hero.cta")}
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 pl-0 sm:pl-6 sm:border-l border-gray-200">
                            {[
                                { name: "AWS", icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.064.056.128.056.184 0 .08-.048.16-.152.24l-.503.335a.383.383 0 01-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 01-.287-.375 6.18 6.18 0 01-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.895-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.602.104.926.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.368-1.3-.368-.28 0-.567.032-.863.104a6.374 6.374 0 00-.862.288 2.287 2.287 0 01-.28.104.488.488 0 01-.127.024c-.112 0-.168-.08-.168-.248v-.391c0-.128.016-.224.056-.28a.597.597 0 01.224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 011.246-.152c.95 0 1.644.216 2.091.648.44.432.662 1.085.662 1.963v2.586zM3.26 11.19c.263 0 .534-.048.822-.144.287-.096.543-.272.758-.52.128-.152.224-.32.272-.512.048-.191.08-.423.08-.694v-.335a6.66 6.66 0 00-.735-.136 6.02 6.02 0 00-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296z" fill="#FF9900" /><path d="M13.23 11.727c-.143 0-.24-.024-.303-.08-.064-.048-.12-.16-.168-.311l-1.876-6.171a1.394 1.394 0 01-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.303.08.064.048.112.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.152-.312a.549.549 0 01.31-.08h.638c.152 0 .256.025.311.08.064.048.12.16.152.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312.064-.048.167-.08.303-.08h.743c.128 0 .2.064.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 01-.063.2l-1.924 6.17c-.048.16-.104.264-.168.312a.549.549 0 01-.303.08h-.687c-.151 0-.255-.024-.31-.08-.064-.056-.12-.16-.152-.32l-1.238-5.148-1.23 5.14c-.04.168-.088.272-.152.328-.064.056-.175.08-.311.08h-.687z" fill="#FF9900" /><path d="M21.612 12.3c-.422 0-.846-.048-1.261-.152-.415-.096-.742-.2-.974-.32-.143-.08-.24-.168-.271-.248a.623.623 0 01-.048-.232v-.407c0-.168.064-.248.183-.248.048 0 .096.008.144.024.048.016.12.056.2.096.271.128.567.232.886.304.327.072.646.104.974.104.511 0 .91-.088 1.19-.272.279-.184.423-.448.423-.8a.896.896 0 00-.24-.63c-.16-.176-.462-.328-.902-.472l-1.293-.408c-.654-.208-1.14-.52-1.445-.928a2.17 2.17 0 01-.455-1.317c0-.383.08-.72.247-1.005.168-.288.391-.536.678-.736.288-.2.614-.352.99-.448A4.292 4.292 0 0121.62 4.4c.215 0 .439.016.67.04.224.032.431.072.63.12.192.056.375.112.535.176.16.064.28.128.36.192a.77.77 0 01.207.2.486.486 0 01.064.264v.375c0 .168-.064.256-.183.256a.837.837 0 01-.303-.112 3.648 3.648 0 00-1.532-.32c-.463 0-.83.072-1.093.224-.263.152-.399.384-.399.712 0 .272.096.504.287.688.192.184.55.368 1.062.536l1.261.4c.646.208 1.117.496 1.405.864.287.368.423.791.423 1.261 0 .391-.08.744-.239 1.049-.167.304-.391.567-.678.791-.287.224-.63.392-1.037.504a4.68 4.68 0 01-1.349.184z" fill="#FF9900" /><path d="M20.15 16.613c-2.87 2.122-7.033 3.25-10.612 3.25-5.022 0-9.543-1.86-12.962-4.945-.268-.243-.028-.575.294-.386 3.692 2.146 8.258 3.44 12.975 3.44 3.181 0 6.68-.659 9.9-2.023.486-.208.893.319.406.664z" fill="#FF9900" /><path d="M21.3 15.283c-.366-.468-2.42-.221-3.343-.112-.28.032-.323-.21-.07-.39 1.636-1.148 4.32-.817 4.634-.433.315.392-.083 3.098-1.618 4.39-.236.2-.461.092-.357-.168.346-.864 1.12-2.818.753-3.287z" fill="#FF9900" /></svg>, bg: "hover:border-[#FF9900]/30" },
                                { name: "Azure", icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M13.05 4.24L7.56 18.05l-4.78 0 5.36-13.81h4.91Z" fill="#0089D6" /><path d="M14.21 16.67L9.82 18.09l5.87-6.85 -1.48 5.43Z" fill="#0089D6" /><path d="M17.64 5.24L21.22 18.05l-4.7 0 -2.47-12.81h3.59Z" fill="#0089D6" /></svg>, bg: "hover:border-[#0089D6]/30" },
                                { name: "Terraform", icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M1.5 3.5v6.9l6 3.5V7l-6-3.5z" fill="#844FBA" /><path d="M8.5 7v6.9l6 3.5V10.5l-6-3.5z" fill="#844FBA" /><path d="M15.5 3.5v6.9l6 3.5V7l-6-3.5z" fill="#844FBA" opacity="0.6" /><path d="M8.5 17.4v6.9l6-3.5V14l-6 3.4z" fill="#844FBA" /></svg>, bg: "hover:border-[#844FBA]/30" }
                            ].map((tech, i) => (
                                <motion.div
                                    key={tech.name}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 + i * 0.15, duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white border border-gray-200 shadow-sm cursor-pointer transition-all duration-300 ${tech.bg}`}
                                >
                                    {tech.icon}
                                    <span className="text-sm font-medium text-gray-700">{tech.name}</span>
                                </motion.div>
                            ))}
                        </div>
                    </FadeIn>
                </motion.div>

                {/* Subtle grid */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
            </section>

            {/* ═══ SERVICES ═══════════════════════════════ */}
            <section className="w-full px-6 md:px-12 lg:px-24 py-24 md:py-32 bg-gray-50 border-b border-gray-200">
                <div className="max-w-[1400px] mx-auto w-full">
                    <FadeIn>
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-12 md:mb-16 tracking-tight">
                            {t("Services.heading")} <span className="text-gray-400">{t("Services.headingFaded")}</span>
                        </h2>
                    </FadeIn>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
                        {services.map((s, i) => (
                            <FadeIn key={i} delay={0.1 * i}>
                                <Link href={`/${locale}${s.href}`} className={`group flex flex-col justify-between p-8 sm:p-10 lg:p-14 bg-white rounded-3xl border border-gray-100 shadow-sm transition-all duration-700 hover:shadow-xl hover:-translate-y-2 ${s.bgHover} h-full`}>
                                    <div className="flex justify-between items-start mb-12 sm:mb-16">
                                        <div className={`p-4 rounded-2xl bg-gray-50 group-hover:text-white transition-colors duration-500 ease-out ${s.color}`}>
                                            <s.icon className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={1.5} />
                                        </div>
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-300 group-hover:bg-gray-900 group-hover:text-white transition-colors duration-500">
                                            <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl sm:text-3xl font-semibold mb-3 sm:mb-4 text-gray-900">{t(s.titleKey)}</h3>
                                        <p className="text-base sm:text-lg text-gray-500 leading-relaxed font-light">{t(s.descKey)}</p>
                                    </div>
                                </Link>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ ABOUT ══════════════════════════════════ */}
            <section className="w-full px-6 md:px-12 lg:px-24 py-24 md:py-32 bg-white border-b border-gray-200">
                <div className="max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                    <FadeIn className="w-full lg:w-1/2">
                        <div className="relative aspect-square max-w-sm sm:max-w-md mx-auto lg:mx-0 rounded-[3rem] overflow-hidden bg-gray-100 border border-gray-200 shadow-2xl">
                            <div className="absolute inset-4 rounded-[2.5rem] border border-white/50 z-20 pointer-events-none" />
                            <img src="/profile.png" alt="Ayoub Sekoum" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-105 hover:scale-100" />
                        </div>
                    </FadeIn>

                    <div className="w-full lg:w-1/2 flex flex-col gap-8 sm:gap-10">
                        <FadeIn delay={0.2}>
                            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight">Ayoub <br /><span className="text-gray-400">Sekoum</span></h2>
                            <p className="text-lg sm:text-xl text-red-600 font-medium mt-4 tracking-wider uppercase">{t("About.role")}</p>
                        </FadeIn>

                        <FadeIn delay={0.3}>
                            <p className="text-lg sm:text-xl text-gray-500 leading-relaxed font-light">
                                &ldquo;{t("About.quote")}&rdquo;
                            </p>
                        </FadeIn>

                        <FadeIn delay={0.4}>
                            <div className="flex flex-wrap gap-3 sm:gap-4">
                                {[
                                    { color: "text-blue-500", label: "Azure Administrator", link: "https://learn.microsoft.com/it-it/users/ayoubsekoum-7090/credentials/bbcebc91c9d34a8b" },
                                    { color: "text-emerald-500", label: "Security & Compliance", link: "https://learn.microsoft.com/it-it/users/ayoubsekoum-3690/credentials/7558ab5004567733" },
                                    { color: "text-indigo-500", label: "Microsoft 365", link: "https://learn.microsoft.com/it-it/users/ayoubsekoum-7090/credentials/709360e7ffcbe84a" }
                                ].map((cert) => (
                                    <a key={cert.label} href={cert.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full border border-gray-200 hover:border-gray-900 hover:bg-gray-50 transition-colors text-sm font-medium">
                                        <span className={cert.color}>●</span> {cert.label}
                                    </a>
                                ))}
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* ═══ CONTACT ════════════════════════════════ */}
            <section id="contatti" className="w-full px-6 md:px-12 lg:px-24 py-24 md:py-32 bg-gray-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.2) 1px,transparent 1px)", backgroundSize: "80px 80px" }} />

                <div className="max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row gap-12 lg:gap-16 relative z-10">
                    <div className="w-full lg:w-5/12 space-y-6 sm:space-y-8">
                        <FadeIn>
                            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-none mb-4 sm:mb-6">{t("Contact.heading")}<br /><span className="text-gray-400">{t("Contact.headingFaded")}</span></h2>
                            <p className="text-lg sm:text-xl text-gray-400 font-light">{t("Contact.subtitle")}</p>
                        </FadeIn>
                    </div>

                    <FadeIn delay={0.2} className="w-full lg:w-7/12">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 sm:p-8 md:p-12 shadow-2xl">
                            <form className="flex flex-col gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm text-gray-400 uppercase tracking-wider font-semibold">{t("Contact.labelName")}</label>
                                        <input type="text" className="bg-transparent border-b border-white/20 pb-2 text-white text-lg focus:outline-none focus:border-red-500 transition-colors placeholder:text-gray-600 rounded-none w-full" placeholder={t("Contact.placeholderName")} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm text-gray-400 uppercase tracking-wider font-semibold">{t("Contact.labelEmail")}</label>
                                        <input type="email" className="bg-transparent border-b border-white/20 pb-2 text-white text-lg focus:outline-none focus:border-red-500 transition-colors placeholder:text-gray-600 rounded-none w-full" placeholder={t("Contact.placeholderEmail")} />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 mt-4">
                                    <label className="text-sm text-gray-400 uppercase tracking-wider font-semibold">{t("Contact.labelMessage")}</label>
                                    <textarea rows={3} className="bg-transparent border-b border-white/20 pb-2 text-white text-lg focus:outline-none focus:border-red-500 transition-colors placeholder:text-gray-600 resize-none rounded-none w-full" placeholder={t("Contact.placeholderMessage")} />
                                </div>
                                <Button type="button" variant="primary" size="lg" className="rounded-full mt-6 sm:mt-8 self-start px-10 sm:px-12 py-6 text-base sm:text-lg hover:scale-105 transition-transform">
                                    {t("Contact.send")}
                                </Button>
                            </form>
                        </div>
                    </FadeIn>
                </div>
            </section>

        </main>
    );
}
