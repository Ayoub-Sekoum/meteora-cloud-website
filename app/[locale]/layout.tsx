import { Inter } from "next/font/google";
import "../globals.css";
import { setRequestLocale, getMessages, getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { CookieBanner } from "@/components/CookieBanner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { PageTransition } from "@/components/PageTransition";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
    title: "Meteora | Cloud Architecture & Consulting",
    description: "Infrastrutture Cloud Scalabili, Sicure e Ottimizzate",
    icons: {
        icon: "/favicon.png",
        shortcut: "/favicon.png",
        apple: "/favicon.png",
    },
    alternates: {
        languages: {
            'it': 'https://meteora-cloud.com/it',
            'en': 'https://meteora-cloud.com/en',
            'de': 'https://meteora-cloud.com/de',
        }
    }
};

export function generateStaticParams() {
    return [{ locale: "it" }, { locale: "en" }, { locale: "de" }];
}

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    const messages = await getMessages({ locale });
    const t = await getTranslations({ locale, namespace: "Common" });

    return (
        <html lang={locale} className={`${inter.variable} bg-white scroll-smooth`}>
            <body className="bg-white text-gray-900 antialiased">
                <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[9999] bg-gray-900 text-white px-4 py-2 rounded-md font-medium shadow-2xl outline-none ring-2 ring-indigo-500">
                    {t("skipToContent")}
                </a>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <SmoothScroll>
                        <Navbar />
                        <div id="main-content" className="min-h-screen outline-none" tabIndex={-1}>
                            <PageTransition>
                                {children}
                            </PageTransition>
                        </div>
                        <Footer />
                    </SmoothScroll>
                    <CookieBanner />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
