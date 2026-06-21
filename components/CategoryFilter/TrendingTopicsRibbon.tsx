"use client";

import { useRouter } from "next/navigation";
import CategoryRibbon from "./CategoryRibbon";

export default function TrendingTopicsRibbon() {
  const router = useRouter();
  
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

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-4 relative z-20 transition-colors duration-300">
      <CategoryRibbon
        categories={categoryOptions}
        activeCategory=""
        onCategoryChange={(slug) => {
          router.push(`/?category=${slug}#library`);
        }}
      />
    </div>
  );
}
