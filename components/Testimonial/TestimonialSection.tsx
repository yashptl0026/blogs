"use client";

import { useLanguage } from "@/components/LanguageContext";

export default function TestimonialSection() {
  const { t } = useLanguage();

  return (
    <div className="w-full bg-editorial-bg py-24 relative overflow-hidden hidden transition-colors duration-300">
      {/* Abstract Map Background (Using CSS pattern or faint SVG) */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-12 hidden">
        <h2 className="text-3xl md:text-4xl font-black font-display text-editorial-text">
          {t("testimonialTitle")}
        </h2>

        {/* Main Testimonial Focus */}
        <div className="relative bg-editorial-card p-8 md:p-12 rounded-3xl shadow-xl border border-editorial-border max-w-2xl mx-auto">
          {/* Avatar floating top center */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
              alt="User"
              className="w-16 h-16 rounded-full border-4 border-editorial-card shadow-lg object-cover"
            />
          </div>

          <div className="mt-6 space-y-6 text-center">
            <p className="text-editorial-muted italic text-lg leading-relaxed font-serif">
              "We consider this platform to be the gold standard for independent journalism. I read it every morning with my coffee. It's truly transformed how I view the world."
            </p>
            <div>
              <p className="font-bold text-editorial-text">David Kingston</p>
              <p className="text-xs text-editorial-muted font-medium">Daily Reader</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
