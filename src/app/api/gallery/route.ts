import { NextResponse } from "next/server";
import { writeFile, mkdir, readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { kv } from "@vercel/kv";

const DEFAULT_ITEMS = [
  {
    id: "default-1",
    title: "Executive Presence & Public Speaking Coaching",
    type: "photo",
    url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200",
    date: "May 10, 2026",
  },
  {
    id: "default-2",
    title: "Interactive Corporate Communication Workshop",
    type: "photo",
    url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200",
    date: "April 28, 2026",
  },
  {
    id: "default-3",
    title: "Speaking Keynote: The Art of Influence",
    type: "video",
    url: "https://www.youtube.com/watch?v=eIho2S0ZahI",
    date: "March 15, 2026",
  },
  {
    id: "default-4",
    title: "Strategic Communication Training Session",
    type: "photo",
    url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1200",
    date: "February 22, 2026",
  },
  {
    id: "default-5",
    title: "High-Stakes Presentation Coaching Video",
    type: "video",
    url: "https://www.youtube.com/watch?v=w82a1FT5o88",
    date: "January 18, 2026",
  }
];

const getGalleryJsonPath = () => {
  return path.join(process.cwd(), "public", "uploads", "gallery.json");
};

const isKvConfigured = () => {
  return !!process.env.KV_REST_API_URL || !!process.env.KV_URL;
};

export async function GET() {
  try {
    if (isKvConfigured()) {
      let items = await kv.get<any[]>("gallery_items");
      if (!items) {
        items = DEFAULT_ITEMS;
        await kv.set("gallery_items", items);
      }
      return NextResponse.json(items);
    } else {
      const jsonPath = getGalleryJsonPath();
      if (!existsSync(jsonPath)) {
        return NextResponse.json(DEFAULT_ITEMS);
      }
      const fileContent = await readFile(jsonPath, "utf-8");
      return NextResponse.json(JSON.parse(fileContent));
    }
  } catch (error: any) {
    console.error("GET gallery error:", error);
    return NextResponse.json({ error: "Failed to read gallery items" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const password = req.headers.get("x-admin-password");
    if (password !== (process.env.ADMIN_PASSWORD || "2501261986")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, type, url } = await req.json();

    if (!title || !type || !url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newItem = {
      id: Date.now().toString(),
      title,
      type,
      url,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    if (isKvConfigured()) {
      let items = await kv.get<any[]>("gallery_items");
      if (!items) {
        items = [...DEFAULT_ITEMS];
      }
      items.unshift(newItem);
      await kv.set("gallery_items", items);
    } else {
      const jsonPath = getGalleryJsonPath();
      let items = [...DEFAULT_ITEMS];

      if (existsSync(jsonPath)) {
        const fileContent = await readFile(jsonPath, "utf-8");
        try {
          items = JSON.parse(fileContent);
        } catch (e) {
          // ignore
        }
      }

      items.unshift(newItem);
      const uploadDir = path.dirname(jsonPath);
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }
      await writeFile(jsonPath, JSON.stringify(items, null, 2), "utf-8");
    }

    return NextResponse.json({ success: true, item: newItem });
  } catch (error: any) {
    console.error("POST link error:", error);
    return NextResponse.json({ error: error.message || "Failed to save link" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const password = req.headers.get("x-admin-password");
    if (password !== (process.env.ADMIN_PASSWORD || "2501261986")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    let items: any[] = [];

    if (isKvConfigured()) {
      items = await kv.get<any[]>("gallery_items") || [];
    } else {
      const jsonPath = getGalleryJsonPath();
      if (existsSync(jsonPath)) {
        const fileContent = await readFile(jsonPath, "utf-8");
        try {
          items = JSON.parse(fileContent);
        } catch (e) {
          items = [...DEFAULT_ITEMS];
        }
      } else {
        items = [...DEFAULT_ITEMS];
      }
    }

    const exists = items.some((item: any) => item.id === id);
    if (!exists) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const updatedItems = items.filter((item: any) => item.id !== id);

    if (isKvConfigured()) {
      await kv.set("gallery_items", updatedItems);
    } else {
      const jsonPath = getGalleryJsonPath();
      await writeFile(jsonPath, JSON.stringify(updatedItems, null, 2), "utf-8");
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE media error:", error);
    return NextResponse.json({ error: error.message || "Delete failed" }, { status: 500 });
  }
}
