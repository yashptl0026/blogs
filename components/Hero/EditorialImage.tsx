"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import HoverTag from "./HoverTag";
import { ProductHotspot } from "./HeroLayout";

interface EditorialImageProps {
  src: string;
  alt: string;
  products: ProductHotspot[];
}

export default function EditorialImage({ src, alt, products }: EditorialImageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full h-full group"
    >
      {/* Background Overlay for Editorial Atmosphere */}
      <div className="absolute inset-0 bg-editorial-text/5 group-hover:bg-editorial-text/0 transition-colors duration-500 z-10 pointer-events-none" />

      {/* Main High-End Editorial Image */}
      <Image
        src={src}
        alt={alt}
        fill
        priority // Instantly loads hero image
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
      />

      {/* Interactive Shoppable Product Hotspots Overlay */}
      <div className="absolute inset-0 z-20">
        {products.map((product) => (
          <HoverTag key={product.id} product={product} />
        ))}
      </div>
    </motion.div>
  );
}
