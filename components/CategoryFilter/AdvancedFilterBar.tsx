"use client";

import React, { useState, useEffect } from "react";
import { SlidersHorizontal, RotateCcw, Search, MapPin } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { getTranslation } from "@/lib/i18n";

interface LocationNode {
  id: string;
  nameEn: string;
  nameHi?: string | null;
  nameGu?: string | null;
  lat?: number | null;
  lng?: number | null;
}

interface VillageNode extends LocationNode {
  lat: number;
  lng: number;
}

interface TalukaNode extends LocationNode {
  villages: VillageNode[];
}

interface DistrictNode extends LocationNode {
  talukas: TalukaNode[];
}

interface StateNode extends LocationNode {
  districts: DistrictNode[];
}

interface AdvancedFilterBarProps {
  onFilterChange: (filters: {
    search: string;
    stateId: string;
    districtId: string;
    talukaId: string;
    villageId: string;
    lat: number | null;
    lng: number | null;
  }) => void;
}

export default function AdvancedFilterBar({ onFilterChange }: AdvancedFilterBarProps) {
  const { language, t } = useLanguage();

  const [locations, setLocations] = useState<StateNode[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState("");
  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [selectedTalukaId, setSelectedTalukaId] = useState("");
  const [selectedVillageId, setSelectedVillageId] = useState("");

  // Lists populated dynamically
  const [districts, setDistricts] = useState<DistrictNode[]>([]);
  const [talukas, setTalukas] = useState<TalukaNode[]>([]);
  const [villages, setVillages] = useState<VillageNode[]>([]);

  // Fetch all locations on mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch("/api/locations?all=true");
        if (res.ok) {
          const data = await res.json();
          setLocations(data);
        }
      } catch (err) {
        console.error("Failed to load locations hierarchy", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  // Sync child dropdown lists when parents change
  useEffect(() => {
    if (selectedStateId) {
      const stateObj = locations.find((s) => s.id === selectedStateId);
      setDistricts(stateObj ? stateObj.districts : []);
    } else {
      setDistricts([]);
    }
    setSelectedDistrictId("");
    setSelectedTalukaId("");
    setSelectedVillageId("");
  }, [selectedStateId, locations]);

  useEffect(() => {
    if (selectedDistrictId) {
      const districtObj = districts.find((d) => d.id === selectedDistrictId);
      setTalukas(districtObj ? districtObj.talukas : []);
    } else {
      setTalukas([]);
    }
    setSelectedTalukaId("");
    setSelectedVillageId("");
  }, [selectedDistrictId, districts]);

  useEffect(() => {
    if (selectedTalukaId) {
      const talukaObj = talukas.find((t) => t.id === selectedTalukaId);
      setVillages(talukaObj ? talukaObj.villages : []);
    } else {
      setVillages([]);
    }
    setSelectedVillageId("");
  }, [selectedTalukaId, talukas]);

  // Propagate filter state changes to parent feed
  useEffect(() => {
    let activeLat: number | null = null;
    let activeLng: number | null = null;

    // If a village is chosen, get its lat/lng coordinates to allow nearby places checks
    if (selectedVillageId) {
      const vilObj = villages.find((v) => v.id === selectedVillageId);
      if (vilObj) {
        activeLat = vilObj.lat;
        activeLng = vilObj.lng;
      }
    } else if (selectedTalukaId) {
      const talObj = talukas.find((t) => t.id === selectedTalukaId);
      if (talObj && talObj.lat && talObj.lng) {
        activeLat = talObj.lat;
        activeLng = talObj.lng;
      }
    }

    onFilterChange({
      search,
      stateId: selectedStateId,
      districtId: selectedDistrictId,
      talukaId: selectedTalukaId,
      villageId: selectedVillageId,
      lat: activeLat,
      lng: activeLng,
    });
  }, [search, selectedStateId, selectedDistrictId, selectedTalukaId, selectedVillageId]);

  const handleReset = () => {
    setSearch("");
    setSelectedStateId("");
  };

  const hasActiveFilters = search !== "" || selectedStateId !== "";

  return (
    <div className="bg-editorial-card rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-editorial-border space-y-6 transition-all duration-300 relative z-20">
      {/* Search Bar + Icon */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1 group">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-editorial-muted group-focus-within:text-blue-600 transition-colors">
            <Search className="h-5 w-5" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full bg-editorial-bg border border-editorial-border pl-12 pr-4 py-3.5 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:bg-editorial-bg rounded-2xl text-editorial-text transition-all font-medium placeholder-editorial-muted"
          />
        </div>

        <div className="flex items-center gap-3 justify-between md:justify-end">
          <div className="flex items-center gap-2 text-editorial-muted font-medium text-xs px-4 py-3 bg-editorial-bg rounded-2xl border border-editorial-border">
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span className="tracking-wider text-[11px] font-bold uppercase">{t("nearbyRadius")}</span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 text-orange-600 hover:text-white hover:bg-orange-500 transition-all duration-300 font-bold tracking-widest text-[11px] uppercase border border-orange-200 py-3 px-5 rounded-2xl bg-orange-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-editorial-border to-transparent my-2" />

      {/* Hierarchical Dropdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-sm">
        {/* 1. State */}
        <div className="space-y-2 text-left relative">
          <label htmlFor="state-select" className="text-[10px] font-black text-editorial-muted uppercase tracking-widest block pl-1">
            {t("state")}
          </label>
          <select
            id="state-select"
            value={selectedStateId}
            disabled={loading}
            onChange={(e) => setSelectedStateId(e.target.value)}
            className="w-full bg-editorial-bg border border-editorial-border py-3 px-4 rounded-xl text-editorial-text font-semibold focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:bg-editorial-card cursor-pointer transition-all appearance-none"
          >
            <option value="">{loading ? "Loading..." : `Select ${t("state")}`}</option>
            {locations.map((state) => (
              <option key={state.id} value={state.id}>
                {getTranslation(state, "name", language)}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-10 pointer-events-none text-editorial-muted">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        {/* 2. District */}
        <div className="space-y-2 text-left relative">
          <label htmlFor="district-select" className="text-[10px] font-black text-editorial-muted uppercase tracking-widest block pl-1">
            {t("district")}
          </label>
          <select
            id="district-select"
            value={selectedDistrictId}
            disabled={!selectedStateId}
            onChange={(e) => setSelectedDistrictId(e.target.value)}
            className="w-full bg-editorial-bg border border-editorial-border py-3 px-4 rounded-xl text-editorial-text font-semibold focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:bg-editorial-card cursor-pointer transition-all appearance-none disabled:opacity-50 disabled:bg-editorial-bg"
          >
            <option value="">{selectedStateId ? `Select ${t("district")}` : `Choose ${t("state")}`}</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {getTranslation(d, "name", language)}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-10 pointer-events-none text-editorial-muted">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        {/* 3. Taluka */}
        <div className="space-y-2 text-left relative">
          <label htmlFor="taluka-select" className="text-[10px] font-black text-editorial-muted uppercase tracking-widest block pl-1">
            {t("taluka")}
          </label>
          <select
            id="taluka-select"
            value={selectedTalukaId}
            disabled={!selectedDistrictId}
            onChange={(e) => setSelectedTalukaId(e.target.value)}
            className="w-full bg-editorial-bg border border-editorial-border py-3 px-4 rounded-xl text-editorial-text font-semibold focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:bg-editorial-card cursor-pointer transition-all appearance-none disabled:opacity-50 disabled:bg-editorial-bg"
          >
            <option value="">{selectedDistrictId ? `Select ${t("taluka")}` : `Choose ${t("district")}`}</option>
            {talukas.map((tNode) => (
              <option key={tNode.id} value={tNode.id}>
                {getTranslation(tNode, "name", language)}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-10 pointer-events-none text-editorial-muted">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        {/* 4. Village */}
        <div className="space-y-2 text-left relative">
          <label htmlFor="village-select" className="text-[10px] font-black text-editorial-muted uppercase tracking-widest block pl-1">
            {t("village")}
          </label>
          <select
            id="village-select"
            value={selectedVillageId}
            disabled={!selectedTalukaId}
            onChange={(e) => setSelectedVillageId(e.target.value)}
            className="w-full bg-editorial-bg border border-editorial-border py-3 px-4 rounded-xl text-editorial-text font-semibold focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:bg-editorial-card cursor-pointer transition-all appearance-none disabled:opacity-50 disabled:bg-editorial-bg"
          >
            <option value="">{selectedTalukaId ? `Select ${t("village")}` : `Choose ${t("taluka")}`}</option>
            {villages.map((v) => (
              <option key={v.id} value={v.id}>
                {getTranslation(v, "name", language)}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-10 pointer-events-none text-editorial-muted">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>
    </div>
  );
}
