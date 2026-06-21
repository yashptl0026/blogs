"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Clock, Star, MapPin } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import { AnimatePresence } from "framer-motion";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface GridCardProps {
  post: any;
}

export default function GridCard({ post }: GridCardProps) {
  const { language } = useLanguage();
  const { data: session } = useSession();
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  useEffect(() => {
    // We check local storage as a quick visual cache, but the true source of truth for auth'd users is the DB
    const likes = JSON.parse(localStorage.getItem("aesthete_likes") || "[]");
    setLiked(likes.includes(post.id));
  }, [post.id]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      router.push("/admin-access");
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    const prevLiked = liked;
    setLiked(!prevLiked); // Optimistic UI update

    // Also update local cache for immediate feedback
    const likes = JSON.parse(localStorage.getItem("aesthete_likes") || "[]");
    if (prevLiked) {
      localStorage.setItem("aesthete_likes", JSON.stringify(likes.filter((id: string) => id !== post.id)));
      showToast("Removed from Wishlist");
    } else {
      localStorage.setItem("aesthete_likes", JSON.stringify([...likes, post.id]));
      showToast("Added to Wishlist");
    }

    try {
      const res = await fetch("/api/posts/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id }),
      });

      if (!res.ok) {
        throw new Error("Failed to toggle like");
      }
    } catch (err) {
      console.error(err);
      setLiked(prevLiked); // Revert UI on failure

      // Revert localStorage on failure
      const revertedLikes = JSON.parse(localStorage.getItem("aesthete_likes") || "[]");
      if (prevLiked) {
        // It was previously liked, so add it back
        localStorage.setItem("aesthete_likes", JSON.stringify([...new Set([...revertedLikes, post.id])]));
      } else {
        // It was not liked, so remove it again
        localStorage.setItem("aesthete_likes", JSON.stringify(revertedLikes.filter((id: string) => id !== post.id)));
      }
    } finally {
      setIsLiking(false);
    }
  };

  const postTitle = getTranslation(post, "title", language);
  const locationName = post.village ? getTranslation(post.village, "name", language) : post.state ? getTranslation(post.state, "name", language) : "Global";

  const getCategoryColor = (name?: string) => {
    switch (name?.toLowerCase()) {
      case 'lifestyle': return 'bg-red-600 text-white';
      case 'travel': return 'bg-blue-600 text-white';
      case 'food': return 'bg-orange-500 text-white';
      case 'cooking': return 'bg-orange-600 text-white';
      case 'historical places in india': return 'bg-amber-700 text-white';
      case 'state wise': return 'bg-teal-600 text-white';
      case 'tech': return 'bg-purple-600 text-white';
      case 'culture': return 'bg-emerald-600 text-white';
      case 'business': return 'bg-slate-800 text-white';
      case 'marketing': return 'bg-pink-600 text-white';
      case 'photography': return 'bg-indigo-600 text-white';
      case 'sports': return 'bg-yellow-600 text-white';
      default: return 'bg-rose-600 text-white';
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="flex flex-col bg-editorial-card rounded-3xl p-3 shadow-card hover:shadow-premium-hover transition-all duration-300 group h-full relative border border-editorial-border"
    >
      {/* Full Card Clickable Overlay */}
      <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-10 rounded-3xl" aria-label={`Read more about ${postTitle}`} />

      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="fixed top-24 right-6 z-[100] bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl font-semibold flex items-center gap-3 text-sm"
          >
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Thumbnail */}
      <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-editorial-bg">
        <Image
          src={post.coverImage}
          alt={postTitle}
          fill
          quality={100}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Floating Top Left Badges (Trending / New) */}
        <div className="absolute top-3 left-3 flex gap-2">

          <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
            NEW
          </span>
        </div>

        {/* Floating Heart */}
        <button
          onClick={handleLike}
          className="absolute top-3 right-3 p-2 rounded-full bg-editorial-card/90 backdrop-blur-sm shadow-sm hover:bg-editorial-card text-editorial-muted hover:text-red-500 transition-colors z-20"
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-3 pt-4 flex flex-col flex-1 text-left px-0">
        {/* Tags / Subtitle */}
        <div className="flex items-start mb-2">
          <span className={`text-[10px] font-bold tracking-wide px-2 py-1 rounded-sm truncate max-w-full ${post.categories && post.categories.length > 0
            ? getCategoryColor(post.categories[0].nameEn)
            : getCategoryColor("default")
            }`}>
            {post.categories && post.categories.length > 0 ? getTranslation(post.categories[0], "name", language) : "Editorial"}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display font-black text-lg text-editorial-text leading-tight mb-1 line-clamp-2 group-hover:text-editorial-accent transition-colors">
          {postTitle}
        </h3>

        {/* Short Description */}
        <p className="text-sm text-editorial-muted line-clamp-2 mb-2">
          {getTranslation(post, "excerpt", language)}
        </p>

        {/* Location / Meta */}
        <div className="flex items-center justify-between text-xs text-editorial-muted mt-2 mb-4">
          <div className="flex items-center gap-1 truncate pr-2">
            <MapPin className="w-3.5 h-3.5 text-editorial-muted shrink-0" />
            <span className="truncate">{locationName}</span>
          </div>
          <div className="flex items-center gap-1 font-bold text-editorial-text shrink-0 whitespace-nowrap">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            4.9 <span className="text-editorial-muted font-medium">(120 Reviews)</span>
          </div>
        </div>

        <div className="flex-1"></div>

        {/* Bottom Row: Author / Price-like info & Link */}
        <div className="flex items-center justify-between border-t border-editorial-border pt-3 mt-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-editorial-muted font-bold tracking-wider">Read Time</span>
            <div className="flex items-center gap-1 mt-0.5 text-sm font-bold text-editorial-text">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              {post.readingTime}
            </div>
          </div>

          <span
            className="text-blue-600 text-xs font-bold group-hover:underline"
          >
            Read Journal
          </span>
        </div>
      </div>
    </motion.article>
  );
}
