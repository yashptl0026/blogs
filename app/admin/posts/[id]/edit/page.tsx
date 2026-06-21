"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Loader2, CheckCircle2, XCircle,
  MessageSquareText, HelpCircle, MessageSquare,
  LayoutGrid, Video, MessageCircle, Image as ImageIcon
} from "lucide-react";
import RichTextEditor from "@/components/Admin/RichTextEditor";
import LocationSelect from "@/components/LocationSelect/LocationSelect";

interface Category { id: string; nameEn: string; slug: string; }

export default function EditPostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [initialLoading, setInitialLoading] = useState(true);
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
  const [isFeatured, setIsFeatured] = useState(false);
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [published, setPublished] = useState(true);

  // Location
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
    fetch("/api/categories")
      .then(r => r.json())
      .then(d => setCategories(Array.isArray(d) ? d : []));
  }, []);

  useEffect(() => {
    if (!postId) return;
    fetch(`/api/posts/${postId}`)
      .then(res => {
        if (!res.ok) throw new Error("Post not found");
        return res.json();
      })
      .then(post => {
        setTitleEn(post.titleEn || "");
        setSlug(post.slug || "");
        setExcerptEn(post.excerptEn || post.excerpt || "");
        let content = post.contentEn || post.content || "";
        let galleryImages: string[] = [];

        const galleryRegex = /<div class="my-10">\s*<h3 class="text-2xl font-black font-display mb-6">Photo Gallery<\/h3>\s*<div class="grid grid-cols-2 md:grid-cols-3 gap-4">\s*([\s\S]*?)<\/div>\s*<\/div>/;
        const match = content.match(galleryRegex);
        if (match) {
          const imagesHtml = match[1];
          const srcRegex = /<img[^>]+src="([^">]+)"/g;
          let srcMatch;
          while ((srcMatch = srcRegex.exec(imagesHtml)) !== null) {
            galleryImages.push(srcMatch[1]);
          }
          content = content.replace(galleryRegex, "");
        }

        let extractedBanner = post.bannerImage;
        const bannerRegex = /<div id="hidden-banner-data" data-url="([^"]+)"[^>]*><\/div>/;
        const bannerMatch = bannerRegex.exec(content);
        if (bannerMatch) {
          extractedBanner = bannerMatch[1];
          content = content.replace(bannerRegex, "");
        }

        let extractedGmaps = "";
        const gmapsRegex = /<div id="hidden-gmaps-url" data-url="([^"]+)"[^>]*><\/div>/;
        const gmapsMatch = gmapsRegex.exec(content);
        if (gmapsMatch) {
          extractedGmaps = gmapsMatch[1];
          content = content.replace(gmapsRegex, "");
        }
        setGoogleMapsUrl(extractedGmaps);

        // We load DB relations here instead of raw hidden content
        if (post.stateId) setStateId(post.stateId);
        if (post.districtId) setDistrictId(post.districtId);
        if (post.talukaId) setTalukaId(post.talukaId);
        if (post.villageId) setVillageId(post.villageId);

        setContentEn(content);
        
        const uniqueImages = Array.from(new Set([
          ...(post.coverImage ? [post.coverImage] : []),
          ...(extractedBanner ? [extractedBanner] : []),
          ...galleryImages
        ]));

        setUploadedImages(uniqueImages);
        if (post.coverImage) setCoverIndex(uniqueImages.indexOf(post.coverImage));
        if (extractedBanner) setBannerIndex(uniqueImages.indexOf(extractedBanner));

        setPublished(post.published ?? true);

        if (post.categories && post.categories.length > 0) {
          setCategoryId(post.categories[0].id);
        }

        setStateId(post.stateId || "");
        setDistrictId(post.districtId || "");
        setTalukaId(post.talukaId || "");
        setVillageId(post.villageId || "");

        setInitialLoading(false);
      })
      .catch(err => {
        setInitialLoading(false);
      });
  }, [postId]);

  // Auto-slug from title
  useEffect(() => {
    if (!slug && titleEn) {
      setSlug(titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  }, [titleEn, slug]);

  if (status === "loading" || initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!session || (session.user as any)?.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <XCircle className="w-16 h-16 text-red-400 mx-auto" />
          <h1 className="text-2xl font-black text-gray-900">Access Denied</h1>
          <p className="text-gray-500">You must be an admin to edit posts.</p>
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

    const words = contentEn.trim().replace(/<[^>]*>?/gm, '').split(/\s+/).filter(Boolean).length;
    const readingTime = `${Math.max(1, Math.round(words / 200))} min read`;

    const coverImage = uploadedImages[coverIndex] || uploadedImages[0];
    const bannerImage = bannerIndex !== null ? uploadedImages[bannerIndex] : null;
    const otherImages = uploadedImages; // The user requested ALL uploaded images in the gallery

    let finalContent = contentEn;
    const galleryRegex = /<div class="my-10">\s*<h3 class="text-2xl font-black font-display mb-6">Photo Gallery<\/h3>\s*<div class="grid grid-cols-2 md:grid-cols-3 gap-4">\s*([\s\S]*?)<\/div>\s*<\/div>/;
    finalContent = finalContent.replace(galleryRegex, "");

    if (otherImages.length > 0) {
      const galleryHtml = `
        <div class="my-10">
          <h3 class="text-2xl font-black font-display mb-6">Photo Gallery</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            ${otherImages.map(img => `<img src="${img}" class="w-full aspect-video object-cover rounded-xl shadow-sm m-0!" />`).join('')}
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
      const res = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleEn, slug, excerptEn, contentEn: finalContent, coverImage, bannerImage,
          readingTime,
          published: true,
          categoryIds: categoryId ? [categoryId] : [],
          stateId: stateId || undefined,
          districtId: districtId || undefined,
          talukaId: talukaId || undefined,
          villageId: villageId || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update post");
      
      showToast("Post updated successfully!", "success");
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
    <div className="min-h-screen bg-gray-50/50 text-gray-900 font-sans pb-16 relative">
      
      {/* Custom Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl text-white font-semibold transition-all duration-300 transform translate-y-0 opacity-100 ${toastType === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toastType === "success" ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          {toastMessage}
        </div>
      )}

      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link href="/admin" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit post</h1>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-8">

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Post name</label>
            <input
              value={titleEn}
              onChange={e => setTitleEn(e.target.value)}
              placeholder="Post name"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors"
            />
            <p className="text-xs text-gray-500">Moving heaven divide two sea female great midst spirit</p>
          </div>

          <div className="space-y-3 hidden">
            <label className="block text-sm font-medium text-gray-700">Post type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {postTypes.map(pt => (
                <button
                  key={pt.id}
                  type="button"
                  onClick={() => setPostType(pt.id)}
                  className={`flex flex-col items-center justify-center py-4 px-2 rounded-xl border transition-colors ${postType === pt.id
                    ? 'bg-gray-200 border-gray-300 text-gray-900'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                >
                  {pt.icon}
                  <span className="text-xs font-semibold">{pt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Short description</label>
            <textarea
              value={excerptEn}
              onChange={e => setExcerptEn(e.target.value)}
              placeholder="Add description"
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 resize-none transition-colors"
            />
          </div>

          {/* Google Maps URL */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Google Maps URL</label>
            <input
              value={googleMapsUrl}
              onChange={e => setGoogleMapsUrl(e.target.value)}
              placeholder="e.g. https://maps.app.goo.gl/..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors"
            />
            <p className="text-xs text-gray-500">Add a direct link to Google Maps for this location (Optional).</p>
          </div>

          {/* Location Select */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Location (Optional)</h3>
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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Post body</label>
            <div className="rounded-lg overflow-hidden">
              <RichTextEditor value={contentEn} onChange={setContentEn} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Upload post image here, or <button type="button" onClick={() => coverInputRef.current?.click()} className="text-blue-600 hover:underline cursor-pointer">Browse</button>
            </label>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={uploadingCover}
                className="bg-gray-50 border-r border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
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

            <p className="text-xs text-gray-500 mt-2">
              <strong>Note:</strong> You can select one image as the Cover (thumbnails/details) and another as the Banner (hero section). Any remaining images will automatically form a photo gallery at the bottom!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Tags</label>
              <input
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="business, sports ..."
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors"
              />
              <p className="text-[11px] text-gray-500 leading-tight">
                Maximum of 14 keywords. Keywords should all be in lowercase and separated by commas. e.g. javascript, react, marketing.
              </p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors bg-white"
              >
                <option value="">Select category...</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.nameEn}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={e => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 font-medium">Make this post featured?</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={e => setPublished(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 font-medium">Published?</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update post"}
          </button>

        </form>
      </div>
    </div>
  );
}
