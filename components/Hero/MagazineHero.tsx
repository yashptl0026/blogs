import Link from "next/link";
import { Clock, TrendingUp } from "lucide-react";

interface Post {
  id: string;
  titleEn: string;
  slug: string;
  excerptEn: string;
  coverImage: string | null;
  bannerImage?: string | null;
  readingTime: string;
  categories?: { nameEn: string; slug: string }[];
  createdAt: Date;
}

interface MagazineHeroProps {
  featuredPost: Post | null;
  trendingPosts: Post[];
}

export default function MagazineHero({ featuredPost, trendingPosts }: MagazineHeroProps) {
  if (!featuredPost) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[600px] w-full">
        {/* Main Featured Article (Left 8 cols) */}
        <div className="col-span-1 lg:col-span-8 relative rounded-3xl overflow-hidden group h-[400px] lg:h-full">
          {featuredPost.bannerImage || featuredPost.coverImage ? (
            <img loading="lazy" decoding="async" 
              src={featuredPost.bannerImage || featuredPost.coverImage || ""} 
              alt={featuredPost.titleEn}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-editorial-bg" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full md:w-4/5">
            {featuredPost.categories && featuredPost.categories.length > 0 && (
              <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full mb-4">
                {featuredPost.categories[0].nameEn}
              </span>
            )}
            <Link href={`/blog/${featuredPost.slug}`}>
              <h2 className="text-3xl md:text-5xl font-black font-display text-white mb-4 leading-tight group-hover:underline decoration-white/50 underline-offset-4">
                {featuredPost.titleEn}
              </h2>
            </Link>
            <p className="text-gray-300 text-sm md:text-base line-clamp-2 mb-6 hidden md:block">
              {featuredPost.excerptEn}
            </p>
            <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {new Date(featuredPost.createdAt).toLocaleDateString()}
              </span>
              <span>•</span>
              <span>{featuredPost.readingTime || "5 min read"}</span>
            </div>
          </div>
        </div>

        {/* Trending Articles (Right 4 cols stacked) */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-6 h-full">
          {trendingPosts.map((post) => (
            <div key={post.id} className="flex-1 relative rounded-3xl overflow-hidden group min-h-[250px]">
              {post.coverImage ? (
                <img loading="lazy" decoding="async" 
                  src={post.coverImage || ""} 
                  alt={post.titleEn}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-editorial-bg" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              <div className="absolute bottom-0 left-0 p-6 w-full">
                {post.categories && post.categories.length > 0 && (
                  <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold rounded mb-3">
                    {post.categories[0].nameEn}
                  </span>
                )}
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="text-xl md:text-2xl font-black font-display text-white mb-2 leading-snug group-hover:underline decoration-white/50 underline-offset-4 line-clamp-2">
                    {post.titleEn}
                  </h3>
                </Link>
                <div className="flex items-center gap-4 text-[11px] font-medium text-gray-300">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-orange-400" /> Trending
                  </span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
