"use client";

import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import EditorialImage from "./EditorialImage";

interface HeroLayoutClientProps {
  featuredPost: any;
}

export default function HeroLayoutClient({ featuredPost }: HeroLayoutClientProps) {
  const { language } = useLanguage();

  const title = getTranslation(featuredPost, "title", language);
  const excerpt = getTranslation(featuredPost, "excerpt", language);

  const defaultHotspots = [
    {
      id: "p1",
      x: 48,
      y: 65,
      name: "Oak Wabi-Sabi Lounge Chair",
      category: "Furniture",
      price: "$1,850",
      link: "/shop/wabi-sabi-lounge-chair",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center text-left">
      {/* Editorial Image Showcase (Left) - Takes 7 Cols on desktop */}
      <div className="md:col-span-7 w-full h-[50vh] md:h-[65vh] relative rounded-none overflow-hidden order-1 md:order-1 border border-travel-border shadow-premium">
        <EditorialImage 
          src={featuredPost.bannerImage || featuredPost.coverImage} 
          alt={title} 
          products={defaultHotspots}
        />
      </div>

      {/* Copy & Typographic Layout (Right) - Takes 5 Cols on desktop */}
      <article className="md:col-span-5 flex flex-col justify-between h-full space-y-8 order-2 md:order-2 md:pl-4 font-sans">
        <div className="space-y-6">
          {/* Post Meta Data Row */}
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold tracking-widest text-travel-muted">
            {featuredPost.categories && featuredPost.categories.length > 0 ? (
              <span className="bg-travel-dark text-travel-offwhite px-2 py-0.5 border border-travel-border uppercase font-display">
                {getTranslation(featuredPost.categories[0], "name", language)}
              </span>
            ) : (
              <span className="bg-travel-dark text-travel-offwhite px-2 py-0.5 border border-travel-border uppercase font-display">
                TRAVEL
              </span>
            )}
            <span className="w-1.5 h-1.5 bg-travel-border rounded-full"></span>
            <span>{featuredPost.readingTime}</span>
            {featuredPost.state && (
              <>
                <span className="w-1.5 h-1.5 bg-travel-border rounded-full"></span>
                <span className="flex items-center gap-0.5 text-travel-accent">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{getTranslation(featuredPost.state, "name", language)}</span>
                </span>
              </>
            )}
          </div>

          {/* Headline Display */}
          <h2 className="font-display text-2.5xl md:text-4.5xl leading-tight font-black tracking-tight text-travel-dark uppercase">
            {title}
          </h2>

          {/* Subtitle / Narrative */}
          <p className="font-sans text-sm md:text-base leading-relaxed text-travel-muted font-light max-w-lg">
            {excerpt}
          </p>
        </div>

        {/* Author Details & CTA Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-6 border-t border-travel-border mt-8">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-travel-border bg-travel-gray">
              {featuredPost.author.image ? (
                <img
                  src={featuredPost.author.image}
                  alt={featuredPost.author.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-xs text-travel-muted">
                  {featuredPost.author.name?.charAt(0)}
                </div>
              )}
            </div>
            <div className="text-left text-xs">
              <p className="text-[9px] font-bold text-travel-muted uppercase">Written By</p>
              <p className="font-semibold text-travel-dark">{featuredPost.author.name}</p>
            </div>
          </div>

          <Link
            href={`/blog/${featuredPost.slug}`}
            className="inline-flex items-center justify-center bg-travel-dark text-travel-offwhite px-5 py-3 hover:bg-travel-accent transition-colors duration-300 font-display text-[9px] font-bold tracking-widest rounded-none shadow-premium uppercase"
            id="read-journal-cta"
          >
            <span>Read Journal</span>
            <ArrowRight className="w-3.5 h-3.5 ml-2" />
          </Link>
        </div>
      </article>
    </div>
  );
}
