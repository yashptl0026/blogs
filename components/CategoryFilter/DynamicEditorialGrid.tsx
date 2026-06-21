"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import CategoryRibbon from "./CategoryRibbon";
import AdvancedFilterBar from "./AdvancedFilterBar";
import GridCard from "./GridCard";
import AdSenseBanner from "@/components/Feed/AdSenseBanner";
import { useLanguage } from "@/components/LanguageContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";

const getPaginationItems = (currentPage: number, totalPages: number) => {
  const items: (number | string)[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) items.push(i);
  } else {
    if (currentPage <= 3) {
      items.push(1, 2, 3, 4, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      items.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      items.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
  }
  return items;
};

interface Category {
  id: string;
  nameEn: string;
  nameHi?: string | null;
  nameGu?: string | null;
  slug: string;
  isTravel: boolean;
}

interface DynamicEditorialGridProps {
  isHomePage?: boolean;
}

export default function DynamicEditorialGrid({ isHomePage = true }: DynamicEditorialGridProps) {
  const { language, t } = useLanguage();

  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filter values
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const [activeCategorySlug, setActiveCategorySlug] = useState(initialCategory);

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam && categoryParam !== activeCategorySlug) {
      setActiveCategorySlug(categoryParam);
    }
  }, [searchParams]);
  const [filters, setFilters] = useState({
    search: "",
    stateId: "",
    districtId: "",
    talukaId: "",
    villageId: "",
    lat: null as number | null,
    lng: null as number | null,
  });

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch filtered posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        
        if (activeCategorySlug !== "all") {
          params.append("category", activeCategorySlug);
        }
        
        if (filters.search) params.append("search", filters.search);
        if (filters.stateId) params.append("stateId", filters.stateId);
        if (filters.districtId) params.append("districtId", filters.districtId);
        if (filters.talukaId) params.append("talukaId", filters.talukaId);
        if (filters.villageId) params.append("villageId", filters.villageId);
        if (filters.lat !== null) params.append("lat", filters.lat.toString());
        if (filters.lng !== null) params.append("lng", filters.lng.toString());
        if (filters.lat !== null && filters.lng !== null) {
          params.append("radius", "50"); // Default 50km radius for nearby search
        }

        const res = await fetch(`/api/posts?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setCurrentPage(1);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [activeCategorySlug, filters]);

  const categoryOptions = [
    { id: "1", nameEn: "Travel", slug: "travel", isTravel: true },
    { id: "2", nameEn: "Food", slug: "food", isTravel: true },
    { id: "3", nameEn: "Cooking", slug: "cooking", isTravel: true },
    { id: "4", nameEn: "Historical Places in India", slug: "historical-places", isTravel: true },
    { id: "5", nameEn: "State Wise", slug: "state-wise", isTravel: true },
    { id: "6", nameEn: "Photography", slug: "photography", isTravel: true },
    { id: "7", nameEn: "Lifestyle", slug: "lifestyle", isTravel: true },
    { id: "8", nameEn: "Spiritual Destinations", slug: "spiritual-destinations", isTravel: true },
  ];

  // Slice posts based on currentPage
  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const visiblePosts = posts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-8 text-left" id="library">
      {/* Advanced Hierarchical Dropdowns Filter Bar */}

      {/* Advanced Hierarchical Dropdowns Filter Bar */}
      <div className={isHomePage ? "hidden" : "block"}>
        <AdvancedFilterBar onFilterChange={setFilters} />
      </div>

      <div className="pt-8 text-center space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h2 className="text-3xl md:text-4xl font-black font-display text-editorial-text">{t("latestArticles")}</h2>
            <p className="text-editorial-muted text-sm mt-2">{t("latestArticlesDesc")}</p>
          </div>
          {isHomePage && (
            <Link 
              href="/explore" 
              className="px-6 py-2.5 bg-editorial-text text-editorial-bg rounded-full text-xs font-bold tracking-wide transition-colors shadow-sm"
            >
              View All Articles
            </Link>
          )}
        </div>

        {/* Tab-wise filter for Latest Articles */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pb-4">
        <button
          onClick={() => setActiveCategorySlug("all")}
          className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors border ${
            activeCategorySlug === "all"
              ? "bg-editorial-text text-editorial-bg border-editorial-text"
              : "bg-transparent text-editorial-muted border-editorial-border hover:border-editorial-text hover:text-editorial-text"
          }`}
        >
          {t("all")}
        </button>
          {categoryOptions.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategorySlug(cat.slug)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-colors ${activeCategorySlug === cat.slug
                  ? "bg-editorial-text text-editorial-bg"
                  : "bg-editorial-card text-editorial-muted border border-editorial-border hover:bg-editorial-bg"
                }`}
            >
              {cat.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Display */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
          {[1, 2, 3].map((n) => (
            <div key={n} className="border border-editorial-border p-5 space-y-4 animate-pulse rounded-3xl">
              <div className="bg-editorial-card aspect-[4/3] w-full rounded-2xl" />
              <div className="h-4 bg-editorial-card w-2/3 rounded" />
              <div className="h-3 bg-editorial-card w-full rounded" />
              <div className="h-3 bg-editorial-card w-full rounded" />
            </div>
          ))}
        </div>
      ) : visiblePosts.length === 0 ? (
        <div className="text-xs text-editorial-muted py-16 border border-dashed border-editorial-border bg-editorial-card/50 text-center font-sans rounded-3xl">
          {t("noPostsFound")}
        </div>
      ) : (
        <div className="space-y-12">
          {/* Post Items Grid with natural AdSense placements */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {visiblePosts.map((post, index) => {
                const elements = [];

                // Render standard article card
                elements.push(
                  <motion.div key={post.id} layout className="h-full">
                    <GridCard post={post} />
                  </motion.div>
                );

                // Render an AdSense Banner every 3 articles
                if ((index + 1) % 3 === 0) {
                  elements.push(
                    <motion.div
                      key={`ad-${post.id}`}
                      layout
                      className="col-span-1 sm:col-span-2 lg:col-span-3"
                    >
                      <AdSenseBanner slot={`feed-slot-${Math.ceil((index + 1) / 3)}`} />
                    </motion.div>
                  );
                }

                return elements;
              })}
            </AnimatePresence>
          </motion.div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center pt-8">
              <div className="inline-flex items-center gap-1 bg-editorial-card border border-editorial-border shadow-sm rounded-xl p-1.5 transition-colors">
                <button
                  onClick={() => {
                    setCurrentPage(prev => Math.max(prev - 1, 1));
                    document.getElementById("library")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-editorial-muted hover:bg-editorial-bg disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {getPaginationItems(currentPage, totalPages).map((item, i) => (
                  item === '...' ? (
                    <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-editorial-muted text-sm tracking-widest">
                      ...
                    </span>
                  ) : (
                    <button
                      key={`page-${item}`}
                      onClick={() => {
                        setCurrentPage(item as number);
                        document.getElementById("library")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                        currentPage === item
                          ? "bg-editorial-accent text-white shadow-sm"
                          : "text-editorial-text hover:bg-editorial-bg"
                      }`}
                    >
                      {item}
                    </button>
                  )
                ))}

                <button
                  onClick={() => {
                    setCurrentPage(prev => Math.min(prev + 1, totalPages));
                    document.getElementById("library")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-editorial-muted hover:bg-editorial-bg disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
