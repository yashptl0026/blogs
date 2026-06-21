"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Search, Bell, User, LayoutDashboard, FileText, 
  FolderOpen, MapPin, Users, Loader2 
} from "lucide-react";

import DashboardTab from "@/components/Admin/DashboardTab";
import PostsTab from "@/components/Admin/PostsTab";
import CategoriesTab from "@/components/Admin/CategoriesTab";
import LocationsTab from "@/components/Admin/LocationsTab";
import UsersTab from "@/components/Admin/UsersTab";

type TabType = "dashboard" | "posts" | "categories" | "locations" | "users";

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  // Authentication check redirection
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin-access?callbackUrl=/admin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Not logged in or not ADMIN
  if (!session || (session.user as any).role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-black text-gray-900">Access Denied</h1>
          <p className="text-gray-500 text-sm">You must be an admin to view this page.</p>
          <Link href="/" className="text-blue-600 hover:underline text-sm font-bold">Return Home</Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "posts", label: "Posts", icon: FileText },
    { id: "categories", label: "Categories", icon: FolderOpen },
    { id: "locations", label: "Locations", icon: MapPin },
    { id: "users", label: "Users", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 font-sans">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Left Tabs */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">Aesthete</span>
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      activeTab === tab.id 
                        ? "bg-blue-50 text-blue-700" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 w-64 transition-all"
                />
              </div>
              
              <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>

              <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                  <User className="w-4 h-4" />
                </div>
                <button 
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-xs font-bold text-gray-500 hover:text-gray-900"
                >
                  Logout
                </button>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-[1600px] mx-auto">
          {activeTab === "dashboard" && <DashboardTab />}
          {activeTab === "posts" && <PostsTab />}
          {activeTab === "categories" && <CategoriesTab />}
          {activeTab === "locations" && <LocationsTab />}
          {activeTab === "users" && <UsersTab />}
        </div>
      </main>
    </div>
  );
}
