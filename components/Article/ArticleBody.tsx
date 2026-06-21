import Image from "next/image";
import ProductCard, { Product } from "./ProductCard";

export interface ArticleParagraphBlock {
  type: "paragraph";
  text: string;
}

export interface ArticleBlockquoteBlock {
  type: "blockquote";
  text: string;
  cite?: string;
}

export interface ArticleImageBlock {
  type: "image";
  src: string;
  alt: string;
  caption?: string;
}

export interface ArticleProductBlock {
  type: "product";
  product: Product;
}

export type ArticleBlock =
  | ArticleParagraphBlock
  | ArticleBlockquoteBlock
  | ArticleImageBlock
  | ArticleProductBlock;

interface ArticleBodyProps {
  blocks: ArticleBlock[];
}

export default function ArticleBody({ blocks }: ArticleBodyProps) {
  return (
    <div className="max-w-3xl mx-auto py-12 px-1 space-y-8 font-sans">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "paragraph": {
            // Apply drop cap on the very first paragraph block
            if (index === 0) {
              const firstChar = block.text.charAt(0);
              const remainingText = block.text.slice(1);
              return (
                <p 
                  key={index} 
                  className="text-base sm:text-lg leading-relaxed text-editorial-text font-light tracking-wide first-line:uppercase first-line:tracking-wider"
                >
                  <span className="float-left text-5xl sm:text-6xl font-display font-black text-editorial-text mr-3 mt-1.5 line-height-none uppercase">
                    {firstChar}
                  </span>
                  {remainingText}
                </p>
              );
            }
            return (
              <p 
                key={index} 
                className="text-base sm:text-lg leading-relaxed text-editorial-text font-light tracking-wide"
              >
                {block.text}
              </p>
            );
          }

          case "blockquote":
            return (
              <blockquote 
                key={index} 
                className="my-10 pl-6 sm:pl-8 border-l-4 border-editorial-text py-2 space-y-2 max-w-2xl mx-auto"
              >
                <p className="font-display text-lg sm:text-2xl text-editorial-text leading-snug tracking-tight font-black uppercase">
                  “{block.text}”
                </p>
                {block.cite && (
                  <cite className="block text-[10px] font-bold tracking-widest text-editorial-muted uppercase not-italic">
                    — {block.cite}
                  </cite>
                )}
              </blockquote>
            );

          case "image":
            return (
              <figure key={index} className="my-12 space-y-3">
                <div className="relative w-full h-[45vh] sm:h-[55vh] border border-editorial-border overflow-hidden bg-editorial-card">
                  <Image
                    src={block.src}
                    alt={block.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover"
                  />
                </div>
                {block.caption && (
                  <figcaption className="text-center text-xs tracking-wider text-editorial-muted italic font-light">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          case "product":
            return (
              <ProductCard key={index} product={block.product} />
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
