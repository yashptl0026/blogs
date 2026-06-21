import { notFound } from "next/navigation";
import Header from "@/components/Header";
import ModernFooter from "@/components/Footer/ModernFooter";
import DynamicEditorialGrid from "@/components/CategoryFilter/DynamicEditorialGrid";
import { getTagBySlug } from "@/lib/mdx";

export const revalidate = 60;

interface TagPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  
  const tag = getTagBySlug(slug);

  if (!tag) {
    notFound();
  }

  return (
    <main className="min-h-screen flex flex-col bg-editorial-bg font-sans">
      <Header />
      
      {/* Tag Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-blue-600 border-b border-editorial-border text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <p className="text-blue-200 font-bold tracking-widest uppercase text-xs mb-4">Topic</p>
          <h1 className="text-4xl md:text-7xl font-black font-display tracking-tight mb-6">
            #{tag.name}
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            All articles and stories tagged with {tag.name}.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      </section>

      {/* Grid Feed */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
           <DynamicEditorialGrid isHomePage={false} />
        </div>
      </section>

      <ModernFooter />
    </main>
  );
}
