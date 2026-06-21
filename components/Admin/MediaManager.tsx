"use client";

import { useState, useRef } from "react";
import { Upload, Image as ImageIcon, Loader2, CheckCircle2, Copy, Trash2 } from "lucide-react";

interface MediaManagerProps {
  coverImage: string;
  setCoverImage: (url: string) => void;
}

export default function MediaManager({ coverImage, setCoverImage }: MediaManagerProps) {
  const [images, setImages] = useState<string[]>(coverImage ? [coverImage] : []);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    const formData = new FormData();
    Array.from(e.target.files).forEach(file => {
      formData.append("files", file);
    });

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok && data.urls) {
        setImages(prev => [...prev, ...data.urls]);
        // Auto-set cover if it's the first image uploaded
        if (!coverImage && data.urls.length > 0) {
          setCoverImage(data.urls[0]);
        }
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during upload.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const copyToClipboard = (url: string) => {
    // Determine full URL for markdown
    const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(`![Image description](${fullUrl})`);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const removeImage = (urlToRemove: string) => {
    setImages(prev => prev.filter(url => url !== urlToRemove));
    if (coverImage === urlToRemove) {
      setCoverImage("");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wider flex items-center gap-2">
          <ImageIcon className="w-4 h-4" /> Media Manager
        </h2>
        
        <button 
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 text-sm font-bold bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          Upload Images
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          multiple 
          accept="image/*" 
          className="hidden" 
        />
      </div>

      {images.length === 0 ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="rounded-xl h-48 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 text-gray-400 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
        >
          <Upload className="w-10 h-10 text-gray-300" />
          <div className="text-center">
            <p className="font-bold text-gray-700 text-sm">Click to upload or drag and drop</p>
            <p className="text-xs mt-1">SVG, PNG, JPG or GIF</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
          {images.map((url, idx) => {
            const isCover = coverImage === url;
            return (
              <div key={idx} className={`group relative rounded-xl overflow-hidden aspect-video border-2 transition-all ${isCover ? 'border-blue-500 shadow-sm' : 'border-transparent hover:border-gray-200'}`}>
                <img src={url} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                
                {/* Cover Badge */}
                {isCover && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm z-10">
                    <CheckCircle2 className="w-3 h-3" /> COVER
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gray-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                  {!isCover && (
                    <button 
                      type="button"
                      onClick={() => setCoverImage(url)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 rounded-lg transition-colors"
                    >
                      Set as Cover
                    </button>
                  )}
                  <button 
                    type="button"
                    onClick={() => copyToClipboard(url)}
                    className="w-full bg-white hover:bg-gray-100 text-gray-900 text-xs font-bold py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    {copiedUrl === url ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
                    {copiedUrl === url ? "Copied MD!" : "Copy Markdown"}
                  </button>
                  
                  {/* Delete Button */}
                  <button 
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Optional fallback input for external URL */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Or use external URL for cover</label>
        <input
          value={coverImage}
          onChange={e => {
            setCoverImage(e.target.value);
            if (e.target.value && !images.includes(e.target.value)) {
              setImages(prev => [e.target.value, ...prev]);
            }
          }}
          placeholder="https://images.unsplash.com/..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
        />
      </div>
    </div>
  );
}
