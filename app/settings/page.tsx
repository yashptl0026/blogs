import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import ModernFooter from "@/components/Footer/ModernFooter";

export default function SettingsPage() {
  return (
    <main className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center p-4 py-20">
        <div className="text-center space-y-6 max-w-md">
          <h1 className="text-4xl md:text-5xl font-black font-display text-gray-900 tracking-tight">Settings</h1>
          <p className="text-gray-500 text-lg">
            Account settings and preferences are currently being built.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back to Home
          </Link>
        </div>
      </div>
      <ModernFooter />
    </main>
  );
}
