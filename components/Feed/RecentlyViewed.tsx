"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Clock, History } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

export default function RecentlyViewed() {
  const { t } = useLanguage();
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("recentlyViewed");
      if (stored) {
        setRecentPosts(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  if (recentPosts.length === 0) return null;

  return (
    <section className="w-full py-16 relative overflow-hidden transition-colors duration-300">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-10 pb-4 border-b border-editorial-border">
          <h2 className="text-3xl font-black font-display text-editorial-text tracking-tight flex items-center gap-3">
            <History className="w-6 h-6 text-blue-600" />
            {t("recentlyViewed")}
          </h2>
          <p className="text-editorial-muted mt-2 font-medium">{t("jumpBackIn")}</p>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-8 snap-x hide-scrollbar scroll-smooth">
          {recentPosts.map((post) => (
            <Link 
              key={post.id} 
              href={`/blog/${post.slug}`}
              className="min-w-[280px] w-[280px] flex-shrink-0 snap-start bg-editorial-card rounded-2xl border border-editorial-border shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
            >
              <div className="h-44 w-full relative overflow-hidden bg-editorial-bg">
                {post.coverImage ? (
                  <img src={post.coverImage} alt={post.titleEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-800" />
                )}
                {post.category && (
                  <div className="absolute top-3 left-3 bg-white/95 dark:bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-black text-blue-900 dark:text-blue-400 tracking-wider uppercase shadow-sm">
                    {post.category}
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-display font-black text-lg text-editorial-text line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                  {post.titleEn}
                </h3>
                {post.excerptEn && (
                  <p className="text-xs text-editorial-muted mt-2.5 line-clamp-2 leading-relaxed font-medium">
                    {post.excerptEn}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
