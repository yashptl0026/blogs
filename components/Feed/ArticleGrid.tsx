"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FilterBar from "./FilterBar";
import ArticleCard, { ArticleFeedItem } from "./ArticleCard";

const MOCK_FEED_ARTICLES: ArticleFeedItem[] = [
  {
    id: "feed-1",
    title: "Raw Materiality: Designing with Unfinished Travertine",
    excerpt: "Exploring the volcanic stone's resurgence in high-end design, embracing natural pittings and earth-hued tones.",
    category: "DESIGN",
    date: "June 05, 2026",
    readingTime: "4 min read",
    slug: "raw-materiality-unfinished-travertine",
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    variant: "shoppable",
    product: {
      name: "Travertine Side Table",
      price: "$620",
      image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=300&auto=format&fit=crop",
      link: "/shop/travertine-side-table",
    },
  },
  {
    id: "feed-2",
    title: "Tactile Textures: The Resurgence of Belgian Linen in Soft Goods",
    excerpt: "How Belgian linen weaves raw comfort and architectural structure into contemporary drapery and upholstery.",
    category: "TEXTILES",
    date: "June 03, 2026",
    readingTime: "3 min read",
    slug: "tactile-textures-belgian-linen-soft-goods",
    coverImage: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop",
    variant: "clean-grid",
  },
  {
    id: "feed-3",
    title: "The Nomad's Journal: Finding Quietness in Kyoto's Wooden Temples",
    excerpt: "A photo essay mapping Kyoto's architectural preservation, exploring standard Zen timber temples and rock gardens.",
    category: "TRAVEL",
    date: "May 28, 2026",
    readingTime: "6 min read",
    slug: "nomads-journal-kyoto-wooden-temples",
    coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1600&auto=format&fit=crop",
    variant: "editorial-list",
  },
  {
    id: "feed-4",
    title: "A Study of Curated Shadows in Soft Minimalist Interiors",
    excerpt: "Why the omission of overhead lighting and the embrace of localized table glow creates cognitive calm.",
    category: "INTERIORS",
    date: "May 20, 2026",
    readingTime: "4 min read",
    slug: "study-curated-shadows-minimalist-interiors",
    coverImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop",
    variant: "clean-grid",
  },
];

const CATEGORIES = ["ALL", "INTERIORS", "DESIGN", "TRAVEL", "TEXTILES"];

export default function ArticleGrid() {
  const [activeCategory, setActiveCategory] = useState("ALL");

  const filteredArticles = MOCK_FEED_ARTICLES.filter((article) => {
    if (activeCategory === "ALL") return true;
    return article.category.toUpperCase() === activeCategory.toUpperCase();
  });

  return (
    <div className="space-y-12">
      {/* Category Selection Filter */}
      <FilterBar
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Grid of Dynamic Cards */}
      <motion.div 
        layout 
        className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-x-12"
      >
        <AnimatePresence mode="popLayout">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className={article.variant === "editorial-list" ? "col-span-12" : "col-span-12 md:col-span-6"}
            >
              <ArticleCard article={article} />
            </div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
