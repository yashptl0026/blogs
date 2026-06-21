import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import EditorialImage from "./EditorialImage";

export interface ProductHotspot {
  id: string;
  x: number;
  y: number;
  name: string;
  category: string;
  price: string;
  link: string;
}

export interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  readingTime: string;
  slug: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
  };
  products: ProductHotspot[];
}

interface HeroLayoutProps {
  featuredPost: BlogPost;
}

export default function HeroLayout({ featuredPost }: HeroLayoutProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
      {/* Editorial Image Showcase (Left) - Takes 7 Cols on desktop */}
      <div className="md:col-span-7 w-full h-[50vh] md:h-[65vh] relative rounded-none overflow-hidden order-1 md:order-1 border border-editorial-border shadow-sm">
        <EditorialImage 
          src={featuredPost.coverImage} 
          alt={featuredPost.title} 
          products={featuredPost.products}
        />
      </div>

      {/* Copy & Typographic Layout (Right) - Takes 5 Cols on desktop */}
      <article className="md:col-span-5 flex flex-col justify-between h-full space-y-8 order-2 md:order-2 md:pl-4">
        <div className="space-y-6">
          {/* Post Meta Data Row */}
          <div className="flex items-center gap-3 text-[10px] font-bold tracking-widest text-editorial-muted">
            <span className="bg-editorial-card text-editorial-text px-2 py-0.5 border border-editorial-border">
              {featuredPost.category}
            </span>
            <span className="w-1.5 h-1.5 bg-editorial-border rounded-full"></span>
            <span>{featuredPost.readingTime}</span>
          </div>

          {/* Headline Display */}
          <h1 className="font-display text-3xl md:text-4.5xl leading-tight font-black tracking-tighter text-editorial-text">
            {featuredPost.title}
          </h1>

          {/* Subtitle / Narrative */}
          <p className="font-sans text-sm md:text-base leading-relaxed text-editorial-muted font-light max-w-lg">
            {featuredPost.subtitle}
          </p>
        </div>

        {/* Author Details & CTA Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-6 border-t border-editorial-border">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-editorial-border">
              <Image
                src={featuredPost.author.avatar}
                alt={featuredPost.author.name}
                fill
                sizes="36px"
                className="object-cover"
              />
            </div>
            <div className="text-left text-xs">
              <p className="text-[9px] font-bold text-editorial-muted">Written By</p>
              <p className="font-semibold text-editorial-text">{featuredPost.author.name}</p>
            </div>
          </div>

          <Link
            href={`/blog/${featuredPost.slug}`}
            className="inline-flex items-center justify-center bg-editorial-text text-white px-5 py-3 hover:bg-editorial-muted transition-colors duration-300 font-display text-[9px] font-bold tracking-widest rounded-none shadow-sm"
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
