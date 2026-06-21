"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Loader2, MapPin, ChevronRight, X } from "lucide-react";

type LocationType = "state" | "district" | "taluka" | "village";

export default function LocationsTab() {
  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [talukas, setTalukas] = useState<any[]>([]);
  const [villages, setVillages] = useState<any[]>([]);

  const [selectedState, setSelectedState] = useState<any | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any | null>(null);
  const [selectedTaluka, setSelectedTaluka] = useState<any | null>(null);

  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingTalukas, setLoadingTalukas] = useState(false);
  const [loadingVillages, setLoadingVillages] = useState(false);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<LocationType>("state");
  const [formData, setFormData] = useState({ nameEn: "", nameHi: "", nameGu: "", lat: "", lng: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (selectedState) fetchDistricts(selectedState.id);
    else setDistricts([]);
    setSelectedDistrict(null);
  }, [selectedState]);

  useEffect(() => {
    if (selectedDistrict) fetchTalukas(selectedDistrict.id);
    else setTalukas([]);
    setSelectedTaluka(null);
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedTaluka) fetchVillages(selectedTaluka.id);
    else setVillages([]);
  }, [selectedTaluka]);

  const fetchStates = async () => {
    setLoadingStates(true);
    try {
      const res = await fetch("/api/locations");
      if (res.ok) setStates(await res.json());
    } finally {
      setLoadingStates(false);
    }
  };

  const fetchDistricts = async (stateId: string) => {
    setLoadingDistricts(true);
    try {
      const res = await fetch(`/api/locations?stateId=${stateId}`);
      if (res.ok) setDistricts(await res.json());
    } finally {
      setLoadingDistricts(false);
    }
  };

  const fetchTalukas = async (districtId: string) => {
    setLoadingTalukas(true);
    try {
      const res = await fetch(`/api/locations?districtId=${districtId}`);
      if (res.ok) setTalukas(await res.json());
    } finally {
      setLoadingTalukas(false);
    }
  };

  const fetchVillages = async (talukaId: string) => {
    setLoadingVillages(true);
    try {
      const res = await fetch(`/api/locations?talukaId=${talukaId}`);
      if (res.ok) setVillages(await res.json());
    } finally {
      setLoadingVillages(false);
    }
  };

  const openCreateModal = (type: LocationType) => {
    setModalType(type);
    setFormData({ nameEn: "", nameHi: "", nameGu: "", lat: "", lng: "" });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload: any = { ...formData, type: modalType };
      if (modalType === "district") payload.parentId = selectedState?.id;
      if (modalType === "taluka") payload.parentId = selectedDistrict?.id;
      if (modalType === "village") payload.parentId = selectedTaluka?.id;

      const res = await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        if (modalType === "state") fetchStates();
        if (modalType === "district" && selectedState) fetchDistricts(selectedState.id);
        if (modalType === "taluka" && selectedDistrict) fetchTalukas(selectedDistrict.id);
        if (modalType === "village" && selectedTaluka) fetchVillages(selectedTaluka.id);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (type: LocationType, id: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      const res = await fetch(`/api/locations?type=${type}&id=${id}`, { method: "DELETE" });
      if (res.ok) {
        if (type === "state") {
          if (selectedState?.id === id) setSelectedState(null);
          fetchStates();
        }
        if (type === "district") {
          if (selectedDistrict?.id === id) setSelectedDistrict(null);
          if (selectedState) fetchDistricts(selectedState.id);
        }
        if (type === "taluka") {
          if (selectedTaluka?.id === id) setSelectedTaluka(null);
          if (selectedDistrict) fetchTalukas(selectedDistrict.id);
        }
        if (type === "village") {
          if (selectedTaluka) fetchVillages(selectedTaluka.id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const Column = ({ 
    title, 
    type, 
    items, 
    loading, 
    selectedItem, 
    onSelect, 
    canAdd 
  }: { 
    title: string, 
    type: LocationType, 
    items: any[], 
    loading: boolean, 
    selectedItem?: any, 
    onSelect?: (item: any) => void,
    canAdd: boolean
  }) => (
    <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-w-[250px] h-[calc(100vh-200px)]">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          {title}
          <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">{items.length}</span>
        </h3>
        {canAdd && (
          <button 
            onClick={() => openCreateModal(type)}
            className="p-1.5 bg-white text-blue-600 rounded-lg shadow-sm border border-gray-200 hover:bg-blue-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
        ) : items.length === 0 ? (
          <div className="text-center p-8 text-gray-400 text-sm font-medium">No {title.toLowerCase()} found</div>
        ) : (
          <div className="space-y-1">
            {items.map(item => (
              <div 
                key={item.id}
                onClick={() => onSelect && onSelect(item)}
                className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                  selectedItem?.id === item.id 
                    ? "bg-blue-50 border-blue-200 border shadow-sm" 
                    : "hover:bg-gray-50 border border-transparent"
                }`}
              >
                <div>
                  <p className={`text-sm font-bold ${selectedItem?.id === item.id ? "text-blue-700" : "text-gray-900"}`}>
                    {item.nameEn}
                  </p>
                  {(item.nameHi || item.nameGu) && (
                    <p className="text-xs text-gray-500 mt-0.5">{item.nameHi} • {item.nameGu}</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(type, item.id); }}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-md opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  {onSelect && (
                    <ChevronRight className={`w-4 h-4 ${selectedItem?.id === item.id ? "text-blue-600" : "text-gray-300"}`} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-display">Location Manager</h2>
          <p className="text-gray-500 text-sm">Hierarchical management of States, Districts, Talukas, and Villages.</p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        <Column 
          title="States" type="state" 
          items={states} loading={loadingStates} 
          selectedItem={selectedState} onSelect={setSelectedState} canAdd={true} 
        />
        <Column 
          title="Districts" type="district" 
          items={districts} loading={loadingDistricts} 
          selectedItem={selectedDistrict} onSelect={setSelectedDistrict} canAdd={!!selectedState} 
        />
        <Column 
          title="Talukas" type="taluka" 
          items={talukas} loading={loadingTalukas} 
          selectedItem={selectedTaluka} onSelect={setSelectedTaluka} canAdd={!!selectedDistrict} 
        />
        <Column 
          title="Villages" type="village" 
          items={villages} loading={loadingVillages} 
          canAdd={!!selectedTaluka} 
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)}></div>
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900 font-display capitalize">Add New {modalType}</h3>
              <button onClick={() => !isSubmitting && setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-full"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {modalType === 'district' && <p className="text-sm text-blue-600 bg-blue-50 p-3 rounded-xl font-medium">Adding to State: {selectedState?.nameEn}</p>}
              {modalType === 'taluka' && <p className="text-sm text-blue-600 bg-blue-50 p-3 rounded-xl font-medium">Adding to District: {selectedDistrict?.nameEn}</p>}
              {modalType === 'village' && <p className="text-sm text-blue-600 bg-blue-50 p-3 rounded-xl font-medium">Adding to Taluka: {selectedTaluka?.nameEn}</p>}

              <div>
                <label className="text-sm font-bold text-gray-700">Name (English) *</label>
                <input required type="text" value={formData.nameEn} onChange={e => setFormData({...formData, nameEn: e.target.value})} className="mt-1 w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700">Name (Hindi)</label>
                <input type="text" value={formData.nameHi} onChange={e => setFormData({...formData, nameHi: e.target.value})} className="mt-1 w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700">Name (Gujarati)</label>
                <input type="text" value={formData.nameGu} onChange={e => setFormData({...formData, nameGu: e.target.value})} className="mt-1 w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-bold text-gray-700">Latitude</label>
                  <input type="text" value={formData.lat} onChange={e => setFormData({...formData, lat: e.target.value})} className="mt-1 w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-bold text-gray-700">Longitude</label>
                  <input type="text" value={formData.lng} onChange={e => setFormData({...formData, lng: e.target.value})} className="mt-1 w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-sm flex items-center gap-2 disabled:opacity-50">
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save {modalType}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
