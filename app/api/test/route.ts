import { NextResponse, NextRequest } from "next/server";
import { GET as getPosts } from "@/app/api/posts/route";

export async function GET(req: NextRequest) {
  try {
    const fakeReq = new NextRequest("http://localhost:3000/api/posts?all=true");
    const res = await getPosts(fakeReq);
    const data = await res.json();
    return NextResponse.json({ success: true, count: data.length, isArray: Array.isArray(data), type: typeof data });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to run getPosts", msg: error.message, stack: error.stack });
  }
}
