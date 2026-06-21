"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

export default function ModernFooter() {
  const { t } = useLanguage();
  return (
    <div className="w-full">


      {/* Main Footer (Dark Section) */}
      <footer className="bg-[#0b0c10] text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center space-y-8">

          <Link href="/" className="font-display text-2xl font-black tracking-tighter text-white uppercase flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">A</div>
            Aesthete
          </Link>

          <p className="text-xs max-w-sm leading-relaxed">
            Aesthete is a modern blogging platform curating the finest stories in travel, design, architecture, and lifestyle.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-white transition-colors">{t("home")}</Link>
            <Link href="/blog" className="hover:text-white transition-colors">{t("pages")}</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Articles</Link>
            <Link href="/terms" className="hover:text-white transition-colors">{t("termsOfService")}</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">{t("privacyPolicy")}</Link>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-800 w-full max-w-2xl">
            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><Facebook className="w-4 h-4" /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><Linkedin className="w-4 h-4" /></a>
          </div>

          <p className="text-[10px] tracking-wider pt-4">© 2026 AESTHETE PLATFORM. {t("allRightsReserved").toUpperCase()}</p>
        </div>
      </footer>
    </div>
  );
}
