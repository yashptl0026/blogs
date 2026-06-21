"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageContext";

export default function NewsletterBanner() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async () => {
    if (!email) return;
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Subscribed successfully!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to subscribe.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="w-full bg-gray-900 rounded-2xl p-8 md:p-12 relative overflow-hidden border border-gray-800 shadow-2xl">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left space-y-4 max-w-xl">
            <h3 className="text-3xl md:text-4xl font-black font-display tracking-tight text-white">{t("newsletterTitle")}</h3>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              {t("newsletterDesc")}
            </p>
          </div>

          <div className="flex flex-col w-full md:w-auto min-w-[300px]">
            <div className="flex w-full items-center gap-3 bg-editorial-bg rounded-full p-1.5 pl-6 border border-editorial-border">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading" || status === "success"}
                className="bg-transparent outline-none text-sm text-editorial-text placeholder:text-editorial-muted flex-1 min-w-0 disabled:opacity-50"
              />
              <button 
                onClick={handleSubscribe}
                disabled={status === "loading" || status === "success"}
                className={`px-6 py-2.5 text-white text-xs font-bold rounded-full transition-colors whitespace-nowrap uppercase tracking-wider ${
                  status === "success" ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
                } disabled:opacity-50`}
              >
                {status === "loading" ? "Subscribing..." : status === "success" ? "Subscribed ✓" : "Subscribe"}
              </button>
            </div>
            {message && (
              <p className={`mt-3 text-xs font-bold text-center md:text-left ${status === "success" ? "text-green-400" : "text-red-400"}`}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
