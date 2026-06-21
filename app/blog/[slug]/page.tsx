import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/mdx";
import Header from "@/components/Header";
import ArticleDetailClient from "@/components/Article/ArticleDetailClient";


interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const getSafeDate = (dateVal: any) => {
  if (!dateVal) return new Date().toISOString();
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return new Date().toISOString();
  return d.toISOString();
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  let post: any = getPostBySlug(slug);
  
  if (post) {
    post.categories = (post.categories || []).map((c: any) => typeof c === 'string' ? { slug: c, nameEn: c.charAt(0).toUpperCase() + c.slice(1) } : c);
  }

  if (!post) {
    return { title: 'Post Not Found - AESTHETE' };
  }

  const title = `${post.titleEn} | AESTHETE`;
  const description = post.excerptEn || 'Read this amazing article on AESTHETE.';
  const images = post.coverImage ? [post.coverImage] : [];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: getSafeDate(post.createdAt),
      modifiedTime: getSafeDate(post.updatedAt),
      authors: [post.author?.name || 'AESTHETE Team'],
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  let post: any = getPostBySlug(slug);

  if (post) {
    // Ensure categories are objects for the client
    post.categories = (post.categories || []).map((c: any) => typeof c === 'string' ? { slug: c, nameEn: c.charAt(0).toUpperCase() + c.slice(1) } : c);
    post.tags = (post.tags || []).map((t: any) => typeof t === 'string' ? { slug: t, name: t } : t);
  }

  if (!post) {
    notFound();
  }

  // Find nearby attractions dynamically based on district
  if (post.district) {
    let allPosts = getAllPosts();
    let nearby = allPosts.filter(p => p?.district?.id === post?.district?.id && p?.id !== post?.id);
    nearby = nearby.slice(0, 2);
    
    post.nearbyAttractions = nearby.map(p => ({
      category: p?.categories?.[0]?.nameEn || "Attractions",
      name: p?.titleEn,
      coverImage: p?.coverImage,
      state: p?.state?.nameEn,
      district: p?.district?.nameEn,
      taluka: p?.taluka?.nameEn,
      village: p?.village?.nameEn,
      distance: `${(Math.random() * 15 + 1).toFixed(1)} km away`,
      slug: p?.slug
    }));
  }

  // Same regex logic as before
  if (post && post.content) {
    const gmapsRegex = /<div id="hidden-gmaps-url" data-url="([^"]+)"[^>]*><\/div>/;
    const gmapsMatch = gmapsRegex.exec(post.content);
    if (gmapsMatch) {
      post.googleMapsUrl = gmapsMatch[1];
      post.content = post.content.replace(gmapsRegex, "");
    }

    const bannerRegex = /<div id="hidden-banner-data" data-url="([^"]+)"[^>]*><\/div>/;
    const bannerMatch = bannerRegex.exec(post.content);
    if (bannerMatch) {
      post.bannerImage = bannerMatch[1];
      post.content = post.content.replace(bannerRegex, "");
    }

    const galleryRegex = /<div class="my-10">\s*<h3 class="text-2xl font-black font-display mb-6">Photo Gallery<\/h3>\s*<div class="grid grid-cols-2 md:grid-cols-3 gap-4">\s*([\s\S]*?)<\/div>\s*<\/div>/;
    const galleryMatch = galleryRegex.exec(post.content);
    if (galleryMatch) {
      const imagesHtml = galleryMatch[1];
      const srcRegex = /<img[^>]+src="([^">]+)"/g;
      const galleryImages = [];
      let srcMatch;
      while ((srcMatch = srcRegex.exec(imagesHtml)) !== null) {
        galleryImages.push(srcMatch[1]);
      }
      post.galleryImagesStr = JSON.stringify(galleryImages);
      post.content = post.content.replace(galleryRegex, "");
    }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.titleEn,
    "description": post.excerptEn,
    "image": [post.coverImage],
    "datePublished": getSafeDate(post.createdAt),
    "dateModified": getSafeDate(post.updatedAt),
    "author": { "@type": "Person", "name": post.author?.name || "Aesthete" },
    "publisher": { "@type": "Organization", "name": "Aesthete" },
  };

  return (
    <main className="min-h-screen flex flex-col justify-between bg-editorial-bg pt-[72px] transition-colors duration-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <ArticleDetailClient initialPost={post} />
      <footer className="w-full border-t border-editorial-border py-8 mt-12 bg-editorial-bg relative z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs tracking-wider text-editorial-muted font-sans">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
            <span>Established 2026 — All Rights Reserved</span>
          </div>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-editorial-text transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-editorial-text transition-colors">Terms</a>
            <a href="https://instagram.com/aesthete" target="_blank" rel="noopener noreferrer" className="hover:text-editorial-text transition-colors">Instagram</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
