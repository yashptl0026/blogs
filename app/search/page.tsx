import { getAllPosts } from "@/lib/mdx";
import Header from "@/components/Header";
import ModernFooter from "@/components/Footer/ModernFooter";
import Link from "next/link";
import { Search as SearchIcon, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SearchPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const params = await searchParams;
  const q = params.q;
  const query = typeof q === 'string' ? q : Array.isArray(q) ? q[0] : "";

  let results: any[] = [];
  
  if (query.trim()) {
    const searchPattern = query.toLowerCase();
    const allPosts = getAllPosts();
    results = allPosts.filter(p => {
      if (!p?.published) return false;
      return (
        (p.titleEn && p.titleEn.toLowerCase().includes(searchPattern)) ||
        (p.excerptEn && p.excerptEn.toLowerCase().includes(searchPattern)) ||
        (p.content && p.content.toLowerCase().includes(searchPattern)) ||
        (p.titleHi && p.titleHi.toLowerCase().includes(searchPattern)) ||
        (p.titleGu && p.titleGu.toLowerCase().includes(searchPattern))
      );
    });
  }

  return (
    <main className="min-h-screen flex flex-col bg-editorial-bg font-sans">
      <Header />
      
      <div className="flex-1 pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-editorial-muted hover:text-blue-600 transition-colors mb-6 font-semibold text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-black font-display text-editorial-text tracking-tight">
            Search Results
          </h1>
          <p className="text-editorial-muted mt-3 text-lg">
            {query ? `Showing results for "${query}"` : "Enter a search query to find articles."}
          </p>
        </div>

        {query && results.length === 0 ? (
          <div className="bg-editorial-card p-12 rounded-3xl border border-dashed border-editorial-border text-center text-editorial-muted flex flex-col items-center justify-center">
            <SearchIcon className="w-12 h-12 text-editorial-muted mb-4" />
            <h3 className="text-xl font-bold text-editorial-text mb-2 font-display">No articles found</h3>
            <p className="max-w-md mx-auto">We couldn't find any articles matching "{query}". Try using different keywords or checking for typos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-editorial-card rounded-2xl overflow-hidden border border-editorial-border hover:shadow-xl transition-all block flex flex-col h-full">
                <div className="h-48 relative overflow-hidden flex-shrink-0">
                  <img src={post.coverImage || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=100&w=600&auto=format&fit=crop"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={post.titleEn} />
                  {post.categories && post.categories.length > 0 && (
                    <span className="absolute top-4 left-4 bg-editorial-card/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full text-editorial-text shadow-sm">
                      {post.categories[0].nameEn}
                    </span>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold font-display text-editorial-text line-clamp-2 mb-2 group-hover:text-blue-600 leading-snug">{post.titleEn}</h3>
                  <p className="text-sm text-editorial-muted line-clamp-2 mb-4 flex-1">{post.excerptEn}</p>
                  <div className="flex items-center justify-between text-xs font-semibold text-editorial-muted pt-4 border-t border-editorial-border mt-auto">
                    <span>{post.author?.name || 'Aesthete'}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <ModernFooter />
    </main>
  );
}
