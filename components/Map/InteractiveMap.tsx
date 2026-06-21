"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapPin {
  id: string;
  title: string;
  slug: string;
  lat: number;
  lng: number;
  isCurrent?: boolean;
}

interface InteractiveMapProps {
  pins: MapPin[];
  center: [number, number];
  zoom?: number;
}

export default function InteractiveMap({ pins, center, zoom = 10 }: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.FeatureGroup | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    // Reset default marker icons for Leaflet (Next.js asset resolving fix)
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });

    // Custom red icon for the active destination
    const activeIcon = L.icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const standardIcon = L.icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    // Initialize Map Instance if it doesn't exist
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      // Layer options: CartoDB Positron is an elegant off-white theme that matches off-white theme specs
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
      }).addTo(mapInstanceRef.current);

      markersGroupRef.current = L.featureGroup().addTo(mapInstanceRef.current);
    } else {
      // If it exists, update view
      mapInstanceRef.current.setView(center, zoom);
    }

    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;

    if (markersGroup) {
      // Clear existing markers
      markersGroup.clearLayers();

      // Add pins to map
      pins.forEach((pin) => {
        const marker = L.marker([pin.lat, pin.lng], {
          icon: pin.isCurrent ? activeIcon : standardIcon,
        });

        // Add details popup
        const popupContent = `
          <div style="font-family: sans-serif; padding: 4px; max-width: 200px;">
            <strong style="display: block; font-size: 12px; margin-bottom: 4px; color: #111825;">${pin.title}</strong>
            ${
              pin.isCurrent
                ? '<span style="font-size: 10px; background-color: #ea580c; color: white; padding: 2px 6px; border-radius: 2px; font-weight: bold;">Current Destination</span>'
                : `<a href="/blog/${pin.slug}" style="font-size: 10px; color: #ea580c; text-decoration: underline; font-weight: bold;">View Details</a>`
            }
          </div>
        `;

        marker.bindPopup(popupContent);
        markersGroup.addLayer(marker);
      });

      // Fit bounds if there are multiple markers
      if (pins.length > 1 && map) {
        map.fitBounds(markersGroup.getBounds(), { padding: [40, 40] });
      }
    }

    return () => {
      // We keep the instance alive but clean up on unmount if needed
    };
  }, [pins, center, zoom]);

  // Clean up full map instance on total unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersGroupRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full rounded-none border border-editorial-border overflow-hidden bg-editorial-bg transition-colors duration-300">
      {/* Fallback Loader */}
      <div className="absolute inset-0 flex items-center justify-center text-xs text-editorial-muted font-sans z-0 pointer-events-none">
        Loading interactive map...
      </div>
      <div ref={mapContainerRef} className="w-full h-full relative z-10" />
    </div>
  );
}
