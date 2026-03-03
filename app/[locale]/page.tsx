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
                                {
                                    name: "AWS",
                                    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576a.351.351 0 0 1 .056.192.36.36 0 0 1-.176.272l-.584.389a.424.424 0 0 1-.232.08.39.39 0 0 1-.296-.152 3.04 3.04 0 0 1-.336-.44 7.422 7.422 0 0 1-.288-.536 3.532 3.532 0 0 1-2.768 1.304c-.8 0-1.432-.228-1.904-.684-.472-.456-.704-1.064-.704-1.824 0-.808.284-1.464.86-1.96.576-.496 1.344-.744 2.312-.744.32 0 .648.024.992.08.344.056.696.136 1.064.216V6.96c0-.72-.152-1.224-.448-1.52-.304-.296-.816-.44-1.544-.44-.336 0-.68.04-1.032.128-.352.088-.696.2-1.032.328a2.485 2.485 0 0 1-.312.128.533.533 0 0 1-.136.024c-.192 0-.288-.136-.288-.416v-.456c0-.216.024-.376.08-.472a.788.788 0 0 1 .312-.264 6.326 6.326 0 0 1 1.216-.44 5.515 5.515 0 0 1 1.504-.2c1.144 0 1.984.26 2.52.776.528.52.8 1.304.8 2.36v3.108h.016Zm-3.84 1.424c.312 0 .632-.056.968-.176.336-.12.632-.336.88-.632.152-.176.264-.376.328-.6.064-.224.104-.496.104-.816V8.78a7.85 7.85 0 0 0-.856-.168 6.87 6.87 0 0 0-.872-.056c-.632 0-1.096.12-1.4.368-.304.248-.448.6-.448 1.064 0 .432.104.76.32.984.208.232.52.344.936.344h.04Zm7.592 1.016a.576.576 0 0 1-.376-.096c-.1-.056-.184-.192-.248-.384l-2.776-9.136a1.66 1.66 0 0 1-.1-.408c0-.16.08-.248.24-.248h.912c.2 0 .336.032.416.096.1.056.168.192.232.384l1.984 7.816 1.84-7.816c.056-.2.12-.328.216-.384a.78.78 0 0 1 .432-.096h.744c.2 0 .344.032.432.096.1.056.176.192.216.384l1.864 7.912 2.04-7.912c.064-.2.144-.328.232-.384a.732.732 0 0 1 .416-.096h.864c.16 0 .248.08.248.248 0 .048-.008.096-.016.152a1.537 1.537 0 0 1-.084.264l-2.848 9.136c-.064.2-.148.328-.248.384a.726.726 0 0 1-.376.096h-.8c-.2 0-.344-.032-.432-.104-.1-.064-.176-.192-.216-.392l-1.832-7.616-1.816 7.608c-.056.208-.12.336-.216.4-.1.064-.256.104-.432.104h-.8l.008-.016Zm12.152.272a4.947 4.947 0 0 1-1.168-.136 3.594 3.594 0 0 1-.856-.296c-.144-.088-.24-.176-.272-.264a.644.644 0 0 1-.048-.24v-.472c0-.28.104-.416.304-.416a.75.75 0 0 1 .24.04c.08.032.2.08.328.136.44.2.92.296 1.432.296.752 0 1.328-.528 1.328-1.184 0-.344-.104-.624-.32-.84-.216-.216-.616-.416-1.192-.6-.824-.272-1.436-.664-1.828-1.176a2.721 2.721 0 0 1-.584-1.696c0-.488.104-.92.312-1.296.208-.376.488-.696.848-.944a3.72 3.72 0 0 1 1.216-.576 4.87 4.87 0 0 1 1.432-.2 5.28 5.28 0 0 1 .72.048c.248.04.472.088.688.152.2.064.392.136.568.216.176.08.312.16.408.24a.865.865 0 0 1 .24.264.723.723 0 0 1 .072.328v.44c0 .28-.104.424-.304.424a1.07 1.07 0 0 1-.392-.12 4.743 4.743 0 0 0-1.272-.296 3.42 3.42 0 0 0-.376-.016c-.68 0-1.216.448-1.216 1.12 0 .352.12.648.36.872.24.224.68.448 1.312.656.816.264 1.416.64 1.792 1.128.376.488.56 1.048.56 1.672 0 .496-.1.952-.296 1.36a3.15 3.15 0 0 1-.832.992 3.583 3.583 0 0 1-1.256.6c-.48.136-1 .208-1.544.208h.032Z" fill="#FF9900" /><path d="M21.384 18.288c-2.552 1.776-6.24 2.72-9.416 2.72-4.456 0-8.472-1.648-11.504-4.392-.24-.216-.024-.512.264-.344 3.28 1.904 7.336 3.056 11.52 3.056 2.824 0 5.928-.584 8.784-1.8.432-.184.792.284.352.76Z" fill="#FF9900" /><path d="M22.36 17.184c-.324-.416-2.136-.2-2.952-.1-.248.032-.284-.184-.06-.344 1.448-.952 3.816-.72 4.092-.384.276.344-.076 2.744-1.432 3.888-.208.176-.408.08-.312-.152.304-.76.992-2.496.664-2.908Z" fill="#FF9900" /></svg>,
                                    bg: "hover:border-[#FF9900]/30"
                                },
                                {
                                    name: "Azure",
                                    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M13.05 4.24 7.56 18.39l-4.08.72 5.31-14.97h4.26ZM21.72 18.26l-7.43 1.5-3.56-4.22 7.13-1.27 3.86 3.99Zm-6-14.02.03.05v.01l-3.2 9.18L17.89 6.1h-.01l2.73 1.67-8.87 14.2h-2.6L13.72 4.24h2Z" fill="#0089D6" /></svg>,
                                    bg: "hover:border-[#0089D6]/30"
                                },
                                {
                                    name: "Terraform",
                                    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M8.283 3.5v6.334l5.482 3.166V6.666L8.283 3.5Z" fill="#844FBA" /><path d="M14.57 6.666V13l5.482-3.166V3.5L14.57 6.666Z" fill="#844FBA" opacity="0.6" /><path d="M2 3.5v6.334l5.482 3.166V6.666L2 3.5Z" fill="#844FBA" /><path d="M8.283 13.834V20.5l5.482-3.166v-6.668l-5.482 3.168Z" fill="#844FBA" /></svg>,
                                    bg: "hover:border-[#844FBA]/30"
                                }
                            ].map((tech, i) => (
                                <motion.div
                                    key={tech.name}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 + i * 0.15, duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    className={`flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-white border border-gray-200 shadow-sm cursor-pointer transition-all duration-300 ${tech.bg}`}
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
