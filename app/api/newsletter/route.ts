import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), 'content', 'data');
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(SUBSCRIBERS_FILE)) fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify([]));

    const subscribers = JSON.parse(fs.readFileSync(SUBSCRIBERS_FILE, "utf-8"));
    const existingSubscriber = subscribers.find((s: any) => s.email === email);

    if (existingSubscriber) {
      if (!existingSubscriber.isActive) {
        existingSubscriber.isActive = true;
        fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
        return NextResponse.json({ success: true, message: "Welcome back! You have been re-subscribed." }, { status: 200 });
      }
      return NextResponse.json({ error: "This email is already subscribed." }, { status: 400 });
    }

    const id = randomUUID();
    subscribers.push({ id, email, isActive: true, createdAt: new Date().toISOString() });
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));

    return NextResponse.json({ success: true, message: "Successfully subscribed!" }, { status: 201 });
  } catch (error: any) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json({ error: "Failed to subscribe to newsletter." }, { status: 500 });
  }
}
