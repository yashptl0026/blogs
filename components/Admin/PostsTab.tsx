import React, { useEffect, useState } from "react";
import { Search, Plus, Trash2, Edit, Loader2, AlertTriangle, X, Eye, EyeOff, Star } from "lucide-react";
import Link from "next/link";

export default function PostsTab() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  
  // Filtering & Pagination State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOption, setSortOption] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Custom Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  // Compute filtered & sorted posts
  const filteredPosts = posts.filter(post => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      post.titleEn?.toLowerCase().includes(searchLower) ||
      post.author?.name?.toLowerCase().includes(searchLower) ||
      post.state?.nameEn?.toLowerCase().includes(searchLower) ||
      post.district?.nameEn?.toLowerCase().includes(searchLower) ||
      post.taluka?.nameEn?.toLowerCase().includes(searchLower) ||
      post.village?.nameEn?.toLowerCase().includes(searchLower);
    
    if (!matchesSearch) return false;
    if (filterStatus === "Live") return post.published === true;
    if (filterStatus === "Draft") return post.published === false;
    return true;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    
    if (sortOption === "Newest") return timeB - timeA;
    if (sortOption === "Oldest") return timeA - timeB;
    if (sortOption === "Most popular") {
      // Fake popularity based on title length as a placeholder
      return (b.titleEn?.length || 0) - (a.titleEn?.length || 0);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedPosts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPosts = sortedPosts.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedPosts(currentPosts.map((p) => p.id)); // Only select current page
    } else {
      setSelectedPosts([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedPosts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedPosts.length === 0) return;
    setPostToDelete("BULK");
    setDeleteModalOpen(true);
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts?all=true");
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: string) => {
    setPostToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!postToDelete) return;
    setIsDeleting(true);
    try {
      if (postToDelete === "BULK") {
        const res = await fetch(`/api/posts?ids=${selectedPosts.join(",")}`, { method: "DELETE" });
        if (res.ok) {
          await fetchPosts();
          setSelectedPosts([]);
        }
      } else {
        const res = await fetch(`/api/posts?id=${postToDelete}`, { method: "DELETE" });
        if (res.ok) await fetchPosts();
      }
      setDeleteModalOpen(false);
      setPostToDelete(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (id: string, slug: string, field: "published" | "isFeatured", currentValue: boolean) => {
    // Optimistic UI update
    setPosts(prev => prev.map(p => p.id === id ? { ...p, [field]: !currentValue } : p));
    
    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !currentValue })
      });
      
      if (!res.ok) {
        // Revert on failure
        setPosts(prev => prev.map(p => p.id === id ? { ...p, [field]: currentValue } : p));
        console.error("Failed to update post status");
      }
    } catch (err) {
      // Revert on failure
      setPosts(prev => prev.map(p => p.id === id ? { ...p, [field]: currentValue } : p));
      console.error(err);
    }
  };

  const handleBulkToggleStatus = async (field: "published" | "isFeatured", targetValue: boolean) => {
    if (selectedPosts.length === 0) return;
    setIsBulkUpdating(true);
    
    // Optimistic UI update
    setPosts(prev => prev.map(p => selectedPosts.includes(p.id) ? { ...p, [field]: targetValue } : p));

    try {
      await Promise.all(selectedPosts.map(id => {
        const post = posts.find(p => p.id === id);
        if (!post) return Promise.resolve();
        return fetch(`/api/posts/${post.slug}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [field]: targetValue })
        });
      }));
      setSelectedPosts([]);
    } catch (err) {
      console.error(err);
      fetchPosts();
    } finally {
      setIsBulkUpdating(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden font-sans">
        
        {/* Header section */}
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">Blog list</h2>
            <span className="bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-md text-xs font-bold">
              {filteredPosts.length}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {selectedPosts.length > 0 && (
              <>
                <button
                  onClick={() => handleBulkToggleStatus("published", true)}
                  disabled={isBulkUpdating}
                  className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm inline-flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isBulkUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                  Publish
                </button>
                <button
                  onClick={() => handleBulkToggleStatus("published", false)}
                  disabled={isBulkUpdating}
                  className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm inline-flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isBulkUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <EyeOff className="w-4 h-4" />}
                  Hide
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={isBulkUpdating}
                  className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm inline-flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete ({selectedPosts.length})
                </button>
              </>
            )}
            <Link 
              href="/admin/posts/create"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors inline-flex items-center gap-2 shadow-sm"
            >
              Add New
            </Link>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-6 px-6 pt-2 border-b border-gray-100 bg-white">
          {["All", "Live", "Draft"].map(tab => (
            <button
              key={tab}
              onClick={() => { setFilterStatus(tab); setCurrentPage(1); }}
              className={`py-3 text-sm font-semibold transition-colors border-b-2 ${
                filterStatus === tab 
                  ? "border-blue-600 text-blue-600" 
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Toolbar (Search & Filters) */}
        <div className="p-4 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search blogs..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-9 pr-4 py-2 w-full sm:w-80 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-500">Sort by:</span>
            <select 
              value={sortOption}
              onChange={(e) => { setSortOption(e.target.value); setCurrentPage(1); }}
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 font-semibold focus:outline-none focus:border-blue-500 shadow-sm cursor-pointer"
            >
              <option>Newest</option>
              <option>Oldest</option>
              <option>Most popular</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-900 text-white text-xs uppercase tracking-wider font-bold">
                <th className="p-4 pl-6 w-12 rounded-tl-sm">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded cursor-pointer accent-blue-500"
                    checked={currentPosts.length > 0 && selectedPosts.length === currentPosts.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="p-4 font-semibold">Blog Name</th>
                <th className="p-4 font-semibold">Author Name</th>
                <th className="p-4 tracking-wider uppercase text-[11px] text-gray-400">Published Date</th>
                <th className="p-4 tracking-wider uppercase text-[11px] text-gray-400">Categories</th>
                <th className="p-4 tracking-wider uppercase text-[11px] text-gray-400">Location</th>
                <th className="p-4 tracking-wider uppercase text-[11px] text-gray-400">Status</th>
                <th className="p-4 pr-6 font-semibold rounded-tr-sm">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
                  </td>
                </tr>
              ) : currentPosts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-gray-500 font-medium">
                    {searchQuery ? "No posts found matching your search." : "No posts found. Create your first blog post!"}
                  </td>
                </tr>
              ) : (
                currentPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="p-4 pl-6">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded cursor-pointer accent-blue-500"
                        checked={selectedPosts.includes(post.id)}
                        onChange={() => toggleSelect(post.id)}
                      />
                    </td>
                    <td className="p-4">
                      <Link href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="block text-sm font-bold text-gray-900 leading-tight max-w-xs truncate hover:text-blue-600 transition-colors">
                        {post.titleEn}
                      </Link>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-semibold text-gray-700">{post.author?.name || "Unknown"}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-600 font-medium">
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : "N/A"}
                      </p>
                    </td>
                    <td className="p-4">
                      {post.categories && post.categories.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {post.categories.map((cat: any) => (
                            <span key={cat.id} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-semibold">
                              {cat.nameEn}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-300 text-sm">None</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 text-xs text-gray-500">
                        {post.state?.nameEn && <span>{post.state.nameEn}</span>}
                        {post.district?.nameEn && <span>, {post.district.nameEn}</span>}
                        {post.taluka?.nameEn && <span>, {post.taluka.nameEn}</span>}
                        {post.village?.nameEn && <span>, {post.village.nameEn}</span>}
                        {!post.state && !post.district && !post.taluka && !post.village && <span className="text-gray-300 text-sm">None</span>}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        post.published ? 'bg-emerald-100/70 text-emerald-700' : 'bg-orange-100/70 text-orange-700'
                      }`}>
                        {post.published ? 'Live' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex items-center gap-2">
                        {/* Publish / Hide Toggle */}
                        <button 
                          onClick={() => handleToggleStatus(post.id, post.slug, "published", post.published)}
                          className={`p-1.5 rounded border transition-colors shadow-sm ${
                            post.published 
                              ? "text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100" 
                              : "text-gray-400 bg-gray-50 border-gray-200 hover:text-emerald-600 hover:bg-emerald-50"
                          }`}
                          title={post.published ? "Unpublish Post" : "Publish Post"}
                        >
                          {post.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>

                        {/* Feature Toggle */}
                        <button 
                          onClick={() => handleToggleStatus(post.id, post.slug, "isFeatured", post.isFeatured)}
                          className={`p-1.5 rounded border transition-colors shadow-sm ${
                            post.isFeatured 
                              ? "text-yellow-600 bg-yellow-50 border-yellow-200 hover:bg-yellow-100" 
                              : "text-gray-400 bg-gray-50 border-gray-200 hover:text-yellow-600 hover:bg-yellow-50"
                          }`}
                          title={post.isFeatured ? "Unfeature Post" : "Feature Post"}
                        >
                          <Star className={`w-4 h-4 ${post.isFeatured ? "fill-yellow-500 text-yellow-500" : ""}`} />
                        </button>

                        {/* Edit */}
                        <Link 
                          href={`/admin/posts/${post.slug}/edit`}
                          className="p-1.5 text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded transition-colors shadow-sm"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        {/* Delete */}
                        <button 
                          onClick={() => confirmDelete(post.id)}
                          className="p-1.5 text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 rounded transition-colors shadow-sm"
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

        {/* Pagination Footer */}
        {!loading && posts.length > 0 && (
          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <p>
                Showing {sortedPosts.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedPosts.length)} of {sortedPosts.length} entries
              </p>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline">Rows per page:</span>
                <select 
                  value={itemsPerPage}
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="bg-white border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
                >
                  Prev
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 5) {
                    if (currentPage > 3) {
                      pageNum = currentPage - 2 + i;
                      if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                    }
                  }
                  return (
                    <button 
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                        currentPage === pageNum 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'border border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Custom Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Delete {postToDelete === "BULK" ? `${selectedPosts.length} Posts` : "Post"}
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  Are you absolutely sure you want to delete {postToDelete === "BULK" ? `these ${selectedPosts.length} posts` : "this post"}? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center gap-3">
              <button 
                onClick={() => setDeleteModalOpen(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : (postToDelete === "BULK" ? "Delete All Selected" : "Delete Post")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
