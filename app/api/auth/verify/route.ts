import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const adminKey = req.headers.get("x-admin-key");
  const expectedKey = process.env.ADMIN_PASSWORD || "admin";

  if (adminKey === expectedKey) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json(
    { authenticated: false, error: "Invalid admin key" },
    { status: 401 }
  );
}
