import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDistance } from "@/lib/geo";
import { randomUUID } from "crypto";
import { getAllPosts, getAllCategories } from "@/lib/mdx";
import fs from "fs";
import path from "path";

const BLOGS_DIR = path.join(process.cwd(), "content", "blogs");

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const stateId = searchParams.get("stateId");
  const districtId = searchParams.get("districtId");
  const talukaId = searchParams.get("talukaId");
  const villageId = searchParams.get("villageId");
  const search = searchParams.get("search");
  const excludeId = searchParams.get("excludeId");
  
  const latStr = searchParams.get("lat");
  const lngStr = searchParams.get("lng");
  const radiusStr = searchParams.get("radius");

  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user && (session.user as any).role === "ADMIN";
    const requestAll = searchParams.get("all") === "true";
    const featured = searchParams.get("featured") === "true";

    let mdxPosts = getAllPosts() || [];
    
    if (!(isAdmin && requestAll)) {
      mdxPosts = mdxPosts.filter((p: any) => p.published !== false && p.published !== 0);
    }
    
    if (villageId) mdxPosts = mdxPosts.filter((p: any) => p.villageId === villageId || p.village?.id === villageId);
    else if (talukaId) mdxPosts = mdxPosts.filter((p: any) => p.talukaId === talukaId || p.taluka?.id === talukaId);
    else if (districtId) mdxPosts = mdxPosts.filter((p: any) => p.districtId === districtId || p.district?.id === districtId);
    else if (stateId) mdxPosts = mdxPosts.filter((p: any) => p.stateId === stateId || p.state?.id === stateId);

    if (category) {
      mdxPosts = mdxPosts.filter((p: any) => 
        p.categories && p.categories.some((c: any) => c.slug === category || c === category)
      );
    }
    
    if (search) {
      const s = search.toLowerCase();
      mdxPosts = mdxPosts.filter((p: any) => 
        (p.titleEn && p.titleEn.toLowerCase().includes(s)) ||
        (p.excerptEn && p.excerptEn.toLowerCase().includes(s)) ||
        (p.content && p.content.toLowerCase().includes(s))
      );
    }
    
    if (excludeId) {
      mdxPosts = mdxPosts.filter((p: any) => p.id !== excludeId);
    }
    
    if (featured) {
      mdxPosts = mdxPosts.filter((p: any) => p.isFeatured === true);
    }

    // Format categories/tags as objects for the frontend
    mdxPosts = mdxPosts.map((p: any) => ({
      ...p,
      categories: (p.categories || []).map((c: any) => typeof c === 'string' ? { slug: c, nameEn: c.charAt(0).toUpperCase() + c.slice(1) } : c),
      tags: (p.tags || []).map((t: any) => typeof t === 'string' ? { slug: t, name: t } : t),
    }));

    let posts = mdxPosts;
    posts.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (latStr && lngStr && radiusStr) {
      const lat = parseFloat(latStr);
      const lng = parseFloat(lngStr);
      const radius = parseFloat(radiusStr);

      if (!isNaN(lat) && !isNaN(lng) && !isNaN(radius)) {
        posts = posts.filter((post: any) => {
          let targetLat = post.lat;
          let targetLng = post.lng;

          if (targetLat === null || targetLng === null) {
            targetLat = post.village?.lat ?? post.taluka?.lat ?? post.district?.lat ?? post.state?.lat ?? null;
            targetLng = post.village?.lng ?? post.taluka?.lng ?? post.district?.lng ?? post.state?.lng ?? null;
          }

          if (targetLat === null || targetLng === null) return false;

          const distance = getDistance(lat, lng, targetLat, targetLng);
          post.distance = parseFloat(distance.toFixed(1));
          return distance <= radius;
        });
        posts.sort((a: any, b: any) => a.distance - b.distance);
      }
    }

    return NextResponse.json(posts);
  } catch (error: any) {
    console.error("GET posts error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      titleEn, titleHi, titleGu, excerptEn, excerptHi, excerptGu, contentEn, contentHi, contentGu,
      coverImage, bannerImage, categoryIds, stateId, districtId, talukaId, villageId, lat, lng,
    } = body;

    if (!titleEn || !excerptEn || !contentEn || !coverImage) {
      return NextResponse.json({ error: "Missing required post parameters" }, { status: 400 });
    }

    let slug = titleEn.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    if (!slug) slug = randomUUID().split('-')[0];
    
    // Ensure slug is unique
    let finalSlug = slug;
    let counter = 1;
    while (fs.existsSync(path.join(BLOGS_DIR, `${finalSlug}.mdx`))) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    const wordCount = contentEn.split(/\s+/).length;
    const readingTime = `${Math.ceil(wordCount / 200)} min read`;
    const id = randomUUID();

    // Map categoryIds to slugs
    const allCats = getAllCategories();
    const mappedCategories = (categoryIds || []).map((cId: string) => {
      const found = allCats.find((c: any) => c.id === cId);
      return found ? found.slug : cId; // fallback to cId if not found
    });

    const frontmatterObj = {
      id,
      titleEn,
      titleHi: titleHi || null,
      titleGu: titleGu || null,
      slug: finalSlug,
      excerptEn,
      excerptHi: excerptHi || null,
      excerptGu: excerptGu || null,
      coverImage,
      bannerImage: bannerImage || null,
      readingTime,
      lat: lat ? parseFloat(lat) : null,
      lng: lng ? parseFloat(lng) : null,
      published: body.published === false ? false : true,
      isFeatured: body.isFeatured === true ? true : false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: (session.user as any).id || "admin",
      categories: mappedCategories,
      tags: [],
      stateId: stateId || null,
      districtId: districtId || null,
      talukaId: talukaId || null,
      villageId: villageId || null
    };

    const fileContent = `---
${JSON.stringify(frontmatterObj, null, 2)}
---

${contentEn || ""}
`;

    if (!fs.existsSync(BLOGS_DIR)) {
      fs.mkdirSync(BLOGS_DIR, { recursive: true });
    }

    const filePath = path.join(BLOGS_DIR, `${finalSlug}.mdx`);
    fs.writeFileSync(filePath, fileContent, "utf8");

    // Return something that matches what the frontend expects
    return NextResponse.json({ ...frontmatterObj, contentEn }, { status: 201 });
  } catch (error: any) {
    console.error("POST post error:", error);
    require('fs').appendFileSync('error_log.txt', error.stack + '\n');
    return NextResponse.json({ error: error.message || "Failed to create post" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const idsParam = searchParams.get("ids");

  if (!id && !idsParam) {
    return NextResponse.json({ error: "Missing post ID(s)" }, { status: 400 });
  }

  try {
    const allPosts = getAllPosts();
    let idsToDelete = idsParam ? idsParam.split(",") : [id];

    for (const dId of idsToDelete) {
      const post = allPosts.find((p: any) => p.id === dId);
      if (post && post.slug) {
        const filePath = path.join(BLOGS_DIR, `${post.slug}.mdx`);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE post error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete post" }, { status: 500 });
  }
}
