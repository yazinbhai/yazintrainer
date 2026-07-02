import { NextResponse } from "next/server";
import { writeFile, mkdir, readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { createClient } from "@vercel/kv";

const DEFAULT_ITEMS = [
  {
    id: "1782964038063",
    title: "Malabar Polytechnic",
    type: "video",
    url: "https://www.youtube.com/shorts/-TkwxfPlF-4?feature=share",
    date: "July 2, 2026",
  },
  {
    id: "1782563377397",
    title: "Review from Centre for Advanced Managemt Studies",
    type: "video",
    url: "https://youtube.com/shorts/0T1j7941PF8?feature=share",
    date: "June 27, 2026",
  }
];

const getGalleryJsonPath = () => {
  return path.join(process.cwd(), "public", "uploads", "gallery.json");
};

// Dynamic KV client initialization supporting Vercel KV and Upstash Redis integrations
const getKvClient = () => {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.KV_URL || process.env.REDIS_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    return createClient({ url, token });
  }
  return null;
};

export async function GET() {
  try {
    const kvClient = getKvClient();
    if (kvClient) {
      let items = await kvClient.get<any[]>("gallery_items");
      if (!items) {
        const jsonPath = getGalleryJsonPath();
        if (existsSync(jsonPath)) {
          try {
            const fileContent = await readFile(jsonPath, "utf-8");
            items = JSON.parse(fileContent);
          } catch (e) {
            items = DEFAULT_ITEMS;
          }
        } else {
          items = DEFAULT_ITEMS;
        }
        await kvClient.set("gallery_items", items);
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

    const kvClient = getKvClient();

    if (kvClient) {
      let items = await kvClient.get<any[]>("gallery_items");
      if (!items) {
        items = [...DEFAULT_ITEMS];
      }
      items.unshift(newItem);
      await kvClient.set("gallery_items", items);
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
    const kvClient = getKvClient();

    if (kvClient) {
      items = await kvClient.get<any[]>("gallery_items") || [];
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

    if (kvClient) {
      await kvClient.set("gallery_items", updatedItems);
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
