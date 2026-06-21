"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LocationSelect from "@/components/LocationSelect/LocationSelect";
import {
  ArrowLeft, Loader2, CheckCircle2, XCircle,
  MessageSquareText, HelpCircle, MessageSquare,
  LayoutGrid, Video, MessageCircle
} from "lucide-react";
import RichTextEditor from "@/components/Admin/RichTextEditor";

interface Category { id: string; nameEn: string; slug: string; }

export default function CreatePostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Form fields
  const [postType, setPostType] = useState("post");
  const [titleEn, setTitleEn] = useState("");
  const [slug, setSlug] = useState("");
  const [excerptEn, setExcerptEn] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [bannerIndex, setBannerIndex] = useState<number | null>(null);
  const [tagsInput, setTagsInput] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  // Hidden Location States (Defaulted to empty, can be added to UI if needed later)
  const [stateId, setStateId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [talukaId, setTalukaId] = useState("");
  const [villageId, setVillageId] = useState("");

  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [talukas, setTalukas] = useState<any[]>([]);
  const [villages, setVillages] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/locations').then(res => res.json()).then(setStates).catch(console.error);
  }, []);

  useEffect(() => {
    if (stateId) {
      fetch(`/api/locations?stateId=${stateId}`).then(res => res.json()).then(setDistricts).catch(console.error);
    } else {
      setDistricts([]);
      setDistrictId("");
    }
  }, [stateId]);

  useEffect(() => {
    if (districtId) {
      fetch(`/api/locations?districtId=${districtId}`).then(res => res.json()).then(setTalukas).catch(console.error);
    } else {
      setTalukas([]);
      setTalukaId("");
      setVillages([]);
      setVillageId("");
    }
  }, [districtId]);

  useEffect(() => {
    if (talukaId) {
      fetch(`/api/locations?talukaId=${talukaId}`).then(res => res.json()).then(setVillages).catch(console.error);
    } else {
      setVillages([]);
      setVillageId("");
    }
  }, [talukaId]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/categories").then(r => r.json()).then(d => setCategories(Array.isArray(d) ? d : []));
  }, []);

  // Auto-slug from title
  useEffect(() => {
    setSlug(titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  }, [titleEn]);

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  if (!session || (session.user as any)?.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <XCircle className="w-16 h-16 text-red-400 mx-auto" />
          <h1 className="text-2xl font-black text-gray-900">Access Denied</h1>
          <p className="text-gray-500">You must be an admin to create posts.</p>
          <Link href="/admin-access" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingCover(true);
    const formData = new FormData();
    for (let i = 0; i < e.target.files.length; i++) {
      formData.append("files", e.target.files[i]);
    }

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.urls) {
        setUploadedImages(prev => [...prev, ...data.urls]);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingCover(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    if (coverIndex === index) setCoverIndex(0);
    else if (coverIndex > index) setCoverIndex(coverIndex - 1);

    if (bannerIndex === index) setBannerIndex(null);
    else if (bannerIndex !== null && bannerIndex > index) setBannerIndex(bannerIndex - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titleEn || !contentEn || uploadedImages.length === 0) {
      alert("Post name, Post body, and at least one Image are required.");
      return;
    }

    // Calculate reading time manually
    const words = contentEn.trim().replace(/<[^>]*>?/gm, '').split(/\s+/).filter(Boolean).length;
    const readingTime = `${Math.max(1, Math.round(words / 200))} min read`;

    const coverImage = uploadedImages[coverIndex] || uploadedImages[0];
    const bannerImage = bannerIndex !== null ? uploadedImages[bannerIndex] : null;
    const otherImages = uploadedImages; // The user requested ALL uploaded images in the gallery

    let finalContent = contentEn;
    if (otherImages.length > 0) {
      const galleryHtml = `
        <div class="my-10">
          <h3 class="text-2xl font-black font-display mb-6">Photo Gallery</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            ${otherImages.map((img: string) => `
              <img src="${img}" class="w-full aspect-video object-cover rounded-xl shadow-sm m-0!" />
            `).join('')}
          </div>
        </div>
      `;
      finalContent += galleryHtml;
    }

    if (googleMapsUrl) {
      finalContent += `<div id="hidden-gmaps-url" data-url="${googleMapsUrl}" style="display:none;"></div>`;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleEn, slug, excerptEn, contentEn: finalContent, coverImage, bannerImage,
          readingTime,
          published, 
          isFeatured,
          categoryIds: categoryId ? [categoryId] : [],
          stateId: stateId || undefined,
          districtId: districtId || undefined,
          talukaId: talukaId || undefined,
          villageId: villageId || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create post");
      
      showToast("Post created successfully!", "success");
      setTimeout(() => router.push(`/blog/${slug}`), 1000);
    } catch (err: any) {
      showToast(err.message || 'Something went wrong.', "error");
    } finally {
      setSaving(false);
    }
  };

  const postTypes = [
    { id: 'post', label: 'Post', icon: <MessageSquareText className="w-6 h-6 mb-2" strokeWidth={1.5} /> },
    { id: 'question', label: 'Question', icon: <HelpCircle className="w-6 h-6 mb-2" strokeWidth={1.5} /> },
    { id: 'poll', label: 'Poll', icon: <MessageSquare className="w-6 h-6 mb-2" strokeWidth={1.5} /> },
    { id: 'images', label: 'Images', icon: <LayoutGrid className="w-6 h-6 mb-2" strokeWidth={1.5} /> },
    { id: 'video', label: 'Video', icon: <Video className="w-6 h-6 mb-2" strokeWidth={1.5} /> },
    { id: 'other', label: 'Other', icon: <MessageCircle className="w-6 h-6 mb-2" strokeWidth={1.5} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-neutral-950 font-sans pb-16 relative">
      
      {/* Custom Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl text-white font-semibold transition-all duration-300 transform translate-y-0 opacity-100 ${toastType === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toastType === "success" ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          {toastMessage}
        </div>
      )}

      {/* Top Header Placeholder (matching typical admin layouts) */}
      <div className="bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link href="/admin" className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Create a post</h1>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-sm p-6 sm:p-8 space-y-8">

          {/* Post Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Post name</label>
            <input
              value={titleEn}
              onChange={e => setTitleEn(e.target.value)}
              placeholder="Post name"
              className="w-full border border-gray-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">Moving heaven divide two sea female great midst spirit</p>
          </div>

          {/* Post Type */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Post type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {postTypes.map(pt => (
                <button
                  key={pt.id}
                  type="button"
                  onClick={() => setPostType(pt.id)}
                  className={`flex flex-col items-center justify-center py-4 px-2 rounded-xl border transition-colors ${postType === pt.id
                    ? 'bg-gray-200 dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 text-gray-900 dark:text-white'
                    : 'bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-neutral-500'
                    }`}
                >
                  {pt.icon}
                  <span className="text-xs font-semibold">{pt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Short description</label>
            <textarea
              value={excerptEn}
              onChange={e => setExcerptEn(e.target.value)}
              placeholder="Add description"
              rows={3}
              className="w-full border border-gray-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 resize-none transition-colors"
            />
          </div>

          {/* Google Maps URL */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Google Maps URL</label>
            <input
              value={googleMapsUrl}
              onChange={e => setGoogleMapsUrl(e.target.value)}
              placeholder="e.g. https://maps.app.goo.gl/..."
              className="w-full border border-gray-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">Add a direct link to Google Maps for this location (Optional).</p>
          </div>

          {/* Location Selection is handled by the LocationSelect component below */}

          {/* Post Body */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Post body</label>
            <div className="rounded-lg overflow-hidden">
              <RichTextEditor value={contentEn} onChange={setContentEn} />
            </div>
          </div>

          {/* Upload Image */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Upload post image here, or <button type="button" onClick={() => coverInputRef.current?.click()} className="text-blue-600 hover:underline cursor-pointer">Browse</button>
            </label>
            <div className="flex items-center border border-gray-200 dark:border-neutral-700 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={uploadingCover}
                className="bg-gray-50 dark:bg-neutral-800 border-r border-gray-200 dark:border-neutral-700 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
              >
                {uploadingCover ? 'Uploading...' : 'Choose File'}
              </button>
              <div className="px-4 py-2.5 text-sm text-gray-500 flex-1 truncate">
                {uploadedImages.length > 0 ? `${uploadedImages.length} file(s) selected` : 'No files chosen'}
              </div>
            </div>
            <input
              type="file"
              ref={coverInputRef}
              onChange={handleCoverUpload}
              accept="image/*"
              multiple
              className="hidden"
            />

            {uploadedImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {uploadedImages.map((img, idx) => (
                  <div key={idx} className={`relative rounded-xl overflow-hidden border-2 transition-all ${coverIndex === idx ? 'border-blue-600 shadow-md' : bannerIndex === idx ? 'border-purple-600 shadow-md' : 'border-gray-200'}`}>
                    <img src={img} alt={`Upload ${idx}`} className="w-full h-32 object-cover" />

                    <div className="absolute bottom-2 left-2 right-2 flex gap-1 justify-between">
                      <button
                        type="button"
                        onClick={() => setCoverIndex(idx)}
                        className={`text-[10px] flex-1 font-bold px-2 py-1 rounded shadow-sm transition-colors text-center ${coverIndex === idx ? 'bg-blue-600 text-white' : 'bg-white/90 text-gray-700 hover:bg-white'}`}
                      >
                        {coverIndex === idx ? 'Cover' : 'Cover'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setBannerIndex(idx === bannerIndex ? null : idx)}
                        className={`text-[10px] flex-1 font-bold px-2 py-1 rounded shadow-sm transition-colors text-center ${bannerIndex === idx ? 'bg-purple-600 text-white' : 'bg-white/90 text-gray-700 hover:bg-white'}`}
                      >
                        {bannerIndex === idx ? 'Banner' : 'Banner'}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-sm transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              <strong>Note:</strong> You can select one image as the Cover (thumbnails/details) and another as the Banner (hero section). Any remaining images will automatically form a photo gallery at the bottom!
            </p>
          </div>

          {/* Tags & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tags</label>
              <input
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="business, sports ..."
                className="w-full border border-gray-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors"
              />
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">
                Maximum of 14 keywords. Keywords should all be in lowercase and separated by commas. e.g. javascript, react, marketing.
              </p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full border border-gray-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors bg-white dark:bg-neutral-800"
              >
                <option value="">Select category...</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.nameEn}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location Select */}
          <div className="pt-4 border-t border-gray-100 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Location (Optional)</h3>
            <LocationSelect
              onChange={(ids) => {
                setStateId(ids.stateId || "");
                setDistrictId(ids.districtId || "");
                setTalukaId(ids.talukaId || "");
                setVillageId(ids.villageId || "");
              }}
              defaultStateId={stateId}
              defaultDistrictId={districtId}
              defaultTalukaId={talukaId}
              defaultVillageId={villageId}
              showVillage={true}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
            />
          </div>

          {/* Featured Checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={e => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 dark:border-neutral-600 dark:bg-neutral-800 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Make this post featured?</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publish post"}
          </button>

        </form>
      </div>
    </div>
  );
}
