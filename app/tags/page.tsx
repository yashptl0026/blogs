import Link from "next/link";
import Header from "@/components/Header";
import ModernFooter from "@/components/Footer/ModernFooter";
import { getAllTags, getPostsByTag } from "@/lib/mdx";

export const revalidate = 60;

export default async function TagsPage() {
  const allTags = getAllTags();
  const tags = allTags.map((tag: any) => {
    const posts = getPostsByTag(tag.slug);
    return { ...tag, _count: { posts: posts.length } };
  }).sort((a: any, b: any) => b._count.posts - a._count.posts);

  return (
    <main className="min-h-screen flex flex-col bg-editorial-bg font-sans">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-editorial-card border-b border-editorial-border">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black font-display text-editorial-text tracking-tight mb-6">
            All Tags
          </h1>
          <p className="text-editorial-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Browse through our extensive collection of tags to find exactly what you're looking for.
          </p>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tags.map((tag: any) => (
              <Link 
                key={tag.id} 
                href={`/tags/${tag.slug}`}
                className="bg-editorial-card border border-editorial-border px-5 py-2.5 rounded-full text-sm font-bold text-editorial-text hover:border-blue-600 hover:text-blue-600 hover:shadow-md transition-all flex items-center gap-2"
              >
                #{tag.name}
                <span className="bg-editorial-bg text-editorial-muted px-2 py-0.5 rounded-full text-[10px]">
                  {tag._count.posts}
                </span>
              </Link>
            ))}
            
            {tags.length === 0 && (
               <div className="w-full text-center py-20 text-editorial-muted italic">No tags found.</div>
            )}
          </div>
        </div>
      </section>

      <ModernFooter />
    </main>
  );
}
