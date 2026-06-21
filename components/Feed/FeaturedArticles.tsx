"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GridCard from "@/components/CategoryFilter/GridCard";
import { useLanguage } from "@/components/LanguageContext";

export default function FeaturedArticles() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("/api/posts?featured=true");
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (err) {
        console.error("Failed to fetch featured posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (!loading && posts.length === 0) {
    return null; // Don't show the section if there are no featured posts
  }

  return (
    <section className="w-full pt-20 pb-16 relative overflow-hidden transition-colors duration-300">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        <div className="max-w-7xl mx-auto mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-black font-display text-editorial-text tracking-tight flex items-center gap-3 transition-colors">
              {t("premiumSelection")}
              <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
            </h2>
            <p className="text-editorial-muted mt-2 text-sm md:text-base font-medium">{t("editorsChoice")}</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="border border-travel-border p-5 space-y-4 animate-pulse rounded-3xl">
                <div className="bg-travel-gray aspect-[4/3] w-full rounded-2xl" />
                <div className="h-4 bg-travel-gray w-2/3 rounded" />
                <div className="h-3 bg-travel-gray w-full rounded" />
                <div className="h-3 bg-travel-gray w-full rounded" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {posts.slice(0, 6).map((post) => (
                <motion.div key={post.id} layout className="h-full">
                  <GridCard post={post} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
