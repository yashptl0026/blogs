import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  // Check auth
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    // Ensure the uploads directory exists
    const uploadsDir = join(process.cwd(), "public", "uploads");
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (e) {
      // Ignore if exists
    }

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Clean filename and make unique
      const originalName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${originalName}`;
      const filePath = join(uploadsDir, uniqueName);

      await writeFile(filePath, buffer);

      // Add to array of urls
      uploadedUrls.push(`/uploads/${uniqueName}`);
    }

    return NextResponse.json({ success: true, urls: uploadedUrls }, { status: 201 });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed: " + error.message }, { status: 500 });
  }
}
