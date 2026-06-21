import { notFound } from "next/navigation";
import Header from "@/components/Header";
import ModernFooter from "@/components/Footer/ModernFooter";
import DynamicEditorialGrid from "@/components/CategoryFilter/DynamicEditorialGrid";
import { Metadata } from "next";
import { getCategoryBySlug } from "@/lib/mdx";

export const revalidate = 60;

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  const category = getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category Not Found | AESTHETE" };
  }

  const title = `${category.nameEn} Articles | AESTHETE`;
  const description = `Explore the latest stories, tips, and insights related to ${category.nameEn.toLowerCase()}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    }
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen flex flex-col bg-editorial-bg font-sans">
      <Header />
      
      {/* Category Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-editorial-card border-b border-editorial-border">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black font-display text-editorial-text tracking-tight mb-6">
            {category.nameEn}
          </h1>
          <p className="text-editorial-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Explore the latest stories, tips, and insights related to {category.nameEn.toLowerCase()}.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
           <DynamicEditorialGrid isHomePage={false} />
        </div>
      </section>

      <ModernFooter />
    </main>
  );
}
