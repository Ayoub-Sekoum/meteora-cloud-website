"use client";

import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Server, Shield, LineChart, Code2, ArrowRight, Upload, X, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRef, useState, useCallback } from "react";

import { AnimateIn } from "@/components/AnimateIn";
import { AnimatedText } from "@/components/AnimatedText";
import { FloatingGrid } from "@/components/FloatingGrid";

/* ── Helpers ──────────────────────────────────────── */
const LETTERS_ONLY = /^[A-Za-zÀ-ÿ\s'-]*$/;
const NUMBERS_ONLY = /^[0-9+\s()-]*$/;
const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30 MB
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

/* ── Contact Section ──────────────────────────────── */
function ContactSection({ t }: { t: ReturnType<typeof useTranslations> }) {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validate = (name: string, value: string): string => {
        if (name === "nome" || name === "cognome") {
            if (!LETTERS_ONLY.test(value)) {
                return name === "nome"
                    ? t("Contact.errorNameLetters")
                    : t("Contact.errorSurnameLetters");
            }
        }
        if (name === "telefono") {
            if (!NUMBERS_ONLY.test(value)) {
                return t("Contact.errorPhoneNumbers");
            }
        }
        return "";
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const error = validate(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));

        // Block invalid characters for name/surname
        if ((name === "nome" || name === "cognome") && !LETTERS_ONLY.test(value)) {
            e.target.value = value.replace(/[^A-Za-zÀ-ÿ\s'-]/g, "");
        }
        // Block invalid characters for phone
        if (name === "telefono" && !NUMBERS_ONLY.test(value)) {
            e.target.value = value.replace(/[^0-9+\s()-]/g, "");
        }
    };

    const handleFile = useCallback((f: File | null) => {
        if (!f) return;
        if (f.size > MAX_FILE_SIZE) {
            setErrors((prev) => ({ ...prev, file: t("Contact.errorFileSize") }));
            return;
        }
        setErrors((prev) => ({ ...prev, file: "" }));
        setFile(f);
    }, [t]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
    }, [handleFile]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("loading");

        const form = e.currentTarget;
        const formData = new FormData(form);

        // Validate all fields
        const nome = formData.get("nome") as string;
        const cognome = formData.get("cognome") as string;
        const telefono = formData.get("telefono") as string;

        const email = formData.get("email") as string;

        const newErrors: Record<string, string> = {};
        if (!LETTERS_ONLY.test(nome)) newErrors.nome = t("Contact.errorNameLetters");
        if (!LETTERS_ONLY.test(cognome)) newErrors.cognome = t("Contact.errorSurnameLetters");
        if (!NUMBERS_ONLY.test(telefono)) newErrors.telefono = t("Contact.errorPhoneNumbers");
        if (!email || !email.includes("@") || !email.includes(".")) newErrors.email = t("Contact.errorEmail");

        if (Object.values(newErrors).some(Boolean)) {
            setErrors(newErrors);
            setStatus("idle");
            return;
        }

        // Add file if selected
        if (file) {
            formData.set("file", file);
        }

        try {
            const response = await fetch(`${BACKEND_URL}/api/contact`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setStatus("success");
                form.reset();
                setFile(null);
                setErrors({});
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    };

    const inputClass = "bg-transparent border-b border-white/20 pb-2 text-white text-lg focus:outline-none focus:border-red-500 transition-colors placeholder:text-gray-600 rounded-none w-full";
    const labelClass = "text-sm text-gray-400 uppercase tracking-wider font-semibold";

    return (
        <section id="contatti" className="w-full px-6 md:px-12 lg:px-24 py-24 md:py-32 bg-gray-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.2) 1px,transparent 1px)", backgroundSize: "80px 80px" }} />

            <div className="max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row gap-12 lg:gap-16 relative z-10">
                <div className="w-full lg:w-5/12 space-y-6 sm:space-y-8">
                    <AnimateIn delay={0.1}>
                        <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-none mb-4 sm:mb-6">{t("Contact.heading")}<br /><span className="text-gray-400">{t("Contact.headingFaded")}</span></h2>
                        <p className="text-lg sm:text-xl text-gray-400 font-light">{t("Contact.subtitle")}</p>
                    </AnimateIn>
                </div>

                <AnimateIn delay={0.2} direction="left" className="w-full lg:w-7/12">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 sm:p-8 md:p-12 shadow-2xl">
                        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                            {/* Nome + Cognome */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className={labelClass}>{t("Contact.labelName")}</label>
                                    <input
                                        name="nome"
                                        type="text"
                                        required
                                        className={inputClass}
                                        placeholder={t("Contact.placeholderName")}
                                        onChange={handleInputChange}
                                    />
                                    {errors.nome && <span className="text-xs text-red-400 mt-1">{errors.nome}</span>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className={labelClass}>{t("Contact.labelSurname")}</label>
                                    <input
                                        name="cognome"
                                        type="text"
                                        required
                                        className={inputClass}
                                        placeholder={t("Contact.placeholderSurname")}
                                        onChange={handleInputChange}
                                    />
                                    {errors.cognome && <span className="text-xs text-red-400 mt-1">{errors.cognome}</span>}
                                </div>
                            </div>

                            {/* Email + Telefono */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className={labelClass}>{t("Contact.labelEmail")}</label>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                                        className={inputClass}
                                        placeholder={t("Contact.placeholderEmail")}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val && (!val.includes('@') || !val.includes('.'))) {
                                                setErrors(prev => ({ ...prev, email: t('Contact.errorEmail') }));
                                            } else {
                                                setErrors(prev => ({ ...prev, email: '' }));
                                            }
                                        }}
                                    />
                                    {errors.email && <span className="text-xs text-red-400 mt-1">{errors.email}</span>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className={labelClass}>{t("Contact.labelPhone")}</label>
                                    <input
                                        name="telefono"
                                        type="tel"
                                        required
                                        className={inputClass}
                                        placeholder={t("Contact.placeholderPhone")}
                                        onChange={handleInputChange}
                                    />
                                    {errors.telefono && <span className="text-xs text-red-400 mt-1">{errors.telefono}</span>}
                                </div>
                            </div>

                            {/* Messaggio */}
                            <div className="flex flex-col gap-2 mt-2">
                                <label className={labelClass}>{t("Contact.labelMessage")}</label>
                                <textarea
                                    name="messaggio"
                                    required
                                    rows={3}
                                    className="bg-transparent border-b border-white/20 pb-2 text-white text-lg focus:outline-none focus:border-red-500 transition-colors placeholder:text-gray-600 resize-none rounded-none w-full"
                                    placeholder={t("Contact.placeholderMessage")}
                                />
                            </div>

                            {/* Upload File */}
                            <div className="flex flex-col gap-2 mt-2">
                                <label className={labelClass}>{t("Contact.labelUpload")}</label>
                                <div
                                    className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${dragActive
                                        ? "border-red-500 bg-red-500/10"
                                        : file
                                            ? "border-emerald-500/50 bg-emerald-500/5"
                                            : "border-white/20 hover:border-white/40 hover:bg-white/5"
                                        }`}
                                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                                    onDragLeave={() => setDragActive(false)}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => handleFile(e.target.files?.[0] || null)}
                                    />
                                    {file ? (
                                        <div className="flex items-center justify-center gap-3">
                                            <FileText className="w-5 h-5 text-emerald-400" />
                                            <span className="text-emerald-300 text-sm font-medium">{file.name}</span>
                                            <span className="text-gray-500 text-xs">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                                className="ml-2 p-1 rounded-full hover:bg-white/10 transition-colors"
                                            >
                                                <X className="w-4 h-4 text-gray-400" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <Upload className="w-8 h-8 text-gray-500" />
                                            <p className="text-sm text-gray-400">{t("Contact.uploadHint")}</p>
                                        </div>
                                    )}
                                </div>
                                {errors.file && <span className="text-xs text-red-400 mt-1">{errors.file}</span>}
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="rounded-full mt-6 sm:mt-8 self-start px-10 sm:px-12 py-6 text-base sm:text-lg hover:scale-105 transition-transform"
                                disabled={status === "loading" || status === "success"}
                            >
                                {status === "loading" ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {t("Contact.sending")}
                                    </span>
                                ) : status === "success" ? (
                                    t("Contact.sent")
                                ) : (
                                    t("Contact.send")
                                )}
                            </Button>

                            {/* Status messages */}
                            {status === "error" && (
                                <p className="text-sm text-red-400 text-center">{t("Contact.errorSend")}</p>
                            )}
                            {status === "success" && (
                                <p className="text-sm text-emerald-400 text-center">✓ {t("Contact.sent")}</p>
                            )}

                            <p className="text-xs text-gray-500 text-center pt-1">
                                {t("Contact.privacy")}
                            </p>
                        </form>
                    </div>
                </AnimateIn>
            </div>
        </section>
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
            <section ref={heroRef} className="relative w-full min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-24 pb-32 md:pb-40 border-b border-gray-200 overflow-hidden">
                <FloatingGrid />

                {/* Full logo – large, centered, translucent, dissolves on scroll */}
                <motion.div
                    style={{ opacity: logoOpacity, scale: logoScale }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
                >
                    <Image
                        src="/logo.png"
                        alt=""
                        width={1000}
                        height={400}
                        className="w-[70vw] max-w-[1000px] h-auto object-contain select-none"
                        style={{ mixBlendMode: 'multiply' }}
                        priority
                    />
                </motion.div>

                {/* Content (sits above the logo) */}
                <motion.div style={{ y: heroY, opacity: heroOpacity }} className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full z-10">

                    {/* Badge */}
                    <AnimateIn delay={0.1}>
                        <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-gray-50/50 backdrop-blur-md border border-gray-200 text-sm font-medium text-gray-600 uppercase tracking-widest shadow-sm w-fit">
                            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                            {t("Hero.badge")}
                        </div>
                    </AnimateIn>

                    {/* Big title */}
                    <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[7rem] font-bold tracking-tight leading-[0.95] text-gray-900 max-w-6xl mt-4">
                        <div className="flex flex-col overflow-hidden">
                            <AnimatedText text={t("Hero.title1")} delay={0.2} stagger={0.03} />
                            <AnimatedText text={`${t("Hero.title2")} `} delay={0.8} stagger={0.03} className="text-gray-900" />
                            <AnimatedText text={t("Hero.title2b")} delay={0.8} stagger={0.03} className="text-gray-300" />
                            <AnimatedText text={t("Hero.title3")} delay={1.4} stagger={0.04} className="text-red-600 tracking-tighter" />
                        </div>
                    </h1>

                    <AnimateIn delay={2.0} className="mt-6">
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-500 max-w-3xl font-light leading-snug">
                            {t("Hero.subtitle")}
                        </p>
                    </AnimateIn>

                    {/* ── Jitter-style CTA with glow blob ── */}
                    <AnimateIn delay={2.2} className="mt-14 flex flex-col items-center gap-10">
                        <motion.div
                            className="relative"
                        >
                            {/* Glow blob behind button */}
                            <motion.div
                                className="absolute -inset-6 sm:-inset-8 rounded-[3rem] bg-red-500/15 blur-2xl pointer-events-none"
                                animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.7, 0.5] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                            />
                            <Link href={`/${locale}#contatti`}>
                                <motion.button
                                    className="relative z-10 rounded-full px-12 sm:px-16 py-5 sm:py-6 text-base sm:text-lg font-semibold text-white bg-red-600 shadow-xl cursor-pointer flex items-center gap-3 overflow-hidden group"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.97 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                    <span className="relative z-10">{t("Hero.cta")}</span>
                                    <motion.span
                                        className="inline-block relative z-10"
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                    >
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 duration-300 transition-transform" />
                                    </motion.span>
                                    <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                </motion.button>
                            </Link>
                        </motion.div>

                        {/* ── Social proof divider ── */}
                        <div
                            className="flex items-center gap-4 sm:gap-6 w-full max-w-xl"
                        >
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-xs sm:text-sm text-gray-500 font-bold tracking-wide uppercase whitespace-nowrap">
                                {t("Hero.socialProof")}
                            </span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        {/* ── Cloud provider logos (Jitter-style marquee) ── */}
                        <div
                            className="w-full max-w-3xl overflow-hidden relative"
                        >
                            {/* Fade edges */}
                            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                            {/* Marquee track */}
                            <div className="flex items-center gap-12 sm:gap-16 animate-[marquee_20s_linear_infinite] hover:[animation-play-state:paused]">
                                {/* Duplicate logos for seamless infinite scroll */}
                                {[...Array(2)].map((_, setIdx) => (
                                    <div key={setIdx} className="flex items-center gap-12 sm:gap-16 shrink-0">
                                        {[
                                            { name: "AWS", icon: "/aws-icon.png" },
                                            { name: "Azure", icon: "/azure-icon.png" },
                                            { name: "Terraform", icon: "/terraform-icon.png" },
                                        ].map((tech) => (
                                            <div
                                                key={`${setIdx}-${tech.name}`}
                                                className="group flex items-center gap-3 sm:gap-4 cursor-default shrink-0 px-6 py-4 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.12)] hover:-translate-y-1 hover:border-gray-200"
                                            >
                                                <img
                                                    src={tech.icon}
                                                    alt={tech.name}
                                                    className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
                                                />
                                                <span className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 drop-shadow-sm">
                                                    {tech.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </AnimateIn>
                </motion.div>
            </section>

            {/* ═══ SERVICES ═══════════════════════════════ */}
            <section className="w-full px-6 md:px-12 lg:px-24 py-24 md:py-32 bg-gray-50 border-b border-gray-200">
                <div className="max-w-[1400px] mx-auto w-full">
                    <AnimateIn>
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-12 md:mb-16 tracking-tight">
                            {t("Services.heading")} <span className="text-gray-400">{t("Services.headingFaded")}</span>
                        </h2>
                    </AnimateIn>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
                        {services.map((s, i) => (
                            <AnimateIn key={i} delay={0.1 * i}>
                                <Link href={`/${locale}${s.href}`} className={`group flex flex-col justify-between p-8 sm:p-10 lg:p-14 bg-white rounded-3xl border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-2 ${s.bgHover} h-full`}>
                                    <div className="flex justify-between items-start mb-12 sm:mb-16">
                                        <div className={`p-4 rounded-2xl bg-gray-50 group-hover:text-white transition-colors duration-300 ease-out ${s.color}`}>
                                            <s.icon className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={1.5} />
                                        </div>
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-300 group-hover:bg-gray-900 group-hover:text-white transition-colors duration-300">
                                            <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl sm:text-3xl font-semibold mb-3 sm:mb-4 text-gray-900">{t(s.titleKey)}</h3>
                                        <p className="text-base sm:text-lg text-gray-500 leading-relaxed font-light">{t(s.descKey)}</p>
                                    </div>
                                </Link>
                            </AnimateIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ ABOUT ══════════════════════════════════ */}
            <section className="w-full px-6 md:px-12 lg:px-24 py-24 md:py-32 bg-white border-b border-gray-200">
                <div className="max-w-[1400px] mx-auto w-full flex flex-col items-center text-center gap-12">
                    <div className="w-full max-w-3xl flex flex-col gap-8 sm:gap-10">
                        <AnimateIn delay={0.2}>
                            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight">Ayoub <br /><span className="text-gray-400">Sekoum</span></h2>
                            <p className="text-lg sm:text-xl text-red-600 font-medium mt-4 tracking-wider uppercase">{t("About.role")}</p>
                        </AnimateIn>

                        <AnimateIn delay={0.3}>
                            <p className="text-lg sm:text-xl text-gray-500 leading-relaxed font-light italic">
                                &ldquo;{t("About.quote")}&rdquo;
                            </p>
                        </AnimateIn>

                        <AnimateIn delay={0.4}>
                            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
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
                        </AnimateIn>
                    </div>
                </div>
            </section>

            {/* ═══ CONTACT ════════════════════════════════ */}
            <ContactSection t={t} />

        </main>
    );
}
