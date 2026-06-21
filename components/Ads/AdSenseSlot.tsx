import React from "react";

interface AdSenseSlotProps {
  className?: string;
  adClient?: string;
  adSlot?: string;
  format?: string;
  responsive?: string;
}

export default function AdSenseSlot({
  className = "",
  adClient = "ca-pub-XXXXXXXXXXXXXXXX",
  adSlot = "XXXXXXXXXX",
  format = "auto",
  responsive = "true",
}: AdSenseSlotProps) {
  // In a real production environment, you would inject the Google AdSense script here.
  // For now, this serves as a beautiful placeholder box showing exactly where the ads will load.

  return (
    <div className={`relative flex items-center justify-center bg-gray-50 border border-dashed border-gray-300 rounded-xl overflow-hidden ${className}`}>
      {/* Visual Placeholder Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-4 text-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Advertisement</span>
        <svg className="w-6 h-6 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
        <p className="text-xs font-medium">Google AdSense Placement</p>
        <p className="text-[10px] mt-1 opacity-75 hidden sm:block">Slot: {adSlot}</p>
      </div>

      {/* Actual AdSense Tag (Hidden in dev, uncomment in production) */}
      {/* 
      <ins className="adsbygoogle"
           style={{ display: "block" }}
           data-ad-client={adClient}
           data-ad-slot={adSlot}
           data-ad-format={format}
           data-full-width-responsive={responsive}>
      </ins>
      <script>
           (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
      */}
    </div>
  );
}
