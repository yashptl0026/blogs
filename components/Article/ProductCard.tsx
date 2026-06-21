import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  link: string;
  description?: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="my-12 p-6 border border-editorial-border bg-editorial-card flex flex-col md:flex-row items-center gap-6 max-w-2xl mx-auto rounded-none">
      {/* Product Image */}
      <div className="relative w-36 h-36 flex-shrink-0 bg-white border border-editorial-border overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="144px"
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Product Details */}
      <div className="flex-grow text-center md:text-left space-y-2">
        <span className="text-[9px] font-bold tracking-widest text-editorial-text uppercase">
          SHOP THE LOOK — {product.category}
        </span>
        <h3 className="font-display text-lg font-black uppercase tracking-tight text-editorial-text">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-xs text-editorial-muted leading-relaxed font-sans font-light">
            {product.description}
          </p>
        )}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 justify-center md:justify-start">
          <span className="text-sm font-bold text-editorial-text">{product.price}</span>
          <Link
            href={product.link}
            className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-editorial-text hover:text-editorial-muted transition-colors duration-300"
          >
            <span>PURCHASE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
