"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ShoppingBag } from "lucide-react";

export interface ArticleFeedItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingTime: string;
  slug: string;
  coverImage: string;
  variant: "editorial-list" | "clean-grid" | "shoppable";
  product?: {
    name: string;
    price: string;
    image: string;
    link: string;
  };
}

interface ArticleCardProps {
  article: ArticleFeedItem;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  // 1. Editorial List Card Variant (Full Width Split Row)
  if (article.variant === "editorial-list") {
    return (
      <motion.article 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="col-span-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-editorial-border pb-12"
      >
        <Link href={`/blog/${article.slug}`} className="md:col-span-7 block relative w-full h-[35vh] md:h-[45vh] overflow-hidden group border border-editorial-border">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>
        <div className="md:col-span-5 space-y-4">
          <div className="flex gap-4 text-xs font-bold text-editorial-muted tracking-widest">
            <span className="text-editorial-accent">{article.category}</span>
            <span>{article.readingTime}</span>
          </div>
          <Link href={`/blog/${article.slug}`} className="group block">
            <h3 className="font-serif text-2xl md:text-3.5xl leading-tight font-medium hover:text-editorial-accent transition-colors duration-300">
              {article.title}
            </h3>
          </Link>
          <p className="text-sm text-editorial-muted leading-relaxed font-sans font-light">
            {article.excerpt}
          </p>
          <Link href={`/blog/${article.slug}`} className="inline-flex items-center gap-1 text-xs font-bold tracking-widest hover:text-editorial-accent transition-colors">
            <span>READ STORY</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </motion.article>
    );
  }

  // 2. Shoppable Grid Card Variant (Hover states overlay)
  if (article.variant === "shoppable" && article.product) {
    return (
      <motion.article 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="col-span-12 sm:col-span-6 lg:col-span-6 space-y-4 group/shop"
      >
        <div className="relative w-full h-80 overflow-hidden border border-editorial-border bg-editorial-border">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 30vw"
            className="object-cover transition-transform duration-1000 ease-out group-hover/shop:scale-105"
          />
          {/* Shoppable Tag Drawer Overlay */}
          <div className="absolute inset-0 bg-editorial-text/10 group-hover/shop:bg-editorial-text/20 transition-all duration-300 flex flex-col justify-end p-4 opacity-0 group-hover/shop:opacity-100">
            <motion.div 
              initial={{ y: 20 }}
              whileInView={{ y: 0 }}
              className="bg-white/95 backdrop-blur-md p-4 border border-editorial-border flex justify-between items-center"
            >
              <div className="text-left">
                <span className="block text-[8px] font-bold text-editorial-accent uppercase tracking-widest">SHOP THE ARTICLE</span>
                <span className="block text-xs font-bold text-editorial-text truncate max-w-[150px]">{article.product.name}</span>
                <span className="block text-xs font-bold text-editorial-muted">{article.product.price}</span>
              </div>
              <Link href={article.product.link} className="bg-editorial-text text-white p-2.5 hover:bg-editorial-accent transition-colors">
                <ShoppingBag className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-xs font-bold text-editorial-accent tracking-widest uppercase">{article.category}</div>
          <Link href={`/blog/${article.slug}`}>
            <h3 className="font-serif text-xl font-medium hover:text-editorial-accent transition-colors duration-300">
              {article.title}
            </h3>
          </Link>
        </div>
      </motion.article>
    );
  }

  // 3. Clean Grid Card Variant (Default)
  return (
    <motion.article 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="col-span-12 sm:col-span-6 lg:col-span-6 space-y-4"
    >
      <Link href={`/blog/${article.slug}`} className="block relative w-full h-80 overflow-hidden group border border-editorial-border">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, 30vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </Link>
      <div className="space-y-2 text-left">
        <div className="flex gap-4 text-[10px] font-bold text-editorial-muted tracking-widest uppercase">
          <span className="text-editorial-accent">{article.category}</span>
          <span>{article.readingTime}</span>
        </div>
        <Link href={`/blog/${article.slug}`}>
          <h3 className="font-serif text-xl font-medium hover:text-editorial-accent transition-colors duration-300 leading-snug">
            {article.title}
          </h3>
        </Link>
        <p className="text-xs text-editorial-muted leading-relaxed font-light line-clamp-2">
          {article.excerpt}
        </p>
      </div>
    </motion.article>
  );
}
