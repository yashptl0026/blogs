import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "fs";
import path from "path";

const CATEGORIES_FILE = path.join(process.cwd(), "content", "data", "categories.json");

function getCategories() {
  if (!fs.existsSync(CATEGORIES_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(CATEGORIES_FILE, "utf8"));
}

function saveCategories(data: any) {
  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(data, null, 2));
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
    const { nameEn, nameHi, nameGu, isTravel } = body;

    if (!nameEn) {
      return NextResponse.json({ error: "English Name is required" }, { status: 400 });
    }

    const slug = nameEn.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const categories = getCategories();
    const index = categories.findIndex((c: any) => c.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    categories[index] = {
      ...categories[index],
      nameEn,
      nameHi: nameHi || null,
      nameGu: nameGu || null,
      slug,
      isTravel: isTravel ? true : false,
    };

    saveCategories(categories);
    return NextResponse.json(categories[index]);
  } catch (error: any) {
    console.error("PUT category error:", error);
    return NextResponse.json({ error: error.message || "Failed to update category" }, { status: 500 });
  }
}
