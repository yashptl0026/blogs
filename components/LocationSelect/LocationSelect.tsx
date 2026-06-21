"use client";

import { useState, useEffect } from "react";

interface Option { value: string; label: string; }

interface Props {
  /** Fires whenever the deepest selected location changes */
  onChange: (ids: {
    stateId?: string;
    districtId?: string;
    talukaId?: string;
    villageId?: string;
  }) => void;

  /** Optional initial values */
  defaultStateId?: string;
  defaultDistrictId?: string;
  defaultTalukaId?: string;
  defaultVillageId?: string;

  /** Show village level or stop at taluka */
  showVillage?: boolean;

  /** Optional additional classnames for wrapper */
  className?: string;
}

interface State {
  id: string; nameEn: string;
  districts: District[];
}
interface District {
  id: string; nameEn: string;
  talukas: Taluka[];
}
interface Taluka {
  id: string; nameEn: string;
  villages: Village[];
}
interface Village { id: string; nameEn: string; }

function SearchableSelect({
  id,
  options,
  value,
  onChange,
  placeholder,
  disabled,
  label,
  onCreate,
  isCreating,
}: {
  id: string;
  options: Option[];
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  disabled?: boolean;
  label: string;
  onCreate?: (name: string) => void;
  isCreating?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  const selected = options.find(o => o.value === value);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const el = document.getElementById(`ss-wrapper-${id}`);
      if (el && !el.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, id]);

  const exactMatch = options.find(o => o.label.toLowerCase() === search.toLowerCase().trim());

  return (
    <div className="space-y-1">
      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}
      </label>
      <div id={`ss-wrapper-${id}`} className="relative">
        {/* Trigger */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => { if (!disabled) setOpen(v => !v); }}
          className={`w-full flex items-center justify-between gap-2 border rounded-xl px-3 py-2.5 text-sm text-left transition-colors bg-white dark:bg-neutral-800
            ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-neutral-900 border-gray-100 dark:border-neutral-800" : "border-gray-200 dark:border-neutral-700 hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer"}
            ${open ? "border-blue-500 ring-1 ring-blue-200 dark:ring-blue-900" : ""}
          `}
        >
          <span className={selected ? "text-gray-800 dark:text-white font-medium" : "text-gray-400 dark:text-gray-500"}>
            {selected ? selected.label : placeholder}
          </span>
          <svg className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute z-50 left-0 right-0 mt-1 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-xl overflow-hidden">
            {/* Search Input */}
            <div className="p-2 border-b border-gray-100 dark:border-neutral-700">
              <input
                autoFocus
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={`Search or add new ${label.toLowerCase()}...`}
                className="w-full text-sm px-3 py-2 border border-gray-200 dark:border-neutral-700 rounded-lg outline-none focus:border-blue-400 bg-gray-50 dark:bg-neutral-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-500"
              />
            </div>

            {/* Options List */}
            <div className="max-h-52 overflow-y-auto">
              {/* Clear option */}
              {value && (
                <button
                  type="button"
                  onClick={() => { onChange(""); setOpen(false); setSearch(""); }}
                  className="w-full text-left px-4 py-2.5 text-xs text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-neutral-700 border-b border-gray-50 dark:border-neutral-700 italic"
                >
                  — Clear selection —
                </button>
              )}

              {onCreate && search.trim() && !exactMatch && (
                <button
                  type="button"
                  onClick={() => {
                    if (!isCreating) onCreate(search.trim());
                  }}
                  disabled={isCreating}
                  className="w-full text-left px-4 py-2.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 border-b border-blue-100 dark:border-neutral-700 flex items-center gap-2"
                >
                  {isCreating ? "Adding..." : `+ Add "${search.trim()}"`}
                </button>
              )}

              {filtered.length === 0 && (!onCreate || !search.trim()) ? (
                <div className="px-4 py-6 text-center text-sm text-gray-400">
                  {options.length === 0 ? "No options available" : "No matches found"}
                </div>
              ) : (
                filtered.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400
                      ${opt.value === value ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold" : "text-gray-700 dark:text-gray-300"}
                    `}
                  >
                    {opt.label}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LocationSelect({
  onChange,
  defaultStateId = "",
  defaultDistrictId = "",
  defaultTalukaId = "",
  defaultVillageId = "",
  showVillage = true,
  className = "",
}: Props) {
  const [allStates, setAllStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(true);

  const [stateId, setStateId] = useState(defaultStateId);
  const [districtId, setDistrictId] = useState(defaultDistrictId);
  const [talukaId, setTalukaId] = useState(defaultTalukaId);
  const [villageId, setVillageId] = useState(defaultVillageId);

  // Fetch full location tree once
  useEffect(() => {
    fetch("/api/locations?all=true")
      .then(r => r.json())
      .then(d => { setAllStates(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Derived options
  const stateOptions: Option[] = allStates.map(s => ({ value: s.id, label: s.nameEn }));

  const selectedState = allStates.find(s => s.id === stateId);
  const districtOptions: Option[] = selectedState?.districts?.map(d => ({ value: d.id, label: d.nameEn })) || [];

  const selectedDistrict = selectedState?.districts?.find(d => d.id === districtId);
  const talukaOptions: Option[] = selectedDistrict?.talukas?.map(t => ({ value: t.id, label: t.nameEn })) || [];

  const selectedTaluka = selectedDistrict?.talukas?.find(t => t.id === talukaId);
  const villageOptions: Option[] = selectedTaluka?.villages?.map(v => ({ value: v.id, label: v.nameEn })) || [];

  const [isCreating, setIsCreating] = useState(false);

  // Emit changes
  useEffect(() => {
    onChange({ stateId, districtId, talukaId, villageId });
  }, [stateId, districtId, talukaId, villageId]);

  const handleStateChange = (v: string) => {
    setStateId(v);
    setDistrictId("");
    setTalukaId("");
    setVillageId("");
  };

  const handleDistrictChange = (v: string) => {
    setDistrictId(v);
    setTalukaId("");
    setVillageId("");
  };

  const handleTalukaChange = (v: string) => {
    setTalukaId(v);
    setVillageId("");
  };

  const handleCreate = async (type: string, nameEn: string, parentId?: string) => {
    setIsCreating(true);
    try {
      const res = await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, nameEn, parentId })
      });
      const data = await res.json();
      if (res.ok) {
        // Optimistically update local tree to avoid slow refetch
        setAllStates(prev => {
          const next = JSON.parse(JSON.stringify(prev));
          if (type === 'state') {
            next.push({ ...data, districts: [] });
            next.sort((a: any, b: any) => a.nameEn.localeCompare(b.nameEn));
          } else if (type === 'district') {
            const s = next.find((x: any) => x.id === parentId);
            if (s) {
              s.districts.push({ ...data, talukas: [] });
              s.districts.sort((a: any, b: any) => a.nameEn.localeCompare(b.nameEn));
            }
          } else if (type === 'taluka') {
            const s = next.find((x: any) => x.districts.some((d: any) => d.id === parentId));
            if (s) {
              const d = s.districts.find((d: any) => d.id === parentId);
              if (d) {
                d.talukas.push({ ...data, villages: [] });
                d.talukas.sort((a: any, b: any) => a.nameEn.localeCompare(b.nameEn));
              }
            }
          } else if (type === 'village') {
            const s = next.find((x: any) => x.districts.some((d: any) => d.talukas.some((t: any) => t.id === parentId)));
            if (s) {
              const d = s.districts.find((d: any) => d.talukas.some((t: any) => t.id === parentId));
              if (d) {
                const t = d.talukas.find((t: any) => t.id === parentId);
                if (t) {
                  t.villages.push(data);
                  t.villages.sort((a: any, b: any) => a.nameEn.localeCompare(b.nameEn));
                }
              }
            }
          }
          return next;
        });

        // Auto-select the newly created item
        if (type === 'state') handleStateChange(data.id);
        if (type === 'district') handleDistrictChange(data.id);
        if (type === 'taluka') handleTalukaChange(data.id);
        if (type === 'village') setVillageId(data.id);
      } else {
        alert(data.error || "Failed to create location");
      }
    } catch (e) {
      alert("Error creating location");
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div className={`space-y-3 ${className}`}>
        {[1, 2].map(i => (
          <div key={i} className="space-y-1">
            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 bg-gray-100 rounded-xl animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={className || "space-y-3"}>
      <SearchableSelect
        id="state"
        label="State / UT"
        options={stateOptions}
        value={stateId}
        onChange={handleStateChange}
        placeholder="Select State or Union Territory"
        onCreate={(name) => handleCreate("state", name)}
        isCreating={isCreating}
      />

      <SearchableSelect
        id="district"
        label="District"
        options={districtOptions}
        value={districtId}
        onChange={handleDistrictChange}
        placeholder={stateId ? "Select District" : "Select a state first"}
        disabled={!stateId}
        onCreate={(name) => handleCreate("district", name, stateId)}
        isCreating={isCreating}
      />

      <SearchableSelect
        id="taluka"
        label="Taluka"
        options={talukaOptions}
        value={talukaId}
        onChange={handleTalukaChange}
        placeholder={districtId ? "Select Taluka" : "Select a district first"}
        disabled={!districtId}
        onCreate={(name) => handleCreate("taluka", name, districtId)}
        isCreating={isCreating}
      />

      {showVillage && (
        <SearchableSelect
          id="village"
          label="Village"
          options={villageOptions}
          value={villageId}
          onChange={setVillageId}
          placeholder={talukaId ? "Select Village" : "Select a taluka first"}
          disabled={!talukaId}
          onCreate={(name) => handleCreate("village", name, talukaId)}
          isCreating={isCreating}
        />
      )}
    </div>
  );
}
