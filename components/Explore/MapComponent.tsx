"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default icon paths in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapComponentProps {
  posts: any[];
}

export default function MapComponent({ posts }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    // Filter posts that have valid coordinates
    const mapPosts = posts.filter(p => p.lat && p.lng);

    // Initialize Map if not already done
    if (!mapRef.current) {
      // Default center: India
      const initialCenter: [number, number] = [20.5937, 78.9629];
      
      mapRef.current = L.map(containerRef.current).setView(initialCenter, 5);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add new markers
    const bounds = L.latLngBounds([]);

    mapPosts.forEach(post => {
      const latLng = L.latLng(post.lat, post.lng);
      bounds.extend(latLng);

      const customIcon = L.divIcon({
        className: "custom-map-marker",
        html: `<div style="background-color: #2563eb; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      const popupHtml = `
        <div style="width: 200px; padding: 0;">
          <img src="${post.coverImage}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 8px 8px 0 0; margin-bottom: 8px;" />
          <h4 style="font-family: Inter, sans-serif; font-weight: 800; font-size: 14px; margin: 0 8px 4px; line-height: 1.2;">${post.titleEn}</h4>
          <a href="/blog/${post.slug}" style="display: block; margin: 0 8px 8px; font-size: 12px; color: #2563eb; text-decoration: none; font-weight: 600;">Read Article →</a>
        </div>
      `;

      L.marker(latLng, { icon: customIcon })
        .addTo(map)
        .bindPopup(popupHtml, { className: "custom-leaflet-popup" });
    });

    // Auto-fit bounds if we have markers
    if (mapPosts.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }

  }, [posts]);

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-700">Interactive Map</h3>
        <span className="text-xs text-gray-500 font-medium">{posts.filter(p => p.lat && p.lng).length} Locations Found</span>
      </div>
      <div ref={containerRef} style={{ width: "100%", height: "400px", zIndex: 1 }} />
      <style>{`
        .custom-leaflet-popup .leaflet-popup-content-wrapper {
          padding: 0;
          overflow: hidden;
          border-radius: 8px;
        }
        .custom-leaflet-popup .leaflet-popup-content {
          margin: 0;
          line-height: normal;
        }
      `}</style>
    </div>
  );
}
