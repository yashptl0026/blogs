import Header from "@/components/Header";
import ModernFooter from "@/components/Footer/ModernFooter";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col bg-editorial-bg font-sans text-editorial-text">
      <Header />
      
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-center bg-gray-50 dark:bg-neutral-900 overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-display tracking-tight mb-6 text-editorial-text">
            We inspire you to <span className="text-blue-600">explore</span> the unknown.
          </h1>
          <p className="text-lg md:text-xl text-editorial-muted leading-relaxed max-w-2xl mx-auto">
            AESTHETE is India's premium travel and editorial directory, designed to connect passionate explorers with hidden gems and unforgettable cultural experiences.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      </section>

      {/* Story */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center flex-1">
        <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=1000&auto=format&fit=crop" 
            alt="About Aesthete"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-black font-display text-editorial-text">Our Story</h2>
          <p className="text-editorial-muted leading-relaxed text-lg">
            Founded in 2026, AESTHETE began as a passion project to document the diverse, vibrant landscapes of India. We realized that while mainstream tourist destinations are well-known, the true magic lies in the micro-locations—the quaint villages, historic talukas, and pristine untouched natural reserves.
          </p>
          <p className="text-editorial-muted leading-relaxed text-lg">
            Our mission is to build the most comprehensive, beautifully designed travel directory in the world, empowering local communities and giving travelers an authentic taste of local culture.
          </p>
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-editorial-border">
            <div>
              <div className="text-3xl font-black text-blue-600 font-display">10K+</div>
              <div className="text-sm font-bold text-editorial-muted mt-1">Destinations</div>
            </div>
            <div>
              <div className="text-3xl font-black text-blue-600 font-display">5M+</div>
              <div className="text-sm font-bold text-editorial-muted mt-1">Monthly Readers</div>
            </div>
            <div>
              <div className="text-3xl font-black text-blue-600 font-display">50+</div>
              <div className="text-sm font-bold text-editorial-muted mt-1">Local Experts</div>
            </div>
          </div>
        </div>
      </section>

      <ModernFooter />
    </main>
  );
}
