"use client";

import React, { useRef } from "react";
import { useLanguage } from "@/components/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, Plane, Briefcase, TrendingUp,
  Camera, Trophy, Tent, Utensils, ChefHat, Landmark, MapPin,
  Sparkles, LayoutGrid, Heart
} from "lucide-react";

const getCategoryIcon = (slug: string) => {
  switch (slug.toLowerCase()) {
    case "travel": return <Plane className="w-6 h-6 md:w-8 md:h-8 mb-2 text-white" strokeWidth={1.5} />;
    case "business": return <Briefcase className="w-6 h-6 md:w-8 md:h-8 mb-2 text-white" strokeWidth={1.5} />;
    case "marketing": return <TrendingUp className="w-6 h-6 md:w-8 md:h-8 mb-2 text-white" strokeWidth={1.5} />;
    case "photography": return <Camera className="w-6 h-6 md:w-8 md:h-8 mb-2 text-white" strokeWidth={1.5} />;
    case "sports": return <Trophy className="w-6 h-6 md:w-8 md:h-8 mb-2 text-white" strokeWidth={1.5} />;
    case "outdoors": return <Tent className="w-6 h-6 md:w-8 md:h-8 mb-2 text-white" strokeWidth={1.5} />;
    case "food": return <Utensils className="w-6 h-6 md:w-8 md:h-8 mb-2 text-white" strokeWidth={1.5} />;
    case "cooking": return <ChefHat className="w-6 h-6 md:w-8 md:h-8 mb-2 text-white" strokeWidth={1.5} />;
    case "historical-places": return <Landmark className="w-6 h-6 md:w-8 md:h-8 mb-2 text-white" strokeWidth={1.5} />;
    case "state-wise": return <MapPin className="w-6 h-6 md:w-8 md:h-8 mb-2 text-white" strokeWidth={1.5} />;
    case "lifestyle": return <Heart className="w-6 h-6 md:w-8 md:h-8 mb-2 text-white" strokeWidth={1.5} />;
    case "spiritual":
    case "spritual":
    case "spiritual-destinations": return <Sparkles className="w-6 h-6 md:w-8 md:h-8 mb-2 text-white" strokeWidth={1.5} />;
    default: return <Sparkles className="w-6 h-6 md:w-8 md:h-8 mb-2 text-white" strokeWidth={1.5} />;
  }
};

interface Category {
  id?: string;
  nameEn: string;
  nameHi?: string | null;
  nameGu?: string | null;
  slug: string;
  isTravel?: boolean;
}

interface CategoryRibbonProps {
  categories: Category[];
  activeCategory: string; // Active category slug
  onCategoryChange: (slug: string) => void;
}

// Map category slugs to a generic set of images for the background
const getCategoryImage = (slug: string) => {
  switch (slug.toLowerCase()) {
    case "travel": return "/category/travel.png";
    case "photography": return "/category/photography.png";
    case "food": return "/category/food.png";
    case "cooking": return "/category/cook.png";
    case "historical-places": return "/category/history.png";
    case "state-wise": return "/category/state.png";
    case "lifestyle": return "/category/lifestyle.png";
    case "spiritual":
    case "spritual":
    case "spiritual-destinations": return "/category/spritual.png";
    // Fallbacks to existing local assets for unmapped categories
    case "business": return "/category/lifestyle.png";
    case "marketing": return "/category/lifestyle.png";
    case "sports": return "/category/travel.png";
    case "outdoors": return "/category/travel.png";
    default: return "/category/travel.png";
  }
};

export default function CategoryRibbon({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryRibbonProps) {
  const { language, t } = useLanguage();
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full bg-transparent mb-8 min-w-0 overflow-hidden relative transition-colors duration-300">

      {/* Header section matching new design */}
      <div className="flex justify-between items-center mb-8 max-w-7xl mx-auto w-full">
        <h3 className="text-2xl md:text-3xl font-bold text-editorial-text font-display transition-colors">{t("trendingTopics")}</h3>
        <div className="flex items-center gap-4">
          <Link href="/categories" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-editorial-accent transition-colors underline decoration-editorial-border underline-offset-4">
            {t("viewAllCategories")}
          </Link>
        </div>
      </div>

      {/* Infinite Slider Container */}
      <div className="relative group overflow-hidden w-full flex py-6 -my-6">
        <div className="flex animate-marquee gap-5 w-max hover:[animation-play-state:paused]">
          {[...categories, ...categories].map((category, index) => {
            const isActive = activeCategory === category.slug;
            const bgImage = getCategoryImage(category.slug);
            const categoryName = getTranslation(category, "name", language);

            return (
              <button
                key={`${category.slug || category.nameEn}-${index}`}
                onClick={() => onCategoryChange(category.slug)}
                className={`relative flex flex-col justify-end w-48 h-48 rounded-[1.5rem] overflow-hidden text-center transition-all duration-500 shrink-0 ${isActive
                  ? "ring-2 ring-editorial-text scale-105 shadow-[0_10px_30px_rgba(0,0,0,0.2)] z-10 mx-2"
                  : "shadow-sm hover:scale-105 hover:shadow-lg opacity-90 hover:opacity-100"
                  }`}
              >
                {/* Background Image */}
                <Image
                  src={bgImage}
                  alt={categoryName}
                  fill
                  quality={100}
                  sizes="(max-width: 768px) 384px, 512px"
                  className={`object-cover transition-transform duration-700 ease-out ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                />

                {/* Dark Gradient Overlay for text readability */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-80'}`}></div>

                {/* Content aligned centrally with icon */}
                <div className={`relative z-10 w-full p-4 flex flex-col items-center justify-end pb-6 h-full transition-transform duration-500 ${isActive ? 'translate-y-0' : 'translate-y-2 group-hover:translate-y-0'}`}>
                  {getCategoryIcon(category.slug)}
                  <h4 className="text-white font-bold text-sm md:text-base tracking-wide drop-shadow-md">
                    {categoryName}
                  </h4>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
