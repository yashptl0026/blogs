import React, { useEffect, useState } from "react";
import { Users, FileText, Heart, BarChart3, Loader2 } from "lucide-react";

export default function DashboardTab() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    posts: 0,
    categories: 0,
    locations: 0,
    users: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [resPosts, resCats, resLocs, resUsers] = await Promise.all([
          fetch("/api/posts"),
          fetch("/api/categories"),
          fetch("/api/locations?all=true"),
          fetch("/api/users")
        ]);

        const posts = await resPosts.json();
        const cats = await resCats.json();
        const locs = await resLocs.json();
        const users = await resUsers.json();

        let totalLocs = locs.length; // Just a rough count of states for now

        setStats({
          posts: Array.isArray(posts) ? posts.length : 0,
          categories: Array.isArray(cats) ? cats.length : 0,
          locations: totalLocs,
          users: Array.isArray(users) ? users.length : 0,
        });
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 4 Stat Cards matching reference image */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Users */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-gray-900">{stats.users}</h3>
            <p className="text-sm font-semibold text-gray-500">Total Users</p>
          </div>
        </div>

        {/* Card 2: Posts */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-gray-900">{stats.posts}</h3>
            <p className="text-sm font-semibold text-gray-500">Published Posts</p>
          </div>
        </div>

        {/* Card 3: Categories/Likes Placeholder */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
            <Heart className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-gray-900">{stats.categories}</h3>
            <p className="text-sm font-semibold text-gray-500">Categories</p>
          </div>
        </div>

        {/* Card 4: Locations/Visitors Placeholder */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
            <BarChart3 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-gray-900">{stats.locations}</h3>
            <p className="text-sm font-semibold text-gray-500">States Covered</p>
          </div>
        </div>
      </div>

      {/* Traffic Stats Placeholder - To match reference design visual balance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
           <h3 className="text-lg font-bold text-gray-900 mb-6">Traffic stats</h3>
           <div className="h-64 w-full bg-gradient-to-t from-blue-50 to-transparent border-b-2 border-blue-500 rounded-lg flex items-end">
              <div className="w-full flex justify-between px-4 pb-2 text-xs text-gray-400 font-medium">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
              </div>
           </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Latest Posts</h3>
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-xl bg-gray-100 shrink-0"></div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 leading-tight mb-1">A sample post title about travel {i}</h4>
                  <p className="text-xs text-gray-500">Just now</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
