"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";

const destinations = [
  { name: "Agra, UP", count: "142 articles", img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=500&auto=format&fit=crop" },
  { name: "Jaipur, Rajasthan", count: "98 articles", img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=500&auto=format&fit=crop" },
  { name: "Munnar, Kerala", count: "65 articles", img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=500&auto=format&fit=crop" },
  { name: "Goa Beaches, Goa", count: "210 articles", img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=500&auto=format&fit=crop" },
  { name: "Amritsar, Punjab", count: "45 articles", img: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=500&auto=format&fit=crop" },
  { name: "Hampi, Karnataka", count: "54 articles", img: "https://images.unsplash.com/photo-1600100397608-f010f419c913?q=80&w=500&auto=format&fit=crop" },
  { name: "Darjeeling, WB", count: "38 articles", img: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=500&auto=format&fit=crop" },
  { name: "Manali, HP", count: "87 articles", img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=500&auto=format&fit=crop" },
  { name: "Srinagar, J&K", count: "42 articles", img: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=500&auto=format&fit=crop" },
];

export default function DestinationsSection() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left w-full">
      <div className="bg-editorial-card rounded-3xl p-6 md:p-8 border border-editorial-border shadow-sm transition-colors duration-300">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-8 border-b border-editorial-border pb-6">
          <h2 className="text-2xl md:text-3xl font-black font-display text-editorial-text">
            Popular Destinations
          </h2>
          <Link href="/pages" className="px-6 py-2.5 bg-editorial-text text-editorial-bg rounded-full text-sm font-bold transition-colors inline-flex items-center gap-2">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest, i) => (
            <Link href={`/explore?q=${encodeURIComponent(dest.name)}`} key={i} className="flex items-center gap-4 bg-editorial-bg p-3 rounded-2xl border border-editorial-border hover:border-editorial-muted hover:bg-editorial-card transition-all group">
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                <img loading="lazy" decoding="async" src={dest.img} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-editorial-text text-[15px] truncate">{dest.name}</h4>
                <p className="text-sm text-editorial-muted mt-0.5 truncate">{dest.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
