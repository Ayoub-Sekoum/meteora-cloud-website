"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/Button";

export function CookieBanner() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("meteora-cookie-consent");
        if (!consent) {
            setShowBanner(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem("meteora-cookie-consent", "accepted");
        setShowBanner(false);
        // Initialize Google Analytics / Plausible here
    };

    const declineCookies = () => {
        localStorage.setItem("meteora-cookie-consent", "declined");
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-background/90 backdrop-blur-md border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-textMuted flex-1 max-w-4xl">
                <p>
                    Utilizziamo cookie tecnici per il corretto funzionamento del sito e cookie analitici (es. Plausible/GA4)
                    in forma anonimizzata per comprendere come interagisci con i nostri servizi, nel pieno rispetto del GDPR.
                    Puoi accettare tutti i cookie o gestire le tue preferenze.
                </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
                <Button variant="ghost" size="sm" onClick={declineCookies}>
                    Rifiuta non essenziali
                </Button>
                <Button variant="primary" size="sm" onClick={acceptCookies}>
                    Accetta Tutti
                </Button>
            </div>
        </div>
    );
}
