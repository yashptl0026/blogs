"use client";

import { Search, MapPin, Calendar } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/LanguageContext";

export default function ModernHero() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/#library`;
    }
  };

  return (
    <section className="relative w-full h-[90vh] min-h-[850px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1598324789736-4861f89564a0?q=100&w=2000&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/80"></div>
      </div>

      {/* 1. Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 pt-20">
        {/* Subtle top label */}
        <p className="text-white/80 font-semibold tracking-widest uppercase text-xs">{t("heroSubtitle")}</p>

        {/* Main headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight font-display">
          {t("heroTitle").split(" ").map((word: string, i: number, arr: string[]) =>
            i >= arr.length - 2 ? <span key={i}> {word}</span> : <span key={i}> {word}</span>
          )}
        </h1>

        {/* Subtitle */}
        <p className="text-white/90 text-sm md:text-base lg:text-lg max-w-2xl mx-auto font-sans leading-relaxed">
          {t("heroDesc")}
        </p>

        {/* Search Bar matching the booking style */}
        <form onSubmit={handleSearch} className="hidden mt-8 max-w-3xl mx-auto bg-editorial-card rounded-full p-2 flex flex-col md:flex-row items-center gap-2 shadow-2xl">

          <div className="flex-1 flex items-center gap-3 px-4 py-3 md:py-0 w-full border-b md:border-b-0 md:border-r border-editorial-border">
            <Search className="text-editorial-muted w-5 h-5" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              className="w-full bg-transparent outline-none text-sm text-editorial-text placeholder:text-editorial-muted"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex-1 flex items-center gap-3 px-4 py-3 md:py-0 w-full">
            <MapPin className="text-editorial-muted w-5 h-5" />
            <select
              className="w-full bg-transparent outline-none text-sm text-editorial-text cursor-pointer appearance-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">{t("anyCategory")}</option>
              <option value="travel">{t("home")}</option>
              <option value="design">{t("design")}</option>
              <option value="lifestyle">Lifestyle</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-full transition-colors whitespace-nowrap"
          >
            {t("search")}
          </button>
        </form>
      </div>
    </section>
  );
}
