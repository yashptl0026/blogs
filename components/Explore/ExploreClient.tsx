"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import dynamic from "next/dynamic";
import GridCard from "@/components/CategoryFilter/GridCard";
import AdSenseSlot from "@/components/Ads/AdSenseSlot";

// Dynamically import the MapComponent with SSR disabled
const MapComponent = dynamic(() => import("./MapComponent"), { ssr: false });

interface ExploreClientProps {
  initialPosts: any[];
  categories: any[];
}

export default function ExploreClient({ initialPosts, categories }: ExploreClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  // Filtering and Sorting Logic
  const filteredPosts = useMemo(() => {
    let result = [...initialPosts];

    // 1. Filter by Search Query (Title, Excerpt, or Location)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter((post) => {
        const titleMatch = post.titleEn?.toLowerCase().includes(q);
        const excerptMatch = post.excerptEn?.toLowerCase().includes(q);
        const villageMatch = post.village?.nameEn?.toLowerCase().includes(q);
        const stateMatch = post.state?.nameEn?.toLowerCase().includes(q);
        return titleMatch || excerptMatch || villageMatch || stateMatch;
      });
    }

    // 2. Filter by Category
    if (selectedCategory) {
      result = result.filter((post) =>
        post.categories?.some((cat: any) => cat.id === selectedCategory)
      );
    }

    // 3. Sort Order
    if (sortOrder === "newest") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    return result;
  }, [initialPosts, searchQuery, selectedCategory, sortOrder]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">

      {/* LEFT SIDEBAR: FILTERS */}
      <div className="w-full lg:w-1/4 space-y-8">

        {/* Search Box */}
        <div className="bg-editorial-card p-5 rounded-2xl shadow-sm border border-editorial-border transition-colors duration-300">
          <h3 className="text-xs font-bold uppercase tracking-widest text-editorial-muted mb-4 flex items-center gap-2">
            <Search className="w-4 h-4" /> Search
          </h3>
          <input
            type="text"
            placeholder="Search places, waterfalls..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-editorial-bg border border-editorial-border px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-editorial-card transition-colors text-editorial-text placeholder:text-editorial-muted"
          />
        </div>

        {/* Category Filter */}
        <div className="bg-editorial-card p-5 rounded-2xl shadow-sm border border-editorial-border transition-colors duration-300">
          <h3 className="text-xs font-bold uppercase tracking-widest text-editorial-muted mb-4 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" /> Categories
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${selectedCategory === null ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "text-editorial-text hover:bg-editorial-bg"
                }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat.id ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "text-editorial-text hover:bg-editorial-bg"
                  }`}
              >
                {cat.nameEn}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Filter */}
        <div className="bg-editorial-card p-5 rounded-2xl shadow-sm border border-editorial-border transition-colors duration-300">
          <h3 className="text-xs font-bold uppercase tracking-widest text-editorial-muted mb-4 flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4" /> Sort By
          </h3>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
            className="w-full bg-editorial-bg border border-editorial-border px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-editorial-card transition-colors appearance-none text-editorial-text"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* AdSense Sidebar Placement */}
        <div className="hidden lg:block sticky top-24">
          <AdSenseSlot className="w-full h-[600px]" adSlot="SIDEBAR_LARGE" />
        </div>
      </div>

      {/* RIGHT SIDE: RESULTS GRID */}
      <div className="w-full lg:w-3/4 flex flex-col gap-6">

        {/* Top AdSense Banner (Mobile/Tablet) */}
        <div className="lg:hidden">
          <AdSenseSlot className="w-full h-24" adSlot="MOBILE_BANNER" responsive="false" />
        </div>

        {/* Top Header Row */}
        <div className="flex items-center justify-between pb-4 border-b border-editorial-border">
          <h2 className="text-2xl font-black font-display text-editorial-text">
            {filteredPosts.length} Results Found
          </h2>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-700 underline"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Interactive Map Component */}
        {/* <MapComponent posts={filteredPosts} /> */}

        {/* Grid Container */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post, index) => {
                // AdSense Injection Logic: After every 5th post, inject an Ad slot across the full row
                const isAdInjectionPoint = (index + 1) % 6 === 0;

                return (
                  <React.Fragment key={post.id}>
                    <div className="col-span-1 h-full">
                      <GridCard post={post} />
                    </div>
                    {isAdInjectionPoint && (
                      <div className="col-span-1 md:col-span-2 xl:col-span-3 w-full py-4" key={`ad-${post.id}`}>
                        <AdSenseSlot className="w-full h-[150px]" adSlot="IN_FEED_AD" format="fluid" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-editorial-bg rounded-full flex items-center justify-center mb-4 border border-editorial-border">
              <Search className="w-8 h-8 text-editorial-muted" />
            </div>
            <h3 className="text-xl font-bold text-editorial-text mb-2">No articles found</h3>
            <p className="text-editorial-muted">Try adjusting your filters or search keywords.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
              }}
              className="mt-6 bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
