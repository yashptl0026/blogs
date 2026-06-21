import Header from "@/components/Header";
import ModernHero from "@/components/Hero/ModernHero";
import DynamicEditorialGrid from "@/components/CategoryFilter/DynamicEditorialGrid";
import TrendingTopicsRibbon from "@/components/CategoryFilter/TrendingTopicsRibbon";
import FeaturedArticles from "@/components/Feed/FeaturedArticles";
import RecentlyViewed from "@/components/Feed/RecentlyViewed";
import NewsletterBanner from "@/components/Newsletter/NewsletterBanner";
import SpotlightSection from "@/components/Spotlight/SpotlightSection";
import ValuePropSection from "@/components/ValueProp/ValuePropSection";
import TestimonialSection from "@/components/Testimonial/TestimonialSection";
import DestinationsSection from "@/components/Destinations/DestinationsSection";
import ModernFooter from "@/components/Footer/ModernFooter";
import { Suspense } from "react";

import { Metadata } from "next";

export const revalidate = 60; // Revalidate every minute

export const metadata: Metadata = {
  title: "AESTHETE | Discover India's Hidden Gems & Premium Destinations",
  description: "Explore the best travel destinations, experiences, and cultural deep dives across India. Filter by state, district, or nearby radius to find your next adventure.",
  keywords: ["India travel", "hidden gems", "premium destinations", "travel blog", "tourism"],
  openGraph: {
    title: "AESTHETE | Premium Indian Travel Directory",
    description: "Explore the best travel destinations, experiences, and cultural deep dives across India.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AESTHETE | Premium Indian Travel Directory",
    description: "Explore the best travel destinations, experiences, and cultural deep dives across India.",
  }
};

export default async function Home() {
  return (
    <main className="min-h-screen w-full flex flex-col bg-editorial-bg font-sans transition-colors duration-300">
      {/* Global Navigation Header */}
      <Header />

      {/* 1. Full Banner Hero Section */}
      <ModernHero />

      <div className="relative z-10 -mt-10 bg-editorial-bg rounded-t-3xl border-t border-editorial-border shadow-[0_-10px_40px_rgba(0,0,0,0.05)] transition-colors duration-300">
        
        {/* 2. Trending Topics (Moved to Top) */}
        <TrendingTopicsRibbon />

        {/* 3. Featured Articles */}
        <FeaturedArticles />
        
        {/* 4. Recently Viewed */}
        <RecentlyViewed />

        {/* 5. Browse Category & Latest Articles Feed */}
        <section className="w-full py-16 pb-8 transition-colors duration-300" aria-label="Journal Library">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <Suspense fallback={<div className="h-96 animate-pulse bg-editorial-card rounded-3xl w-full"></div>}>
              <DynamicEditorialGrid isHomePage={true} />
            </Suspense>
          </div>
        </section>
      </div>

      {/* 4. Newsletter Banner (Get Discount equivalent) */}
      <NewsletterBanner />

      {/* 5. Spotlight Section (Black Coffee equivalent) */}
      <SpotlightSection />

      {/* 6. Value Prop Section (We find perfect place equivalent) */}
      <ValuePropSection />

      {/* 7. Testimonial Section (Hear from happy clients equivalent) */}
      <TestimonialSection />

      {/* 8. Popular Destinations / Topics (Search destination by city equivalent) */}
      <DestinationsSection />

      {/* 9. Modern Footer with Offers and Links */}
      <ModernFooter />
    </main>
  );
}
