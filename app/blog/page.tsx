import Header from "@/components/Header";
import ModernFooter from "@/components/Footer/ModernFooter";
import DynamicEditorialGrid from "@/components/CategoryFilter/DynamicEditorialGrid";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "All Articles & Experiences | AESTHETE",
  description: "Browse our comprehensive collection of travel articles, local guides, and lifestyle stories. Find hidden spots and top destinations.",
  openGraph: {
    title: "All Articles | AESTHETE Travel Directory",
    description: "Browse our comprehensive collection of travel articles, local guides, and lifestyle stories.",
    type: "website",
  }
};

export default function BlogIndexPage() {
  return (
    <main className="min-h-screen flex flex-col bg-editorial-bg font-sans transition-colors duration-300">
      <Header />
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 pb-16">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black font-display text-editorial-text tracking-tight">
            All Articles
          </h1>
          <p className="text-editorial-muted text-lg mt-4 max-w-2xl">
            Explore our comprehensive collection of articles, guides, and stories from around the world.
          </p>
        </div>
        
        <Suspense fallback={<div className="py-20 text-center text-editorial-muted">Loading articles...</div>}>
          <DynamicEditorialGrid isHomePage={false} />
        </Suspense>
      </div>
      <ModernFooter />
    </main>
  );
}
