"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

export default function SpotlightSection() {
  const { t } = useLanguage();

  return (
    <div className="w-full bg-gray-900 text-white py-20 relative overflow-hidden hidden">
      {/* Background large typography overlay (similar to 'Coffee Rider' in screenshot) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black text-gray-800/20 whitespace-nowrap select-none pointer-events-none font-display">
        JOURNAL
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">

        {/* Slanted Image Container */}
        <div className="relative flex justify-center items-center">
          <div className="absolute inset-0 bg-blue-600/20 blur-3xl rounded-full transform -skew-y-12 scale-110"></div>
          <div className="bg-editorial-card p-3 pb-12 shadow-2xl transform -rotate-6 transition-transform hover:rotate-0 duration-500 rounded-sm w-full max-w-sm border border-editorial-border">
            <div className="w-full aspect-[4/5] overflow-hidden bg-editorial-bg">
              <img
                src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1975&auto=format&fit=crop"
                alt="Spotlight"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4 text-center text-editorial-text font-medium font-handwriting text-xl">
              {t("featuredStory")}
            </div>
          </div>
        </div>

        {/* Right: Content */}
        <div className="space-y-8 flex flex-col justify-center">
          <div className="space-y-4">
            <p className="text-yellow-400 font-bold tracking-widest uppercase text-xs">{t("spotlightFeature")}</p>
            <h2 className="text-3xl md:text-5xl font-black font-display text-white leading-tight">
              {t("spotlightTitle")}
            </h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-md">
              {t("spotlightDesc")}
            </p>
          </div>
          <Link
            href="/#library"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-sm font-bold transition-colors w-fit"
          >
            {t("readStory")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
