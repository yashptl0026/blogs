"use client";

import { ShieldCheck, Map, Clock, CheckCircle } from "lucide-react";

import { useLanguage } from "@/components/LanguageContext";

export default function ValuePropSection() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left: Text & Features */}
        <div className="space-y-8 text-left">
          <h2 className="text-4xl md:text-5xl font-black font-display leading-tight text-editorial-text">
            {t("valuePropTitle")}
          </h2>
          <p className="text-editorial-muted text-sm leading-relaxed max-w-md">
            {t("valuePropDesc")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
            {/* Feature 1 */}
            <div className="flex gap-4">
              <div className="mt-1 bg-blue-100 p-2 rounded-lg text-blue-600">
                <Map className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-editorial-text text-sm">Global Perspectives</h4>
                <p className="text-xs text-editorial-muted mt-1">Discover stories from every corner of the world.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4">
              <div className="mt-1 bg-purple-100 p-2 rounded-lg text-purple-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-editorial-text text-sm">Expert Authors</h4>
                <p className="text-xs text-editorial-muted mt-1">Read articles written by industry experts and locals.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-4">
              <div className="mt-1 bg-green-100 p-2 rounded-lg text-green-600">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-editorial-text text-sm">Curated Content</h4>
                <p className="text-xs text-editorial-muted mt-1">Only the highest quality journalism makes the cut.</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex gap-4">
              <div className="mt-1 bg-yellow-100 p-2 rounded-lg text-yellow-600">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-editorial-text text-sm">Weekly Digests</h4>
                <p className="text-xs text-editorial-muted mt-1">Get the best reads delivered straight to your inbox.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Images and Stats */}
        <div className="relative">
          <div className="absolute inset-0 bg-blue-50 transform translate-x-4 translate-y-4 rounded-2xl -z-10"></div>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[400px]">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
              alt="People reading"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Floating Stat Card */}
          <div className="absolute -left-8 md:-left-12 top-1/2 -translate-y-1/2 bg-editorial-card p-4 md:p-6 rounded-2xl shadow-xl border border-editorial-border flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-black text-blue-600 font-display">10M+</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-editorial-muted mt-1">Readers</span>
          </div>
        </div>

      </div>
    </div>
  );
}
