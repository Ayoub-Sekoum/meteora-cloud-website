import { Inter } from "next/font/google";
import "../globals.css";
import { setRequestLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { CookieBanner } from "@/components/CookieBanner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
    title: "Meteora | Cloud Architecture & Consulting",
    description: "Infrastrutture Cloud Scalabili, Sicure e Ottimizzate",
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

    return (
        <html lang={locale} className={`${inter.variable} bg-white`}>
            <body className="bg-white text-gray-900 antialiased">
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <SmoothScroll>
                        <Navbar />
                        <div className="min-h-screen">
                            {children}
                        </div>
                        <Footer />
                    </SmoothScroll>
                    <CookieBanner />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
