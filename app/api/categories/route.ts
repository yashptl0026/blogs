import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";

const CATEGORIES_FILE = path.join(process.cwd(), "content", "data", "categories.json");

function getCategories() {
  if (!fs.existsSync(CATEGORIES_FILE)) {
    return [];
  }
  const content = fs.readFileSync(CATEGORIES_FILE, "utf8");
  return JSON.parse(content);
}

function saveCategories(data: any) {
  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(data, null, 2));
}

export async function GET() {
  try {
    const categories = getCategories();
    // Ensure isTravel is boolean
    const formatted = categories.map((row: any) => {
      if (typeof row.isTravel === 'number') row.isTravel = row.isTravel === 1;
      return row;
    });
    // Sort by nameEn ASC
    formatted.sort((a: any, b: any) => (a.nameEn || "").localeCompare(b.nameEn || ""));
    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET categories error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { nameEn, nameHi, nameGu, isTravel } = body;

    if (!nameEn) {
      return NextResponse.json({ error: "English Name is required" }, { status: 400 });
    }

    const slug = nameEn.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const id = randomUUID();

    const newCategory = {
      id,
      nameEn,
      nameHi: nameHi || null,
      nameGu: nameGu || null,
      slug,
      isTravel: isTravel ? true : false,
    };

    const categories = getCategories();
    categories.push(newCategory);
    saveCategories(categories);

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: any) {
    console.error("POST category error:", error);
    return NextResponse.json({ error: error.message || "Failed to create category" }, { status: 500 });
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
    return NextResponse.json({ error: "Category ID(s) required" }, { status: 400 });
  }

  try {
    let categories = getCategories();

    if (idsParam) {
      const ids = idsParam.split(",");
      categories = categories.filter((c: any) => !ids.includes(c.id));
    } else if (id) {
      categories = categories.filter((c: any) => c.id !== id);
    }
    
    saveCategories(categories);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE category error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete category" }, { status: 500 });
  }
}
