"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { ProductHotspot } from "./HeroLayout";

interface HoverTagProps {
  product: ProductHotspot;
}

export default function HoverTag({ product }: HoverTagProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="absolute group/tag"
      style={{ left: `${product.x}%`, top: `${product.y}%` }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Interactive Pulsing Anchor Dot */}
      <button
        className="relative flex items-center justify-center w-6 h-6 rounded-full cursor-pointer focus:outline-none"
        aria-label={`View details for ${product.name}`}
      >
        <span className="absolute inline-flex h-full w-full rounded-full bg-white/40 animate-ping opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white shadow-lg border border-editorial-text/20 transition-transform duration-300 group-hover/tag:scale-125"></span>
      </button>

      {/* Hover Shoppable Tooltip Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 bottom-8 -translate-x-1/2 w-48 p-4 bg-white/90 backdrop-blur-md border border-editorial-border shadow-xl z-30"
          >
            {/* Triangular pointer */}
            <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white/90" />

            <div className="flex flex-col space-y-1 text-left">
              <span className="text-[9px] font-bold tracking-wider text-editorial-accent uppercase">
                {product.category}
              </span>
              <h4 className="text-xs font-semibold text-editorial-text leading-tight font-sans">
                {product.name}
              </h4>
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs font-bold text-editorial-text">{product.price}</span>
                <Link
                  href={product.link}
                  className="flex items-center gap-1 text-[10px] font-bold tracking-widest text-editorial-accent hover:text-editorial-text transition-colors duration-300"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>SHOP</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
