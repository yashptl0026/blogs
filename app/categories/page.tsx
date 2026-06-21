import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import ModernFooter from "@/components/Footer/ModernFooter";
import { getAllCategories, getPostsByCategory } from "@/lib/mdx";

export const revalidate = 60;

export default async function CategoriesPage() {
  const cats = getAllCategories();
  const categories = cats.map((cat: any) => {
    const posts = getPostsByCategory(cat.slug);
    return { ...cat, _count: { posts: posts.length } };
  }).sort((a: any, b: any) => b._count.posts - a._count.posts);

  return (
    <main className="min-h-screen flex flex-col bg-editorial-bg font-sans">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-editorial-card border-b border-editorial-border">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black font-display text-editorial-text tracking-tight mb-6">
            Explore Topics
          </h1>
          <p className="text-editorial-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Discover breathtaking destinations, local culture, and insider travel tips organized by category.
          </p>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                href={`/categories/${category.slug}`}
                className="group bg-editorial-card p-8 rounded-3xl border border-editorial-border hover:border-blue-500/30 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/10 rounded-bl-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-150" />
                <div className="relative z-10">
                  <h2 className="text-2xl font-black font-display text-editorial-text mb-2 group-hover:text-blue-600 transition-colors">
                    {category.nameEn}
                  </h2>
                  <p className="text-sm font-semibold text-editorial-muted mb-8">
                    {category._count.posts} Articles
                  </p>
                  <div className="flex items-center text-sm font-bold text-blue-600">
                    Explore <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ModernFooter />
    </main>
  );
}
