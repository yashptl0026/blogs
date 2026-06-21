import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";

const LOCATIONS_FILE = path.join(process.cwd(), "content", "data", "locations.json");

function getLocations() {
  if (!fs.existsSync(LOCATIONS_FILE)) {
    return [];
  }
  const content = fs.readFileSync(LOCATIONS_FILE, "utf8");
  return JSON.parse(content);
}

function saveLocations(data: any) {
  fs.writeFileSync(LOCATIONS_FILE, JSON.stringify(data, null, 2));
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all");
  const stateId = searchParams.get("stateId");
  const districtId = searchParams.get("districtId");
  const talukaId = searchParams.get("talukaId");

  try {
    const states = getLocations();

    if (all === "true") {
      return NextResponse.json(states);
    }

    if (talukaId) {
      for (const s of states) {
        for (const d of (s.districts || [])) {
          for (const t of (d.talukas || [])) {
            if (t.id === talukaId) {
              return NextResponse.json(t.villages || []);
            }
          }
        }
      }
      return NextResponse.json([]);
    }

    if (districtId) {
      for (const s of states) {
        for (const d of (s.districts || [])) {
          if (d.id === districtId) {
            return NextResponse.json(d.talukas || []);
          }
        }
      }
      return NextResponse.json([]);
    }

    if (stateId) {
      const state = states.find((s: any) => s.id === stateId);
      return NextResponse.json(state?.districts || []);
    }

    // Default: Return states (without deeply nesting everything to mimic old behavior, but sending deeply nested is fine too since the old one didn't strictly filter out properties)
    // Actually old one returned flat states
    const flatStates = states.map((s: any) => ({
      id: s.id,
      nameEn: s.nameEn,
      nameHi: s.nameHi,
      nameGu: s.nameGu,
      lat: s.lat,
      lng: s.lng,
    }));
    return NextResponse.json(flatStates);
  } catch (error) {
    console.error("GET locations error:", error);
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let session;
  try {
    session = await getServerSession(authOptions);
  } catch (err: any) {
    return NextResponse.json({ error: "Session error: " + err.message }, { status: 500 });
  }

  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { type, nameEn, nameHi, nameGu, lat, lng, parentId } = body;

    if (!nameEn) return NextResponse.json({ error: "English Name is required" }, { status: 400 });

    const parsedLat = lat ? parseFloat(lat) : null;
    const parsedLng = lng ? parseFloat(lng) : null;
    const id = randomUUID();

    const states = getLocations();

    const newLocation = {
      id,
      nameEn,
      nameHi: nameHi || null,
      nameGu: nameGu || null,
      lat: parsedLat,
      lng: parsedLng,
    };

    if (type === "state") {
      states.push({ ...newLocation, districts: [] });
      saveLocations(states);
      return NextResponse.json(newLocation, { status: 201 });
    }

    if (type === "district") {
      if (!parentId) return NextResponse.json({ error: "State ID required" }, { status: 400 });
      const state = states.find((s: any) => s.id === parentId);
      if (!state) return NextResponse.json({ error: "State not found" }, { status: 404 });
      
      if (!state.districts) state.districts = [];
      const newDistrict = { ...newLocation, stateId: parentId, talukas: [] };
      state.districts.push(newDistrict);
      saveLocations(states);
      return NextResponse.json(newDistrict, { status: 201 });
    }

    if (type === "taluka") {
      if (!parentId) return NextResponse.json({ error: "District ID required" }, { status: 400 });
      let districtFound = false;
      let createdTaluka = null;
      for (const s of states) {
        const d = (s.districts || []).find((dist: any) => dist.id === parentId);
        if (d) {
          districtFound = true;
          if (!d.talukas) d.talukas = [];
          createdTaluka = { ...newLocation, districtId: parentId, villages: [] };
          d.talukas.push(createdTaluka);
          break;
        }
      }
      if (!districtFound) return NextResponse.json({ error: "District not found" }, { status: 404 });
      saveLocations(states);
      return NextResponse.json(createdTaluka, { status: 201 });
    }

    if (type === "village") {
      if (!parentId) return NextResponse.json({ error: "Taluka ID required" }, { status: 400 });
      let talukaFound = false;
      let createdVillage = null;
      for (const s of states) {
        for (const d of (s.districts || [])) {
          const t = (d.talukas || []).find((tal: any) => tal.id === parentId);
          if (t) {
            talukaFound = true;
            if (!t.villages) t.villages = [];
            createdVillage = { ...newLocation, talukaId: parentId };
            t.villages.push(createdVillage);
            break;
          }
        }
        if (talukaFound) break;
      }
      if (!talukaFound) return NextResponse.json({ error: "Taluka not found" }, { status: 404 });
      saveLocations(states);
      return NextResponse.json(createdVillage, { status: 201 });
    }

    return NextResponse.json({ error: "Invalid location type" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create location" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  if (!type || !id) return NextResponse.json({ error: "Missing type or id" }, { status: 400 });

  try {
    const states = getLocations();

    if (type === "state") {
      const filtered = states.filter((s: any) => s.id !== id);
      saveLocations(filtered);
      return NextResponse.json({ success: true });
    }

    if (type === "district") {
      for (const s of states) {
        if (s.districts) {
          s.districts = s.districts.filter((d: any) => d.id !== id);
        }
      }
      saveLocations(states);
      return NextResponse.json({ success: true });
    }

    if (type === "taluka") {
      for (const s of states) {
        for (const d of (s.districts || [])) {
          if (d.talukas) {
            d.talukas = d.talukas.filter((t: any) => t.id !== id);
          }
        }
      }
      saveLocations(states);
      return NextResponse.json({ success: true });
    }

    if (type === "village") {
      for (const s of states) {
        for (const d of (s.districts || [])) {
          for (const t of (d.talukas || [])) {
            if (t.villages) {
              t.villages = t.villages.filter((v: any) => v.id !== id);
            }
          }
        }
      }
      saveLocations(states);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete" }, { status: 500 });
  }
}
