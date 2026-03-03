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
                                { name: "AWS", icon: <svg className="w-6 h-6" viewBox="0 0 256 153" fill="none"><path d="M72.392 55.438c0 3.84.414 6.95 1.15 9.328.828 2.378 1.84 4.94 3.222 7.686.506.828.736 1.656.736 2.392 0 1.012-.644 2.024-2.024 3.036l-6.674 4.438c-.966.644-1.932 1.012-2.806 1.012-1.104 0-2.208-.644-3.312-1.84-1.472-1.656-2.76-3.404-3.818-5.152-1.058-1.84-2.116-3.864-3.266-6.212-8.234 9.696-18.574 14.544-31.02 14.544-8.878 0-15.92-2.532-21.034-7.596-5.114-5.064-7.686-11.828-7.686-20.336 0-9.006 3.128-16.324 9.512-21.848 6.384-5.524 14.888-8.282 25.694-8.282 3.588 0 7.268.322 11.132.874 3.864.552 7.87 1.38 12.106 2.392V24.718c0-8.05-1.656-13.672-4.876-16.97-3.312-3.298-8.924-4.876-16.97-4.876-3.68 0-7.452.46-11.316 1.38-3.864 .92-7.636 2.024-11.316 3.404-1.012.46-1.84.736-2.484.92-.644.184-1.104.276-1.472.276-1.288 0-1.932-.92-1.932-2.852V2.95c0-1.472.184-2.576.644-3.22.46-.736 1.288-1.472 2.576-2.208 3.68-1.84 8.096-3.404 13.256-4.692C43.308.598 48.928 0 54.824 0c12.382 0 21.434 2.806 27.312 8.418 5.786 5.612 8.694 14.13 8.694 25.556v33.464H72.392z" fill="#F90" /><path d="M246.392 78.472c-4.232 0-7.544-1.288-10.68-3.772-3.128-2.576-5.244-6.212-6.396-10.81-1.196-4.876-1.748-10.626-1.748-17.338V0h13.256v46.46c0 9.236 1.012 15.828 3.036 19.776 2.116 3.948 5.704 5.888 10.994 5.888 3.864 0 7.544-1.104 10.994-3.312 3.496-2.208 6.028-5.244 7.636-9.006V0h13.256v59.642c0 4.14.46 6.95 1.288 8.464.92 1.472 2.576 2.668 5.06 3.588l-3.68 9.328c-5.152-1.472-9.052-3.588-11.684-6.396-5.52 4.6-12.198 6.95-20.06 6.95l-11.272-3.104z" fill="#F90" /><path d="M203.31 127.892c-26.864 19.888-65.812 30.446-99.276 30.446-46.97 0-89.332-17.338-121.314-46.184-2.484-2.3-.276-5.428 2.76-3.588 34.566 20.06 77.296 32.212 121.406 32.212 29.802 0 62.534-6.212 92.704-18.942 4.508-2.024 8.326 2.944 3.72 6.056z" fill="#F90" /><path d="M213.896 115.786c-3.404-4.416-22.526-2.116-31.128-1.058-2.576.322-2.99-1.932-.644-3.68 15.276-10.742 40.326-7.636 43.262-4.048 2.944 3.68-.828 28.888-15.092 40.97-2.208 1.84-4.278.874-3.312-1.564 3.22-8.05 10.35-26.312 6.914-30.62z" fill="#F90" /></svg>, bg: "hover:border-[#FF9900]/30" },
                                { name: "Azure", icon: <svg className="w-6 h-6" viewBox="0 0 96 96" fill="none"><path d="M33.338 6.544h26.038l-27.03 80.455a4.152 4.152 0 01-3.933 2.833H8.149a4.145 4.145 0 01-3.928-5.47L29.404 9.378a4.152 4.152 0 013.934-2.834z" fill="#0089D6" /><path d="M71.175 60.261H41.29a1.911 1.911 0 00-1.305 3.309l26.532 24.764a4.171 4.171 0 002.846 1.121h22.094L71.175 60.261z" fill="#0089D6" opacity="0.7" /><path d="M33.338 6.544a4.118 4.118 0 00-3.943 2.879L4.252 83.506a4.144 4.144 0 003.908 5.538h20.787a4.443 4.443 0 003.41-2.9l5.014-14.777 17.91 16.705a4.237 4.237 0 002.666.972h21.894L62.87 60.261l-30.355.002L53.917 6.544H33.338z" fill="#0089D6" /></svg>, bg: "hover:border-[#0089D6]/30" },
                                { name: "Terraform", icon: <svg className="w-6 h-6" viewBox="0 0 256 289" fill="none"><path d="M88.344 50.418v87.672l75.928 43.836V94.254L88.344 50.418z" fill="#844FBA" /><path d="M176.272 94.254v87.672l75.928-43.836V50.418l-75.928 43.836z" fill="#844FBA" opacity="0.6" /><path d="M0 6.582v87.672l75.928 43.836V50.418L0 6.582z" fill="#844FBA" /><path d="M88.344 238.418v-87.672l75.928 43.836v87.672l-75.928-43.836z" fill="#844FBA" /></svg>, bg: "hover:border-[#844FBA]/30" }
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
