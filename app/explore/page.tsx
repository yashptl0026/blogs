import { getAllPosts, getAllCategories } from "@/lib/mdx";
import Header from "@/components/Header";
import ModernFooter from "@/components/Footer/ModernFooter";
import ExploreClient from "@/components/Explore/ExploreClient";

export default async function ExplorePage() {
  const posts = getAllPosts().filter(p => p?.published);
  const categories = getAllCategories();

  return (
    <main className="min-h-screen flex flex-col bg-editorial-bg font-sans transition-colors duration-300">
      <Header />
      
      {/* Background Gradient for Header Area */}
      <div className="bg-editorial-card border-b border-editorial-border pt-10 pb-6 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black font-display text-editorial-text tracking-tight">
            Explore <span className="text-editorial-accent">Journals</span>
          </h1>
          <p className="mt-4 text-editorial-muted max-w-2xl mx-auto font-light">
            Discover breathtaking destinations, hidden waterfalls, and cultural deep-dives curated by our expert editorial team.
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Pass the data to the interactive Client Component */}
        <ExploreClient initialPosts={posts} categories={categories} />
      </div>

      <ModernFooter />
    </main>
  );
}
