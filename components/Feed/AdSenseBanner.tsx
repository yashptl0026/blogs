"use client";

interface AdSenseBannerProps {
  slot: string;
  className?: string;
  type?: "horizontal" | "vertical" | "square";
}

export default function AdSenseBanner({ slot, className = "", type = "horizontal" }: AdSenseBannerProps) {
  const minHeight = type === "vertical" ? "min-h-[300px]" : type === "square" ? "min-h-[250px]" : "min-h-[120px]";
  const maxWidth = type === "vertical" ? "max-w-[250px]" : "w-full";

  return (
    <div 
      className={`bg-travel-gray/50 border border-travel-border/80 p-6 flex flex-col items-center justify-center relative transition-all duration-300 hover:shadow-premium group ${minHeight} ${maxWidth} ${className}`}
      aria-label="Advertisement Banner Placeholder"
    >
      {/* Label */}
      <span className="absolute top-2 right-3 text-[8px] tracking-widest font-bold text-travel-muted/60 uppercase">
        Sponsored / Ad
      </span>
      
      {/* Cross icon representation */}
      <span className="absolute top-2 left-3 text-[9px] text-travel-muted/40 cursor-default">
        ⓘ
      </span>

      {/* Decorative dashed boundary representing Ad Space */}
      <div className="w-full h-full border border-dashed border-travel-border/50 rounded-sm flex flex-col items-center justify-center p-4">
        <div className="w-8 h-8 rounded-full border border-travel-accent/30 flex items-center justify-center text-travel-accent text-xs font-bold font-display mb-2 group-hover:scale-110 transition-transform duration-300">
          Ad
        </div>
        <h4 className="text-[10px] tracking-widest text-travel-dark font-display font-semibold uppercase mb-1">
          Google AdSense Placeholder
        </h4>
        <p className="text-[9px] text-travel-muted text-center font-sans max-w-[200px] leading-relaxed">
          Responsive Slot ID: <code className="bg-travel-gray px-1 py-0.5 rounded text-[8px]">{slot}</code>
        </p>
      </div>
    </div>
  );
}
