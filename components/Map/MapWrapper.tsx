"use client";

import dynamic from "next/dynamic";

const InteractiveMap = dynamic(() => import("./InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[300px] bg-travel-gray/40 flex items-center justify-center border border-travel-border">
      <div className="text-xs text-travel-muted font-sans animate-pulse">
        Initializing map viewport...
      </div>
    </div>
  ),
});

export default InteractiveMap;
