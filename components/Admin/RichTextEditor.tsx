"use client";

import React, { useEffect, useRef, useState } from "react";

// Add Quill to the window object type
declare global {
  interface Window {
    Quill: any;
  }
}

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstanceRef = useRef<any>(null);
  const isInitializingRef = useRef(false);
  const [isSourceMode, setIsSourceMode] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const initQuill = () => {
      if (!editorRef.current || quillInstanceRef.current) return;

      const Quill = window.Quill;
      const quill = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: placeholder || "Start writing your masterpiece...",
        modules: {
          toolbar: {
            container: [
              [{ header: [2, 3, 4, false] }],
              ["bold", "italic", "underline", "strike", "blockquote", "code", "code-block"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image"],
              ["clean"],
            ],
            handlers: {
              image: () => {
                const input = document.createElement("input");
                input.setAttribute("type", "file");
                input.setAttribute("accept", "image/*");
                input.click();

                input.onchange = async () => {
                  const file = input.files ? input.files[0] : null;
                  if (!file) return;

                  const formData = new FormData();
                  formData.append("files", file);

                  try {
                    const res = await fetch("/api/upload", {
                      method: "POST",
                      body: formData,
                    });
                    const data = await res.json();

                    if (res.ok && data.urls && data.urls.length > 0) {
                      const url = data.urls[0];
                      const range = quill.getSelection(true);
                      quill.insertEmbed(range.index, "image", url);
                      quill.setSelection(range.index + 1);
                    } else {
                      alert(data.error || "Image upload failed");
                    }
                  } catch (err) {
                    console.error("Upload error", err);
                    alert("An error occurred during image upload");
                  }
                };
              },
            },
          },
          clipboard: {
            matchVisual: false,
          },
        },
      });

      quillInstanceRef.current = quill;

      if (value) {
        quill.clipboard.dangerouslyPasteHTML(value);
      }

      quill.on("text-change", () => {
        onChange(quill.root.innerHTML);
      });
    };

    // Load CSS
    if (!document.getElementById("quill-css")) {
      const link = document.createElement("link");
      link.id = "quill-css";
      link.rel = "stylesheet";
      link.href = "https://cdn.quilljs.com/1.3.6/quill.snow.css";
      document.head.appendChild(link);
    }

    // Load JS
    if (!window.Quill && !isInitializingRef.current) {
      isInitializingRef.current = true;
      const script = document.createElement("script");
      script.src = "https://cdn.quilljs.com/1.3.6/quill.min.js";
      script.onload = () => {
        initQuill();
      };
      document.head.appendChild(script);
    } else if (window.Quill) {
      initQuill();
    }
  }, []);

  // Update value from outside
  useEffect(() => {
    if (quillInstanceRef.current && value !== quillInstanceRef.current.root.innerHTML) {
      const currentSelection = quillInstanceRef.current.getSelection();
      quillInstanceRef.current.clipboard.dangerouslyPasteHTML(value);
      if (currentSelection) {
        quillInstanceRef.current.setSelection(currentSelection);
      }
    }
  }, [value]);

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm relative group">
      {/* Source Toggle Button */}
      <div className={`absolute top-2.5 right-3 z-10 transition-opacity ${isSourceMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <button 
          type="button"
          onClick={() => setIsSourceMode(!isSourceMode)}
          className={`text-xs font-bold px-3 py-1.5 rounded-md transition-colors shadow-sm ${
            isSourceMode ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {isSourceMode ? "View Rich Text" : "</> Source Code"}
        </button>
      </div>

      <div className={`quill-container ${isSourceMode ? 'hidden' : 'block'}`}>
        <style>{`
          .quill-container .ql-toolbar {
            border: none !important;
            border-bottom: 1px solid #e5e7eb !important;
            background-color: #f9fafb;
            border-top-left-radius: 0.75rem;
            border-top-right-radius: 0.75rem;
            padding: 12px;
            padding-right: 120px; /* Make room for the toggle button */
          }
          .quill-container .ql-container {
            border: none !important;
            font-family: inherit;
            font-size: 1rem;
          }
          .quill-container .ql-editor {
            min-height: 400px;
            padding: 1.5rem;
            line-height: 1.8;
            color: #374151;
          }
          .quill-container .ql-editor.ql-blank::before {
            font-style: normal;
            color: #9ca3af;
          }
        `}</style>
        <div ref={editorRef} />
      </div>

      {isSourceMode && (
        <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 text-gray-400 text-xs font-mono font-bold tracking-wider uppercase">
          HTML Source Mode
        </div>
      )}
      {isSourceMode && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-h-[400px] p-6 font-mono text-sm text-gray-300 bg-gray-900 border-none focus:ring-0 outline-none resize-y"
          placeholder="<p>Type your HTML tags here...</p>"
          spellCheck="false"
        />
      )}
    </div>
  );
}
