"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("loading");

        const formData = new FormData(e.currentTarget);
        const data = {
            nome: formData.get("nome"),
            email: formData.get("email"),
            ruolo: formData.get("ruolo"),
            messaggio: formData.get("messaggio"),
        };

        try {
            // Frontend sends data to the absolute Backend URL, defaulting to local port 3001
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '') || "http://localhost:3002";
            const response = await fetch(`${backendUrl}/api/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setStatus("success");
                (e.target as HTMLFormElement).reset();
            } else {
                setStatus("error");
            }
        } catch (error) {
            setStatus("error");
        }
    };

    return (
        <form className="space-y-4 pt-4 text-left" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm text-textMuted">Nome completo</label>
                    <input name="nome" required type="text" className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-textMain shadow-sm" placeholder="Mario Rossi" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-textMuted">Email Aziendale</label>
                    <input name="email" required type="email" className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-textMain shadow-sm" placeholder="mario@azienda.it" />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm text-textMuted">Ruolo (CEO, CTO, IT Manager...)</label>
                <input name="ruolo" required type="text" className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-textMain shadow-sm" placeholder="CTO" />
            </div>
            <div className="space-y-2">
                <label className="text-sm text-textMuted">Di cosa hai bisogno?</label>
                <textarea name="messaggio" required rows={4} className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-textMain resize-none shadow-sm" placeholder="Descrivi brevemente il tuo progetto o problema attuale..." />
            </div>

            <Button type="submit" className="w-full mt-4" size="lg" disabled={status === "loading" || status === "success"}>
                {status === "loading" ? "Invio in corso..." : status === "success" ? "Richiesta Inviata!" : "Invia Richiesta"}
            </Button>

            {status === "error" && (
                <p className="text-sm text-red-500 text-center pt-2">C'è stato un errore nell'invio. Riprova.</p>
            )}

            <p className="text-xs text-textMuted text-center pt-2">
                Inviando il modulo accetti la nostra Privacy Policy in conformità con il GDPR.
            </p>
        </form>
    );
}
