"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react"; 
import { useLanguage } from "@/components/LanguageContext";
import { Globe, User, LogOut, ChevronDown, Settings, Edit3, Moon, Sun, Search, LayoutDashboard, Menu, X, Heart, Bookmark, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";

export default function Header() {
  const { data: session } = useSession();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const profileRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Close profile dropdown if click is outside its container
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      // Close language dropdown if click is outside its container
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
      // Close search drawer if click is outside its container
      if (searchRef.current && !searchRef.current.contains(event.target as Node) && searchBtnRef.current && !searchBtnRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <header className="w-full bg-editorial-card border-b border-editorial-border fixed top-0 left-0 right-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex justify-between items-center">
        
        {/* Brand Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2"
        >
          {/* Tripadvisor-like Logo Placeholder */}
          <div className="flex items-center justify-center w-8 h-8 bg-green-900 rounded-full text-white">
            <Globe className="w-5 h-5" />
          </div>
          <span className="font-display text-2xl font-black tracking-tight text-editorial-text">
            Aesthete
          </span>
        </Link>

        {/* Center/Right Navigation + Actions */}
        <div className="flex items-center gap-2">
          
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex gap-8 text-[15px] font-semibold text-[#4B5563] items-center mr-8">
            <Link href="/" className="flex items-center gap-1.5 text-[#2563EB] transition-colors h-[72px]">
              <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full"></span>
              <span>{t("home")}</span>
            </Link>
            
            {/* Pages Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 cursor-pointer hover:text-[#2563EB] transition-colors h-[72px]">
                <span>{t("pages")}</span>
                <ChevronDown className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
              </button>
              <div className="absolute top-[72px] left-0 w-48 bg-editorial-card border border-editorial-border shadow-xl rounded-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link href="/about" className="block px-4 py-2.5 text-sm text-editorial-text hover:bg-editorial-bg hover:text-[#2563EB]">{t("aboutUs")}</Link>
                  <Link href="/contact" className="block px-4 py-2.5 text-sm text-editorial-text hover:bg-editorial-bg hover:text-[#2563EB]">{t("contactUs")}</Link>
                  <Link href="/privacy" className="block px-4 py-2.5 text-sm text-editorial-text hover:bg-editorial-bg hover:text-[#2563EB]">{t("privacyPolicy")}</Link>
                  <Link href="/terms" className="block px-4 py-2.5 text-sm text-editorial-text hover:bg-editorial-bg hover:text-[#2563EB]">{t("termsOfService")}</Link>
                </div>
              </div>
            </div>
            
            <Link href="/blog" className="flex items-center gap-1 cursor-pointer hover:text-[#2563EB] transition-colors group h-[72px]">
              <span>{t("post")}</span>
            </Link>
            
            {session?.user?.role === "ADMIN" && (
              <Link href="/admin" className="cursor-pointer hover:text-[#2563EB] transition-colors">
                {t("dashboard")}
              </Link>
            )}
          </nav>

          {/* Action Controls */}
          <div className="flex items-center gap-2 relative">
            
            {/* Search Toggle */}
            <button
              ref={searchBtnRef}
              onClick={() => {
                setSearchOpen(!searchOpen);
                setLangOpen(false);
                setProfileOpen(false);
                setMoreOpen(false);
              }}
              className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-editorial-text" />
            </button>

            {/* 1. Language & Currency Toggle */}
                <div className="relative hidden sm:block" ref={langRef}>
              <button
                onClick={() => {
                  setLangOpen(!langOpen);
                  setProfileOpen(false);
                  setMoreOpen(false);
                  setSearchOpen(false);
                }}
                className="flex items-center gap-2 text-[15px] font-bold text-editorial-text hover:bg-editorial-bg px-4 py-2.5 rounded-full transition-colors"
                aria-expanded={langOpen}
              >
                <Globe className="w-5 h-5" />
                <span className="text-gray-300">|</span>
                <span>INR</span>
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-40 bg-editorial-card border border-editorial-border shadow-xl rounded-2xl overflow-hidden z-50 text-left py-2"
                  >
                    <button
                      onClick={() => {
                        setLanguage("en");
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-editorial-bg flex justify-between items-center ${language === "en" ? "text-green-700 font-bold" : "text-editorial-text"}`}
                    >
                      <span>English</span>
                      {language === "en" && <span>✓</span>}
                    </button>
                    <button
                      onClick={() => {
                        setLanguage("hi");
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-editorial-bg flex justify-between items-center ${language === "hi" ? "text-green-700 font-bold" : "text-editorial-text"}`}
                    >
                      <span>हिन्दी</span>
                      {language === "hi" && <span>✓</span>}
                    </button>
                    <button
                      onClick={() => {
                        setLanguage("gu");
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-editorial-bg flex justify-between items-center ${language === "gu" ? "text-green-700 font-bold" : "text-editorial-text"}`}
                    >
                      <span>ગુજરાતી</span>
                      {language === "gu" && <span>✓</span>}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. Profile Dropdown / Signin Button */}
            {session ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => {
                    setProfileOpen(!profileOpen);
                    setLangOpen(false);
                    setMoreOpen(false);
                    setSearchOpen(false);
                  }}
                  className="flex items-center justify-center hover:bg-editorial-bg p-1 rounded-full transition-colors"
                  aria-expanded={profileOpen}
                >
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "Avatar"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-lg font-bold">
                      {session.user?.name?.charAt(0) || "U"}
                    </div>
                  )}
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 bg-editorial-card border border-editorial-border shadow-xl rounded-2xl overflow-hidden z-50 text-left"
                    >
                      {/* User info banner inside dropdown */}
                      <div className="p-4 border-b border-editorial-border bg-editorial-bg flex items-center gap-3">
                        {session.user?.image ? (
                          <img
                            src={session.user.image}
                            alt={session.user.name || "Avatar"}
                            className="w-12 h-12 rounded-full object-cover shadow-sm"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-xl font-bold shadow-sm">
                            {session.user?.name?.charAt(0) || "U"}
                          </div>
                        )}
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-editorial-text truncate">{session.user?.name}</p>
                          <p className="text-xs text-editorial-muted truncate">{session.user?.email}</p>
                        </div>
                      </div>

                      <div className="py-2">
                        <Link
                          href="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="px-4 py-2.5 text-sm text-editorial-text hover:bg-editorial-bg flex items-center gap-3 font-medium"
                        >
                          <User className="w-4 h-4 text-editorial-muted" />
                          <span>{t("viewProfile")}</span>
                        </Link>

                        <Link
                          href="/profile?tab=saved"
                          onClick={() => setProfileOpen(false)}
                          className="px-4 py-2.5 text-sm text-editorial-text hover:bg-editorial-bg flex items-center gap-3 font-medium"
                        >
                          <Bookmark className="w-4 h-4 text-editorial-muted" />
                          <span>{t("savedList")}</span>
                        </Link>

                        <Link
                          href="/profile?tab=wishlist"
                          onClick={() => setProfileOpen(false)}
                          className="px-4 py-2.5 text-sm text-editorial-text hover:bg-editorial-bg flex items-center gap-3 font-medium"
                        >
                          <Heart className="w-4 h-4 text-editorial-muted" />
                          <span>{t("wishlist")}</span>
                        </Link>
                        
                        <Link
                          href="/settings"
                          onClick={() => setProfileOpen(false)}
                          className="px-4 py-2.5 text-sm text-editorial-text hover:bg-editorial-bg flex items-center gap-3 font-medium"
                        >
                          <Settings className="w-4 h-4 text-editorial-muted" />
                          <span>{t("settings")}</span>
                        </Link>
                      </div>

                      {/* Theme Toggle */}
                      <div className="border-t border-editorial-border py-3 px-4">
                        <p className="text-[10px] font-bold text-editorial-muted uppercase tracking-wider mb-2">{t("theme")}</p>
                        <div className="flex bg-editorial-bg rounded-lg p-1">
                          <button
                            onClick={() => setTheme("light")}
                            title="Light Mode"
                            className={`flex-1 flex justify-center py-1.5 rounded-md transition-colors ${theme === "light" ? "bg-editorial-card shadow-sm text-editorial-text" : "text-editorial-muted hover:text-editorial-text"}`}
                          >
                            <Sun className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setTheme("dark")}
                            title="Dark Mode"
                            className={`flex-1 flex justify-center py-1.5 rounded-md transition-colors ${theme === "dark" ? "bg-editorial-card shadow-sm text-editorial-text" : "text-editorial-muted hover:text-editorial-text"}`}
                          >
                            <Moon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setTheme("system")}
                            title="System Mode"
                            className={`flex-1 flex justify-center py-1.5 rounded-md transition-colors ${theme === "system" ? "bg-editorial-card shadow-sm text-editorial-text" : "text-editorial-muted hover:text-editorial-text"}`}
                          >
                            <Monitor className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="border-t border-editorial-border py-2">
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 font-bold"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>{t("signOut")}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : null}

            {/* 3. Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden ml-2 p-2 text-editorial-text hover:bg-editorial-bg rounded-full transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-editorial-card border-b border-editorial-border overflow-hidden"
          >
            <nav className="flex flex-col px-4 py-6 space-y-4 font-semibold text-editorial-text text-lg">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="pb-2 border-b border-editorial-border">{t("home")}</Link>
              <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="pb-2 border-b border-editorial-border">{t("pages")}</Link>
              <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="pb-2 border-b border-editorial-border">{t("post")}</Link>
              <Link href="/explore" onClick={() => setMobileMenuOpen(false)} className="pb-2 border-b border-editorial-border">{t("exploreMaps")}</Link>
              {session && (
                <>
                  <Link href="/profile?tab=saved" onClick={() => setMobileMenuOpen(false)} className="pb-2 border-b border-editorial-border">{t("savedList")}</Link>
                  <Link href="/profile?tab=wishlist" onClick={() => setMobileMenuOpen(false)} className="pb-2 border-b border-editorial-border">{t("wishlist")}</Link>
                </>
              )}
              {session?.user?.role === "ADMIN" && (
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="pb-2 border-b border-editorial-border">{t("adminDashboard")}</Link>
              )}
              
              {/* Login option is hidden from public UI */}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Drawer Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            ref={searchRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-[72px] left-0 right-0 bg-editorial-card border-b border-editorial-border overflow-hidden shadow-lg z-40"
          >
            <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    setSearchOpen(false);
                    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                  }
                }}
                className="relative"
              >
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-editorial-muted" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("searchPlaceholderNav")}
                  className="w-full bg-editorial-bg border border-editorial-border text-editorial-text text-lg rounded-full py-4 pl-14 pr-12 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition-all font-medium placeholder-editorial-muted"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-editorial-bg rounded-full text-editorial-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
