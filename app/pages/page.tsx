import Header from "@/components/Header";
import ModernFooter from "@/components/Footer/ModernFooter";

export default function GenericPage() {
  return (
    <main className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Header />
      
      <section className="flex-1 flex flex-col items-center justify-center py-32 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-black font-display text-gray-900 mb-6 tracking-tight">
          Coming Soon
        </h1>
        <p className="text-gray-500 max-w-2xl text-lg md:text-xl leading-relaxed mb-10">
          We are currently building this page. The content will be updated soon once the backend and the CMS are fully integrated. Stay tuned for an amazing experience.
        </p>
        <a href="/" className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl">
          Return to Home
        </a>
      </section>

      <ModernFooter />
    </main>
  );
}
