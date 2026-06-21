"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Trash2, Edit, Loader2, X, AlertTriangle } from "lucide-react";

export default function CategoriesTab() {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nameEn: "",
    nameHi: "",
    nameGu: "",
    isTravel: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map(c => c.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(prev => prev.filter(cId => cId !== id));
    } else {
      setSelectedCategories(prev => [...prev, id]);
    }
  };

  const openDeleteModal = (id?: string) => {
    if (id) {
      setDeletingId(id);
    } else {
      setDeletingId(null);
    }
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (deletingId) {
        // Single delete
        const res = await fetch(`/api/categories?id=${deletingId}`, { method: "DELETE" });
        if (res.ok) {
          await fetchCategories();
          setSelectedCategories(prev => prev.filter(id => id !== deletingId));
        }
      } else if (selectedCategories.length > 0) {
        // Bulk delete
        const res = await fetch(`/api/categories?ids=${selectedCategories.join(",")}`, { method: "DELETE" });
        if (res.ok) {
          await fetchCategories();
          setSelectedCategories([]);
        }
      }
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingId(null);
    }
  };

  const openEditModal = (category: any) => {
    setEditingId(category.id);
    setFormData({
      nameEn: category.nameEn || "",
      nameHi: category.nameHi || "",
      nameGu: category.nameGu || "",
      isTravel: category.isTravel ?? true,
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      nameEn: "",
      nameHi: "",
      nameGu: "",
      isTravel: true,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editingId ? `/api/categories/${editingId}` : "/api/categories";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await fetchCategories();
        setIsModalOpen(false);
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to save category");
      }
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = categories.filter(c => 
    c.nameEn?.toLowerCase().includes(search.toLowerCase()) ||
    c.slug?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900 font-display">Category List</h2>
            <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-full">
              {categories.length}
            </span>
          </div>
          
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {selectedCategories.length > 0 && (
            <button 
              onClick={() => openDeleteModal()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete ({selectedCategories.length})
            </button>
          )}
          <button 
            onClick={openCreateModal}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm hover:shadow"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 w-12">
                  <input 
                    type="checkbox" 
                    checked={categories.length > 0 && selectedCategories.length === categories.length}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-4 tracking-wider uppercase text-xs">Name (EN)</th>
                <th className="px-6 py-4 tracking-wider uppercase text-xs">Name (HI)</th>
                <th className="px-6 py-4 tracking-wider uppercase text-xs">Name (GU)</th>
                <th className="px-6 py-4 tracking-wider uppercase text-xs">Slug</th>
                <th className="px-6 py-4 tracking-wider uppercase text-xs">Type</th>
                <th className="px-6 py-4 tracking-wider uppercase text-xs text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                    <p className="text-gray-500 mt-2 font-medium">Loading categories...</p>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Search className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-900 font-bold">No categories found</p>
                    <p className="text-gray-500 mt-1">Try adjusting your search or create a new category.</p>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => toggleSelect(category.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">{category.nameEn}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{category.nameHi || "-"}</td>
                    <td className="px-6 py-4 text-gray-500">{category.nameGu || "-"}</td>
                    <td className="px-6 py-4 text-gray-400 font-mono text-xs">{category.slug}</td>
                    <td className="px-6 py-4">
                      {category.isTravel ? (
                        <span className="bg-green-50 text-green-700 px-2.5 py-1 rounded-md text-xs font-bold border border-green-100">Travel</span>
                      ) : (
                        <span className="bg-gray-50 text-gray-600 px-2.5 py-1 rounded-md text-xs font-bold border border-gray-200">General</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditModal(category)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(category.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)}></div>
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-900 font-display">
                {editingId ? "Edit Category" : "New Category"}
              </h3>
              <button 
                onClick={() => !isSubmitting && setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 space-y-5 overflow-y-auto">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700">Name (English) *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.nameEn}
                    onChange={e => setFormData({...formData, nameEn: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                    placeholder="e.g. Travel, Food, Culture"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700">Name (Hindi)</label>
                  <input 
                    type="text" 
                    value={formData.nameHi}
                    onChange={e => setFormData({...formData, nameHi: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                    placeholder="e.g. यात्रा"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700">Name (Gujarati)</label>
                  <input 
                    type="text" 
                    value={formData.nameGu}
                    onChange={e => setFormData({...formData, nameGu: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                    placeholder="e.g. પ્રવાસ"
                  />
                </div>

                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={formData.isTravel}
                    onChange={e => setFormData({...formData, isTravel: e.target.checked})}
                    className="w-5 h-5 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Travel Category</p>
                    <p className="text-xs text-gray-500">Check this if the category requires location data (States/Districts).</p>
                  </div>
                </label>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl relative z-10 p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Delete {deletingId ? "Category" : `${selectedCategories.length} Categories`}
            </h3>
            <p className="text-gray-500 text-sm mb-8">
              Are you absolutely sure you want to delete {deletingId ? "this category" : `these ${selectedCategories.length} categories`}? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-colors shadow-sm"
              >
                Delete {deletingId ? "" : "All Selected"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
