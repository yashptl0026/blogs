import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPostBySlug, getAllCategories } from "@/lib/mdx";
import fs from "fs";
import path from "path";

const BLOGS_DIR = path.join(process.cwd(), "content", "blogs");

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const mdxPost = getPostBySlug(id);
    if (mdxPost) {
      return NextResponse.json({
         ...mdxPost,
         categories: (mdxPost.categories || []).map((c: any) => typeof c === 'string' ? { slug: c, nameEn: c.charAt(0).toUpperCase() + c.slice(1) } : c)
      });
    }

    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  } catch (error) {
    console.error("GET post error:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const {
      titleEn, slug, excerptEn, contentEn, coverImage, bannerImage, readingTime,
      published, categoryIds, stateId, districtId, talukaId, villageId,
    } = body;

    const existingPost = getPostBySlug(id);
    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const allCats = getAllCategories();
    const mappedCategories = (categoryIds || []).map((cId: string) => {
      const found = allCats.find((c: any) => c.id === cId);
      return found ? found.slug : cId;
    });

    const newSlug = slug && slug.trim() ? slug.trim() : id;
    
    const { content: contentToKeep, ...restOfPost } = existingPost;
    
    // Frontmatter preservation and update
    const frontmatterObj = {
      ...restOfPost,
      titleEn: titleEn || restOfPost.titleEn,
      slug: newSlug,
      excerptEn: excerptEn || restOfPost.excerptEn,
      coverImage: coverImage || restOfPost.coverImage,
      bannerImage: bannerImage !== undefined ? bannerImage : restOfPost.bannerImage,
      readingTime: readingTime || restOfPost.readingTime,
      published: published !== undefined ? (published ? true : false) : restOfPost.published,
      categories: mappedCategories.length > 0 ? mappedCategories : restOfPost.categories,
      stateId: stateId !== undefined ? stateId : restOfPost.stateId,
      districtId: districtId !== undefined ? districtId : restOfPost.districtId,
      talukaId: talukaId !== undefined ? talukaId : restOfPost.talukaId,
      villageId: villageId !== undefined ? villageId : restOfPost.villageId,
      updatedAt: new Date().toISOString()
    };

    const fileContent = `---
${JSON.stringify(frontmatterObj, null, 2)}
---

${contentEn !== undefined ? contentEn : existingPost.content}
`;

    if (newSlug !== id) {
      // Delete old file if slug changed
      const oldPath = path.join(BLOGS_DIR, `${id}.mdx`);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const newPath = path.join(BLOGS_DIR, `${newSlug}.mdx`);
    fs.writeFileSync(newPath, fileContent, "utf8");

    return NextResponse.json({ ...frontmatterObj, contentEn: contentEn || existingPost.content });
  } catch (error: any) {
    console.error("PUT post error:", error);
    return NextResponse.json({ error: error.message || "Failed to update post" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    
    const existingPost = getPostBySlug(id);
    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const { content: contentToKeep, ...restOfPost } = existingPost;

    const frontmatterObj = {
      ...restOfPost,
      published: body.published !== undefined ? !!body.published : restOfPost.published,
      isFeatured: body.isFeatured !== undefined ? !!body.isFeatured : restOfPost.isFeatured,
      isTrending: body.isTrending !== undefined ? !!body.isTrending : restOfPost.isTrending,
      isEditorPick: body.isEditorPick !== undefined ? !!body.isEditorPick : restOfPost.isEditorPick,
      updatedAt: new Date().toISOString()
    };

    const fileContent = `---
${JSON.stringify(frontmatterObj, null, 2)}
---

${contentToKeep}
`;

    const filePath = path.join(BLOGS_DIR, `${id}.mdx`);
    fs.writeFileSync(filePath, fileContent, "utf8");

    return NextResponse.json(frontmatterObj);
  } catch (error: any) {
    console.error("PATCH post error:", error);
    return NextResponse.json({ error: error.message || "Failed to partial update post" }, { status: 500 });
  }
}
