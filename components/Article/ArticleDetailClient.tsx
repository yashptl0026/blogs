"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/components/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import { User, MessageSquare, Send, Heart, Bookmark, AlertCircle, Facebook, Twitter, Instagram, Edit, MapPin, XCircle } from "lucide-react";

interface ArticleDetailClientProps {
  initialPost: any;
}

export default function ArticleDetailClient({ initialPost }: ArticleDetailClientProps) {
  const { language, t } = useLanguage();
  const { data: session } = useSession();

  const [currentUrl, setCurrentUrl] = useState("");
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  // Reading Progress state
  const [scrollProgress, setScrollProgress] = useState(0);

  // Photo Gallery & Lightbox
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const galleryImages: string[] = initialPost.galleryImagesStr ? JSON.parse(initialPost.galleryImagesStr) : [];

  // Comments & Reviews state
  const [comments, setComments] = useState<any[]>(initialPost?.comments || []);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState("");

  // Auto-play slider ref
  const sliderRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxImage]);

  // Track reading progress
  useEffect(() => {
    const updateScroll = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (scrollPx / winHeightPx) * 100;
      setScrollProgress(scrolled);
    };
    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  // Auto-play slider effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        // If we've reached the end (with a small 5px buffer for rounding issues)
        if (scrollLeft + clientWidth >= scrollWidth - 5) {
          sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          // Find width of a single item based on its children
          const firstChild = sliderRef.current.children[0] as HTMLElement;
          if (firstChild) {
            // Include gap (gap-4 is 16px)
            const scrollAmount = firstChild.offsetWidth + 16;
            sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
          }
        }
      }
    }, 3000); // Auto-play every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Comment submission handler
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    setCommentError("");

    try {
      const res = await fetch(`/api/posts/${initialPost.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentText }),
      });

      if (res.ok) {
        const newComment = await res.json();
        setComments([newComment, ...comments]);
        setCommentText("");
      } else {
        const data = await res.json();
        setCommentError(data.error || "Failed to submit comment");
      }
    } catch (err) {
      setCommentError("Failed to connect. Please try again.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const postTitle = getTranslation(initialPost, "title", language);
  const postContent = getTranslation(initialPost, "content", language);
  const formattedDate = new Date(initialPost.createdAt).toLocaleDateString(
    language === "en" ? "en-US" : language === "hi" ? "hi-IN" : "gu-IN",
    { year: "numeric", month: "long", day: "numeric" }
  );

  // Generate diverse colors for category tags
  const getCategoryColor = (slug?: string) => {
    switch (slug?.toLowerCase()) {
      case 'lifestyle': return 'bg-red-600';
      case 'travel': return 'bg-blue-600';
      case 'food': return 'bg-orange-500';
      case 'tech': return 'bg-purple-600';
      case 'culture': return 'bg-emerald-600';
      case 'business': return 'bg-slate-800';
      default: return 'bg-rose-600';
    }
  };

  return (
    <article className="w-full bg-editorial-bg font-sans text-editorial-text relative">

      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1.5 bg-blue-600 z-[100] transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center backdrop-blur-sm" style={{ zIndex: 99999 }} onClick={() => setLightboxImage(null)}>
          <button className="absolute top-6 right-6 z-10 text-white hover:text-gray-300 transition-colors bg-black/20 rounded-full p-1" onClick={() => setLightboxImage(null)}>
            <XCircle className="w-10 h-10" />
          </button>
          <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-6">
            <img src={lightboxImage} className="max-w-full max-h-full object-contain rounded-sm shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()} alt="Enlarged gallery view" />
          </div>
        </div>
      )}


      {/* 1. Hero Image Section (Full Width Overlay) */}
      <div className="relative w-full h-[70vh] min-h-[500px]">
        <Image
          src={initialPost.bannerImage || initialPost.coverImage || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=100&w=2000&auto=format&fit=crop"}
          alt={postTitle}
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover"
        />
        {/* Dark Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30"></div>

        {/* Hero Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 mt-20 z-10">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {initialPost.categories?.length > 0 ? (
                initialPost.categories.map((cat: any, index: number) => (
                  <span
                    key={cat.slug || cat.id || index}
                    className={`${getCategoryColor(cat.slug)} text-white px-3 py-1 text-[10px] font-bold tracking-wide rounded-sm`}
                  >
                    {getTranslation(cat, "name", language)}
                  </span>
                ))
              ) : (
                <span className="bg-red-600 text-white px-3 py-1 text-[10px] font-bold tracking-wide rounded-sm">
                  Lifestyle
                </span>
              )}
            </div>

            {/* Location Data */}
            {((initialPost.state || initialPost.district || initialPost.taluka || initialPost.village) || (initialPost.locState || initialPost.locDistrict || initialPost.locTaluka)) && (
              <div className="flex items-center justify-center gap-1.5 text-blue-200 text-sm font-semibold tracking-wide mt-2">
                <MapPin className="w-4 h-4" />
                {[
                  initialPost.village?.nameEn,
                  initialPost.taluka?.nameEn || initialPost.locTaluka,
                  initialPost.district?.nameEn || initialPost.locDistrict,
                  initialPost.state?.nameEn || initialPost.locState
                ].filter(Boolean).join(", ")}
              </div>
            )}

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-white leading-tight">
              {postTitle}
            </h1>

            <div className="flex items-center justify-center gap-3 text-gray-300 text-xs font-semibold tracking-wide pt-4">
              <span className="flex items-center gap-2">
                {initialPost.author?.image ? (
                  <img loading="lazy" decoding="async" src={initialPost.author.image} className="w-6 h-6 rounded-full object-cover" alt="Author" />
                ) : (
                  <User className="w-4 h-4" />
                )}
                By {initialPost.author?.name || 'AESTHETE Team'}
              </span>
              <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
              <span>{formattedDate}</span>
              <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                {comments.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid Wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-16">

        {/* Left Column: Article Body */}
        <div className="lg:col-span-8 space-y-8">

          {/* Inline Cover Image */}
          {initialPost.coverImage && (
            <div className="mb-10 w-full overflow-hidden rounded-2xl shadow-lg border border-editorial-border">
              <Image
                src={initialPost.coverImage}
                alt="Cover"
                width={1920}
                height={1080}
                className="w-full h-auto object-cover aspect-video"
              />
            </div>
          )}

          {/* Action Ribbon (Share/Likes/Saves) */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-editorial-border">
            {/* Share Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-editorial-muted uppercase tracking-wider mr-2">Share:</span>
              <a
                href={currentUrl ? `https://api.whatsapp.com/send?text=${encodeURIComponent(postTitle + " - " + currentUrl)}` : '#'}
                target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors"
                title="Share on WhatsApp"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.126.551 4.195 1.6 6.01L.067 24l6.108-1.597c1.748.96 3.738 1.467 5.856 1.467 6.646 0 12.031-5.385 12.031-12.031S18.677 0 12.031 0zm3.844 17.382c-.161.455-.951.87-1.344.912-.375.04-1.077.162-3.136-.69-2.484-1.026-4.066-3.565-4.188-3.73-.122-.165-1.002-1.332-1.002-2.542 0-1.21.626-1.808.852-2.049.227-.242.495-.303.656-.303.161 0 .323 0 .464.007.151.008.354-.06.545.405.192.464.656 1.606.717 1.727.06.122.101.263.02.424-.08.162-.122.263-.243.404-.121.141-.252.303-.363.404-.121.121-.253.252-.111.495.141.242.626 1.03 1.343 1.666.924.823 1.706 1.076 1.948 1.197.242.121.384.101.525-.06.141-.162.606-.707.767-.95.161-.242.323-.202.545-.121.222.08 1.413.666 1.655.788.242.121.404.182.464.283.06.101.06.586-.101 1.04z" /></svg>
              </a>
              <a
                href={currentUrl ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}` : '#'}
                target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                title="Share on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={currentUrl ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(postTitle)}` : '#'}
                target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-colors"
                title="Share on Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
                className="w-8 h-8 rounded-full bg-editorial-card text-editorial-muted flex items-center justify-center hover:bg-editorial-text hover:text-editorial-bg transition-colors ml-1"
                title="Copy Link"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
              </button>
            </div>

            {/* Admin Edit */}
            <div className="flex justify-end gap-3">
              {session?.user?.role === "ADMIN" && (
                <Link
                  href={`/admin/posts/${initialPost.id}/edit`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-editorial-text text-editorial-bg text-xs font-semibold rounded-full hover:opacity-80 transition-opacity duration-300"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Post</span>
                </Link>
              )}
            </div>
          </div>

          {/* Body Text */}
          <div
            className="prose prose-lg max-w-none text-editorial-text leading-relaxed font-light prose-p:mb-6 prose-headings:font-display prose-headings:font-black prose-strong:font-extrabold prose-strong:text-editorial-text prose-a:text-blue-600 prose-img:rounded-2xl prose-img:shadow-md prose-img:my-12 [&>p:first-of-type]:first-letter:text-6xl [&>p:first-of-type]:first-letter:font-black [&>p:first-of-type]:first-letter:text-blue-600 [&>p:first-of-type]:first-letter:mr-3 [&>p:first-of-type]:first-letter:float-left [&>p:first-of-type]:first-letter:mt-1"
            dangerouslySetInnerHTML={{ __html: postContent || "<p>No content available.</p>" }}
          />

          {/* Photo Gallery */}
          {galleryImages.length > 0 && (
            <div className="my-10">
              <h3 className="text-2xl font-black font-display mb-6">Photo Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryImages.map((img, idx) => (
                  <div key={idx} className="cursor-pointer overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow group relative aspect-video" onClick={() => setLightboxImage(img)}>
                    <img loading="lazy" decoding="async" src={img} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 aspect-video" alt={`Gallery Image ${idx + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}



          {/* Get Directions */}
          <div className="bg-blue-900/10 rounded-xl p-6 border border-blue-900/20 my-10">
            <h3 className="text-xl font-bold text-blue-400 mb-2">{t("getDirections")}</h3>
            <p className="text-sm text-blue-300 mb-5">{t("getDirectionsDesc")}</p>
            <a
              href={initialPost.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${initialPost.lat || 0},${initialPost.lng || 0}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors shadow-sm"
            >
              {t("openInGoogleMaps")}
            </a>
          </div>

          {/* Related Experiences */}
          <div className="my-12">
            <h3 className="font-display text-2xl font-black text-editorial-text mb-6 pb-4 border-b border-editorial-border flex items-center justify-between">
              <span>{t("relatedExperiences")}</span>
            </h3>

            <div
              ref={sliderRef}
              className="flex w-full overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {initialPost.nearbyAttractions && initialPost.nearbyAttractions.length > 0 ? (
                initialPost.nearbyAttractions.map((attraction: any, index: number) => (
                  <Link href={`/blog/${attraction.slug}`} key={index} className="flex-none w-[85vw] sm:w-[calc(50%-8px)] md:w-[calc(33.333%-11px)] snap-start group relative block aspect-video rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <img loading="lazy" decoding="async"
                      src={attraction.coverImage || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=100&w=600&auto=format&fit=crop"}
                      alt={attraction.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    <div className="absolute inset-0 p-5 flex flex-col justify-end text-center">
                      <h4 className="text-lg font-bold text-white mb-1 font-display drop-shadow-md">{attraction.name}</h4>
                      <div className="flex flex-wrap items-center justify-center text-gray-200 text-xs gap-1 opacity-90">
                        {attraction.village && <span>{attraction.village}</span>}
                        {attraction.taluka && <span>{attraction.village ? ',' : ''} {attraction.taluka}</span>}
                        {attraction.district && <span>{(attraction.village || attraction.taluka) ? ',' : ''} {attraction.district}</span>}
                        {attraction.state && <span>{(attraction.village || attraction.taluka || attraction.district) ? ',' : ''} {attraction.state}</span>}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <>
                  <div className="flex-none w-[85vw] sm:w-[calc(50%-8px)] md:w-[calc(33.333%-11px)] snap-start group relative block h-48 md:h-56 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <img loading="lazy" decoding="async" src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=100&w=600&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    <div className="absolute inset-0 p-5 flex flex-col justify-end text-center">
                      <h4 className="text-lg font-bold text-white mb-1 font-display drop-shadow-md">Koshmal Waterfall</h4>
                      <div className="flex flex-wrap items-center justify-center text-gray-200 text-xs gap-1 opacity-90">
                        <span>Dang, Gujarat</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-none w-[85vw] sm:w-[calc(50%-8px)] md:w-[calc(33.333%-11px)] snap-start group relative block h-48 md:h-56 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <img loading="lazy" decoding="async" src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=100&w=600&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    <div className="absolute inset-0 p-5 flex flex-col justify-end text-center">
                      <h4 className="text-lg font-bold text-white mb-1 font-display drop-shadow-md">Saputara Hill Station</h4>
                      <div className="flex flex-wrap items-center justify-center text-gray-200 text-xs gap-1 opacity-90">
                        <span>Saputara, Dang, Gujarat</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Author Bio Box */}
          <div className="bg-blue-900/10 rounded-2xl p-8 border border-blue-900/20 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left my-12">
            <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 border-4 border-editorial-card shadow-lg">
              {initialPost.author?.image ? (
                <img loading="lazy" decoding="async" src={initialPost.author.image} className="w-full h-full object-cover" alt="Author" />
              ) : (
                <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl">
                  {initialPost.author?.name?.charAt(0) || 'A'}
                </div>
              )}
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-blue-600 text-[10px] font-bold tracking-wide mb-1">{t("writtenBy")}</p>
                <h4 className="text-xl font-black font-display text-editorial-text">{initialPost.author?.name || 'AESTHETE Team'}</h4>
              </div>
              <p className="text-sm text-editorial-muted leading-relaxed font-light">
                Passionate about discovering the world's most beautiful stories. Specializes in cultural deep-dives, breathtaking landscapes, and the art of travel journalism. Follow my journey on social media.
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                <a href="#" className="w-8 h-8 rounded-full bg-editorial-card text-editorial-muted flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors shadow-sm"><Facebook className="w-3.5 h-3.5" /></a>
                <a href="#" className="w-8 h-8 rounded-full bg-editorial-card text-editorial-muted flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors shadow-sm"><Twitter className="w-3.5 h-3.5" /></a>
                <a href="#" className="w-8 h-8 rounded-full bg-editorial-card text-editorial-muted flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors shadow-sm"><Instagram className="w-3.5 h-3.5" /></a>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t border-editorial-border pt-12 space-y-8">
            <h3 className="font-display text-2xl font-black text-editorial-text">
              {comments.length} {t("comments")}
            </h3>

            {/* List of comments */}
            <div className="space-y-8">
              {comments.length === 0 ? (
                <p className="text-sm text-editorial-muted italic">{t("noComments")}</p>
              ) : (
                comments.map((comm) => (
                  <div key={comm.id} className="flex gap-4 text-left">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-editorial-bg flex-shrink-0 border border-editorial-border">
                      {comm.user.image ? (
                        <img loading="lazy" decoding="async" src={comm.user.image} alt={comm.user.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-editorial-muted">
                          {comm.user.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-baseline gap-3">
                        <span className="font-bold text-editorial-text text-sm">{comm.user.name}</span>
                        <span className="text-xs text-editorial-muted font-medium tracking-wide">
                          {new Date(comm.createdAt).toLocaleDateString(language === "en" ? "en-US" : language === "hi" ? "hi-IN" : "gu-IN", { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-sm text-editorial-muted leading-relaxed">
                        {comm.content}
                      </p>
                      <button className="text-xs font-bold text-blue-600 hover:text-blue-800 tracking-wide">
                        {t("reply")}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Leave a reply form */}
            <div className="pt-8">
              <h3 className="font-display text-xl font-black text-editorial-text mb-6">{t("leaveReply")}</h3>
              {session ? (
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-editorial-muted tracking-wide block mb-2">
                      {t("loggedInAs")} {session.user?.name}
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder={t("writeComment")}
                      className="w-full bg-editorial-bg border border-editorial-border p-4 text-sm focus:border-blue-600 focus:bg-editorial-card focus:outline-none transition-colors rounded-lg text-editorial-text"
                    />
                  </div>
                  {commentError && (
                    <div className="flex items-center gap-1.5 text-red-600 text-xs font-semibold">
                      <AlertCircle className="w-4 h-4" />
                      <span>{commentError}</span>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={submittingComment || !commentText.trim()}
                    className="bg-blue-600 text-white px-8 py-3 hover:bg-blue-700 transition-colors duration-300 text-xs font-bold tracking-wide rounded-full disabled:opacity-50"
                  >
                    {submittingComment ? t("posting") : t("postComment")}
                  </button>
                </form>
              ) : (
                <div className="bg-editorial-bg p-6 rounded-lg text-center space-y-4">
                  <p className="text-sm text-editorial-muted">{t("mustBeLoggedIn")}</p>
                  <Link
                    href={`/admin-access?callbackUrl=/blog/${initialPost.slug}`}
                    className="inline-block bg-blue-600 text-white px-6 py-2.5 text-xs font-bold tracking-wide rounded-full hover:bg-blue-700 transition-colors"
                  >
                    {t("signIn")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="lg:col-span-4 space-y-10">

          {/* Sidebar Item 1: Categories */}
          <div className="space-y-5">
            <h3 className="font-display text-lg font-black text-editorial-text tracking-tight border-b-2 border-editorial-text inline-block pb-1">
              {t("categories")}
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Lifestyle", count: 24, slug: "lifestyle" },
                { name: "Travel", count: 18, slug: "travel" },
                { name: "Food & Drink", count: 12, slug: "food" },
                { name: "Culture", count: 9, slug: "culture" },
                { name: "Business", count: 5, slug: "business" }
              ].map((cat, i) => (
                <li key={i} className="flex justify-between items-center group cursor-pointer">
                  <span className="text-sm text-editorial-muted font-medium group-hover:text-blue-600 transition-colors flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${getCategoryColor(cat.slug)}`}></span>
                    {cat.name}
                  </span>
                  <span className="text-xs font-bold text-editorial-muted bg-editorial-bg px-2 py-0.5 rounded-full">{cat.count}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sidebar Item 2: Newsletter Subscribe */}
          <div className="bg-editorial-bg p-6 rounded-2xl border border-editorial-border text-center space-y-4">
            <h3 className="font-display text-xl font-black text-editorial-text leading-tight">
              {t("subscribeMailingList")}
            </h3>
            <p className="text-xs text-editorial-muted">{t("newsletterDesc")}</p>
            <form className="space-y-3 pt-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={t("emailPlaceholder")}
                className="w-full bg-editorial-card border border-editorial-border px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:border-blue-600 text-center text-editorial-text"
              />
              <button className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg text-xs font-bold tracking-wide hover:bg-blue-700 transition-colors">
                {t("subscribe")}
              </button>
            </form>
          </div>

          {/* Sidebar Item 3: Advertisement Placeholder */}
          <div className="bg-editorial-bg h-64 rounded-2xl border border-editorial-border flex flex-col items-center justify-center relative overflow-hidden group">
            <span className="text-[10px] text-editorial-muted font-bold tracking-wide absolute top-4">{t("advertisement")}</span>
            <img loading="lazy" decoding="async"
              src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=400&fit=crop"
              className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity"
            />
            <div className="z-10 text-center mt-6">
              <p className="text-editorial-text font-display font-black text-lg">{t("yourAdHere")}</p>
              <p className="text-xs text-editorial-muted mt-1">{t("reachReaders")}</p>
            </div>
          </div>

        </div>
      </div>
    </article>
  );
}
