import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Share2, Bookmark } from "lucide-react";

interface ArticleHeaderProps {
  post: {
    title: string;
    subtitle: string;
    category: string;
    date: string;
    readingTime: string;
    author: {
      name: string;
      avatar: string;
    };
  };
}

export default function ArticleHeader({ post }: ArticleHeaderProps) {
  return (
    <header className="space-y-8 max-w-3xl mx-auto py-8">
      {/* Navigation & Action Header */}
      <div className="flex justify-between items-center text-xs tracking-wider font-semibold text-editorial-muted">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 hover:text-editorial-text transition-colors duration-300"
          id="back-btn"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300" />
          <span>BACK TO JOURNAL</span>
        </Link>
        <div className="flex gap-4">
          <button 
            className="hover:text-editorial-text transition-colors flex items-center gap-1.5"
            aria-label="Share article"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">SHARE</span>
          </button>
          <button 
            className="hover:text-editorial-text transition-colors flex items-center gap-1.5"
            aria-label="Bookmark article"
          >
            <Bookmark className="w-4 h-4" />
            <span className="hidden sm:inline">SAVE</span>
          </button>
        </div>
      </div>

      {/* Main Metadata & Title */}
      <div className="space-y-6 text-center sm:text-left">
        <span className="inline-block text-xs font-bold tracking-widest text-editorial-text border-b border-editorial-text pb-0.5 uppercase">
          {post.category}
        </span>
        <h1 className="font-display text-3.5xl sm:text-5xl lg:text-6xl font-black tracking-tight text-editorial-text leading-tight uppercase">
          {post.title}
        </h1>
        <p className="font-sans text-base sm:text-lg text-editorial-muted leading-relaxed max-w-2xl font-light">
          {post.subtitle}
        </p>
      </div>

      {/* Author and Read Time Metadata Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-editorial-border">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-editorial-border">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div className="text-left text-xs">
            <p className="font-semibold text-editorial-text">{post.author.name}</p>
            <p className="text-editorial-muted">Editorial Contributor</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs tracking-wider text-editorial-muted font-bold">
          <span>{post.date}</span>
          <span className="w-1.5 h-1.5 bg-editorial-border rounded-full"></span>
          <span>{post.readingTime}</span>
        </div>
      </div>
    </header>
  );
}
