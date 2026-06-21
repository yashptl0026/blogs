"use client";

import { useEffect, useRef, useCallback } from "react";

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const TOOLBAR_BUTTONS = [
  {
    group: "history",
    items: [
      { cmd: "undo", icon: "↺", title: "Undo" },
      { cmd: "redo", icon: "↻", title: "Redo" },
    ],
  },
  {
    group: "format",
    items: [
      { cmd: "bold", icon: "<b>B</b>", title: "Bold (Ctrl+B)" },
      { cmd: "italic", icon: "<i>I</i>", title: "Italic (Ctrl+I)" },
      { cmd: "underline", icon: "<u>U</u>", title: "Underline (Ctrl+U)" },
      { cmd: "strikeThrough", icon: "<s>S</s>", title: "Strikethrough" },
    ],
  },
  {
    group: "headings",
    items: [
      { cmd: "h1", icon: "H1", title: "Heading 1", isBlock: true },
      { cmd: "h2", icon: "H2", title: "Heading 2", isBlock: true },
      { cmd: "h3", icon: "H3", title: "Heading 3", isBlock: true },
      { cmd: "p", icon: "¶", title: "Paragraph", isBlock: true },
    ],
  },
  {
    group: "lists",
    items: [
      { cmd: "insertUnorderedList", icon: "≡•", title: "Bullet List" },
      { cmd: "insertOrderedList", icon: "≡1", title: "Numbered List" },
    ],
  },
  {
    group: "align",
    items: [
      { cmd: "justifyLeft", icon: "⬜◀", title: "Align Left" },
      { cmd: "justifyCenter", icon: "⬛", title: "Center" },
      { cmd: "justifyRight", icon: "⬜▶", title: "Align Right" },
    ],
  },
  {
    group: "blocks",
    items: [
      { cmd: "blockquote", icon: "❝", title: "Blockquote", isBlock: true },
      { cmd: "pre", icon: "</>", title: "Code Block", isBlock: true },
      { cmd: "insertHorizontalRule", icon: "—", title: "Divider" },
    ],
  },
];

export default function RichEditor({ value, onChange, placeholder = "Start writing...", minHeight = "400px" }: RichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdating = useRef(false);

  // Sync value → editor (only on initial mount or external value reset)
  useEffect(() => {
    if (!editorRef.current) return;
    if (editorRef.current.innerHTML !== value) {
      isUpdating.current = true;
      editorRef.current.innerHTML = value || "";
      isUpdating.current = false;
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (!editorRef.current || isUpdating.current) return;
    onChange(editorRef.current.innerHTML);
  }, [onChange]);

  const exec = useCallback((cmd: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
    handleInput();
  }, [handleInput]);

  const execBlock = useCallback((tag: string) => {
    editorRef.current?.focus();
    document.execCommand("formatBlock", false, tag);
    handleInput();
  }, [handleInput]);

  const handleToolbarClick = (cmd: string, isBlock?: boolean) => {
    if (isBlock) {
      execBlock(cmd);
    } else {
      exec(cmd);
    }
  };

  const handleLink = () => {
    const url = prompt("Enter link URL:", "https://");
    if (url) exec("createLink", url);
  };

  const handleImage = () => {
    const url = prompt("Enter image URL:", "https://images.unsplash.com/");
    if (url) exec("insertImage", url);
  };

  const handleForeColor = (color: string) => {
    exec("foreColor", color);
  };

  // Prevent paste of rich HTML from external sources — keep formatting
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/html") || e.clipboardData.getData("text/plain");
    document.execCommand("insertHTML", false, text);
    handleInput();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Tab → insert spaces
    if (e.key === "Tab") {
      e.preventDefault();
      document.execCommand("insertHTML", false, "&nbsp;&nbsp;&nbsp;&nbsp;");
      handleInput();
    }
  };

  const activeQuery = (cmd: string) => {
    try { return document.queryCommandState(cmd); } catch { return false; }
  };

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-200 transition-all">
      {/* ─── Toolbar ─── */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-100 bg-gray-50 sticky top-0 z-10">
        {TOOLBAR_BUTTONS.map((group, gi) => (
          <span key={gi} className="flex items-center">
            {gi > 0 && <span className="w-px h-5 bg-gray-200 mx-1.5" />}
            {group.items.map(btn => (
              <button
                key={btn.cmd}
                type="button"
                title={btn.title}
                onMouseDown={e => { e.preventDefault(); handleToolbarClick(btn.cmd, btn.isBlock); }}
                className="inline-flex items-center justify-center w-8 h-8 text-sm rounded-lg hover:bg-blue-50 hover:text-blue-700 text-gray-600 transition-colors font-mono"
                dangerouslySetInnerHTML={{ __html: btn.icon }}
              />
            ))}
          </span>
        ))}

        {/* Divider */}
        <span className="w-px h-5 bg-gray-200 mx-1.5" />

        {/* Link */}
        <button
          type="button"
          title="Insert Link"
          onMouseDown={e => { e.preventDefault(); handleLink(); }}
          className="inline-flex items-center justify-center w-8 h-8 text-sm rounded-lg hover:bg-blue-50 hover:text-blue-700 text-gray-600 transition-colors"
        >
          🔗
        </button>

        {/* Image */}
        <button
          type="button"
          title="Insert Image"
          onMouseDown={e => { e.preventDefault(); handleImage(); }}
          className="inline-flex items-center justify-center w-8 h-8 text-sm rounded-lg hover:bg-blue-50 hover:text-blue-700 text-gray-600 transition-colors"
        >
          🖼️
        </button>

        {/* Color Picker */}
        <span className="w-px h-5 bg-gray-200 mx-1.5" />
        <div className="flex items-center gap-1">
          {["#1a1a1a","#ef4444","#f97316","#eab308","#22c55e","#3b82f6","#8b5cf6","#ec4899","#6b7280"].map(color => (
            <button
              key={color}
              type="button"
              title={`Text color: ${color}`}
              onMouseDown={e => { e.preventDefault(); handleForeColor(color); }}
              className="w-5 h-5 rounded-full border border-white shadow-sm hover:scale-110 transition-transform flex-shrink-0"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        {/* Remove formatting */}
        <span className="w-px h-5 bg-gray-200 mx-1.5" />
        <button
          type="button"
          title="Remove Formatting"
          onMouseDown={e => { e.preventDefault(); exec("removeFormat"); }}
          className="inline-flex items-center justify-center px-2 h-8 text-xs rounded-lg hover:bg-red-50 hover:text-red-600 text-gray-500 transition-colors font-medium"
        >
          Tx
        </button>
      </div>

      {/* ─── Editable Area ─── */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          style={{ minHeight }}
          className={`
            px-6 py-5 text-gray-800 text-[15px] leading-relaxed
            outline-none cursor-text
            [&_h1]:text-3xl [&_h1]:font-black [&_h1]:mb-3 [&_h1]:mt-5 [&_h1]:text-gray-900
            [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-gray-900
            [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:text-gray-900
            [&_p]:mb-3 [&_p]:leading-7
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_ul]:space-y-1
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3 [&_ol]:space-y-1
            [&_li]:leading-7
            [&_blockquote]:border-l-4 [&_blockquote]:border-blue-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-500 [&_blockquote]:my-4 [&_blockquote]:bg-blue-50 [&_blockquote]:py-2 [&_blockquote]:rounded-r-lg
            [&_pre]:bg-gray-900 [&_pre]:text-green-400 [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:my-4 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:overflow-x-auto
            [&_code]:bg-gray-100 [&_code]:text-red-600 [&_code]:px-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
            [&_a]:text-blue-600 [&_a]:underline [&_a]:cursor-pointer
            [&_img]:max-w-full [&_img]:rounded-xl [&_img]:my-4 [&_img]:shadow-md
            [&_hr]:border-gray-200 [&_hr]:my-6
            [&_b]:font-bold [&_strong]:font-bold
            [&_i]:italic [&_em]:italic
            [&_u]:underline
            [&_s]:line-through
          `}
        />

        {/* Placeholder */}
        {(!value || value === "" || value === "<br>") && (
          <div className="absolute top-5 left-6 text-gray-300 text-[15px] pointer-events-none select-none">
            {placeholder}
          </div>
        )}
      </div>

      {/* ─── Footer: word count ─── */}
      <div className="px-6 py-2 border-t border-gray-50 bg-gray-50 flex items-center justify-between text-xs text-gray-400">
        <span>
          {value ? value.replace(/<[^>]*>/g, "").trim().split(/\s+/).filter(Boolean).length : 0} words
        </span>
        <span className="text-gray-300">Rich Text Editor</span>
      </div>
    </div>
  );
}
