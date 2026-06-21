import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { randomUUID } from "crypto";
import { getPostBySlug } from "@/lib/mdx";
import fs from "fs";
import path from "path";

const BLOGS_DIR = path.join(process.cwd(), "content", "blogs");

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: postId } = await params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized. Please login to comment." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { content } = body;

    if (!content || content.trim() === "") {
      return NextResponse.json({ error: "Comment text cannot be empty." }, { status: 400 });
    }

    const existingPost = getPostBySlug(postId);
    if (!existingPost) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    const id = randomUUID();
    const newComment = {
      id,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      user: {
        id: (session.user as any).id,
        name: session.user.name || "Anonymous",
        image: session.user.image || null
      }
    };

    const { content: contentToKeep, ...restOfPost } = existingPost;

    const frontmatterObj = {
      ...restOfPost,
      comments: [...(restOfPost.comments || []), newComment],
      updatedAt: new Date().toISOString()
    };

    const fileContent = `---
${JSON.stringify(frontmatterObj, null, 2)}
---

${contentToKeep}
`;

    const filePath = path.join(BLOGS_DIR, `${postId}.mdx`);
    fs.writeFileSync(filePath, fileContent, "utf8");

    return NextResponse.json(newComment, { status: 201 });
  } catch (error: any) {
    console.error("POST comment error:", error);
    return NextResponse.json({ error: error.message || "Failed to submit comment" }, { status: 500 });
  }
}
