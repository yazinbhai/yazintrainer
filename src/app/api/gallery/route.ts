import { NextResponse } from "next/server";
import { writeFile, mkdir, readFile, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { kv } from "@vercel/kv";
import { put, del } from "@vercel/blob";

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
    url: "https://assets.mixkit.co/videos/preview/mixkit-man-holding-a-speech-at-a-business-conference-34281-large.mp4",
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
    url: "https://assets.mixkit.co/videos/preview/mixkit-business-team-in-a-meeting-around-a-table-41712-large.mp4",
    date: "January 18, 2026",
  }
];

const getGalleryJsonPath = () => {
  return path.join(process.cwd(), "public", "uploads", "gallery.json");
};

// Check if Vercel KV is configured
const isKvConfigured = () => {
  return !!process.env.KV_REST_API_URL || !!process.env.KV_URL;
};

// Check if Vercel Blob is configured
const isBlobConfigured = () => {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
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
      // Local fallback
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

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string || "Untitled Media";
    const type = formData.get("type") as string || "photo";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${Date.now()}-${safeName}`;
    let fileUrl = "";

    // 1. Save file (to Blob or local filesystem)
    if (isBlobConfigured()) {
      const blob = await put(`uploads/${filename}`, file, {
        access: "public",
        addRandomSuffix: false,
      });
      fileUrl = blob.url;
    } else {
      // Local fallback
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);
      fileUrl = `/uploads/${filename}`;
    }

    const newItem = {
      id: Date.now().toString(),
      title,
      type,
      url: fileUrl,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    // 2. Save items database (to KV or local JSON file)
    if (isKvConfigured()) {
      let items = await kv.get<any[]>("gallery_items");
      if (!items) {
        items = [...DEFAULT_ITEMS];
      }
      items.unshift(newItem);
      await kv.set("gallery_items", items);
    } else {
      // Local fallback
      const jsonPath = getGalleryJsonPath();
      let items = [...DEFAULT_ITEMS];

      if (existsSync(jsonPath)) {
        const fileContent = await readFile(jsonPath, "utf-8");
        try {
          items = JSON.parse(fileContent);
        } catch (e) {
          // fallback to default items
        }
      }

      items.unshift(newItem);
      await writeFile(jsonPath, JSON.stringify(items, null, 2), "utf-8");
    }

    return NextResponse.json({ success: true, item: newItem });
  } catch (error: any) {
    console.error("POST upload error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
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
    let itemToDelete: any = null;

    // 1. Retrieve the list of items
    if (isKvConfigured()) {
      items = await kv.get<any[]>("gallery_items") || [];
    } else {
      // Local fallback
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

    itemToDelete = items.find((item: any) => item.id === id);
    if (!itemToDelete) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // 2. Delete the file (from Blob or local filesystem)
    if (itemToDelete.url.startsWith("https://") && isBlobConfigured()) {
      // Vercel Blob file deletion
      await del(itemToDelete.url).catch((err) => {
        console.warn("Failed to delete blob file:", err);
      });
    } else if (itemToDelete.url.startsWith("/uploads/")) {
      // Local file deletion
      const filePath = path.join(process.cwd(), "public", itemToDelete.url);
      if (existsSync(filePath)) {
        await unlink(filePath).catch((err) => {
          console.warn("Failed to delete local file:", err);
        });
      }
    }

    // 3. Update the database
    const updatedItems = items.filter((item: any) => item.id !== id);

    if (isKvConfigured()) {
      await kv.set("gallery_items", updatedItems);
    } else {
      // Local fallback
      const jsonPath = getGalleryJsonPath();
      const uploadDir = path.dirname(jsonPath);
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }
      await writeFile(jsonPath, JSON.stringify(updatedItems, null, 2), "utf-8");
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE media error:", error);
    return NextResponse.json({ error: error.message || "Delete failed" }, { status: 500 });
  }
}
